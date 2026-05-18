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
  authorityH2: '이원일 셰프가 직접 소개한',
  authoritySub: '"미친 듯이 맛있는 돼지고기집" 육즙관리소',
  authorityBody: [
    '이원일 셰프는 공식 채널 211TV를 통해 육즙관리소를 직접 소개하며, "미친 듯이 맛있는 돼지고기집"이라는 표현과 함께 프리미엄 K-BBQ 다이닝으로 추천했습니다.',
    '주목한 포인트는 산청 흑돼지와 거창 백돼지, 특허받은 파동숙성, 100% 대나무숯 직화, 그리고 전문 서버의 그릴링 서비스였습니다. 특히 압력솥으로 지어 제공하는 프리미엄 수향미는 식사의 완성도를 높여주는 디테일로 높게 평가되었습니다.',
    '육즙관리소는 프라이빗 룸과 하향식 덕트 시스템을 통해 연기와 냄새를 최소화하며, 더욱 쾌적하고 감각적인 서울 프리미엄 Korean BBQ Dining Experience를 제공합니다.',
  ],

  brandStoryEyebrow: 'BRAND STORY',
  brandStoryH2: '대기업과 패션이 만나\n탄생한 정직한 다이닝',
  brandStoryP1: '대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.\n두 사람이 육즙관리소를 시작한 이유는 단순했습니다.\n자신들이 진짜 먹고 싶은 고기를, 자신들이 대접받고 싶은 방식으로.',
  brandStoryP2: '산청 흑돼지와 거창 백돼지를 산지에서 직계약합니다.\n특허 파동숙성 기술로 육즙을 살리고,\n100% 대나무 숯 직화로 불향을 더합니다.\n재료에 정직한 기술을 더해 한 접시를 완성합니다.',

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
  groupH2: '회식 · 동창회 · 청첩장은 단체석에서',
  groupSub: '4~16인 프라이빗 룸부터 20~40인 단체석까지. 두 지점 모두 소·중·대 모임을 모두 받습니다.',
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
    name: '프리미엄 그릴링서비스 (100%무료)',
    description: '직접 굽지 않아도 되는 편안함, 가장 맛있는 타이밍에 완성되는 풍미, 전문서버의 그릴링 서비스',
    priceKrw: 0,
    priceLabel: '0원',
    image: null,  // /photos/food/grilling-service.jpg (TBD — placeholder shown until image added)
    isSignature: true,
  },
  {
    key: 'jirisan-moksal',
    name: '지리산 산청 흑돼지 목살 (160g)',
    description: '흑돼지의 순도 높은 본질과 부드러움 풍미의 정교한 균형이 돋보이는 프리미엄 목살',
    priceKrw: 19000,
    image: '/photos/food/modeum-platter.png',
    isSignature: true,
  },
  {
    key: 'bulgogi-set',
    name: '양념소불고기정식 (점심특선)',
    description: '양념소불고기와 낚지볶음소면, 된장찌개, 계란찜, 공기밥, 6가지 반찬까지 풍성한 점심 시그니처메뉴',
    priceKrw: 24000,
    image: '/photos/food/bulgogi-set.png',
    isSignature: true,
  },
  {
    key: 'avocado-yukhoe',
    name: '아보카도 육회',
    description: '부드러운 아보카도와 고소한 육회의 풍미가 완벽하게 어우러진 육즙관리소의 시그니처 콜드 메뉴',
    priceKrw: 28000,
    image: '/photos/food/avocado-yukhoe-mini.png',
    isSignature: true,
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
