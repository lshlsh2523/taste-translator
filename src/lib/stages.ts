import { getAnthropicClient, STAGE_MODEL } from "@/lib/anthropic";
import { buildStage1Prompt, buildStage2Prompt } from "@/lib/prompts";
import type {
  CandidateProduct,
  MatchedTerm,
  Stage1Result,
  Stage2Result,
  TasteLibrary,
} from "@/types/taste";

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
        additionalProperties: false,
      },
    },
    no_clear_match: { type: "boolean" },
    fallback_note: { type: ["string", "null"] },
    suggested_new_term: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          properties: { description: { type: "string" } },
          required: ["description"],
          additionalProperties: false,
        },
      ],
    },
  },
  required: ["matched_terms", "no_clear_match"],
  additionalProperties: false,
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
            },
            required: ["shape_match", "material_match", "visual_match_score", "visual_match_reason"],
            additionalProperties: false,
          },
        },
        required: ["product_name", "total_score", "match_summary", "match_breakdown"],
        additionalProperties: false,
      },
    },
  },
  required: ["no_product_match", "recommended_products"],
  additionalProperties: false,
} as const;

function firstText(content: { type: string; text?: string }[]): string {
  const block = content.find((b) => b.type === "text");
  if (!block?.text) {
    throw new Error("모델 응답에 텍스트 블록이 없습니다.");
  }
  return block.text;
}

export async function callStage1(userInput: string, library: TasteLibrary): Promise<Stage1Result> {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: STAGE_MODEL,
    max_tokens: 4096,
    output_config: { format: { type: "json_schema", schema: STAGE1_SCHEMA } },
    messages: [{ role: "user", content: buildStage1Prompt(userInput, library) }],
  });
  return JSON.parse(firstText(response.content)) as Stage1Result;
}

export async function callStage2(
  matchedTerm: MatchedTerm,
  library: TasteLibrary,
  candidateProducts: CandidateProduct[],
): Promise<Stage2Result> {
  const client = getAnthropicClient();

  // 텍스트 프롬프트(스코어링 규칙 + candidate_products 메타데이터) 뒤에,
  // 이미지 신호(0~3점) 채점을 위해 각 후보 제품의 이미지를 실제로 붙여서
  // 보낸다. 프롬프트 본문의 candidate_products에는 image URL이 문자열로도
  // 들어있지만, 모델이 실제로 "보게" 하려면 image content block이 필요.
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "url"; url: string } }
  > = [{ type: "text", text: buildStage2Prompt(matchedTerm, library, candidateProducts) }];

  for (const product of candidateProducts) {
    content.push({ type: "text", text: `다음 이미지는 "${product.name}"의 이미지입니다.` });
    content.push({ type: "image", source: { type: "url", url: product.image } });
  }

  const response = await client.messages.create({
    model: STAGE_MODEL,
    max_tokens: 4096,
    output_config: { format: { type: "json_schema", schema: STAGE2_SCHEMA } },
    messages: [{ role: "user", content }],
  });
  return JSON.parse(firstText(response.content)) as Stage2Result;
}
