import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local에 추가하세요.",
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

// claude-sonnet-5: 이미지(비전) 지원 확인됨 — 2단계 제품 매칭에서 이미지 무드
// 스코어링(0~3점)에 사용. adaptive thinking이 기본값이라 thinking 파라미터는
// 생략해도 됨.
export const STAGE_MODEL = "claude-sonnet-5";

// 두 단계 모두 JSON만 반환하도록 프롬프트가 지시하지만, 모델이 코드펜스나
// 앞뒤 설명을 붙이는 경우를 대비해 첫 { ... } 블록만 관대하게 추출한다.
export function extractJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`모델 응답에서 JSON을 찾을 수 없습니다: ${trimmed.slice(0, 200)}`);
  }
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
