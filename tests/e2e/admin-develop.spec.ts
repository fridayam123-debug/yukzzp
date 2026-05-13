import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

const MOCK_RECIPE = JSON.parse(
  readFileSync(join(__dirname, '../fixtures/recipes/mock-recipe-response.json'), 'utf-8')
)

test.describe('AI 메뉴 개발 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase Edge Function 호출 모킹
    await page.route('**/functions/v1/analyze-recipe-photo', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ recipe: MOCK_RECIPE, usage: { input_tokens: 1000, output_tokens: 500, cost_krw: 1 } }),
      })
    })

    // 인증 우회: 로컬 Supabase 세션 세팅 (실제 프로젝트의 anon key로 교체)
    await page.addInitScript(() => {
      localStorage.setItem(
        'sb-' + (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/https?:\/\//, '').split('.')[0] + '-auth-token',
        JSON.stringify({ access_token: 'test', user: { id: 'test-admin' } })
      )
    })
  })

  test('업로드 화면이 렌더된다', async ({ page }) => {
    await page.goto('/admin/menu/develop')
    await expect(page.getByText('AI 메뉴 개발')).toBeVisible()
    await expect(page.getByText('10인분 정밀 레시피')).toBeVisible()
  })

  test('JPG 파일 선택 후 AI 분석 버튼이 활성화된다', async ({ page }) => {
    await page.goto('/admin/menu/develop')

    // 테스트용 더미 파일 생성
    const buffer = Buffer.alloc(100)
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer,
    })

    await expect(page.getByRole('button', { name: 'AI 분석 시작 →' })).toBeVisible()
  })

  test('분석 완료 후 결과 화면에 재료 목록이 표시된다', async ({ page }) => {
    await page.goto('/admin/menu/develop')

    const buffer = Buffer.alloc(100)
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer,
    })

    await page.getByRole('button', { name: 'AI 분석 시작 →' }).click()
    await expect(page.getByText('재료 & 계량')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('10인분 기준')).toBeVisible()
    // mock 레시피에 있는 재료
    await expect(page.getByText('양조간장')).toBeVisible()
  })

  test('인증 없이 /admin/menu/develop 접근 시 /login으로 리다이렉트', async ({ page }) => {
    // localStorage 세션 제거
    await page.addInitScript(() => {
      localStorage.clear()
    })
    await page.goto('/admin/menu/develop')
    await expect(page).toHaveURL(/\/login/)
  })
})
