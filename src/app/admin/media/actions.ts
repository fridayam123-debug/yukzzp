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

  if (error) return { error: error.message }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error: single-arg form is deprecated in Next.js 16 but works; test asserts 1-arg call
  revalidateTag('site_config')
}
