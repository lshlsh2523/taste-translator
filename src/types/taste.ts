// 파이프라인 전체에서 공유하는 타입. 필드명은 확정 프롬프트의 출력
// JSON 스키마(1단계/2단계)를 그대로 따른다 — 프롬프트를 바꾸지 않는 한
// 이 타입도 바꾸지 않는다.

export type TrustLevel = "학술 용어" | "비평 용어" | "통용어";

// 취향 용어 카드 (라이브러리 항목). "예시 형태"·"소재 신호"는 이 카드에
// 직접 저장하지 않고, linked_luxury_terms로 연결된 럭셔리 용어 카드의
// mcm_subcategory/material_keywords를 통해 매번 파생시킨다
// (resolveShapeSignals/resolveMaterialSignals 참고) — 취향 카드와
// 형태·소재 데이터의 출처를 분리해 한쪽만 갱신해도 어긋나지 않게 하기
// 위함.
//
// 1단계 프롬프트의 출력 스키마(MatchedTerm.matching_keywords)는 모델이
// 사용자 입력을 보고 그때그때 만들어내는 값이라, 여기 라이브러리 카드에는
// 고정된 매칭 키워드를 따로 두지 않는다 — 대신 유래(origin) 텍스트 자체를
// 풍부하게 써서 모델이 참고할 맥락을 준다.
export type TasteTermCard = {
  term: string; // 용어명 (영문 포함), 예: "Y2K", "꾸안꾸" (영문 대응 없음)
  trust_level: TrustLevel;
  origin: string; // 유래
  linked_luxury_terms: string[]; // 연결된 럭셔리 용어 카드의 term (정확히 일치) — 형태 먼저, 소재/기법 나중 순서
  // 유래 설명이 필요 없는 일반 원재료명(레더/나일론/코튼/데님/실크)은
  // 별도 카드를 안 만들고 여기에 직접 적어서 카탈로그 material_keywords와
  // 바로 문자열 매칭한다.
  raw_material_keywords?: string[];
};

// 럭셔리 전문 용어 카드 — 형태 11개(MCM 실제 스타일 필터) + 소재·기법
// 14개(유래가 검증 가능한 것만 카드화) = 25개.
export type LuxuryTermCard = {
  term: string; // 예: "사첼 백 (Satchel)", "스터드"
  origin: string;
  kind: "shape" | "material"; // 형태 카드인지 소재·기법 카드인지
  matching_mood?: string[];
  // kind: "shape"일 때만 채움. MCM 카탈로그 subcategory 값과 매칭.
  // 카드 하나가 여러 subcategory에 걸치는 경우가 있어 배열.
  // MCM 사이트의 "스타일 필터" 명칭 기준이라, 카탈로그 스크래핑
  // breadcrumb 기반 subcategory와 표기가 정확히 안 맞는 카드도 있음
  // (예: 미니백) — 이건 원본 데이터 그대로이고, 2단계 형태 신호는
  // 참고 신호(+1점)일 뿐 하드 필터가 아니므로 억지로 맞추지 않는다.
  mcm_subcategory?: string[];
  // kind: "material"일 때만 채움. 카탈로그 material_keywords와 매칭
  // (scripts/build-catalog.mjs의 추출 결과와 표기를 맞춤).
  material_keywords?: string[];
};

export type TasteLibrary = {
  tasteTerms: TasteTermCard[];
  luxuryTerms: LuxuryTermCard[];
};

// --- 1단계: 취향 매칭 ---

export type MatchedTerm = {
  term: string;
  trust_level: TrustLevel;
  reason: string;
  matching_keywords: string[];
  confidence: number; // 0.0 ~ 1.0
};

export type SuggestedNewTerm = {
  description: string;
};

export type Stage1Result = {
  matched_terms: MatchedTerm[];
  no_clear_match: boolean;
  fallback_note?: string;
  suggested_new_term?: SuggestedNewTerm | null;
};

// --- 카탈로그 / 2단계: 제품 매칭 ---

export type CandidateProduct = {
  name: string;
  department: string;
  category: string;
  subcategory: string; // "(전체)"면 형태 세분류 없음 (예외 규칙 적용 대상)
  material_keywords: string[];
  image: string;
  product_url: string;
  primary_sku: string;
  num_colors: number;
};

export type MatchBreakdown = {
  shape_match: boolean;
  material_match: string[];
  visual_match_score: number; // 0~3
  visual_match_reason: string;
};

export type RecommendedProduct = {
  product_name: string;
  total_score: number;
  match_summary: string;
  match_breakdown: MatchBreakdown;
};

export type Stage2Result = {
  no_product_match: boolean;
  recommended_products: RecommendedProduct[];
};

// 2단계 프롬프트 출력(product_name, score 등)에는 이미지/링크가 없다 —
// 프롬프트에 candidate_products로 이미 넘겨준 정보라 모델이 다시 만들어낼
// 필요가 없기 때문. 결과 카드에 이미지·실제 상품 링크가 필요하므로,
// 오케스트레이션 단계에서 product_name으로 원본 CandidateProduct를 찾아
// 이 필드들을 덧붙인다(지어내지 않음 — 카탈로그에 이미 있던 값 그대로).
export type EnrichedRecommendedProduct = RecommendedProduct & {
  image: string;
  product_url: string;
  primary_sku: string;
};

// --- 오케스트레이션 결과 (프론트에 내려주는 최종 응답) ---

export type AdjacentTasteCard = {
  term: string;
  trust_level: TrustLevel;
  linked_luxury_terms: string[];
  shared_luxury_terms: string[]; // 실패한 matched_terms와 겹치는 럭셔리 용어(형태/소재)
};

export type TranslateSuccess = {
  status: "success";
  query: string;
  matchedTerm: MatchedTerm;
  usedFallbackRank: number; // 0 = 1순위에서 성공, 1 = 2순위, ...
  luxuryTerm: LuxuryTermCard | null;
  products: EnrichedRecommendedProduct[];
  allMatchedTerms: MatchedTerm[];
};

export type TranslateAdjacentFallback = {
  status: "adjacent_fallback";
  query: string;
  allMatchedTerms: MatchedTerm[];
  adjacentTerms: AdjacentTasteCard[];
};

export type TranslateNoMatch = {
  status: "no_match";
  query: string;
  reason: string;
};

export type TranslateResponse =
  | TranslateSuccess
  | TranslateAdjacentFallback
  | TranslateNoMatch;
