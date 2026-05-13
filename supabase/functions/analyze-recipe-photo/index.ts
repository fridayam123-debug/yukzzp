import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { RecipeSchema, applyBrandGuard } from './schema.ts'
import { buildSystemPrompt } from './prompt.ts'
import { fetchCatalogAndProfile, logUsage, getTodayUsageCount } from './catalog.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 30

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!

  // ── 1. 인증 검증 ───────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '인증 필요' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: authError } = await userSupabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: '유효하지 않은 토큰' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // admin_users 확인
  const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: adminUser } = await serviceSupabase
    .from('admin_users').select('id').eq('id', user.id).single()
  if (!adminUser) {
    return new Response(JSON.stringify({ error: '관리자 권한 없음' }), {
      status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // ── 2. 일일 한도 체크 ──────────────────────────────────────────────────────
  const todayCount = await getTodayUsageCount(supabaseUrl, supabaseServiceKey, user.id)
  if (todayCount >= DAILY_LIMIT) {
    return new Response(
      JSON.stringify({ error: `일일 한도(${DAILY_LIMIT}회)를 초과했습니다`, code: 'LIMIT_EXCEEDED' }),
      { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  // ── 3. 요청 파싱 ──────────────────────────────────────────────────────────
  let imageDataUrl: string
  let dishHint: string | undefined
  let servings: number = 10
  try {
    const body = await req.json()
    imageDataUrl = body.imageDataUrl
    dishHint = body.dishHint
    servings = body.servings ?? 10
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      throw new Error('imageDataUrl 필드가 필요합니다')
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const [mimeType, base64Data] = imageDataUrl.split(',') as [string, string]
  const mime = mimeType.replace('data:', '').replace(';base64', '')

  // ── 4. 카탈로그·프로필 로드 ──────────────────────────────────────────────
  let catalog: Awaited<ReturnType<typeof fetchCatalogAndProfile>>['catalog']
  let profile: Awaited<ReturnType<typeof fetchCatalogAndProfile>>['profile']
  try {
    const result = await fetchCatalogAndProfile(supabaseUrl, supabaseServiceKey)
    catalog = result.catalog
    profile = result.profile
  } catch (e) {
    return new Response(JSON.stringify({ error: `카탈로그 로드 실패: ${String(e)}`, code: 'CATALOG_ERROR' }), {
      status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // ── 5. Gemini 호출 ────────────────────────────────────────────────────────
  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  })

  const systemPrompt = buildSystemPrompt(catalog, profile, servings)
  const userText = dishHint ? `음식 힌트: ${dishHint}` : '사진을 분석하여 레시피를 작성해주세요'

  let rawJson: string | undefined
  let usageMetadata: { promptTokenCount?: number; candidatesTokenCount?: number } = {}
  let geminiError: string | undefined

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: mime, data: base64Data } },
            { text: userText },
          ],
        },
      ],
      systemInstruction: systemPrompt,
    })
    rawJson = result.response.text()
    usageMetadata = result.response.usageMetadata ?? {}
  } catch (e) {
    geminiError = String(e)
    // 1회 재시도
    try {
      await new Promise((r) => setTimeout(r, 2000))
      const retry = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType: mime, data: base64Data } },
            { text: userText },
          ],
        }],
        systemInstruction: systemPrompt,
      })
      rawJson = retry.response.text()
      usageMetadata = retry.response.usageMetadata ?? {}
      geminiError = undefined
    } catch (retryErr) {
      geminiError = String(retryErr)
      return new Response(JSON.stringify({ error: `Gemini 호출 실패: ${geminiError}`, code: 'GEMINI_ERROR' }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }
  }

  // ── 6. Zod 검증 + Brand Guard ─────────────────────────────────────────────
  let recipe
  try {
    if (!rawJson) {
      return new Response(JSON.stringify({ error: 'Gemini 응답 없음' }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }
    const parsed = JSON.parse(rawJson)
    const zodResult = RecipeSchema.safeParse(parsed)
    if (!zodResult.success) {
      console.warn('[zod] 검증 실패:', JSON.stringify(zodResult.error.flatten()))
      // Best-effort: strip obvious hallucinated brands even without full schema validation
      if (parsed?.ingredients && Array.isArray(parsed.ingredients)) {
        parsed.ingredients = parsed.ingredients.map((ing: Record<string, unknown>) => {
          if (ing.brand_source === 'generic' && (ing.brand || ing.product)) {
            const { brand: _, product: __, ...safe } = ing
            return { ...safe, brand_source: 'generic' }
          }
          return ing
        })
      }
      recipe = parsed
    } else {
      recipe = applyBrandGuard(zodResult.data)
    }
  } catch {
    return new Response(JSON.stringify({ error: 'JSON 파싱 실패', raw: rawJson }), {
      status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // ── 7. 사용량 로깅 ────────────────────────────────────────────────────────
  const inputTokens = usageMetadata.promptTokenCount ?? 0
  const outputTokens = usageMetadata.candidatesTokenCount ?? 0
  const costUsd = (inputTokens * 0.000000075) + (outputTokens * 0.0000003)

  await logUsage(supabaseUrl, supabaseServiceKey, {
    admin_user_id: user.id,
    dish_name: recipe.name ?? '미확인',
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cost_usd: costUsd,
    tier: 'free',
    error: geminiError,
  })

  // ── 8. 응답 ──────────────────────────────────────────────────────────────
  return new Response(
    JSON.stringify({
      recipe,
      usage: { input_tokens: inputTokens, output_tokens: outputTokens, cost_krw: Math.round(costUsd * 1350) },
    }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
  )
})
