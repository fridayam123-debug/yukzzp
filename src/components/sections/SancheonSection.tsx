'use client'

import { useTranslations } from 'next-intl'

const VIDEO_ID = 'fRNvGwsI4S4'

export function SancheonSection() {
  const t = useTranslations('sancheon')

  return (
    <section className="bg-[var(--color-coral)] py-10 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">

        {/* 좌측: 텍스트 */}
        <div className="text-[var(--color-canvas)] order-1">
          <div className="text-[11px] tracking-[0.3em] uppercase opacity-80">{t('eyebrow')}</div>
          <h2
            className="text-[26px] md:text-[48px] font-normal mt-5 leading-[1.05] tracking-[-0.01em] [word-break:keep-all]"
            style={{ fontFamily: "'Cafe24Classictype', serif" }}
          >
            {t('h2')}
          </h2>
          {/* 본문 — 모바일 숨김 */}
          <div className="hidden md:block mt-6 space-y-4 text-[15px] leading-[1.75] tracking-[0.01em]">
            <p className="opacity-85">{t('body1')}</p>
            <p className="opacity-85">{t('body2')}</p>
            <p className="opacity-85">{t('body3')}</p>
            <p className="opacity-85">
              {t('body4pre')}
              <strong className="font-bold not-italic bg-white/10 px-1.5 py-0.5 rounded-sm">
                {t('body4badge')}
              </strong>
              {t('body4post')}
            </p>
            <p className="opacity-85">{t('body5')}</p>
          </div>
        </div>

        {/* 우측: 유튜브 영상 */}
        <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-black relative order-2">
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&controls=0`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="정육왕 블라인드 테스트"
          />
        </div>

      </div>
    </section>
  )
}
