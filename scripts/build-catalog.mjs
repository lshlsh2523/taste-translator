// mcm_full_catalog_pilot.csv → src/data/catalog.json
//
// 원본 CSV는 순수 콤마 구분(따옴표 없음, 필드에 콤마 없음)이라 정규식 CSV
// 파서 없이 단순 split(',')으로 안전하게 파싱된다 (656개 행 전수 확인됨,
// 모든 행이 정확히 8개 콤마).
//
// subcategory 데이터에 두 종류의 원본 스크래핑 결함이 있다:
//  1. "(전체)" — HANDOFF에 명시된 7개 카테고리(테크액세서리, 러기지백,
//     트래블액세서리, 트렁크, 트롤리더플백, 홈데코, 펫액세서리)는 원본
//     사이트 자체에 형태 세분류가 없음. 결측치가 아니라 원본에 없는 정보.
//  2. "모두보기"(76건) — 카테고리 개요 페이지로 스크랩되어 실제 형태
//     세분류를 못 얻은 상품. "(전체)"와 마찬가지로 형태 정보가 없는
//     상태이므로 동일하게 처리한다 (자세한 근거는 아래 CATALOG_NOTES 참고).
//  3. subcategory에 "/"가 섞인 6건 — 스크래핑 중 상품 슬러그가 다음 필드로
//     밀려들어간 것으로 보이는 원본 결함. "/" 앞부분만 실제 subcategory로
//     쓰고 나머지는 버린다.
//
// material_keywords는 임의로 지어낸 목록이 아니라, 656개 name_slug 전체를
// 토큰화해서 빈도 분석한 뒤 실제로 반복 등장하는 소재/패턴/가공 용어만
// 추린 화이트리스트로 추출한다 (색상 토큰은 name_slug에 실질적으로
// 존재하지 않아 커버리지에서 제외 — 아래 요약에 기록).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "../data/mcm_full_catalog_pilot.csv");
const OUT_PATH = path.join(__dirname, "../src/data/catalog.json");
const NOTES_PATH = path.join(__dirname, "../src/data/catalog-notes.json");

const NO_SHAPE_SUBCATEGORY = "(전체)";

// 소재/패턴/가공 키워드 화이트리스트: [정규화된 표기, 슬러그에서 매칭할 표기들]
// 656개 name_slug 토큰 빈도 분석 결과 상위권에 반복 등장하는 것만 포함.
const MATERIAL_KEYWORD_MAP = [
  ["비세토스", ["비세토스", "visetos"]],
  ["모노그램", ["모노그램"]],
  ["레더", ["레더", "가죽"]],
  ["나일론", ["나일론"]],
  ["스터드", ["스터드"]],
  ["데님", ["데님"]],
  ["자카드", ["자카드"]],
  ["다이아몬드", ["다이아몬드", "diamond", "diamant"]],
  ["퀼팅", ["퀼팅"]],
  ["실크", ["실크"]],
  ["코튼", ["코튼"]],
  ["오가닉", ["오가닉"]],
  ["양가죽", ["양가죽"]],
  ["카프스킨", ["카프스킨", "카프"]],
  ["프린트", ["프린트"]],
  ["엠보스드", ["엠보스드"]],
  ["리버서블", ["리버서블"]],
  ["메탈릭", ["메탈릭"]],
  ["트윌", ["트윌"]],
  ["니트", ["니트"]],
  ["헤링본", ["헤링본"]],
  ["시퀸", ["시퀸"]],
  ["루렉스", ["루렉스"]],
  ["스웨이드", ["스웨이드"]],
  ["립스탑", ["립스탑"]],
  ["폴리에스터", ["폴리에스터"]],
  ["에코닐", ["econyl"]],
  ["리사이클", ["리사이클"]],
  ["패치", ["패치"]],
  ["큐빅", ["큐빅"]],
  ["체인", ["체인"]],
  ["드로우스트링", ["드로우스트링"]],
];

