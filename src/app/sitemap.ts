import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.domain
  const now = new Date()
  return [
    { url: base,                              lastModified: now, priority: 1,   changeFrequency: 'weekly'  },
    { url: `${base}/menu`,                    lastModified: now, priority: 0.9, changeFrequency: 'weekly'  },
    { url: `${base}/locations/yangjae`,       lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/locations/euljiro`,       lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
  ]
}
