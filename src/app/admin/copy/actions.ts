'use server'

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'
import type { Locale } from '@/lib/fetchers/copy'

const LANG_COL: Record<Locale, string> = {
  ko: 'value',
  en: 'value_en',
  ja: 'value_ja',
  vi: 'value_vi',
}

export async function updateCopyLang(key: string, lang: Locale, value: string) {
  const supabase = createPublicClient()
  const col = LANG_COL[lang]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('site_copy').update({ [col]: value }).eq('key', key)
  if (error) return { error: (error as { message: string }).message }
  revalidateTag('site-copy', 'max')
  return { success: true }
}
