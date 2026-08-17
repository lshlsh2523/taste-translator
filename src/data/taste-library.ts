// 취향 용어 카드 54개 + 럭셔리 용어 카드 25개(형태 11 + 소재·기법 14).
//
// v2 — 처음 버전(55개 취향 + 27개 "럭셔리 용어"=MCM 카테고리명)의 문제를
// 고쳤다: 27개가 사실상 MCM 상품 카테고리 재탕이라 소재·기법 어휘(스터드,
// 퀼팅 등)가 통째로 빠져 있었음. 이번엔 각 취향 카드가 "형태"뿐 아니라
// "소재·기법" 럭셔리 용어에도 연결된다.
//
// 소재 관련해서 중요한 구분: 레더/나일론/코튼/데님/실크는 유래 설명이
// 필요 없는 일반 원재료명이라 별도 카드로 안 만들고, 취향 카드의
// raw_material_keywords에 직접 적어서 카탈로그 material_keywords와
// 바로 문자열 매칭한다. "지어낸 유래"를 카드에 붙이지 않기 위한 구분.
//
// 출처: 나무위키 "분류:패션 스타일"(43개 중 사복패션/남친룩/독기룩/
// 미시룩/오피스룩 5개 제외 = 38개) + 나무위키 "에스테틱"(12개) +
// Aesthetics Wiki(로맨틱 아카데미아, CC-BY-SA) + 비즈니스캐주얼/
// 라이트아카데미아/콰이엇럭셔리 신규 3개 = 총 54개. 신뢰 등급은 전부
// "통용어".
//
// "러블리 캐주얼" 같은 마케팅 조어(정확한 유래·학명 없음)는 카드로
// 안 만들고, 1단계 프롬프트 규칙으로 "여러 무드가 섞이면 각각 가장 잘
// 맞는 기존 카드로 쪼개서 매칭"하도록 처리한다 (src/lib/prompts.ts 규칙
// 13번 참고).

import type { LuxuryTermCard, TasteLibrary, TasteTermCard } from "@/types/taste";

