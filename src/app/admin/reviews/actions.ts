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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error, count } = await (supabase as any)
    .from('reviews')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id', { count: 'exact', head: true })
  if (error) return { inserted: 0, error: (error as { message: string }).message }
  revalidateTag('reviews', 'max')
  return { inserted: count ?? rows.length }
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reviews').delete().eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidateTag('reviews', 'max')
  return {}
}

export async function getReviewStats(): Promise<{ yangjae: number; euljiro: number }> {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('reviews')
    .select('location_slug')
    .eq('visible', true)
  const rows = (data ?? []) as { location_slug: string }[]
  return {
    yangjae: rows.filter(r => r.location_slug === 'yangjae').length,
    euljiro: rows.filter(r => r.location_slug === 'euljiro').length,
  }
}

export interface ReviewRecord {
  id: string
  location_slug: string
  author: string
  text: string
  rating: number | null
  rec_count: number
  visited_at: string | null
  visible: boolean
  source: string
}

export async function getAllReviews(): Promise<ReviewRecord[]> {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('reviews')
    .select('id, location_slug, author, text, rating, rec_count, visited_at, visible, source')
    .order('rec_count', { ascending: false })
  return (data ?? []) as ReviewRecord[]
}

export async function toggleReviewVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reviews').update({ visible }).eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidateTag('reviews', 'max')
  return {}
}

export async function updateReview(id: string, patch: { text?: string; author?: string }): Promise<{ error?: string }> {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reviews').update(patch).eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidateTag('reviews', 'max')
  return {}
}
