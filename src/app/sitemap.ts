import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'

const LOCALES = ['ko', 'en', 'ja', 'zh', 'vi'] as const
const PAGES = [
  { path: '',                      priority: 1,   changeFrequency: 'weekly'  as const },
  { path: '/menu',                 priority: 0.9, changeFrequency: 'weekly'  as const },
  { path: '/locations/yangjae',    priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/locations/euljiro',    priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/notice',               priority: 0.7, changeFrequency: 'weekly'  as const },
  // SEO landing pages
  { path: '/yangjae-matjip',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-hoesik',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-moksal',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/dongdaemun-matjip',    priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/ddp-matjip',           priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/euljiro-hoesik',       priority: 0.8, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.domain
  const now = new Date()

  const entries: MetadataRoute.Sitemap = []

  for (const { path, priority, changeFrequency } of PAGES) {
    for (const locale of LOCALES) {
      const url = locale === 'ko'
        ? `${base}${path || '/'}`
        : `${base}/${locale}${path || ''}`
      entries.push({ url, lastModified: now, priority, changeFrequency })
    }
  }

  return entries
}
