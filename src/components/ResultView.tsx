"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  fetchTranslate,
  readStoredResult,
  runTermRetry,
  storeResult,
} from "@/lib/translate-client";
import type { MatchedTerm, TranslateResponse } from "@/types/taste";

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
  // "이런 무드도 감지했어요"/"인접 취향" 카드를 눌러 다른 취향 화면으로
  // 들어갈 때마다 직전에 보고 있던 결과를 여기 쌓아둔다 — "이전 화면"
  // 버튼을 누르면 이 스택에서 마지막 걸 꺼내 그대로 복원한다. URL은 안
  // 바꾸므로 브라우저 뒤로가기가 아니라 화면 안에서만 동작하는 뒤로가기.
  const [history, setHistory] = useState<ViewState[]>([]);

  // 개발 모드에서 React Strict Mode가 이 effect를 마운트 시 한 번 더
  // 돌린다(마운트 → 클린업 → 재마운트) — 아래 cancelled 플래그는 "화면
  // 반영"만 막을 뿐 실제 네트워크 요청은 두 번 다 나가서, 검색 한 번에
  // API 호출이 실제로 2배로 나가는 문제가 있었다(실측 확인함). 같은
  // query에 대해 이미 나간 요청이 있으면 새로 안 보내고 그 Promise를
  // 재사용해서 막는다. ref라 Strict Mode의 두 번째 실행에서도 값이
  // 유지된다.
  const inFlightRef = useRef<{ query: string; promise: Promise<TranslateResponse> } | null>(null);

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
        const promise =
          inFlightRef.current?.query === query
            ? inFlightRef.current.promise
            : fetchTranslate(query);
        inFlightRef.current = { query, promise };
        return promise.then((response) => {
          if (inFlightRef.current?.promise === promise) inFlightRef.current = null;
          if (cancelled) return;
          storeResult(query, response);
          setState({ status: "loaded", query, response });
        });
      })
      .catch(() => {
        inFlightRef.current = null;
        if (cancelled) return;
        setState({ status: "error", message: "지금 서버 연결이 불안정해요.\n인터넷 연결을 확인하고 잠시 후 다시 시도해주세요." });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  // knownMatch: "이런 무드도 감지했어요" 카드에서 넘어올 때는 원래 검색의
  // 1단계가 이미 이 용어를 채점해둔 MatchedTerm이 있다 — 그대로 서버에
  // 넘겨서 진짜 reason/confidence를 그대로 쓰게 한다. "인접 취향" 카드는
  // 애초에 1단계가 채점한 적 없는 용어라 knownMatch 없이 호출한다.
  const handleAdjacentClick = async (term: string, knownMatch?: MatchedTerm) => {
    // 직전 검색 원문이 남아있으면(예: 성공 결과에서 "이런 무드도
    // 감지했어요" 칩을 눌렀을 때) 색상 신호 판단용으로 같이 넘긴다.
    const previousQuery = state.status === "loaded" ? state.query : undefined;
    // 지금 화면에 이미 떠 있는 무드 색/이모지가 있으면(성공 결과에서만
    // 존재 — adjacent_fallback 화면은 애초에 이 필드가 없어 자동으로
    // undefined) 그대로 재사용해서 넘긴다. 1단계를 다시 안 불러도 되게.
    const knownMood =
      state.status === "loaded" && state.response.status === "success"
        ? { color: state.response.moodColor, emoji: state.response.moodEmoji }
        : undefined;
    // 지금 보고 있던 화면을 스택에 쌓아둬서 "이전 화면" 버튼으로 되돌아올
    // 수 있게 한다 — 로딩/에러 화면에서는 되돌아올 게 없으니 안 쌓는다.
    if (state.status === "loaded") {
      setHistory((prev) => [...prev, state]);
    }
    setState({ status: "loading" });
    try {
      const response = await runTermRetry(
        term,
        previousQuery,
        knownMatch,
        knownMood?.color,
        knownMood?.emoji,
      );
      storeResult(term, response);
      setState({ status: "loaded", query: term, response });
    } catch {
      setState({ status: "error", message: "지금 서버 연결이 불안정해요.\n인터넷 연결을 확인하고 잠시 후 다시 시도해주세요." });
    }
  };

  const handleGoBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setState(last);
      return prev.slice(0, -1);
    });
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
        setState({ status: "error", message: "지금 서버 연결이 불안정해요.\n인터넷 연결을 확인하고 잠시 후 다시 시도해주세요." });
      });
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[880px] flex-col px-6 pt-6 pb-16 sm:px-10 lg:px-16">
      <div className="flex items-center justify-between gap-4">
        {history.length > 0 ? (
          <button
            type="button"
            onClick={handleGoBack}
            className="text-ink-soft hover:text-ink focus-visible:outline-ink inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">←</span>
            이전 화면
          </button>
        ) : (
          <span />
        )}
        <Link
          href="/search"
          className="text-ink-soft hover:text-ink focus-visible:outline-ink inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          새로운 취향 검색하기
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-1 flex-col">
        {state.status === "loading" && <LoadingState query={query} />}
        {state.status === "error" && (
          <ErrorState message={state.message} onRetry={query ? handleRetry : undefined} />
        )}
        {state.status === "loaded" && (
          <ResultBody
            // state.query는 "이런 무드도 감지했어요" 카드를 눌렀을 때
            // 클릭한 용어 이름으로 덮어써진다(캐시 키 용도) — 화면 맨 위
            // 인용구는 사용자가 실제로 검색한 원문을 보여줘야 하므로,
            // 카드 클릭으로도 절대 안 바뀌는 URL의 query(원문) 쪽을 쓴다.
            query={query}
            response={state.response}
            onAdjacentClick={handleAdjacentClick}
          />
        )}
      </div>
    </main>
  );
}

