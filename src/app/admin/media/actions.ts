'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveVideoUrl(formData: FormData) {
  const value = formData.get('chef_video_url') as string

  const supabase = await createClient()
  const { error } = await supabase.from('site_config').upsert(
    [{ key: 'chef_video_url', value, updated_at: new Date().toISOString() }],
    { onConflict: 'key' },
  )

  if (error) console.error('[saveVideoUrl]', error.message)
  // @ts-expect-error: single-arg form deprecated in Next.js 16 but works
  revalidateTag('site_config')
}
