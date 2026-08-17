import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 추가하세요.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// gemini-2.5-flash: 무료 티어에 남아있는 모델(2026-04 기준 Pro는 무료
// 티어에서 빠짐), 이미지 입력·JSON 구조화 출력 모두 지원.
// 무료 티어 레이트리밋: 분당 10회, 하루 250회 — 검색 1번당 최대 1(1단계)
// + 3(2단계 재시도) = 4회 요청이라 여유 있음.
export const STAGE_MODEL = "gemini-2.5-flash";

// 이미지를 URL로 바로 보낼 수 없고(원격 URL을 직접 참조하는 API가 아님),
// base64로 인코딩한 inlineData로만 보낼 수 있다 — 매 2단계 호출마다 후보
// 이미지를 서버에서 미리 받아와 인코딩한다.
export async function fetchImageAsInlineData(
  url: string,
): Promise<{ mimeType: string; data: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { mimeType, data: buffer.toString("base64") };
  } catch {
    return null;
  }
}
