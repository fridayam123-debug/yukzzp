import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'
import { routing } from '@/i18n/routing'

const LOCALES = routing.locales

/**
 * 사이트맵 lastmod 기준일.
 * 빌드 시각(new Date())을 쓰면 무관한 배포마다 110개 URL이 전부 "변경됨"으로
 * 찍혀서 구글이 lastmod를 신뢰하지 않게 된다. 콘텐츠를 실제로 고쳤을 때만 갱신할 것.
 */
const LAST_MODIFIED = '2026-07-27'

const PAGES = [
  { path: '',                      priority: 1,   changeFrequency: 'weekly'  as const },
  { path: '/menu',                 priority: 0.9, changeFrequency: 'weekly'  as const },
  { path: '/locations/yangjae',    priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/locations/euljiro',    priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/faq',                  priority: 0.9, changeFrequency: 'weekly'  as const },
  { path: '/notice',               priority: 0.7, changeFrequency: 'weekly'  as const },
  // SEO landing pages — 양재역
  { path: '/yangjae-matjip',          priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-gogitjip',        priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-hoesik',          priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-moksal',          priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/yangjae-samgyeopsal',     priority: 0.8, changeFrequency: 'monthly' as const },
  // SEO landing pages — 을지로
  { path: '/euljiro-matjip',          priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/euljiro-gogitjip',        priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/euljiro-hoesik',          priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/euljiro-samgyeopsal',     priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/euljiro-moksal',          priority: 0.8, changeFrequency: 'monthly' as const },
  // SEO landing pages — 동대문/DDP
  { path: '/dongdaemun-matjip',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/dongdaemun-gogitjip',     priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/dongdaemun-hoesik',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/dongdaemun-samgyeopsal',  priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/dongdaemun-moksal',       priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/ddp-matjip',              priority: 0.8, changeFrequency: 'monthly' as const },
]

/** 한국어(기본 로케일)는 프리픽스 없음, 나머지는 /en, /ja, /vi, /zh */
function localizedUrl(base: string, locale: string, path: string) {
  return locale === routing.defaultLocale
    ? `${base}${path || '/'}`
    : `${base}/${locale}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.domain
  const entries: MetadataRoute.Sitemap = []

  for (const { path, priority, changeFrequency } of PAGES) {
    // 같은 페이지의 5개 언어판을 서로 hreflang 대체본으로 선언 —
    // 랜딩 페이지들은 페이지 metadata에 alternates가 없으므로 사이트맵이 그 역할을 한다.
    const languages: Record<string, string> = {
      'x-default': localizedUrl(base, routing.defaultLocale, path),
    }
    for (const locale of LOCALES) {
      languages[locale] = localizedUrl(base, locale, path)
    }

    for (const locale of LOCALES) {
      entries.push({
        url: localizedUrl(base, locale, path),
        lastModified: LAST_MODIFIED,
        priority,
        changeFrequency,
        alternates: { languages },
      })
    }
  }

  return entries
}
