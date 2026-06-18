import { getTranslations } from 'next-intl/server'
import { LazyYoutubeEmbed } from '@/components/ui/LazyYoutubeEmbed'

const VIDEO_ID = 'fRNvGwsI4S4'

export async function SancheonSection() {
  const t = await getTranslations('sancheon')

  return (
    <section className="bg-[var(--color-coral)] py-10 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">

        {/* 좌측: 텍스트 */}
        <div className="text-[var(--color-canvas)] order-1">
          <div className="text-[11px] tracking-[0.3em] uppercase opacity-80">{t('eyebrow')}</div>
          <h2
            className="text-[26px] md:text-[48px] font-normal mt-5 leading-[1.15] tracking-[-0.01em] whitespace-pre-line [word-break:keep-all]"
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

        {/* 우측: 유튜브 영상 — 뷰포트 진입 시 로드 */}
        <LazyYoutubeEmbed videoId={VIDEO_ID} title="정육왕 블라인드 테스트" />

      </div>
    </section>
  )
}
