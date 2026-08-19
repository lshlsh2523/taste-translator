export type NameTag = {
  ko: string; // "사첼"
  en?: string; // "Satchel" — omitted for whole-impression taste-vocabulary tags
  tier: "vibe" | "part"; // "vibe" = 취향 용어 (전체 인상), "part" = 전문 용어 (부위)
  x: number; // 0~100, percent of image width — 카드가 놓이는 "행"의 위치
  y: number; // 0~100, percent of image height — 카드가 놓이는 "행"의 위치
  side: "left" | "right";
  // Extra leader-line reach (px) for a tag whose vertical neighbor sits
  // close by — staggers card depth so bigger labels don't collide.
  depth?: number;
  // 리더라인이 실제로 옷/소품에 닿는 지점 — 생략하면 x/y와 동일(기존
  // 동작 그대로). 카드 위치(x/y)는 그대로 두고 싶은데 선이 가리키는
  // 지점만 정확한 곳으로 옮기고 싶을 때만 채운다.
  touchX?: number;
  touchY?: number;
  // true면 리더라인을 아예 안 그리고 카드만 독립적으로 띄운다("무드"
  // 태그처럼 특정 소품 하나를 가리키는 게 아니라 전체 인상을 말할 때).
  noLine?: boolean;
  // true면 꺾이는 다단 경로 대신 접점→카드를 대각선 직선 하나로 잇는다.
  straightLine?: boolean;
  // true면 세 번(4구간) 대신 한 번만 꺾는다 — 접점에서 카드가 놓인
  // 행 높이까지 수직으로, 그다음 카드까지 수평으로 (L자 2구간).
  singleBend?: boolean;
};

// Coordinates are calibrated against the rendered image in the browser
// (percent of the image's own box), not eyeballed off the source file.
export const nameTags: NameTag[] = [
  // 검은 고양이 — 왼쪽으로 뻗음
  { ko: "록 패션", en: "Rock Fashion", tier: "vibe", x: 25, y: 3, side: "left" },
  {
    ko: "스트럭처드 실루엣",
    en: "Structured",
    tier: "part",
    x: 23,
    y: 21,
    side: "left",
    touchX: 15,
    touchY: 42,
  },
  { ko: "슬링백", en: "Sling", tier: "part", x: 22, y: 71, side: "left", touchX: 22, touchY: 74 },
  {
    ko: "나파 레더",
    en: "Nappa",
    tier: "part",
    x: 29,
    y: 90,
    side: "left",
    depth: 46,
    touchX: 27,
    touchY: 84,
    singleBend: true,
  },

  // 흰 고양이 — 오른쪽으로 뻗음
  { ko: "놈코어룩", en: "Normcore", tier: "vibe", x: 63, y: 3, side: "right", noLine: true },
  {
    ko: "버킷 햇",
    en: "Bucket",
    tier: "part",
    x: 86,
    y: 19,
    side: "right",
    depth: 46,
    touchX: 80,
    touchY: 20,
  },
  { ko: "사첼 백", en: "Satchel", tier: "part", x: 91, y: 83, side: "right" },
  { ko: "워시드 데님", en: "Washed", tier: "part", x: 78, y: 57, side: "right" },
];
