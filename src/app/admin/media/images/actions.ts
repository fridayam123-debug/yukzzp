'use server'

import { revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'

const IMAGE_CONFIGS: Record<string, { bucket: string; path: string; configKey: string }> = {
  'hero.background': {
    bucket: 'site-images',
    path: 'hero-background',
    configKey: 'hero_background_url',
  },
  'interior.banner': {
    bucket: 'site-images',
    path: 'interior-banner',
    configKey: 'interior_banner_url',
  },
  'brand.story': {
    bucket: 'site-images',
    path: 'brand-story',
    configKey: 'brand_story_url',
  },
}

export async function uploadKeyImage(formData: FormData) {
  const file = formData.get('file') as File
  const imageKey = formData.get('imageKey') as string

  if (!file || !imageKey) return { error: '파일 또는 키가 없습니다.' }

  const config = IMAGE_CONFIGS[imageKey]
  if (!config) return { error: '알 수 없는 이미지 키입니다.' }

  const supabase = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${config.path}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(config.bucket)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from(config.bucket)
    .getPublicUrl(path)

  const { error: upsertError } = await supabase
    .from('site_config')
    .upsert(
      [{ key: config.configKey, value: publicUrl, updated_at: new Date().toISOString() }],
      { onConflict: 'key' },
    )

  if (upsertError) return { error: upsertError.message }

  revalidateTag('site_config', 'max')
  return { success: true, url: publicUrl }
}
