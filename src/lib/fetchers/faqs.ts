import { createPublicClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

export type Faq = Database['public']['Tables']['faqs']['Row']

export async function getFaqs(category?: string): Promise<Faq[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = createPublicClient()
    let query = supabase.from('faqs').select('*').order('sort_order')
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) console.error('[getFaqs] error:', error)
    return (data ?? []) as Faq[]
  } catch {
    return []
  }
}

export async function getAllFaqs(): Promise<Faq[]> {
  return getFaqs()
}
