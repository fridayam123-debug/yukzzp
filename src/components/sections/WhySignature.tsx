import { Link } from '@/i18n/navigation'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'
import { COPY_KO } from '@/lib/constants/brand'

// 4 약속 (스펙 2026-05-09: 그릴링 + 덕트 통합 → 火 / GEO copy 2026-05-19)
const PILLARS = [
  {
    icon: '材',
    title: '가장 좋은 식재료',
    description: '육즙관리소는 전국 각지에서 엄선한 최상급 식재료만을 사용합니다. 야생쑥을 사료화해 건강하게 키운 산청 흑돼지와 거창 백돼지는 깊은 풍미와 깔끔한 육향을 자랑합니다. 여기에 뛰어난 향과 찰기를 가진 프리미엄 수향미까지 더해져 식사의 완성도를 높입니다. 육즙관리소는 고기뿐만 아니라 쌀과 곁들임 하나까지 가장 좋은 재료를 기준으로 선택합니다.',
  },
  {
    icon: '熟',
    title: '특허 파동숙성',
    description: '육즙관리소의 특허 파동숙성은 고기의 육질을 더욱 부드럽고 촉촉하게 완성하는 숙성 기술입니다. 숙성 과정에서 육즙 보존력과 풍미를 높여 깊은 감칠맛과 깔끔한 고기 본연의 맛을 끌어냅니다. 좋은 원육에 파동숙성을 더해 더욱 균형감 있고 풍미 깊은 고기를 제공합니다. 가장 맛있는 순간의 고기를 위해 숙성의 시간까지 세심하게 관리합니다.',
  },
  {
    icon: '火',
    title: '전문 그릴링 + 대나무 숯',
    description: '육즙관리소는 전문 서버가 직접 고기를 구워 가장 완벽한 굽기의 순간을 제공합니다. 100% 대나무숯은 강한 화력과 깔끔한 숯향으로 고기의 깊은 풍미를 더욱 끌어올립니다. 여기에 하향식 덕트 시스템을 더해 연기와 냄새를 최소화하여 더욱 쾌적한 다이닝 환경을 완성했습니다. 맛과 서비스, 공간의 편안함까지 함께 경험할 수 있는 프리미엄 K-BBQ 다이닝을 제공합니다.',
  },
  {
    icon: '饌',
    title: '직접 담근 정성찬',
    description: '육즙관리소는 매장에서 직접 만드는 반찬과 7가지 시그니처 소스로 완성도 높은 다이닝 경험을 제공합니다. 다시마소금부터 표고와사비, 청어알과 가리비 조합까지 각 소스는 고기의 풍미를 더욱 깊게 끌어올리도록 개발되었습니다. 계절에 따라 달라지는 정성찬은 식사의 균형과 완성도를 높여줍니다. 고기뿐만 아니라 곁들임 하나까지 세심하게 준비하는 것이 육즙관리소의 기준입니다.',
  },
]

export async function WhySignature() {
  const items = await getSignatureItems()
  return (
    <section className="bg-[var(--color-canvas-soft)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{COPY_KO.whyEyebrow}</div>
        <h2 className="text-[40px] md:text-[48px] font-normal text-[var(--color-ink)] mt-4 tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{COPY_KO.whyH2}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
          {PILLARS.map((p, i) => (
            <PillarCard
              key={p.title}
              ordinal={['첫번째', '두번째', '세번째', '네번째'][i]}
              {...p}
            />
          ))}
        </div>
        <div className="mt-24">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h3 className="text-[32px] md:text-[44px] font-normal text-[var(--color-ink)] tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{COPY_KO.signatureH2}</h3>
            <Link href="/menu" className="text-[14px] underline underline-offset-[6px] decoration-[1px] hover:decoration-[var(--color-cream-gold)] text-[var(--color-ink)]">{COPY_KO.signatureMore}</Link>
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
