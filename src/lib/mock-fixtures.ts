import type { TranslateResponse } from "@/types/taste";

// 할당량 0으로 화면(로딩/성공/인접 폴백/실패 카드, 색상 정렬, "이런 무드도
// 감지했어요" 등)만 확인하고 싶을 때 쓰는 목업. 전부 실제 API 응답에서
// 그대로 가져온 값이라(제품명·이미지·링크 다 진짜) 화면 검증용으로
// 충분히 사실적이다. GEMINI_API_KEY 없이도 켤 수 있음.
//
// 켜는 법: .env.local에 MOCK_TRANSLATE=1 추가하고 개발 서버 재시작.
// 검색어에 "실패"가 들어가면 no_match, "인접"이 들어가면 adjacent_fallback,
// 그 외엔 success 화면을 보여준다.

const MOCK_SUCCESS: Extract<TranslateResponse, { status: "success" }> = {
  status: "success",
  query: "가죽 재킷에 스터드 박힌, 반항적이고 거친 록 느낌",
  matchedTerm: {
    term: "록 패션 (Rock Fashion)",
    trust_level: "통용어",
    reason: "사용자가 묘사한 가죽 재킷, 스터드 장식, 그리고 반항적이고 거친 록 느낌이라는 표현이 록 패션의 정의와 정확히 연결됩니다.",
    matching_keywords: ["가죽", "스터드", "록"],
    confidence: 0.95,
  },
  matchedTermOrigins: {
    "록 패션 (Rock Fashion)": "록 음악 문화에서 파생, 가죽 재킷과 스터드 장식이 특징",
    "펑크 룩 (Punk)": "1970년대 펑크 록 문화에서 파생, DIY 정신과 반항적 디테일이 특징",
    "메탈 룩 (Metal Look)": "헤비메탈 음악 문화, 타투 그래픽, 록밴드 스타일을 강조하는 다크하고 반항적인 스타일",
  },
  matchedTermHistory:
    "오토바이용 가죽 재킷 '페르펙토(Perfecto)'는 1953년 영화 위험한 질주에서 말론 브란도가 입으며 반항적 청년문화의 상징이 됐다. 이 이미지를 1970년대 라몬즈 등 펑크·록 밴드가 무대 의상으로 차용했고, 블론디·조앤 제트 등 여성 록스타들이 스터드·체인 장식을 더하면서 지금의 록 패션 스타일이 완성됐다.",
  matchedTermCharacteristics: "블랙 가죽 재킷, 스터드, 체인, 두꺼운 벨트 등 금속 하드웨어가 핵심이며 거칠고 반항적인 무드를 표현",
  moodColor: "#7a2e2e",
  moodEmoji: "⛓️",
  usedFallbackRank: 0,
  luxuryTerms: [
    {
      term: "메신저 백 (Messenger Bag)",
      origin: "자전거 배달원(bike messenger)이 편하게 매던 크로스바디 형태에서 유래",
      kind: "shape",
      matching_mood: ["실용적", "캐주얼"],
      mcm_subcategory: ["크로스백"],
    },
    {
      term: "벨트백 (Belt Bag)",
      origin: "허리에 두르는 형태, 1980~90년대 힙합·스트리트 신에서 유행하며 대중화",
      kind: "shape",
      matching_mood: ["스트리트", "캐주얼", "실용적"],
      mcm_subcategory: ["벨트백"],
    },
    {
      term: "스터드",
      origin: "오토바이 재킷·펑크록 문화에서 온 금속 돌기 장식",
      kind: "material",
      matching_mood: ["반항적", "스트리트"],
      material_keywords: ["스터드"],
    },
    {
      term: "체인",
      origin: "금속 고리를 엮은 체인 하드웨어, 가방 스트랩이나 장식으로 사용",
      kind: "material",
      matching_mood: ["스트리트", "반항적"],
      material_keywords: ["체인"],
    },
  ],
  products: [
    {
      product_name: "stark 갤러틱 갈라 양가죽 백팩",
      total_score: 5,
      match_summary: "이 취향과 겹치는 지점: 소재(가죽), 이미지 무드",
      match_breakdown: {
        shape_match: false,
        material_match: ["가죽"],
        visual_match_score: 3,
        visual_match_reason: "전면에 촘촘히 박힌 스터드 디테일과 올 블랙 레더가 록 패션 특유의 강렬하고 과감한 무드를 완성합니다.",
        color_match: true,
        color_reason: "사용자가 특정 색상을 언급하지 않았습니다.",
      },
      image: "https://images.mcmworldwide.com/i/mcmworldwide/MMKGSVE05BK001_01/MMKGSVE05BK001/stark-갤러틱-갈라-양가죽-백팩?$large$&fmt=auto&qlt=default",
      product_url: "https://kr.mcmworldwide.com/ko_KR/%EB%82%A8%EC%84%B1/%EA%B0%80%EB%B0%A9/%EB%B0%B1%ED%8C%A9/stark-%EA%B0%A4%EB%9F%AC%ED%8B%B1-%EA%B0%88%EB%9D%BC-%EC%96%91%EA%B0%80%EC%A3%BD-%EB%B0%B1%ED%8C%A9/MMKGSVE05BK001.html",
      primary_sku: "MMKGSVE05BK001",
      max_score: 6,
    },
    {
      product_name: "fursten 맥시 모노그램 레더 벨트백",
      total_score: 5,
      match_summary: "이 취향과 겹치는 지점: 형태(벨트백), 소재(가죽)",
      match_breakdown: {
        shape_match: true,
        material_match: ["가죽"],
        visual_match_score: 2,
        visual_match_reason: "시크한 블랙 레더 재질과 벨트백 실루엣이 스트리트 록 감성을 잘 표현합니다.",
        color_match: true,
        color_reason: "사용자가 특정 색상을 언급하지 않았습니다.",
      },
      image: "https://images.mcmworldwide.com/i/mcmworldwide/MMZESFI01BK001_01/MMZESFI01BK001/fursten-맥시-모노그램-레더-벨트백?$large$&fmt=auto&qlt=default",
      product_url: "https://kr.mcmworldwide.com/ko_KR/%EB%82%A8%EC%84%B1/%EA%B0%80%EB%B0%A9/%EB%B2%A8%ED%8A%B8%EB%B0%B1/fursten-%EB%A7%A5%EC%8B%9C-%EB%AA%A8%EB%85%B8%EA%B7%B8%EB%9E%A8-%EB%A0%88%EB%8D%94-%EB%B2%A8%ED%8A%B8%EB%B0%B1/MMZESFI01BK001.html",
      primary_sku: "MMZESFI01BK001",
      max_score: 6,
    },
    {
      product_name: "aren 다이아몬드 퀼팅 레더 크로스바디",
      total_score: 5,
      match_summary: "이 취향과 겹치는 지점: 형태(크로스백), 소재(가죽)",
      match_breakdown: {
        shape_match: true,
        material_match: ["가죽"],
        visual_match_score: 2,
        visual_match_reason: "입체적인 다이아몬드 퀼팅과 다크 메탈 하드웨어가 어우러져 엣지 있는 분위기를 자아냅니다.",
        color_match: true,
        color_reason: "사용자가 특정 색상을 언급하지 않았습니다.",
      },
      image: "https://images.mcmworldwide.com/i/mcmworldwide/MMRGATA05BK001_01/MMRGATA05BK001/aren-다이아몬드-퀼팅-레더-크로스바디?$large$&fmt=auto&qlt=default",
      product_url: "https://kr.mcmworldwide.com/ko_KR/%EB%82%A8%EC%84%B1/%EA%B0%80%EB%B0%A9/%ED%81%AC%EB%A1%9C%EC%8A%A4%EB%B0%B1/aren-%EB%8B%A4%EC%9D%B4%EC%95%84%EB%AA%AC%EB%93%9C-%ED%80%BC%ED%8C%85-%EB%A0%88%EB%8D%94-%ED%81%AC%EB%A1%9C%EC%8A%A4%EB%B0%94%EB%94%94/MMRGATA05BK001.html",
      primary_sku: "MMRGATA05BK001",
      max_score: 6,
    },
  ],
  allMatchedTerms: [
    {
      term: "록 패션 (Rock Fashion)",
      trust_level: "통용어",
      reason: "사용자가 묘사한 가죽 재킷, 스터드 장식, 그리고 반항적이고 거친 록 느낌이라는 표현이 록 패션의 정의와 정확히 연결됩니다.",
      matching_keywords: ["가죽", "스터드", "록"],
      confidence: 0.95,
    },
    {
      term: "펑크 룩 (Punk)",
      trust_level: "통용어",
      reason: "입력에 포함된 스터드 장식과 거칠고 반항적인 무드가 펑크 문화의 핵심 특징 및 디테일과 잘 일치합니다.",
      matching_keywords: ["스터드", "반항적", "거친"],
      confidence: 0.88,
    },
    {
      term: "메탈 룩 (Metal Look)",
      trust_level: "통용어",
      reason: "헤비메탈과 록 음악 문화에서 파생된 다크하고 반항적인 연출 및 스터드 요소가 사용자 입력의 느낌과 통합니다.",
      matching_keywords: ["스터드", "반항적"],
      confidence: 0.82,
    },
  ],
};

