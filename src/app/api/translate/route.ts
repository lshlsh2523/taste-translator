import { NextResponse } from "next/server";
import { orchestrateTranslate, retryWithTerm } from "@/lib/orchestrate";
import { tasteLibrary } from "@/data/taste-library";
import { getMockResponse, getMockRetryResponse, isMockEnabled } from "@/lib/mock-fixtures";
import type { MatchedTerm, TranslateResponse } from "@/types/taste";

// 클라이언트가 보내는 knownMatch는 우리가 직접 만든 JSON이지만, 요청
// 본문은 어차피 신뢰 경계라 형태만 최소 검증한다 — 안 맞으면 그냥
// 무시하고(undefined) 기존처럼 합성 경로로 떨어지게 한다.
function isMatchedTerm(value: unknown): value is MatchedTerm {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.term === "string" &&
    typeof v.trust_level === "string" &&
    typeof v.reason === "string" &&
    Array.isArray(v.matching_keywords) &&
    typeof v.confidence === "number"
  );
}

export async function POST(request: Request) {
  let body: {
    query?: unknown;
    term?: unknown;
    originalQuery?: unknown;
    knownMatch?: unknown;
    knownMoodColor?: unknown;
    knownMoodEmoji?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  try {
    if (typeof body.term === "string" && body.term.trim()) {
      // originalQuery: 직전 검색의 원문 문장 — 2단계 색상 신호 판단용으로
      // 넘겨준다 (없어도 동작함, 색상 판단 정확도만 떨어짐).
      const originalQuery = typeof body.originalQuery === "string" ? body.originalQuery : undefined;
      const knownMatch = isMatchedTerm(body.knownMatch) ? body.knownMatch : undefined;
      const knownMoodColor = typeof body.knownMoodColor === "string" ? body.knownMoodColor : undefined;
      const knownMoodEmoji = typeof body.knownMoodEmoji === "string" ? body.knownMoodEmoji : undefined;
      if (isMockEnabled()) {
        return NextResponse.json<TranslateResponse>(getMockRetryResponse(body.term.trim()));
      }
      const result = await retryWithTerm(
        body.term.trim(),
        tasteLibrary,
        originalQuery,
        knownMatch,
        knownMoodColor,
        knownMoodEmoji,
      );
      return NextResponse.json<TranslateResponse>(result);
    }

    if (typeof body.query === "string" && body.query.trim()) {
      if (isMockEnabled()) {
        return NextResponse.json<TranslateResponse>(getMockResponse(body.query.trim()));
      }
      const result = await orchestrateTranslate(body.query.trim(), tasteLibrary);
      return NextResponse.json<TranslateResponse>(result);
    }

    return NextResponse.json({ error: "query 또는 term이 필요합니다." }, { status: 400 });
  } catch (error) {
    console.error("[/api/translate]", error);
    return NextResponse.json(
      { error: "지금은 연결이 어려워요. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }
}
