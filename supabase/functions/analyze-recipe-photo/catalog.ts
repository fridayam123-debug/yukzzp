// supabase/functions/analyze-recipe-photo/catalog.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

export interface CatalogItem {
  id: string
  category: string
  brand: string
  product_name: string
  use_cases: string[]
  flavor_notes: string | null
  price_krw: number | null
  unit: string | null
  retailer: string | null
}

export interface ProfileItem {
  id: string
  ingredient_name: string
  catalog_id: string | null
  custom_brand: string | null
  custom_note: string | null
  vendor: string | null
  is_active: boolean
}

export async function fetchCatalogAndProfile(
  supabaseUrl: string,
  serviceKey: string,
): Promise<{ catalog: CatalogItem[]; profile: ProfileItem[] }> {
  const supabase = createClient(supabaseUrl, serviceKey)

  const [catalogResult, profileResult] = await Promise.all([
    supabase
      .from('ingredient_catalog')
      .select('id,category,brand,product_name,use_cases,flavor_notes,price_krw,unit,retailer')
      .order('source_score', { ascending: false }),
    supabase
      .from('ingredient_profile')
      .select('id,ingredient_name,catalog_id,custom_brand,custom_note,vendor,is_active')
      .eq('is_active', true),
  ])

  if (catalogResult.error) throw new Error(`catalog fetch error: ${catalogResult.error.message}`)
  if (profileResult.error) throw new Error(`profile fetch error: ${profileResult.error.message}`)

  return {
    catalog: catalogResult.data ?? [],
    profile: profileResult.data ?? [],
  }
}

export async function logUsage(
  supabaseUrl: string,
  serviceKey: string,
  params: {
    admin_user_id: string
    dish_name: string
    input_tokens: number
    output_tokens: number
    cost_usd: number
    tier: string
    error?: string
  },
): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceKey)
  await supabase.from('recipe_usage_log').insert({
    ...params,
    model: 'gemini-2.0-flash',
  })
}

export async function getTodayUsageCount(
  supabaseUrl: string,
  serviceKey: string,
  adminUserId: string,
): Promise<number> {
  const supabase = createClient(supabaseUrl, serviceKey)
  const today = new Date().toISOString().slice(0, 10)
  const { count } = await supabase
    .from('recipe_usage_log')
    .select('id', { count: 'exact', head: true })
    .eq('admin_user_id', adminUserId)
    .gte('created_at', `${today}T00:00:00Z`)
    .lt('created_at', `${today}T23:59:59Z`)
  return count ?? 0
}