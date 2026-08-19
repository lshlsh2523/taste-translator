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
import {
  findTasteTermCardLoose,
  resolveLinkedLuxuryTerms,
  resolveMaterialSignals,
} from "@/data/taste-library";
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
      max_score: candidate.subcategory === NO_SHAPE_SUBCATEGORY ? 5 : 6,
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

// build-catalog.mjs의 NO_SHAPE_SUBCATEGORY와 동일한 값 — 형태 세분류가
// 아예 없는 카테고리(테크액세서리 등)의 subcategory 표기.
const NO_SHAPE_SUBCATEGORY = "(전체)";

// 정식 매칭 임계값 — 2단계 프롬프트는 이제 채점만 하고 통과 여부는
// 안 가른다(예전엔 모델이 임계값 미만 후보를 프롬프트 안에서 통째로
// 버렸는데, 그러면 "취향은 맞는데 점수가 아쉬운 상품"이라는 정보 자체가
// 사라져서 "이런 무드도 감지했어요" 카드를 눌렀을 때 아무 근거 없이
// 실패 화면만 뜨는 문제가 있었다). 코드가 직접 점수를 보고 판단한다.
function clearsThreshold(rec: RecommendedProduct, candidate: CandidateProduct): boolean {
  const threshold = candidate.subcategory === NO_SHAPE_SUBCATEGORY ? 2.5 : 3;
  return rec.total_score >= threshold;
}

type MatchOutcome =
  | { outcome: "matched"; products: EnrichedRecommendedProduct[] }
  // 임계값을 넘긴 상품은 없지만 채점 자체는 됐고, 점수가 가장 높았던
  // 1~2개는 있다 — "정확힌 아니지만 그나마 가까운 상품"으로 보여줄 수 있음.
  | { outcome: "below_threshold"; products: EnrichedRecommendedProduct[] }
  // 후보 자체가 없거나(candidates.length === 0), 2단계가 채점 결과를
  // 하나도 못 냈다(이미지 전부 실패 등) — 보여줄 게 아무것도 없는 경우.
  | { outcome: "no_candidates" };

async function tryMatchedTerm(
  matchedTerm: MatchedTerm,
  library: TasteLibrary,
  originalQuery?: string,
): Promise<MatchOutcome> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === matchedTerm.term);
  if (!tasteTermCard) return { outcome: "no_candidates" };

  // matchedTerm.matching_keywords는 1단계 모델이 이번 사용자 입력을 보고
  // 그때그때 만들어낸 값(확정 프롬프트 출력 스키마) — 후보를 좁힐 때도
  // 정적 라이브러리 값 대신 이 동적 키워드를 우선 신호로 쓴다.
  const candidates = getCandidateProducts(tasteTermCard, matchedTerm.matching_keywords, library);
  if (candidates.length === 0) return { outcome: "no_candidates" };
  const byName = new Map(candidates.map((c) => [normalize(c.name), c]));

  for (let attempt = 0; attempt <= STAGE2_RETRIES; attempt++) {
    const stage2Result = await callStage2(matchedTerm, library, candidates, originalQuery);
    if (stage2Result.recommended_products.length === 0) continue;

    const passing = stage2Result.recommended_products.filter((rec) => {
      const candidate = byName.get(normalize(rec.product_name));
      return candidate ? clearsThreshold(rec, candidate) : false;
    });
    if (passing.length > 0) {
      const products = enrichProducts(passing, candidates);
      if (products.length > 0) return { outcome: "matched", products };
    }

    // 임계값을 넘긴 게 없으면, 점수 순 상위 2개를 "낮은 일치도" 후보로
    // 대신 챙겨둔다 — 이번 시도에서 아예 못 건진 건 아니니 재시도는 안
    // 하고 바로 반환한다(재시도해도 이 판단 자체가 크게 바뀔 여지는 적음).
    const top = enrichProducts(stage2Result.recommended_products, candidates)
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 2);
    if (top.length > 0) return { outcome: "below_threshold", products: top };
  }

  return { outcome: "no_candidates" };
}

// 1단계가 돌려준 term 문자열을 라이브러리의 정확한 표기로 맞춘다(느슨한
// 매칭 — findTasteTermCardLoose 참고). 라이브러리 어떤 카드에도 못
// 맞추면(오타가 너무 심하거나 정말 라이브러리에 없는 용어를 지어낸
// 경우) 그 항목은 버린다 — 못 찾은 카드를 억지로 쓰기보다, 존재하는
// 취향 용어로 정직하게 좁히는 쪽을 택한다. 이후 파이프라인 전체가 이
// 정규화된 term 문자열만 다루므로, 뒤에서 또 완전 일치를 걱정할 필요가
// 없다.
function normalizeMatchedTerms(terms: MatchedTerm[], library: TasteLibrary): MatchedTerm[] {
  const normalized: MatchedTerm[] = [];
  for (const t of terms) {
    const card = findTasteTermCardLoose(t.term, library);
    if (card) normalized.push({ ...t, term: card.term });
  }
  return normalized;
}

