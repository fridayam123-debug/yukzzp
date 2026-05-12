// tests/fixtures/recipes/schema-test-exports.ts
// Deno의 npm:zod 대신 npm 패키지 zod 사용 (Vitest = Node.js)
import { z } from 'zod'
import type { Recipe } from '../../../src/app/admin/menu/develop/types'

const IngredientSchema = z.object({
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

const RecipeStepSchema = z.object({
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

type RecipeOutput = z.infer<typeof RecipeSchema>

export function applyBrandGuard(recipe: RecipeOutput): RecipeOutput {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => {
      if (ing.brand_source === 'generic' && (ing.brand || ing.product)) {
        const { brand: _, product: __, catalog_id: ___, ...safe } = ing
        return { ...safe, brand_source: 'generic' as const }
      }
      return ing
    }),
  }
}