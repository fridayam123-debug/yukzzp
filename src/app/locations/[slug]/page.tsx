import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RestaurantJsonLd } from '@/components/schema/RestaurantJsonLd'
import { getLocations, getLocationBySlug } from '@/lib/fetchers/locations'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return [{ slug: 'yangjae' }, { slug: 'euljiro' }]
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocationBySlug(slug)
  if (!loc) return { title: '지점을 찾을 수 없습니다' }
  return {
    title: loc.name_ko,
    description: loc.meta_description_ko ?? undefined,
  }
}

export default async function LocationPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [loc, locations] = await Promise.all([
    getLocationBySlug(slug),
    getLocations(),
  ])
  if (!loc) notFound()

  const hours = loc.hours as Record<string, { open?: string; close?: string; last_order?: string; break?: string[]; close_next_day?: string; break_weekday?: string[] }> | null
  const rooms = loc.rooms as { min?: number; max?: number } | null
  const groupSeats = loc.group_seats as { min?: number; max?: number } | null
  const naverUrl = loc.naver_place_id
    ? `https://map.naver.com/v5/entry/place/${loc.naver_place_id}`
    : null

  return (
    <>
      <RestaurantJsonLd location={loc} />
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 md:px-24 py-12">
        {/* Eyebrow + title */}
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">
          {slug.toUpperCase()}
        </div>
        <h1 className="text-[40px] md:text-[56px] font-normal mt-2 text-[var(--color-ink)] leading-[1.1]">
          {loc.name_ko}
        </h1>
        <p className="text-[15px] text-[var(--color-body)] mt-3">{loc.address_road}</p>

        {/* Hero image placeholder — no hero_image in DB yet */}
        <div
          className="aspect-video rounded-[var(--radius-card)] overflow-hidden mt-8 bg-[var(--color-stone)]"
          aria-label={`${loc.name_ko} 매장 사진`}
        />

        {/* Reservation CTA — Naver + Catchtable */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {naverUrl && (
            <a
              href={naverUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-event="reservation_click"
              data-location={loc.slug}
              className="inline-flex items-center justify-center gap-2 bg-[#03C75A] text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium"
            >
              네이버 예약
            </a>
          )}
          {loc.catchtable_url && (
            <a
              href={loc.catchtable_url}
              target="_blank"
              rel="noopener noreferrer"
              data-event="reservation_click"
              data-location={loc.slug}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-forest)] text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium"
            >
              캐치테이블 예약
            </a>
          )}
          <a
            href={`tel:${loc.virtual_phone}`}
            className="inline-flex items-center justify-center gap-2 border border-[var(--color-forest)] text-[var(--color-forest)] px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium"
          >
            ☎ {loc.virtual_phone}
          </a>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-12 mt-14">
          {/* Left: hours + address */}
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-[20px] font-medium text-[var(--color-ink)] mb-3">영업 시간</h2>
              {hours && Object.entries(hours).map(([period, info]) => (
                <div key={period} className="text-[14px] text-[var(--color-body)] mb-1">
                  <span className="font-medium text-[var(--color-ink)]">
                    {period === 'weekday' ? '평일' : period === 'weekend' ? '주말' : '매일'}:
                  </span>{' '}
                  {info.open} — {info.close ?? info.close_next_day}
                  {info.last_order && ` (라스트오더 ${info.last_order})`}
                  {(info.break ?? info.break_weekday) && ` · 브레이크 ${(info.break ?? info.break_weekday)?.join('–')}`}
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-[20px] font-medium text-[var(--color-ink)] mb-3">위치</h2>
              <p className="text-[14px] text-[var(--color-body)]">{loc.address_road}</p>
              {naverUrl && (
                <a
                  href={naverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[13px] text-[var(--color-forest-mid)] underline underline-offset-2"
                >
                  네이버 지도에서 보기 →
                </a>
              )}
            </section>
          </div>

          {/* Right: space + amenities */}
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-[20px] font-medium text-[var(--color-ink)] mb-3">공간</h2>
              {rooms && (
                <p className="text-[14px] text-[var(--color-body)]">
                  룸: {rooms.min}—{rooms.max}인
                </p>
              )}
              {groupSeats && (
                <p className="text-[14px] text-[var(--color-body)]">
                  단체석: {groupSeats.min}—{groupSeats.max}인
                </p>
              )}
            </section>

            {loc.amenities && loc.amenities.length > 0 && (
              <section>
                <h2 className="text-[20px] font-medium text-[var(--color-ink)] mb-3">편의시설</h2>
                <ul className="flex flex-wrap gap-2">
                  {loc.amenities.map(a => (
                    <li
                      key={a}
                      className="px-3 py-1 bg-white border border-[var(--color-hairline)] rounded-full text-[13px] text-[var(--color-body)]"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {loc.parking && (
              <section>
                <h2 className="text-[20px] font-medium text-[var(--color-ink)] mb-2">주차</h2>
                <p className="text-[13px] text-[var(--color-body)]">
                  {(loc.parking as { info?: string })?.info}
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer locations={locations} />
    </>
  )
}
