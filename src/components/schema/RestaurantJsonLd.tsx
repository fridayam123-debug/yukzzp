import type { Database } from '@/lib/supabase/types'
import { BRAND } from '@/lib/constants/brand'

type Loc = Database['public']['Tables']['locations']['Row']

export function RestaurantJsonLd({ location }: { location: Loc }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BRAND.domain}/locations/${location.slug}`,
    name: location.name_ko,
    image: location.hero_image ? `${BRAND.domain}${location.hero_image}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address_road,
      postalCode: location.postal_code,
      addressLocality: 'Seoul',
      addressCountry: 'KR',
    },
    telephone: location.phone,
    servesCuisine: location.category_ko,
    priceRange: '₩₩₩',
    geo: location.geo ? { '@type': 'GeoCoordinates', ...(location.geo as object) } : undefined,
    sameAs: [
      BRAND.instagramUrl,
      location.naver_place_id ? `https://place.map.naver.com/restaurant/${location.naver_place_id}` : null,
      location.catchtable_url,
      BRAND.youtubeShort,
    ].filter(Boolean),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
