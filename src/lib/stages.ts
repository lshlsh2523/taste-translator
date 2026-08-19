import { fetchImageAsInlineData, getGeminiClient, STAGE_MODEL } from "@/lib/gemini";
import { buildStage1Prompt, buildStage2Prompt } from "@/lib/prompts";
import type {
  CandidateProduct,
  MatchedTerm,
  Stage1Result,
  Stage2Result,
  TasteLibrary,
} from "@/types/taste";

// Gemini의 responseJsonSchema는 표준 JSON Schema를 받지만, anyOf/다중
// type 배열 같은 구성은 지원이 불확실해서 피한다. 선택 필드는 required에서
// 빼서 모델이 아예 생략할 수 있게 한다 (null을 명시적으로 허용하는 대신).
const STAGE1_SCHEMA = {
  type: "object",
  properties: {
    matched_terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          trust_level: { type: "string", enum: ["학술 용어", "비평 용어", "통용어"] },
          reason: { type: "string" },
          matching_keywords: { type: "array", items: { type: "string" } },
          confidence: { type: "number" },
        },
        required: ["term", "trust_level", "reason", "matching_keywords", "confidence"],
      },
    },
    no_clear_match: { type: "boolean" },
    fallback_note: { type: "string" },
    suggested_new_term: {
      type: "object",
      properties: { description: { type: "string" } },
      required: ["description"],
    },
    // 검색마다 달라지는 "무드" 색/이모지 — matched_terms 1순위 기준으로
    // 모델이 그때그때 고른다(라이브러리 고정값 아님). matched_terms가
    // 비어있을 때(no_clear_match)는 생략될 수 있어 required에서 뺐다.
    mood_color: { type: "string" },
    mood_emoji: { type: "string" },
  },
  required: ["matched_terms", "no_clear_match"],
} as const;

const STAGE2_SCHEMA = {
  type: "object",
  properties: {
    no_product_match: { type: "boolean" },
    recommended_products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_name: { type: "string" },
          total_score: { type: "number" },
          match_summary: { type: "string" },
          match_breakdown: {
            type: "object",
            properties: {
              shape_match: { type: "boolean" },
              material_match: { type: "array", items: { type: "string" } },
              visual_match_score: { type: "number" },
              visual_match_reason: { type: "string" },
              // 점수(total_score)에는 포함 안 됨 — 화면 정렬 우선순위 전용.
              color_match: { type: "boolean" },
              color_reason: { type: "string" },
            },
            required: [
              "shape_match",
              "material_match",
              "visual_match_score",
              "visual_match_reason",
              "color_match",
              "color_reason",
            ],
          },
        },
        required: ["product_name", "total_score", "match_summary", "match_breakdown"],
      },
    },
  },
  required: ["no_product_match", "recommended_products"],
} as const;

export async function callStage1(userInput: string, library: TasteLibrary): Promise<Stage1Result> {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: STAGE_MODEL,
    contents: buildStage1Prompt(userInput, library),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: STAGE1_SCHEMA,
      // SDK 기본값은 408/429/5xx에서 최대 5회까지 알아서 재시도한다(우리가
      // 켠 적 없음) — 일시적 에러는 재시도 없이 바로 실패시키기로 한
      // 결정(withTransientRetry 제거)과 어긋나서 명시적으로 끈다.
      httpOptions: { retryOptions: { attempts: 1 } },
    },
  });
  if (!response.text) {
    throw new Error("1단계 모델 응답이 비어있습니다.");
  }
  return JSON.parse(response.text) as Stage1Result;
}

export async function callStage2(
  matchedTerm: MatchedTerm,
  library: TasteLibrary,
  candidateProducts: CandidateProduct[],
  originalQuery?: string,
): Promise<Stage2Result> {
  const client = getGeminiClient();

  // 이미지는 원격 URL을 직접 못 넣고 base64 inlineData로만 보낼 수 있어서
  // 후보 이미지를 먼저 전부 받아온다. 못 받아온 이미지가 있는 후보는
  // 이번 2단계 호출에서 통째로 제외한다 — 텍스트 정보만 주고 이미지
  // 없이 "이미지 신호"를 매기게 하면 규칙을 어기게 되므로.
  const withImages = await Promise.all(
    candidateProducts.map(async (product) => ({
      product,
      inline: await fetchImageAsInlineData(product.image),
    })),
  );
  const usable = withImages.filter(
    (w): w is { product: CandidateProduct; inline: { mimeType: string; data: string } } =>
      w.inline !== null,
  );

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [
    { text: buildStage2Prompt(matchedTerm, library, usable.map((u) => u.product), originalQuery) },
  ];

  for (const { product, inline } of usable) {
    parts.push({ text: `다음 이미지는 "${product.name}"의 이미지입니다.` });
    parts.push({ inlineData: inline });
  }

  const response = await client.models.generateContent({
    model: STAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: STAGE2_SCHEMA,
      // 1단계와 동일한 이유로 SDK 기본 재시도를 끈다.
      httpOptions: { retryOptions: { attempts: 1 } },
    },
  });
  if (!response.text) {
    throw new Error("2단계 모델 응답이 비어있습니다.");
  }
  return JSON.parse(response.text) as Stage2Result;
}
