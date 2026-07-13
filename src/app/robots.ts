import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Yeti', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${BRAND.domain}/sitemap.xml`,
  }
}
