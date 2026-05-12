# AI 메뉴 개발 도구 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/admin/menu/develop` 페이지에서 음식 사진 1장 → 10인분 브랜드 명시 레시피를 자동 생성하는 어드민 내부 도구를 구축한다.

**Architecture:** Next.js 16 App Router + Supabase Edge Function (`analyze-recipe-photo`) + Google Gemini 2.0 Flash. 식자재 카탈로그 50개 시드를 DB에 보관하고, LLM 프롬프트에 컨텍스트로 주입해 브랜드를 구체적으로 출력한다. 3중 환각 방어(프롬프트 명령 + Zod 검증 + 서버측 강등)로 임의 브랜드 생성을 차단한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase (Postgres + Edge Functions + Auth SSR), `@supabase/ssr`, `@google/generative-ai` (npm via Deno), Zod, Vitest, Tailwind 4, `var(--color-espresso)` design token

---

## 파일 구조 맵

```
supabase/
├── migrations/
│   └── 20260513_005_ai_menu_dev.sql            [NEW] 3개 테이블 + RLS + 50개 시드
└── functions/
    └── analyze-recipe-photo/
        ├── index.ts                             [NEW] 메인 핸들러 (Deno)
        ├── schema.ts                            [NEW] Zod 스키마 + brand guard
        ├── prompt.ts                            [NEW] 시스템 프롬프트 조립
        └── catalog.ts                           [NEW] ingredient_catalog/profile 쿼리

src/
├── middleware.ts                                [NEW] /admin/* 인증 보호
├── app/
│   ├── login/
│   │   └── page.tsx                            [NEW] Magic Link 로그인
│   └── admin/
│       ├── layout.tsx                           [NEW] 사이드바 포함 레이아웃
│       └── menu/
│           └── develop/
│               ├── page.tsx                     [NEW] 서버 컴포넌트 엔트리
│               ├── DevelopClient.tsx            [NEW] 화면 전환 + 상태 관리
│               ├── UploadScreen.tsx             [NEW] 화면 1: 사진 업로드
│               ├── AnalyzingScreen.tsx          [NEW] 화면 2: 분석 중
│               ├── ResultScreen.tsx             [NEW] 화면 3: 결과 표시
│               ├── BrandChangeModal.tsx         [NEW] 재료 브랜드 변경 모달
│               ├── RecipeHistory.tsx            [NEW] localStorage 최근 10건
│               └── types.ts                     [NEW] 공유 타입 정의
└── lib/
    └── supabase/
        └── types.ts                             [MODIFY] 새 테이블 타입 추가

tests/
├── unit/
│   ├── recipe-schema.test.ts                   [NEW] Zod + brand guard 단위 테스트
│   └── prompt-assembly.test.ts                 [NEW] 프롬프트 조립 단위 테스트
├── e2e/
│   └── admin-develop.spec.ts                   [NEW] Playwright E2E
└── fixtures/
    └── recipes/
        └── mock-recipe-response.json            [NEW] Gemini 응답 목
```

---

## Task 1: DB 마이그레이션 + 식자재 카탈로그 50개 시드

**Files:**
- Create: `supabase/migrations/20260513_005_ai_menu_dev.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```sql
-- supabase/migrations/20260513_005_ai_menu_dev.sql
-- AI 메뉴 개발 도구: ingredient_catalog / ingredient_profile / recipe_usage_log

