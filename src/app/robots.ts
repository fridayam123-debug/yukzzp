import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'

/** 검색결과에 노출될 이유가 없는 경로 — 크롤 예산 낭비 방지 */
const PRIVATE_PATHS = ['/admin', '/login', '/api/']

const SEARCH_BOTS = [
  'Yeti',           // 네이버
  'GPTBot',         // ChatGPT
  'OAI-SearchBot',
  'ClaudeBot',
  'PerplexityBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_PATHS,
      })),
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: `${BRAND.domain}/sitemap.xml`,
    host: BRAND.domain,
  }
}
