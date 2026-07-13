/**
 * 네이버 플레이스 리뷰 자동 동기화
 * - Playwright로 ncaptcha 토큰만 획득
 * - 이후 직접 HTTP 호출로 리뷰 수집 (커서: 응답 item.cursor → 다음 요청 after)
 * - 부정 리뷰 필터링 후 매장별 최대 TARGET_PER_LOCATION건 upsert
 * - GitHub Actions 매일 새벽 4시 KST 실행
 */

import { chromium } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// env 없으면 .env.local에서 로드 (로컬 실행용)
function loadEnv(key: string, localKey: string): string {
  if (process.env[key]) return process.env[key]!
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local')
  if (existsSync(envPath)) {
    const m = readFileSync(envPath, 'utf8').match(new RegExp(`^${localKey}=(.+)$`, 'm'))
    if (m) return m[1].trim()
  }
  throw new Error(`${key} 환경변수 없음`)
}

const SUPABASE_URL = loadEnv('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')
const SUPABASE_SERVICE_KEY = loadEnv('SUPABASE_SERVICE_KEY', 'SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/** 매장별 업로드 목표 건수 */
const TARGET_PER_LOCATION = 70

/** 부정 리뷰 스킵 키워드 */
const NEGATIVE_KEYWORDS = [
  '별로', '실망', '아쉬', '불친절', '최악', '비추', '더러', '위생',
  '머리카락', '다신 안', '다시는 안', '짜증', '불쾌', '기분 나쁘', '기분나쁘', '불만',
]

const LOCATIONS = [
  {
    slug: 'yangjae',
    businessId: '1672141709',
    bookingBusinessId: '754066',
    cidList: ['220036', '220037', '220075', '220765', '221458'],
  },
  {
    slug: 'euljiro',
    businessId: '2033717879',
    bookingBusinessId: '1538488',
    cidList: ['220036', '220037', '220075', '220733'],
  },
]

const GQL_QUERY = `
query getVisitorReviews($input: VisitorReviewsInput) {
  visitorReviews(input: $input) {
    ...VisitorReviews
    __typename
  }
}
fragment VisitorReviews on VisitorReviewsResult {
  items {
    id
    cursor
    reviewId
    rating
    author { id nickname from imageUrl __typename }
    body
    visitCount
    visited
    visitedDate
    created
    reply { body created __typename }
    language
    userIdno
    apolloCacheId
    __typename
  }
  total
  __typename
}
`.trim()

async function getSessionHeaders(businessId: string): Promise<Record<string, string>> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  let capturedHeaders: Record<string, string> = {}

  page.on('request', (req) => {
    if (req.url().includes('pcmap-api.place.naver.com/graphql') && req.method() === 'POST') {
      const h = req.headers()
      if (capturedHeaders['x-wtm-ncaptcha-token']) return
      capturedHeaders = {
        'accept': '*/*',
        'accept-language': 'ko',
        'content-type': 'application/json',
        'referer': `https://pcmap.place.naver.com/restaurant/${businessId}/home?from=map`,
        'user-agent': h['user-agent'] ?? '',
        'x-wtm-ncaptcha-token': h['x-wtm-ncaptcha-token'] ?? '',
        'sec-ch-ua': h['sec-ch-ua'] ?? '',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    }
  })

  await page.goto(`https://map.naver.com/p/entry/place/${businessId}?placePath=%2Freview`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  })
  await page.waitForTimeout(3000)
  await browser.close()

  return capturedHeaders
}

function makeWtmGraphqlToken(businessId: string): string {
  return Buffer.from(JSON.stringify({
    arg: businessId,
    type: 'restaurant',
    source: 'place',
  })).toString('base64')
}

/** 부정 리뷰 판별 — rating 3점 이하 또는 부정 키워드 포함 */
function isNegative(r: any): boolean {
  if (typeof r.rating === 'number' && r.rating <= 3) return true
  const body: string = r.body ?? ''
  return NEGATIVE_KEYWORDS.some((kw) => body.includes(kw))
}

async function fetchReviews(
  loc: typeof LOCATIONS[0],
  headers: Record<string, string>
): Promise<any[]> {
  const positive: any[] = []
  let after: string | null = null
  let page = 0
  let skipped = 0

  headers['x-wtm-graphql'] = makeWtmGraphqlToken(loc.businessId)

  // 목표 채울 때까지 페이지네이션 (안전 상한 20페이지)
  while (positive.length < TARGET_PER_LOCATION && page < 20) {
    const input: Record<string, unknown> = {
      businessId: loc.businessId,
      businessType: 'restaurant',
      item: '0',
      bookingBusinessId: loc.bookingBusinessId,
      size: 10,
      isPhotoUsed: false,
      includeContent: true,
      getUserStats: true,
      includeReceiptPhotos: true,
      cidList: loc.cidList,
      getReactions: true,
      getTrailer: true,
    }
    if (after) input.after = after

    const body = JSON.stringify([{
      operationName: 'getVisitorReviews',
      variables: { input },
      query: GQL_QUERY,
    }])

    const res = await fetch('https://pcmap-api.place.naver.com/graphql', {
      method: 'POST',
      headers,
      body,
    })

    if (!res.ok) {
      console.error(`[${loc.slug}] HTTP ${res.status} (page ${page}) — 중단`)
      break
    }

    const json: any = await res.json()
    const vr = json[0]?.data?.visitorReviews
    if (!vr) {
      console.error(`[${loc.slug}] visitorReviews null (page ${page}) — 중단`)
      break
    }

    const items: any[] = vr.items ?? []
    if (items.length === 0) break

    for (const item of items) {
      if (positive.length >= TARGET_PER_LOCATION) break
      if (isNegative(item)) { skipped++; continue }
      if (!item.body?.trim()) continue
      positive.push(item)
    }

    page++
    console.log(`[${loc.slug}] p${page}: 수집 ${positive.length}/${TARGET_PER_LOCATION} (부정 스킵 누적 ${skipped})`)

    after = items[items.length - 1]?.cursor ?? null
    if (!after) break
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`[${loc.slug}] 최종: 긍정 ${positive.length}건, 부정 스킵 ${skipped}건`)
  return positive
}

async function upsert(slug: string, items: any[]) {
  const rows = items.map((r) => ({
    location_slug: slug,
    author: r.author?.nickname ?? '익명',
    text: r.body,
    rating: r.rating ?? 5,
    rec_count: 0,
    source: 'naver',
    source_id: r.id ?? r.reviewId,
    visible: true,
    visited_at: r.visitedDate ? r.visitedDate.slice(0, 10) : null,
  }))

  const CHUNK = 500
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase
      .from('reviews')
      .upsert(rows.slice(i, i + CHUNK), { onConflict: 'source,source_id', ignoreDuplicates: true })
    if (error) console.error(`[${slug}] upsert 오류:`, error.message)
  }
  console.log(`[${slug}] ${rows.length}건 upsert 완료`)
}

async function main() {
  for (const loc of LOCATIONS) {
    console.log(`\n=== ${loc.slug} 시작 ===`)
    const headers = await getSessionHeaders(loc.businessId)

    if (!headers['x-wtm-ncaptcha-token']) {
      console.warn(`[${loc.slug}] ncaptcha 토큰 미획득 — 토큰 없이 시도`)
    }

    const items = await fetchReviews(loc, headers)
    await upsert(loc.slug, items)
  }
  console.log('\n완료')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
