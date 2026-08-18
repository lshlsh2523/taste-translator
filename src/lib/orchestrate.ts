// 오케스트레이션 로직 — 프롬프트가 아니라 1단계·2단계를 몇 번, 어떤
// 순서로 호출할지 정하는 실행 순서 (stage2_product_matching_prompt_3.md
// 하단 "인접 취향 폴백 절차" 그대로 구현).
//
// 1. 1단계 실행 → matched_terms (confidence 내림차순)
// 2. matched_terms를 순서대로 하나씩 2단계에 넣어 시도
//    → 임계값 이상 제품 있으면: 성공, 종료. 1순위가 아니면 안내 문구 추가
//    → 없으면: 다음 용어로
// 3. 전부 실패하면 인접 취향 폴백(매칭 키워드 겹치는 다른 취향 용어 최대 3개)
// 4. 그마저 없으면 정직하게 실패 인정

import { findAdjacentTerms } from "@/lib/adjacent-terms";
import { getCandidateProducts } from "@/lib/catalog";
import { callStage1, callStage2 } from "@/lib/stages";
import { resolveLinkedLuxuryTerms, resolveMaterialSignals } from "@/data/taste-library";
import type {
  CandidateProduct,
  EnrichedRecommendedProduct,
  MatchedTerm,
  RecommendedProduct,
  TasteLibrary,
  TranslateResponse,
} from "@/types/taste";

const normalize = (s: string) => s.trim().toLowerCase();

// 모델이 형식에 안 맞는 값(예: "red", "#ff0" 3자리)을 줄 수 있어 6자리
// 헥스코드인지만 확인한다 — 안 맞으면 undefined로 떨어뜨려 화면에서
// 기본 액센트 색으로 대체되게 한다(깨진 CSS 값이 그대로 안 들어가게).
function sanitizeMoodColor(color: string | undefined): string | undefined {
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : undefined;
}

function buildOriginMap(terms: MatchedTerm[], library: TasteLibrary): Record<string, string> {
  const map: Record<string, string> = {};
  for (const t of terms) {
    const card = library.tasteTerms.find((c) => c.term === t.term);
    if (card) map[t.term] = card.origin;
  }
  return map;
}

// 2단계 모델은 product_name만 돌려준다 — 이미지/실제 상품 링크는 우리가
// candidate_products로 이미 넘겨준 카탈로그 원본에서 그대로 붙여준다.
// product_name이 후보 목록의 어떤 이름과도 정확히 안 맞으면(모델이 이름을
// 살짝 바꿔 썼거나 하는 경우), 링크·이미지를 지어낼 수 없으니 그 항목은
// 결과에서 제외한다 — 없는 링크를 보여주는 것보다 낫다.
function enrichProducts(
  recommended: RecommendedProduct[],
  candidates: CandidateProduct[],
): EnrichedRecommendedProduct[] {
  const byName = new Map(candidates.map((c) => [normalize(c.name), c]));
  const enriched: EnrichedRecommendedProduct[] = [];
  for (const rec of recommended) {
    const candidate = byName.get(normalize(rec.product_name));
    if (!candidate) continue;
    enriched.push({
      ...rec,
      image: candidate.image,
      product_url: candidate.product_url,
      primary_sku: candidate.primary_sku,
    });
  }
  // 색상은 임계값 통과 여부(추천 대상인지)에는 영향을 안 주고, 이미
  // 통과한 제품들 사이에서 노출 순서에만 반영한다 — 색상 일치 제품을
  // 먼저 보여줘서 클릭을 유도(사용자 요청 사항). 동점이면 total_score로
  // 2차 정렬.
  return enriched.sort((a, b) => {
    const colorDiff = Number(b.match_breakdown.color_match) - Number(a.match_breakdown.color_match);
    if (colorDiff !== 0) return colorDiff;
    return b.total_score - a.total_score;
  });
}

// 2단계는 이미지를 직접 보고 채점하는 만큼, 같은 입력이어도 점수가
// 임계값 바로 근처에서 실행마다 조금씩 달라질 수 있다(실측: 같은 취향·
// 같은 후보로도 성공/실패가 갈리는 걸 확인함) — 원래는 이걸 보완하려고
// 재시도를 1번 넣었었다. 근데 무료 티어 하루 한도(20회)가 너무 빠듯해서
// (검색 1번이 최악의 경우 하루 치를 다 쓸 수 있었음, 실제로 겪음) 지금은
// 0으로 낮춰뒀다 — 안정성보다 할당량 절약이 급한 상황이라. 여유 생기면
// 다시 1로 올리는 걸 고려.
const STAGE2_RETRIES = 0;

// matched_terms는 1단계가 2~3개를 주지만, 실패할 때마다 순서대로 다
// 시도하면 그만큼 호출이 쌓인다. 최대 2개까지만 시도하고 그래도 안
// 되면 인접 취향 폴백으로 넘어간다 — 할당량 절약을 위한 조정.
const MAX_TERMS_TO_TRY = 2;

