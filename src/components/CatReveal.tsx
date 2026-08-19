"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { NameTag } from "@/data/name-tags";

type CatRevealProps = {
  nameTags: NameTag[];
};

type Rect = { left: number; top: number; width: number; height: number };

// Keep the image's own box geometry in one place: the anchor-conversion
// math below assumes tag coordinates are percent-of-THIS-box.
const IMAGE_BOX_CLASSNAME =
  "absolute right-0 bottom-0 left-0 mx-auto h-[46svh] w-full max-w-[420px] translate-y-[6%] " +
  "sm:h-[50svh] sm:max-w-[480px] " +
  "lg:right-auto lg:left-[10%] lg:mx-0 lg:h-[80svh] lg:w-auto lg:max-w-[68%] lg:aspect-[2288/2400] lg:translate-y-[7%]";

const COMPACT_WIDTH_THRESHOLD = 500;

export function CatReveal({ nameTags }: CatRevealProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const [imageRect, setImageRect] = useState<Rect | null>(null);
  const [outerWidth, setOuterWidth] = useState<number | null>(null);
  const [mode, setMode] = useState<"static" | "interactive">("static");

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const box = imageBoxRef.current;
    if (!outer || !box) return;

    const measure = () => {
      const outerBox = outer.getBoundingClientRect();
      const imgBox = box.getBoundingClientRect();
      setImageRect({
        left: imgBox.left - outerBox.left,
        top: imgBox.top - outerBox.top,
        width: imgBox.width,
        height: imgBox.height,
      });
      setOuterWidth(outerBox.width);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(box);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useLayoutEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(fine.matches && !reduced.matches ? "interactive" : "static");
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    if (mode !== "interactive" || !imageRect) return;
    const outer = outerRef.current;
    if (!outer) return;

    let raf = 0;
    let sweeping = true;
    const start = performance.now();
    const SWEEP_MS = 2200;
    const target = {
      x: imageRect.left + imageRect.width * 0.5,
      y: imageRect.top + imageRect.height * 0.5,
    };
    const current = { ...target };

    const sweepPoint = (t: number) => {
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return {
        x: imageRect.left + imageRect.width * (0.22 + eased * 0.56),
        y: imageRect.top + imageRect.height * (0.1 + Math.sin(eased * Math.PI) * 0.12),
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      sweeping = false;
      outer.dataset.interacted = "true";
    };
    outer.addEventListener("pointermove", onPointerMove);

    const tick = (now: number) => {
      if (sweeping) {
        const t = Math.min(1, (now - start) / SWEEP_MS);
        const p = sweepPoint(t);
        target.x = p.x;
        target.y = p.y;
        if (t >= 1) sweeping = false;
      }
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      outer.style.setProperty("--reveal-x", `${current.x}px`);
      outer.style.setProperty("--reveal-y", `${current.y}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      outer.removeEventListener("pointermove", onPointerMove);
    };
  }, [mode, imageRect]);

  const interactive = mode === "interactive";

  return (
    <div
      ref={outerRef}
      className="reveal-container relative h-[42svh] w-full shrink-0 sm:h-[46svh] lg:h-auto lg:w-[62%] lg:flex-1"
    >
      <div ref={imageBoxRef} className={IMAGE_BOX_CLASSNAME}>
        <Image
          src="/images/cats.png"
          alt="가죽 재킷과 데님 오버올을 입은 고양이 두 마리"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain object-[bottom_right] lg:object-[bottom_left]"
        />
      </div>

      {imageRect && outerWidth && (
        <div className={`absolute inset-0 ${interactive ? "reveal-mask" : ""}`}>
          {nameTags.map((tag) => (
            <TagCard key={tag.ko} tag={tag} imageRect={imageRect} outerWidth={outerWidth} />
          ))}
        </div>
      )}

      {interactive && <div aria-hidden className="reveal-ring" />}

      {interactive && (
        <p
          aria-hidden
          className="reveal-hint text-ink-faint pointer-events-none absolute right-4 bottom-4 text-[11px] italic transition-opacity duration-500 lg:right-6 lg:bottom-6"
        >
          커서를 움직여보세요
        </p>
      )}
    </div>
  );
}

function TagCard({
  tag,
  imageRect,
  outerWidth,
}: {
  tag: NameTag;
  imageRect: Rect;
  outerWidth: number;
}) {
  const compact = imageRect.width < COMPACT_WIDTH_THRESHOLD;
  const dir = tag.side === "left" ? -1 : 1;

  const stub = compact ? 10 : 30;
  const bend = compact ? -14 : -34;
  const seg2 = (compact ? 20 : 72) + (tag.depth ?? 0);
  const baseCardWidth = tag.tier === "vibe" ? (compact ? 180 : 290) : compact ? 132 : 210;
  // Two compact cards can sit at roughly the same height on very narrow
  // phones (one per side); cap width so they can never touch mid-screen.
  const cardWidth = compact ? Math.min(baseCardWidth, Math.floor(outerWidth / 2) - 30) : baseCardWidth;
  const edgeMargin = 8;
  const koSize = tag.tier === "vibe" ? (compact ? 15 : 30) : compact ? 14 : 22;
  const enSize = compact ? 12 : 19;
  const padX = compact ? 10 : 20;
  const padY = compact ? 8 : 14;

  // pTouch: 리더라인이 실제로 옷/소품에 닿는 지점(touchX/touchY가 없으면
  // x/y와 같아서 기존 동작 그대로). rowY: 카드가 놓이는 "행" — 항상
  // x/y로만 정해져서, touchX/touchY를 바꿔도 카드 위치는 안 움직인다.
  const pTouch = {
    x: imageRect.left + ((tag.touchX ?? tag.x) / 100) * imageRect.width,
    y: imageRect.top + ((tag.touchY ?? tag.y) / 100) * imageRect.height,
  };
  const rowY = imageRect.top + (tag.y / 100) * imageRect.height;
  const pRow = { x: pTouch.x, y: rowY };
  const p1 = { x: pRow.x + dir * stub, y: rowY };
  const p2 = { x: p1.x, y: p1.y + bend };
  let p3x = p2.x + dir * seg2;

  // Keep the card fully on-screen even when the anchor sits close to the
  // container edge (mobile especially has little room to spare).
  if (dir === -1) {
    p3x = Math.max(p3x, edgeMargin + cardWidth);
  } else {
    p3x = Math.min(p3x, outerWidth - edgeMargin - cardWidth);
  }
  const p3 = { x: p3x, y: p2.y };

  // 좌표가 이미지 비율(%) 기반이라 대부분 소수점 픽셀 값이 나온다 — 세
  // 선분이 모서리에서 딱 맞닿기만 하면(겹치지 않으면) 브라우저가 각
  // 선분을 독립적으로 서브픽셀 렌더링하면서 이음매에 미세한 틈이
  // 보였다(실측 확인함). 겹침(JOINT_OVERLAP)만큼 서로 파고들게 해서
  // 어떤 소수점 좌표에서도 이음매가 끊겨 보이지 않게 한다.
  const JOINT_OVERLAP = 1;
  // pTouch(옷에 닿는 지점) -> pRow(카드가 놓인 행의 높이로 수직 이동).
  // touchX/touchY를 안 쓰는 태그는 pTouch.y === rowY라 사실상 안 보인다.
  const lineTouch: CSSProperties = {
    left: pTouch.x,
    top: Math.min(pTouch.y, pRow.y) - JOINT_OVERLAP,
    width: 1,
    height: Math.max(1, Math.abs(pRow.y - pTouch.y)) + JOINT_OVERLAP * 2,
  };
  const lineA: CSSProperties = {
    left: Math.min(pRow.x, p1.x),
    top: pRow.y,
    width: Math.max(1, Math.abs(p1.x - pRow.x)) + JOINT_OVERLAP,
    height: 1,
  };
  const lineB: CSSProperties = {
    left: p1.x,
    top: Math.min(p1.y, p2.y) - JOINT_OVERLAP,
    width: 1,
    height: Math.max(1, Math.abs(p2.y - p1.y)) + JOINT_OVERLAP * 2,
  };
  const lineC: CSSProperties = {
    left: Math.min(p2.x, p3.x),
    top: p2.y,
    width: Math.max(1, Math.abs(p3.x - p2.x)),
    height: 1,
  };

  // 꺾이는 다단 경로 대신 접점(pTouch)에서 카드 모서리(p3)까지 대각선
  // 직선 하나로 잇는다 — 회전한 1px 높이 막대로 구현(각도 무관하게 동일 방식).
  const straightDx = p3.x - pTouch.x;
  const straightDy = p3.y - pTouch.y;
  const straightLength = Math.hypot(straightDx, straightDy);
  const straightAngle = (Math.atan2(straightDy, straightDx) * 180) / Math.PI;
  const lineStraight: CSSProperties = {
    left: pTouch.x,
    top: pTouch.y,
    width: straightLength,
    height: 1,
    transform: `rotate(${straightAngle}deg)`,
    transformOrigin: "0 0",
  };

  // 한 번만 꺾는 L자 경로: 접점 -> 카드와 같은 높이(수직) -> 카드(수평),
  // 중간의 짧은 stub/bend 굴곡은 건너뛴다. 카드의 실제 y(p3.y, rowY에서
  // bend만큼 밀린 값)를 그대로 목표 높이로 써야 카드에 정확히 닿는다.
  const lineElbowV: CSSProperties = {
    left: pTouch.x,
    top: Math.min(pTouch.y, p3.y) - JOINT_OVERLAP,
    width: 1,
    height: Math.max(1, Math.abs(p3.y - pTouch.y)) + JOINT_OVERLAP * 2,
  };
  const lineElbowH: CSSProperties = {
    left: Math.min(pTouch.x, p3.x),
    top: p3.y,
    width: Math.max(1, Math.abs(p3.x - pTouch.x)) + JOINT_OVERLAP,
    height: 1,
  };

  const cardStyle: CSSProperties = {
    left: p3.x,
    top: p3.y,
    transform: `translate(${dir === -1 ? "-100%" : "0"}, -50%)`,
    maxWidth: cardWidth,
    paddingInline: padX,
    paddingBlock: padY,
  };

  return (
    <>
      {!tag.noLine &&
        (tag.straightLine ? (
          <div className="leader-line absolute" style={lineStraight} />
        ) : tag.singleBend ? (
          <>
            <div className="leader-line absolute" style={lineElbowV} />
            <div className="leader-line absolute" style={lineElbowH} />
          </>
        ) : (
          <>
            <div className="leader-line absolute" style={lineTouch} />
            <div className="leader-line absolute" style={lineA} />
            <div className="leader-line absolute" style={lineB} />
            <div className="leader-line absolute" style={lineC} />
          </>
        ))}
      <div
        className="tag-card border-tagline absolute border bg-white"
        style={cardStyle}
      >
        {tag.tier === "vibe" ? (
          <>
            <span
              className="font-headline text-ink block leading-tight font-bold"
              style={{ fontSize: koSize }}
            >
              {tag.ko}
            </span>
            {tag.en && (
              <span
                className="font-accent-en text-ink-soft mt-0.5 block leading-tight italic"
                style={{ fontSize: enSize }}
              >
                {tag.en}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="text-ink block leading-tight" style={{ fontSize: koSize }}>
              {tag.ko}
            </span>
            {tag.en && (
              <span
                className="font-accent-en text-ink-soft mt-0.5 block leading-tight italic"
                style={{ fontSize: enSize }}
              >
                {tag.en}
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
}
