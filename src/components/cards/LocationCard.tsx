import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function LocationCard({ loc, kicker, points }: { loc: Loc; kicker: string; points: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 md:p-10 bg-white rounded-[var(--radius-card)]">
      <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-stone)]" aria-label={`${loc.name_ko} 매장 사진`} />
      <div className="flex flex-col gap-2">
        <div className="text-[10px] tracking-[2px] font-mono text-[var(--color-body)]">{kicker}</div>
        <h3 className="text-[22px] font-medium text-[var(--color-ink)]">{loc.name_ko}</h3>
        <p className="text-[13px] text-[var(--color-body)]">{loc.address_road}</p>
        <p className="text-[13px] text-[var(--color-body)] font-mono">☎ {loc.virtual_phone}</p>
        <p className="text-[13px] text-[var(--color-ink)] leading-[1.5] mt-1">{points}</p>
        <Link href={`/locations/${loc.slug}`} className="text-[14px] font-medium text-[var(--color-forest-mid)] mt-2">
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}
