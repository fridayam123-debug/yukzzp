import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export type Location = Database['public']['Tables']['locations']['Row']

/**
 * 두 지점을 모두 가져온다 (slug 기준 정렬).
 * 캐시: 5분, 태그 'locations' (어드민 변경 시 revalidate).
 */
export const getLocations = unstable_cache(
  async (): Promise<Location[]> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('slug')
    if (error) throw error
    return data ?? []
  },
  ['locations'],
  { revalidate: 300, tags: ['locations'] },
)

/**
 * slug로 단일 지점 조회.
 * 매번 fresh — 어드민 미리보기에서 즉시 반영되어야 하므로 캐시 X.
 */
export async function getLocationBySlug(slug: string): Promise<Location | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}
