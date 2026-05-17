'use server'

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export async function updateCopy(key: string, value: string) {
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('update_site_copy', {
    p_key: key,
    p_value: value,
  })
  if (error) return { error: (error as { message: string }).message }
  // @ts-expect-error: single-arg form deprecated in Next.js 16 but works
  revalidateTag('site-copy')
  return { success: true }
}
