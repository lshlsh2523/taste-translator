export type NameTag = {
  ko: string; // "사첼"
  en?: string; // "Satchel" — omitted for whole-impression taste-vocabulary tags
  tier: "vibe" | "part"; // "vibe" = 취향 용어 (전체 인상), "part" = 전문 용어 (부위)
  x: number; // 0~100, percent of image width
  y: number; // 0~100, percent of image height
  side: "left" | "right";
  // Extra leader-line reach (px) for a tag whose vertical neighbor sits
  // close by — staggers card depth so bigger labels don't collide.
  depth?: number;
};

// Coordinates are calibrated against the rendered image in the browser
// (percent of the image's own box), not eyeballed off the source file.
export const nameTags: NameTag[] = [
  // 검은 고양이 — 왼쪽으로 뻗음
  { ko: "미니멀룩", en: "Minimalism", tier: "vibe", x: 25, y: 3, side: "left" },
  { ko: "스트럭처드 실루엣", en: "Structured", tier: "part", x: 23, y: 21, side: "left" },
  { ko: "슬링백", en: "Sling", tier: "part", x: 22, y: 71, side: "left" },
  { ko: "나파 레더", en: "Nappa", tier: "part", x: 29, y: 90, side: "left", depth: 46 },

  // 흰 고양이 — 오른쪽으로 뻗음
  { ko: "놈코어룩", en: "Normcore", tier: "vibe", x: 77, y: 3, side: "right" },
  { ko: "버킷 햇", en: "Bucket", tier: "part", x: 86, y: 19, side: "right", depth: 46 },
  { ko: "사첼 백", en: "Satchel", tier: "part", x: 91, y: 83, side: "right" },
  { ko: "워시드 데님", en: "Washed", tier: "part", x: 78, y: 57, side: "right" },
];
