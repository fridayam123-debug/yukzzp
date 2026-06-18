import type { Database } from '@/lib/supabase/types'
import { BRAND } from '@/lib/constants/brand'

type Loc = Database['public']['Tables']['locations']['Row']

type HourPeriod = {
  open?: string
  close?: string
  last_order?: string
  break?: string[]
  close_next_day?: string
  break_weekday?: string[]
}

/**
 * 지점별 정적 aggregateRating — 캐치테이블 / 네이버 플레이스 공개 수치 기준.
 * DB reviews에 numeric rating 컬럼이 채워지면 동적으로 교체할 것.
 */
const STATIC_RATINGS: Record<string, { ratingValue: number; ratingCount: number }> = {
  yangjae: { ratingValue: 4.5, ratingCount: 51 },
  euljiro: { ratingValue: 4.4, ratingCount: 60 },
}

/** 지점별 GEO 상세 정보 (화면 FAQ/카피와 동일 사실 기반) */
const LOCATION_DETAIL: Record<
  string,
  {
    alternateName?: string
    description: string
    keywords: string[]
    rooms: string
    nearby: string[]
  }
> = {
  yangjae: {
    description:
      '육즙관리소 양재역본점은 양재역 3번 출구에서 도보 약 2분 거리에 위치한 프리미엄 K-BBQ 다이닝입니다. 산청 흑돼지와 거창 백돼지를 특허 파동숙성하고 100% 대나무숯 직화로 구워 전문 서버가 직접 그릴링해 드립니다. 하향식 덕트로 연기와 냄새를 줄였으며, 8인·10인·20인·40인 프라이빗 룸과 단체석을 갖춰 회식·접대·데이트·가족 외식에 적합한 양재역 맛집입니다.',
    keywords: [
      '양재역 맛집', '양재역 고깃집', '양재역 회식', '양재역 목살', '양재역 삼겹살',
      '산청 흑돼지', '거창 백돼지', '특허 파동숙성', '100% 대나무숯',
      '전문 서버 그릴링', '하향식 덕트', '프라이빗 룸', '단체석',
    ],
    rooms: '8인·10인·20인·40인 룸/단체석',
    nearby: ['양재역'],
  },
  euljiro: {
    alternateName: 'The Room Euljiro Dongdaemun',
    description:
      '육즙관리소 더룸 을지로 동대문점(The Room Euljiro Dongdaemun)은 동대문역사문화공원역에서 도보 약 3분 거리, DDP·동대문·을지로·청계천 인근에 위치한 프리미엄 K-BBQ in Seoul입니다. 산청 흑돼지와 거창 백돼지를 100% 대나무숯 직화로 구워 전문 서버가 직접 그릴링하며, 하향식 덕트로 연기와 냄새를 줄였습니다. 4인·8인·10인·16인·20인·35인 개별룸과 단체석을 갖췄고, 새벽 5시까지 영업해 외국인 관광객·해외 바이어 접대와 심야 회식에 적합합니다. 굿모닝시티 지하주차장 1시간 무료 주차권을 제공합니다.',
    keywords: [
      '동대문 맛집', '동대문 고깃집', '을지로 맛집', '을지로 고깃집', 'DDP 맛집',
      'K-BBQ in Seoul', '외국인 관광객', '해외 바이어 접대', '동대문역사문화공원역',
      '산청 흑돼지', '거창 백돼지', '전문 서버 그릴링', '하향식 덕트',
      '심야 영업', '새벽 5시', '굿모닝시티 주차',
    ],
    rooms: '4인·8인·10인·16인·20인·35인 개별룸/단체석',
    nearby: ['동대문역사문화공원역', 'DDP 동대문디자인플라자', '동대문', '을지로', '청계천'],
  },
}

