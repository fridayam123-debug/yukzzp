import { createPublicClient } from '@/lib/supabase/service'
import { COPY_KO } from '@/lib/constants/brand'

export type Locale = 'ko' | 'en' | 'ja' | 'vi' | 'zh'

export type SiteCopyRow = {
  key: string
  label: string
  value: string
  value_en: string | null
  value_ja: string | null
  value_vi: string | null
  value_zh: string | null
  section: string
  updated_at: string | null
}

// 모듈 레벨 인메모리 캐시 (unstable_cache 제거 — React 19 suspended thenable 에러 방지)
let _rows: SiteCopyRow[] | null = null
let _rowsTime = 0
const TTL = 60 * 1000 // 60초

async function _fetchRawRows(): Promise<SiteCopyRow[]> {
  if (_rows && Date.now() - _rowsTime < TTL) return _rows

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _rows ?? []

  try {
    const supabase = createPublicClient() // AbortController 8s 적용됨
    const { data, error } = await supabase
      .from('site_copy')
      .select('key, label, value, value_en, value_ja, value_vi, value_zh, section, updated_at')

    if (error) {
      console.error('[getSiteCopy] error:', error)
      return _rows ?? []
    }

    const rows = (data ?? []) as unknown as SiteCopyRow[]
    _rows = rows
    _rowsTime = Date.now()
    return rows
  } catch {
    return _rows ?? []
  }
}

/** 캐시 무효화 (어드민 변경 시 호출) */
export function invalidateCopyCache() {
  _rows = null
  _rowsTime = 0
}

function pickLocale(row: SiteCopyRow, locale: Locale): string {
  let val: string
  if (locale === 'en') val = row.value_en || row.value
  else if (locale === 'ja') val = row.value_ja || row.value
  else if (locale === 'vi') val = row.value_vi || row.value
  else if (locale === 'zh') val = row.value_zh || row.value
  else val = row.value
  return val.replace(/\\n/g, '\n')
}

export async function getSiteCopy(locale: Locale = 'ko'): Promise<Record<string, string>> {
  const rows = await _fetchRawRows()
  return Object.fromEntries(rows.map(r => [r.key, pickLocale(r, locale)]))
}

/** DB 카피 + constants fallback을 합쳐 반환 */
export async function getMergedCopy(locale: Locale = 'ko'): Promise<typeof COPY_KO & Record<string, string>> {
  const dbCopy = await getSiteCopy(locale)
  return { ...COPY_KO, ...dbCopy } as typeof COPY_KO & Record<string, string>
}

/** 어드민용: 섹션 정보 포함 전체 rows (dot-notation keys only) */
export async function getAllCopyRows(): Promise<SiteCopyRow[]> {
  const rows = await _fetchRawRows()
  return rows
    .filter(r => r.key.includes('.'))
    .sort((a, b) => {
      const sectionOrder = ['hero', 'authority', 'brand-story', 'why', 'signature', 'locations', 'group', 'reservation', 'review', 'instagram']
      const ai = sectionOrder.indexOf(a.section)
      const bi = sectionOrder.indexOf(b.section)
      if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      return a.key.localeCompare(b.key)
    })
}
