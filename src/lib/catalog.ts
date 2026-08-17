import catalogData from "@/data/catalog.json";
import { resolveMaterialSignals, resolveShapeSignals } from "@/data/taste-library";
import type { CandidateProduct, TasteLibrary, TasteTermCard } from "@/types/taste";

const catalog = catalogData as CandidateProduct[];

// 2단계 프롬프트는 "candidate_products 후보 목록"을 입력으로 받는다고만
// 되어 있고, 656개 카탈로그 전체를 매번 보낼지는 명시하지 않음 — 이미지를
// 매 요청마다 656장 보내는 건 비용/컨텍스트상 불가능하므로, 오케스트레이션
// 단계에서 후보를 좁힌다(프롬프트 로직이 아니라 순수 엔지니어링 결정).
//
// 좁히는 기준은 "예시 형태"(참고 신호)와 "소재 키워드" 둘 중 하나라도
// 겹치면 후보에 포함 — 형태를 하드 필터로 쓰지 않는다는 원칙과 일관되게,
// 최대한 넓게 잡은 뒤 겹침 개수로 정렬해 상위 N개만 취한다.
// 14장: 색상 정보가 카탈로그 메타데이터에 아예 없어서(제품명에서도 색
// 관련 단어가 거의 안 나옴) 후보를 형태·소재 키워드로만 8개까지 좁히면
// 특정 색(예: 핑크 계열) 제품이 후보에 아예 안 들어갈 확률이 높았음 —
// 그러면 2단계 모델이 이미지로 색을 판단하고 싶어도 볼 후보 자체가 없음.
// 후보 폭을 넓혀서 색 다양성을 확보 (비용/속도와의 트레이드오프).
const MAX_CANDIDATES_FOR_STAGE2 = 14;

// 소재 키워드는 두 군데서 온다: (1) 1단계 모델이 사용자 입력을 보고 그때
// 그때 만들어내는 matched_term.matching_keywords(동적, 확정 프롬프트의
// 출력 스키마), (2) 취향 카드에 연결된 소재·기법 럭셔리 용어 +
// raw_material_keywords(정적, resolveMaterialSignals). 서술형 표기
// ("스터드 장식")와 카탈로그 단일 표기("스터드") 차이는 부분 문자열
// 포함 관계로 흡수하고, "가죽"↔"레더"처럼 글자가 아예 다른 동의어는
// 별도 사전으로 보완한다.
const KEYWORD_SYNONYMS: Record<string, string[]> = {
  가죽: ["레더", "양가죽", "카프스킨"],
};

function keywordsOverlap(tasteKeyword: string, materialKeyword: string): boolean {
  if (tasteKeyword === materialKeyword) return true;
  if (tasteKeyword.includes(materialKeyword) || materialKeyword.includes(tasteKeyword)) return true;
  const synonyms = KEYWORD_SYNONYMS[tasteKeyword];
  return synonyms?.includes(materialKeyword) ?? false;
}

export function getCandidateProducts(
  term: TasteTermCard,
  dynamicKeywords: string[],
  library: TasteLibrary,
  limit: number = MAX_CANDIDATES_FOR_STAGE2,
): CandidateProduct[] {
  const exampleShapes = new Set(resolveShapeSignals(term, library));
  const keywords = [...dynamicKeywords, ...resolveMaterialSignals(term, library)];

  const scored = catalog.map((product) => {
    const shapeHit = exampleShapes.has(product.subcategory) ? 1 : 0;
    const keywordHits = product.material_keywords.filter((mk) =>
      keywords.some((tk) => keywordsOverlap(tk, mk)),
    ).length;
    return { product, relevance: shapeHit + keywordHits };
  });

  return scored
    .filter((s) => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map((s) => s.product);
}

export function getCatalogSize(): number {
  return catalog.length;
}
