import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export interface Review {
  id: string
  location_slug: string
  author: string
  text: string
  rating: number | null
  rec_count: number
  source: string
  visited_at: string | null
}

export const getReviews = unstable_cache(
  async (locationSlug: string, limit = 8): Promise<Review[]> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('id, location_slug, author, text, rating, rec_count, source, visited_at')
      .eq('location_slug', locationSlug)
      .eq('visible', true)
      .order('rec_count', { ascending: false })
      .limit(limit)
    if (error) console.error('[getReviews] error:', error)
    return (data ?? []) as Review[]
  },
  ['reviews'],
  { revalidate: 300, tags: ['reviews'] },
)
