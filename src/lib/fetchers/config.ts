import { createPublicClient } from '@/lib/supabase/service'

export type SiteConfig = Record<string, string>

let _cache: SiteConfig | null = null
let _cacheTime = 0
const TTL = 60 * 1000 // 60초

export async function getSiteConfig(): Promise<SiteConfig> {
  if (_cache && Date.now() - _cacheTime < TTL) return _cache

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return _cache ?? {}

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('site_config').select('key, value')

    if (error) {
      console.error('[getSiteConfig] error:', error)
      return _cache ?? {}
    }

    const config = Object.fromEntries((data ?? []).map(row => [row.key, row.value]))
    _cache = config
    _cacheTime = Date.now()
    return config
  } catch {
    return _cache ?? {}
  }
}

export async function getSiteConfigValue(key: string): Promise<string | null> {
  const config = await getSiteConfig()
  return config[key] ?? null
}
