"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { runTranslation } from "@/lib/translate-client";
import { SearchLoading, STAGES } from "@/components/SearchLoading";

const STARTERS = [
  "조용한데 눈에 띄는…",
  "화려하고 반짝이는…",
  "우아하고 로맨틱한…",
  "오래 입은 것 같은…",
  "무심하고 차분한…",
];

// 버튼 문구(짧은 fragment)는 그대로 두고, 클릭하면 바로 시도해볼 수 있는
// 완성된 예시 문장이 채워지게 한다 — 다섯 개가 서로 다른 무드를 대표하게
// 골랐고(올드머니 룩·Y2K·히메로리·그런지·놈코어), 각 문장은 라이브러리
// 취향 용어의 실제 정의(description) 문구를 최대한 그대로 살려서 썼다.
const STARTER_FILL: Record<string, string> = {
  "조용한데 눈에 띄는…": "조용한데 눈에 띄는, 돈 많아 보이지만 그게 티나지는 않는 분위기", // 올드머니 룩
  "화려하고 반짝이는…": "화려하고 반짝이는, 메탈릭 소재에 큰 로고 장식이 있는 미래적인 느낌", // Y2K
  "우아하고 로맨틱한…": "우아하고 로맨틱한, 공주풍 장식이 있는 고급스럽고 화려한 느낌", // 히메로리
  "오래 입은 것 같은…": "오래 입어서 낡은 듯한, 다크 톤에 힘 뺀 반항적인 느낌", // 그런지 패션
  "무심하고 차분한…": "화려하지 않고 무심한 듯, 평범하면서 절제된 차분한 느낌", // 놈코어룩
};

// 시연 영상 녹화용: 3단계 문구가 실제로 화면에 다 지나가는 걸 보여주려고
// 짧게 줄임(원래 12000 — 실제 응답이 보통 그 전에 끝나서 2·3단계 문구가
// 아예 안 보였음). 실제 백엔드는 2단계(이미지 비전 채점)에서 응답이
// 오래 걸릴 수 있으니, 녹화 끝나면 원래 값으로 되돌릴 것.
const STAGE_MS = 3000;
const SLOW_HINT_MS = 35000;

type Status = "idle" | "loading" | "error";

