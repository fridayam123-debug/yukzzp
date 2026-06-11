import { createPublicClient } from '@/lib/supabase/service'

export interface InstagramReel {
  id: string
  reel_id: string
  caption: string | null
  sort_order: number
}

let _cache: InstagramReel[] | null = null
let _cacheTime = 0
const TTL = 5 * 60 * 1000 // 5분

export async function getInstagramReels(): Promise<InstagramReel[]> {
  if (_cache && Date.now() - _cacheTime < TTL) return _cache

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _cache ?? []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('instagram_reels')
      .select('id, reel_id, caption, sort_order')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .limit(4)

    const rows = (data ?? []) as InstagramReel[]
    _cache = rows
    _cacheTime = Date.now()
    return rows
  } catch {
    return _cache ?? []
  }
}
