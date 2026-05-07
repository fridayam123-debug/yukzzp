import { BRAND, COPY_KO } from '@/lib/constants/brand'

export function GroupCTA() {
  return (
    <section id="group" className="bg-[var(--color-forest)] text-white py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] md:aspect-video rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-stone)]" aria-label="단체 회식 공간" />
        <div className="flex flex-col gap-6">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">{COPY_KO.groupEyebrow}</div>
          <h2 className="text-[28px] md:text-[36px] font-normal leading-[1.15]">{COPY_KO.groupH2}</h2>
          <p className="text-[15px] opacity-85 leading-[1.55]">{COPY_KO.groupSub}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">프라이빗 룸 · 4~16인</span>
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">단체석 · 20~40인</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {/* Primary: Hanji solid + Brass border (양재 본점) */}
            <a
              href="tel:0507-1335-6363"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-canvas)] text-[var(--color-ink)] border-2 border-[var(--color-cream-gold)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:bg-[var(--color-canvas-soft)] transition-colors"
            >
              ☎ {COPY_KO.groupCtaCall} (양재)
            </a>
            {/* Secondary: Outline (transparent on espresso bg) + Brass border (을지로) */}
            <a
              href="tel:0507-1461-7228"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--color-canvas)] border-2 border-[var(--color-cream-gold)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:bg-[var(--color-cream-gold)]/10 transition-colors"
            >
              ☎ {COPY_KO.groupCtaCall} (을지로)
            </a>
            {/* Accent: Brass solid (카카오) */}
            {BRAND.kakaoChannelUrl && (
              <a
                href={BRAND.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-cream-gold)] text-[var(--color-ink)] px-6 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px] hover:opacity-90 transition-opacity"
              >
                {COPY_KO.groupCtaKakao}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
