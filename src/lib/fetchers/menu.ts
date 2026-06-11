import { createPublicClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

export type MenuCategory = Database['public']['Tables']['menu_categories']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']

let _menuCache: { categories: MenuCategory[]; items: MenuItem[] } | null = null
let _menuCacheTime = 0
let _sigCache: MenuItem[] | null = null
let _sigCacheTime = 0
const TTL = 60 * 1000 // 60초

export async function getMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  if (_menuCache && Date.now() - _menuCacheTime < TTL) return _menuCache

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _menuCache ?? { categories: [], items: [] }

  try {
    const supabase = createPublicClient()
    const [catsRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('sort_order'),
      supabase.from('menu_items').select('*').order('sort_order'),
    ])

    if (catsRes.error) console.error('[getMenu] categories error:', catsRes.error)
    if (itemsRes.error) console.error('[getMenu] items error:', itemsRes.error)

    const result = {
      categories: (catsRes.data ?? []) as MenuCategory[],
      items: (itemsRes.data ?? []) as MenuItem[],
    }
    _menuCache = result
    _menuCacheTime = Date.now()
    return result
  } catch {
    return _menuCache ?? { categories: [], items: [] }
  }
}

export async function getSignatureItems(): Promise<MenuItem[]> {
  if (_sigCache && Date.now() - _sigCacheTime < TTL) return _sigCache

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _sigCache ?? []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_signature', true)
      .order('sort_order')

    const rows = (data ?? []) as MenuItem[]
    _sigCache = rows
    _sigCacheTime = Date.now()
    return rows
  } catch {
    return _sigCache ?? []
  }
}
