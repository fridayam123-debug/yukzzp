import Image from 'next/image'
import { COPY_KO } from '@/lib/constants/brand'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'

export async function BrandStory() {
  const locale = await getLocale() as Locale
  const copy = await getSiteCopy(locale)
  const t = await getTranslations('brandStory')

  const eyebrow = copy['brand-story.eyebrow'] || COPY_KO.brandStoryEyebrow
  const h2 = copy['brand-story.h2'] || COPY_KO.brandStoryH2
  const p1 = copy['brand-story.p1'] || COPY_KO.brandStoryP1
  const p2 = copy['brand-story.p2'] || COPY_KO.brandStoryP2

  return (
    <section className="bg-[var(--color-forest)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[400px] md:min-h-[560px]">
        <div className="flex flex-col justify-center px-6 py-10 md:px-16 md:py-24 md:w-1/2">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-[24px] md:text-[40px] font-normal text-[var(--color-canvas)] max-w-[480px] whitespace-pre-line" style={{ fontFamily: "'Cafe24Classictype', serif", wordBreak: 'keep-all' }}>
            {h2}
          </h2>
          {/* 모바일 전용 요약 — 5줄 */}
          <p className="md:hidden mt-4 text-[13px] leading-[1.8] text-[var(--color-canvas)]/75 whitespace-pre-line [word-break:keep-all]">{t('mobileSub')}</p>
          {/* 본문 — 모바일 숨김 */}
          <p className="hidden md:block mt-6 text-[17.6px] leading-relaxed text-[var(--color-canvas)]/75 whitespace-pre-line [word-break:keep-all]">
            {p1}
          </p>
          <p className="hidden md:block mt-4 text-[17.6px] leading-relaxed text-[var(--color-canvas)]/75 whitespace-pre-line [word-break:keep-all]">
            {p2.split('\n').map((line, i) => {
              const dashIdx = line.indexOf(' — ')
              const hasMidDash = dashIdx !== -1 && dashIdx < line.length - 3
              return (
                <span key={i}>
                  {i > 0 && '\n'}
                  {hasMidDash ? (
                    <>{line.slice(0, dashIdx)}{'— '}{line.slice(dashIdx + 3)}</>
                  ) : line}
                </span>
              )
            })}
          </p>
        </div>
        <div className="relative order-first md:order-last md:w-1/2 aspect-[4/3] md:aspect-auto">
          <Image
            src="/photos/brand/brand-story.jpg"
            alt="육즙관리소 을지로동대문점 입구 카운터 — 프리미엄 흑돼지 다이닝"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  )
}