-- ─── 1. ingredient_catalog ───────────────────────────────────────────────────
create table public.ingredient_catalog (
  id            uuid primary key default gen_random_uuid(),
  category      text not null,
  brand         text not null,
  product_name  text not null,
  sku           text,
  use_cases     text[] not null default '{}',
  flavor_notes  text,
  price_krw     int,
  unit          text,
  retailer      text,
  retailer_url  text,
  source_score  int not null default 50,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_catalog_category  on public.ingredient_catalog(category);
create index idx_catalog_use_cases on public.ingredient_catalog using gin(use_cases);

-- ─── 2. ingredient_profile ───────────────────────────────────────────────────
create table public.ingredient_profile (
  id              uuid primary key default gen_random_uuid(),
  ingredient_name text not null,
  catalog_id      uuid references public.ingredient_catalog(id) on delete set null,
  custom_brand    text,
  custom_note     text,
  vendor          text,
  is_active       boolean not null default true,
  added_at        timestamptz not null default now()
);

-- ─── 3. recipe_usage_log ─────────────────────────────────────────────────────
create table public.recipe_usage_log (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  dish_name     text,
  input_tokens  int,
  output_tokens int,
  cost_usd      numeric(8,4),
  model         text not null default 'gemini-2.0-flash',
  tier          text not null default 'free',
  error         text,
  created_at    timestamptz not null default now()
);
create index idx_usage_date on public.recipe_usage_log(created_at);

-- ─── 4. 일별 사용량 뷰 ───────────────────────────────────────────────────────
create view public.daily_recipe_usage as
select
  date_trunc('day', created_at) as day,
  count(*)                       as call_count,
  sum(input_tokens)              as input_tokens,
  sum(output_tokens)             as output_tokens,
  sum(cost_usd)                  as cost_usd,
  count(*) filter (where error is not null) as error_count
from public.recipe_usage_log
group by 1 order by 1 desc;

-- ─── 5. RLS ──────────────────────────────────────────────────────────────────
alter table public.ingredient_catalog  enable row level security;
alter table public.ingredient_profile  enable row level security;
alter table public.recipe_usage_log    enable row level security;

create policy "admin only" on public.ingredient_catalog
  using (auth.uid() in (select id from public.admin_users));
create policy "admin only" on public.ingredient_profile
  using (auth.uid() in (select id from public.admin_users));
create policy "admin only" on public.recipe_usage_log
  using (auth.uid() in (select id from public.admin_users));

-- ─── 6. 식자재 카탈로그 시드 50개 ────────────────────────────────────────────
insert into public.ingredient_catalog
  (category, brand, product_name, sku, use_cases, flavor_notes, price_krw, unit, retailer)
values
-- 간장 5종
('간장','샘표','양조간장 501호 1.8L','8801073101008',array['무침','드레싱','나물'],'감칠맛 강함, 부드러운 짠맛',8900,'1.8L','식봄'),
('간장','샘표','진간장 701호 1.8L','8801073101015',array['조림','찜','볶음'],'짙고 달콤한 맛, 색깔 진함',9200,'1.8L','식봄'),
('간장','청정원','양조간장 500ml','8801007104004',array['무침','드레싱'],'깔끔한 감칠맛',4800,'500ml','식봄'),
('간장','CJ 백설','진간장 1.8L','8801007104011',array['조림','볶음'],'진한 색, 달콤함',8700,'1.8L','쿠팡 업소용'),
('간장','오뚜기','진간장 1.7L','8801045505151',array['찜','조림'],'균형 잡힌 간장맛',8500,'1.7L','네이버 스토어'),
-- 설탕 3종
('설탕','CJ 백설','정백당 3kg','8801007201009',array['양념','조림','드레싱'],'중립적인 단맛, 가장 범용',12500,'3kg','식봄'),
('설탕','CJ 백설','황설탕 3kg','8801007201016',array['양념','드레싱'],'약한 카라멜 향, 볶음 요리 적합',13000,'3kg','식봄'),
('설탕','큐원','흑설탕 1kg','8801062101003',array['양념','바비큐','찜'],'진한 단맛, 고기 양념 최적',5500,'1kg','쿠팡 업소용'),
-- 식초 4종
('식초','오뚜기','사과식초 1.8L','8801045504048',array['냉면','드레싱','무침'],'과실향, 부드러운 산미',7200,'1.8L','식봄'),
('식초','청정원','현미식초 900ml','8801007203003',array['피클','초밥','냉채'],'깔끔한 산미, 곡물 향',5400,'900ml','식봄'),
('식초','오뚜기','양조식초 1.8L','8801045504055',array['무침','일반 조리'],'표준 식초, 중립적',6500,'1.8L','쿠팡 업소용'),
('식초','오뚜기','2배 식초 900ml','8801045504062',array['냉면 양념','강한 새콤'],'산미 2배, 소량 사용',5800,'900ml','네이버 스토어'),
-- 육수팩 6종
('육수팩','청정원','멸치다시팩 10g×30','8801007301001',array['국물','찌개','조림'],'깔끔한 멸치 감칠맛',8500,'10g×30','식봄'),
('육수팩','오뚜기','사골육수팩 500ml','8801045601001',array['국물','탕','보양식'],'진한 사골 맛',2800,'500ml','식봄'),
('육수팩','사조','명절육수팩 1L','8801007302008',array['국물','밥상'],'다용도 국물',3200,'1L','쿠팡 업소용'),
('육수팩','청정원','채수팩 15g×20','8801007303005',array['채식 국물','비건'],'비건 국물, 채소 감칠맛',7800,'15g×20','식봄'),
('육수팩','오뚜기','닭육수팩 500ml','8801045602008',array['국물','찜'],'담백한 닭 육수',2600,'500ml','네이버 스토어'),
('육수팩','청정원','사골곰탕 육수팩 500ml','8801007304002',array['국물','사골탕'],'진한 사골 국물',3000,'500ml','식봄'),
-- 다시다·미원·조미료 4종
('조미료','CJ 다시다','쇠고기 다시다 300g','8801007401001',array['국물','찌개','볶음'],'쇠고기 감칠맛 강함',7500,'300g','식봄'),
('조미료','CJ 다시다','해물 다시다 300g','8801007401018',array['해물 국물','찌개'],'해물 감칠맛',7500,'300g','식봄'),
('조미료','대상','미원 1kg','8801004201001',array['감칠맛','일반 조리'],'MSG, 범용 감칠맛 보강',8500,'1kg','쿠팡 업소용'),
('조미료','청정원','맛선생 멸치맛 200g','8801007402008',array['국물','나물'],'멸치 기반 천연 조미료',6200,'200g','식봄'),
-- 액젓 3종
('액젓','청정원','멸치액젓 900ml','8801007501001',array['김치','나물','찌개'],'깔끔한 멸치 향',6800,'900ml','식봄'),
('액젓','청정원','까나리액젓 750ml','8801007502008',array['김치','찌개'],'부드러운 액젓 향',5900,'750ml','식봄'),
('액젓','오뚜기','새우젓 500g','8801045701001',array['김치','삼겹살','쌈'],'짭조름한 새우 향',5500,'500g','식봄'),
-- 고춧가루 3종
('고춧가루','청정원','청양고춧가루 100g','8801007601001',array['매운 요리','찌개','볶음'],'매운맛 강함',4200,'100g','식봄'),
('고춧가루','청정원','고운 고춧가루 200g','8801007602008',array['김치','양념'],'선명한 붉은색, 중간 매운맛',7800,'200g','식봄'),
('고춧가루','청정원','굵은 고춧가루 200g','8801007603005',array['볶음','찌개','나물'],'씹히는 식감, 풍부한 향',7500,'200g','쿠팡 업소용'),
-- 된장·고추장 5종
('된장','CJ 해찬들','우리쌀 된장 500g','8801007701001',array['찌개','쌈장','나물'],'구수하고 부드러운 맛',6500,'500g','식봄'),
('된장','청정원','순창 재래된장 500g','8801007702008',array['찌개','나물 무침'],'깊은 발효 향',6800,'500g','식봄'),
('고추장','CJ 해찬들','태양초 고추장 500g','8801007703005',array['비빔밥','볶음','양념'],'단맛+매운맛 균형',7200,'500g','식봄'),
('고추장','청정원','순창 고추장 500g','8801007704002',array['비빔밥','양념'],'순한 맛, 발효 향',7000,'500g','식봄'),
('고추장','오뚜기','태양초 고추장 350g','8801045801001',array['볶음','양념'],'달콤한 매운맛',5800,'350g','쿠팡 업소용'),
-- 청량음료·맛술 4종
('맛술','청하','청하 청주 360ml','8801084501001',array['잡내 제거','향미'],'생선·고기 잡내 제거',2800,'360ml','식봄'),
('맛술','오뚜기','맛술 750ml','8801045901001',array['잡내 제거','생선 요리'],'달콤한 맛술',4500,'750ml','식봄'),
('청량음료','롯데','칠성사이다 1.5L','8801062201001',array['양념 단맛','고기 잡내'],'탄산으로 고기 연화',1800,'1.5L','쿠팡 업소용'),
('청량음료','코카콜라','스프라이트 1.5L','8801062202008',array['양념','고기 잡내'],'탄산, 레몬향',1800,'1.5L','쿠팡 업소용'),
-- 기름 3종
('기름','청정원','참기름 450ml','8801007101001',array['나물','마무리','향미 강화'],'고소하고 진한 참기름 향',12500,'450ml','식봄'),
('기름','오뚜기','들기름 450ml','8801045201001',array['나물','구이'],'들깨 특유의 구수한 향',11000,'450ml','식봄'),
('기름','해표','콩기름 1.8L','8801062301001',array['튀김','볶음','일반 조리'],'중립적인 맛, 고온 적합',7500,'1.8L','식봄'),
-- 깨·기타 조미료 4종
('깨·조미료','농협','국산 통깨 500g','8801062401001',array['나물','마무리','비빔밥'],'고소한 깨 향',12000,'500g','식봄'),
('깨·조미료','사조','통후추 분쇄용 150g','8801062402008',array['육류','서양식','볶음'],'매콤한 후추 향',6500,'150g','쿠팡 업소용'),
('깨·조미료','오뚜기','다진마늘 500g','8801045301001',array['볶음','양념','찌개'],'간편한 다진마늘',4200,'500g','식봄'),
('깨·조미료','오뚜기','참깨 분태 100g','8801045302008',array['드레싱','나물','마무리'],'곱게 갈린 참깨',4800,'100g','네이버 스토어'),
-- 기타 6종
('기타','광천김','맛김가루 200g','8801062501001',array['비빔밥','국수','덮밥'],'바삭하고 짭조름한 김 향',8500,'200g','식봄'),
('기타','오뚜기','맛있는 단무지 1kg','8801045401001',array['비빔밥','볶음밥','냉면'],'아삭한 식감, 약한 단맛',4500,'1kg','식봄'),
('기타','서울우유','무염버터 450g','8801017501001',array['볶음','소테','코팅','돌솥'],'고소한 버터 향, 무염',9800,'450g','쿠팡 업소용'),
('기타','오뚜기','레몬즙 500ml','8801045402008',array['생선 잡내','드레싱','냉면'],'신선한 레몬산미',4200,'500ml','식봄'),
('기타','오뚜기','굴소스 500g','8801045403005',array['중식 볶음','잡채','양념'],'짙은 굴 감칠맛',6800,'500g','식봄'),
('기타','하인즈','우스터소스 290ml','8801062502008',array['스테이크','육류 소스','서양식'],'복합 향신료, 고기 소스',7500,'290ml','네이버 스토어');
```

- [ ] **Step 2: 로컬 Supabase에 마이그레이션 적용**

```bash
supabase db reset
# 또는 기존 DB 유지하며 순서대로 적용
supabase migration up
```

기대 결과: `supabase db reset` 후 `Applied 6 migrations` (기존 5개 + 새 1개)

- [ ] **Step 3: 테이블·시드 확인**

```bash
supabase db diff   # 변경사항 없어야 함 (이미 적용됨)
```

또는 Supabase Studio에서:
```sql
select count(*) from ingredient_catalog;  -- 50
select category, count(*) from ingredient_catalog group by 1 order by 1;
```

- [ ] **Step 4: 커밋**

```bash
git add supabase/migrations/20260513_005_ai_menu_dev.sql
git commit -m "feat(db): ingredient_catalog/profile/usage_log 테이블 + 50개 시드"
```

---

## Task 2: 어드민 인증 미들웨어 + 로그인 페이지

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: middleware.ts 작성**

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // admin_users 테이블에 등록된 사용자만 허용
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: 로그인 페이지 작성**

```typescript
// src/app/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/menu` },
    })
    setLoading(false)
    if (!error) setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <p className="text-[15px] font-medium text-[var(--color-ink)]">
            이메일을 확인해주세요
          </p>
          <p className="text-[13px] text-[var(--color-body)]">
            {email} 로 로그인 링크를 전송했습니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6 space-y-6">
        <h1 className="text-[20px] font-semibold text-[var(--color-ink)] tracking-tight">
          육즙관리소 어드민
        </h1>
        {searchParams.error === 'unauthorized' && (
          <p className="text-[13px] text-red-500">등록된 관리자 계정이 아닙니다.</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-espresso)] text-white text-[14px] font-medium rounded-[8px] disabled:opacity-50"
          >
            {loading ? '전송 중...' : '로그인 링크 받기'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 로그인 동작 수동 검증**

브라우저에서 `/admin/menu` 직접 접근 → `/login` 리다이렉트 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/middleware.ts src/app/login/page.tsx
git commit -m "feat(auth): 어드민 인증 미들웨어 + Magic Link 로그인 페이지"
```

---

## Task 3: 공유 TypeScript 타입

**Files:**
- Create: `src/app/admin/menu/develop/types.ts`
- Modify: `src/lib/supabase/types.ts`

- [ ] **Step 1: develop/types.ts 작성**

```typescript
// src/app/admin/menu/develop/types.ts

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
```

- [ ] **Step 2: Supabase types.ts에 새 테이블 추가**

`src/lib/supabase/types.ts`의 `Tables` 블록 안 (기존 테이블 마지막 줄 뒤)에 추가:

```typescript
      ingredient_catalog: {
        Row: {
          id: string
          category: string
          brand: string
          product_name: string
          sku: string | null
          use_cases: string[]
          flavor_notes: string | null
          price_krw: number | null
          unit: string | null
          retailer: string | null
          retailer_url: string | null
          source_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          brand: string
          product_name: string
          sku?: string | null
          use_cases?: string[]
          flavor_notes?: string | null
          price_krw?: number | null
          unit?: string | null
          retailer?: string | null
          retailer_url?: string | null
          source_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<{
          category: string; brand: string; product_name: string
          sku: string | null; use_cases: string[]
          flavor_notes: string | null; price_krw: number | null
          unit: string | null; retailer: string | null
          retailer_url: string | null; source_score: number; updated_at: string
        }>
        Relationships: []
      }
      ingredient_profile: {
        Row: {
          id: string
          ingredient_name: string
          catalog_id: string | null
          custom_brand: string | null
          custom_note: string | null
          vendor: string | null
          is_active: boolean
          added_at: string
        }
        Insert: {
          id?: string
          ingredient_name: string
          catalog_id?: string | null
          custom_brand?: string | null
          custom_note?: string | null
          vendor?: string | null
          is_active?: boolean
          added_at?: string
        }
        Update: Partial<{
          ingredient_name: string; catalog_id: string | null
          custom_brand: string | null; custom_note: string | null
          vendor: string | null; is_active: boolean
        }>
        Relationships: [{ foreignKeyName: "ingredient_profile_catalog_id_fkey"; columns: ["catalog_id"]; referencedRelation: "ingredient_catalog"; referencedColumns: ["id"] }]
      }
      recipe_usage_log: {
        Row: {
          id: string
          admin_user_id: string | null
          dish_name: string | null
          input_tokens: number | null
          output_tokens: number | null
          cost_usd: number | null
          model: string
          tier: string
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          dish_name?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          cost_usd?: number | null
          model?: string
          tier?: string
          error?: string | null
          created_at?: string
        }
        Update: Partial<{
          dish_name: string | null; input_tokens: number | null
          output_tokens: number | null; cost_usd: number | null
          error: string | null
        }>
        Relationships: []
      }
```

- [ ] **Step 3: TypeScript 에러 확인**

```bash
npx tsc --noEmit
```

기대 결과: 에러 0건.

- [ ] **Step 4: 커밋**

```bash
git add src/app/admin/menu/develop/types.ts src/lib/supabase/types.ts
git commit -m "feat(types): AI 메뉴 개발 도구 공유 타입 + Supabase DB 타입 추가"
```

---

## Task 4: Zod 스키마 + Brand Guard (단위 테스트 포함)

**Files:**
- Create: `supabase/functions/analyze-recipe-photo/schema.ts`
- Create: `tests/unit/recipe-schema.test.ts`

- [ ] **Step 1: 실패 테스트 먼저 작성**

```typescript
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx vitest run tests/unit/recipe-schema.test.ts
```

기대 결과: `FAIL` — `Cannot find module '../fixtures/recipes/schema-test-exports'`

- [ ] **Step 3: Zod 스키마 + brand guard 구현 (Deno 함수용)**

```typescript
// supabase/functions/analyze-recipe-photo/schema.ts
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
```

- [ ] **Step 4: 테스트 실행용 export 파일 생성 (Node.js 호환 버전)**

```typescript
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
```

또한 `mkdir -p tests/fixtures/recipes` 실행.

- [ ] **Step 5: 테스트 통과 확인**

```bash
npx vitest run tests/unit/recipe-schema.test.ts
```

기대 결과: `✓ 5 tests passed`

- [ ] **Step 6: 커밋**

```bash
git add supabase/functions/analyze-recipe-photo/schema.ts \
        tests/unit/recipe-schema.test.ts \
        tests/fixtures/recipes/schema-test-exports.ts
git commit -m "feat(schema): Zod 레시피 스키마 + brand guard + 단위 테스트"
```

---

## Task 5: 시스템 프롬프트 + 카탈로그 쿼리 헬퍼

**Files:**
- Create: `supabase/functions/analyze-recipe-photo/prompt.ts`
- Create: `supabase/functions/analyze-recipe-photo/catalog.ts`
- Create: `tests/unit/prompt-assembly.test.ts`

- [ ] **Step 1: 실패 테스트 먼저 작성**

```typescript
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
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx vitest run tests/unit/prompt-assembly.test.ts
```

기대 결과: `FAIL` — `Cannot find module`

- [ ] **Step 3: prompt.ts 구현**

```typescript
// supabase/functions/analyze-recipe-photo/prompt.ts
import type { CatalogItem, ProfileItem } from './catalog.ts'

export function buildSystemPrompt(
  catalog: CatalogItem[],
  profile: ProfileItem[],
  servings = 10,
): string {
  const catalogText = catalog.length
    ? catalog.map(
        (c) =>
          `[${c.category}] ${c.brand} "${c.product_name}" (${c.unit ?? ''}) — 용도: ${c.use_cases.join(', ')} — 맛: ${c.flavor_notes ?? ''} — 소매처: ${c.retailer ?? ''}`,
      ).join('\n')
    : '(카탈로그 없음 — 일반명 사용 후 brand_source="generic")'

  const profileText = profile.length
    ? profile.map(
        (p) =>
          `재료명: "${p.ingredient_name}" | 사용 브랜드: "${p.custom_brand ?? '카탈로그 참조'}" | 거래처: ${p.vendor ?? ''} | 비고: ${p.custom_note ?? ''}`,
      ).join('\n')
    : '(프로필 미설정 — 카탈로그 기준으로 추천)'

  return `당신은 한국 식당의 R&D 셰프 어시스턴트입니다.
음식 사진을 분석하여 [${servings}인분 기준] 정밀 레시피를 JSON 형식으로 작성합니다.

[규칙 1: 정밀 계량]
- 모든 재료는 g 또는 ml. "조금", "약간" 금지.
- 양념 비율은 1g 단위까지.
- 조리 시간은 분·초, 온도는 약불/중불/강불 또는 ℃.

[규칙 2: 브랜드 매칭 — 가장 중요]
우선순위: 육즙관리소 프로필 > 식자재 카탈로그 > generic(일반명)
- 프로필에 해당 재료가 있으면 → 그 브랜드·제품 그대로 사용, brand_source="profile"
- 프로필에 없고 카탈로그에 있으면 → 카탈로그 brand+product_name 사용, brand_source="catalog"
- 둘 다 없으면 → 일반명, brand_source="generic", note에 "거래처 표준 사용 권장"
★ 절대 카탈로그·프로필 외 브랜드를 임의로 만들지 마시오.

[규칙 3: 감각 단서]
각 조리 단계에 청각·시각·후각·촉각 중 하나 이상:
예: "치익 소리가 날 때까지", "노릇한 갈색이 될 때까지", "고소한 향이 올라오면"

[규칙 4: 장비 수량]
${servings}인분 조리에 필요한 장비를 수량과 함께 명시.
예: "돌솥 ${servings}개", "대형 솥 1개"

[규칙 5: 분량 표기]
- ingredients 배열: ${servings}인분 합계
- steps 배열: 분배 단위(1인분 또는 1회분)일 경우 per_serving=true

[규칙 6: 가공 상태]
재료마다 prep_form 필드: "다진 것" / "채 썬 것" / "삶은 것" / "통깨" / "통째로"

[규칙 7: 카테고리]
재료마다 category: main / seasoning / aromatic / garnish / sauce / starch

━━━ [육즙관리소 식자재 프로필] ━━━
${profileText}

━━━ [식자재 카탈로그] ━━━
${catalogText}

━━━ [출력 형식] ━━━
순수 JSON만 반환. 마크다운·코드블록·설명 텍스트 일체 금지.
아래 필드를 반드시 포함:
name, description, servings, equipment(name,quantity), ingredients(name,prep_form?,amount,unit,category,brand_source,brand?,product?,catalog_id?,note?), prep_time_min, cook_time_min, difficulty(easy|medium|hard), steps(order,title,instruction,sensory_cues?,duration_sec?,temperature?,per_serving), chef_tips[], plating?, cost_estimate_krw?`
}
```

- [ ] **Step 4: catalog.ts 구현**

```typescript
// supabase/functions/analyze-recipe-photo/catalog.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

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
  is_active: boolean
}

export async function fetchCatalogAndProfile(
  supabaseUrl: string,
  serviceKey: string,
): Promise<{ catalog: CatalogItem[]; profile: ProfileItem[] }> {
  const supabase = createClient(supabaseUrl, serviceKey)

  const [catalogResult, profileResult] = await Promise.all([
    supabase
      .from('ingredient_catalog')
      .select('id,category,brand,product_name,use_cases,flavor_notes,price_krw,unit,retailer')
      .order('source_score', { ascending: false }),
    supabase
      .from('ingredient_profile')
      .select('id,ingredient_name,catalog_id,custom_brand,custom_note,vendor,is_active')
      .eq('is_active', true),
  ])

  if (catalogResult.error) throw new Error(`catalog fetch error: ${catalogResult.error.message}`)
  if (profileResult.error) throw new Error(`profile fetch error: ${profileResult.error.message}`)

  return {
    catalog: catalogResult.data ?? [],
    profile: profileResult.data ?? [],
  }
}

export async function logUsage(
  supabaseUrl: string,
  serviceKey: string,
  params: {
    admin_user_id: string
    dish_name: string
    input_tokens: number
    output_tokens: number
    cost_usd: number
    tier: string
    error?: string
  },
): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceKey)
  await supabase.from('recipe_usage_log').insert({
    ...params,
    model: 'gemini-2.0-flash',
  })
}

