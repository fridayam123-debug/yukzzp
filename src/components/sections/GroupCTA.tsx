import { BRAND, COPY_KO, GROUP_CATEGORIES } from '@/lib/constants/brand'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'
import { GroupPhotoSlider } from '@/components/ui/GroupPhotoSlider'

export async function GroupCTA() {
  const locale = await getLocale() as Locale
  const copy = await getSiteCopy(locale)

  const eyebrow = copy['group.eyebrow'] || COPY_KO.groupEyebrow
  const h2 = copy['group.h2'] || COPY_KO.groupH2
  const subheading = copy['group.subheading'] || COPY_KO.groupSubheading
  const body = [
    copy['group.body1'] || COPY_KO.groupBody[0],
    copy['group.body2'] || COPY_KO.groupBody[1],
  ]
  const capacity1 = copy['group.capacity1'] || '프라이빗 룸 · 4~16인'
  const capacity2 = copy['group.capacity2'] || '단체석 · 20~40인'
  const ctaCall = copy['group.cta.call'] || COPY_KO.groupCtaCall
  const ctaKakao = copy['group.cta.kakao'] || COPY_KO.groupCtaKakao

  // Group categories — read from site_copy with GROUP_CATEGORIES fallback
  const categories = [1, 2, 3, 4].map((n, i) => ({
    h3: copy[`group.category${n}.h3`] || GROUP_CATEGORIES[i].h3,
    body: copy[`group.category${n}.body`] || GROUP_CATEGORIES[i].body,
  }))

  // Use cases — comma-separated string from site_copy, fallback to COPY_KO
  const useCasesRaw = copy['group.usecases']
  const useCases: string[] = useCasesRaw
    ? useCasesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : COPY_KO.groupUseCases.slice()

  return (
    <section
      id="group"
      aria-labelledby="group-dining-heading"
      className="bg-[var(--color-forest)] text-[var(--color-canvas)] py-12 md:py-24 px-6 md:px-24"
    >
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* 좌측 슬라이더 */}
        <GroupPhotoSlider />

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col gap-4 md:gap-6">

          {/* 섹션 라벨 */}
          <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">
            {eyebrow}
          </div>

          {/* H2 — 핵심 키워드 + 지역 */}
          <h2
            id="group-dining-heading"
            className="text-[22px] md:text-[44px] font-normal leading-[1.2] md:leading-[1.05] tracking-[-0.01em]"
            style={{ fontFamily: "'Cafe24Classictype', serif", wordBreak: 'keep-all' }}
          >
            {h2}
          </h2>

          {/* 키워드 라인 — 모바일 숨김 */}
          <p className="hidden md:block text-[18px] text-[var(--color-cream-gold)] opacity-95 leading-[1.6] tracking-[0.02em] [word-break:keep-all]">
            {subheading}
          </p>

          {/* 리드 문단 — 모바일: 첫 문단만 / 데스크톱: 전체 */}
          <div className="space-y-3 text-[13px] md:text-[15px] opacity-85 leading-[1.8] tracking-[0.01em] [word-break:keep-all]">
            <p>{body[0]}</p>
            <p className="hidden md:block">{body[1]}</p>
          </div>

          {/* H3 목적별 카테고리 아티클 — 모바일 숨김 */}
          <div className="hidden md:block space-y-4 border-t border-[var(--color-cream-gold)]/15 pt-5 mt-1">
            {categories.map((cat, i) => (
              <article key={i}>
                <h3 className="text-[12px] tracking-[0.08em] text-[var(--color-cream-gold)] opacity-90 mb-1 [word-break:keep-all]">
                  {cat.h3}
                </h3>
                <p className="text-[13px] opacity-70 leading-[1.75] [word-break:keep-all]">
                  {cat.body}
                </p>
              </article>
            ))}
          </div>

          {/* 규모 배지 */}
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">{capacity1}</span>
            <span className="px-4 py-1.5 bg-[var(--color-forest-mid)] rounded-full text-[12px]">{capacity2}</span>
          </div>

          {/* 용도 태그 — 모바일 숨김 */}
          <ul
            aria-label="단체 모임 종류"
            className="hidden md:flex flex-wrap gap-1.5"
          >
            {useCases.map(uc => (
              <li
                key={uc}
                className="px-3 py-1 border border-[var(--color-cream-gold)]/30 rounded-full text-[11px] text-[var(--color-cream-gold)]/90 tracking-[0.02em] list-none"
              >
                {uc}
              </li>
            ))}
          </ul>

          {/* CTA 버튼 */}
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
