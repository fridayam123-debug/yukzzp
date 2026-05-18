'use server'

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export interface ReviewRow {
  location_slug: string
  author: string
  text: string
  rating: number | null
  rec_count: number
  visited_at: string | null
  source: string
  source_id: string | null
}

export async function importReviews(rows: ReviewRow[]): Promise<{ inserted: number; error?: string }> {
  if (rows.length === 0) return { inserted: 0 }
  const supabase = createPublicClient()
  const { error, count } = await supabase
    .from('reviews')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id', { count: 'exact', head: true })
  if (error) return { inserted: 0, error: error.message }
  revalidateTag('reviews')
  return { inserted: count ?? rows.length }
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  const supabase = createPublicClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('reviews')
  return {}
}

export async function getReviewStats(): Promise<{ yangjae: number; euljiro: number }> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('reviews')
    .select('location_slug')
    .eq('visible', true)
  const rows = data ?? []
  return {
    yangjae: rows.filter(r => r.location_slug === 'yangjae').length,
    euljiro: rows.filter(r => r.location_slug === 'euljiro').length,
  }
}
