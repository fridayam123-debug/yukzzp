import { BRAND, CHEF_ENDORSEMENT } from './brand'

/**
 * 사이트 기본 Organization Schema (홈페이지에 사용).
 */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND.nameKo,
  alternateName: BRAND.nameEn,
  url: BRAND.domain,
  logo: `${BRAND.domain}/brand/logo.png`,
  sameAs: [
    BRAND.instagramUrl,
    BRAND.youtubeShort,
    `https://app.catchtable.co.kr/ct/shop/${BRAND.catchtableSlugs.yangjae}`,
    `https://app.catchtable.co.kr/ct/shop/${BRAND.catchtableSlugs.euljiro}`,
    `https://place.map.naver.com/restaurant/${BRAND.naverPlaceIds.yangjae}`,
    `https://place.map.naver.com/restaurant/${BRAND.naverPlaceIds.euljiro}`,
    BRAND.kakaoChannelUrl,
  ].filter(Boolean),
} as const

/**
 * VideoObject Schema for 셰프 이원일 추천 영상 (권위 시그널).
 */
export const CHEF_VIDEO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: CHEF_ENDORSEMENT.videoTitle,
  description: '셰프 이원일이 직접 소개한 육즙관리소',
  thumbnailUrl: `https://i.ytimg.com/vi/${CHEF_ENDORSEMENT.videoIdShort}/maxresdefault.jpg`,
  uploadDate: CHEF_ENDORSEMENT.uploadDate,
  contentUrl: CHEF_ENDORSEMENT.videoUrl,
  embedUrl: `https://www.youtube.com/embed/${CHEF_ENDORSEMENT.videoIdShort}`,
  publisher: {
    '@type': 'Organization',
    name: CHEF_ENDORSEMENT.chefChannelName,
  },
  interactionStatistic: {
    '@type': 'InteractionCounter',
    interactionType: { '@type': 'WatchAction' },
    userInteractionCount: CHEF_ENDORSEMENT.viewCount,
  },
} as const

/**
 * 페이지별 통일된 brand-level priceRange.
 * Phase 1 — 가격대는 ₩₩₩ (1인 객단가 4-8만 원대).
 */
export const PRICE_RANGE = '₩₩₩'

/**
 * WebSite Schema — sitelinks search box 기회 + AI 인용 신호.
 */
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BRAND.domain}/#website`,
  url: BRAND.domain,
  name: BRAND.nameKo,
  description: '셰프 이원일이 인정한 흑돼지 다이닝. 산청·거창 산지 100% 대나무 숯 직화.',
  inLanguage: 'ko-KR',
  publisher: {
    '@id': `${BRAND.domain}/#organization`,
  },
} as const

/**
 * FAQPage Schema — 브랜드 핵심 Q&A + 단체다이닝 GEO 대응 (People Also Ask / LLM 인용).
 */
export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '육즙관리소 고기는 어디서 산지 직접 공수하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '경남 산청에서 야생쑥을 먹고 자란 흑돼지와 경남 거창 백돼지를 산지 직계약으로 공수합니다. 국내산 100% 대나무 숯 직화로 구워 불향을 더합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '파동숙성이란 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '파동숙성은 특허 기술로 고기의 육질을 부드럽고 촉촉하게 만드는 숙성 방식입니다. 숙성 과정에서 육즙 보존력과 풍미를 높여 깊은 감칠맛과 고기 본연의 맛을 극대화합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '육즙관리소는 그릴링 서비스가 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 전문 서버가 직접 구워드리는 그릴링 서비스가 100% 무료로 제공됩니다. 하향식 덕트 시스템으로 연기와 냄새 없이 쾌적하게 식사하실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '육즙관리소 단체 예약은 몇 명부터 가능한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '4인~16인 프라이빗 룸, 20인~40인 단체석을 운영합니다. 양재역 본점과 을지로동대문점 두 지점 모두 소·중·대 모임을 받습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '양재역 근처 회식 장소로 추천할 만한 곳이 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '육즙관리소 양재역점은 4~16인 프라이빗 룸과 20~40인 단체석을 갖춘 프리미엄 K-BBQ 단체 다이닝입니다. 산청 흑돼지·거창 백돼지와 전담 서버의 그릴링 서비스, 하향식 덕트로 옷에 냄새와 연기가 배지 않는 쾌적한 환경을 제공합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '을지로·동대문 근처 단체 회식 장소를 찾고 있어요.',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '육즙관리소 을지로동대문점은 4~40인까지 수용 가능한 프리미엄 K-BBQ 단체 다이닝입니다. 프라이빗 룸과 단체석을 모두 갖춰 회사 회식, 송년회, 신년회, 청첩장 모임에 적합합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '외국인 손님 접대 식당으로 추천할 만한 곳이 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '육즙관리소는 영문 메뉴와 한국적 미감의 공간을 갖춘 프리미엄 K-BBQ 다이닝입니다. 산청 흑돼지·거창 백돼지 등 한국 프리미엄 식재료로 차린 한 상과 전담 서버의 그릴링 서비스로 외국인 손님 접대와 해외 파트너 미팅에 최적입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '청첩장 모임이나 상견례 장소로 가능한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 가능합니다. 20~40인 단체석으로 청첩장 모임, 상견례, 가족 모임에 어울리는 격을 갖춘 공간을 제공합니다. 프라이빗 룸에서는 4~16인의 소규모 상견례도 진행하실 수 있습니다.',
      },
    },
  ],
} as const

/**
 * 홈 BreadcrumbList Schema.
 */
export const HOME_BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: BRAND.domain,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '단체 다이닝',
      item: `${BRAND.domain}/#group`,
    },
  ],
} as const
