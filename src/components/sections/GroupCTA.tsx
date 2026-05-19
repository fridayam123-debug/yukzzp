import { BRAND, COPY_KO } from '@/lib/constants/brand'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'

export async function GroupCTA() {
  const locale = await getLocale() as Locale
  const copy = await getSiteCopy(locale)

  const eyebrow = copy['group.eyebrow'] || COPY_KO.groupEyebrow
  const h2 = copy['group.h2'] || COPY_KO.groupH2
  const subheading = copy['group.subheading'] || COPY_KO.groupSubheading
  const body = [
    copy['group.body1'] || COPY_KO.groupBody[0],
    copy['group.body2'] || COPY_KO.groupBody[1],
    copy['group.body3'] || COPY_KO.groupBody[2],
  ]
  const capacity1 = copy['group.capacity1'] || '프라이빗 룸 · 4~16인'
  const capacity2 = copy['group.capacity2'] || '단체석 · 20~40인'
  const ctaCall = copy['group.cta.call'] || COPY_KO.groupCtaCall
  const ctaKakao = copy['group.cta.kakao'] || COPY_KO.groupCtaKakao

  return (
    <section id="group" className="bg-[var(--color-forest)] text-[var(--color-canvas)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-[4/3] md:aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-stone)] md:sticky md:top-24" aria-label="단체 회식 공간" />
        <div className="flex flex-col gap-6">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">
            {eyebrow}
          </div>
          <h2
            className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]"
            style={{ fontFamily: "'Cafe24Classictype', serif" }}
          >
            {h2}
          </h2>
          <p className="text-[15px] md:text-[18px] text-[var(--color-cream-gold)] opacity-95 leading-[1.5] tracking-[0.02em]">
            {subheading}
          </p>
          <div className="space-y-4 text-[14px] md:text-[15px] opacity-85 leading-[1.75] tracking-[0.01em] mt-2">
            {body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">{capacity1}</span>
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">{capacity2}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {COPY_KO.groupUseCases.map(uc => (
              <span
                key={uc}
                className="px-3 py-1 border border-[var(--color-cream-gold)]/30 rounded-full text-[11px] text-[var(--color-cream-gold)]/90 tracking-[0.02em]"
              >
                {uc}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <a
              href="tel:0507-1335-6363"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--color-canvas)] border-2 border-[var(--color-cream-gold)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:bg-[var(--color-cream-gold)]/10 transition-colors"
            >
              ☎ {ctaCall} (양재)
            </a>
            <a
              href="tel:0507-1461-7228"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--color-canvas)] border-2 border-[var(--color-cream-gold)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:bg-[var(--color-cream-gold)]/10 transition-colors"
            >
              ☎ {ctaCall} (을지로)
            </a>
            {BRAND.kakaoChannelUrl && (
              <a
                href={BRAND.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-cream-gold)] text-[var(--color-ink)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:opacity-90 transition-opacity"
              >
                {ctaKakao}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
