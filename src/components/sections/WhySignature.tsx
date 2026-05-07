import Link from 'next/link'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'
import { COPY_KO } from '@/lib/constants/brand'

const PILLARS = [
  { icon: '🏔', title: '산지 직지정',    description: '지리산 청정 자연 산청 흑돼지 · 거창 백돼지' },
  { icon: '⚛',  title: '특허 파동숙성',  description: '부드러운 식감과 풍부한 육즙' },
  { icon: '🔥', title: '100% 대나무 숯', description: '잡내 없이 깊은 불향' },
  { icon: '👨‍🍳', title: '숙련된 그릴링',  description: '직원이 직접 굽는 무료 서비스' },
]

export async function WhySignature() {
  const items = await getSignatureItems()
  return (
    <section className="bg-[var(--color-canvas-soft)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{COPY_KO.whyEyebrow}</div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3">{COPY_KO.whyH2}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {PILLARS.map(p => <PillarCard key={p.title} {...p} />)}
        </div>
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h3 className="text-[28px] md:text-[36px] font-normal text-[var(--color-ink)]">{COPY_KO.signatureH2}</h3>
            <Link href="/menu" className="text-[14px] font-medium text-[var(--color-forest-mid)]">{COPY_KO.signatureMore}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.slice(0, 3).map(item => (
              <MenuItemCard
                key={item.id}
                name={item.name_ko}
                description={item.description_ko}
                priceKrw={item.price_krw}
                isSignature={item.is_signature ?? false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
