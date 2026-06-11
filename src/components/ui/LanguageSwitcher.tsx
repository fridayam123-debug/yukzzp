'use client'

import { useEffect, useRef, useState } from 'react'

const LOCALES = ['ko', 'en', 'ja', 'zh', 'vi'] as const
type Locale = typeof LOCALES[number]

const LOCALE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  vi: 'Tiếng Việt',
}

function getLocaleFromPath(): Locale {
  if (typeof window === 'undefined') return 'ko'
  const seg = window.location.pathname.split('/')[1]
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : 'ko'
}

function getPathForLocale(locale: Locale): string {
  if (typeof window === 'undefined') return locale === 'ko' ? '/' : `/${locale}`
  const parts = window.location.pathname.split('/')
  const current = parts[1]
  const isLocale = (LOCALES as readonly string[]).includes(current)
  if (locale === 'ko') {
    return isLocale ? '/' + parts.slice(2).join('/') || '/' : window.location.pathname
  }
  return '/' + locale + (isLocale ? '/' + parts.slice(2).join('/') : window.location.pathname)
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('ko')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setLocale(getLocaleFromPath()) }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* 현재 언어 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[11px] tracking-[1.5px] text-[var(--color-espresso)] font-semibold hover:opacity-60 transition-opacity min-w-[44px] py-3.5 -my-3.5 justify-end"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {LOCALE_LABELS[locale]}
        <svg
          width="7"
          height="4"
          viewBox="0 0 7 4"
          fill="currentColor"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M0 0 L3.5 4 L7 0 Z" />
        </svg>
      </button>

      {/* 드롭다운 */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] w-[120px] bg-[rgba(232,223,210,0.97)] backdrop-blur-sm border border-[var(--color-hairline)] shadow-md z-50"
        >
          {LOCALES.map(l => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  window.location.href = getPathForLocale(l)
                }}
                className={`w-full px-4 py-3 text-left text-[11px] tracking-[1.5px] transition-opacity hover:opacity-60 ${
                  l === locale
                    ? 'text-[var(--color-espresso)] font-semibold'
                    : 'text-[var(--color-body)]'
                }`}
              >
                {LOCALE_LABELS[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