const luxuryTerms: LuxuryTermCard[] = [
  // --- 형태 11개 (MCM 실제 스타일 필터 기반) ---
  {
    term: "사첼 백 (Satchel)",
    origin: "영국 학생·학자가 책을 넣고 다니던, 각이 잡힌 직사각형 가방",
    kind: "shape",
    matching_mood: ["단정함", "지적인 인상"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "호보 백 (Hobo)",
    origin: "초승달 모양의 부드럽고 여유로운 실루엣, 어깨에 자연스럽게 걸치는 형태",
    kind: "shape",
    matching_mood: ["편안함", "힘 뺀 스타일링"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "버킷 백 (Bucket Bag)",
    origin: "양동이 모양의 원통형 실루엣, 드로스트링(끈 조임)으로 여미는 방식",
    kind: "shape",
    matching_mood: ["캐주얼", "볼륨감 있는 스트리트 무드"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "탑 핸들 백 (Top Handle Bag)",
    origin: "짧은 손잡이로 손에 들거나 팔에 거는 방식, 격식 있고 단정한 인상",
    kind: "shape",
    matching_mood: ["오피스룩", "포멀함"],
    mcm_subcategory: ["탑-핸들백"],
  },
  {
    term: "보스톤 백 (Boston Bag)",
    origin: "1900년대 초 미국 대학생들이 쓰던 원통형 스포츠 더플백에서 유래, 반원형 바닥이 특징",
    kind: "shape",
    matching_mood: ["캐주얼하면서도 클래식함"],
    mcm_subcategory: ["숄더백-크로스백"],
  },
  {
    term: "메신저 백 (Messenger Bag)",
    origin: "자전거 배달원(bike messenger)이 편하게 매던 크로스바디 형태에서 유래",
    kind: "shape",
    matching_mood: ["실용적", "캐주얼"],
    mcm_subcategory: ["크로스백"],
  },
  {
    term: "쇼퍼 & 토트 백 (Shopper & Tote)",
    origin: "\"나르다(tote)\"라는 뜻에서 유래, 개방형 상단과 넉넉한 수납공간이 특징",
    kind: "shape",
    matching_mood: ["실용적", "데일리 캐주얼"],
    mcm_subcategory: ["쇼퍼-토트백"],
  },
  {
    term: "백팩 (Backpack)",
    origin: "양쪽 어깨에 메는 형태, 원래 등산·군용 장비에서 시작해 일상복화됨",
    kind: "shape",
    matching_mood: ["캐주얼", "활동적"],
    mcm_subcategory: ["백팩"],
  },
  {
    term: "벨트백 (Belt Bag)",
    origin: "허리에 두르는 형태, 1980~90년대 힙합·스트리트 신에서 유행하며 대중화",
    kind: "shape",
    matching_mood: ["스트리트", "캐주얼", "실용적"],
    mcm_subcategory: ["벨트백"],
  },
  {
    term: "미니백 (Mini Bag)",
    origin: "수납보다 장식성에 방점, 2010년대 후반 SNS 시대에 \"포토제닉함\"으로 유행",
    kind: "shape",
    matching_mood: ["발랄함", "트렌디", "파티룩"],
    mcm_subcategory: ["미니백"],
  },
  {
    term: "클러치 (Clutch)",
    origin: "손잡이 없이 손에 쥐는 형태, 정장·이브닝룩에서 격식을 더할 때 사용",
    kind: "shape",
    matching_mood: ["포멀", "이브닝", "세련됨"],
    mcm_subcategory: ["클러치-파우치"],
  },

  // --- 소재·기법 14개 (유래가 검증 가능한 것만 카드화) ---
  {
    term: "모노그램",
    origin: "브랜드 상징 문양을 패턴화해 원단 전체에 반복 배치하는 럭셔리 업계 기법",
    kind: "material",
    matching_mood: ["시그니처", "브랜드 아이덴티티"],
    material_keywords: ["모노그램"],
  },
  {
    term: "스터드",
    origin: "오토바이 재킷·펑크록 문화에서 온 금속 돌기 장식",
    kind: "material",
    matching_mood: ["반항적", "스트리트"],
    material_keywords: ["스터드"],
  },
  {
    term: "자카드",
    origin: "1804년 조제프 마리 자카르가 발명한, 복잡한 무늬를 짜 넣는 방직 기법",
    kind: "material",
    matching_mood: ["클래식", "장식적"],
    material_keywords: ["자카드"],
  },
  {
    term: "퀼팅",
    origin: "두 겹 원단 사이에 충전재를 넣고 누빈 기법",
    kind: "material",
    matching_mood: ["볼륨감", "클래식"],
    material_keywords: ["퀼팅"],
  },
  {
    term: "엠보스드",
    origin: "열과 압력으로 원단·가죽 표면에 무늬를 돋아내는 가공",
    kind: "material",
    matching_mood: ["입체감", "고급스러움"],
    material_keywords: ["엠보스드"],
  },
  {
    term: "헤링본",
    origin: "청어(herring)의 뼈 모양을 닮은 V자 지그재그 직조 패턴",
    kind: "material",
    matching_mood: ["클래식", "정교함"],
    material_keywords: ["헤링본"],
  },
  {
    term: "시퀸",
    origin: "고대 이탈리아·베네치아의 금화 \"제키노(zecchino)\"에서 유래한 반짝이는 장식",
    kind: "material",
    matching_mood: ["화려함", "파티룩"],
    material_keywords: ["시퀸"],
  },
  {
    term: "립스탑",
    origin: "2차 세계대전 낙하산 원단에서 시작된, 찢어짐을 방지하는 격자 직조 기법",
    kind: "material",
    matching_mood: ["기능적", "아웃도어"],
    material_keywords: ["립스탑"],
  },
  {
    term: "큐빅",
    origin: "다이아몬드를 모방해 만든 인조 보석(큐빅 지르코니아)",
    kind: "material",
    matching_mood: ["화려함", "반짝임"],
    material_keywords: ["큐빅"],
  },
  {
    term: "체인",
    origin: "금속 고리를 엮은 체인 하드웨어, 가방 스트랩이나 장식으로 사용",
    kind: "material",
    matching_mood: ["스트리트", "반항적"],
    material_keywords: ["체인"],
  },
  {
    term: "메탈릭",
    origin: "금속성 광택을 내는 코팅 또는 소재",
    kind: "material",
    matching_mood: ["미래적", "볼드함"],
    material_keywords: ["메탈릭"],
  },
  {
    term: "비세토스 (Visetos)",
    origin: "MCM이 자체 개발한 트레이드마크 캔버스 소재명 (브랜드 고유)",
    kind: "material",
    matching_mood: ["시그니처", "브랜드 아이덴티티"],
    material_keywords: ["비세토스"],
  },
  {
    term: "에코닐 (ECONYL)",
    origin: "이탈리아 Aquafil이 개발한 재생 나일론 브랜드명 (브랜드 고유)",
    kind: "material",
    matching_mood: ["지속가능성", "기능적"],
    material_keywords: ["에코닐"],
  },
  {
    term: "MCM 다이아몬드 모노그램",
    origin: "바이에른 국기의 마름모 문양에서 영감받은 MCM 헤리티지 패턴 (브랜드 고유)",
    kind: "material",
    matching_mood: ["헤리티지", "화려함"],
    material_keywords: ["모노그램", "다이아몬드"],
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
  beltBag: "벨트백 (Belt Bag)",
  miniBag: "미니백 (Mini Bag)",
  clutch: "클러치 (Clutch)",
  monogram: "모노그램",
  stud: "스터드",
  jacquard: "자카드",
  quilting: "퀼팅",
  embossed: "엠보스드",
  herringbone: "헤링본",
  sequin: "시퀸",
  ripstop: "립스탑",
  cubic: "큐빅",
  chain: "체인",
  metallic: "메탈릭",
  visetos: "비세토스 (Visetos)",
  econyl: "에코닐 (ECONYL)",
  diamondMonogram: "MCM 다이아몬드 모노그램",
} as const;

const tasteTerms: TasteTermCard[] = [
  {
    term: "Y2K",
    trust_level: "통용어",
    origin: "2000년대 초반 밀레니엄 감성을 재소환한 트렌드. 메탈릭, 로우라이즈, 로고 플레이가 특징",
    linked_luxury_terms: [L.miniBag, L.beltBag, L.metallic, L.cubic],
  },
  {
    term: "갸루 (Gyaru)",
    trust_level: "통용어",
    origin: "1990년대 일본에서 시작된 서브컬처, 화려한 메이크업과 태닝, 과감한 액세서리가 특징",
    linked_luxury_terms: [L.miniBag, L.clutch, L.cubic, L.metallic],
  },
  {
    term: "고스 룩 (Goth)",
    trust_level: "통용어",
    origin: "유럽 중세 고딕 건축에서 이름을 딴 서브컬처, 어둡고 신비로운 무드, 블랙 위주 컬러와 실버 장식이 특징",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.metallic],
  },
  {
    term: "고스로리 (Gothic Lolita)",
    trust_level: "통용어",
    origin: "고스 룩과 로리타 패션이 결합된 형태, 다크한 톤에 프릴·리본 장식이 섞임",
    linked_luxury_terms: [L.miniBag, L.sequin],
    raw_material_keywords: ["레더"],
  },
  {
    term: "고프코어 (Gorpcore)",
    trust_level: "통용어",
    origin: "등산·아웃도어 장비를 일상복화한 트렌드, 기능성 소재가 특징",
    linked_luxury_terms: [L.messenger, L.bucket, L.ripstop, L.econyl],
  },
  {
    term: "그런지 패션 (Grunge)",
    trust_level: "통용어",
    origin: "1990년대 록 음악에서 파생, 헤진 듯한 레이어드와 다크 톤의 반항적 무드",
    linked_luxury_terms: [L.messenger, L.beltBag, L.stud],
    raw_material_keywords: ["레더"],
  },
  {
    term: "꾸안꾸",
    trust_level: "통용어",
    origin: "\"꾸민 듯 안 꾸민 듯\"의 줄임말, 자연스럽고 힘 뺀 스타일링 (순수 한국어 조어, 대응 영문명 없음)",
    linked_luxury_terms: [L.hobo, L.shopperTote],
    raw_material_keywords: ["레더", "코튼"],
  },
  {
    term: "놈코어룩 (Normcore)",
    trust_level: "통용어",
    origin: "\"평범함(normal)\"을 미학으로 삼는 스타일, 화려함을 의도적으로 배제",
    linked_luxury_terms: [L.topHandle, L.backpack],
    raw_material_keywords: ["레더", "나일론"],
  },
  {
    term: "데코라계 (Decora)",
    trust_level: "통용어",
    origin: "일본 하라주쿠에서 시작된 화려한 액세서리 다중 착용 스타일",
    linked_luxury_terms: [L.miniBag, L.cubic, L.sequin, L.chain],
  },
  {
    term: "드뮤어룩 (Demure)",
    trust_level: "통용어",
    origin:
      "2020년대 중반 SNS에서 확산, 2024년 틱톡커 줄스 르브론이 \"Very demure, very mindful, very cutesy\"라는 표현을 쓰면서 시작됨. 얌전하고 단정한 인상을 강조, 올드머니룩과 달리 꼭 비싼 옷이 아니어도 됨",
    linked_luxury_terms: [L.topHandle, L.clutch],
    raw_material_keywords: ["레더", "실크"],
  },
  {
    term: "로리타 패션 (Lolita Fashion)",
    trust_level: "통용어",
    origin: "빅토리아 시대 인형 같은 실루엣, 프릴과 레이스가 특징인 일본발 서브컬처",
    linked_luxury_terms: [L.miniBag, L.sequin],
  },
  {
    term: "록 패션 (Rock Fashion)",
    trust_level: "통용어",
    origin: "록 음악 문화에서 파생, 가죽 재킷과 스터드 장식이 특징",
    linked_luxury_terms: [L.messenger, L.beltBag, L.stud, L.chain],
  },
  {
    term: "메탈 룩 (Metal Look)",
    trust_level: "통용어",
    origin: "헤비메탈 음악 문화, 타투 그래픽, 록밴드 스타일을 강조하는 다크하고 반항적인 스타일",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.chain],
  },
  {
    term: "모드 룩 (Mod Look)",
    trust_level: "통용어",
    origin: "1950년대 말 영국에서 시작, 기하학적이고 정제된 실루엣이 특징",
    linked_luxury_terms: [L.topHandle, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "미니멀룩 (Minimalism)",
    trust_level: "통용어",
    origin: "장식을 절제하고 실루엣과 소재감으로 승부하는 스타일",
    linked_luxury_terms: [L.topHandle, L.satchel],
    raw_material_keywords: ["레더"],
  },
  {
    term: "밀리터리 룩 (Military Look)",
    trust_level: "통용어",
    origin: "군복에서 파생된 스타일, 카키·올리브 톤과 기능적인 디테일이 특징",
    linked_luxury_terms: [L.backpack, L.messenger, L.ripstop],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "발레코어 (Balletcore)",
    trust_level: "통용어",
    origin: "발레 무용복에서 영감받은 스타일, 부드럽고 여성스러운 실루엣",
    linked_luxury_terms: [L.hobo, L.miniBag, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "클래식 발레코어 (Classic Balletcore)",
    trust_level: "통용어",
    origin:
      "발레코어의 세련된 변형, 코르셋에서 벗어난 편안하고 고급스러운 실루엣, 파스텔톤에 클래식한 요소를 더한 스타일",
    linked_luxury_terms: [L.hobo, L.jacquard],
    raw_material_keywords: ["실크"],
  },
  {
    term: "블록코어룩 (Blokecore)",
    trust_level: "통용어",
    origin:
      "영국 속어 \"bloke\"+놈코어 합성어, 1990~2000년대 프리미어리그 축구팬 문화에서 유래, 스포츠 저지를 스트리트 패션화한 스타일",
    linked_luxury_terms: [L.backpack, L.bucket, L.jacquard],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "스쿨룩 (School Look)",
    trust_level: "통용어",
    origin: "교복에서 영감받은 단정하고 청량한 스타일",
    linked_luxury_terms: [L.satchel, L.monogram],
    raw_material_keywords: ["레더"],
  },
  {
    term: "스트리트 패션 (Street Fashion)",
    trust_level: "통용어",
    origin: "길거리 문화에서 자생한 캐주얼하고 개성 있는 스타일",
    linked_luxury_terms: [L.bucket, L.messenger, L.monogram],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "시티 보이 (City Boy)",
    trust_level: "통용어",
    origin: "도시적이고 세련된 남성 캐주얼 스타일, 일본 스트리트 패션에서 유래",
    linked_luxury_terms: [L.messenger, L.shopperTote],
    raw_material_keywords: ["레더", "나일론"],
  },
  {
    term: "아메카지 룩 (Amekaji)",
    trust_level: "통용어",
    origin: "미국 캐주얼을 일본식으로 재해석한 스타일, 빈티지한 워크웨어 요소",
    linked_luxury_terms: [L.backpack, L.shopperTote, L.herringbone],
    raw_material_keywords: ["데님"],
  },
  {
    term: "애슬레저 (Athleisure)",
    trust_level: "통용어",
    origin: "운동복(athletic)과 일상복(leisure)의 합성어, 기능성과 스타일을 결합",
    linked_luxury_terms: [L.backpack, L.beltBag, L.ripstop],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "비즈니스 캐주얼 (Business Casual)",
    trust_level: "통용어",
    origin: "정장보다는 편하지만 단정함을 잃지 않는 오피스 복장. 영미권에서 널리 쓰이는 표준 용어로, 격식/캐주얼의 중간 지점을 가리킴",
    linked_luxury_terms: [L.topHandle, L.satchel, L.embossed],
    raw_material_keywords: ["레더"],
  },
  {
    term: "올드머니 룩 (Old Money)",
    trust_level: "통용어",
    origin: "대대로 부유한 상류층의 절제되고 클래식한 옷차림을 지칭",
    linked_luxury_terms: [L.topHandle, L.shopperTote, L.herringbone],
    raw_material_keywords: ["레더"],
  },
  {
    term: "콰이엇 럭셔리 (Quiet Luxury)",
    trust_level: "통용어",
    origin:
      "2023년 이후 패션 저널리즘에서 확산된 트렌드. 브랜드 로고를 드러내지 않고 소재·핏만으로 고급스러움을 표현. 올드머니 룩과 유사하지만 \"로고 없음\"이 더 명확한 핵심. (참고: MCM은 모노그램 브랜드라 무로고 취지와 다소 배치됨 — 소재/이미지 신호 위주로 판단 필요)",
    linked_luxury_terms: [L.topHandle, L.shopperTote],
    raw_material_keywords: ["레더"],
  },
  {
    term: "올블랙 (All Black)",
    trust_level: "통용어",
    origin: "상하의를 모두 검정으로 통일하는 스타일링",
    linked_luxury_terms: [L.clutch, L.topHandle, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "왕자계 (Ouji-kei)",
    trust_level: "통용어",
    origin: "일본 서브컬처에서 파생, 중성적이고 우아한 인상의 남성 스타일",
    linked_luxury_terms: [L.clutch, L.metallic],
    raw_material_keywords: ["실크"],
  },
  {
    term: "워크웨어 룩 (Workwear)",
    trust_level: "통용어",
    origin: "작업복에서 영감받은 실용적이고 견고한 스타일",
    linked_luxury_terms: [L.backpack, L.messenger, L.ripstop],
    raw_material_keywords: ["데님"],
  },
  {
    term: "이모 패션 (Emo Fashion)",
    trust_level: "통용어",
    origin: "2000년대 이모(emo) 음악 문화에서 파생, 다크하고 감성적인 무드",
    linked_luxury_terms: [L.messenger, L.stud],
    raw_material_keywords: ["레더"],
  },
  {
    term: "청청 패션 (Double Denim)",
    trust_level: "통용어",
    origin: "데님 상하의를 매치하는 스타일링",
    linked_luxury_terms: [L.backpack, L.shopperTote],
    raw_material_keywords: ["데님"],
  },
  {
    term: "캐주얼 (Casual)",
    trust_level: "통용어",
    origin: "격식 없이 편안하게 입는 일상복 스타일 전반",
    linked_luxury_terms: [L.backpack, L.messenger],
    raw_material_keywords: ["나일론", "코튼"],
  },
  {
    term: "파스텔 고스 (Pastel Goth)",
    trust_level: "통용어",
    origin: "고스 룩에 파스텔톤을 결합한 변형, 다크한 무드를 부드럽게 표현",
    linked_luxury_terms: [L.miniBag, L.sequin, L.metallic],
  },
  {
    term: "펑크 룩 (Punk)",
    trust_level: "통용어",
    origin: "1970년대 펑크 록 문화에서 파생, DIY 정신과 반항적 디테일이 특징",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.chain],
  },
  {
    term: "페미닌룩 (Feminine Look)",
    trust_level: "통용어",
    origin: "곡선과 부드러움을 강조하는 여성스러운 스타일",
    linked_luxury_terms: [L.hobo, L.clutch, L.jacquard],
    raw_material_keywords: ["실크"],
  },
  {
    term: "페어리계 (Fairy-kei)",
    trust_level: "통용어",
    origin: "동화·요정 이미지에서 영감받은 몽환적이고 소녀적인 스타일",
    linked_luxury_terms: [L.miniBag, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "펫플룩 (Petplelook)",
    trust_level: "통용어",
    origin:
      "'펫(Pet)'과 '커플룩(Couple Look)'의 합성어. 2021년 브랜드 \"아루마루(Arumaru)\"가 \"Creates Petplelook\"이라는 슬로건과 함께 처음 선보인 트렌드. 반려동물과 주인이 의상·소품을 맞춰 입어 유대감을 표현하는 스타일",
    linked_luxury_terms: [L.backpack, L.messenger],
    raw_material_keywords: ["나일론", "코튼"],
  },
  {
    term: "프레피 룩 (Preppy)",
    trust_level: "통용어",
    origin: "미국 사립학교 교복 룩에서 유래, 단정하고 규율 있어 보이는 인상",
    linked_luxury_terms: [L.satchel, L.topHandle, L.jacquard, L.herringbone],
  },
  {
    term: "히메로리 (Hime Lolita)",
    trust_level: "통용어",
    origin: "로리타 패션의 공주풍 변형, 우아하고 화려한 프린세스 무드",
    linked_luxury_terms: [L.miniBag, L.clutch, L.cubic, L.sequin],
  },
  {
    term: "다크 아카데미아 (Dark Academia)",
    trust_level: "통용어",
    origin: "2010년대 텀블러 기반, 고전문학·전통 학문에 대한 향수를 어둡고 무게감 있게 표현",
    linked_luxury_terms: [L.satchel, L.embossed],
    raw_material_keywords: ["레더"],
  },
  {
    term: "라이트 아카데미아 (Light Academia)",
    trust_level: "통용어",
    origin:
      "다크 아카데미아의 반대급부로 등장한 서브컬처. 고대 그리스풍에 가까운 밝고 부드러운 톤, 스웨터·블라우스·터틀넥, 꽃·커피 같은 소품이 특징",
    linked_luxury_terms: [L.satchel, L.shopperTote, L.herringbone],
    raw_material_keywords: ["레더"],
  },
  {
    term: "로맨틱 아카데미아 (Romantic Academia)",
    trust_level: "통용어",
    origin:
      "다크 아카데미아에 낭만주의적 색채를 더한 변형. 실존주의적 무게감 대신 연애시·러브레터 같은 \"달달함\"을 강조. 색감은 라이트 아카데미아를 따르되, 옷 스타일은 다크 아카데미아의 클래식한 요소(트위드, 니트 스커트, 넥타이, 빈티지 주얼리)를 유지 (출처: Aesthetics Wiki, CC-BY-SA)",
    linked_luxury_terms: [L.satchel, L.hobo, L.jacquard],
    raw_material_keywords: ["레더"],
  },
  {
    term: "코케트 (Coquette)",
    trust_level: "통용어",
    origin: "프랑스어로 \"요염한 여자\"라는 뜻, 리본과 레이스로 로맨틱함을 강조하는 트렌드",
    linked_luxury_terms: [L.miniBag, L.hobo, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "코티지코어 (Cottagecore)",
    trust_level: "통용어",
    origin: "자연친화적이고 시골스러운 무드, 2023년 급부상한 트렌드",
    linked_luxury_terms: [L.shopperTote, L.hobo, L.jacquard],
    raw_material_keywords: ["코튼"],
  },
  {
    term: "클린 걸 (Clean Girl)",
    trust_level: "통용어",
    origin: "스킨케어·자기관리를 기반으로 한 깔끔하고 정돈된 무드",
    linked_luxury_terms: [L.topHandle, L.clutch, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "소프트 걸 (Soft Girl)",
    trust_level: "통용어",
    origin: "연한 핑크 톤과 귀여운 복장이 특징인 사랑스러운 무드",
    linked_luxury_terms: [L.miniBag],
    raw_material_keywords: ["코튼", "실크"],
  },
  {
    term: "바닐라 걸 (Vanilla Girl)",
    trust_level: "통용어",
    origin: "아이보리·베이지 톤 위주의 아늑하고 따뜻한 무드",
    linked_luxury_terms: [L.shopperTote, L.hobo],
    raw_material_keywords: ["코튼"],
  },
  {
    term: "다운타운 (Downtown)",
    trust_level: "통용어",
    origin: "뉴욕 도심에서 사는 듯한 분위기, 책·커피 등이 상징 아이템",
    linked_luxury_terms: [L.shopperTote, L.messenger],
    raw_material_keywords: ["데님", "나일론"],
  },
  {
    term: "인디 (Indie)",
    trust_level: "통용어",
    origin: "개인의 개성과 독창성을 기반으로 한 감성적이고 채도 높은 무드",
    linked_luxury_terms: [L.messenger, L.jacquard],
    raw_material_keywords: ["데님"],
  },
  {
    term: "로열 (Royal)",
    trust_level: "통용어",
    origin: "왕족 컨셉의 우아하고 화려한 무드",
    linked_luxury_terms: [L.clutch, L.topHandle, L.diamondMonogram, L.metallic],
  },
  {
    term: "베디 (Baddie)",
    trust_level: "통용어",
    origin: "강렬하고 세보이는 인상, 반짝이는 소재와 몸에 붙는 실루엣이 특징",
    linked_luxury_terms: [L.miniBag, L.clutch, L.metallic, L.cubic],
  },
  {
    term: "이걸/이보이 (E-girl/E-boy)",
    trust_level: "통용어",
    origin: "인터넷 서브컬처 기반, 다크한 톤에 스트리트 요소가 섞인 스타일",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.metallic],
  },
  {
    term: "비스코걸 (VSCO girl)",
    trust_level: "통용어",
    origin: "스크런치, 편안한 캐주얼함을 강조하는 미국 10대 트렌드",
    linked_luxury_terms: [L.backpack],
    raw_material_keywords: ["나일론", "코튼"],
  },
];

export const tasteLibrary: TasteLibrary = {
  tasteTerms,
  luxuryTerms,
};

function linkedLuxuryCards(term: TasteTermCard, library: TasteLibrary): LuxuryTermCard[] {
  const luxuryByTerm = new Map(library.luxuryTerms.map((l) => [l.term, l]));
  return term.linked_luxury_terms
    .map((name) => luxuryByTerm.get(name))
    .filter((card): card is LuxuryTermCard => card !== undefined);
}

// 형태 신호: linked_luxury_terms 중 kind가 "shape"인 카드들의
// mcm_subcategory를 모은다. 2단계 프롬프트의 "예시 형태"로 쓰인다.
export function resolveShapeSignals(term: TasteTermCard, library: TasteLibrary = tasteLibrary): string[] {
  const shapes = new Set<string>();
  for (const card of linkedLuxuryCards(term, library)) {
    if (card.kind !== "shape") continue;
    for (const s of card.mcm_subcategory ?? []) shapes.add(s);
  }
  return [...shapes];
}

// 소재 신호: linked_luxury_terms 중 kind가 "material"인 카드들의
// material_keywords + raw_material_keywords를 모은다. 카탈로그
// 후보 좁히기(getCandidateProducts)에서 참고 신호로 쓰인다.
export function resolveMaterialSignals(term: TasteTermCard, library: TasteLibrary = tasteLibrary): string[] {
  const materials = new Set<string>(term.raw_material_keywords ?? []);
  for (const card of linkedLuxuryCards(term, library)) {
    if (card.kind !== "material") continue;
    for (const m of card.material_keywords ?? []) materials.add(m);
  }
  return [...materials];
}

export function findLuxuryTermByName(
  name: string,
  library: TasteLibrary = tasteLibrary,
): LuxuryTermCard | null {
  return library.luxuryTerms.find((l) => l.term === name) ?? null;
}

// 대표 럭셔리 용어 카드 1개를 뽑는다 (화면 표시 전용, 형태 검색 범위를
// 좁히는 필터로는 쓰지 않는다). linked_luxury_terms는 형태를 먼저 적는
// 순서로 관리하므로, 첫 번째 항목이 곧 대표 형태 용어가 된다.
export function pickRepresentativeLuxuryTerm(
  term: TasteTermCard,
  library: TasteLibrary = tasteLibrary,
): LuxuryTermCard | null {
  const [first] = term.linked_luxury_terms;
  return first ? findLuxuryTermByName(first, library) : null;
}
