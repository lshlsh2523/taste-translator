"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";

const FRAMES = [
  "/images/cat-1.png",
  "/images/cat-2.png",
  "/images/cat-3.png",
  "/images/cat-4.png",
];

const STAGES = ["취향을 읽는 중", "용어를 찾는 중", "제품과 맞춰보는 중"];

const FRAME_INTERVAL_MS = 200; // 0.8s cycle / 4 frames (half speed)

type SearchLoadingProps = {
  query: string;
  stageIndex: number;
  errored: boolean;
  showSlowHint: boolean;
  onRetry: () => void;
};

export function SearchLoading({
  query,
  stageIndex,
  errored,
  showSlowHint,
  onRetry,
}: SearchLoadingProps) {
  const [frame, setFrame] = useState(0);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!reduced.matches);
    update();
    reduced.addEventListener("change", update);

    let id: ReturnType<typeof setInterval> | undefined;
    if (!reduced.matches) {
      id = setInterval(() => {
        setFrame((f) => (f + 1) % FRAMES.length);
      }, FRAME_INTERVAL_MS);
    }

    return () => {
      reduced.removeEventListener("change", update);
      if (id) clearInterval(id);
    };
  }, []);

  return (
    <div>
      <p className="font-headline text-ink-soft mx-auto max-w-[560px] text-center text-[1.0625rem] italic leading-[1.6] sm:text-[1.1875rem]">
        &ldquo;{query}&rdquo;
      </p>

      {errored ? (
        <div className="mt-16 flex flex-col items-center gap-10 lg:mt-20">
          <div className="flex flex-col items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-bold"
              style={{ background: "#f2e1d7", color: "#8e361a" }}
            >
              !
            </span>
            <p className="text-ink text-center text-[1.0625rem] sm:text-[1.1875rem]">
              지금 서버 연결이 불안정해요.
              <br />
              인터넷 연결을 확인하고 잠시 후 다시 시도해주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="bg-ink text-paper hover:bg-transparent hover:text-ink focus-visible:outline-ink rounded-full px-7 py-3.5 text-[1rem] transition-colors duration-200 hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center lg:mt-20">
          <div className="relative aspect-[444/310] w-[240px] sm:w-[300px] lg:w-[360px]">
            {FRAMES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority
                sizes="360px"
                className="object-cover object-[50%_62%]"
                style={{ opacity: animate ? (frame === i ? 1 : 0) : i === 0 ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="bg-hairline mt-1 h-px w-[190px] sm:w-[230px] lg:w-[270px]" />

          <p
            aria-live="polite"
            className="font-headline text-ink mt-12 text-center text-[1.375rem] font-bold sm:text-[1.625rem] lg:text-[1.75rem]"
          >
            {STAGES[stageIndex]}
          </p>

          <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-2">
            {STAGES.map((stage, i) => (
              <span
                key={stage}
                className={
                  i === stageIndex
                    ? "bg-ink h-2 w-2 rounded-full"
                    : "border-tagline h-2 w-2 rounded-full border"
                }
              />
            ))}
          </div>

          {showSlowHint && (
            <p className="text-ink-faint mt-9 text-[0.875rem]">
              조금만 더 기다려주세요
            </p>
          )}
        </div>
      )}
    </div>
  );
}
