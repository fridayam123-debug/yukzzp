import { BRAND } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'

type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export function MenuJsonLd({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${BRAND.domain}/menu`,
    hasMenuSection: categories.map(cat => ({
      '@type': 'MenuSection',
      name: cat.name_ko,
      identifier: cat.slug,
      hasMenuItem: items.filter(i => i.category_id === cat.id).map(i => ({
        '@type': 'MenuItem',
        name: i.name_ko,
        description: i.description_ko ?? undefined,
        offers: i.price_krw ? { '@type': 'Offer', price: i.price_krw, priceCurrency: 'KRW' } : undefined,
      })),
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