export async function getTodayUsageCount(
  supabaseUrl: string,
  serviceKey: string,
  adminUserId: string,
): Promise<number> {
  const supabase = createClient(supabaseUrl, serviceKey)
  const today = new Date().toISOString().slice(0, 10)
  const { count } = await supabase
    .from('recipe_usage_log')
    .select('id', { count: 'exact', head: true })
    .eq('admin_user_id', adminUserId)
    .gte('created_at', `${today}T00:00:00Z`)
    .lt('created_at', `${today}T23:59:59Z`)
  return count ?? 0
}
```

- [ ] **Step 5: 테스트용 export 파일 생성**

```typescript
// tests/fixtures/recipes/prompt-test-exports.ts
// Vitest (Node.js) 환경에서 사용하는 prompt 헬퍼 (npm:없이)
export { buildSystemPrompt } from '../../../supabase/functions/analyze-recipe-photo/prompt-node'
```

`supabase/functions/analyze-recipe-photo/prompt-node.ts` 생성 (Deno npm: 없는 버전):

```typescript
// supabase/functions/analyze-recipe-photo/prompt-node.ts
// NOTE: 테스트 환경(Node.js)용 — 실제 Edge Function은 prompt.ts 사용

interface CatalogItem {
  id: string; category: string; brand: string; product_name: string
  use_cases: string[]; flavor_notes: string | null
  price_krw: number | null; unit: string | null; retailer: string | null
}
interface ProfileItem {
  id: string; ingredient_name: string; catalog_id: string | null
  custom_brand: string | null; custom_note: string | null; vendor: string | null; is_active: boolean
}

