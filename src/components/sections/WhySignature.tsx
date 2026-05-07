import Link from 'next/link'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'
import { COPY_KO } from '@/lib/constants/brand'

const PILLARS = [
  { icon: '材', title: '가장 좋은 식재료',  description: '육즙관리소는 전국 팔도의 최상급 식재료만을 고집합니다. 야생쑥을 사료화해 건강하게 키운 산청 흑돼지와 거창 백돼지는 깊은 풍미와 쫄깃한 육질을 자랑하며, 뛰어난 향과 찰기를 가진 프리미엄 수향미는 식사의 완성도를 더욱 높여줍니다. 좋은 재료가 맛의 기준을 만든다는 믿음으로, 육즙관리소는 원육부터 쌀, 곁들임 하나까지 가장 좋은 재료만을 선별합니다.' },
  { icon: '熟', title: '특허 파동숙성',   description: '파동숙성은 고기의 육질을 더욱 부드럽고 촉촉하게 만들어주는 숙성 방식입니다. 숙성 과정에서 육즙 보존력과 풍미를 높여 깊은 감칠맛과 깔끔한 고기 본연의 맛을 끌어냅니다. 육즙관리소는 좋은 원육에 파동숙성을 더해 더욱 부드럽고 풍미 깊은 고기를 제공합니다.' },
  { icon: '竹', title: '하향식 덕트',      description: '100% 대나무 숯으로 잡내 없는 깊은 불향을 내고, 하향식 덕트로 연기·냄새를 식탁 아래로 즉시 흡입. 옷에 냄새가 배지 않고 눈이 맵지 않아 데이트·회식·청첩장 자리에서도 깔끔하게 즐길 수 있습니다.' },
  { icon: '饌', title: '직접 담근 정성찬',  description: '매장에서 직접 만드는 반찬과 7가지 소스. 유자청 겉절이 · 계절 장아찌.' },
  { icon: '火', title: '전문 그릴링 서비스', description: '전문 서버가 최적의 불 조절로 직접 구워드립니다. 굽기 걱정 없이 대화와 식사에만 집중하실 수 있어 데이트·접대·기념일 자리에 특히 좋습니다.' },
]

export async function WhySignature() {
  const items = await getSignatureItems()
  return (
    <section className="bg-[var(--color-canvas-soft)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{COPY_KO.whyEyebrow}</div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3">{COPY_KO.whyH2}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
          {PILLARS.map((p, i) => (
            <PillarCard
              key={p.title}
              ordinal={['첫번째', '두번째', '세번째', '네번째', '다섯번째'][i]}
              {...p}
            />
          ))}
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
