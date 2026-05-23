'use server'

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export async function addReel(reelId: string, caption: string) {
  const supabase = createPublicClient()
  const { data: last } = await supabase
    .from('instagram_reels')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (last?.sort_order ?? 0) + 1
  await supabase.from('instagram_reels').insert({ reel_id: reelId, caption, sort_order: nextOrder })
  revalidateTag('instagram_reels', 'max')
}

export async function deleteReel(id: string) {
  const supabase = createPublicClient()
  await supabase.from('instagram_reels').delete().eq('id', id)
  revalidateTag('instagram_reels', 'max')
}

export async function toggleVisible(id: string, visible: boolean) {
  const supabase = createPublicClient()
  await supabase.from('instagram_reels').update({ visible }).eq('id', id)
  revalidateTag('instagram_reels', 'max')
}

export async function getReels() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('instagram_reels')
    .select('id, reel_id, caption, sort_order, visible')
    .order('sort_order', { ascending: true })
  return data ?? []
}