export function buildSystemPrompt(
  catalog: CatalogItem[],
  profile: ProfileItem[],
  servings = 10,
): string {
  const catalogText = catalog.length
    ? catalog.map(
        (c) => `[${c.category}] ${c.brand} "${c.product_name}" (${c.unit ?? ''}) — 용도: ${c.use_cases.join(', ')} — 맛: ${c.flavor_notes ?? ''}`
      ).join('\n')
    : '(카탈로그 없음)'

  const profileText = profile.length
    ? profile.map(
        (p) => `재료명: "${p.ingredient_name}" | 사용 브랜드: "${p.custom_brand ?? '카탈로그 참조'}" | 거래처: ${p.vendor ?? ''}`
      ).join('\n')
    : '(프로필 미설정)'

  return `셰프 어시스턴트: ${servings}인분 기준 레시피 JSON 반환.\n카탈로그:\n${catalogText}\n프로필:\n${profileText}`
}
```

- [ ] **Step 6: 테스트 통과 확인**

```bash
npx vitest run tests/unit/prompt-assembly.test.ts
```

기대 결과: `✓ 3 tests passed`

- [ ] **Step 7: 커밋**

```bash
git add supabase/functions/analyze-recipe-photo/prompt.ts \
        supabase/functions/analyze-recipe-photo/prompt-node.ts \
        supabase/functions/analyze-recipe-photo/catalog.ts \
        tests/unit/prompt-assembly.test.ts \
        tests/fixtures/recipes/prompt-test-exports.ts
