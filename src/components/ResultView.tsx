"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  fetchTranslate,
  readStoredResult,
  runTermRetry,
  storeResult,
} from "@/lib/translate-client";
import type { TranslateResponse } from "@/types/taste";

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; query: string; response: TranslateResponse };

const RANK_LABELS = ["1순위", "2순위", "3순위", "4순위", "5순위"];

export function ResultView() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // sessionStorage는 브라우저에만 있어서, 초기 렌더에서 바로 읽으면
  // 서버가 그린 화면(항상 "로딩 중")과 브라우저가 그린 화면(저장된 결과
  // 있으면 바로 결과)이 달라져서 hydration 에러가 났다 — 초기 상태는
  // 서버·클라이언트 항상 똑같이 두고, sessionStorage 확인은 마운트 이후
  // effect 안에서만 한다.
  const [state, setState] = useState<ViewState>(() =>
    query ? { status: "loading" } : { status: "error", message: "검색어가 없어요." },
  );

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    // sessionStorage 확인도 fetch와 같은 비동기 흐름 안에 둔다 (effect
    // 본문에서 곧바로 setState하지 않도록 — react-hooks 린트 규칙).
    Promise.resolve()
      .then(() => readStoredResult(query))
      .then((stored) => {
        if (cancelled) return undefined;
        if (stored) {
          setState({ status: "loaded", query, response: stored });
          return undefined;
        }
        return fetchTranslate(query).then((response) => {
          if (cancelled) return;
          storeResult(query, response);
          setState({ status: "loaded", query, response });
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", message: "지금은 연결이 어려워요. 잠시 후 다시 시도해주세요." });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleAdjacentClick = async (term: string) => {
    // 직전 검색 원문이 남아있으면(예: 성공 결과에서 "이런 무드도
    // 감지했어요" 칩을 눌렀을 때) 색상 신호 판단용으로 같이 넘긴다.
    const previousQuery = state.status === "loaded" ? state.query : undefined;
    setState({ status: "loading" });
    try {
      const response = await runTermRetry(term, previousQuery);
      storeResult(term, response);
      setState({ status: "loaded", query: term, response });
    } catch {
      setState({ status: "error", message: "지금은 연결이 어려워요. 잠시 후 다시 시도해주세요." });
    }
  };

  // 일시적 에러(과부하 등) 재시도를 자동으로 하지 않기로 했으니(할당량
  // 아끼려고), 실패하면 사용자가 이 버튼으로 직접 같은 검색어를 다시
  // 보낸다 — /search로 돌아가서 다시 타이핑할 필요 없게 같은 query로
  // 바로 재요청.
  const handleRetry = () => {
    if (!query) return;
    setState({ status: "loading" });
    fetchTranslate(query)
      .then((response) => {
        storeResult(query, response);
        setState({ status: "loaded", query, response });
      })
      .catch(() => {
        setState({ status: "error", message: "지금은 연결이 어려워요. 잠시 후 다시 시도해주세요." });
      });
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[880px] flex-col px-6 pt-6 pb-16 sm:px-10 lg:px-16">
      <div>
        <Link
          href="/search"
          className="text-ink-soft hover:text-ink focus-visible:outline-ink inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span aria-hidden="true">←</span>
          다시 검색하기
        </Link>
      </div>

      <div className="mt-10 flex flex-1 flex-col">
        {state.status === "loading" && <LoadingState />}
        {state.status === "error" && (
          <ErrorState message={state.message} onRetry={query ? handleRetry : undefined} />
        )}
        {state.status === "loaded" && (
          <ResultBody
            query={state.query}
            response={state.response}
            onAdjacentClick={handleAdjacentClick}
          />
        )}
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <p className="text-ink-soft text-[1.0625rem]">취향을 다시 불러오는 중이에요</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-ink text-[1.0625rem]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          같은 검색어로 다시 시도
        </button>
      ) : (
        <Link
          href="/search"
          className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          다시 검색하기
        </Link>
      )}
    </div>
  );
}

function TrustBadge({ trustLevel }: { trustLevel: string }) {
  return (
    <span className="border-hairline text-ink-soft rounded-full border px-3 py-1 text-[0.75rem]">
      {trustLevel}
    </span>
  );
}

function ResultBody({
  query,
  response,
  onAdjacentClick,
}: {
  query: string;
  response: TranslateResponse;
  onAdjacentClick: (term: string) => void;
}) {
  return (
    <div>
      <p className="font-headline text-ink-soft max-w-[560px] text-[1.0625rem] italic leading-[1.6] sm:text-[1.1875rem]">
        &ldquo;{query}&rdquo;
      </p>

      {response.status === "success" && (
        <SuccessResult response={response} onAdjacentClick={onAdjacentClick} />
      )}
      {response.status === "adjacent_fallback" && (
        <AdjacentFallbackResult response={response} onAdjacentClick={onAdjacentClick} />
      )}
      {response.status === "no_match" && <NoMatchResult reason={response.reason} />}
    </div>
  );
}

