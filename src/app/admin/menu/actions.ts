'use server'

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export async function uploadMenuPhoto(formData: FormData) {
  const file = formData.get('file') as File
  const itemId = formData.get('itemId') as string

  if (!file || !itemId) return { error: '파일 또는 항목 ID가 없습니다.' }

  const supabase = createPublicClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${itemId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('menu-photos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('menu-photos')
    .getPublicUrl(path)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any).rpc('update_menu_photo_url', {
    item_id: itemId,
    new_photo_url: publicUrl,
  })

  if (updateError) return { error: (updateError as { message: string }).message }

  // @ts-expect-error: single-arg form deprecated in Next.js 16 but works
  revalidateTag('menu')
  return { success: true, url: publicUrl }
}
