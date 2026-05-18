import Link from 'next/link'
import { LocationCard } from '@/components/cards/LocationCard'
import { COPY_KO, BRAND } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

const HIGHLIGHT: Record<string, { kicker: string; points: string; subway: string }> = {
  yangjae: { kicker: 'YANGJAE · 양재역본점', points: '콜키지 · 점심특선 · 가족 · 기념일에 어울려요', subway: '양재역 3번출구 도보 5분' },
  euljiro: { kicker: 'EULJI-RO · 더룸 을지로동대문점', points: 'DDP 인근 · 별관 · 매일 새벽 5시까지 운영', subway: '동대문역사문화공원역 13번출구 도보 3분' },
}

export function TwoLocations({ locations }: { locations: Loc[] }) {
  return (
    <section id="locations" className="bg-[var(--color-canvas)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{COPY_KO.locationsEyebrow}</div>
        <h2 className="text-[40px] md:text-[48px] font-normal mt-4 text-[var(--color-ink)] tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{COPY_KO.locationsH2}</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href={`https://map.naver.com/p/entry/place/${BRAND.naverPlaceIds.yangjae}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-canvas-soft)] rounded-full px-4 py-1.5 text-[13px] text-[var(--color-ink)] hover:bg-[var(--color-hairline)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-forest-mid)] shrink-0" />
            육즙관리소 양재역본점
          </Link>
          <Link
            href={`https://map.naver.com/p/entry/place/${BRAND.naverPlaceIds.euljiro}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-canvas-soft)] rounded-full px-4 py-1.5 text-[13px] text-[var(--color-ink)] hover:bg-[var(--color-hairline)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-forest-mid)] shrink-0" />
            육즙관리소 더룸 을지로동대문점
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {[...locations].sort((a, b) => {
            const order = ['yangjae', 'euljiro']
            return order.indexOf(a.slug) - order.indexOf(b.slug)
          }).map(loc => {
            const h = HIGHLIGHT[loc.slug] ?? { kicker: loc.slug.toUpperCase(), points: '' }
            return <LocationCard key={loc.id} loc={loc} {...h} />
          })}
        </div>
      </div>
    </section>
  )
}
