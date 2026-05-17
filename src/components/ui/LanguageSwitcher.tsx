'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'

const LOCALE_LABELS: Record<AppLocale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  vi: 'Tiếng Việt',
}

const LOCALE_SHORT: Record<AppLocale, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
  vi: 'VI',
}

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function handleSelect(next: AppLocale) {
    setOpen(false)
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('label')}
        className="flex items-center gap-1 text-[11px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
      >
        <span>{LOCALE_SHORT[locale]}</span>
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-3 min-w-[140px] bg-white border border-[var(--color-hairline)] shadow-sm py-1 z-50"
        >
          {routing.locales.map((l) => {
            const active = l === locale
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(l)}
                  className={`w-full text-left px-4 py-2 text-[12px] tracking-[0.5px] transition-colors ${
                    active
                      ? 'text-[var(--color-espresso)] font-medium'
                      : 'text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
                  }`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
