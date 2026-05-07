import { LocationCard } from '@/components/cards/LocationCard'
import { COPY_KO } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

const HIGHLIGHT: Record<string, { kicker: string; points: string }> = {
  yangjae: { kicker: 'YANGJAE · 양재역', points: '콜키지 · 점심특선 · 가족 · 기념일에 어울려요' },
  euljiro: { kicker: 'EULJI-RO · 을지로동대문', points: 'DDP 인근 · 별관 · 매일 새벽 5시까지 운영' },
}

export function TwoLocations({ locations }: { locations: Loc[] }) {
  return (
    <section id="locations" className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{COPY_KO.locationsEyebrow}</div>
        <h2 className="text-[32px] md:text-[40px] font-normal mt-3 text-[var(--color-ink)]">{COPY_KO.locationsH2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {locations.map(loc => {
            const h = HIGHLIGHT[loc.slug] ?? { kicker: loc.slug.toUpperCase(), points: '' }
            return <LocationCard key={loc.id} loc={loc} {...h} />
          })}
        </div>
      </div>
    </section>
  )
}
