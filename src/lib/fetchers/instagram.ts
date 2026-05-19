import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export interface InstagramReel {
  id: string
  reel_id: string
  caption: string | null
  sort_order: number
}

export const getInstagramReels = unstable_cache(
  async (): Promise<InstagramReel[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('instagram_reels')
      .select('id, reel_id, caption, sort_order')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .limit(4)
    return (data ?? []) as InstagramReel[]
  },
  ['instagram_reels'],
  { revalidate: 300, tags: ['instagram_reels'] },
)
