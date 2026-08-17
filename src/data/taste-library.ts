// 취향 용어 카드(55개) + 럭셔리 전문 용어 카드(27개).
//
// 출처:
// - 취향 용어: 나무위키 "분류:패션 스타일" + "에스테틱" 문서 기반, CC BY-NC-SA
//   2.0 KR 라이선스 원문을 그대로 복사하지 않고 재작성함. 신뢰 등급은 전부
//   "통용어"(집단 편집 위키 기반).
// - 럭셔리 용어: MCM 사이트의 실제 "스타일(형태)" 필터 값 11개(가방) +
//   지갑/의류/슈즈/패션소품 카테고리 16개, 총 27개.
//
// ⚠️ 카드 개수 참고: 이전 세션 문서(HANDOFF)에는 "45개"로 기록돼 있었지만,
// 실제로 전달받은 카드 원문을 세어보면 55개다(패션 스타일 43 + 에스테틱
// 12). 하나도 빠뜨리지 않고 전달받은 그대로 옮겼다 — 숫자를 맞추려고
// 임의로 줄이지 않음.
//
// linked_luxury_terms는 럭셔리 용어 카드의 term과 정확히 문자열이 일치해야
// 한다(예: "미니백 (Mini Bag)"). 원문에 "크로스백"처럼 럭셔리 용어 카드에
// 없는 축약 표현이 쓰인 경우, 문맥상 가장 가까운 카드로 정규화했다
// (예: "크로스백" → "메신저 백 (Messenger Bag)", MCM subcategory가
// "크로스백"인 카드가 메신저 백뿐이라서).

import type { LuxuryTermCard, TasteLibrary, TasteTermCard } from "@/types/taste";

