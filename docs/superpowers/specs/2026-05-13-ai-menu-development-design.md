# AI 메뉴 개발 도구 — 디자인 문서

- **작성일**: 2026-05-13
- **대상**: 육즙관리소 어드민 내부 도구 (`/admin/menu/develop`)
- **단계**: MVP (Phase 1)
- **예상 작업 분량**: 약 4일

---

## 1. 개요

음식 사진 1장에서 식당 운영 가능한 10인분 정밀 레시피를 자동 생성하는 어드민 도구. 참조 서비스 MenuAI(menuai-app.netlify.app)의 핵심 가치를 가져오되, **재료 단위까지 구체적 브랜드를 명시**하는 점이 우리 시스템의 차별점.

### 1-1. 해결하는 문제

배문진 대표가 신메뉴 개발 시:
- 후보 메뉴 사진 → 10인분 정확한 g/ml 계량 받기
- 어느 브랜드 간장(샘표 501 vs 701), 어느 식초(사과 vs 현미)를 써야 하는지 추천 받기
- 직원 교육·원가계산용 표준 레시피 산출

### 1-2. MVP 범위 (in scope)

- 사진 업로드 → Gemini 2.0 Flash 분석 → 10인분 레시피 결과
- 식자재 카탈로그 50개 시드 + 사용자 거래처 프로필 lazy build
- 결과 화면 + 인쇄용 CSS
- 어드민 인증 (필수 전제조건)
- 사용량·비용 모니터링

### 1-3. 비범위 (out of scope, Phase 2+)

- 신메뉴 후보 보드 (`menu_candidates` 테이블 + 워크플로우)
- 시그니처 메뉴 5스텝 위저드 (MenuAI 클론 영역)
- 월별 프로모션 기획
- 유튜브 셰프 RAG (채널 풀은 기록만)
- 다지점별 프로필 분리

---

## 2. 아키텍처

```
┌──────────────────────────────────────────────────────────────┐
│ /admin/menu/develop  (Next.js 16 App Router)                  │
│   - 어드민 미들웨어 보호 (admin_users 검증)                     │
│                                                              │
│   [사진 업로드] → base64 변환 (client-side)                    │
│        │                                                     │
│        ▼                                                     │
│   POST { imageDataUrl, dishHint?, servings? }                 │
└──────────────────────────────────────┬───────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Supabase Edge Function: analyze-recipe-photo                  │
│                                                              │
│  1. Bearer JWT 검증 → admin_users 재확인                       │
│  2. 일일 사용 카운터 +1 (recipe_usage_log)                      │
│  3. ingredient_catalog (50) + ingredient_profile 조회          │
│  4. 시스템 프롬프트 조립 (7가지 규칙 + 컨텍스트 주입)             │
│  5. Gemini 2.0 Flash 호출 (vision + responseSchema 강제)       │
│  6. Zod 검증 + brand_source 환각 방어 (3중 방어)                │
│  7. usage_log 기록                                            │
│  8. 반환 { recipe, usage }                                    │
└──────────────────────────────────────┬───────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 결과 화면                                                       │
│  - 재료 카드 (브랜드·출처 배지, 색 점 카테고리)                   │
│  - 장비 수량                                                   │
│  - 조리 프로세스 (감각 단서 포함)                                │
│  - 셰프 핵심 포인트                                             │
│  - 비용 추정                                                   │
│  - [브랜드 변경] 인라인 → ingredient_profile lazy build          │
│  - @media print CSS                                          │
│  - localStorage: 최근 10건 캐시                                  │
└──────────────────────────────────────────────────────────────┘
```

### 2-1. 기술 스택

- **프론트엔드**: 기존 Next.js 16 + React 19 + Tailwind 4 + Shadcn (변경 없음)
- **백엔드**: Supabase Edge Function (Deno) — 신규
- **LLM**: Google AI Studio Gemini 2.0 Flash (vision, JSON schema)
- **DB**: Supabase Postgres (테이블 3개 추가)
- **인증**: Supabase Auth (Magic Link, 신규)

### 2-2. LLM 티어 전략

| 단계 | 티어 | 비용 | 데이터 프라이버시 |
|---|---|---|---|
| MVP 검증 | **무료 티어** (15 RPM, 1500 RPD) | 0원 | Google 학습 사용 가능 |
| 시그니처 R&D 본격 사용 | paid 전환 | 월 약 1,000원 이내 | 학습 사용 안 함 |

전환 방법: env var `GEMINI_TIER=paid` + AI Studio에서 billing 활성화. 코드 변경 없음.

---

## 3. 데이터 모델