async function tryMatchedTerm(
  matchedTerm: MatchedTerm,
  library: TasteLibrary,
  originalQuery?: string,
): Promise<{ success: true; products: EnrichedRecommendedProduct[] } | { success: false }> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === matchedTerm.term);
  if (!tasteTermCard) return { success: false };

  // matchedTerm.matching_keywords는 1단계 모델이 이번 사용자 입력을 보고
  // 그때그때 만들어낸 값(확정 프롬프트 출력 스키마) — 후보를 좁힐 때도
  // 정적 라이브러리 값 대신 이 동적 키워드를 우선 신호로 쓴다.
  const candidates = getCandidateProducts(tasteTermCard, matchedTerm.matching_keywords, library);
  if (candidates.length === 0) return { success: false };

  for (let attempt = 0; attempt <= STAGE2_RETRIES; attempt++) {
    const stage2Result = await callStage2(matchedTerm, library, candidates, originalQuery);
    if (stage2Result.no_product_match || stage2Result.recommended_products.length === 0) {
      continue;
    }
    const products = enrichProducts(stage2Result.recommended_products, candidates);
    if (products.length > 0) return { success: true, products };
  }

  return { success: false };
}

export async function orchestrateTranslate(
  query: string,
  library: TasteLibrary,
): Promise<TranslateResponse> {
  const stage1Result = await callStage1(query, library);

  if (stage1Result.matched_terms.length === 0) {
    return {
      status: "no_match",
      query,
      reason: stage1Result.fallback_note ?? "라이브러리에서 명확히 맞는 취향 용어를 찾지 못했어요.",
    };
  }

  const sortedTerms = [...stage1Result.matched_terms].sort((a, b) => b.confidence - a.confidence);
  const termsToTry = sortedTerms.slice(0, MAX_TERMS_TO_TRY);

  for (let i = 0; i < termsToTry.length; i++) {
    const matchedTerm = sortedTerms[i];
    const result = await tryMatchedTerm(matchedTerm, library, query);
    if (result.success) {
      const tasteTermCard = library.tasteTerms.find((t) => t.term === matchedTerm.term) ?? null;
      return {
        status: "success",
        query,
        matchedTerm,
        matchedTermOrigins: buildOriginMap(sortedTerms, library),
        matchedTermHistory: tasteTermCard?.history,
        matchedTermCharacteristics: tasteTermCard?.description,
        usedFallbackRank: i,
        luxuryTerms: tasteTermCard ? resolveLinkedLuxuryTerms(tasteTermCard, library) : [],
        products: result.products,
        allMatchedTerms: sortedTerms,
        moodColor: sanitizeMoodColor(stage1Result.mood_color),
        moodEmoji: stage1Result.mood_emoji,
      };
    }
  }

  const adjacentTerms = findAdjacentTerms(sortedTerms, library.tasteTerms);
  if (adjacentTerms.length > 0) {
    return {
      status: "adjacent_fallback",
      query,
      allMatchedTerms: sortedTerms,
      adjacentTerms,
    };
  }

  return {
    status: "no_match",
    query,
    reason: "죄송해요, 지금 라이브러리로는 이 취향에 맞는 제품을 찾기 어려워요.",
  };
}

// 인접 취향 카드 클릭 시: 그 취향 용어로 2단계부터 다시 실행 (1단계 재실행
// 없음). 성공/실패 결과만 반환하고, 실패 시 또 다른 인접 취향 폴백으로
// 이어가지 않는다 — 이미 인접 취향 폴백 단계에 있으므로 여기서 또 실패하면
// 사용자가 다른 카드를 고르게 하는 게 UX상 맞다(설계 문서 4-3 참고).
export async function retryWithTerm(
  termName: string,
  library: TasteLibrary,
  originalQuery?: string,
): Promise<TranslateResponse> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === termName);
  if (!tasteTermCard) {
    return { status: "no_match", query: termName, reason: "라이브러리에 없는 취향 용어입니다." };
  }

  // 이 경로는 1단계 모델을 다시 부르지 않으므로 matching_keywords를
  // 동적으로 만들어낼 수 없다 — 취향 카드에 연결된 소재 신호로 대신한다.
  // originalQuery(직전 검색 원문)가 남아있으면 색상 신호 판단용으로
  // 2단계에 그대로 넘겨준다 — 없으면(순수 카드 클릭) 생략.
  const syntheticMatchedTerm: MatchedTerm = {
    term: tasteTermCard.term,
    trust_level: tasteTermCard.trust_level,
    reason: "인접 취향 카드에서 직접 선택됨",
    matching_keywords: resolveMaterialSignals(tasteTermCard, library),
    confidence: 1,
  };

  const result = await tryMatchedTerm(syntheticMatchedTerm, library, originalQuery);
  if (result.success) {
    return {
      status: "success",
      query: termName,
      matchedTerm: syntheticMatchedTerm,
      matchedTermOrigins: { [tasteTermCard.term]: tasteTermCard.origin },
      matchedTermHistory: tasteTermCard.history,
      matchedTermCharacteristics: tasteTermCard.description,
      usedFallbackRank: 0,
      luxuryTerms: resolveLinkedLuxuryTerms(tasteTermCard, library),
      products: result.products,
      allMatchedTerms: [syntheticMatchedTerm],
    };
  }

  return {
    status: "no_match",
    query: termName,
    reason: "죄송해요, 이 취향에 맞는 제품도 지금 라이브러리에서는 찾기 어려워요.",
  };
}
