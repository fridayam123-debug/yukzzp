/**
 * 육즙관리소 브랜드 상수.
 * 환경 변수에서 로드하는 항목은 .env.local 참조.
 */

export const BRAND = {
  nameKo: '육즙관리소',
  nameEn: 'Yukzzp',
  tagline: 'PREMIUM DINING',
  taglineSubKo: '프리미엄 흑돼지 다이닝',
  origin: '산청 흑돼지 · 거창 백돼지',
  domain: 'https://yukzzp.com',
  email: '', // 사장님께 받음 — 빌드 시 .env로 주입

  instagramHandle: 'yukzzp__management_office',
  instagramUrl: 'https://www.instagram.com/yukzzp__management_office',

  youtubeShort: 'https://www.youtube.com/shorts/7CCR4BYW7D0',

  /** 카카오 채널 (D5 확정) */
  kakaoChannelUrl:
    process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? 'https://pf.kakao.com/_ARVxkn',

  /** Naver Place IDs (D2 확정 — 사장님 등록) */
  naverPlaceIds: {
    yangjae: '1672141709',
    euljiro: '2033717879',
  },

  /** Catchtable shop slugs */
  catchtableSlugs: {
    yangjae: 'yanggae___meat',
    euljiro: 'yukjeup_ddm',
  },
} as const

/** 셰프 이원일 추천 영상 (권위 시그널) */
export const CHEF_ENDORSEMENT = {
  chefName: '이원일',
  chefChannelName: '셰프이원일',
  videoTitle: '돼지고기 참 잘하는 육즙관리소',
  videoUrl: 'https://www.youtube.com/shorts/7CCR4BYW7D0',
  videoIdShort: '7CCR4BYW7D0',
  /** 빌드 시점 캐시값 — 정기적으로 업데이트 */
  viewCount: 23082,
  uploadDate: '2026-01-06',
} as const