신규 테이블 3개 + 기존 `admin_users`/`menu_items` 활용. Phase 2 채널 풀은 마크다운 파일로 별도 관리.

### 3-1. `ingredient_catalog` — 식자재 시드 카탈로그

```sql
create table public.ingredient_catalog (
  id              uuid primary key default gen_random_uuid(),
  category        text not null,        -- 간장 / 설탕 / 식초 / 육수팩 / 다시다 / ...
  brand           text not null,        -- 샘표 / 백설 / 오뚜기 / ...
  product_name    text not null,        -- "양조간장 501호 1.8L"
  sku             text,                 -- 바코드 또는 식봄 상품번호
  use_cases       text[] not null,      -- ["무침","드레싱","냉면"]
  flavor_notes    text,                 -- "감칠맛 강함, 짠맛 중간"
  price_krw       int,                  -- 업소용 단가 (스냅샷)
  unit            text,                 -- "1.8L", "5kg"
  retailer        text,                 -- "식봄" / "쿠팡 업소용" / "네이버 스토어"
  retailer_url    text,
  source_score    int default 50,       -- Phase 2 셰프 멘션 시 가산
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_catalog_category on ingredient_catalog(category);
create index idx_catalog_use_cases on ingredient_catalog using gin(use_cases);
```

### 3-2. `ingredient_profile` — 육즙관리소 사용 브랜드 (lazy build)

```sql
create table public.ingredient_profile (
  id              uuid primary key default gen_random_uuid(),
  ingredient_name text not null,        -- "양조간장"
  catalog_id      uuid references ingredient_catalog(id),
  custom_brand    text,                 -- 카탈로그 외 수기 입력
  custom_note     text,                 -- "양재점은 X 거래처, 을지로는 Y"
  vendor          text,                 -- 거래처명
  is_active       boolean default true,
  added_at        timestamptz default now()
);
```

### 3-3. `recipe_usage_log` — 사용량·비용 추적

```sql
create table public.recipe_usage_log (
  id              uuid primary key default gen_random_uuid(),
  admin_user_id   uuid references admin_users(id),
  dish_name       text,
  input_tokens    int,
  output_tokens   int,
  cost_usd        numeric(8,4),
  model           text default 'gemini-2.0-flash',
  tier            text default 'free',  -- 'free' | 'paid'
  error           text,
  created_at      timestamptz default now()
);

create index idx_usage_date on recipe_usage_log(created_at);
```

### 3-4. RLS 정책

```sql
alter table ingredient_catalog enable row level security;
alter table ingredient_profile enable row level security;
alter table recipe_usage_log enable row level security;

-- 패턴: admin_users.email 에 등록된 사용자만 read/write
create policy "admin only" on ingredient_catalog
  using (auth.jwt() ->> 'email' in (select email from admin_users));
-- 동일 패턴 3개 테이블 모두 적용
```

### 3-5. 시드 데이터 — 50개 카탈로그

수동 큐레이션으로 한식 베이스 50개 SKU. 분야별 분배:

| 카테고리 | 개수 | 예시 |
|---|---|---|
| 간장 | 5 | 샘표 501·701, 진간장, 양조간장 표준 |
| 설탕 | 3 | 백설 정백당, 황설탕, 흑설탕 |
| 식초 | 4 | 오뚜기 사과식초, 현미식초, 양조식초, 2배 식초 |
| 육수팩 | 6 | 명절육수, 멸치다시팩, 사골육수, 채수팩 등 |
| 다시다·미원 | 4 | CJ 다시다 쇠고기·해물, 미원, MSG 대체 |
| 액젓 | 3 | 멸치액젓, 까나리액젓, 새우젓 |
| 고춧가루 | 3 | 청양·일반·매운맛 |
| 된장·고추장 | 5 | CJ 해찬들, 청정원, 순창 등 |
| 청량음료 | 4 | 칠성사이다, 스프라이트, 콜라(양념용) |
| 기름 | 3 | 참기름, 들기름, 콩기름 |
| 깨·조미료 | 4 | 통깨, 깨소금, 후추, 마늘 가공품 |
| 기타 | 6 | 김가루, 단무지, 무염버터 등 |

소스: 식봄 카테고리별 베스트 + 쿠팡 업소용 베스트 + 네이버 스마트스토어 보완. 1차는 Claude(에이전트)가 자동 큐레이션 + 검색으로 SKU·가격·URL 채움, 2차는 배문진 대표가 결과 보고 거래처 사용 여부에 따라 수정·삭제·추가.

### 3-6. 마이그레이션 파일