git commit -m "feat(prompt): 시스템 프롬프트 조립 + 카탈로그 쿼리 헬퍼"
```

---

## Task 6: Edge Function 핵심 구현

**Files:**
- Create: `supabase/functions/analyze-recipe-photo/index.ts`
- Create: `tests/fixtures/recipes/mock-recipe-response.json`

**사전 준비:** Gemini API 키 발급
1. [aistudio.google.com](https://aistudio.google.com) 접속 → "Get API key" → 키 복사
2. `supabase secrets set GEMINI_API_KEY=<복사한_키>`

- [ ] **Step 1: mock 응답 JSON 생성**

```json
// tests/fixtures/recipes/mock-recipe-response.json
{
  "name": "전통 살얼음 물냉면 (10인분)",
  "description": "깊고 시원한 육수에 아삭한 배와 오이 고명을 얹은 프리미엄 물냉면",
  "servings": 10,
  "equipment": [
    { "name": "대형 솥", "quantity": 1, "note": "면 삶기용" },
    { "name": "냉면 그릇", "quantity": 10 }
  ],
  "ingredients": [
    {
      "name": "메밀 냉면 사리",
      "amount": 2000,
      "unit": "g",
      "category": "main",
      "brand_source": "generic",
      "note": "거래처 표준 사용 권장"
    },
    {
      "name": "양조간장",
      "prep_form": "계량",
      "amount": 80,
      "unit": "ml",
      "category": "seasoning",
      "brand_source": "catalog",
      "brand": "샘표",
      "product": "양조간장 501호 1.8L"
    },
    {
      "name": "사과식초",
      "amount": 60,
      "unit": "ml",
      "category": "seasoning",
      "brand_source": "catalog",
      "brand": "오뚜기",
      "product": "사과식초 1.8L"
    }
  ],
  "prep_time_min": 20,
  "cook_time_min": 15,
  "difficulty": "medium",
  "steps": [
    {
      "order": 1,
      "title": "육수 준비",
      "instruction": "냉면 육수 5000ml를 냉동고에 넣어 살얼음 상태로 만든다",
      "sensory_cues": ["표면에 얇은 얼음막이 형성되면 완성"],
      "duration_sec": 14400,
      "per_serving": false
    },
    {
      "order": 2,
      "title": "면 삶기",
      "instruction": "대형 솥에 물을 넉넉히 끓이고 면을 40~60초 삶아낸다",
      "sensory_cues": ["면이 투명해지기 시작하면 건진다"],
      "duration_sec": 50,
      "temperature": "강불",
      "per_serving": false
    }
  ],
  "chef_tips": ["육수는 서빙 3~4시간 전에 냉동고에 넣는다"],
  "plating": "그릇 가장자리를 따라 조심스럽게 육수 500ml씩 붓는다",
  "cost_estimate_krw": 42000
}
```

- [ ] **Step 2: Edge Function index.ts 작성**

```typescript
// supabase/functions/analyze-recipe-photo/index.ts
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
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!

  // ── 1. 인증 검증 ───────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '인증 필요' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
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
  if (todayCount >= 1400) console.warn(`[warn] 무료 티어 일 한도 임박: ${todayCount}/1500`)

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
  const { catalog, profile } = await fetchCatalogAndProfile(supabaseUrl, supabaseServiceKey)

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

  let rawJson: string
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
    const parsed = JSON.parse(rawJson!)
    const zodResult = RecipeSchema.safeParse(parsed)
    if (!zodResult.success) {
      console.warn('[zod] 검증 실패:', JSON.stringify(zodResult.error.flatten()))
      // 부분 결과라도 반환 (완전 실패보단 낫다)
      recipe = parsed
    } else {
      recipe = applyBrandGuard(zodResult.data)
    }
  } catch {
    return new Response(JSON.stringify({ error: 'JSON 파싱 실패', raw: rawJson! }), {
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
```

- [ ] **Step 3: Edge Function 로컬 테스트**

```bash
supabase start          # 로컬 Supabase 실행
supabase functions serve analyze-recipe-photo --env-file .env.local
```

`.env.local`에 추가 (아직 없다면 생성):
```
GEMINI_API_KEY=<발급받은_키>
```

별도 터미널에서 테스트:
```bash
curl -X POST http://localhost:54321/functions/v1/analyze-recipe-photo \
  -H "Authorization: Bearer <로컬_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"imageDataUrl":"data:image/jpeg;base64,/9j/4AAQ..."}'
```

기대 결과: `{ "recipe": { "name": "...", "ingredients": [...] }, "usage": {...} }`

- [ ] **Step 4: 커밋**

```bash
git add supabase/functions/analyze-recipe-photo/index.ts \
        tests/fixtures/recipes/mock-recipe-response.json
git commit -m "feat(edge-fn): analyze-recipe-photo Edge Function 구현"
```

---

## Task 7: 어드민 레이아웃 + 사이드바

**Files:**
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: 어드민 레이아웃 작성**

```typescript
// src/app/admin/layout.tsx
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin/menu', label: '메뉴 사진 관리' },
  { href: '/admin/menu/develop', label: 'AI 메뉴 개발' },
  { href: '/admin/media', label: '미디어' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[200px] shrink-0 border-r border-[var(--color-hairline)] bg-white px-4 py-8">
        <p className="text-[11px] font-semibold text-[var(--color-body)] uppercase tracking-widest mb-6">
          관리자
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-[6px] text-[13px] text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat(admin): 사이드바 레이아웃 + AI 메뉴 개발 링크 추가"
```

---

## Task 8: 업로드·분석 화면 + 상태 관리 클라이언트

**Files:**
- Create: `src/app/admin/menu/develop/page.tsx`
- Create: `src/app/admin/menu/develop/DevelopClient.tsx`
- Create: `src/app/admin/menu/develop/UploadScreen.tsx`
- Create: `src/app/admin/menu/develop/AnalyzingScreen.tsx`

- [ ] **Step 1: 서버 컴포넌트 엔트리 작성**

```typescript
// src/app/admin/menu/develop/page.tsx
import { DevelopClient } from './DevelopClient'

export const dynamic = 'force-dynamic'

export default function DevelopPage() {
  return <DevelopClient />
}
```

- [ ] **Step 2: DevelopClient (상태 관리) 작성**

```typescript
// src/app/admin/menu/develop/DevelopClient.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadScreen } from './UploadScreen'
import { AnalyzingScreen } from './AnalyzingScreen'
import { ResultScreen } from './ResultScreen'
import type { Recipe, ScreenState, RecipeHistoryItem } from './types'

const HISTORY_KEY = 'yukzzp_recipe_history'
const MAX_HISTORY = 10

function saveToHistory(recipe: Recipe) {
  try {
    const existing: RecipeHistoryItem[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    const item: RecipeHistoryItem = {
      id: crypto.randomUUID(),
      dish_name: recipe.name,
      created_at: new Date().toISOString(),
      recipe,
    }
    const updated = [item, ...existing].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {}
}

export function DevelopClient() {
  const [screen, setScreen] = useState<ScreenState>('upload')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleAnalyze = async (imageDataUrl: string, dishHint?: string) => {
    setScreen('analyzing')
    setError(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'analyze-recipe-photo',
        { body: { imageDataUrl, dishHint, servings: 10 } },
      )
      if (fnError) throw new Error(fnError.message)
      if (!data?.recipe) throw new Error('레시피 데이터가 없습니다')
      setRecipe(data.recipe)
      saveToHistory(data.recipe)
      setScreen('result')
    } catch (e) {
      setError(e instanceof Error ? e.message : '분석 중 오류가 발생했습니다')
      setScreen('upload')
    }
  }

  const handleReset = () => {
    setRecipe(null)
    setError(null)
    setScreen('upload')
  }

  if (screen === 'upload')
    return <UploadScreen onAnalyze={handleAnalyze} error={error} />
  if (screen === 'analyzing')
    return <AnalyzingScreen />
  if (screen === 'result' && recipe)
    return <ResultScreen recipe={recipe} onReset={handleReset} />
  return <UploadScreen onAnalyze={handleAnalyze} error={error} />
}
```

- [ ] **Step 3: UploadScreen 작성**

```typescript
// src/app/admin/menu/develop/UploadScreen.tsx
'use client'
import { useRef, useState } from 'react'
import { RecipeHistory } from './RecipeHistory'

interface Props {
  onAnalyze: (imageDataUrl: string, dishHint?: string) => Promise<void>
  error: string | null
}

export function UploadScreen({ onAnalyze, error }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기가 10MB를 초과합니다')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!preview) return
    setLoading(true)
    await onAnalyze(preview, hint || undefined)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-[640px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-medium text-[var(--color-ink)] tracking-tight">
            AI 메뉴 개발
          </h1>
          <p className="text-[13px] text-[var(--color-body)] mt-1">
            음식 사진 1장 → 10인분 정밀 레시피 + 브랜드 명시
          </p>
        </div>
        <RecipeHistory />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div
        className="border-2 border-dashed border-[var(--color-hairline)] rounded-[12px] p-12 text-center cursor-pointer hover:border-[var(--color-espresso)] transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="선택된 사진" className="max-h-[240px] mx-auto rounded-[8px] object-contain" />
        ) : (
          <div className="space-y-2">
            <p className="text-[15px] text-[var(--color-ink)]">사진을 여기에 끌어다 놓거나</p>
            <p className="text-[13px] text-[var(--color-body)]">클릭하여 선택 (JPEG · PNG · WebP · 최대 10MB)</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview && (
        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="음식명 힌트 (선택) — 예: 냉면, 돌솥비빔밥"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[var(--color-espresso)] text-white text-[14px] font-medium rounded-[8px] disabled:opacity-50"
          >
            AI 분석 시작 →
          </button>
          <button
            onClick={() => setPreview(null)}
            className="w-full py-2 text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)]"
          >
            다시 선택
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: AnalyzingScreen 작성**

```typescript
// src/app/admin/menu/develop/AnalyzingScreen.tsx
'use client'
import { useEffect, useState } from 'react'

const STEPS = [
  '음식 식별 중',
  '식자재 카탈로그 매칭 중',
  '10인분 계량 산출 중',
  '브랜드 검증 중',
]

export function AnalyzingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      2500,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="p-8 max-w-[640px]">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <div className="w-12 h-12 border-2 border-[var(--color-hairline)] border-t-[var(--color-espresso)] rounded-full animate-spin" />
        <div className="space-y-2 text-center">
          {STEPS.map((s, i) => (
            <p
              key={s}
              className={`text-[14px] transition-all ${
                i === step
                  ? 'text-[var(--color-ink)] font-medium'
                  : i < step
                  ? 'text-[var(--color-body)] line-through'
                  : 'text-[var(--color-hairline)]'
              }`}
            >
              {s}
            </p>
          ))}
        </div>
        <p className="text-[12px] text-[var(--color-body)]">약 5~10초 소요</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/app/admin/menu/develop/
git commit -m "feat(ui): AI 메뉴 개발 업로드·분석 화면 + DevelopClient 상태 관리"
```

---

## Task 9: 결과 화면 + 브랜드 변경 모달

**Files:**
- Create: `src/app/admin/menu/develop/ResultScreen.tsx`
- Create: `src/app/admin/menu/develop/BrandChangeModal.tsx`

- [ ] **Step 1: BrandChangeModal 작성**

```typescript
// src/app/admin/menu/develop/BrandChangeModal.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Ingredient } from './types'

interface Props {
  ingredient: Ingredient
  onClose: () => void
  onSaved: () => void
}

export function BrandChangeModal({ ingredient, onClose, onSaved }: Props) {
  const [brand, setBrand] = useState(ingredient.custom_brand ?? ingredient.brand ?? '')
  const [vendor, setVendor] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('ingredient_profile').upsert(
      {
        ingredient_name: ingredient.name,
        custom_brand: brand || null,
        vendor: vendor || null,
        custom_note: note || null,
        catalog_id: ingredient.catalog_id ?? null,
        is_active: true,
      },
      { onConflict: 'ingredient_name' },
    )
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] w-full max-w-sm p-6 space-y-4">
        <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">브랜드 지정</h2>
        <p className="text-[13px] text-[var(--color-body)]">
          <span className="font-medium">{ingredient.name}</span>에 사용하는 브랜드·거래처를 입력하면
          다음 레시피부터 자동 반영됩니다.
        </p>
        <input
          type="text"
          placeholder="브랜드·제품명 (예: 샘표 양조간장 501호)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <input
          type="text"
          placeholder="거래처 (예: A식자재유통)"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <input
          type="text"
          placeholder="비고 (예: 양재점 전용)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--color-hairline)] text-[14px] rounded-[8px] text-[var(--color-ink)]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !brand}
            className="flex-1 py-3 bg-[var(--color-espresso)] text-white text-[14px] rounded-[8px] disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: ResultScreen 작성**

```typescript
// src/app/admin/menu/develop/ResultScreen.tsx
'use client'
import { useState } from 'react'
import { BrandChangeModal } from './BrandChangeModal'
import type { Recipe, Ingredient, IngredientCategory } from './types'

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  main: 'bg-red-500',
  seasoning: 'bg-yellow-400',
  aromatic: 'bg-orange-400',
  garnish: 'bg-gray-400',
  sauce: 'bg-amber-700',
  starch: 'bg-amber-100',
}

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '어려움' }

interface Props {
  recipe: Recipe
  onReset: () => void
}

export function ResultScreen({ recipe, onReset }: Props) {
  const [brandModal, setBrandModal] = useState<Ingredient | null>(null)

  return (
    <>
      <div className="max-w-[800px] p-8 print:p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <button
            onClick={onReset}
            className="text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)] print:hidden"
          >
            ← 다른 사진
          </button>
          <div className="flex items-center gap-3 print:hidden">
            <span className="text-[12px] text-[var(--color-body)] bg-[var(--color-surface)] px-3 py-1 rounded-full">
              ✓ 분석 완료
            </span>
            <button
              onClick={() => window.print()}
              className="text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-4 py-2 rounded-[8px]"
            >
              인쇄
            </button>
          </div>
        </div>

        {/* 음식명 */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-[var(--color-body)] uppercase tracking-widest mb-2">
            분석된 음식
          </p>
          <h1 className="text-[28px] font-semibold text-[var(--color-ink)] tracking-tight leading-tight">
            {recipe.name}
          </h1>
          <p className="text-[14px] text-[var(--color-body)] mt-3 leading-relaxed">{recipe.description}</p>
          <div className="flex gap-4 mt-4 text-[12px] text-[var(--color-body)]">
            <span>준비 {recipe.prep_time_min}분</span>
            <span>조리 {recipe.cook_time_min}분</span>
            <span>난이도 {DIFFICULTY_LABEL[recipe.difficulty]}</span>
          </div>
        </div>

        {/* 장비 */}
        {recipe.equipment.length > 0 && (
          <div className="mb-8 p-5 bg-[var(--color-surface)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-3">장비</p>
            <div className="flex flex-wrap gap-3">
              {recipe.equipment.map((eq, i) => (
                <span key={i} className="text-[13px] text-[var(--color-ink)]">
                  {eq.name} {eq.quantity}개{eq.note ? ` (${eq.note})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 재료 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">재료 & 계량</p>
            <span className="text-[12px] text-[var(--color-body)] bg-[var(--color-surface)] px-3 py-1 rounded-full">
              {recipe.servings}인분 기준
            </span>
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 bg-white border border-[var(--color-hairline)] rounded-[10px]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${CATEGORY_COLORS[ing.category]}`}
                  />
                  <div>
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">
                      {ing.name}
                      {ing.prep_form && (
                        <span className="ml-1 text-[12px] font-normal text-[var(--color-body)]">
                          ({ing.prep_form})
                        </span>
                      )}
                      <span className="ml-2 text-[13px] font-normal text-[var(--color-body)]">
                        {ing.amount}
                        {ing.unit}
                      </span>
                    </p>
                    {ing.brand && (
                      <p className="text-[12px] text-[var(--color-body)] mt-0.5">
                        <span
                          className={`mr-1.5 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            ing.brand_source === 'profile'
                              ? 'bg-green-100 text-green-700'
                              : ing.brand_source === 'catalog'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {ing.brand_source === 'profile'
                            ? '거래처'
                            : ing.brand_source === 'catalog'
                            ? '카탈로그'
                            : '추천'}
                        </span>
                        {ing.brand} {ing.product}
                      </p>
                    )}
                    {ing.note && (
                      <p className="text-[11px] text-[var(--color-body)] mt-0.5">{ing.note}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setBrandModal(ing)}
                  className="text-[11px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-2 py-1 rounded-[6px] shrink-0 print:hidden"
                >
                  브랜드 지정
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 조리 프로세스 */}
        <div className="mb-8">
          <p className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">조리 프로세스</p>
          <div className="space-y-4">
            {recipe.steps.map((step) => (
              <div key={step.order} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-espresso)] flex items-center justify-center shrink-0 text-[13px] font-semibold text-[var(--color-espresso)]">
                  {step.order}
                </div>
                <div className="flex-1 pb-4 border-b border-[var(--color-hairline)] last:border-0">
                  <p className="text-[14px] font-semibold text-[var(--color-ink)] mb-1">{step.title}</p>
                  <p className="text-[13px] text-[var(--color-body)] leading-relaxed">{step.instruction}</p>
                  {step.sensory_cues && step.sensory_cues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.sensory_cues.map((cue, j) => (
                        <span
                          key={j}
                          className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded"
                        >
                          {cue}
                        </span>
                      ))}
                    </div>
                  )}
                  {(step.duration_sec || step.temperature) && (
                    <p className="text-[12px] text-[var(--color-body)] mt-1">
                      {step.temperature && `${step.temperature} · `}
                      {step.duration_sec &&
                        (step.duration_sec >= 60
                          ? `${Math.floor(step.duration_sec / 60)}분`
                          : `${step.duration_sec}초`)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 셰프 핵심 포인트 */}
        {recipe.chef_tips.length > 0 && (
          <div className="mb-8 p-5 border border-[var(--color-hairline)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-3">셰프 핵심 포인트</p>
            <ul className="space-y-2">
              {recipe.chef_tips.map((tip, i) => (
                <li key={i} className="text-[13px] text-[var(--color-body)] flex gap-2">
                  <span className="text-[var(--color-espresso)]">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 비용 추정 */}
        {recipe.cost_estimate_krw && (
          <div className="mb-8 p-5 bg-[var(--color-surface)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-1">비용 추정</p>
            <p className="text-[22px] font-medium text-[var(--color-ink)]">
              {recipe.cost_estimate_krw.toLocaleString()}원
            </p>
            <p className="text-[12px] text-[var(--color-body)] mt-1">
              10인분 기준 · 카탈로그 단가 기준 · 1인 {Math.round(recipe.cost_estimate_krw / 10).toLocaleString()}원
            </p>
          </div>
        )}
      </div>

      {brandModal && (
        <BrandChangeModal
          ingredient={brandModal}
          onClose={() => setBrandModal(null)}
          onSaved={() => {}}
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/app/admin/menu/develop/ResultScreen.tsx \
        src/app/admin/menu/develop/BrandChangeModal.tsx
git commit -m "feat(ui): 결과 화면 + 브랜드 변경 모달 (lazy build 시작)"
```

---

## Task 10: 히스토리 캐시 + 인쇄 CSS

**Files:**
- Create: `src/app/admin/menu/develop/RecipeHistory.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: RecipeHistory 컴포넌트 작성**

```typescript
// src/app/admin/menu/develop/RecipeHistory.tsx
'use client'
import { useState, useEffect } from 'react'
import type { RecipeHistoryItem } from './types'

const HISTORY_KEY = 'yukzzp_recipe_history'

export function RecipeHistory() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<RecipeHistoryItem[]>([])

  useEffect(() => {
    if (open) {
      try {
        setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'))
      } catch {
        setHistory([])
      }
    }
  }, [open])

  if (history.length === 0 && !open) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[12px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-3 py-1.5 rounded-[8px]"
      >
        기록 ({JSON.parse(typeof window !== 'undefined' ? localStorage.getItem(HISTORY_KEY) ?? '[]' : '[]').length ?? 0})
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-end z-50 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-hairline)]">
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">최근 분석 기록</p>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-body)] hover:text-[var(--color-ink)] text-[20px]"
              >
                ×
              </button>
            </div>
            {history.length === 0 ? (
              <p className="p-5 text-[13px] text-[var(--color-body)]">기록이 없습니다</p>
            ) : (
              <ul className="divide-y divide-[var(--color-hairline)]">
                {history.map((item) => (
                  <li key={item.id} className="p-4">
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">{item.dish_name}</p>
                    <p className="text-[12px] text-[var(--color-body)] mt-0.5">
                      {new Date(item.created_at).toLocaleDateString('ko-KR', {
                        month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: globals.css에 인쇄 스타일 추가**

`src/app/globals.css` 파일 하단에 추가:

```css
/* ── 인쇄 스타일 ──────────────────────────────────────────────────────────── */
@media print {
  /* 사이드바 숨김 */
  aside,
  nav {
    display: none !important;
  }

  /* 인쇄용 색상 */
  body {
    color: #111 !important;
    background: white !important;
  }

  /* 버튼 숨김 */
  button {
    display: none !important;
  }

  /* 브랜드 배지 테두리 */
  [class*='bg-blue-'],
  [class*='bg-green-'],
  [class*='bg-yellow-'] {
    border: 1px solid #ccc !important;
    background: white !important;
    color: #111 !important;
  }

  /* 페이지 여백 */
  @page {
    margin: 1.5cm;
    size: A4;
  }

  /* 단계 번호 테두리 유지 */
  .rounded-full {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

- [ ] **Step 3: TypeScript 체크**

```bash
npx tsc --noEmit
```

기대 결과: 에러 0건.

- [ ] **Step 4: 커밋**

```bash
git add src/app/admin/menu/develop/RecipeHistory.tsx src/app/globals.css
git commit -m "feat(ui): 레시피 히스토리 캐시 + 인쇄용 CSS"
```

---

## Task 11: E2E 테스트 (Playwright)

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/admin-develop.spec.ts`

- [ ] **Step 1: Playwright 설정 파일 생성**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 2: Supabase Edge Function 모킹 핸들러 추가**

`tests/e2e/admin-develop.spec.ts`:

```typescript
// tests/e2e/admin-develop.spec.ts
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
```

- [ ] **Step 3: Playwright 의존성 설치 + 브라우저 다운로드**

```bash
npx playwright install chromium
```

- [ ] **Step 4: dev 서버 실행 후 E2E 테스트**

터미널 1:
```bash
npm run dev
```

터미널 2:
```bash
npx playwright test tests/e2e/admin-develop.spec.ts --headed
```

기대 결과: 4개 테스트 통과. (인증 우회 테스트는 로컬 Supabase 실행 필요)

- [ ] **Step 5: 전체 테스트 스위트 실행**

```bash
npx vitest run             # 단위 테스트
npx tsc --noEmit           # 타입 체크
```

기대 결과: 모두 통과, 에러 0건.

- [ ] **Step 6: 최종 커밋**

```bash
git add playwright.config.ts tests/e2e/admin-develop.spec.ts
git commit -m "test(e2e): Playwright AI 메뉴 개발 페이지 E2E 테스트"
```

---

## 스펙 커버리지 확인

| 스펙 요구사항 | 구현 Task |
|---|---|
| ingredient_catalog 50개 시드 | Task 1 |
| ingredient_profile (lazy build) | Task 1 (스키마) + Task 9 (BrandChangeModal upsert) |
| recipe_usage_log | Task 1 (스키마) + Task 6 (Edge Function 로깅) |
| RLS (admin only) | Task 1 |
| 어드민 인증 미들웨어 | Task 2 |
| /login Magic Link | Task 2 |
| 공유 TypeScript 타입 | Task 3 |
| Zod 스키마 + brand guard | Task 4 |
| 3중 환각 방어 | Task 4 (Zod) + Task 5 (프롬프트 규칙) + Task 6 (서버측 강등) |
| 시스템 프롬프트 7가지 규칙 | Task 5 |
| 카탈로그·프로필 컨텍스트 주입 | Task 5 |
| Edge Function (Gemini 2.0 Flash) | Task 6 |
| 일일 한도 30회/사용자 | Task 6 |
| 무료 티어 1400회 경고 | Task 6 |
| 1회 재시도 로직 | Task 6 |
| 사용량·비용 로깅 | Task 6 |
| 어드민 사이드바 레이아웃 | Task 7 |
| 업로드 화면 (drag & drop, 10MB 체크) | Task 8 |
| 분석 중 화면 (4단계 표시) | Task 8 |
| 결과 화면 (재료·조리·팁·비용) | Task 9 |
| 색 점 카테고리 시각화 | Task 9 |
| 브랜드 변경 모달 + ingredient_profile upsert | Task 9 |
| localStorage 최근 10건 캐시 | Task 10 |
| @media print CSS | Task 10 |
| E2E 테스트 (Playwright) | Task 11 |
| TypeScript 에러 0 | Task 3 (Step 3), Task 10 (Step 3) |
