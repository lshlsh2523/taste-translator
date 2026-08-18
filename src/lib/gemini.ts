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

// 예전에 여기 일시적 에러(503/429) 자동 재시도가 있었는데 뺐다 — 무료
// 티어 하루 한도가 20회뿐이라, 실패하는 재시도도 할당량을 그대로
// 깎아먹어서 검색 한 번이 최악의 경우 하루 치를 다 써버리는 문제가
// 있었다(실제로 겪음). 지금은 그냥 바로 실패시키고, 재시도는 사용자가
// 결과 화면의 "다시 시도" 버튼으로 직접 판단해서 누르게 한다.

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
