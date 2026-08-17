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
import { pickRepresentativeLuxuryTerm } from "@/data/taste-library";
import type {
  CandidateProduct,
  EnrichedRecommendedProduct,
  MatchedTerm,
  TasteLibrary,
  TranslateResponse,
} from "@/types/taste";

const normalize = (s: string) => s.trim().toLowerCase();

// 2단계 모델은 product_name만 돌려준다 — 이미지/실제 상품 링크는 우리가
// candidate_products로 이미 넘겨준 카탈로그 원본에서 그대로 붙여준다.
// product_name이 후보 목록의 어떤 이름과도 정확히 안 맞으면(모델이 이름을
// 살짝 바꿔 썼거나 하는 경우), 링크·이미지를 지어낼 수 없으니 그 항목은
// 결과에서 제외한다 — 없는 링크를 보여주는 것보다 낫다.
function enrichProducts(
  recommended: { product_name: string }[],
  candidates: CandidateProduct[],
): EnrichedRecommendedProduct[] {
  const byName = new Map(candidates.map((c) => [normalize(c.name), c]));
  const enriched: EnrichedRecommendedProduct[] = [];
  for (const rec of recommended) {
    const candidate = byName.get(normalize(rec.product_name));
    if (!candidate) continue;
    enriched.push({
      ...(rec as EnrichedRecommendedProduct),
      image: candidate.image,
      product_url: candidate.product_url,
      primary_sku: candidate.primary_sku,
    });
  }
  return enriched;
}

// 2단계는 이미지를 직접 보고 채점하는 만큼, 같은 입력이어도 점수가
// 임계값 바로 근처에서 실행마다 조금씩 달라질 수 있다(실측: 같은 취향·
// 같은 후보로도 성공/실패가 갈리는 걸 확인함). 그래서 한 취향을 다음
// 순위로 넘기기 전에 한 번 더 재시도한다 — 진짜로 안 맞는 취향과, 채점
// 변동성 때문에 우연히 실패한 취향을 구분하기 위함.
const STAGE2_RETRIES = 1;

async function tryMatchedTerm(
  matchedTerm: MatchedTerm,
  library: TasteLibrary,
): Promise<{ success: true; products: EnrichedRecommendedProduct[] } | { success: false }> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === matchedTerm.term);
  if (!tasteTermCard) return { success: false };

  const candidates = getCandidateProducts(tasteTermCard, library);
  if (candidates.length === 0) return { success: false };

  for (let attempt = 0; attempt <= STAGE2_RETRIES; attempt++) {
    const stage2Result = await callStage2(matchedTerm, library, candidates);
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

  for (let i = 0; i < sortedTerms.length; i++) {
    const matchedTerm = sortedTerms[i];
    const result = await tryMatchedTerm(matchedTerm, library);
    if (result.success) {
      const tasteTermCard = library.tasteTerms.find((t) => t.term === matchedTerm.term) ?? null;
      return {
        status: "success",
        query,
        matchedTerm,
        usedFallbackRank: i,
        luxuryTerm: tasteTermCard ? pickRepresentativeLuxuryTerm(tasteTermCard, library) : null,
        products: result.products,
        allMatchedTerms: sortedTerms,
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
): Promise<TranslateResponse> {
  const tasteTermCard = library.tasteTerms.find((t) => t.term === termName);
  if (!tasteTermCard) {
    return { status: "no_match", query: termName, reason: "라이브러리에 없는 취향 용어입니다." };
  }

  const syntheticMatchedTerm: MatchedTerm = {
    term: tasteTermCard.term,
    trust_level: tasteTermCard.trust_level,
    reason: "인접 취향 카드에서 직접 선택됨",
    matching_keywords: tasteTermCard.matching_keywords,
    confidence: 1,
  };

  const result = await tryMatchedTerm(syntheticMatchedTerm, library);
  if (result.success) {
    return {
      status: "success",
      query: termName,
      matchedTerm: syntheticMatchedTerm,
      usedFallbackRank: 0,
      luxuryTerm: pickRepresentativeLuxuryTerm(tasteTermCard, library),
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
