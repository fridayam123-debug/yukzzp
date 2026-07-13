/**
 * 네이버 플레이스 리뷰 자동 동기화
 * - Playwright로 ncaptcha 토큰만 획득
 * - 이후 직접 HTTP 호출로 전체 리뷰 수집 (빠름)
 * - GitHub Actions 매일 새벽 4시 KST 실행
 */

import { chromium } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

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

async function fetchAllReviews(
  loc: typeof LOCATIONS[0],
  headers: Record<string, string>
): Promise<any[]> {
  const allItems: any[] = []
  let cursor = '0'
  let page = 0

  headers['x-wtm-graphql'] = makeWtmGraphqlToken(loc.businessId)

  while (true) {
    const body = JSON.stringify([{
      operationName: 'getVisitorReviews',
      variables: {
        input: {
          businessId: loc.businessId,
          businessType: 'restaurant',
          item: cursor,
          bookingBusinessId: loc.bookingBusinessId,
          size: 10,
          isPhotoUsed: false,
          includeContent: true,
          getUserStats: true,
          includeReceiptPhotos: true,
          cidList: loc.cidList,
          getReactions: true,
          getTrailer: true,
        },
      },
      query: GQL_QUERY,
    }])

    const res = await fetch('https://pcmap-api.place.naver.com/graphql', {
      method: 'POST',
      headers,
      body,
    })

    if (!res.ok) {
      console.error(`[${loc.slug}] HTTP ${res.status} (page ${page})`)
      break
    }

    const json: any = await res.json()
    const vr = json[0]?.data?.visitorReviews
    if (!vr) break

    const items: any[] = vr.items ?? []
    if (items.length === 0) break

    allItems.push(...items)
    page++
    console.log(`[${loc.slug}] ${allItems.length} / ${vr.total}건`)

    if (allItems.length >= vr.total) break

    cursor = items[items.length - 1].id
    await new Promise((r) => setTimeout(r, 300))
  }

  return allItems
}

async function upsert(slug: string, items: any[]) {
  const rows = items
    .filter((r) => r.body?.trim())
    .map((r) => ({
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

    const items = await fetchAllReviews(loc, headers)
    console.log(`[${loc.slug}] 총 ${items.length}건 수집`)
    await upsert(loc.slug, items)
  }
  console.log('\n완료')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
