import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function LocationCard({ loc, kicker, points, subway }: { loc: Loc; kicker: string; points: string; subway?: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 md:p-10 bg-white rounded-[var(--radius-card)]">
      <div
        className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-canvas-soft)]"
        aria-label={`${loc.name_ko} 매장 사진`}
      >
        {loc.hero_image ? (
          <Image
            src={loc.hero_image}
            alt={`${loc.name_ko} 매장`}
            fill
            className="object-cover"
            style={{ filter: loc.slug === 'yangjae'
              ? 'brightness(1.08) contrast(0.88) sepia(0.22) saturate(0.80) hue-rotate(-8deg)'
              : 'brightness(1.03) contrast(0.92) sepia(0.10) saturate(0.88)' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, var(--color-canvas) 0%, var(--color-canvas-soft) 55%, var(--color-hairline) 100%)',
            }}
          />
        )}
        <span className="absolute bottom-3 right-4 text-[10px] tracking-[2px] font-mono text-[var(--color-body)]/60 select-none">
          {loc.slug.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[10px] tracking-[2px] font-mono text-[var(--color-body)]">{kicker}</div>
        <h3 className="text-[22px] font-medium text-[var(--color-ink)]">{loc.name_ko}</h3>
        <p className="text-[13px] text-[var(--color-body)]">{loc.address_road}</p>
        <p className="text-[13px] text-[var(--color-body)] font-mono">☎ {loc.virtual_phone}</p>
        {subway && <p className="text-[12px] text-[var(--color-body)] font-mono tracking-[0.05em] mt-1">地 {subway}</p>}
        <p className="text-[13px] text-[var(--color-ink)] leading-[1.5] mt-1">{points}</p>
        <Link href={`/locations/${loc.slug}`} className="text-[14px] font-medium text-[var(--color-forest-mid)] mt-2">
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}
