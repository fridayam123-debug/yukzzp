import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export type SiteConfig = Record<string, string>

export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return {}
    const supabase = createPublicClient()
    const { data } = await supabase.from('site_config').select('key, value')
    if (!data) return {}
    return Object.fromEntries(data.map(row => [row.key, row.value]))
  },
  ['site_config'],
  { revalidate: 60, tags: ['site_config'] },
)

export async function getSiteConfigValue(key: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const config = await getSiteConfig()
  return config[key] ?? null
}
