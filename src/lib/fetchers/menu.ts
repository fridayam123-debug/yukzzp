import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

export type MenuCategory = Database['public']['Tables']['menu_categories']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']

/**
 * 카테고리 + 아이템을 모두 가져온다.
 * 캐시: 60초, 태그 'menu' (어드민 가격 변경 시 revalidate).
 */
export const getMenu = unstable_cache(
  async (): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { categories: [], items: [] }
    const supabase = createPublicClient()
    const [{ data: cats }, { data: items }] = await Promise.all([
      supabase.from('menu_categories').select('*').order('sort_order'),
      supabase.from('menu_items').select('*').order('sort_order'),
    ])
    return { categories: cats ?? [], items: items ?? [] }
  },
  ['menu'],
  { revalidate: 60, tags: ['menu'] },
)

/**
 * 시그니처 메뉴만 (LP 시그니처 카드 3개용).
 */
export const getSignatureItems = unstable_cache(
  async (): Promise<MenuItem[]> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_signature', true)
      .order('sort_order')
    return data ?? []
  },
  ['menu-signature'],
  { revalidate: 60, tags: ['menu'] },
)
