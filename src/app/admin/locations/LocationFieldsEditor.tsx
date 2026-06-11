'use client'

import { useState, useTransition } from 'react'
import { updateLocationFields } from './actions'
import type { Location } from '@/lib/fetchers/locations'

interface Props {
  location: Location
}

interface HoursDay {
  open: string
  close: string
}
interface Hours {
  weekday?: HoursDay
  weekend?: HoursDay
  [key: string]: HoursDay | undefined
}
interface Geo {
  lat?: number | string
  lng?: number | string
}

function parseHours(raw: unknown): Hours {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw as Hours
}

function parseGeo(raw: unknown): Geo {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw as Geo
}

export function LocationFieldsEditor({ location }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialHours = parseHours(location.hours)
  const initialGeo = parseGeo(location.geo)

  const [nameKo, setNameKo] = useState(location.name_ko)
  const [nameEn, setNameEn] = useState(location.name_en)
  const [phone, setPhone] = useState(location.phone)
  const [addressRoad, setAddressRoad] = useState(location.address_road)
  const [postalCode, setPostalCode] = useState(location.postal_code ?? '')
  const [naverPlaceId, setNaverPlaceId] = useState(location.naver_place_id ?? '')
  const [catchtableUrl, setCatchtableUrl] = useState(location.catchtable_url ?? '')

  // Hours
  const [weekdayOpen, setWeekdayOpen] = useState(initialHours.weekday?.open ?? '')
  const [weekdayClose, setWeekdayClose] = useState(initialHours.weekday?.close ?? '')
  const [weekendOpen, setWeekendOpen] = useState(initialHours.weekend?.open ?? '')
  const [weekendClose, setWeekendClose] = useState(initialHours.weekend?.close ?? '')

  // Geo
  const [lat, setLat] = useState(String(initialGeo.lat ?? ''))
  const [lng, setLng] = useState(String(initialGeo.lng ?? ''))

  function handleSave() {
    setSaved(false)
    setError(null)

    const hours: Hours = {}
    if (weekdayOpen || weekdayClose) hours.weekday = { open: weekdayOpen, close: weekdayClose }
    if (weekendOpen || weekendClose) hours.weekend = { open: weekendOpen, close: weekendClose }

    const geo: Geo = {}
    if (lat) geo.lat = parseFloat(lat)
    if (lng) geo.lng = parseFloat(lng)

    const fd = new FormData()
    fd.append('slug', location.slug)
    fd.append('name_ko', nameKo)
    fd.append('name_en', nameEn)
    fd.append('phone', phone)
    fd.append('address_road', addressRoad)
    fd.append('postal_code', postalCode)
    fd.append('naver_place_id', naverPlaceId)
    fd.append('catchtable_url', catchtableUrl)
    fd.append('hours', JSON.stringify(hours))
    if (lat || lng) fd.append('geo', JSON.stringify(geo))

    startTransition(async () => {
      const result = await updateLocationFields(fd)
      if (result?.error) setError(result.error)
      else setSaved(true)
    })
  }

  const inputClass =
    'w-full px-3 py-2 text-[13px] text-[var(--color-ink)] bg-white border border-[var(--color-hairline)] rounded focus:outline-none focus:border-[var(--color-espresso)]'
  const labelClass = 'text-[11px] font-medium text-[var(--color-body)] tracking-[0.05em] uppercase'

  return (
    <div className="border border-[var(--color-hairline)] rounded-[12px] p-6 bg-white flex flex-col gap-5">
      <h3 className="text-[13px] font-semibold text-[var(--color-ink)] tracking-[0.05em] uppercase border-b border-[var(--color-hairline)] pb-3">
        지점 정보 편집
      </h3>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>이름 (한국어)</label>
          <input className={inputClass} value={nameKo} onChange={e => { setNameKo(e.target.value); setSaved(false) }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>이름 (English)</label>
          <input className={inputClass} value={nameEn} onChange={e => { setNameEn(e.target.value); setSaved(false) }} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>전화번호</label>
        <input className={inputClass} value={phone} onChange={e => { setPhone(e.target.value); setSaved(false) }} placeholder="0507-0000-0000" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>도로명 주소</label>
        <input className={inputClass} value={addressRoad} onChange={e => { setAddressRoad(e.target.value); setSaved(false) }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>우편번호</label>
          <input className={inputClass} value={postalCode} onChange={e => { setPostalCode(e.target.value); setSaved(false) }} placeholder="06234" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>네이버 플레이스 ID</label>
          <input className={inputClass} value={naverPlaceId} onChange={e => { setNaverPlaceId(e.target.value); setSaved(false) }} placeholder="1672141709" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>캐치테이블 URL</label>
        <input className={inputClass} value={catchtableUrl} onChange={e => { setCatchtableUrl(e.target.value); setSaved(false) }} placeholder="https://app.catchtable.co.kr/ct/shop/..." />
      </div>

      {/* 영업시간 */}
      <div className="flex flex-col gap-3">
        <p className={labelClass}>영업시간</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">평일 오픈</label>
            <input className={inputClass} value={weekdayOpen} onChange={e => { setWeekdayOpen(e.target.value); setSaved(false) }} placeholder="11:30" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">평일 마감</label>
            <input className={inputClass} value={weekdayClose} onChange={e => { setWeekdayClose(e.target.value); setSaved(false) }} placeholder="22:00" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">주말 오픈</label>
            <input className={inputClass} value={weekendOpen} onChange={e => { setWeekendOpen(e.target.value); setSaved(false) }} placeholder="12:00" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">주말 마감</label>
            <input className={inputClass} value={weekendClose} onChange={e => { setWeekendClose(e.target.value); setSaved(false) }} placeholder="22:00" />
          </div>
        </div>
      </div>

      {/* 위도/경도 */}
      <div className="flex flex-col gap-3">
        <p className={labelClass}>위치 좌표 (geo)</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">위도 (lat)</label>
            <input className={inputClass} value={lat} onChange={e => { setLat(e.target.value); setSaved(false) }} placeholder="37.4798" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[var(--color-body)]">경도 (lng)</label>
            <input className={inputClass} value={lng} onChange={e => { setLng(e.target.value); setSaved(false) }} placeholder="127.0423" />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 text-[13px] font-medium bg-[var(--color-espresso)] text-white rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? '저장 중…' : '저장'}
        </button>
        {saved && <span className="text-[11px] text-green-600">✓ 저장됨</span>}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>
    </div>
  )
}
