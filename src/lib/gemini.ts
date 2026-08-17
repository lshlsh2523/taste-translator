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

// gemini-2.5-flash-lite: gemini-2.5-flash가 실측 무료 티어 하루 20회
// 한도로 개발 중 바로 소진돼서(공개된 문서상 250회라던 수치와 실제
// 429 에러 메시지의 quotaValue가 달랐음 — 문서보다 API가 반환하는
// 실제 에러 메시지를 신뢰) flash-lite로 전환. 채점 정밀도는 flash보다
// 약간 떨어질 수 있지만 이미지 입력·JSON 구조화 출력 다 지원하고
// 하루 한도가 훨씬 넉넉함.
export const STAGE_MODEL = "gemini-2.5-flash-lite";

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
