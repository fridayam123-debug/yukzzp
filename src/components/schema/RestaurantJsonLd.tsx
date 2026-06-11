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

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BRAND.domain}/#restaurant-${location.slug}`,
    url: BRAND.domain,
    name: location.name_ko,
    image: location.hero_image ? [`${BRAND.domain}${location.hero_image}`] : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address_road,
      postalCode: location.postal_code,
      addressLocality: 'Seoul',
      addressCountry: 'KR',
    },
    telephone: location.phone,
    servesCuisine: ['Korean BBQ', '한식', '프리미엄 K-BBQ', '흑돼지구이'],
    priceRange: '₩₩₩',
    acceptsReservations: 'True',
    geo: location.geo
      ? { '@type': 'GeoCoordinates', ...(location.geo as Record<string, unknown>) }
      : undefined,
    openingHours: openingHours.length > 0 ? openingHours : undefined,
    hasMenu: `${BRAND.domain}/menu`,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: '프라이빗 룸', value: true },
      { '@type': 'LocationFeatureSpecification', name: '단체석', value: true },
      { '@type': 'LocationFeatureSpecification', name: '하향식 덕트 시스템', value: true },
      { '@type': 'LocationFeatureSpecification', name: '영문 메뉴', value: true },
      { '@type': 'LocationFeatureSpecification', name: '전담 서버 그릴링 서비스', value: true },
      { '@type': 'LocationFeatureSpecification', name: '주차 가능', value: true },
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