// "미니백"은 name_slug(URL 기반)에 사이즈 정보가 아예 없어서 위
// MATERIAL_KEYWORD_MAP 방식(슬러그 텍스트 매칭)으로는 추출이 불가능하다.
// 대신 MCM 실제 미니백 필터 페이지(kr.mcmworldwide.com/ko_KR/가방/미니백)를
// 직접 열어 "미니"/"엑스트라 미니" 표기가 붙은 상품만 골라 SKU로
// 확인했다(2026-08-19, 76개 중 53개 — 나머지는 지갑/랜야드처럼 사이즈
// 라벨만 있고 "미니"라는 표기는 없는 액세서리라 제외). 이 SKU 목록에
// 속한 행은 material_keywords에 "미니"를 강제로 추가한다.
const MINI_BAG_SKUS = new Set([
  "MWDGADU01CO001", "MWDGADU03BK001", "MMLGATA04CO001", "MWRGATA01BK001",
  "MWRGSTA02CO001", "MWRGSTA02PZ001", "MWRGSTA01BK001", "MWRGSTA01OQ001",
  "MWRGSTA01QA001", "MWRGSXT01CO001", "MWRGSXT01BK001", "MWREATA01CO001",
  "MWRGSTA03BK001", "MYZGATA05CO001", "MYLFATA03CO001", "MYLFATA03PZ001",
  "MYLGSTA02BK001", "MWPGSMT024B001", "MWPGSMT02WT001", "MWPAATN04CO001",
  "MWPAATN04BK001", "MWPFSMT06PZ001", "MWPFAMT08K8001", "MWPAATN04I8001",
  "MWPGSMT04BK001", "MWPGSMT03WT001", "MWPFSMT03PZ001", "MWPFSMT03BK001",
  "MWBESEA01CO001", "MWBESEA01BK001", "MWBESEA01PZ001", "MMMEATA02CO001",
  "MMMEATA02BK001", "MMMEATA02K8001", "MMRESKK02VC001", "MMRESKK02BK001",
  "MMTGSTA04CO001", "MMTGSTA04BK001", "MYZGATA01CO001", "MYZGATA01BK001",
  "MMLGSTA03BK001", "MMLFSTA07BK001", "MWRESAK02CO001", "MWRGAAK01BK001",
  "MWRESAK01BK001", "MMRAAKC03CO001", "MWRAAVI01CO001", "MWPESAC04BK001",
  "MWPFSTA04BK001", "MWDESAC03DG001", "MWRGAXT01PZ001", "MMLGATA05K8001",
  "MWBAASE03CO001",
]);

function isMiniBag(row) {
  const skus = [row.primary_sku, ...row.color_variant_skus.split(";")];
  return skus.some((sku) => MINI_BAG_SKUS.has(sku));
}

function parseCsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row = {};
    header.forEach((key, i) => {
      row[key] = cells[i] ?? "";
    });
    return row;
  });
}

function extractMaterialKeywords(slug) {
  const lower = slug.toLowerCase();
  const found = [];
  for (const [canonical, variants] of MATERIAL_KEYWORD_MAP) {
    if (variants.some((v) => lower.includes(v.toLowerCase()))) {
      found.push(canonical);
    }
  }
  return found;
}

function normalizeSubcategory(raw, notes) {
  if (raw.includes("/")) {
    notes.compositeFixed += 1;
    return raw.split("/")[0] || NO_SHAPE_SUBCATEGORY;
  }
  if (raw === "모두보기") {
    notes.seeAllNormalized += 1;
    return NO_SHAPE_SUBCATEGORY;
  }
  return raw;
}

function slugToName(slug) {
  return slug
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const csvText = readFileSync(CSV_PATH, "utf-8");
const rows = parseCsv(csvText);

const notes = {
  totalProducts: rows.length,
  compositeFixed: 0,
  seeAllNormalized: 0,
  noShapeSubcategoryCount: 0,
  withMaterialKeywords: 0,
};

const catalog = rows.map((row) => {
  const subcategory = normalizeSubcategory(row.subcategory, notes);
  if (subcategory === NO_SHAPE_SUBCATEGORY) notes.noShapeSubcategoryCount += 1;

  const materialKeywords = extractMaterialKeywords(row.name_slug);
  if (isMiniBag(row)) materialKeywords.push("미니");
  if (materialKeywords.length > 0) notes.withMaterialKeywords += 1;

  return {
    name: slugToName(row.name_slug),
    department: row.department,
    category: row.category,
    subcategory,
    material_keywords: materialKeywords,
    image: row.image_url_guess,
    product_url: row.product_url,
    primary_sku: row.primary_sku,
    num_colors: Number(row.num_colors) || 1,
  };
});

notes.materialKeywordCoveragePct = Number(
  ((notes.withMaterialKeywords / notes.totalProducts) * 100).toFixed(1),
);
notes.colorInSlugCoverage =
  "name_slug에는 색상 토큰이 사실상 없음 (656개 중 실질 매칭 1건) — 색상 신호는 material_keywords만으로는 커버되지 않음, 상세 정보 스크래핑 완료 전까지 이미지 신호(0~3점)가 색상 판단을 대신함";

mkdirSync(path.dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(catalog, null, 2), "utf-8");
writeFileSync(NOTES_PATH, JSON.stringify(notes, null, 2), "utf-8");

console.log(`catalog.json 생성 완료: ${catalog.length}개 상품`);
console.log(JSON.stringify(notes, null, 2));