function buildOpeningHours(hours: Record<string, HourPeriod> | null): string[] {
  if (!hours) return []
  const result: string[] = []
  for (const [period, info] of Object.entries(hours)) {
    const open = info.open ?? ''
    const close = info.close ?? info.close_next_day ?? ''
    if (!open || !close) continue
    if (period === 'everyday' || period === 'daily') {
      result.push(`Mo-Su ${open}-${close}`)
    } else if (period === 'weekday') {
      result.push(`Mo-Fr ${open}-${close}`)
    } else if (period === 'weekend') {
      result.push(`Sa-Su ${open}-${close}`)
    }
  }
  return result
}

export function RestaurantJsonLd({ location }: { location: Loc }) {
  const hours = location.hours as Record<string, HourPeriod> | null
  const openingHours = buildOpeningHours(hours)
  const locationUrl = `${BRAND.domain}/locations/${location.slug}`
  const detail = LOCATION_DETAIL[location.slug]

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BRAND.domain}/#restaurant-${location.slug}`,
    url: locationUrl,
    name: location.name_ko,
    alternateName: detail?.alternateName,
    description: detail?.description,
    keywords: detail?.keywords.join(', '),
    image: location.hero_image ? [`${BRAND.domain}${location.hero_image}`] : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address_road,
      postalCode: location.postal_code,
      addressLocality: 'Seoul',
      addressCountry: 'KR',
    },
    telephone: location.phone ?? location.virtual_phone,
    servesCuisine: ['Korean BBQ', '한식', '프리미엄 K-BBQ', '흑돼지구이'],
    priceRange: '₩₩₩',
    acceptsReservations: 'True',
    geo: location.geo
      ? { '@type': 'GeoCoordinates', ...(location.geo as Record<string, unknown>) }
      : undefined,
    openingHours: openingHours.length > 0 ? openingHours : undefined,
    hasMenu: `${BRAND.domain}/menu`,
    hasMap: location.naver_place_id
      ? `https://map.naver.com/p/entry/place/${location.naver_place_id}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name_ko ?? '')}`,
    aggregateRating: STATIC_RATINGS[location.slug]
      ? {
          '@type': 'AggregateRating',
          ratingValue: STATIC_RATINGS[location.slug].ratingValue,
          bestRating: 5,
          worstRating: 1,
          ratingCount: STATIC_RATINGS[location.slug].ratingCount,
        }
      : undefined,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: `프라이빗 룸 (${detail?.rooms ?? '룸'})`, value: true },
      { '@type': 'LocationFeatureSpecification', name: '단체석', value: true },
      { '@type': 'LocationFeatureSpecification', name: '하향식 덕트 시스템', value: true },
      { '@type': 'LocationFeatureSpecification', name: '영문 메뉴', value: true },
      { '@type': 'LocationFeatureSpecification', name: '전담 서버 그릴링 서비스', value: true },
      { '@type': 'LocationFeatureSpecification', name: '산청 흑돼지 · 거창 백돼지', value: true },
      { '@type': 'LocationFeatureSpecification', name: '100% 대나무숯 직화', value: true },
      ...(location.slug === 'yangjae'
        ? [{ '@type': 'LocationFeatureSpecification', name: '특허 파동숙성', value: true }]
        : [
            { '@type': 'LocationFeatureSpecification', name: '새벽 5시까지 영업', value: true },
            { '@type': 'LocationFeatureSpecification', name: '굿모닝시티 지하주차장 1시간 무료', value: true },
          ]),
    ],
    sameAs: [
      BRAND.instagramUrl,
      BRAND.kakaoChannelUrl,
      location.naver_place_id ? `https://place.map.naver.com/restaurant/${location.naver_place_id}` : null,
      location.catchtable_url,
      BRAND.youtubeShort,
    ].filter(Boolean),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BRAND.domain },
      { '@type': 'ListItem', position: 2, name: '지점', item: `${BRAND.domain}/locations` },
      { '@type': 'ListItem', position: 3, name: location.name_ko, item: locationUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}
