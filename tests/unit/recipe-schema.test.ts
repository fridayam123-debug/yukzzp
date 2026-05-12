// tests/unit/recipe-schema.test.ts
import { describe, it, expect } from 'vitest'

// 아직 없는 파일을 import → 테스트 실패 예상
// schema.ts는 Node.js에서도 동작하도록 npm:zod 대신 zod 사용
// (Edge Function 실제 런타임은 Deno, 테스트는 Node.js)
import { RecipeSchema, applyBrandGuard } from '../fixtures/recipes/schema-test-exports'

describe('RecipeSchema', () => {
  const validRecipe = {
    name: '냉면 10인분',
    description: '시원한 냉면',
    servings: 10,
    equipment: [{ name: '냄비', quantity: 1 }],
    ingredients: [
      {
        name: '양조간장',
        amount: 80,
        unit: 'ml',
        category: 'seasoning',
        brand_source: 'catalog',
        brand: '샘표',
        product: '양조간장 501호',
      },
    ],
    prep_time_min: 30,
    cook_time_min: 20,
    difficulty: 'medium',
    steps: [
      {
        order: 1,
        title: '육수 끓이기',
        instruction: '물을 끓인다',
        per_serving: false,
      },
    ],
    chef_tips: ['육수는 미리 식힌다'],
  }

  it('유효한 레시피를 파싱한다', () => {
    const result = RecipeSchema.safeParse(validRecipe)
    expect(result.success).toBe(true)
  })

  it('amount가 음수면 실패한다', () => {
    const bad = { ...validRecipe, ingredients: [{ ...validRecipe.ingredients[0], amount: -1 }] }
    const result = RecipeSchema.safeParse(bad)
    expect(result.success).toBe(false)
  })

  it('category가 enum 밖이면 실패한다', () => {
    const bad = { ...validRecipe, ingredients: [{ ...validRecipe.ingredients[0], category: 'invalid' }] }
    const result = RecipeSchema.safeParse(bad)
    expect(result.success).toBe(false)
  })
})

describe('applyBrandGuard', () => {
  it('brand_source가 generic인데 brand가 있으면 brand를 제거한다', () => {
    const recipe = {
      ...{
        name: '테스트', description: '', servings: 10, equipment: [],
        prep_time_min: 0, cook_time_min: 0, difficulty: 'easy' as const,
        steps: [], chef_tips: [],
      },
      ingredients: [
        {
          name: '간장',
          amount: 50,
          unit: 'ml',
          category: 'seasoning' as const,
          brand_source: 'generic' as const,
          brand: '존재하지않는브랜드',    // 환각 시뮬레이션
          product: '가짜제품',
          per_serving: false,
        },
      ],
    }
    const guarded = applyBrandGuard(recipe)
    expect(guarded.ingredients[0].brand).toBeUndefined()
    expect(guarded.ingredients[0].product).toBeUndefined()
    expect(guarded.ingredients[0].brand_source).toBe('generic')
  })

  it('brand_source가 catalog이면 brand를 유지한다', () => {
    const recipe = {
      ...{
        name: '테스트', description: '', servings: 10, equipment: [],
        prep_time_min: 0, cook_time_min: 0, difficulty: 'easy' as const,
        steps: [], chef_tips: [],
      },
      ingredients: [
        {
          name: '간장',
          amount: 50,
          unit: 'ml',
          category: 'seasoning' as const,
          brand_source: 'catalog' as const,
          brand: '샘표',
          product: '양조간장 501호',
          per_serving: false,
        },
      ],
    }
    const guarded = applyBrandGuard(recipe)
    expect(guarded.ingredients[0].brand).toBe('샘표')
  })
})