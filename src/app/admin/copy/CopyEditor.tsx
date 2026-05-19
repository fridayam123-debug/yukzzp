'use client'

import { useState, useTransition } from 'react'
import { updateCopyLang } from './actions'
import type { SiteCopyRow, Locale } from '@/lib/fetchers/copy'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  authority: '미디어 · 셰프 추천',
  'brand-story': '브랜드 스토리',
  why: 'WHY 육즙관리소',
  locations: '지점',
  group: '단체 다이닝',
  reservation: '예약',
  review: '리뷰',
  instagram: '인스타그램',
  general: '기타',
}

const LANGS: { key: Locale; label: string }[] = [
  { key: 'ko', label: '한국어' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
  { key: 'vi', label: 'Tiếng Việt' },
]

function getValueForLang(row: SiteCopyRow, lang: Locale): string {
  if (lang === 'en') return row.value_en ?? ''
  if (lang === 'ja') return row.value_ja ?? ''
  if (lang === 'vi') return row.value_vi ?? ''
  return row.value ?? ''
}

function CopyField({ row, lang }: { row: SiteCopyRow; lang: Locale }) {
  const [value, setValue] = useState(getValueForLang(row, lang))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Reset when lang changes
  const currentDefault = getValueForLang(row, lang)

  const isMultiline = value.includes('\n') || value.length > 80 || currentDefault.includes('\n') || currentDefault.length > 80

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateCopyLang(row.key, lang, value)
      if (result?.error) setError(result.error)
      else setSaved(true)
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[var(--color-body)]">{row.label}</label>
      {isMultiline ? (
        <textarea
          key={`${row.key}-${lang}`}
          defaultValue={currentDefault}
          onChange={e => { setValue(e.target.value); setSaved(false) }}
          rows={Math.max(3, currentDefault.split('\n').length + 1)}
          className="w-full px-3 py-2 text-[13px] text-[var(--color-ink)] bg-white border border-[var(--color-hairline)] rounded focus:outline-none focus:border-[var(--color-espresso)] resize-y leading-relaxed"
        />
      ) : (
        <input
          key={`${row.key}-${lang}`}
          type="text"
          defaultValue={currentDefault}
          onChange={e => { setValue(e.target.value); setSaved(false) }}
          className="w-full px-3 py-2 text-[13px] text-[var(--color-ink)] bg-white border border-[var(--color-hairline)] rounded focus:outline-none focus:border-[var(--color-espresso)]"
        />
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-1.5 text-[12px] font-medium bg-[var(--color-espresso)] text-white rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? '저장 중…' : '저장'}
        </button>
        {saved && <span className="text-[11px] text-green-600">✓ 저장됨</span>}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>
    </div>
  )
}

export function CopyEditor({ rows }: { rows: SiteCopyRow[] }) {
  const [lang, setLang] = useState<Locale>('ko')
  const sections = [...new Set(rows.map(r => r.section))]

  return (
    <div className="flex flex-col gap-8">
      {/* Language tabs */}
      <div className="flex gap-1 border-b border-[var(--color-hairline)]">
        {LANGS.map(l => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`px-5 py-2.5 text-[13px] border-b-2 transition-colors -mb-px ${lang === l.key ? 'border-[var(--color-espresso)] text-[var(--color-ink)] font-medium' : 'border-transparent text-[var(--color-body)] hover:text-[var(--color-ink)]'}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Fields by section */}
      <div className="flex flex-col gap-12">
        {sections.map(section => (
          <div key={section}>
            <h2 className="text-[13px] font-semibold text-[var(--color-ink)] tracking-[0.08em] uppercase pb-3 mb-6 border-b border-[var(--color-hairline)]">
              {SECTION_LABELS[section] ?? section}
            </h2>
            <div className="flex flex-col gap-6">
              {rows.filter(r => r.section === section).map(row => (
                <CopyField key={`${row.key}-${lang}`} row={row} lang={lang} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
