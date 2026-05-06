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
