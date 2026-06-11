'use server'

import { revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'

export async function updateLocationFields(formData: FormData) {
  const slug = formData.get('slug') as string
  if (!slug) return { error: 'slug가 없습니다.' }

  const supabase = createServiceClient()

  // Parse hours JSONB
  let hours: unknown = undefined
  const hoursRaw = formData.get('hours') as string
  if (hoursRaw) {
    try {
      hours = JSON.parse(hoursRaw)
    } catch {
      return { error: 'hours JSON 형식이 잘못되었습니다.' }
    }
  }

  // Parse geo JSONB
  let geo: unknown = undefined
  const geoRaw = formData.get('geo') as string
  if (geoRaw) {
    try {
      geo = JSON.parse(geoRaw)
    } catch {
      return { error: 'geo JSON 형식이 잘못되었습니다.' }
    }
  }

  const update: Record<string, unknown> = {
    name_ko: formData.get('name_ko') as string,
    name_en: formData.get('name_en') as string,
    phone: formData.get('phone') as string,
    address_road: formData.get('address_road') as string,
    postal_code: formData.get('postal_code') as string,
    naver_place_id: formData.get('naver_place_id') as string || null,
    catchtable_url: formData.get('catchtable_url') as string || null,
    updated_at: new Date().toISOString(),
  }

  if (hours !== undefined) update.hours = hours
  if (geo !== undefined) update.geo = geo

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('locations').update(update as any).eq('slug', slug)
  if (error) return { error: error.message }

  revalidateTag('locations', 'max')
  return { success: true }
}

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
