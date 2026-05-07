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
  heroEyebrow: '양재역 본점 · 더룸 을지로동대문점',
  heroH1: '상위1% 서울 3대 목살맛집',
  heroSub: '야생쑥을 먹고 자란 산청 흑돼지 · 거창 백돼지. 불포화지방산이 풍부하고 쫄깃한 육질과 담백한 맛이 일품입니다.',
  heroCtaPrimary: '지금 예약하기',
  heroCtaSecondary: '메뉴 보기',

  authorityEyebrow: 'MEDIA · 셰프 추천',
  authorityH2: '셰프 이원일이 직접 소개한',
  authoritySub: '돼지고기 참 잘하는 육즙관리소',

  whyEyebrow: 'WHY 육즙관리소',
  whyH2: '네 가지 약속',

  pillars: [
    {
      key: 'origin',
      title: '산지 직거래',
      description: '가장 좋은 식재료를 고집합니다. 야생쑥을 먹고 자란 산청 흑돼지·거창 백돼지 — 불포화지방산이 풍부하고 쫄깃한 육질의 비결.',
    },
    {
      key: 'aging',
      title: '특허 파동숙성',
      description: '파동 에너지로 근섬유를 이완시켜 효소 숙성을 극대화. 육즙 손실 없이 고기 전체가 고르게 부드러워지고, 잡내 없이 깊고 진한 풍미를 끌어냅니다.',
    },
    {
      key: 'duct',
      title: '하향식 덕트',
      description: '연기·냄새를 식탁 아래로 즉시 흡입. 옷에 냄새가 배지 않고 눈이 맵지 않아, 데이트·회식·청첩장 자리에서도 깔끔하게 즐길 수 있습니다.',
    },
    {
      key: 'sides',
      title: '수제 반찬 무한리필',
      description: '유자청 겉절이 · 계절 장아찌 직접 담금 · 고급 수향미 밥',
    },
  ],

  signatureH2: '시그니처 메뉴',
  signatureMore: '전체 메뉴 보기 →',

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
