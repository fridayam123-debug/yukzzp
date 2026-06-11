import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteConfig } from '@/lib/fetchers/config'

const FALLBACK_HERO = '/photos/locations/euljiro/wave-wall.jpg'

export async function Hero() {
  const t = await getTranslations('hero')
  const config = await getSiteConfig()
  const bgSrc = config['hero_background_url'] || FALLBACK_HERO
  const subParagraphs = t('sub').split('\n\n')

  return (
    <section className="relative h-[85vh] md:h-screen overflow-hidden bg-[var(--color-stone)] flex md:items-end">
      {/* Photographic background */}
      <Image
        src={bgSrc}
        alt="육즙관리소 더룸 을지로동대문점 — 파동숙성 웨이브 아트월"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized={bgSrc.startsWith('http')}
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50" />
      {/* 모바일: 텍스트 상단 / 버튼 하단 — 데스크톱: 하단 정렬 */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-24
                      flex flex-col justify-between h-full pt-[22vh] pb-10
                      md:h-auto md:pt-0 md:pb-20 md:justify-start md:gap-4">
        {/* 텍스트 그룹 */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-canvas)]/70">{t('eyebrow')}</div>
          <h1 className="text-[22px] md:text-[52px] font-normal text-[var(--color-canvas)] leading-[1.15] md:leading-[1.08] tracking-[-0.01em] max-w-[800px] whitespace-pre-line [word-break:keep-all]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{t('h1')}</h1>
          {/* 서브텍스트 — 모바일 숨김 (SEO 유지) */}
          <div className="hidden md:flex flex-col gap-2 max-w-[560px] mt-1">
            {subParagraphs.map((para, i) => (
              <p key={i} className="text-[15px] text-[var(--color-canvas)]/85 leading-[1.75] tracking-[0.005em] [word-break:keep-all]">{para}</p>
            ))}
          </div>
        </div>
        {/* CTA 버튼 — 모바일: 하단 고정 */}
        <div className="flex flex-col sm:flex-row gap-3 md:mt-6">
          <Link href="/#reserve" className="inline-flex items-center justify-center bg-[var(--color-cream-gold)] text-[var(--color-ink)] px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium md:bg-[var(--color-forest)] md:text-[var(--color-canvas)]">
            {t('ctaPrimary')}
          </Link>
          <Link href="/menu" className="inline-flex items-center justify-center border border-[var(--color-canvas)] text-[var(--color-canvas)] px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
