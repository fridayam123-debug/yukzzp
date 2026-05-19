'use server'

import { revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'

export async function uploadLocationPhoto(formData: FormData) {
  const file = formData.get('file') as File
  const slug = formData.get('slug') as string

  if (!file || !slug) return { error: '파일 또는 slug가 없습니다.' }

  const supabase = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slug}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('location-photos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('location-photos')
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('locations')
    .update({ hero_image: publicUrl })
    .eq('slug', slug)

  if (updateError) return { error: updateError.message }

  revalidateTag('locations', 'max')
  return { success: true, url: publicUrl }
}
