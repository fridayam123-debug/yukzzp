import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import { COPY_KO } from '@/lib/constants/brand'

export type SiteCopyRow = {
  key: string
  label: string
  value: string
  section: string
  updated_at: string | null
}

/** DB에서 모든 카피를 가져온다. 없으면 constants fallback. */
export const getSiteCopy = unstable_cache(
  async (): Promise<Record<string, string>> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return {}
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('site_copy').select('key, value')
    if (error) {
      console.error('[getSiteCopy] error:', error)
      return {}
    }
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  },
  ['site-copy'],
  { revalidate: 60, tags: ['site-copy'] },
)

/** DB 카피 + constants fallback을 합쳐 반환 */
export async function getMergedCopy(): Promise<typeof COPY_KO & Record<string, string>> {
  const dbCopy = await getSiteCopy()
  return { ...COPY_KO, ...dbCopy } as typeof COPY_KO & Record<string, string>
}

/** 어드민용: 섹션 정보 포함 전체 rows */
export async function getAllCopyRows(): Promise<SiteCopyRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('site_copy')
    .select('*')
    .order('section')
    .order('key')
  return data ?? []
}
