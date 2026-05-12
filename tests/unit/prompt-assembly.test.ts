// tests/unit/prompt-assembly.test.ts
import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from '../fixtures/recipes/prompt-test-exports'

describe('buildSystemPrompt', () => {
  it('카탈로그 아이템이 프롬프트에 포함된다', () => {
    const catalog = [
      { id: 'abc', category: '간장', brand: '샘표', product_name: '양조간장 501호',
        use_cases: ['무침', '드레싱'], flavor_notes: '감칠맛', price_krw: 8900, unit: '1.8L', retailer: '식봄' },
    ]
    const prompt = buildSystemPrompt(catalog, [])
    expect(prompt).toContain('샘표')
    expect(prompt).toContain('양조간장 501호')
    expect(prompt).toContain('무침')
  })

  it('프로필 아이템이 프롬프트에 포함된다', () => {
    const profile = [
      { id: 'xyz', ingredient_name: '양조간장', catalog_id: null,
        custom_brand: '거래처 OEM', custom_note: '양재점 전용', vendor: 'A유통', is_active: true },
    ]
    const prompt = buildSystemPrompt([], profile)
    expect(prompt).toContain('거래처 OEM')
    expect(prompt).toContain('양재점 전용')
  })

  it('비어있는 카탈로그도 오류 없이 동작한다', () => {
    const prompt = buildSystemPrompt([], [])
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(100)
  })
})