function SuccessResult({
  response,
  onAdjacentClick,
}: {
  response: Extract<TranslateResponse, { status: "success" }>;
  onAdjacentClick: (term: string) => void;
}) {
  const { matchedTerm, luxuryTerm, products, usedFallbackRank, allMatchedTerms } = response;
  // 1단계가 "사랑스러운 무드의 단정한 분위기"처럼 서로 다른 무드를 여러
  // 취향으로 나눠 잡아도, 지금 화면엔 그중 하나(1순위로 성공한 것)만
  // 제품과 함께 보인다 — 나머지 취향은 사라지는 게 아니라 클릭 가능한
  // 카드로 남겨서, 사용자가 원하면 그 취향 기준으로 다시 찾아볼 수 있게.
  const otherMatchedTerms = allMatchedTerms.filter((t) => t.term !== matchedTerm.term);

  return (
    <div className="mt-10">
      {usedFallbackRank > 0 && (
        <p className="text-ink-faint mb-6 text-[0.875rem]">
          1순위 취향보다 {RANK_LABELS[usedFallbackRank] ?? `${usedFallbackRank + 1}순위`} 취향에 더
          잘 맞는 제품을 찾았어요
        </p>
      )}

      <div className="border-hairline border-t pt-8">
        <p className="text-[0.8125rem]">
          <span className="text-ink font-medium">취향 용어</span>
          <span className="text-ink-faint mx-2">·</span>
          <TrustBadge trustLevel={matchedTerm.trust_level} />
        </p>
        <h1 className="font-headline text-ink mt-2 text-[1.75rem] font-bold leading-[1.3] sm:text-[2rem]">
          {matchedTerm.term}
        </h1>
        <p className="text-ink-soft mt-3 max-w-[560px] text-[1rem] leading-[1.6]">
          {matchedTerm.reason}
        </p>
        {matchedTerm.matching_keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {matchedTerm.matching_keywords.map((kw) => (
              <span
                key={kw}
                className="border-hairline text-ink-soft rounded-full border px-3 py-1 text-[0.8125rem]"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {luxuryTerm && (
        <div className="border-hairline mt-8 border-t pt-8">
          <p className="text-ink-faint text-[0.75rem]">전문 용어</p>
          <p className="font-headline text-ink mt-1.5 text-[1.25rem] font-bold">{luxuryTerm.term}</p>
          <p className="text-ink-soft mt-2 max-w-[560px] text-[0.9375rem] leading-[1.6]">
            {luxuryTerm.origin}
          </p>
        </div>
      )}

      <div className="border-hairline mt-8 border-t pt-8">
        <p className="text-ink-faint text-[0.75rem]">
          제품 {products.length}개
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.product_name} product={product} />
          ))}
        </div>
      </div>

      {otherMatchedTerms.length > 0 && (
        <div className="border-hairline mt-8 border-t pt-8">
          <p className="text-ink-faint text-[0.75rem]">이런 무드도 감지했어요</p>
          <div className="mt-4 flex flex-col gap-3">
            {otherMatchedTerms.map((term) => (
              <button
                key={term.term}
                type="button"
                onClick={() => onAdjacentClick(term.term)}
                className="border-hairline hover:border-ink text-left transition-colors border p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <p className="text-ink font-headline text-[1rem] font-bold">{term.term}</p>
                <p className="text-ink-soft mt-1 text-[0.8125rem] leading-[1.5]">{term.reason}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: Extract<TranslateResponse, { status: "success" }>["products"][number];
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={product.product_url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-hairline hover:border-ink group block border p-4 transition-colors"
    >
      <div className="bg-hairline/30 relative aspect-square w-full overflow-hidden">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.product_name}
            fill
            sizes="(min-width: 640px) 340px, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="text-ink-faint flex h-full w-full items-center justify-center text-[0.75rem]">
            이미지를 불러올 수 없어요
          </div>
        )}
      </div>
      <p className="text-ink mt-3 text-[0.9375rem] font-medium leading-[1.4]">
        {product.product_name}
      </p>
      <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.5]">{product.match_summary}</p>
      <p className="text-ink-faint mt-2 text-[0.75rem]">{product.total_score.toFixed(1)}점</p>
    </a>
  );
}

function AdjacentFallbackResult({
  response,
  onAdjacentClick,
}: {
  response: Extract<TranslateResponse, { status: "adjacent_fallback" }>;
  onAdjacentClick: (term: string) => void;
}) {
  return (
    <div className="mt-10">
      <h1 className="font-headline text-ink text-[1.5rem] font-bold leading-[1.3] sm:text-[1.75rem]">
        정확히 맞는 제품은 없지만, 이런 취향은 어떠세요?
      </h1>
      <div className="mt-6 flex flex-col gap-3">
        {response.adjacentTerms.map((card) => (
          <button
            key={card.term}
            type="button"
            onClick={() => onAdjacentClick(card.term)}
            className="border-hairline hover:border-ink text-left transition-colors border p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <p className="text-ink font-headline text-[1.125rem] font-bold">{card.term}</p>
            <p className="text-ink-soft mt-1.5 text-[0.8125rem]">
              겹치는 럭셔리 용어: {card.shared_luxury_terms.join(", ")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function NoMatchResult({ reason }: { reason: string }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
      <p className="text-ink text-[1.0625rem] leading-[1.6]">{reason}</p>
      <Link
        href="/search"
        className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        다른 취향으로 다시 찾기
      </Link>
    </div>
  );
}