`supabase/migrations/20260513_005_ai_menu_dev.sql` 단일 파일:
1. 3개 테이블 생성
2. 인덱스
3. RLS 활성화 + 정책 3개
4. 50개 시드 insert

---

## 4. Edge Function & 프롬프트 설계

### 4-1. 시그니처

```
POST /functions/v1/analyze-recipe-photo
Headers: { Authorization: "Bearer <Supabase JWT>" }
Body: {
  imageDataUrl: string,      // "data:image/jpeg;base64,..."
  dishHint?: string,
  servings?: number          // 기본 10
}
Response 200: { recipe: RecipeSchema, usage: { input_tokens, output_tokens, cost_krw } }
Response 4xx/5xx: { error: string, code: string }
```

### 4-2. 시스템 프롬프트 (한국어, 7가지 규칙)

```
당신은 한국 식당의 R&D 셰프 어시스턴트입니다.
음식 사진을 분석하여 [10인분 기준] 정밀 레시피를 작성합니다.

[규칙 1: 정밀 계량]
- 모든 재료는 g 또는 ml. "조금", "약간" 금지.
- 양념 비율은 1g 단위까지.
- 조리 시간은 분·초, 온도는 약불/중불/강불 또는 ℃.

[규칙 2: 브랜드 매칭 — 가장 중요]
- [육즙관리소 식자재 프로필]에 해당 재료가 있으면 → 그 브랜드·제품 그대로 사용.
- 프로필에 없고 [식자재 카탈로그]에 있으면 → 카탈로그 brand+product 사용, brand_source="catalog".
- 둘 다 없으면 → 일반명만, brand_source="generic", note에 "거래처 표준 사용 권장".
- ★ 절대 카탈로그·프로필 외 브랜드를 임의 생성하지 마시오. 환각 = 영업 사고.

[규칙 3: 감각 단서]
- 각 조리 단계에 청각·시각·후각·촉각 중 하나 이상 포함.
- 예: "치익 소리", "노릇한 갈색", "고소한 향", "표면이 마르기 시작".

[규칙 4: 장비 수량]
- 10인분 조리에 필요한 장비 수 명시.
- 예: "돌솥 10개", "대형 솥 1개".

[규칙 5: 분량 표기 이중화]
- ingredients: 10인분 합계.
- steps: 분배 단위 (per_serving=true 표시).

[규칙 6: 가공 상태]
- 재료마다 prep_form: "다진 것" / "채 썬 것" / "삶은 것" / "통깨".

[규칙 7: 카테고리]
- 재료마다 category: main / seasoning / aromatic / garnish / sauce / starch.

[육즙관리소 식자재 프로필]
${profile_json}

[식자재 카탈로그]
${catalog_json}

[출력 형식]
순수 JSON만. 마크다운/코드블록 금지. 아래 스키마 정확히 준수.
${zod_schema_as_text}
```

### 4-3. 출력 스키마 (Zod)

```typescript
const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  servings: z.number().default(10),

  equipment: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    note: z.string().optional()
  })),

  ingredients: z.array(z.object({
    name: z.string(),
    prep_form: z.string().optional(),
    amount: z.number(),
    unit: z.string(),
    category: z.enum(['main','seasoning','aromatic','garnish','sauce','starch']),
    brand_source: z.enum(['profile','catalog','generic']),
    brand: z.string().optional(),
    product: z.string().optional(),
    catalog_id: z.string().uuid().optional(),
    note: z.string().optional()
  })),

  prep_time_min: z.number(),
  cook_time_min: z.number(),
  difficulty: z.enum(['easy','medium','hard']),

  steps: z.array(z.object({
    order: z.number(),
    title: z.string(),
    instruction: z.string(),
    sensory_cues: z.array(z.string()).optional(),
    duration_sec: z.number().optional(),
    temperature: z.string().optional(),
    per_serving: z.boolean().default(false)
  })),

  chef_tips: z.array(z.string()),
  plating: z.string().optional(),
  cost_estimate_krw: z.number().optional()
})
```

### 4-4. Gemini 호출 설정

```typescript
const result = await genai.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: [{
    role: 'user',
    parts: [
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      { text: dishHint ? `힌트: ${dishHint}` : '' }
    ]
  }],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: 'application/json',
    responseSchema: RECIPE_JSON_SCHEMA,
    temperature: 0.3,
    maxOutputTokens: 4096
  }
});
```

### 4-5. 3중 환각 방어

1. **프롬프트 명령** — "임의 브랜드 생성 금지" 명시
2. **Gemini responseSchema** — `brand_source` enum 한정 (`profile|catalog|generic`)
3. **서버측 검증** — `brand_source ∉ {profile, catalog}` 인데 `brand` 값이 있으면:
   - `brand`, `product`, `catalog_id` 모두 제거
   - `brand_source` = `generic`으로 강등
   - 로그에 "환각 의심 강등" 기록

