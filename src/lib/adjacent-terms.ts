import type { AdjacentTasteCard, MatchedTerm, TasteTermCard } from "@/types/taste";

// TF-IDF 스타일 인접 취향 탐색: 라이브러리 전체에서 흔한 럭셔리 용어
// (예: 레더, 백팩)는 가중치를 낮추고, 희귀한 용어(예: 립스탑, 엠보스드)는
// 가중치를 높여서 계산한다. 실패한 matched_terms 전부와 연결 럭셔리
// 용어(형태+소재)가 겹치는 다른 취향 용어를 최대 3개 찾는다.
//
// v1은 취향 카드의 자유 텍스트 매칭 키워드(색상/무드 단어)로 겹침을
// 계산했지만, 그 필드를 없애고 형태/소재 럭셔리 용어 연결로 대체했다
// (src/data/taste-library.ts 참고) — 오히려 실제 제품 매칭 신호와
// 직결되는 지표라 더 의미 있는 인접성 계산이 됐다.
function linkedTerms(term: TasteTermCard): string[] {
  return [...term.linked_luxury_terms, ...(term.raw_material_keywords ?? [])];
}

export function findAdjacentTerms(
  failedTerms: MatchedTerm[],
  library: TasteTermCard[],
  limit: number = 3,
): AdjacentTasteCard[] {
  const failedTermNames = new Set(failedTerms.map((t) => t.term));
  const failedCards = library.filter((card) => failedTermNames.has(card.term));
  const targetLuxuryTerms = new Set(failedCards.flatMap(linkedTerms));

  const df = new Map<string, number>();
  for (const card of library) {
    for (const lt of new Set(linkedTerms(card))) {
      df.set(lt, (df.get(lt) ?? 0) + 1);
    }
  }
  const N = library.length;
  const idf = (luxuryTerm: string) => Math.log(N / (df.get(luxuryTerm) ?? 1));

  const scored = library
    .filter((card) => !failedTermNames.has(card.term))
    .map((card) => {
      const shared = linkedTerms(card).filter((lt) => targetLuxuryTerms.has(lt));
      const score = shared.reduce((sum, lt) => sum + idf(lt), 0);
      return { card, shared, score };
    })
    .filter((s) => s.shared.length > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ card, shared }) => ({
    term: card.term,
    trust_level: card.trust_level,
    linked_luxury_terms: card.linked_luxury_terms,
    shared_luxury_terms: shared,
  }));
}
