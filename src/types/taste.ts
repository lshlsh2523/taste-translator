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
  // 한 줄 요약 유래 — "이런 무드도 감지했어요"/인접 취향 카드 등 보조
  // 노출 전용. 메인으로 선정된 취향 용어 화면에는 아래 history/description을
  // 대신 쓴다(있으면).
  origin: string;
  // 아래 둘은 메인으로 선정된 취향 용어 화면 전용 — 유래(역사, 여러 문장)와
  // 특징(정의)을 분리해서 라벨 달아 보여주기 위함. 웹 검색으로 검증한
  // 사실만 쓰고, 아직 전체 54개를 다 채우지 못해서 optional — 없으면
  // 화면에서 origin(한 줄 요약)으로 대체.
  history?: string;
  description?: string;
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
  // 검색마다 모델이 그때그때 고르는 "무드" 색(6자리 헥스)·이모지. 라이브러리
  // 고정값이 아니라 이번 입력에 대한 감성 스냅샷이라 매번 달라질 수 있다.
  mood_color?: string;
  mood_emoji?: string;
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
  // 정렬 전용 — total_score 계산에는 포함 안 됨 (카탈로그에 색상
  // 메타데이터가 없어서 별도 처리). 사용자가 색을 언급 안 했으면 true.
  color_match: boolean;
  color_reason: string;
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
  origin: string; // 이 취향 용어 자체의 뜻/유래 (라이브러리 고정값)
  linked_luxury_terms: string[];
  shared_luxury_terms: string[]; // 실패한 matched_terms와 겹치는 럭셔리 용어(형태/소재)
};

export type TranslateSuccess = {
  status: "success";
  query: string;
  matchedTerm: MatchedTerm;
  // matchedTerm.reason은 "이번 입력이 왜 이 용어에 연결되는지"에 대한
  // 1단계의 판단 근거(요청마다 달라짐). origin(용어 자체의 한 줄 요약
  // 유래, 라이브러리 고정값)은 따로 내려줘야 화면에서 이 둘을 구분해서
  // 보여줄 수 있다 — allMatchedTerms에 있는 다른 취향들("이런 무드도
  // 감지했어요" 카드)도 각자 필요해서, term 이름 -> origin 맵으로 한
  // 번에 내려준다(allMatchedTerms 전체 커버).
  matchedTermOrigins: Record<string, string>;
  // 메인으로 선정된 matchedTerm 전용 상세 유래/특징 — 라이브러리 카드에
  // history/description이 있을 때만 채워짐(둘 다 optional).
  matchedTermHistory?: string;
  matchedTermCharacteristics?: string;
  usedFallbackRank: number; // 0 = 1순위에서 성공, 1 = 2순위, ...
  // 취향 카드 하나가 형태·소재 럭셔리 용어 여러 개에 연결될 수 있어서
  // (예: 록 패션 -> 메신저 백/벨트백(형태) + 스터드/체인(소재)), 대표
  // 하나만 고르지 않고 연결된 것 전부 내려준다.
  luxuryTerms: LuxuryTermCard[];
  products: EnrichedRecommendedProduct[];
  allMatchedTerms: MatchedTerm[];
  // 이번 검색의 "무드" 색·이모지 — 1단계가 그때그때 고른 값(라이브러리
  // 고정값 아님). retryWithTerm처럼 1단계를 다시 안 부르는 경로에서는
  // 없을 수 있어 optional — 화면에서는 없으면 기본 액센트 색으로 대체.
  moodColor?: string;
  moodEmoji?: string;
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
