import Link from 'next/link'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'
import { COPY_KO } from '@/lib/constants/brand'

const PILLARS = [
  { icon: '🏔', title: '산지 직거래',      description: '가장 좋은 식재료를 고집합니다. 야생쑥을 먹고 자란 산청 흑돼지·거창 백돼지 — 불포화지방산이 풍부하고 쫄깃한 육질의 비결.' },
  { icon: '⚛',  title: '특허 파동숙성',   description: '파동 에너지로 근섬유를 이완시켜 효소 숙성을 극대화. 육즙 손실 없이 고기 전체가 고르게 부드러워지고, 잡내 없이 깊고 진한 풍미를 끌어냅니다.' },
  { icon: '💨', title: '하향식 덕트',      description: '연기·냄새를 식탁 아래로 즉시 흡입. 옷에 냄새가 배지 않고 눈이 맵지 않아, 데이트·회식·청첩장 자리에서도 깔끔하게 즐길 수 있습니다.' },
  { icon: '🫙', title: '수제 반찬 무한리필', description: '유자청 겉절이 · 계절 장아찌 직접 담금 · 고급 수향미 밥' },
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
