import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Hero() {
  const t = useTranslations('hero')
  return (
    <section className="relative h-screen overflow-hidden bg-[var(--color-stone)] flex items-end">
      {/* Photographic background — 을지로점 파동벽 (#37) */}
      <Image
        src="/photos/locations/euljiro/wave-wall.jpg"
        alt="육즙관리소 더룸 을지로동대문점 — 파동숙성 웨이브 아트월"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay for text legibility (50% — 10% darker than before) */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-24 pb-20 md:pb-32 flex flex-col gap-6">
        <div className="text-[11px] tracking-[0.3em] uppercase text-white/80">{t('eyebrow')}</div>
        <h1 className="text-[36px] md:text-[60px] font-normal text-white leading-[1.05] tracking-[-0.01em] max-w-[900px] whitespace-pre-line" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{t('h1')}</h1>
        <p className="text-[14.5px] md:text-[15.5px] text-white/80 leading-[1.9] max-w-[860px] mt-4 whitespace-pre-line tracking-[0.01em]">{t('sub')}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link href="/#reserve" className="inline-flex items-center justify-center bg-[var(--color-forest)] text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {t('ctaPrimary')}
          </Link>
          <Link href="/menu" className="inline-flex items-center justify-center border border-white text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
