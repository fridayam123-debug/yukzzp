import Link from 'next/link'
import { COPY_KO } from '@/lib/constants/brand'

export function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[720px] overflow-hidden bg-[var(--color-stone)] flex items-end">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-24 pb-16 md:pb-24 flex flex-col gap-4">
        <div className="text-[11px] tracking-[2px] font-mono text-white/80">{COPY_KO.heroEyebrow}</div>
        <h1 className="text-[40px] md:text-[64px] font-normal text-white leading-[1.1] max-w-[760px]">{COPY_KO.heroH1}</h1>
        <p className="text-[16px] md:text-[18px] text-white/90 leading-relaxed max-w-[560px]">{COPY_KO.heroSub}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link href="/#reserve" className="inline-flex items-center justify-center bg-[var(--color-forest)] text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {COPY_KO.heroCtaPrimary}
          </Link>
          <Link href="/menu" className="inline-flex items-center justify-center border border-white text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {COPY_KO.heroCtaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