### 4-6. 검증 & 재시도

| 상황 | 대응 |
|---|---|
| JSON.parse 실패 | 1회 재호출 |
| Zod parse 실패 | 누락 필드 로깅 + 부분 결과 반환 |
| Gemini 429/503 | 지수 백오프 후 1회 재시도 |
| 일 한도 임박 (1400회) | 콘솔 경고 |
| 일 한도 초과 (1500회) | 에러 반환, paid 전환 안내 |

### 4-7. 비용 가드

```typescript
// 어드민 사용자 1인당 일일 한도
const todayCount = await getTodayUsageCount(adminUserId);
if (todayCount >= 30) throw new Error('일일 사용 한도(30회) 초과');
```

내부 도구이므로 어드민 1인당 일 30회로 충분. 무료 티어 시스템 전체 한도(1500/일) 대비 안전 여유. paid 전환 시 한도 상향 조정 가능.

---

## 5. UI 흐름 & 결과 화면

### 5-1. 진입점

```
어드민 사이드바
├── 메뉴 사진 관리   (기존: /admin/menu)
├── 미디어         (기존: /admin/media)
└── AI 메뉴 개발    (NEW: /admin/menu/develop)
```

### 5-2. 3개 화면 흐름

```
[화면 1: 업로드]
  - 사진 선택 (파일 or 카메라)
  - JPEG/PNG/WebP 최대 10MB
  - 선택 옵션: 음식명 힌트 텍스트
  - "AI 분석 시작" 버튼

       ↓ POST analyze-recipe-photo (5~10초)

[화면 2: 분석 중]
  - 스피너 + 단계 표시
    · 음식 식별 중
    · 카탈로그 매칭 중
    · 10인분 계량 산출 중
  - 취소 버튼

       ↓

[화면 3: 결과]
  - 헤더: ← 레시피 결과 [✓분석완료] [🖨️인쇄]
  - 사진 썸네일
  - 분석된 음식명 + 설명 + "10인분 기준" 배지
  - 장비 카드 (수량 명시)
  - 재료 카드 (브랜드·출처 배지, 색 점 카테고리, [브랜드 변경] 버튼)
  - 조리 프로세스 (번호·감각 단서·시간·온도)
  - 셰프 핵심 포인트
  - 비용 추정 (카탈로그 단가 × 분량)
  - [다른 사진] [홈으로] 버튼
```

### 5-3. 핵심 인터랙션

| 요소 | 동작 |
|---|---|
| 재료 색 점 | `main` 빨강, `seasoning` 노랑, `aromatic` 주황, `garnish` 회색, `sauce` 브라운, `starch` 베이지 |
| `[브랜드 변경]` | 모달 → "어느 거래처/브랜드?" → `ingredient_profile` upsert |
| `[추천]` 배지 | 호버 시 "카탈로그 외 추천. 검증 후 사용." |
| `🖨️ 인쇄` | `window.print()` + `@media print` CSS |
| 최근 10건 | 페이지 상단 `📂 기록` 아이콘 → localStorage 캐시 모달 |

### 5-4. 디자인 가이드 (육즙관리소 톤)

- 컬러: 화이트 베이스 + 에스프레소(`var(--color-espresso)`) 포인트
- 이모지 최소화 (단서 표시 🎬 등 한두 개만, 단계 번호는 ①②③ 또는 한자)
- 카드 borderRadius 12px (기존 컴포넌트 통일)
- 폰트: 기존 본문 폰트 (Pretendard) 유지

### 5-5. 반응형

- **데스크탑 (1440px)**: 2컬럼 (좌: 재료, 우: 조리)
- **모바일 (375px)**: 1컬럼 세로
- **인쇄**: A4 1~2장 자동 줄임, 사이드바·이미지 제외

---

## 6. 보안·인증

### 6-1. 어드민 인증 (MVP 필수 전제)

현재 `/admin`은 인증 없음 — MVP 작업 전 반드시 추가.

```typescript
// src/middleware.ts
export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(...)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect('/login')

    const { data: admin } = await supabase
      .from('admin_users').select('email')
      .eq('email', user.email).single()
    if (!admin) return NextResponse.redirect('/login')
  }
  return NextResponse.next()
}
export const config = { matcher: '/admin/:path*' }
```

### 6-2. 추가 작업

