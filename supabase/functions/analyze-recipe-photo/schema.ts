import { z } from 'npm:zod@3.25.1'
import type { Recipe } from './types.ts'

export const IngredientSchema = z.object({
  name: z.string().min(1),
  prep_form: z.string().optional(),
  amount: z.number().positive(),
  unit: z.string().min(1),
  category: z.enum(['main', 'seasoning', 'aromatic', 'garnish', 'sauce', 'starch']),
  brand_source: z.enum(['profile', 'catalog', 'generic']),
  brand: z.string().optional(),
  product: z.string().optional(),
  catalog_id: z.string().uuid().optional(),
  note: z.string().optional(),
})

export const RecipeStepSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  sensory_cues: z.array(z.string()).optional(),
  duration_sec: z.number().positive().optional(),
  temperature: z.string().optional(),
  per_serving: z.boolean().default(false),
})

export const RecipeSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  servings: z.number().int().positive().default(10),
  equipment: z.array(
    z.object({ name: z.string(), quantity: z.number().int().positive(), note: z.string().optional() })
  ),
  ingredients: z.array(IngredientSchema).min(1),
  prep_time_min: z.number().nonnegative(),
  cook_time_min: z.number().nonnegative(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  steps: z.array(RecipeStepSchema).min(1),
  chef_tips: z.array(z.string()),
  plating: z.string().optional(),
  cost_estimate_krw: z.number().nonnegative().optional(),
})

export type RecipeOutput = z.infer<typeof RecipeSchema>

/**
 * 환각 방어: brand_source가 profile/catalog가 아닌데 brand값이 있으면 제거 후 generic으로 강등
 */
export function applyBrandGuard(recipe: RecipeOutput): RecipeOutput {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => {
      if (ing.brand_source === 'generic' && (ing.brand || ing.product)) {
        console.warn(`[brand-guard] 환각 의심 강등: ${ing.name} brand="${ing.brand}"`)
        const { brand: _, product: __, catalog_id: ___, ...safe } = ing
        return { ...safe, brand_source: 'generic' as const }
      }
      return ing
    }),
  }
}