export async function orchestrateTranslate(
  query: string,
  library: TasteLibrary,
): Promise<TranslateResponse> {
  const stage1Result = await callStage1(query, library);
  const matchedTerms = normalizeMatchedTerms(stage1Result.matched_terms, library);

  if (matchedTerms.length === 0) {
    return {
      status: "no_match",
      query,
      reason: stage1Result.fallback_note ?? "라이브러리에서 명확히 맞는 취향 용어를 찾지 못했어요.",
    };
  }

  const sortedTerms = [...matchedTerms].sort((a, b) => b.confidence - a.confidence);
  const termsToTry = sortedTerms.slice(0, MAX_TERMS_TO_TRY);

  for (let i = 0; i < termsToTry.length; i++) {
    const matchedTerm = sortedTerms[i];
    const result = await tryMatchedTerm(matchedTerm, library, query);
    // 원 검색(1순위/2순위 시도)에서는 기존처럼 정식으로 임계값을 넘긴
    // 경우("matched")만 성공으로 치고, 그 외("below_threshold" 포함)는
    // 다음 순위 용어를 마저 시도하거나 인접 취향 폴백으로 넘어간다 —
    // "낮은 일치도 후보 보여주기"는 아래 retryWithTerm(카드 재검색)
    // 경로에서만 쓴다.
    if (result.outcome === "matched") {
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
      moodColor: sanitizeMoodColor(stage1Result.mood_color),
      moodEmoji: stage1Result.mood_emoji,
    };
  }

  return {
    status: "no_match",
    query,
    reason: "죄송해요, 지금 라이브러리로는 이 취향에 맞는 제품을 찾기 어려워요.",
  };
}

// 카드 클릭 시: 그 취향 용어로 2단계부터 다시 실행 (1단계 재실행 없음).
// 성공/실패 결과만 반환하고, 실패 시 또 다른 인접 취향 폴백으로 이어가지
// 않는다 — 이미 인접 취향 폴백 단계에 있으므로 여기서 또 실패하면 사용자가
// 다른 카드를 고르게 하는 게 UX상 맞다(설계 문서 4-3 참고).
//
// knownMatch: "이런 무드도 감지했어요" 카드처럼, 원래 검색의 1단계가 이미
// 이 용어를 채점해둔 적이 있으면(진짜 reason/confidence 보유) 그대로
// 넘겨받는다 — 다시 지어내지 않고 그 값을 그대로 쓴다. "인접 취향" 카드처럼
// 1단계가 애초에 이 용어를 본 적 없는 경로는 knownMatch가 없어서, 2단계
// 호출에 필요한 최소한의 값(신뢰 등급/소재 키워드)만 합성하고
// matchedTermIsSynthetic: true로 표시해 화면이 가짜 근거를 안 보여주게 한다.
//
// knownMoodColor/knownMoodEmoji: 같은 이유로, 원래 검색의 1단계가 이미
// 뽑아둔 무드 색/이모지를 재사용한다 — "이런 무드도 감지했어요" 카드는
// 같은 1단계 호출에서 나온 형제 용어라 원래 무드를 그대로 써도 자연스럽고,
// 이걸 위해 1단계를 다시 부를 필요가 없다(2단계 스키마에 mood 필드가
// 없어서 어차피 새로 뽑을 수도 없다).
export async function retryWithTerm(
  termName: string,
  library: TasteLibrary,
  originalQuery?: string,
  knownMatch?: MatchedTerm,
  knownMoodColor?: string,
  knownMoodEmoji?: string,
): Promise<TranslateResponse> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === termName);
  if (!tasteTermCard) {
    return { status: "no_match", query: termName, reason: "라이브러리에 없는 취향 용어입니다." };
  }

  const isSynthetic = !knownMatch || knownMatch.term !== termName;
  const matchedTerm: MatchedTerm = isSynthetic
    ? {
        term: tasteTermCard.term,
        trust_level: tasteTermCard.trust_level,
        reason: "",
        matching_keywords: resolveMaterialSignals(tasteTermCard, library),
        confidence: 0,
      }
    : knownMatch;

  const result = await tryMatchedTerm(matchedTerm, library, originalQuery);
  // "matched"(정식 통과)든 "below_threshold"(정식 통과는 없지만 그나마
  // 가까운 상품 1~2개는 있음)든, 용어 자체는 확정된 것이니 유래/특징/
  // 패션 용어는 그대로 보여준다 — 예전에는 below_threshold에 해당하는
  // 경우를 no_match로 뭉뚱그려서 이 정보까지 통째로 날렸었다.
  if (result.outcome === "matched" || result.outcome === "below_threshold") {
    return {
      status: "success",
      query: termName,
      matchedTerm,
      matchedTermOrigins: { [tasteTermCard.term]: tasteTermCard.origin },
      matchedTermHistory: tasteTermCard.history,
      matchedTermCharacteristics: tasteTermCard.description,
      matchedTermIsSynthetic: isSynthetic,
      usedFallbackRank: 0,
      luxuryTerms: resolveLinkedLuxuryTerms(tasteTermCard, library),
      products: result.products,
      allMatchedTerms: [matchedTerm],
      moodColor: sanitizeMoodColor(knownMoodColor),
      moodEmoji: knownMoodEmoji,
      belowThreshold: result.outcome === "below_threshold",
    };
  }

  return {
    status: "no_match",
    query: termName,
    reason: "죄송해요, 이 취향에 맞는 제품도 지금 라이브러리에서는 찾기 어려워요.",
  };
}
