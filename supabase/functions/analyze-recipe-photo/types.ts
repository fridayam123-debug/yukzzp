// supabase/functions/analyze-recipe-photo/types.ts

export type IngredientCategory =
  | 'main'
  | 'seasoning'
  | 'aromatic'
  | 'garnish'
  | 'sauce'
  | 'starch'

export type BrandSource = 'profile' | 'catalog' | 'generic'

export interface Ingredient {
  name: string
  prep_form?: string        // "다진 것", "채 썬 것"
  amount: number
  unit: string              // "g", "ml", "개"
  category: IngredientCategory
  brand_source: BrandSource
  brand?: string
  product?: string
  catalog_id?: string
  note?: string
}

export interface RecipeStep {
  order: number
  title: string
  instruction: string
  sensory_cues?: string[]   // ["치익 소리", "노릇한 갈색"]
  duration_sec?: number
  temperature?: string      // "중불"
  per_serving: boolean
}

export interface Equipment {
  name: string
  quantity: number
  note?: string
}

export interface Recipe {
  name: string
  description: string
  servings: number
  equipment: Equipment[]
  ingredients: Ingredient[]
  prep_time_min: number
  cook_time_min: number
  difficulty: 'easy' | 'medium' | 'hard'
  steps: RecipeStep[]
  chef_tips: string[]
  plating?: string
  cost_estimate_krw?: number
}

export interface RecipeHistoryItem {
  id: string
  dish_name: string
  created_at: string
  recipe: Recipe
}

export type ScreenState = 'upload' | 'analyzing' | 'result'

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
}