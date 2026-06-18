'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    wcs?: { cnv: (type: string, value: string) => unknown; inflow: (domain: string) => void }
    wcs_do?: (nasa: Record<string, unknown>) => void
  }
}

function fireGa4(name: string, location?: string) {
  window.gtag?.('event', name, {
    event_category: 'conversion',
    ...(location ? { location } : {}),
  })
}

function fireNaver() {
  if (window.wcs && window.wcs_do) {
    const nasa: Record<string, unknown> = {}
    nasa['cnv'] = window.wcs.cnv('5', '1')
    window.wcs_do(nasa)
  }
}

export function TrackingProvider() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-event]')
      if (!el) return
      const base = el.dataset.event
      const loc = el.dataset.location
      if (!base) return
      const name = loc ? `${base}_${loc}` : base
      fireGa4(name, loc)
      fireNaver()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