const luxuryTerms: LuxuryTermCard[] = [
  {
    term: "사첼 백 (Satchel)",
    origin: "영국 학생·학자가 책을 넣고 다니던, 각이 잡힌 직사각형 가방",
    shape_features: "각진 직사각형 실루엣",
    matching_mood: ["단정함", "지적인 인상"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "호보 백 (Hobo)",
    origin: "초승달 모양의 부드럽고 여유로운 실루엣, 어깨에 자연스럽게 걸치는 형태",
    shape_features: "초승달 모양의 부드러운 실루엣",
    matching_mood: ["편안함", "힘 뺀 스타일링"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "버킷 백 (Bucket Bag)",
    origin: "양동이 모양의 원통형 실루엣, 드로스트링(끈 조임)으로 여미는 방식",
    shape_features: "원통형 실루엣, 드로스트링 여밈",
    matching_mood: ["캐주얼", "볼륨감 있는 스트리트 무드"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "탑 핸들 백 (Top Handle Bag)",
    origin: "짧은 손잡이로 손에 들거나 팔에 거는 방식, 격식 있고 단정한 인상",
    shape_features: "짧은 상단 손잡이",
    matching_mood: ["오피스룩", "포멀함"],
    mcm_subcategory: ["탑-핸들백"],
  },
  {
    term: "보스톤 백 (Boston Bag)",
    origin:
      "1900년대 초 미국 대학생들이 쓰던 원통형 스포츠 더플백에서 유래, 반원형 바닥이 특징 (MCM 라인업 상 보스톤 라인)",
    shape_features: "원통형, 반원형 바닥",
    matching_mood: ["캐주얼하면서도 클래식함"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "메신저 백 (Messenger Bag)",
    origin:
      "자전거 배달원(bike messenger)이 편하게 매던 크로스바디 형태에서 유래 (MCM 라인업 상 남성 라인 다수)",
    shape_features: "크로스바디 형태",
    matching_mood: ["실용적", "캐주얼"],
    mcm_subcategory: ["크로스백"],
  },
  {
    term: "쇼퍼 & 토트 백 (Shopper & Tote)",
    origin: "\"나르다(tote)\"라는 뜻에서 유래, 개방형 상단과 넉넉한 수납공간이 특징",
    shape_features: "개방형 상단, 넉넉한 수납공간",
    matching_mood: ["실용적", "데일리 캐주얼"],
    mcm_subcategory: ["쇼퍼-토트백"],
  },
  {
    term: "백팩 (Backpack)",
    origin: "양쪽 어깨에 메는 형태, 원래 등산·군용 장비에서 시작해 일상복화됨",
    shape_features: "양쪽 어깨끈",
    matching_mood: ["캐주얼", "활동적"],
    mcm_subcategory: ["백팩"],
  },
  {
    term: "벨트백 (Belt Bag / Fanny Pack)",
    origin: "허리에 두르는 형태, 1980~90년대 힙합·스트리트 신에서 유행하며 대중화",
    shape_features: "허리에 두르는 형태",
    matching_mood: ["스트리트", "캐주얼", "실용적"],
    mcm_subcategory: ["벨트백"],
  },
  {
    term: "미니백 (Mini Bag)",
    origin: "수납보다 장식성에 방점, 2010년대 후반 SNS 시대에 \"포토제닉함\"으로 유행",
    shape_features: "작은 사이즈, 장식성 강조",
    matching_mood: ["발랄함", "트렌디", "파티룩"],
    mcm_subcategory: ["미니백"],
  },
  {
    term: "클러치 (Clutch)",
    origin: "손잡이 없이 손에 쥐는 형태, 정장·이브닝룩에서 격식을 더할 때 사용",
    shape_features: "손잡이 없는 형태",
    matching_mood: ["포멀", "이브닝", "세련됨"],
    mcm_subcategory: ["클러치-파우치"],
  },
  {
    term: "장지갑 (Long Wallet)",
    origin: "지폐를 접지 않고 그대로 넣을 수 있는 길쭉한 형태",
    shape_features: "길쭉한 형태",
    matching_mood: ["격식 있는", "정돈된"],
    mcm_subcategory: ["장지갑"],
  },
  {
    term: "반지갑 (Bifold Wallet)",
    origin: "지폐를 한 번 접어 넣는 반으로 접히는 형태, 휴대성이 좋음",
    shape_features: "반으로 접히는 형태",
    matching_mood: ["실용적", "데일리"],
    mcm_subcategory: ["반지갑", "반지갑-머니클립"],
  },
  {
    term: "카드지갑 (Card Holder)",
    origin: "카드 몇 장만 최소한으로 수납하는 슬림한 형태",
    shape_features: "슬림한 형태",
    matching_mood: ["미니멀", "심플"],
    mcm_subcategory: ["카드지갑-키홀더", "카드지갑-레더소품"],
  },
  {
    term: "체인 지갑 (Chain Wallet)",
    origin: "체인으로 벨트에 연결해 분실을 방지하는 형태, 록·펑크 문화에서 유래",
    shape_features: "체인 연결 형태",
    matching_mood: ["스트리트", "반항적"],
    mcm_subcategory: ["체인-지갑"],
  },
  {
    term: "테일러드 재킷 (Tailored Jacket)",
    origin: "정장 재단 기법을 적용한 구조적인 실루엣의 재킷",
    shape_features: "구조적인 실루엣",
    matching_mood: ["오피스", "단정함"],
    mcm_subcategory: ["재킷-코트"],
  },
  {
    term: "니트웨어 (Knitwear)",
    origin: "편물 기법으로 짠 부드럽고 따뜻한 소재의 옷",
    shape_features: "편물 소재",
    matching_mood: ["아늑함", "캐주얼"],
    mcm_subcategory: ["니트웨어-후디"],
  },
  {
    term: "오버사이즈 핏 (Oversized Fit)",
    origin: "몸에 맞지 않게 넉넉하게 재단된 캐주얼 실루엣",
    shape_features: "넉넉한 실루엣",
    matching_mood: ["편안함", "스트리트"],
    mcm_subcategory: ["티셔츠-셔츠", "티셔츠-탑"],
  },
  {
    term: "A라인 스커트 (A-line Skirt)",
    origin: "허리에서 밑단으로 갈수록 퍼지는 A자 모양 실루엣",
    shape_features: "A자 모양 실루엣",
    matching_mood: ["페미닌", "클래식"],
    mcm_subcategory: ["스커트-팬츠"],
  },
  {
    term: "로퍼 (Loafers)",
    origin: "끈·버클 없이 슬립온으로 신는 격식 있는 신발, 원래 승마용에서 유래",
    shape_features: "슬립온 형태",
    matching_mood: ["프레피", "클래식"],
    mcm_subcategory: ["로퍼-부츠"],
  },
  {
    term: "첼시 부츠 (Chelsea Boots)",
    origin: "발목까지 오는 길이에 사이드 밴드로 신고 벗는 심플한 부츠",
    shape_features: "발목 길이, 사이드 밴드",
    matching_mood: ["시크", "도시적"],
    mcm_subcategory: ["부츠"],
  },
  {
    term: "스니커즈 (Sneakers)",
    origin: "운동화에서 파생된 캐주얼 신발, 다양한 스타일로 일상화됨",
    shape_features: "운동화 형태",
    matching_mood: ["캐주얼", "스트리트"],
    mcm_subcategory: ["스니커즈"],
  },
  {
    term: "슬라이드 샌들 (Slide Sandals)",
    origin: "끈 없이 발을 슬라이드해서 신는 개방형 샌들",
    shape_features: "개방형, 슬라이드 형태",
    matching_mood: ["캐주얼", "여름"],
    mcm_subcategory: ["샌들-슬라이드"],
  },
  {
    term: "실크 스카프 (Silk Scarf)",
    origin: "목이나 가방에 매는 얇고 부드러운 실크 소재 스카프",
    shape_features: "얇고 부드러운 소재",
    matching_mood: ["우아함", "클래식"],
    mcm_subcategory: ["스카프-머플러", "쁘띠-스카프-스카프"],
  },
  {
    term: "버킷햇 (Bucket Hat)",
    origin: "양동이 모양의 챙이 둥글게 내려오는 캐주얼 모자",
    shape_features: "둥근 챙",
    matching_mood: ["스트리트", "캐주얼"],
    mcm_subcategory: ["모자"],
  },
  {
    term: "벨트 (Belt)",
    origin: "허리에 두르는 가죽·패브릭 액세서리, 버클 디자인이 브랜드 아이덴티티를 드러냄",
    shape_features: "허리에 두르는 형태",
    matching_mood: ["버클 디자인에 따라 다양"],
    mcm_subcategory: ["벨트"],
  },
  {
    term: "참 키링 (Charm Keyring)",
    origin: "가방에 매다는 작은 장식용 참 액세서리",
    shape_features: "작은 장식용 형태",
    matching_mood: ["발랄함", "꾸미기"],
    mcm_subcategory: ["가방-액세서리-참-장식"],
  },
];

const L = {
  satchel: "사첼 백 (Satchel)",
  hobo: "호보 백 (Hobo)",
  bucket: "버킷 백 (Bucket Bag)",
  topHandle: "탑 핸들 백 (Top Handle Bag)",
  boston: "보스톤 백 (Boston Bag)",
  messenger: "메신저 백 (Messenger Bag)",
  shopperTote: "쇼퍼 & 토트 백 (Shopper & Tote)",
  backpack: "백팩 (Backpack)",
  beltBag: "벨트백 (Belt Bag / Fanny Pack)",
  miniBag: "미니백 (Mini Bag)",
  clutch: "클러치 (Clutch)",
} as const;

const tasteTerms: TasteTermCard[] = [
  {
    term: "Y2K",
    trust_level: "통용어",
    origin: "2000년대 초반 밀레니엄 감성을 재소환한 트렌드. 메탈릭, 로우라이즈, 로고 플레이가 특징",
    matching_keywords: ["실버", "메탈릭", "로고 플레이", "볼드함"],
    linked_luxury_terms: [L.miniBag, L.beltBag],
  },
  {
    term: "갸루 (Gyaru)",
    trust_level: "통용어",
    origin: "1990년대 일본에서 시작된 서브컬처, 화려한 메이크업과 태닝, 과감한 액세서리가 특징",
    matching_keywords: ["화려함", "골드", "볼드한 로고"],
    linked_luxury_terms: [L.miniBag, L.clutch],
  },
  {
    term: "고스 룩 (Goth)",
    trust_level: "통용어",
    origin: "어둡고 신비로운 무드, 블랙 위주 컬러와 실버 장식이 특징",
    matching_keywords: ["블랙", "실버", "다크한"],
    linked_luxury_terms: [L.beltBag, L.messenger],
  },
  {
    term: "고스로리 (Gothic Lolita)",
    trust_level: "통용어",
    origin: "고스 룩과 로리타 패션이 결합된 형태, 다크한 톤에 프릴·리본 장식이 섞임",
    matching_keywords: ["블랙", "리본·레이스", "로맨틱하면서 다크한"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "고프코어 (Gorpcore)",
    trust_level: "통용어",
    origin: "등산·아웃도어 장비를 일상복화한 트렌드, 기능성 소재가 특징",
    matching_keywords: ["나일론", "캐주얼", "기능적인"],
    linked_luxury_terms: [L.messenger, L.bucket],
  },
  {
    term: "그런지 패션 (Grunge)",
    trust_level: "통용어",
    origin: "1990년대 록 음악에서 파생, 헤진 듯한 레이어드와 다크 톤의 반항적 무드",
    matching_keywords: ["블랙", "다크", "가죽", "빈티지한"],
    linked_luxury_terms: [L.messenger, L.beltBag],
  },
  {
    term: "꾸안꾸",
    trust_level: "통용어",
    origin: "\"꾸민 듯 안 꾸민 듯\"의 줄임말, 자연스럽고 힘 뺀 스타일링 (순수 한국어 조어, 대응 영문명 없음)",
    matching_keywords: ["심플한", "자연스러운", "무채색"],
    linked_luxury_terms: [L.hobo, L.shopperTote],
  },
  {
    term: "남친룩 (Boyfriend Look)",
    trust_level: "통용어",
    origin: "남자친구의 옷을 빌려 입은 듯한 오버사이즈 캐주얼 스타일링",
    matching_keywords: ["오버사이즈", "캐주얼", "편안함"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "놈코어룩 (Normcore)",
    trust_level: "통용어",
    origin: "\"평범함(normal)\"을 미학으로 삼는 스타일, 화려함을 의도적으로 배제",
    matching_keywords: ["블랙", "그레이", "네이비", "무난한", "절제된"],
    linked_luxury_terms: [L.topHandle, L.backpack],
  },
  {
    term: "데코라계 (Decora)",
    trust_level: "통용어",
    origin: "일본 하라주쿠에서 시작된 화려한 액세서리 다중 착용 스타일",
    matching_keywords: ["파스텔톤", "참·장식 다중", "발랄함"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "독기룩",
    trust_level: "통용어",
    origin: "강렬하고 도발적인 인상을 주는 스타일링, 몸매를 강조하는 실루엣 (순수 한국어 조어, 대응 영문명 없음)",
    matching_keywords: ["블랙", "타이트한 실루엣", "강렬한"],
    linked_luxury_terms: [L.clutch, L.miniBag],
  },
  {
    term: "드뮤어룩 (Demure)",
    trust_level: "통용어",
    origin: "2020년대 중반 SNS에서 확산, 얌전하고 단정한(\"demure\") 인상을 강조",
    matching_keywords: ["뉴트럴톤", "단정함", "절제된"],
    linked_luxury_terms: [L.topHandle, L.clutch],
  },
  {
    term: "로리타 패션 (Lolita Fashion)",
    trust_level: "통용어",
    origin: "빅토리아 시대 인형 같은 실루엣, 프릴과 레이스가 특징인 일본발 서브컬처",
    matching_keywords: ["파스텔", "화이트", "리본·레이스", "소녀적인"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "록 패션 (Rock Fashion)",
    trust_level: "통용어",
    origin: "록 음악 문화에서 파생, 가죽 재킷과 스터드 장식이 특징",
    matching_keywords: ["블랙", "가죽", "스터드 장식"],
    linked_luxury_terms: [L.messenger, L.beltBag],
  },
  {
    term: "메탈 룩 (Metal Look)",
    trust_level: "통용어",
    origin: "메탈릭 소재와 은색 톤을 강조하는 미래적이고 강렬한 스타일",
    matching_keywords: ["실버", "메탈릭", "볼드함"],
    linked_luxury_terms: [L.miniBag, L.clutch],
  },
  {
    term: "모드 룩 (Mod Look)",
    trust_level: "통용어",
    origin: "1960년대 영국에서 시작, 기하학적이고 정제된 실루엣이 특징",
    matching_keywords: ["블랙", "화이트", "기하학적", "도시적인"],
    linked_luxury_terms: [L.topHandle],
  },
  {
    term: "미니멀룩 (Minimalism)",
    trust_level: "통용어",
    origin: "장식을 절제하고 실루엣과 소재감으로 승부하는 스타일",
    matching_keywords: ["블랙", "화이트", "그레이", "가죽", "심플한 실루엣"],
    linked_luxury_terms: [L.topHandle, L.satchel],
  },
  {
    term: "미시룩 (Missy Look)",
    trust_level: "통용어",
    origin: "세련되고 단정한 인상의 30~40대 여성 캐주얼 스타일",
    matching_keywords: ["뉴트럴톤", "단정함", "편안한 우아함"],
    linked_luxury_terms: [L.shopperTote, L.topHandle],
  },
  {
    term: "밀리터리 룩 (Military Look)",
    trust_level: "통용어",
    origin: "군복에서 파생된 스타일, 카키·올리브 톤과 기능적인 디테일이 특징",
    matching_keywords: ["카키", "올리브", "기능적인", "견고한"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "발레코어 (Balletcore)",
    trust_level: "통용어",
    origin: "발레 무용복에서 영감받은 스타일, 부드럽고 여성스러운 실루엣",
    matching_keywords: ["파스텔", "핑크", "리본", "부드러운 곡선"],
    linked_luxury_terms: [L.hobo, L.miniBag],
  },
  {
    term: "클래식 발레코어 (Classic Balletcore)",
    trust_level: "통용어",
    origin: "발레코어의 세련된 변형, 파스텔톤에 클래식한 요소를 더한 스타일",
    matching_keywords: ["파스텔", "리본", "우아한"],
    linked_luxury_terms: [L.hobo],
  },
  {
    term: "블록코어룩 (Blokecore)",
    trust_level: "통용어",
    origin: "스포츠 저지·아이템을 스트리트 패션화한 스타일",
    matching_keywords: ["볼드한 컬러 블록", "캐주얼", "스포티"],
    linked_luxury_terms: [L.backpack, L.bucket],
  },
  {
    term: "사복패션",
    trust_level: "통용어",
    origin: "교복이 아닌 일상복 스타일링 전반을 가리키는 포괄적 용어 (순수 한국어 조어, 대응 영문명 없음)",
    matching_keywords: ["캐주얼", "일상적인"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "스쿨룩 (School Look)",
    trust_level: "통용어",
    origin: "교복에서 영감받은 단정하고 청량한 스타일",
    matching_keywords: ["네이비", "화이트", "단정함", "청량한"],
    linked_luxury_terms: [L.satchel],
  },
  {
    term: "스트리트 패션 (Street Fashion)",
    trust_level: "통용어",
    origin: "길거리 문화에서 자생한 캐주얼하고 개성 있는 스타일",
    matching_keywords: ["나일론", "캔버스", "볼드한 로고", "캐주얼"],
    linked_luxury_terms: [L.bucket, L.messenger],
  },
  {
    term: "시티 보이 (City Boy)",
    trust_level: "통용어",
    origin: "도시적이고 세련된 남성 캐주얼 스타일, 일본 스트리트 패션에서 유래",
    matching_keywords: ["뉴트럴톤", "캐주얼하면서 세련된"],
    linked_luxury_terms: [L.messenger, L.shopperTote],
  },
  {
    term: "아메카지 룩 (Amekaji)",
    trust_level: "통용어",
    origin: "미국 캐주얼을 일본식으로 재해석한 스타일, 빈티지한 워크웨어 요소",
    matching_keywords: ["데님", "빈티지", "캐주얼"],
    linked_luxury_terms: [L.backpack, L.shopperTote],
  },
  {
    term: "애슬레저 (Athleisure)",
    trust_level: "통용어",
    origin: "운동복(athletic)과 일상복(leisure)의 합성어, 기능성과 스타일을 결합",
    matching_keywords: ["스포티", "기능적인", "편안함"],
    linked_luxury_terms: [L.backpack, L.beltBag],
  },
  {
    term: "오피스룩 (Office Look)",
    trust_level: "통용어",
    origin: "직장에서 입는 단정하고 격식 있는 스타일",
    matching_keywords: ["블랙", "브라운", "구조적인", "절제된"],
    linked_luxury_terms: [L.topHandle, L.satchel],
  },
  {
    term: "올드머니 룩 (Old Money)",
    trust_level: "통용어",
    origin: "대대로 부유한 상류층의 절제되고 클래식한 옷차림을 지칭",
    matching_keywords: ["브라운", "베이지", "꼬냑", "가죽", "클래식한 로고"],
    linked_luxury_terms: [L.topHandle, L.shopperTote],
  },
  {
    term: "올블랙 (All Black)",
    trust_level: "통용어",
    origin: "상하의를 모두 검정으로 통일하는 스타일링",
    matching_keywords: ["블랙", "시크한", "절제된"],
    linked_luxury_terms: [L.clutch, L.topHandle],
  },
  {
    term: "왕자계 (Ouji-kei)",
    trust_level: "통용어",
    origin: "일본 서브컬처에서 파생, 중성적이고 우아한 인상의 남성 스타일",
    matching_keywords: ["화이트", "파스텔", "우아한", "중성적인"],
    linked_luxury_terms: [L.clutch],
  },
  {
    term: "워크웨어 룩 (Workwear)",
    trust_level: "통용어",
    origin: "작업복에서 영감받은 실용적이고 견고한 스타일",
    matching_keywords: ["카키", "데님", "기능적인", "견고한"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "이모 패션 (Emo Fashion)",
    trust_level: "통용어",
    origin: "2000년대 이모(emo) 음악 문화에서 파생, 다크하고 감성적인 무드",
    matching_keywords: ["블랙", "다크한", "감성적인"],
    linked_luxury_terms: [L.messenger],
  },
  {
    term: "청청 패션 (Double Denim)",
    trust_level: "통용어",
    origin: "데님 상하의를 매치하는 스타일링",
    matching_keywords: ["데님", "캐주얼"],
    linked_luxury_terms: [L.backpack, L.shopperTote],
  },
  {
    term: "캐주얼 (Casual)",
    trust_level: "통용어",
    origin: "격식 없이 편안하게 입는 일상복 스타일 전반",
    matching_keywords: ["편안함", "무난한"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "파스텔 고스 (Pastel Goth)",
    trust_level: "통용어",
    origin: "고스 룩에 파스텔톤을 결합한 변형, 다크한 무드를 부드럽게 표현",
    matching_keywords: ["파스텔", "블랙", "몽환적인"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "펑크 룩 (Punk)",
    trust_level: "통용어",
    origin: "1970년대 펑크 록 문화에서 파생, DIY 정신과 반항적 디테일이 특징",
    matching_keywords: ["블랙", "스터드·체인 장식", "반항적인"],
    linked_luxury_terms: [L.beltBag, L.messenger],
  },
  {
    term: "페미닌룩 (Feminine Look)",
    trust_level: "통용어",
    origin: "곡선과 부드러움을 강조하는 여성스러운 스타일",
    matching_keywords: ["파스텔", "핑크", "부드러운 실루엣", "우아한"],
    linked_luxury_terms: [L.hobo, L.clutch],
  },
  {
    term: "페어리계 (Fairy-kei)",
    trust_level: "통용어",
    origin: "동화·요정 이미지에서 영감받은 몽환적이고 소녀적인 스타일",
    matching_keywords: ["화이트", "파스텔", "레이어드", "몽환적인"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "펫플룩",
    trust_level: "통용어",
    origin: "반려동물과 함께 다니는 라이프스타일에서 파생된 캐주얼 스타일 (순수 한국어 조어, 대응 영문명 없음)",
    matching_keywords: ["캐주얼", "실용적인"],
    linked_luxury_terms: [L.backpack, L.messenger],
  },
  {
    term: "프레피 룩 (Preppy)",
    trust_level: "통용어",
    origin: "미국 사립학교 교복 룩에서 유래, 단정하고 규율 있어 보이는 인상",
    matching_keywords: ["네이비", "화이트", "캔버스", "구조적인"],
    linked_luxury_terms: [L.satchel, L.topHandle],
  },
  {
    term: "히메로리 (Hime Lolita)",
    trust_level: "통용어",
    origin: "로리타 패션의 공주풍 변형, 우아하고 화려한 프린세스 무드",
    matching_keywords: ["화이트", "골드", "화려함", "우아한"],
    linked_luxury_terms: [L.miniBag, L.clutch],
  },
  {
    term: "다크 아카데미아 (Dark Academia)",
    trust_level: "통용어",
    origin: "2010년대 텀블러 기반, 고전문학·전통 학문에 대한 향수를 어둡고 무게감 있게 표현",
    matching_keywords: ["다크브라운", "블랙", "가죽", "클래식한"],
    linked_luxury_terms: [L.satchel],
  },
  {
    term: "코케트 (Coquette)",
    trust_level: "통용어",
    origin: "프랑스어로 \"요염한 여자\"라는 뜻, 리본과 레이스로 로맨틱함을 강조하는 트렌드",
    matching_keywords: ["핑크", "화이트", "리본·레이스", "로맨틱함"],
    linked_luxury_terms: [L.miniBag, L.hobo],
  },
  {
    term: "코티지코어 (Cottagecore)",
    trust_level: "통용어",
    origin: "자연친화적이고 시골스러운 무드, 2023년 급부상한 트렌드",
    matching_keywords: ["화이트", "연한 초록", "내추럴한", "편안한"],
    linked_luxury_terms: [L.shopperTote, L.hobo],
  },
  {
    term: "클린 걸 (Clean Girl)",
    trust_level: "통용어",
    origin: "스킨케어·자기관리를 기반으로 한 깔끔하고 정돈된 무드",
    matching_keywords: ["화이트", "미니멀한", "단정한"],
    linked_luxury_terms: [L.topHandle, L.clutch],
  },
  {
    term: "소프트 걸 (Soft Girl)",
    trust_level: "통용어",
    origin: "연한 핑크 톤과 귀여운 복장이 특징인 사랑스러운 무드",
    matching_keywords: ["연한 핑크", "귀여운", "부드러운"],
    linked_luxury_terms: [L.miniBag],
  },
  {
    term: "바닐라 걸 (Vanilla Girl)",
    trust_level: "통용어",
    origin: "아이보리·베이지 톤 위주의 아늑하고 따뜻한 무드",
    matching_keywords: ["아이보리", "베이지", "아늑한", "부드러운 니트"],
    linked_luxury_terms: [L.shopperTote, L.hobo],
  },
  {
    term: "다운타운 (Downtown)",
    trust_level: "통용어",
    origin: "뉴욕 도심에서 사는 듯한 분위기, 책·커피 등이 상징 아이템",
    matching_keywords: ["뉴트럴톤", "도시적인", "세련된"],
    linked_luxury_terms: [L.shopperTote, L.messenger],
  },
  {
    term: "인디 (Indie)",
    trust_level: "통용어",
    origin: "개인의 개성과 독창성을 기반으로 한 감성적이고 채도 높은 무드",
    matching_keywords: ["원색", "빈티지한 감성", "개성 있는"],
    linked_luxury_terms: [L.messenger],
  },
  {
    term: "로열 (Royal)",
    trust_level: "통용어",
    origin: "왕족 컨셉의 우아하고 화려한 무드, 아카데미아·빈티지보다 더 화려함",
    matching_keywords: ["골드", "화려한", "우아한"],
    linked_luxury_terms: [L.clutch, L.topHandle],
  },
  {
    term: "베디 (Baddie)",
    trust_level: "통용어",
    origin: "강렬하고 세보이는 인상, 반짝이는 소재와 몸에 붙는 실루엣이 특징",
    matching_keywords: ["블랙", "퍼플", "실버", "반짝임", "강렬한"],
    linked_luxury_terms: [L.miniBag, L.clutch],
  },
  {
    term: "이걸/이보이 (E-girl/E-boy)",
    trust_level: "통용어",
    origin: "인터넷 서브컬처 기반, 다크한 톤에 스트리트 요소가 섞인 스타일",
    matching_keywords: ["블랙", "스트리트", "개성 있는"],
    linked_luxury_terms: [L.beltBag, L.messenger],
  },
  {
    term: "VSCO 걸",
    trust_level: "통용어",
    origin: "스크런치, 편안한 캐주얼함을 강조하는 미국 10대 트렌드",
    matching_keywords: ["파스텔", "캐주얼", "편안한"],
    linked_luxury_terms: [L.backpack],
  },
];

export const tasteLibrary: TasteLibrary = {
  tasteTerms,
  luxuryTerms,
};

// 취향 용어 카드가 연결한 럭셔리 용어 카드들의 mcm_subcategory를 모아
// "예시 형태" 후보로 파생시킨다. 2단계 프롬프트에 "예시 형태"로 전달되며,
// 이 값은 참고 신호(+1점)일 뿐 하드 필터가 아니다.
export function resolveExampleShapes(term: TasteTermCard, library: TasteLibrary = tasteLibrary): string[] {
  const luxuryByTerm = new Map(library.luxuryTerms.map((l) => [l.term, l]));
  const shapes = new Set<string>();
  for (const luxuryTermName of term.linked_luxury_terms) {
    const luxuryCard = luxuryByTerm.get(luxuryTermName);
    if (!luxuryCard) continue;
    for (const s of luxuryCard.mcm_subcategory) shapes.add(s);
  }
  return [...shapes];
}

export function findLuxuryTermByName(
  name: string,
  library: TasteLibrary = tasteLibrary,
): LuxuryTermCard | null {
  return library.luxuryTerms.find((l) => l.term === name) ?? null;
}

// 대표 럭셔리 용어 카드 1개를 뽑는다 ("1.5단계" — 화면 표시 전용, 형태
// 검색 범위를 좁히는 필터로는 쓰지 않는다). 연결된 첫 번째 럭셔리 용어를
// 대표로 삼는다 — matched_term의 confidence 순 정렬을 그대로 신뢰.
export function pickRepresentativeLuxuryTerm(
  term: TasteTermCard,
  library: TasteLibrary = tasteLibrary,
): LuxuryTermCard | null {
  const [first] = term.linked_luxury_terms;
  return first ? findLuxuryTermByName(first, library) : null;
}
