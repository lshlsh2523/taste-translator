import type { AdjacentTasteCard, MatchedTerm, TasteTermCard } from "@/types/taste";

// TF-IDF 스타일 인접 취향 탐색: 라이브러리 전체에서 흔한 키워드("캐주얼"
// 같은)는 가중치를 낮추고, 희귀한 키워드는 가중치를 높여서 계산한다.
// 실패한 matched_terms 전부와 매칭 키워드가 겹치는 다른 취향 용어를
// 최대 3개 찾는다.
export function findAdjacentTerms(
  failedTerms: MatchedTerm[],
  library: TasteTermCard[],
  limit: number = 3,
): AdjacentTasteCard[] {
  const failedTermNames = new Set(failedTerms.map((t) => t.term));
  const targetKeywords = new Set(failedTerms.flatMap((t) => t.matching_keywords));

  const df = new Map<string, number>();
  for (const card of library) {
    for (const kw of new Set(card.matching_keywords)) {
      df.set(kw, (df.get(kw) ?? 0) + 1);
    }
  }
  const N = library.length;
  const idf = (keyword: string) => Math.log(N / (df.get(keyword) ?? 1));

  const scored = library
    .filter((card) => !failedTermNames.has(card.term))
    .map((card) => {
      const shared = card.matching_keywords.filter((kw) => targetKeywords.has(kw));
      const score = shared.reduce((sum, kw) => sum + idf(kw), 0);
      return { card, shared, score };
    })
    .filter((s) => s.shared.length > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ card, shared }) => ({
    term: card.term,
    trust_level: card.trust_level,
    matching_keywords: card.matching_keywords,
    shared_keywords: shared,
  }));
}
