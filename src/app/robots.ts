import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${BRAND.domain}/sitemap.xml`,
  }
}
