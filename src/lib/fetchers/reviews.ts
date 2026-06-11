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

const _cache = new Map<string, { data: Review[]; time: number }>()
const TTL = 5 * 60 * 1000 // 5분

export async function getReviews(locationSlug: string, limit = 8): Promise<Review[]> {
  const key = `${locationSlug}:${limit}`
  const cached = _cache.get(key)
  if (cached && Date.now() - cached.time < TTL) return cached.data

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return cached?.data ?? []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('id, location_slug, author, text, rating, rec_count, source, visited_at')
      .eq('location_slug', locationSlug)
      .eq('visible', true)
      .order('rec_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[getReviews] error:', error)
      return cached?.data ?? []
    }

    const rows = (data ?? []) as Review[]
    _cache.set(key, { data: rows, time: Date.now() })
    return rows
  } catch {
    return cached?.data ?? []
  }
}
