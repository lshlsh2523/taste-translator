import { NextResponse } from "next/server";
import { orchestrateTranslate, retryWithTerm } from "@/lib/orchestrate";
import { tasteLibrary } from "@/data/taste-library";
import { getMockResponse, getMockRetryResponse, isMockEnabled } from "@/lib/mock-fixtures";
import type { TranslateResponse } from "@/types/taste";

export async function POST(request: Request) {
  let body: { query?: unknown; term?: unknown; originalQuery?: unknown };
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
      if (isMockEnabled()) {
        return NextResponse.json<TranslateResponse>(getMockRetryResponse(body.term.trim()));
      }
      const result = await retryWithTerm(body.term.trim(), tasteLibrary, originalQuery);
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