/** Phase 1 메인 LP 카피 (한국어) */
export const COPY_KO = {
  heroEyebrow: '양재역 본점 · 더룸 을지로 · 동대문점',
  heroH1: '맛과 공간, 스타일로 완성한\n프리미엄 K-BBQ 다이닝',
  heroSub: '육즙관리소는 서울의 프리미엄 K-BBQ 다이닝 브랜드입니다. 패션 디자이너 출신 대표의 감각으로 맛과 공간, 서비스를 하나의 경험으로 디자인했습니다. 엄선된 산청 흑돼지와 거창 백돼지, 그리고 7가지 시그니처 소스로 완성도 높은 Korean BBQ Dining을 제공합니다. 프라이빗 룸과 전문 그릴링 서비스, 하향식 덕트 시스템으로 더욱 편안하고 쾌적한 다이닝 경험을 제공합니다. 육즙관리소는 한국적인 미감과 현대적인 감각이 어우러진 새로운 서울 프리미엄 Korean Dining Experience를 만들어갑니다.',
  heroCtaPrimary: '지금 예약하기',
  heroCtaSecondary: '메뉴 보기',

  authorityEyebrow: 'MEDIA · Chef Recommendation',
  authorityH2: '이원일 셰프가 직접 소개한\n미친듯이 맛있는 돼지고기집 육즙관리소',
  authoritySub: '"미친 듯이 맛있는 돼지고기집" 육즙관리소',
  authorityBody: [
    '이원일 셰프는 공식 채널 211TV를 통해 육즙관리소를 직접 소개하며, "미친 듯이 맛있는 돼지고기집"이라는 표현과 함께 프리미엄 K-BBQ 다이닝으로 추천했습니다.',
    '주목한 포인트는 산청 흑돼지와 거창 백돼지, 특허받은 파동숙성, 100% 대나무숯 직화, 그리고 전문 서버의 그릴링 서비스였습니다. 특히 압력솥으로 지어 제공하는 프리미엄 수향미는 식사의 완성도를 높여주는 디테일로 높게 평가되었습니다.',
    '육즙관리소는 프라이빗 룸과 하향식 덕트 시스템을 통해 연기와 냄새를 최소화하며, 더욱 쾌적하고 감각적인 서울 프리미엄 Korean BBQ Dining Experience를 제공합니다.',
  ],

  brandStoryEyebrow: 'BRAND STORY',
  brandStoryH2: '한국의 아름다움을\n한 끼의 경험으로 담아내고 싶었습니다',
  brandStoryP1: '대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.\n10년간 프랜차이즈 외식업을 함께 일구며 우리가 깨달은 것은,\n한 끼의 식사가 한 사람을 귀하게 모시는 일이 될 수 있다는 사실이었습니다.\n우리는 그 마음을 \'섬김\'이라 부릅니다.\n손님을 가장 귀한 사람으로 모시는 한국의 환대 정신.\n그것이 우리가 차리는 모든 상의 시작입니다.',
  brandStoryP2: '그리고 우리는 한국의 멋을 온전히 담습니다.\n정성껏 구운 고기의 맛은 물론, 손에 닿는 식기와 정갈한 오브제, 공간의 결 하나하나까지 — 한국의 미감을 오늘의 식탁 위에 새깁니다.\n자연이 준 정직한 재료에 한국의 멋과 섬김을 더해\n한 접시에 한국을 담아 세상에 전합니다.',

  whyEyebrow: 'WHY 육즙관리소',
  whyH2: '네 가지 약속',

  pillars: [
    {
      key: 'origin',
      title: '가장 좋은 식재료',
      description: '육즙관리소는 전국 팔도의 최상급 식재료만을 고집합니다. 야생쑥을 사료화해 건강하게 키운 산청 흑돼지와 거창 백돼지는 깊은 풍미와 쫄깃한 육질을 자랑하며, 뛰어난 향과 찰기를 가진 프리미엄 수향미는 식사의 완성도를 더욱 높여줍니다. 좋은 재료가 맛의 기준을 만든다는 믿음으로, 육즙관리소는 원육부터 쌀, 곁들임 하나까지 가장 좋은 재료만을 선별합니다.',
    },
    {
      key: 'aging',
      title: '특허 파동숙성',
      description: '파동숙성은 고기의 육질을 더욱 부드럽고 촉촉하게 만들어주는 숙성 방식입니다. 숙성 과정에서 육즙 보존력과 풍미를 높여 깊은 감칠맛과 깔끔한 고기 본연의 맛을 끌어냅니다. 육즙관리소는 좋은 원육에 파동숙성을 더해 더욱 부드럽고 풍미 깊은 고기를 제공합니다.',
    },
    {
      key: 'grilling',
      title: '전문 그릴링 + 대나무 숯',
      description: '전문 서버가 직접 구워드립니다. 100% 대나무 숯 + 하향식 덕트로 연기·냄새 차단.',
    },
    {
      key: 'sides',
      title: '직접 담근 정성찬',
      description: '매장에서 직접 만드는 반찬과 7가지 소스. 유자청 겉절이 · 계절 장아찌.',
    },
  ],

  signatureH2: '시그니처 메뉴',
  signatureMore: '전체 메뉴 보기 →',
  signatureSubtitle: '대표 메뉴 4선',

  locationsEyebrow: 'LOCATIONS',
  locationsH2: '두 곳에서 만나요',

  groupEyebrow: 'GROUP DINING',
  groupH2: '서울 프리미엄 K-BBQ 단체 다이닝',
  groupSubheading: '회식 · 송년회 · 신년회 · 청첩장 · 비즈니스 미팅 · 외국인 접대 · 데이트',
  groupBody: [
    '육즙관리소는 서울 양재역과 을지로동대문에 위치한 프리미엄 K-BBQ 단체 다이닝 브랜드입니다. 4~16인 프라이빗 룸부터 20~40인 단체석까지, 다양한 규모와 목적의 단체 모임을 위한 공간을 제공합니다.',
    '산청 흑돼지와 거창 백돼지, 전담 서버의 그릴링 서비스, 100% 대나무 숯 직화, 하향식 덕트 시스템. 옷에 냄새와 연기가 배지 않는 쾌적한 환경에서 한국적 미감과 현대적 감각이 어우러진 새로운 Korean Dining Experience를 누리실 수 있습니다.',
  ],
  groupUseCases: [
    '회사 회식', '부서 회식', '송년회', '신년회',
    '청첩장 모임', '가족 모임', '생일 모임',
    '비즈니스 미팅', '바이어 접대', '외국인 손님 식사', '동창 모임', '단체 회식', '데이트',
  ],
  groupCtaCall: '전화 문의',
  groupCtaKakao: '카카오 채널 문의',

  reservationEyebrow: 'RESERVATION',
  reservationH2: '지금 예약하기',
  reservationSub: '네이버 예약 · 캐치테이블 실시간 / 단체 · 룸은 전화 문의',

  instagramEyebrow: 'INSTAGRAM',
  instagramFollow: `@${'yukzzp__management_office'} 팔로우 →`,

  /** 푸터 디스클레이머 — 메뉴/가격 변동성 안내 */
  menuPriceDisclaimer: '메뉴 항목과 가격은 각 매장의 사정에 따라 다를 수 있습니다.',
} as const

