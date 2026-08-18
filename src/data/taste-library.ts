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
    history:
      "'Y2K'는 2000년 밀레니엄 전환기의 컴퓨터 오류 우려를 뜻하던 'Year 2000 Problem'의 약자에서 이름을 땄다. 브리트니 스피어스(Britney Spears) 같은 팝스타의 스타일이 MTV의 인기 뮤직비디오 순위 프로그램 '토탈 리퀘스트 라이브(Total Request Live, TRL)'를 통해 10대들 사이에 퍼지며, 로우라이즈 진과 크롭탑, 메탈릭 소재, 브랜드 로고를 크게 드러내는 로고매니아가 이 시기 스타일의 상징으로 자리잡았다.",
    description: "메탈릭 소재, 로우라이즈 실루엣, 크롭탑, 큰 로고 장식이 핵심이며 미래적이고 화려한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.beltBag, L.metallic, L.cubic],
  },
  {
    term: "갸루 (Gyaru)",
    trust_level: "통용어",
    origin: "1990년대 일본에서 시작된 서브컬처, 화려한 메이크업과 태닝, 과감한 액세서리가 특징",
    history:
      "'갸루'는 영어 '갤(gal)'의 일본식 발음이다. 1990년대 일본 버블 경제 붕괴 이후 시부야 거리에서 교복 치마를 줄이고 태닝·염색을 즐기던 여고생들('코갸루')로부터 시작됐으며, 가수 아무로 나미에(安室奈美恵, Amuro Namie)의 인기가 갈색 머리·플랫폼 부츠 같은 갸루 스타일 유행을 이끌었다.",
    description: "태닝 피부, 화려한 메이크업, 과감한 액세서리가 핵심이며 반항적이고 자유분방한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.clutch, L.cubic, L.metallic],
  },
  {
    term: "고스 룩 (Goth)",
    trust_level: "통용어",
    origin: "유럽 중세 고딕 건축에서 이름을 딴 서브컬처, 어둡고 신비로운 무드, 블랙 위주 컬러와 실버 장식이 특징",
    history:
      "1970년대 후반 영국 포스트펑크(Post-punk) 신에서 파생됐으며, 런던의 클럽 배트케이브(Batcave)와 수지 앤 더 밴시스(Siouxsie and the Banshees)·바우하우스(Bauhaus)·조이 디비전(Joy Division) 같은 밴드가 초기 고스 문화를 이끌었다. 유럽 중세 고딕(Gothic) 건축과 고딕 문학의 어둡고 신비로운 이미지에서 이름을 땄다.",
    description: "블랙 위주 컬러, 창백한 화장, 실버 장식이 핵심이며 어둡고 신비로운 무드를 표현",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.metallic],
  },
  {
    term: "고스로리 (Gothic Lolita)",
    trust_level: "통용어",
    origin: "고스 룩과 로리타 패션이 결합된 형태, 다크한 톤에 프릴·리본 장식이 섞임",
    history:
      "1990년대 일본 하라주쿠에서 고스 룩과 로리타 패션이 결합돼 등장했으며, 2001년 창간된 전문지 《고스로리 바이블(Gothic & Lolita Bible)》을 통해 스타일이 정립됐다.",
    description: "다크한 톤에 프릴·리본 장식이 섞인 것이 핵심이며 우아하면서도 음울한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.sequin],
    raw_material_keywords: ["레더"],
  },
  {
    term: "고프코어 (Gorpcore)",
    trust_level: "통용어",
    origin: "등산·아웃도어 장비를 일상복화한 트렌드, 기능성 소재가 특징",
    history:
      "'고프코어'는 등산 간식을 뜻하는 '고프(GORP, good old raisins and peanuts의 줄임말)'에 스타일을 가리키는 접미사 '코어(-core)'를 붙인 합성어다. 2017년 기자 제이슨 첸(Jason Chen)이 뉴욕매거진(New York Magazine)의 패션 블로그 '더 컷(The Cut)'에 쓴 글에서 처음 사용했으며, 노스페이스(The North Face)·파타고니아(Patagonia) 같은 기능성 아웃도어 브랜드를 일상복으로 입는 흐름을 가리킨다.",
    description: "하드셸 재킷, 등산화 등 기능성 아웃도어 장비가 핵심이며 실용적이고 캐주얼한 무드를 표현",
    linked_luxury_terms: [L.messenger, L.bucket, L.ripstop, L.econyl],
  },
  {
    term: "그런지 패션 (Grunge)",
    trust_level: "통용어",
    origin: "1990년대 록 음악에서 파생, 헤진 듯한 레이어드와 다크 톤의 반항적 무드",
    history:
      "1980년대 중반 미국 시애틀의 개러지 록(Garage Rock) 신에서 시작됐으며, 1990년대 너바나(Nirvana)·펄 잼(Pearl Jam) 같은 밴드와 커트 코베인(Kurt Cobain)의 옷차림을 통해 전 세계에 알려졌다. 세련됨을 거부하고 편안함과 진정성을 우선하는 정서를 담았다.",
    description: "체크 셔츠, 낡은 레이어드, 다크 톤이 핵심이며 반항적이고 힘 뺀 무드를 표현",
    linked_luxury_terms: [L.messenger, L.beltBag, L.stud],
    raw_material_keywords: ["레더"],
  },
  {
    term: "꾸안꾸",
    trust_level: "통용어",
    origin: "\"꾸민 듯 안 꾸민 듯\"의 줄임말, 자연스럽고 힘 뺀 스타일링 (순수 한국어 조어, 대응 영문명 없음)",
    history:
      "'꾸민 듯 안 꾸민 듯'의 줄임말로, 2019년 후반부터 한국 SNS에서 유행하기 시작한 신조어다. 순우리말 조어라 정확히 대응하는 영문명은 없다.",
    description: "과하지 않으면서 신경 쓴 티가 나는 자연스러운 스타일링이 핵심이며 힘 뺀 세련됨을 표현",
    linked_luxury_terms: [L.hobo, L.shopperTote],
    raw_material_keywords: ["레더", "코튼"],
  },
  {
    term: "놈코어룩 (Normcore)",
    trust_level: "통용어",
    origin: "\"평범함(normal)\"을 미학으로 삼는 스타일, 화려함을 의도적으로 배제",
    history:
      "'놈코어'는 '평범한(normal)'과 '하드코어(hardcore)'를 합친 조어다. 2008년 라이언 에스트라다(Ryan Estrada)의 웹코믹 《템플러, 애리조나(Templar, Arizona)》에서 처음 등장했지만, 2013년 트렌드 예측 그룹 케이홀(K-HOLE)이 발표한 보고서 《유스 모드(Youth Mode: A Report on Freedom)》를 통해 널리 퍼졌다. 케이홀은 이 말을 옷차림이 아니라 태도로 정의했는데, \"남과 달라야 한다는 압박에서 벗어나 평범함 속에서 자유를 찾는다\"는 뜻이었다. 이후 2014년 한 잡지 기사가 이 개념을 1990년대 '아빠 스타일'과 엮어 구체적인 옷차림으로 소개하면서, 지금 통용되는 패션 용어로 의미가 좁혀졌다.",
    description: "화려함을 의도적으로 배제한 평범한 옷차림이 핵심이며 절제된 무드를 표현",
    linked_luxury_terms: [L.topHandle, L.backpack],
    raw_material_keywords: ["레더", "나일론"],
  },
  {
    term: "데코라계 (Decora)",
    trust_level: "통용어",
    origin: "일본 하라주쿠에서 시작된 화려한 액세서리 다중 착용 스타일",
    history:
      "1990년대 후반 일본 하라주쿠에서 시작됐으며, 아이돌 시노하라 토모에(篠原ともえ, Shinohara Tomoe)의 동화 같은 스타일을 따라 하던 팬들로부터 출발했다. 스트리트 스냅 잡지 《프루츠(Fruits)》가 이 스타일에 장식을 뜻하는 '데코라(decoration의 줄임말)'라는 이름을 붙였다.",
    description: "다양한 액세서리를 겹겹이 착용해 원래 옷이 안 보일 정도로 장식하는 것이 핵심이며 화려하고 유쾌한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.cubic, L.sequin, L.chain],
  },
  {
    term: "드뮤어룩 (Demure)",
    trust_level: "통용어",
    origin:
      "2020년대 중반 SNS에서 확산, 2024년 틱톡커 줄스 르브론이 \"Very demure, very mindful, very cutesy\"라는 표현을 쓰면서 시작됨. 얌전하고 단정한 인상을 강조, 올드머니룩과 달리 꼭 비싼 옷이 아니어도 됨",
    history:
      "2024년 틱톡커 줄스 르브론(Jools Lebron)이 \"매우 얌전하고(demure), 매우 신중하고(mindful), 매우 사랑스럽다(cutesy)\"는 취지의 표현을 유행시키며 시작된 밈에서 출발해 SNS 전반으로 확산됐다.",
    description: "얌전하고 단정한 인상을 강조하며, 올드머니 룩과 달리 꼭 값비싼 옷이 아니어도 되는 것이 특징",
    linked_luxury_terms: [L.topHandle, L.clutch],
    raw_material_keywords: ["레더", "실크"],
  },
  {
    term: "로리타 패션 (Lolita Fashion)",
    trust_level: "통용어",
    origin: "빅토리아 시대 인형 같은 실루엣, 프릴과 레이스가 특징인 일본발 서브컬처",
    history:
      "1970~80년대 일본 하라주쿠에서 시작됐으며, 빅토리아·로코코 시대 유럽 아동복에서 영감을 받았다. 1990년대 하라주쿠 거리 사진과 스트리트 스냅 잡지 《프루츠(Fruits)》, 《케라(Kera)》를 통해 대중적인 스타일로 자리잡았다.",
    description: "인형 같은 실루엣에 프릴과 레이스 장식이 핵심이며 우아하고 소녀적인 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.sequin],
  },
  {
    term: "록 패션 (Rock Fashion)",
    trust_level: "통용어",
    origin: "록 음악 문화에서 파생, 가죽 재킷과 스터드 장식이 특징",
    history:
      "오토바이용 가죽 재킷 '페르펙토(Perfecto)'는 1953년 영화 위험한 질주에서 말론 브란도가 입으며 반항적 청년문화의 상징이 됐다. 이 이미지를 1970년대 라몬즈 등 펑크·록 밴드가 무대 의상으로 차용했고, 블론디·조앤 제트 등 여성 록스타들이 스터드·체인 장식을 더하면서 지금의 록 패션 스타일이 완성됐다.",
    description: "블랙 가죽 재킷, 스터드, 체인, 두꺼운 벨트 등 금속 하드웨어가 핵심이며 거칠고 반항적인 무드를 표현",
    linked_luxury_terms: [L.messenger, L.beltBag, L.stud, L.chain],
  },
  {
    term: "메탈 룩 (Metal Look)",
    trust_level: "통용어",
    origin: "헤비메탈 음악 문화, 타투 그래픽, 록밴드 스타일을 강조하는 다크하고 반항적인 스타일",
    history:
      "1970년대 후반 헤비메탈(Heavy Metal) 음악 문화에서 파생됐으며, 록 패션과 뿌리를 공유하지만 밴드 로고 티셔츠와 타투 그래픽 같은 요소가 더해지며 독자적인 스타일로 발전했다.",
    description: "다크한 톤에 록밴드 그래픽, 스터드 장식이 핵심이며 반항적인 무드를 표현",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.chain],
  },
  {
    term: "모드 룩 (Mod Look)",
    trust_level: "통용어",
    origin: "1950년대 말 영국에서 시작, 기하학적이고 정제된 실루엣이 특징",
    history:
      "'모드'는 모던 재즈(modern jazz)를 좋아하는 사람을 뜻하는 '모더니스트(modernist)'의 줄임말이다. 1958년 런던에서 재단 업계와 인연이 있던 청년들 사이에서 시작됐으며, 이전 세대의 로큰롤·그리저(greaser) 문화를 거부하고 이탈리아·프랑스풍의 맞춤 정장을 즐겨 입었다. 1960년대 초 스쿠터와 팝아트 취향이 더해지며 하나의 하위문화로 굳어졌고, 메리 퀀트(Mary Quant) 같은 디자이너를 통해 상업적으로 대중화됐다.",
    description: "기하학적이고 정제된 실루엣, 좁은 카라와 타이가 핵심이며 세련되고 모던한 무드를 표현",
    linked_luxury_terms: [L.topHandle, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "미니멀룩 (Minimalism)",
    trust_level: "통용어",
    origin: "장식을 절제하고 실루엣과 소재감으로 승부하는 스타일",
    history:
      "1990년대 초 캘빈 클라인(Calvin Klein)·질 샌더(Jil Sander)·헬무트 랭(Helmut Lang) 등 디자이너들이 1980년대의 화려한 파워 드레싱에 반발하며 만든 스타일에서 자리잡았다. 절제된 컬러와 정교한 재단으로 '덜어낸 고급스러움'을 보여준 것이 특징이다.",
    description: "장식을 절제하고 실루엣과 소재감으로 승부하는 것이 핵심이며 절제된 고급스러움을 표현",
    linked_luxury_terms: [L.topHandle, L.satchel],
    raw_material_keywords: ["레더"],
  },
  {
    term: "밀리터리 룩 (Military Look)",
    trust_level: "통용어",
    origin: "군복에서 파생된 스타일, 카키·올리브 톤과 기능적인 디테일이 특징",
    history:
      "위장무늬(카모플라주, camouflage)는 20세기 초 군복에서 시작됐으며, 제대 군인들이 군수품 매장(서플러스 스토어)을 통해 민간에 퍼뜨렸다. 1990년대 미국 힙합 문화가 카고팬츠·재킷을 즐겨 입으며 스트리트 패션의 상징이 됐고, 어베이싱에이프(A Bathing Ape) 같은 일본 스트리트 브랜드들이 독자적인 카모 패턴을 만들며 다시 유행시켰다.",
    description: "카키·올리브 톤, 카고 포켓 등 기능적인 디테일이 핵심이며 실용적이고 터프한 무드를 표현",
    linked_luxury_terms: [L.backpack, L.messenger, L.ripstop],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "발레코어 (Balletcore)",
    trust_level: "통용어",
    origin: "발레 무용복에서 영감받은 스타일, 부드럽고 여성스러운 실루엣",
    history:
      "'발레코어'는 '발레(ballet)'와 스타일을 가리키는 접미사 '코어(-core)'를 합친 조어다. 2020년대 초 틱톡에서 시작돼 2022년 미우미우(Miu Miu)가 로고 스트랩을 단 발레 플랫을 선보이며 상업적으로 폭발적인 인기를 얻었다.",
    description: "랩 가디건, 튤 스커트, 발레 플랫이 핵심이며 부드럽고 여성스러운 무드를 표현",
    linked_luxury_terms: [L.hobo, L.miniBag, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "클래식 발레코어 (Classic Balletcore)",
    trust_level: "통용어",
    origin:
      "발레코어의 세련된 변형, 코르셋에서 벗어난 편안하고 고급스러운 실루엣, 파스텔톤에 클래식한 요소를 더한 스타일",
    history:
      "발레코어 트렌드에서 파생된 변형으로, 코르셋처럼 몸을 조이는 요소 대신 편안하면서도 고급스러운 실루엣을 강조하는 방향으로 발전했다.",
    description: "파스텔톤에 클래식한 요소를 더한 편안한 실루엣이 핵심이며 우아하고 고급스러운 무드를 표현",
    linked_luxury_terms: [L.hobo, L.jacquard],
    raw_material_keywords: ["실크"],
  },
  {
    term: "블록코어룩 (Blokecore)",
    trust_level: "통용어",
    origin:
      "영국 속어 \"bloke\"+놈코어 합성어, 1990~2000년대 프리미어리그 축구팬 문화에서 유래, 스포츠 저지를 스트리트 패션화한 스타일",
    history:
      "'블록코어'는 영국 속어로 평범한 남자를 뜻하는 '블로크(bloke)'와 놈코어(normcore)를 합친 조어로, 2021년 무렵 틱톡에서 용어가 퍼지기 시작했다. 뿌리는 1980년대 영국 축구팬들이 저지와 스포츠웨어를 즐겨 입던 '테라스 캐주얼(terrace casual)' 문화에 있다.",
    description: "빈티지 축구 저지를 일상복처럼 매치하는 것이 핵심이며 캐주얼하고 힙한 무드를 표현",
    linked_luxury_terms: [L.backpack, L.bucket, L.jacquard],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "스쿨룩 (School Look)",
    trust_level: "통용어",
    origin: "교복에서 영감받은 단정하고 청량한 스타일",
    history:
      "특정 시점에 만들어진 트렌드라기보다, 교복이라는 보편적인 복식에서 꾸준히 영감을 받아온 스타일이라 하나의 기원으로 특정하기는 어렵다.",
    description: "블레이저·플리츠 스커트 등 교복 요소가 핵심이며 단정하고 청량한 무드를 표현",
    linked_luxury_terms: [L.satchel, L.monogram],
    raw_material_keywords: ["레더"],
  },
  {
    term: "스트리트 패션 (Street Fashion)",
    trust_level: "통용어",
    origin: "길거리 문화에서 자생한 캐주얼하고 개성 있는 스타일",
    history:
      "특정 도시나 인물이 아니라 캘리포니아의 서핑·스케이트보드 문화, 뉴욕의 힙합 문화, 미국·영국의 펑크 신 등 여러 청년 문화가 뒤섞이며 형성됐다. 1990년대 뉴욕의 슈프림(Supreme), 일본의 어베이싱에이프(A Bathing Ape) 같은 브랜드가 성장하며 하나의 패션 장르로 자리잡았다.",
    description: "길거리 문화에서 자생한 캐주얼하고 개성 있는 조합이 핵심이며 자유분방한 무드를 표현",
    linked_luxury_terms: [L.bucket, L.messenger, L.monogram],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "시티 보이 (City Boy)",
    trust_level: "통용어",
    origin: "도시적이고 세련된 남성 캐주얼 스타일, 일본 스트리트 패션에서 유래",
    history:
      "1976년 창간된 일본 패션지 《포파이(POPEYE)》의 부제 '매거진 포 시티 보이즈(Magazine for City Boys)'에서 이름을 땄다. 디테일까지 신경 쓴 삶의 태도를 보여주는 남성상을 가리킨다.",
    description: "튀지 않으면서 단정하고 절제된 옷차림이 핵심이며 도시적이고 세련된 무드를 표현",
    linked_luxury_terms: [L.messenger, L.shopperTote],
    raw_material_keywords: ["레더", "나일론"],
  },
  {
    term: "아메카지 룩 (Amekaji)",
    trust_level: "통용어",
    origin: "미국 캐주얼을 일본식으로 재해석한 스타일, 빈티지한 워크웨어 요소",
    history:
      "'아메카지'는 '아메리칸(American)'과 '캐주얼(casual)'을 합친 일본식 줄임말이다. 2차 세계대전 후 미군 문화와 미국 대중문화가 일본에 유입되며 1960년대부터 쓰이기 시작했고, 1976년 창간된 남성지 《포파이(POPEYE)》가 이를 하나의 라이프스타일로 정착시켰다.",
    description: "데님, 밀리터리 서플러스, 빈티지 워크웨어가 핵심이며 캐주얼하면서도 정성스러운 무드를 표현",
    linked_luxury_terms: [L.backpack, L.shopperTote, L.herringbone],
    raw_material_keywords: ["데님"],
  },
  {
    term: "애슬레저 (Athleisure)",
    trust_level: "통용어",
    origin: "운동복(athletic)과 일상복(leisure)의 합성어, 기능성과 스타일을 결합",
    history:
      "'애슬레저'는 '운동복(athletic)'과 '일상복(leisure)'을 합친 조어로 1979년 처음 쓰였지만, 2016년 메리엄웹스터(Merriam-Webster) 사전에 등재되며 대중적인 용어로 자리잡았다. 1998년 설립된 룰루레몬(Lululemon)이 요가 팬츠 같은 운동복을 일상복으로 승격시키며 트렌드를 이끌었다.",
    description: "레깅스, 조거팬츠 등 기능성과 스타일을 겸비한 옷차림이 핵심이며 편안하고 활동적인 무드를 표현",
    linked_luxury_terms: [L.backpack, L.beltBag, L.ripstop],
    raw_material_keywords: ["나일론"],
  },
  {
    term: "비즈니스 캐주얼 (Business Casual)",
    trust_level: "통용어",
    origin: "정장보다는 편하지만 단정함을 잃지 않는 오피스 복장. 영미권에서 널리 쓰이는 표준 용어로, 격식/캐주얼의 중간 지점을 가리킴",
    history:
      "1960년대 하와이 의류 업계가 '알로하 프라이데이(Aloha Friday)' 캠페인을 통해 정장 대신 하와이안 셔츠를 입도록 제안한 데서 시작됐다. 1990년대 리바이스(Levi's)가 만든 《캐주얼 비즈니스웨어 가이드(Guide to Casual Businesswear)》가 미국 기업 인사부에 대량 배포되며 정착됐다.",
    description: "정장보다 편하지만 단정함을 잃지 않는 옷차림이 핵심이며 절제된 격식을 표현",
    linked_luxury_terms: [L.topHandle, L.satchel, L.embossed],
    raw_material_keywords: ["레더"],
  },
  {
    term: "올드머니 룩 (Old Money)",
    trust_level: "통용어",
    origin: "대대로 부유한 상류층의 절제되고 클래식한 옷차림을 지칭",
    history:
      "여러 세대에 걸쳐 부를 물려받은 유럽·미국 상류층을 가리키던 말로, 아이비리그 프레피 문화의 절제된 옷차림 전통이 이어져오다 2022~2023년 무렵 SNS에서 '올드머니 에스테틱(Old Money Aesthetic)' 해시태그로 확산되며 대중적인 패션 트렌드 용어로 자리잡았다.",
    description: "브랜드 로고를 드러내지 않는 고급 소재와 단정한 핏이 핵심이며 은은한 부유함을 표현",
    linked_luxury_terms: [L.topHandle, L.shopperTote, L.herringbone],
    raw_material_keywords: ["레더"],
  },
  {
    term: "콰이엇 럭셔리 (Quiet Luxury)",
    trust_level: "통용어",
    origin:
      "2023년 이후 패션 저널리즘에서 확산된 트렌드. 브랜드 로고를 드러내지 않고 소재·핏만으로 고급스러움을 표현. 올드머니 룩과 유사하지만 \"로고 없음\"이 더 명확한 핵심. (참고: MCM은 모노그램 브랜드라 무로고 취지와 다소 배치됨 — 소재/이미지 신호 위주로 판단 필요)",
    history:
      "2023년 미국 드라마 《석세션(Succession)》 속 등장인물들의 절제된 부유층 의상이 화제가 되며 널리 퍼진 트렌드다. 로고를 드러내지 않는다는 점에서 올드머니 룩과 닮았지만, '무로고'가 더 명확한 핵심이다.",
    description: "브랜드 로고 없이 소재와 핏만으로 고급스러움을 표현하는 것이 핵심이며 절제된 무드를 표현",
    linked_luxury_terms: [L.topHandle, L.shopperTote],
    raw_material_keywords: ["레더"],
  },
  {
    term: "올블랙 (All Black)",
    trust_level: "통용어",
    origin: "상하의를 모두 검정으로 통일하는 스타일링",
    history:
      "특정 시점에 만들어진 트렌드가 아니라, 상하의를 검정으로 통일하는 스타일링이 고스·미니멀룩 등 여러 스타일에서 반복적으로 쓰이며 하나의 스타일링 방식으로 자리잡았다.",
    description: "상하의를 모두 검정으로 통일하는 것이 핵심이며 시크하고 절제된 무드를 표현",
    linked_luxury_terms: [L.clutch, L.topHandle, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "왕자계 (Ouji-kei)",
    trust_level: "통용어",
    origin: "일본 서브컬처에서 파생, 중성적이고 우아한 인상의 남성 스타일",
    history:
      "1990년대 말~2000년대 초 일본에서 로리타 패션의 남성적 대응 스타일인 '보이스타일(boystyle)'로 등장했다. 18~19세기 유럽 귀족 남성복에서 영감을 받았다.",
    description: "반바지·베스트 등 클래식한 아이템에 중성적이고 우아한 인상이 핵심이며 고풍스러운 무드를 표현",
    linked_luxury_terms: [L.clutch, L.metallic],
    raw_material_keywords: ["실크"],
  },
  {
    term: "워크웨어 룩 (Workwear)",
    trust_level: "통용어",
    origin: "작업복에서 영감받은 실용적이고 견고한 스타일",
    history:
      "1889년 설립된 카하트(Carhartt), 1922년 설립된 디키즈(Dickies) 같은 미국 작업복 브랜드에서 시작됐다. 1980년대 힙합 아티스트들이, 이후 스케이트보드·그런지 문화가 견고함과 실용성을 이유로 이 옷들을 채택하며 스트리트 패션으로 편입됐다.",
    description: "초어 재킷, 캔버스 소재 등 튼튼한 작업복 요소가 핵심이며 실용적이고 견고한 무드를 표현",
    linked_luxury_terms: [L.backpack, L.messenger, L.ripstop],
    raw_material_keywords: ["데님"],
  },
  {
    term: "이모 패션 (Emo Fashion)",
    trust_level: "통용어",
    origin: "2000년대 이모(emo) 음악 문화에서 파생, 다크하고 감성적인 무드",
    history:
      "'이모'는 감정을 뜻하는 '이모셔널(emotional)'의 줄임말이다. 1980년대 후반 미국 워싱턴 D.C.의 하드코어 펑크 신에서 파생된 '이모셔널 하드코어(emotional hardcore)' 음악 문화에서 시작됐으며, 2000년대 폴 아웃 보이(Fall Out Boy)·마이 케미컬 로맨스(My Chemical Romance) 같은 밴드가 인기를 얻으며 다크한 아이라이너와 스키니진 같은 스타일이 대중화됐다.",
    description: "다크 톤, 스키니진, 사이드 뱅 헤어가 핵심이며 감성적이고 다크한 무드를 표현",
    linked_luxury_terms: [L.messenger, L.stud],
    raw_material_keywords: ["레더"],
  },
  {
    term: "청청 패션 (Double Denim)",
    trust_level: "통용어",
    origin: "데님 상하의를 매치하는 스타일링",
    history:
      "1951년 가수 빙 크로스비(Bing Crosby)가 데님 상하의 차림으로 밴쿠버의 한 호텔 입장을 거절당하자, 리바이스(Levi's)가 그를 위해 맞춤 데님 턱시도를 만들어준 일화에서 '캐네디언 턱시도(Canadian Tuxedo)'라는 별명이 붙었다. 처음엔 놀림조였지만 이후 하나의 패션 스타일로 자리잡았다.",
    description: "데님 상하의를 매치하는 스타일링이 핵심이며 캐주얼하면서도 위트 있는 무드를 표현",
    linked_luxury_terms: [L.backpack, L.shopperTote],
    raw_material_keywords: ["데님"],
  },
  {
    term: "캐주얼 (Casual)",
    trust_level: "통용어",
    origin: "격식 없이 편안하게 입는 일상복 스타일 전반",
    history:
      "특정 인물이나 사건에서 시작된 트렌드가 아니라, 격식 있는 정장 문화에 대응해 오랜 시간에 걸쳐 자리잡은 일상복 문화 전반을 가리킨다.",
    description: "격식 없이 편안하게 입는 것이 핵심이며 자연스럽고 편안한 무드를 표현",
    linked_luxury_terms: [L.backpack, L.messenger],
    raw_material_keywords: ["나일론", "코튼"],
  },
  {
    term: "파스텔 고스 (Pastel Goth)",
    trust_level: "통용어",
    origin: "고스 룩에 파스텔톤을 결합한 변형, 다크한 무드를 부드럽게 표현",
    history:
      "2000년대 말~2010년대 초 텀블러(Tumblr)에서 시작됐으며, 일본 하라주쿠의 데코라·페어리계 같은 스타일과 서구 고스 문화가 섞이며 탄생했다.",
    description: "다크한 고스 요소에 파스텔톤을 결합한 것이 핵심이며 발랄하면서도 음산한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.sequin, L.metallic],
  },
  {
    term: "펑크 룩 (Punk)",
    trust_level: "통용어",
    origin: "1970년대 펑크 록 문화에서 파생, DIY 정신과 반항적 디테일이 특징",
    history:
      "1970년대 중반 영국·미국에서 시작된 펑크 록(Punk Rock) 음악 문화에서 파생됐으며, 기성 체제에 대한 반항과 DIY 정신을 옷차림으로 표현했다.",
    description: "스터드, 체인, 찢어진 디테일이 핵심이며 반항적이고 즉흥적인 무드를 표현",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.chain],
  },
  {
    term: "페미닌룩 (Feminine Look)",
    trust_level: "통용어",
    origin: "곡선과 부드러움을 강조하는 여성스러운 스타일",
    history:
      "특정 시점에 만들어진 트렌드가 아니라, 곡선과 부드러움을 강조하는 여성스러운 실루엣이 패션사 전반에서 꾸준히 반복돼온 스타일 범주다.",
    description: "곡선과 부드러움을 강조하는 실루엣이 핵심이며 우아하고 여성스러운 무드를 표현",
    linked_luxury_terms: [L.hobo, L.clutch, L.jacquard],
    raw_material_keywords: ["실크"],
  },
  {
    term: "페어리계 (Fairy-kei)",
    trust_level: "통용어",
    origin: "동화·요정 이미지에서 영감받은 몽환적이고 소녀적인 스타일",
    history:
      "2000년대 초 일본 하라주쿠에서 시작됐으며, 마이 리틀 포니(My Little Pony) 같은 1980년대 서구 아동 캐릭터 문화를 일본식 카와이(かわいい) 감성으로 재해석했다. 2004년 문을 연 편집숍 스팽크(SPANK!)가 스타일 확산에 큰 역할을 했다.",
    description: "파스텔톤과 동화적인 소품이 핵심이며 몽환적이고 소녀적인 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "펫플룩 (Petplelook)",
    trust_level: "통용어",
    origin:
      "'펫(Pet)'과 '커플룩(Couple Look)'의 합성어. 2021년 브랜드 \"아루마루(Arumaru)\"가 \"Creates Petplelook\"이라는 슬로건과 함께 처음 선보인 트렌드. 반려동물과 주인이 의상·소품을 맞춰 입어 유대감을 표현하는 스타일",
    history:
      "'펫(Pet)'과 '커플룩(Couple Look)'을 합친 조어로, 2021년 브랜드 아루마루(Arumaru)가 반려동물과 주인이 함께 옷을 맞춰 입는다는 콘셉트로 처음 선보인 한국발 트렌드다.",
    description: "반려동물과 주인이 의상·소품을 맞춰 입는 것이 핵심이며 유대감을 표현하는 무드를 나타냄",
    linked_luxury_terms: [L.backpack, L.messenger],
    raw_material_keywords: ["나일론", "코튼"],
  },
  {
    term: "프레피 룩 (Preppy)",
    trust_level: "통용어",
    origin: "미국 사립학교 교복 룩에서 유래, 단정하고 규율 있어 보이는 인상",
    history:
      "20세기 초 미국 아이비리그 대학생들이 영국 전통 복식에 폴로 셔츠·카키 팬츠 같은 편안한 아이템을 더하며 형성됐다. 1980년 리사 번바크(Lisa Birnbach)의 책 《오피셜 프레피 핸드북(The Official Preppy Handbook)》이 이 스타일을 대중에게 널리 알렸다.",
    description: "블레이저, 폴로 셔츠, 카키 팬츠가 핵심이며 단정하고 규율 있어 보이는 무드를 표현",
    linked_luxury_terms: [L.satchel, L.topHandle, L.jacquard, L.herringbone],
  },
  {
    term: "히메로리 (Hime Lolita)",
    trust_level: "통용어",
    origin: "로리타 패션의 공주풍 변형, 우아하고 화려한 프린세스 무드",
    history:
      "로리타 패션에서 파생된 서브스타일로, 유럽 왕족·귀족의 화려한 이미지에서 영감을 받아 티아라 같은 장식을 더한 것이 특징이다.",
    description: "프린세스풍의 화려한 장식과 우아함이 핵심이며 고급스럽고 로맨틱한 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.clutch, L.cubic, L.sequin],
  },
  {
    term: "다크 아카데미아 (Dark Academia)",
    trust_level: "통용어",
    origin: "2010년대 텀블러 기반, 고전문학·전통 학문에 대한 향수를 어둡고 무게감 있게 표현",
    history:
      "2015년 무렵 텀블러(Tumblr)에서 시작됐으며, 1992년 발표된 도나 타트(Donna Tartt)의 소설 《비밀의 계절(The Secret History)》 속 엘리트 대학과 고전학 학생들의 이미지가 원형이 됐다. 2020년 팬데믹 시기 틱톡을 통해 널리 퍼졌다.",
    description: "트위드 재킷, 가죽 소재 등 클래식한 학구적 아이템이 핵심이며 어둡고 무게감 있는 무드를 표현",
    linked_luxury_terms: [L.satchel, L.embossed],
    raw_material_keywords: ["레더"],
  },
  {
    term: "라이트 아카데미아 (Light Academia)",
    trust_level: "통용어",
    origin:
      "다크 아카데미아의 반대급부로 등장한 서브컬처. 고대 그리스풍에 가까운 밝고 부드러운 톤, 스웨터·블라우스·터틀넥, 꽃·커피 같은 소품이 특징",
    history: "2019년 한 텀블러 이용자가 만들었으며, 다크 아카데미아의 무겁고 어두운 정서에 대한 반대급부로 등장했다.",
    description: "밝고 부드러운 톤에 스웨터·블라우스 같은 아이템이 핵심이며 낙관적이고 따뜻한 무드를 표현",
    linked_luxury_terms: [L.satchel, L.shopperTote, L.herringbone],
    raw_material_keywords: ["레더"],
  },
  {
    term: "로맨틱 아카데미아 (Romantic Academia)",
    trust_level: "통용어",
    origin:
      "다크 아카데미아에 낭만주의적 색채를 더한 변형. 실존주의적 무게감 대신 연애시·러브레터 같은 \"달달함\"을 강조. 색감은 라이트 아카데미아를 따르되, 옷 스타일은 다크 아카데미아의 클래식한 요소(트위드, 니트 스커트, 넥타이, 빈티지 주얼리)를 유지 (출처: Aesthetics Wiki, CC-BY-SA)",
    history:
      "다크 아카데미아에서 파생된 변형으로, 무거운 실존주의적 정서 대신 연애시·러브레터 같은 낭만적인 감성을 더했다.",
    description: "트위드·니트 등 클래식한 소재에 로맨틱한 디테일을 더한 것이 핵심이며 달콤하면서도 클래식한 무드를 표현",
    linked_luxury_terms: [L.satchel, L.hobo, L.jacquard],
    raw_material_keywords: ["레더"],
  },
  {
    term: "코케트 (Coquette)",
    trust_level: "통용어",
    origin: "프랑스어로 \"요염한 여자\"라는 뜻, 리본과 레이스로 로맨틱함을 강조하는 트렌드",
    history:
      "프랑스어로 '요염한 여자'라는 뜻이며, 2021년 무렵 인기를 얻기 시작해 2023년 12월 틱톡에서 리본을 이용한 챌린지 영상이 퍼지며 폭발적으로 유행했다. 가수 라나 델 레이(Lana Del Rey)가 이 무드의 상징적인 인물로 꼽힌다.",
    description: "리본과 레이스 장식이 핵심이며 로맨틱하고 소녀적인 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.hobo, L.sequin],
    raw_material_keywords: ["실크"],
  },
  {
    term: "코티지코어 (Cottagecore)",
    trust_level: "통용어",
    origin: "자연친화적이고 시골스러운 무드, 2023년 급부상한 트렌드",
    history:
      "'코티지코어'는 시골 오두막을 뜻하는 '코티지(cottage)'와 스타일을 가리키는 접미사 '코어(-core)'를 합친 조어로, 2018년 텀블러에서 이름 붙여졌다. 영국 낭만주의·빅토리아 시대의 전원 풍경에 대한 동경에서 비롯됐다.",
    description: "자연친화적이고 소박한 시골풍 무드가 핵심이며 평화롭고 향수 어린 분위기를 표현",
    linked_luxury_terms: [L.shopperTote, L.hobo, L.jacquard],
    raw_material_keywords: ["코튼"],
  },
  {
    term: "클린 걸 (Clean Girl)",
    trust_level: "통용어",
    origin: "스킨케어·자기관리를 기반으로 한 깔끔하고 정돈된 무드",
    history:
      "2021년 말 틱톡에서 시작된 트렌드로, 뒤로 넘긴 올림머리와 촉촉한 피부 같은 '건강한 자기관리' 이미지를 내세웠다. 이런 스타일 요소 자체는 이전부터 미국 서부의 치카나(Chicana) 여성 문화 등에서 이어져온 것이라는 지적도 있다.",
    description: "스킨케어와 정돈된 자기관리를 기반으로 한 깔끔한 무드가 핵심이며 절제된 건강미를 표현",
    linked_luxury_terms: [L.topHandle, L.clutch, L.metallic],
    raw_material_keywords: ["레더"],
  },
  {
    term: "소프트 걸 (Soft Girl)",
    trust_level: "통용어",
    origin: "연한 핑크 톤과 귀여운 복장이 특징인 사랑스러운 무드",
    history:
      "2019년 무렵 틱톡을 통해 하나의 스타일로 자리잡았으며, 일본 카와이(かわいい) 문화와 한국 케이팝(K-pop) 문화의 영향을 받았다.",
    description: "연한 파스텔 톤과 귀여운 복장이 핵심이며 사랑스럽고 부드러운 무드를 표현",
    linked_luxury_terms: [L.miniBag],
    raw_material_keywords: ["코튼", "실크"],
  },
  {
    term: "바닐라 걸 (Vanilla Girl)",
    trust_level: "통용어",
    origin: "아이보리·베이지 톤 위주의 아늑하고 따뜻한 무드",
    history:
      "2020년대 초 등장한 트렌드로, 클린 걸 무드에서 영감을 받아 아이보리·크림 색상을 중심으로 한 스타일로 발전했다.",
    description: "아이보리·베이지 톤 위주의 옷차림이 핵심이며 아늑하고 따뜻한 무드를 표현",
    linked_luxury_terms: [L.shopperTote, L.hobo],
    raw_material_keywords: ["코튼"],
  },
  {
    term: "다운타운 (Downtown)",
    trust_level: "통용어",
    origin: "뉴욕 도심에서 사는 듯한 분위기, 책·커피 등이 상징 아이템",
    history:
      "1970~80년대 뉴욕 소호(SoHo)·이스트빌리지(East Village)의 예술가·펑크 문화에 뿌리를 두며, 2022~2023년 무렵 SNS에서 다시 유행했다.",
    description: "무채색 톤의 캐주얼한 레이어드가 핵심이며 힙하고 도시적인 무드를 표현",
    linked_luxury_terms: [L.shopperTote, L.messenger],
    raw_material_keywords: ["데님", "나일론"],
  },
  {
    term: "인디 (Indie)",
    trust_level: "통용어",
    origin: "개인의 개성과 독창성을 기반으로 한 감성적이고 채도 높은 무드",
    history:
      "'인디'는 '독립적인(independent)'의 줄임말이다. 2000년대 중반 뉴욕·런던의 인디 록(Indie Rock)·포스트펑크 리바이벌 신에서 파생됐으며, 디자이너 에디 슬리먼(Hedi Slimane)이 스타일링한 밴드들의 이미지가 큰 영향을 줬다. '인디 슬리즈(Indie Sleaze)'라는 이름으로도 불린다.",
    description: "스키니진, 레더 재킷 등 힘 빼고 흐트러진 듯한 옷차림이 핵심이며 자유분방한 무드를 표현",
    linked_luxury_terms: [L.messenger, L.jacquard],
    raw_material_keywords: ["데님"],
  },
  {
    term: "로열 (Royal)",
    trust_level: "통용어",
    origin: "왕족 컨셉의 우아하고 화려한 무드",
    history:
      "2010년대 후반 텀블러·핀터레스트(Pinterest)에서 시작됐으며, 2020년 넷플릭스 드라마 《브리저튼(Bridgerton)》의 화려한 리젠시 시대 의상이 인기를 얻으며 대중적인 트렌드로 확산됐다.",
    description: "벨벳·새틴 같은 화려한 소재와 보석 장식이 핵심이며 우아하고 화려한 무드를 표현",
    linked_luxury_terms: [L.clutch, L.topHandle, L.diamondMonogram, L.metallic],
  },
  {
    term: "베디 (Baddie)",
    trust_level: "통용어",
    origin: "강렬하고 세보이는 인상, 반짝이는 소재와 몸에 붙는 실루엣이 특징",
    history:
      "흑인·라틴계 문화에서 자신감 있고 매력적인 여성을 가리키던 말에서 시작됐으며, 2010년대 중반 SNS를 통해 하나의 미용·패션 스타일로 자리잡았다.",
    description: "반짝이는 소재와 몸에 붙는 실루엣이 핵심이며 강렬하고 자신감 있는 무드를 표현",
    linked_luxury_terms: [L.miniBag, L.clutch, L.metallic, L.cubic],
  },
  {
    term: "이걸/이보이 (E-girl/E-boy)",
    trust_level: "통용어",
    origin: "인터넷 서브컬처 기반, 다크한 톤에 스트리트 요소가 섞인 스타일",
    history:
      "'이걸'은 '전자의(electronic)'와 '걸(girl)'을 합친 말이다. 2010년대 후반 틱톡에서 인기를 얻은 스타일로, 2000년대 이모·씬(scene) 문화와 일본 스트리트 패션(로리타, 카와이 등)이 섞이며 형성됐다.",
    description: "다크한 톤에 하트 아이라이너, 체인 같은 스트리트 요소가 핵심이며 인터넷 서브컬처 특유의 무드를 표현",
    linked_luxury_terms: [L.beltBag, L.messenger, L.stud, L.metallic],
  },
  {
    term: "비스코걸 (VSCO girl)",
    trust_level: "통용어",
    origin: "스크런치, 편안한 캐주얼함을 강조하는 미국 10대 트렌드",
    history: "사진 편집 앱 비스코(VSCO)에서 이름을 땄으며, 2019년 미국 10대들 사이에서 틱톡을 통해 유행한 트렌드다.",
    description: "스크런치, 후드 등 편안한 캐주얼함이 핵심이며 자유롭고 친환경적인 무드를 표현",
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

// 취향 카드에 연결된 럭셔리 용어 카드를 전부 반환한다 (화면 표시용 —
// 형태 검색 범위를 좁히는 필터로는 쓰지 않는다). 카드 하나가 형태+소재
// 여러 개에 연결될 수 있어서 대표 1개만 뽑지 않고 전부 보여준다.
// linked_luxury_terms는 형태를 먼저 적는 순서로 관리한다.
export function resolveLinkedLuxuryTerms(
  term: TasteTermCard,
  library: TasteLibrary = tasteLibrary,
): LuxuryTermCard[] {
  return linkedLuxuryCards(term, library);
}
