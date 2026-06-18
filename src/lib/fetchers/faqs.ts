import { createPublicClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

export type Faq = Database['public']['Tables']['faqs']['Row']

const _cache = new Map<string, { data: Faq[]; time: number }>()
const TTL = 5 * 60 * 1000

export async function getFaqs(category?: string): Promise<Faq[]> {
  const key = category ?? '__all__'
  const cached = _cache.get(key)
  if (cached && Date.now() - cached.time < TTL) return cached.data

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return cached?.data ?? []
  try {
    const supabase = createPublicClient()
    let query = supabase.from('faqs').select('*').order('sort_order')
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) console.error('[getFaqs] error:', error)
    const rows = (data ?? []) as Faq[]
    _cache.set(key, { data: rows, time: Date.now() })
    return rows
  } catch {
    return cached?.data ?? []
  }
}

export async function getAllFaqs(): Promise<Faq[]> {
  return getFaqs()
}
