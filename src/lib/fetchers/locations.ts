import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

export type Location = Database['public']['Tables']['locations']['Row']

// 모듈 레벨 인메모리 캐시 (unstable_cache 제거 — React 19 suspended thenable 에러 방지)
let _cache: Location[] | null = null
let _cacheTime = 0
const TTL = 5 * 60 * 1000 // 5분

export async function getLocations(): Promise<Location[]> {
  // TTL 내 캐시 히트
  if (_cache && Date.now() - _cacheTime < TTL) return _cache

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _cache ?? []

  try {
    const supabase = createPublicClient() // AbortController 8s 적용됨
    const { data, error } = await supabase.from('locations').select('*').order('slug')
    if (error || !data) return _cache ?? []
    const sorted = data.sort((a, b) =>
      a.slug === 'yangjae' ? -1 : b.slug === 'yangjae' ? 1 : 0,
    )
    _cache = sorted
    _cacheTime = Date.now()
    return sorted
  } catch {
    return _cache ?? []
  }
}

/** 캐시 무효화 (어드민 변경 시 호출) */
export function invalidateLocationsCache() {
  _cache = null
  _cacheTime = 0
}

const _slugCache = new Map<string, { data: Location | null; time: number }>()

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const cached = _slugCache.get(slug)
  if (cached && Date.now() - cached.time < TTL) return cached.data

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return cached?.data ?? null

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) return cached?.data ?? null
    _slugCache.set(slug, { data, time: Date.now() })
    return data
  } catch {
    return cached?.data ?? null
  }
}
