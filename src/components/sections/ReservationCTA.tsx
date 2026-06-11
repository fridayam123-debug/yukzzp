import { COPY_KO } from '@/lib/constants/brand'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export async function ReservationCTA({ locations }: { locations: Loc[] }) {
  const locale = await getLocale() as Locale
  const copy = await getSiteCopy(locale)

  const eyebrow = copy['reservation.eyebrow'] || COPY_KO.reservationEyebrow
  const h2 = copy['reservation.h2'] || COPY_KO.reservationH2
  const sub = copy['reservation.sub'] || COPY_KO.reservationSub

  return (
    <section id="reserve" className="bg-[var(--color-canvas-soft)] py-12 md:py-32 px-6 md:px-24">
      <div className="max-w-[1024px] mx-auto text-center flex flex-col gap-4 md:gap-7 items-center">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{eyebrow}</div>
        <h2 className="text-[28px] md:text-[56px] font-normal text-[var(--color-ink)] tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: "'Cafe24Classictype', serif", wordBreak: 'keep-all' }}>{h2}</h2>
        {/* sub — 모바일 숨김 */}
        <p className="hidden md:block text-[15px] text-[var(--color-body)]">{sub}</p>
        {/* 모바일: 2×2 그리드 / 데스크톱: 가로 나열 */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 mt-2 w-full md:justify-center md:flex-wrap">
          {locations.flatMap(loc => [
            loc.naver_place_id ? (
              <a
                key={`naver-${loc.slug}`}
                href={`https://map.naver.com/v5/entry/place/${loc.naver_place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                data-event="reservation_click"
                data-location={loc.slug}
                className="inline-flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-canvas)] px-4 md:px-7 py-4 rounded-[var(--radius-cta)] text-[13px] md:text-[14px] font-medium text-center leading-snug"
              >
                네이버{'\n'}예약 ({loc.slug === 'yangjae' ? '양재' : '을지로'})
              </a>
            ) : null,
            loc.catchtable_url ? (
              <a
                key={`catchtable-${loc.slug}`}
                href={loc.catchtable_url}
                target="_blank"
                rel="noopener noreferrer"
                data-event="reservation_click"
                data-location={loc.slug}
                className="inline-flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-canvas)] px-4 md:px-7 py-4 rounded-[var(--radius-cta)] text-[13px] md:text-[14px] font-medium text-center leading-snug"
              >
                캐치테이블{'\n'}({loc.slug === 'yangjae' ? '양재' : '을지로'})
              </a>
            ) : null,
          ].filter(Boolean))}
        </div>
      </div>
    </section>
  )
}