// 실제 결과 화면(SuccessResult)과 같은 자리에 회색 스켈레톤 블록을
// 그려둔다 — "곧 이런 모양이 뜰 거예요"를 미리 보여주는 방식. 인용구는
// 이미 아는 정보(URL의 원래 검색어)라 스켈레톤 없이 그대로 보여준다.
function LoadingState({ query }: { query: string }) {
  return (
    <div>
      <p className="font-headline text-ink-soft max-w-[560px] text-[1.0625rem] italic leading-[1.6] sm:text-[1.1875rem]">
        &ldquo;{query}&rdquo;
      </p>

      <div className="border-hairline mt-10 border-t pt-8">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
        <div className="skeleton mt-4 h-9 w-2/3 rounded" />
        <div className="skeleton mt-4 h-2 w-48 rounded-full" />
        <div className="mt-5 flex max-w-[560px] flex-col gap-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-11/12 rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
      </div>

      <div className="border-hairline mt-8 border-t pt-8">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="skeleton h-20 rounded" />
          <div className="skeleton h-20 rounded" />
          <div className="skeleton h-20 rounded" />
        </div>
      </div>

      <div className="border-hairline mt-8 border-t pt-8">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="skeleton aspect-square rounded" />
              <div className="skeleton mt-3 h-4 w-4/5 rounded" />
              <div className="skeleton mt-2 h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 실제 데이터 문제(no_match)와 구분되는 "진짜 통신 실패"라, 무드 컬러
// 대신 고정된 경고 톤(coral 계열)을 써서 다른 결과 화면들과 확실히
// 다르게 보이게 한다 — 색으로도 "이건 콘텐츠가 아니라 오류다"를 전달.
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-bold"
          style={{ background: "#f2e1d7", color: "#8e361a" }}
        >
          !
        </span>
        <p className="text-ink text-[1.0625rem] leading-[1.6] whitespace-pre-line">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            같은 검색어로 다시 시도
          </button>
        )}
        <Link
          href="/search"
          className="border-ink text-ink hover:bg-ink hover:text-paper focus-visible:outline-ink rounded-full border px-7 py-3.5 text-[1rem] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          새로 검색하기
        </Link>
      </div>
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

// 1단계가 산출한 confidence(0~1)를 그대로 보여준다 — 지어낸 점수가 아니라
// 모델이 이번 매칭에 대해 실제로 낸 값. 무드 컬러(--ct, 없으면 기본
// 액센트로 대체)를 배지 글자에만 써서 "이건 AI가 계산한 데이터"라는
// 신호로 쓴다.
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.75rem] font-medium"
      style={{ borderColor: "color-mix(in oklab, var(--ct) 45%, transparent)", color: "var(--ct)" }}
    >
      일치도 {pct}%
    </span>
  );
}

// 채움 너비 = confidence 값 그대로(과장하거나 보정하지 않음). 색은 원색
// (--c) 그대로 쓰고, 옆에 실제 퍼센트 숫자를 항상 같이 보여줘서 바만 보고도
// 뭘 나타내는지 알 수 있게 한다.
function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-ink-faint text-[0.6875rem]">일치도</span>
      <div
        className="bg-hairline h-1 w-40 max-w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="취향 매칭 일치도"
      >
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--c)" }} />
      </div>
      <span className="text-[0.75rem] font-semibold tabular-nums" style={{ color: "var(--c)" }}>
        {pct}%
      </span>
    </div>
  );
}