export function SearchForm() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const attemptRef = useRef(0);

  const startLoading = (text: string) => {
    const attempt = ++attemptRef.current;
    setSubmittedQuery(text);
    setStatus("loading");
    setStageIndex(0);
    setShowSlowHint(false);

    const stageInterval = setInterval(() => {
      if (attemptRef.current !== attempt) return;
      setStageIndex((i) => (i + 1) % STAGES.length);
    }, STAGE_MS);
    const slowTimer = setTimeout(() => {
      if (attemptRef.current === attempt) setShowSlowHint(true);
    }, SLOW_HINT_MS);

    runTranslation(text)
      .then(() => {
        if (attemptRef.current !== attempt) return;
        router.push(`/result?q=${encodeURIComponent(text)}`);
      })
      .catch(() => {
        if (attemptRef.current !== attempt) return;
        setStatus("error");
      })
      .finally(() => {
        clearInterval(stageInterval);
        clearTimeout(slowTimer);
      });
  };

  const submit = () => {
    const text = value.trim();
    if (!text) {
      textareaRef.current?.focus();
      return;
    }
    startLoading(text);
  };

  const handleRetry = () => {
    startLoading(submittedQuery);
  };

  // 엔터만 누르면 제출(화살표 버튼과 동일), 줄바꿈은 Shift+엔터로.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const insertStarter = (fragment: string) => {
    const next = `${fragment} `;
    setValue(next);
    setTimeout(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(next.length, next.length);
    });
  };

  return (
    <main className="flex min-h-svh flex-1 flex-col lg:overflow-y-auto">
      {status === "idle" && (
        <>
          <div className="px-6 pt-6 sm:px-10 lg:px-16 lg:pt-6">
            <Link
              href="/"
              className="text-ink-soft hover:text-ink focus-visible:outline-ink inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span aria-hidden="true">←</span>
              이런느낌
            </Link>
          </div>

          <div className="px-6 pt-24 sm:px-10 sm:pt-28 lg:px-16 lg:pt-32">
            <h1 className="reveal reveal-1 font-headline text-ink mx-auto w-full max-w-[920px] text-center text-[2rem] leading-[1.3] font-bold tracking-[-0.01em] sm:text-[2.5rem] lg:text-[2.75rem] xl:text-[3.125rem]">
              어떤 분위기를 가지고 싶으신가요?
            </h1>
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-10 lg:px-16 lg:py-6">
        <div className="w-full max-w-[920px]">
          {status === "idle" ? (
            <>
              <form
                className="reveal reveal-2 mx-auto mt-10 max-w-[720px] lg:mt-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    placeholder="색, 소재, 분위기 등 원하는 느낌을 설명해주세요"
                    className="border-hairline text-ink placeholder:text-ink-faint focus:border-ink/30 w-full resize-none rounded-[28px] border bg-white px-7 py-5 pr-20 text-[1.125rem] leading-[1.6] shadow-[0_16px_40px_-20px_rgba(33,29,24,0.28)] transition-colors outline-none sm:text-[1.1875rem]"
                  />
                  <button
                    type="submit"
                    aria-label="검색"
                    className="bg-ink text-paper hover:bg-transparent hover:text-ink absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span aria-hidden="true" className="text-lg">
                      →
                    </span>
                  </button>
                </div>
              </form>

              <div className="reveal reveal-3 mt-14 text-center lg:mt-16">
                <p className="text-ink-soft text-base sm:text-lg">이렇게 시작해보세요</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 lg:flex-nowrap">
                  {STARTERS.map((fragment) => (
                    <button
                      key={fragment}
                      type="button"
                      onClick={() => insertStarter(STARTER_FILL[fragment] ?? fragment)}
                      className="border-hairline text-ink-soft hover:border-ink hover:text-ink shrink-0 rounded-full border bg-white px-4 py-2.5 text-[0.9375rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-base"
                    >
                      {fragment}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-hairline mt-16 flex items-stretch gap-6 border-t pt-10 sm:gap-8 lg:mt-20 lg:pt-10">
                <div className="relative w-[110px] shrink-0 sm:w-[140px] lg:w-[168px]">
                  <Image
                    src="/images/cat-black.png"
                    alt=""
                    fill
                    sizes="168px"
                    className="object-contain object-bottom"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-ink-faint text-[0.75rem]">예시</p>
                  <p className="font-headline text-ink mt-1.5 text-[1.0625rem] leading-[1.55] sm:text-[1.1875rem] lg:text-[1.25rem]">
                    &ldquo;정리된 느낌은 있는데 딱딱하진 않고, 화려한 건 싫은데
                    심심해 보이는 것도 싫어요. 색은 거의 안 쓰고, 대신 소재나
                    형태에서 티가 나는 쪽이 좋아요. 애쓴 티는 안 났으면
                    좋겠어요.&rdquo;
                  </p>
                  <div className="border-hairline mt-4 border-t pt-3">
                    <p className="text-[0.8125rem]">
                      <span className="text-ink font-medium">취향 용어</span>
                      <span className="text-ink-faint mx-2">·</span>
                      <span className="text-ink-soft">미니멀룩 (Minimalism)</span>
                    </p>
                    <p className="mt-1.5 text-[0.8125rem]">
                      <span className="text-ink font-medium">패션 용어</span>
                      <span className="text-ink-faint mx-2">·</span>
                      <span className="text-ink-soft">
                        탑 핸들 백 (Top Handle Bag) · 사첼 백 (Satchel)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <SearchLoading
              query={submittedQuery}
              stageIndex={stageIndex}
              errored={status === "error"}
              showSlowHint={showSlowHint}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </main>
  );
}
