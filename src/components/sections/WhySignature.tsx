import { Link } from '@/i18n/navigation'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { COPY_KO, SIGNATURE_ITEMS } from '@/lib/constants/brand'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'

const PILLAR_ICONS = ['材', '熟', '火', '饌'] as const

export async function WhySignature() {
  const locale = await getLocale() as Locale
  const copy = await getSiteCopy(locale)

  const pillars = [1, 2, 3, 4].map((n, i) => ({
    icon: PILLAR_ICONS[i],
    title: copy[`why.pillar${n}.title`] || COPY_KO.pillars[i].title,
    description: copy[`why.pillar${n}.desc`] || COPY_KO.pillars[i].description,
    ordinal: copy[`why.ordinal${n}`] || ['첫번째', '두번째', '세번째', '네번째'][i],
  }))

  const eyebrow = copy['why.eyebrow'] || COPY_KO.whyEyebrow
  const h2 = copy['why.h2'] || COPY_KO.whyH2
  const signatureH2 = copy['why.signatureH2'] || COPY_KO.signatureH2
  const signatureMore = copy['why.signatureMore'] || COPY_KO.signatureMore

  return (
    <section className="bg-[var(--color-canvas-soft)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{eyebrow}</div>
        <h2 className="text-[40px] md:text-[48px] font-normal text-[var(--color-ink)] mt-4 tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{h2}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
          {pillars.map((p) => (
            <PillarCard
              key={p.ordinal}
              ordinal={p.ordinal}
              icon={p.icon}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>
        <div className="mt-24">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h3 className="text-[32px] md:text-[44px] font-normal text-[var(--color-ink)] tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{signatureH2}</h3>
            <Link href="/menu" className="text-[14px] underline underline-offset-[6px] decoration-[1px] hover:decoration-[var(--color-cream-gold)] text-[var(--color-ink)]">{signatureMore}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {SIGNATURE_ITEMS.map(item => (
              <MenuItemCard
                key={item.key}
                name={item.name}
                description={item.description}
                priceKrw={item.priceKrw}
                priceLabel={'priceLabel' in item ? item.priceLabel : undefined}
                image={item.image}
                isSignature={item.isSignature}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