- `/login` 페이지 (Supabase Magic Link)
- Edge Function 내부 JWT 검증 + `admin_users` 재확인 (이중 방어)
- Gemini API 키는 Supabase Edge Function secrets에만 저장 (`supabase secrets set GEMINI_API_KEY=...`)
- 클라이언트(브라우저)에 API 키 절대 노출 금지

---

## 7. 모니터링

### 7-1. 일별 사용량 뷰

```sql
create view daily_recipe_usage as
select
  date_trunc('day', created_at) as day,
  count(*) as call_count,
  sum(input_tokens) as input_tokens,
  sum(output_tokens) as output_tokens,
  sum(cost_usd) as cost_usd,
  count(*) filter (where error is not null) as error_count
from recipe_usage_log
group by 1 order by 1 desc;
```

### 7-2. 한도 알림

Edge Function 내부:
- 1400회 도달 시 콘솔 경고
- 1500회 초과 시 에러 + paid 전환 안내

### 7-3. 어드민 사용량 페이지 (선택)

Phase 2에서 `/admin/usage`에 daily_recipe_usage 시각화. MVP에선 Supabase Studio 대시보드로 확인.

---

## 8. 테스트 전략

| 레벨 | 도구 | 범위 |
|---|---|---|
| Unit | Vitest | Zod 스키마, brand_source 강등 로직, 카탈로그 매칭 |
| Integration | Supabase CLI + 실제 Gemini 호출 | 실제 사진 5개로 골든 테스트 (냉면, 비빔밥, 갈비, 김치찌개, 파전) |
| E2E | Playwright | `/admin/menu/develop` 진입 → 사진 업로드 → 결과 렌더 (Gemini 응답 모킹) |

골든 사진 5개는 `tests/fixtures/recipes/`에 저장.

---

## 9. Phase 2 확장 후크 (지금은 만들지 않음, 설계만 명시)

| 확장 | 진입점 | 신규 데이터 |
|---|---|---|
| **셰프 RAG** | Edge Function에 `context_chef_mentions` 단계 추가 | `chef_transcripts`, `embeddings` |
| **신메뉴 후보 보드** | `/admin/menu/candidates` | `menu_candidates` |
| **시그니처 메뉴 위저드** | `/admin/menu/develop?mode=signature` | (재사용) |
| **월별 프로모션** | `/admin/menu/promo` | 시즌 캘린더 |
| **다지점 프로필** | `ingredient_profile.location_id` 컬럼 | 마이그레이션 |
| **paid 티어 전환** | env var + billing | 코드 동일 |

---

## 10. Phase 2 셰프 채널 풀

별도 파일 `docs/chef-channel-pool.md`에 8개 채널 시드. Phase 2 RAG 구현 시 yt-dlp로 자막 추출 → 임베딩 → ingredient 멘션 추출.

1. @nsmyung2023
2. @kimchef76 — 전설의요리TV (셰프·요리)
3. @lets_ceo — 과장말고 사장하자 (F&B 사장학)
4. @restaurantrecipelab — 식당레시피연구소
5. @mrs_macarons (베이킹·디저트 추정)
6. @strikerchef1542 (셰프)
7. @chefkds
8. UCmzaVMzEPxg2z-aFpVBUBBg

---

## 11. 작업 분량 (예상 4일)

| 단계 | 소요 | 산출물 |
|---|---|---|
| 1. 마이그레이션 + 카탈로그 50개 시드 큐레이션 | 0.5일 | `20260513_005_ai_menu_dev.sql` |
| 2. 어드민 인증 미들웨어 + `/login` 페이지 | 0.5일 | `src/middleware.ts`, `src/app/login/` |
| 3. Edge Function (analyze-recipe-photo) + 프롬프트 | 1일 | `supabase/functions/analyze-recipe-photo/` |
| 4. `/admin/menu/develop` UI (3개 화면) | 1일 | `src/app/admin/menu/develop/` |
| 5. 결과 화면 + 인쇄 CSS + [브랜드 변경] 모달 | 0.5일 | (4단계 일부) |
| 6. 테스트 + 골든 사진 5장 검증 | 0.5일 | `tests/recipes/` |

---

## 12. 성공 기준

1. 음식 사진 업로드 → 5~10초 내 10인분 레시피 출력
2. 재료 90% 이상에 브랜드/제품 명시 (catalog 매칭 또는 [추천] 태그)
3. 환각 0건 (3중 방어로 카탈로그 외 브랜드 절대 출력 안 함)
4. 일일 사용량·비용이 Supabase 대시보드에서 확인 가능
5. 어드민 외 접근 차단 (URL 직접 입력해도 /login 리다이렉트)
6. 인쇄 시 A4 1~2장에 깔끔하게 출력