function ResultBody({
  query,
  response,
  onAdjacentClick,
}: {
  query: string;
  response: TranslateResponse;
  onAdjacentClick: (term: string, knownMatch?: MatchedTerm) => void;
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
  onAdjacentClick: (term: string, knownMatch?: MatchedTerm) => void;
}) {
  const {
    matchedTerm,
    matchedTermOrigins,
    matchedTermHistory,
    matchedTermCharacteristics,
    luxuryTerms,
    products,
    usedFallbackRank,
    allMatchedTerms,
    moodColor,
    moodEmoji,
    matchedTermIsSynthetic,
    belowThreshold,
  } = response;
  // 1단계가 "사랑스러운 무드의 단정한 분위기"처럼 서로 다른 무드를 여러
  // 취향으로 나눠 잡아도, 지금 화면엔 그중 하나(1순위로 성공한 것)만
  // 제품과 함께 보인다 — 나머지 취향은 사라지는 게 아니라 클릭 가능한
  // 카드로 남겨서, 사용자가 원하면 그 취향 기준으로 다시 찾아볼 수 있게.
  const otherMatchedTerms = allMatchedTerms.filter((t) => t.term !== matchedTerm.term);

  return (
    <div
      className="mood-scope mt-10"
      style={moodColor ? ({ "--c": moodColor } as CSSProperties) : undefined}
    >
      {usedFallbackRank > 0 && (
        <p className="text-ink-faint mb-6 text-[0.875rem]">
          1순위 취향보다 {RANK_LABELS[usedFallbackRank] ?? `${usedFallbackRank + 1}순위`} 취향에 더
          잘 맞는 제품을 찾았어요
        </p>
      )}

      <div className="border-hairline border-t pt-8">
        <p className="flex flex-wrap items-center gap-2 text-[0.8125rem]">
          <span className="text-ink font-medium">취향 용어</span>
          <span className="text-ink-faint">·</span>
          <TrustBadge trustLevel={matchedTerm.trust_level} />
          {!matchedTermIsSynthetic && <ConfidenceBadge confidence={matchedTerm.confidence} />}
        </p>
        <h1 className="font-headline text-ink mt-2 text-[2rem] font-bold leading-[1.3] sm:text-[2.25rem]">
          {matchedTerm.term}
        </h1>
        {!matchedTermIsSynthetic && <ConfidenceBar confidence={matchedTerm.confidence} />}
        {(matchedTermHistory ?? matchedTermOrigins[matchedTerm.term]) && (
          <div className="mt-4 flex max-w-[560px] flex-col gap-3">
            <div>
              <p className="text-ink-faint text-[0.75rem]">유래</p>
              <p className="text-ink/85 mt-1 text-[0.9375rem] leading-[1.6]">
                {matchedTermHistory ?? matchedTermOrigins[matchedTerm.term]}
              </p>
            </div>
            {matchedTermCharacteristics && (
              <div>
                <p className="text-ink-faint text-[0.75rem]">특징</p>
                <p className="text-ink/85 mt-1 text-[0.9375rem] leading-[1.6]">
                  {matchedTermCharacteristics}
                </p>
              </div>
            )}
          </div>
        )}
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

        {!matchedTermIsSynthetic && (
          <div
            className="mt-6 max-w-[560px] p-4"
            style={{
              background: "color-mix(in oklab, var(--c) 9%, var(--color-paper))",
              borderLeft: "3px solid var(--c)",
            }}
          >
            <div className="flex items-center gap-2">
              {moodEmoji && (
                <span aria-hidden="true" className="text-[0.9375rem]">
                  {moodEmoji}
                </span>
              )}
              <p className="text-[0.75rem] font-medium" style={{ color: "var(--ct)" }}>
                이렇게 판단했어요
              </p>
            </div>
            <p className="text-ink-soft mt-1.5 text-[0.875rem] leading-[1.6]">{matchedTerm.reason}</p>
          </div>
        )}
      </div>

      {luxuryTerms.length > 0 && (
        <div className="border-hairline mt-8 border-t pt-8">
          <p className="text-ink-faint text-[0.75rem]">
            패션 용어 {luxuryTerms.length > 1 && `· 이 취향과 연결된 형태·소재 용어 ${luxuryTerms.length}개`}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {luxuryTerms.map((lt) => {
              const isShape = lt.kind === "shape";
              // 형태/소재는 항상 뚜렷이 구분돼야 하지만, 취향 용어 쪽보다는
              // 조용해야 한다 — 그래서 무드 컬러(--c)를 그대로 안 쓰고,
              // 기존 고정 액센트(형태=블루, 소재=러스트) 쪽으로 각각 55%
              // 섞어서 "같은 무드에서 갈라진 색"처럼 보이게 한다. 무드
              // 컬러가 없는 경로(카드 클릭 재검색 등)는 섞을 --c가 없으니
              // 기존처럼 순수 고정 액센트 그대로 쓴다.
              const cc = moodColor
                ? isShape
                  ? "color-mix(in oklab, var(--c) 55%, var(--color-accent-2) 45%)"
                  : "color-mix(in oklab, var(--c) 55%, var(--color-accent) 45%)"
                : isShape
                  ? "var(--color-accent-2)"
                  : "var(--color-accent)";
              return (
                <div
                  key={lt.term}
                  className="flex flex-col gap-1.5 border p-4"
                  style={{
                    background: `color-mix(in oklab, ${cc} 4%, var(--color-paper))`,
                    borderColor: `color-mix(in oklab, ${cc} 18%, var(--color-hairline))`,
                  }}
                >
                  <span
                    className="text-[0.6875rem] font-medium"
                    style={{ color: `color-mix(in oklab, ${cc} 55%, var(--color-ink-faint) 45%)` }}
                  >
                    {isShape ? "형태" : "소재"}
                  </span>
                  <p className="font-headline text-ink text-[1rem] font-bold leading-[1.3]">
                    {lt.term}
                  </p>
                  <p className="text-ink-soft text-[0.8125rem] leading-[1.5]">{lt.origin}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-hairline mt-8 border-t pt-8">
        <p className="text-ink-faint text-[0.75rem]">
          이런 제품은 어때요?
          {products.length > 0 && ` · ${products.length}개`}
          {belowThreshold && (
            <span className="ml-1" style={{ color: "var(--ct)" }}>
              · 일치도가 낮은 편이에요
            </span>
          )}
        </p>
        {products.length > 0 ? (
          <>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.product_name} product={product} />
              ))}
            </div>
            <p className="text-ink-faint mt-4 text-[0.75rem] leading-[1.5]">
              일부 상품은 품절되었거나 시즌이 끝나 상세 페이지가 사라졌을 수 있어요. 그런 경우
              눌렀을 때 관련 카테고리 목록으로 연결돼요.
            </p>
          </>
        ) : (
          <p className="text-ink-soft mt-4 text-[0.9375rem]">
            지금은 이 취향에 맞는 제품을 찾지 못했어요.
          </p>
        )}
      </div>

      {otherMatchedTerms.length > 0 && (
        <div className="border-hairline mt-8 border-t pt-8">
          <p className="text-ink-faint text-[0.75rem]">이런 무드도 감지했어요</p>
          <div className="mt-4 flex flex-col gap-3">
            {otherMatchedTerms.map((term) => (
              <button
                key={term.term}
                type="button"
                onClick={() => onAdjacentClick(term.term, term)}
                className="border-hairline hover:border-ink text-left transition-colors border p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <p className="text-ink font-headline text-[1rem] font-bold">{term.term}</p>
                {matchedTermOrigins[term.term] && (
                  <p className="text-ink-soft mt-1 text-[0.8125rem] leading-[1.5]">
                    {matchedTermOrigins[term.term]}
                  </p>
                )}
                <p className="text-ink-faint mt-1.5 text-[0.75rem] leading-[1.5]">{term.reason}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 퍼센트 숫자만 나열하면 실제 값 차이가 작을 때(예: 67%, 60%, 58%) 다
// 비슷해 보여서 신뢰도가 낮아 보인다는 피드백 — 구간을 나눠 말로 표현하면
// 그 미묘한 차이가 훨씬 뚜렷하게 읽힌다.
function matchLabel(pct: number): string {
  if (pct >= 90) return "정말 잘 맞아요";
  if (pct >= 70) return "잘 맞아요";
  if (pct >= 50) return "어느 정도 맞아요";
  return "일치도가 낮은 편이에요";
}

// 무드 컬러(--c)에 얹지 않고 구간마다 고정된 톤을 쓴다 — 종이 배경(#f6f1e8)과
// 부딪히지 않게 채도를 낮춘 값으로 골랐다.
function matchTierStyle(pct: number): CSSProperties {
  if (pct >= 90) return { background: "#e5eddb", color: "#35640f" };
  if (pct >= 70) return { background: "#ebe3d1", color: "#644429" };
  if (pct >= 50) return { background: "#f0e5cd", color: "#7b490a" };
  return { background: "#f2e1d7", color: "#8e361a" };
}

function ProductCard({
  product,
}: {
  product: Extract<TranslateResponse, { status: "success" }>["products"][number];
}) {
  const [imageError, setImageError] = useState(false);
  const pct = Math.round((product.total_score / product.max_score) * 100);

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
      <span
        className="mt-2 inline-block rounded-full px-2.5 py-1 text-[0.75rem] font-medium"
        style={matchTierStyle(pct)}
      >
        {matchLabel(pct)}
      </span>
    </a>
  );
}

function AdjacentFallbackResult({
  response,
  onAdjacentClick,
}: {
  response: Extract<TranslateResponse, { status: "adjacent_fallback" }>;
  onAdjacentClick: (term: string, knownMatch?: MatchedTerm) => void;
}) {
  const { moodColor, moodEmoji } = response;
  return (
    <div
      className="mood-scope mt-10"
      style={moodColor ? ({ "--c": moodColor } as CSSProperties) : undefined}
    >
      <div className="border-hairline border-t pt-8">
        <h1 className="font-headline text-ink flex items-center gap-2 text-[1.5rem] font-bold leading-[1.3] sm:text-[1.75rem]">
          {moodEmoji && (
            <span aria-hidden="true" className="text-[1.25rem]">
              {moodEmoji}
            </span>
          )}
          정확히 맞는 제품은 없지만, 이런 취향은 어떠세요?
        </h1>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {response.adjacentTerms.map((card) => (
          <button
            key={card.term}
            type="button"
            onClick={() => onAdjacentClick(card.term)}
            className="group border-hairline hover:border-ink flex items-center gap-4 text-left transition-colors border p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            style={{ background: "color-mix(in oklab, var(--c) 5%, var(--color-paper))" }}
          >
            <div className="flex-1">
              <p className="text-ink font-headline text-[1.125rem] font-bold">{card.term}</p>
              <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.5]">{card.origin}</p>
              {card.shared_luxury_terms.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {card.shared_luxury_terms.map((term) => (
                    <span
                      key={term}
                      className="rounded-full px-2.5 py-0.5 text-[0.6875rem]"
                      style={{
                        background: "color-mix(in oklab, var(--c) 14%, var(--color-paper))",
                        color: "var(--ct)",
                      }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span
              aria-hidden="true"
              className="text-ink-faint group-hover:text-ink shrink-0 text-lg transition-colors"
            >
              →
            </span>
          </button>
        ))}
      </div>

      <div className="border-hairline mt-12 border-t pt-8">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "color-mix(in oklab, var(--c) 8%, var(--color-paper))",
          }}
        >
          <p className="text-[0.875rem] font-medium" style={{ color: "var(--ct)" }}>
            이렇게 검색해보면 어때요?
          </p>
          <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.6]">
            색·소재·형태를 더 구체적으로 적어서 다시 검색하면 더 잘 맞는 결과를 찾을 수도 있어요.
          </p>
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        <Link
          href="/search"
          className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          다른 취향으로 다시 찾기
        </Link>
      </div>
    </div>
  );
}

// moodColor를 못 받는 경로(1단계가 아예 매칭을 못 했을 때는 무드도 안 뽑힘)라
// mood-scope 인라인 --c 오버라이드 없이 기본 액센트 색으로 고정 사용한다 —
// 그래도 코칭 카드가 완전히 무채색이 아니라 은은한 톤을 갖게 하기 위함.
function NoMatchResult({ reason }: { reason: string }) {
  return (
    <div className="mood-scope mt-10">
      <div className="border-hairline border-t pt-10">
        <h1 className="font-headline text-ink text-[1.375rem] font-bold leading-[1.35] sm:text-[1.5rem]">
          {reason}
        </h1>
        <p className="text-ink-soft mt-4 text-[1.0625rem] leading-[1.6]">
          지금은 없지만, 취향 용어와 상품은 계속 추가하고 있어요.
        </p>
      </div>

      <div
        className="mt-16 rounded-2xl p-7"
        style={{ background: "color-mix(in oklab, var(--c) 8%, var(--color-paper))" }}
      >
        <p className="text-[1.0625rem] font-medium" style={{ color: "var(--ct)" }}>
          이렇게 검색해보면 어때요?
        </p>
        <p className="text-ink-soft mt-2 text-[1rem] leading-[1.65]">
          색·소재·형태를 더 구체적으로 적어서 다시 검색해보면 더 잘 맞는 취향을 찾을 수도 있어요.
        </p>
      </div>

      <div className="mt-24 flex justify-center">
        <Link
          href="/search"
          className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          다른 취향으로 다시 찾기
        </Link>
      </div>
    </div>
  );
}
