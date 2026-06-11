import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export type Banner = Database['public']['Tables']['emergency_banner']['Row']

/**
 * 활성화된 임시 공지를 1개 반환 (없으면 null).
 * 매 요청마다 fresh — 사장님이 임시 휴무 공지를 즉시 띄울 수 있어야 함.
 */
export async function getActiveBanner(): Promise<Banner | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('emergency_banner')
      .select('*')
      .eq('active', true)
      .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    return data
  } catch {
    return null
  }
}
