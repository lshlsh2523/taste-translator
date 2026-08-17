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

// gemini-2.5-flash / gemini-2.5-flash-lite는 신규 프로젝트(이 키가
// 속한 프로젝트)에서 404("no longer available to new users")로 아예
// 막혀있었음 — Gemini 3 세대로 넘어가는 중이라 구버전 모델이 신규
// 사용자에게 더 이상 열려있지 않은 것으로 보임. gemini-3.6-flash로
// 전환, 기존 generateContent 방식 그대로 동작 확인함(비전+JSON
// 구조화 출력 실제 호출로 검증 완료 — Interactions API로 갈아탈
// 필요는 없었음).
export const STAGE_MODEL = "gemini-3.6-flash";

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
