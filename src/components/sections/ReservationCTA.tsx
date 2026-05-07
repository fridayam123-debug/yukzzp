import { COPY_KO } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function ReservationCTA({ locations }: { locations: Loc[] }) {
  return (
    <section id="reserve" className="bg-[var(--color-canvas-soft)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1024px] mx-auto text-center flex flex-col gap-7 items-center">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{COPY_KO.reservationEyebrow}</div>
        <h2 className="text-[44px] md:text-[56px] font-normal text-[var(--color-ink)] tracking-[-0.01em] leading-[1.05]">{COPY_KO.reservationH2}</h2>
        <p className="text-[15px] text-[var(--color-body)]">{COPY_KO.reservationSub}</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center flex-wrap">
          {locations.map(loc => (
            <div key={loc.slug} className="flex flex-col sm:flex-row gap-2">
              {loc.naver_place_id && (
                <a
                  href={`https://map.naver.com/v5/entry/place/${loc.naver_place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="reservation_click"
                  data-location={loc.slug}
                  className="inline-flex items-center justify-center bg-[#03C75A] text-white px-7 py-4 rounded-[var(--radius-cta)] text-[14px] font-medium whitespace-nowrap"
                >
                  네이버 예약 ({loc.slug === 'yangjae' ? '양재' : '을지로'})
                </a>
              )}
              {loc.catchtable_url && (
                <a
                  href={loc.catchtable_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="reservation_click"
                  data-location={loc.slug}
                  className="inline-flex items-center justify-center bg-[var(--color-forest)] text-white px-7 py-4 rounded-[var(--radius-cta)] text-[14px] font-medium whitespace-nowrap"
                >
                  캐치테이블 ({loc.slug === 'yangjae' ? '양재' : '을지로'})
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
