import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import { COPY_KO } from '@/lib/constants/brand'

export type Locale = 'ko' | 'en' | 'ja' | 'vi'

export type SiteCopyRow = {
  key: string
  label: string
  value: string
  value_en: string | null
  value_ja: string | null
  value_vi: string | null
  section: string
  updated_at: string | null
}

const _getRawRows = unstable_cache(
  async (): Promise<SiteCopyRow[]> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('site_copy')
      .select('key, label, value, value_en, value_ja, value_vi, section, updated_at')
    if (error) {
      console.error('[getSiteCopy] error:', error)
      return []
    }
    return (data ?? []) as unknown as SiteCopyRow[]
  },
  ['site-copy-raw'],
  { revalidate: 60, tags: ['site-copy'] },
)

function pickLocale(row: SiteCopyRow, locale: Locale): string {
  let val: string
  if (locale === 'en') val = row.value_en || row.value
  else if (locale === 'ja') val = row.value_ja || row.value
  else if (locale === 'vi') val = row.value_vi || row.value
  else val = row.value
  return val.replace(/\\n/g, '\n')
}

export async function getSiteCopy(locale: Locale = 'ko'): Promise<Record<string, string>> {
  const rows = await _getRawRows()
  return Object.fromEntries(rows.map(r => [r.key, pickLocale(r, locale)]))
}

/** DB 카피 + constants fallback을 합쳐 반환 */
export async function getMergedCopy(locale: Locale = 'ko'): Promise<typeof COPY_KO & Record<string, string>> {
  const dbCopy = await getSiteCopy(locale)
  return { ...COPY_KO, ...dbCopy } as typeof COPY_KO & Record<string, string>
}

/** 어드민용: 섹션 정보 포함 전체 rows (dot-notation keys only) */
export async function getAllCopyRows(): Promise<SiteCopyRow[]> {
  const rows = await _getRawRows()
  return rows
    .filter(r => r.key.includes('.'))
    .sort((a, b) => {
      const sectionOrder = ['hero', 'authority', 'brand-story', 'why', 'locations', 'group', 'reservation', 'review', 'instagram']
      const ai = sectionOrder.indexOf(a.section)
      const bi = sectionOrder.indexOf(b.section)
      if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      return a.key.localeCompare(b.key)
    })
}