const MOCK_ADJACENT: Extract<TranslateResponse, { status: "adjacent_fallback" }> = {
  status: "adjacent_fallback",
  query: "조용한데 눈에 띄는, 돈 많아 보이지만 그걸 은은하게 숨기는 차분하고 멋있는 사람",
  allMatchedTerms: [
    {
      term: "올드머니 룩 (Old Money)",
      trust_level: "통용어",
      reason: "사용자의 \"돈 많아 보이지만 그걸 은은하게 숨기는\"이라는 표현이 대대로 부유한 상류층의 절제된 옷차림을 지칭하는 올드머니 룩의 핵심 개념과 정확히 일치합니다.",
      matching_keywords: ["브라운", "베이지", "꼬냑", "가죽", "클래식한 로고"],
      confidence: 1,
    },
    {
      term: "미니멀룩 (Minimalism)",
      trust_level: "통용어",
      reason: "\"조용한데 눈에 띄는\", \"차분하고 멋있는\"이라는 표현은 장식을 절제하고 실루엣과 소재감으로 승부하며 고급스러움을 은은하게 드러내는 미니멀룩의 특징과 잘 연결됩니다.",
      matching_keywords: ["블랙", "화이트", "그레이", "가죽", "심플한 실루엣"],
      confidence: 0.9,
    },
  ],
  adjacentTerms: [
    {
      term: "올드머니 룩 (Old Money)",
      trust_level: "통용어",
      origin: "대대로 부유한 상류층의 절제되고 클래식한 옷차림을 지칭",
      linked_luxury_terms: ["탑 핸들 백 (Top Handle Bag)", "쇼퍼 & 토트 백 (Shopper & Tote)", "헤링본"],
      shared_luxury_terms: ["탑 핸들 백 (Top Handle Bag)", "헤링본"],
    },
    {
      term: "미니멀룩 (Minimalism)",
      trust_level: "통용어",
      origin: "장식을 절제하고 실루엣과 소재감으로 승부하는 스타일",
      linked_luxury_terms: ["탑 핸들 백 (Top Handle Bag)", "사첼 백 (Satchel)"],
      shared_luxury_terms: ["탑 핸들 백 (Top Handle Bag)"],
    },
  ],
  moodColor: "#6b4a2f",
  moodEmoji: "🤎",
};

