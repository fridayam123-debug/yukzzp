import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function LocationCard({ loc, kicker, subway, naverPlaceId }: { loc: Loc; kicker: string; points?: string; subway?: string; naverPlaceId?: string }) {
  return (
    <div className="flex flex-col gap-4 p-5 md:p-10 bg-white rounded-[var(--radius-card)]">
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
            style={{ filter: 'brightness(1.03) contrast(0.92) sepia(0.10) saturate(0.88)' }}
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
      <div className="flex flex-col gap-1.5">
        <div className="text-[9px] tracking-[2px] font-mono text-[var(--color-body)]">{kicker}</div>
        <h3 className="text-[18px] md:text-[22px] font-medium text-[var(--color-ink)]">{loc.name_ko}</h3>
        <p className="text-[12px] text-[var(--color-body)]">{loc.address_road}</p>
        <p className="text-[12px] text-[var(--color-body)] font-mono">☎ {loc.virtual_phone}</p>
        {subway && <p className="text-[11px] text-[var(--color-body)] font-mono tracking-[0.05em]">地 {subway}</p>}
        {/* 길찾기 버튼 */}
        <div className="flex gap-2 mt-2">
          <a
            href={`https://map.naver.com/p/entry/place/${naverPlaceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--color-hairline)] text-[11px] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[#03C75A]"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            네이버 길찾기
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name_ko ?? loc.address_road ?? '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--color-hairline)] text-[11px] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[#4285F4]"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            구글 길찾기
          </a>
        </div>
        <Link href={`/locations/${loc.slug}`} className="text-[12px] font-medium text-[var(--color-forest-mid)] mt-1">
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}
