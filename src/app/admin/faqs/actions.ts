'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

export type FaqRow = Database['public']['Tables']['faqs']['Row']

export interface FaqInput {
  category: string           // 매장 식별자 (location slug) 또는 'general'(공통)
  slug: string               // URL/식별 슬러그 (비우면 자동 생성)
  sort_order: number
  question_ko: string
  answer_ko: string
  question_en: string
  answer_en: string
  question_ja: string
  answer_ja: string
  question_vi: string
  answer_vi: string
  question_zh_hans: string
  answer_zh_hans: string
  question_zh_hant: string
  answer_zh_hant: string
}

/** 빈 다국어 필드는 null로 — DB에 빈 문자열 대신 null 저장 */
function nz(v: string): string | null {
  const t = v.trim()
  return t.length > 0 ? t : null
}

function buildPayload(input: FaqInput, locationId: string | null) {
  return {
    category: input.category,
    location_id: locationId,
    sort_order: input.sort_order,
    question_ko: input.question_ko.trim(),
    answer_ko: input.answer_ko.trim(),
    question_en: nz(input.question_en),
    answer_en: nz(input.answer_en),
    question_ja: nz(input.question_ja),
    answer_ja: nz(input.answer_ja),
    question_vi: nz(input.question_vi),
    answer_vi: nz(input.answer_vi),
    question_zh_hans: nz(input.question_zh_hans),
    answer_zh_hans: nz(input.answer_zh_hans),
    question_zh_hant: nz(input.question_zh_hant),
    answer_zh_hant: nz(input.answer_zh_hant),
  }
}

/** category(=slug)에 해당하는 location.id 조회. general이거나 미존재면 null */
async function resolveLocationId(
  supabase: ReturnType<typeof createServiceClient>,
  category: string,
): Promise<string | null> {
  if (category === 'general') return null
  const { data } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', category)
    .maybeSingle()
  return data?.id ?? null
}

function revalidateAll() {
  revalidatePath('/notice')
  revalidatePath('/locations/yangjae')
  revalidatePath('/locations/euljiro')
}

/** 어드민 — 모든 FAQ (정렬: 카테고리 → sort_order) */
export async function getAllFaqsAdmin(): Promise<FaqRow[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

/** 매장(카테고리) 선택 옵션 — locations 테이블 기반 + 공통 */
export async function getStoreOptions(): Promise<{ value: string; label: string }[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('locations')
    .select('slug, name_ko')
    .order('slug')
  const stores = (data ?? []).map((l) => ({
    value: l.slug,
    label: l.name_ko.replace('육즙관리소 ', ''),
  }))
  // 양재 먼저
  stores.sort((a, b) => (a.value === 'yangjae' ? -1 : b.value === 'yangjae' ? 1 : 0))
  return [...stores, { value: 'general', label: '공통 (전 매장)' }]
}

export async function createFaq(input: FaqInput) {
  const supabase = createServiceClient()
  const slug = input.slug.trim() || `${input.category}-${Date.now()}`
  const locationId = await resolveLocationId(supabase, input.category)
  const { data, error } = await supabase
    .from('faqs')
    .insert({ ...buildPayload(input, locationId), slug })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidateAll()
  return data
}

export async function updateFaq(id: string, input: FaqInput) {
  const supabase = createServiceClient()
  const locationId = await resolveLocationId(supabase, input.category)
  const payload = buildPayload(input, locationId)
  const slug = input.slug.trim()
  const { data, error } = await supabase
    .from('faqs')
    .update(slug ? { ...payload, slug } : payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidateAll()
  return data
}

export async function deleteFaq(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateAll()
}