/** Signature menu 4선 (시그니처 섹션 — Supabase 대신 정적 데이터) */
export const SIGNATURE_ITEMS = [
  {
    key: 'grilling-service',
    name: '전담 서버의 그릴링 서비스',
    description: '직접 굽지 않아도 되는 편안함, 가장 맛있는 타이밍에 완성되는 풍미. 손님은 대화와 식사에만 집중하시면 됩니다.',
    priceKrw: 0,
    priceLabel: 'INCLUDED',
    image: null,
    isSignature: true,
  },
  {
    key: 'jirisan-moksal',
    name: '지리산 산청 흑돼지 목살 (160g)',
    description: '야생쑥을 먹고 자란 산청 흑돼지의 목살. 지방과 살코기의 탁월한 균형, 씹을수록 깊어지는 감칠맛.',
    priceKrw: 19000,
    image: '/photos/food/modeum-platter.png',
    isSignature: true,
  },
  {
    key: 'bulgogi-set',
    name: '양념소불고기정식 (점심특선)',
    description: '양념소불고기, 낙지볶음소면, 된장찌개, 계란찜. 격을 갖춘 한 상을, 점심에 가볍게 누리는 시그니처 정식.',
    priceKrw: 24000,
    image: '/photos/food/bulgogi-set.png',
    isSignature: true,
  },
  {
    key: 'avocado-yukhoe',
    name: '아보카도 육회',
    description: '부드러운 아보카도 위에 올린 정갈한 육회. 고소함과 깔끔함이 한 점에서 만나는 콜드 시그니처.',
    priceKrw: 28000,
    image: '/photos/food/avocado-yukhoe-mini.png',
    isSignature: true,
  },
] as const

/** 단체 다이닝 목적별 카테고리 (SEO h3 아티클) */
export const GROUP_CATEGORIES = [
  {
    h3: '회사 회식 · 부서 회식 · 송년회 · 신년회',
    body: '4~16인 프라이빗 룸으로 부서 단위 회식과 연말 송년회, 신년회에 적합합니다. 양재역·을지로 도심 접근성이 좋아 직장인 회식 장소로 많은 분들이 찾으십니다.',
  },
  {
    h3: '비즈니스 미팅 · 바이어 접대 · VIP 의전',
    body: '독립된 프라이빗 룸과 전담 서버의 그릴링 서비스로 비즈니스 디너와 바이어 접대, VIP 의전에 적합합니다. 산청 흑돼지·거창 백돼지 등 한국 프리미엄 식재료로 격을 갖춘 한 상을 차립니다.',
  },
  {
    h3: '외국인 손님 접대 · K-BBQ Experience',
    body: '영문 메뉴와 한국적 미감의 공간으로 외국인 손님 접대와 해외 파트너 미팅에 최적입니다. K-BBQ를 통해 한국의 맛과 멋을 함께 소개할 수 있는 Korean Dining Experience를 제공합니다.',
  },
  {
    h3: '청첩장 모임 · 상견례 · 가족 모임 · 생일 · 동창 모임',
    body: '20~40인 단체석으로 청첩장 모임, 상견례, 가족 모임, 생일 모임, 동창회 등 의미 있는 자리에 어울리는 공간입니다.',
  },
] as const

/** 지점별 단체 CTA 카피 (지점 구분) */
export const LOCATION_CTA = {
  yangjae: {
    label: '양재 본점',
    callLabel: '☎ 양재 0507-1335-6363',
    phone: '0507-1335-6363',
    telHref: 'tel:0507-1335-6363',
  },
  euljiro: {
    label: '을지로동대문',
    callLabel: '☎ 을지로 0507-1461-7228',
    phone: '0507-1461-7228',
    telHref: 'tel:0507-1461-7228',
  },
} as const
