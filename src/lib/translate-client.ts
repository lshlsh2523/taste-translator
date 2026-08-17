import type { TranslateResponse } from "@/types/taste";

// mock-translate.ts를 대체하는 실제 백엔드 호출. 결과는 sessionStorage에
// 저장해두고 /result 페이지가 읽는다 — 결과 JSON을 URL 쿼리로 넘기기엔
// 너무 커서(제품 여러 개 + 이미지 URL 등), 페이지 이동 직전에 저장해두는
// 방식을 택했다. /result를 새로고침하거나 직접 열면 sessionStorage가
// 비어있을 수 있으니, 그 경우 /result가 같은 query로 재요청한다
// (아래 RESULT_STORAGE_KEY 참고).

export const RESULT_STORAGE_KEY = "taste-translator:last-result";

type StoredResult = {
  query: string;
  response: TranslateResponse;
};

export async function runTranslation(query: string): Promise<void> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`번역 요청 실패: ${res.status}`);
  }

  const response = (await res.json()) as TranslateResponse;
  const stored: StoredResult = { query, response };
  sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(stored));
}

export async function fetchTranslate(query: string): Promise<TranslateResponse> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`번역 요청 실패: ${res.status}`);
  }
  return (await res.json()) as TranslateResponse;
}

export async function runTermRetry(term: string): Promise<TranslateResponse> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ term }),
  });
  if (!res.ok) {
    throw new Error(`재요청 실패: ${res.status}`);
  }
  return (await res.json()) as TranslateResponse;
}

export function readStoredResult(expectedQuery: string): TranslateResponse | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as StoredResult;
    return stored.query === expectedQuery ? stored.response : null;
  } catch {
    return null;
  }
}

export function storeResult(query: string, response: TranslateResponse): void {
  const stored: StoredResult = { query, response };
  sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(stored));
}