const MOCK_NO_MATCH: Extract<TranslateResponse, { status: "no_match" }> = {
  status: "no_match",
  query: "실패 테스트용 검색어",
  reason: "죄송해요, 지금 라이브러리로는 이 취향에 맞는 제품을 찾기 어려워요.",
};

// MOCK_ADJACENT의 "올드머니 룩" 카드를 클릭했을 때 보여줄 화면 — 실제
// retryWithTerm처럼 below_threshold(취향 용어는 잘 맞지만 제품 일치도는
// 기준 미달)를 재현해서, 인접 카드 클릭 흐름을 로컬에서 녹화용으로
// 확인할 수 있게 한다.
const MOCK_OLDMONEY: Extract<TranslateResponse, { status: "success" }> = {
  status: "success",
  query: "올드머니 룩 (Old Money)",
  matchedTerm: {
    term: "올드머니 룩 (Old Money)",
    trust_level: "통용어",
    reason: "",
    matching_keywords: ["브라운", "베이지", "꼬냑", "가죽", "클래식한 로고"],
    confidence: 0,
  },
  matchedTermOrigins: {
    "올드머니 룩 (Old Money)": "대대로 부유한 상류층의 절제되고 클래식한 옷차림을 지칭",
  },
  matchedTermHistory:
    "여러 세대에 걸쳐 부를 물려받은 유럽·미국 상류층을 가리키던 말로, 아이비리그 프레피 문화의 절제된 옷차림 전통이 이어져오다 2022~2023년 무렵 SNS에서 '올드머니 에스테틱(Old Money Aesthetic)' 해시태그로 확산되며 대중적인 패션 트렌드 용어로 자리잡았다.",
  matchedTermCharacteristics: "브랜드 로고를 드러내지 않는 고급 소재와 단정한 핏이 핵심이며 은은한 부유함을 표현",
  matchedTermIsSynthetic: true,
  moodColor: "#6b4a2f",
  moodEmoji: "🤎",
  usedFallbackRank: 0,
  belowThreshold: true,
  luxuryTerms: [
    {
      term: "탑 핸들 백 (Top Handle Bag)",
      origin: "짧은 손잡이로 손에 들거나 팔에 거는 방식, 격식 있고 단정한 인상",
      kind: "shape",
      matching_mood: ["오피스룩", "포멀함"],
      mcm_subcategory: ["탑-핸들백"],
    },
    {
      term: "쇼퍼 & 토트 백 (Shopper & Tote)",
      origin: "\"나르다(tote)\"라는 뜻에서 유래, 개방형 상단과 넉넉한 수납공간이 특징",
      kind: "shape",
      matching_mood: ["실용적", "데일리 캐주얼"],
      mcm_subcategory: ["쇼퍼-토트백"],
    },
    {
      term: "헤링본",
      origin: "청어(herring)의 뼈 모양을 닮은 V자 지그재그 직조 패턴",
      kind: "material",
      matching_mood: ["클래식", "정교함"],
      material_keywords: ["헤링본"],
    },
  ],
  products: [
    {
      product_name: "ella 맥시 모노그램 레더 보스턴 백",
      total_score: 2,
      match_summary: "이 취향과 겹치는 지점: 소재(가죽), 클래식한 실루엣",
      match_breakdown: {
        shape_match: false,
        material_match: ["가죽"],
        visual_match_score: 1,
        visual_match_reason: "모노그램이 다소 눈에 띄어 절제된 올드머니 무드와는 살짝 거리가 있습니다.",
        color_match: true,
        color_reason: "사용자가 특정 색상을 언급하지 않았습니다.",
      },
      image:
        "https://images.mcmworldwide.com/i/mcmworldwide/MWBESEA04BK001_01/MWBESEA04BK001/ella-맥시-모노그램-레더-보스턴-백?$large$&fmt=auto&qlt=default",
      product_url:
        "https://kr.mcmworldwide.com/ko_KR/%EC%97%AC%EC%84%B1/%ED%95%B8%EB%93%9C%EB%B0%B1/%ED%83%91-%ED%95%B8%EB%93%A4%EB%B0%B1/ella-%EB%A7%A5%EC%8B%9C-%EB%AA%A8%EB%85%B8%EA%B7%B8%EB%9E%A8-%EB%A0%88%EB%8D%94-%EB%B3%B4%EC%8A%A4%ED%84%B4-%EB%B0%B1/MWBESEA04BK001.html",
      primary_sku: "MWBESEA04BK001",
      max_score: 6,
    },
    {
      product_name: "aren ECONYL®과 가죽 마마 쇼퍼",
      total_score: 2,
      match_summary: "이 취향과 겹치는 지점: 형태(쇼퍼백), 소재(가죽)",
      match_breakdown: {
        shape_match: true,
        material_match: ["가죽"],
        visual_match_score: 1,
        visual_match_reason: "쇼퍼백 실루엣은 클래식하지만, 캐주얼한 소재감이 올드머니 특유의 격식과는 다소 거리가 있습니다.",
        color_match: true,
        color_reason: "사용자가 특정 색상을 언급하지 않았습니다.",
      },
      image:
        "https://images.mcmworldwide.com/i/mcmworldwide/MWPFATA01BK001_01/MWPFATA01BK001/aren-econyl®과-가죽-마마-쇼퍼?$large$&fmt=auto&qlt=default",
      product_url:
        "https://kr.mcmworldwide.com/ko_KR/%EC%97%AC%EC%84%B1/%ED%95%B8%EB%93%9C%EB%B0%B1/%EC%87%BC%ED%8D%BC-%ED%86%A0%ED%8A%B8%EB%B0%B1/aren-econyl%C2%AE%EA%B3%BC-%EA%B0%80%EC%A3%BD-%EB%A7%88%EB%A7%88-%EC%87%BC%ED%8D%BC/MWPFATA01BK001.html",
      primary_sku: "MWPFATA01BK001",
      max_score: 6,
    },
  ],
  allMatchedTerms: [
    {
      term: "올드머니 룩 (Old Money)",
      trust_level: "통용어",
      reason: "",
      matching_keywords: ["브라운", "베이지", "꼬냑", "가죽", "클래식한 로고"],
      confidence: 0,
    },
  ],
};

export function isMockEnabled(): boolean {
  return process.env.MOCK_TRANSLATE === "1";
}

export function getMockResponse(query: string): TranslateResponse {
  if (query.includes("실패")) return { ...MOCK_NO_MATCH, query };
  if (query.includes("인접")) return { ...MOCK_ADJACENT, query };
  return { ...MOCK_SUCCESS, query };
}

export function getMockRetryResponse(term: string): TranslateResponse {
  if (term.includes("올드머니")) return MOCK_OLDMONEY;
  return { ...MOCK_SUCCESS, query: term };
}
