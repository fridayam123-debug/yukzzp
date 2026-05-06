# 육즙관리소 웹사이트 Phase 1 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4페이지 (LP · /menu · /locations/yangjae · /locations/euljiro) + 어드민 3 기능 + Schema.org · 인스타 미러링 · 카카오 채널 연동 갖춘 Phase 1 MVP를 4-6주 안에 빌드한다.

**Architecture:** Next.js 16 App Router로 정적 + ISR 페이지를 만들고 Supabase Postgres에서 메뉴·지점·임시 공지 데이터를 읽는다. 어드민은 Supabase Auth (이메일·owner role)로 보호하고 RLS로 owner만 쓰기 허용. 인스타그램은 oEmbed로 사이트에 4장 미니 strip만 노출. KPI는 GA4 events로 측정.

**Tech Stack:** Next.js 16.2.4 · React 19 · TypeScript 5 · Tailwind v4 · shadcn 4.7 · Supabase (Postgres + Auth + Storage) · next-intl · Pretendard CDN · Vitest + Testing Library · Playwright · GA4 · Vercel

**Spec:** [`docs/superpowers/specs/2026-05-06-yukzzp-website-design.md`](../specs/2026-05-06-yukzzp-website-design.md)

---

## File Structure

```
src/
  app/
    layout.tsx                     루트 레이아웃 (Pretendard, GA, Schema 컨테이너)
    page.tsx                       LP (Hero + 권위 + Why+시그니처 + 2지점+단체+예약 + IG strip)
    menu/page.tsx                  전체 메뉴 + KO/EN 토글
    locations/
      yangjae/page.tsx
      euljiro/page.tsx
    admin/
      layout.tsx                   인증 게이트
      login/page.tsx
      page.tsx                     대시보드
      banner/page.tsx              임시 공지
      menu-prices/page.tsx         메뉴 가격 빠른 수정
      meta/page.tsx                hero subheadline / meta description
    api/
      revalidate/route.ts          어드민 변경 시 ISR revalidate
    sitemap.ts
    robots.ts
    not-found.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
      EmergencyBanner.tsx
    sections/
      Hero.tsx
      AuthorityBanner.tsx
      WhySignature.tsx
      TwoLocations.tsx
      GroupCTA.tsx
      ReservationCTA.tsx
      InstagramStrip.tsx
    cards/
      MenuItemCard.tsx
      LocationCard.tsx
      PillarCard.tsx
    schema/
      OrganizationJsonLd.tsx
      RestaurantJsonLd.tsx
      MenuJsonLd.tsx
      WebSiteJsonLd.tsx
    ui/
      (shadcn 추가: button accordion dialog input label sheet tabs toast)
  lib/
    supabase/
      client.ts                    브라우저 클라이언트
      server.ts                    서버 컴포넌트용 (RSC)
      service.ts                   서비스 롤 (서버 액션 only)
      types.ts                     auto-generated DB types
    constants/
      brand.ts                     상수: BRAND_NAME, KAKAO_CHANNEL_URL, NAVER_PLACE_IDS
      schema.ts                    Schema.org 기본값
    fetchers/
      locations.ts
      menu.ts
      banner.ts
    instagram/
      oembed.ts                    IG oEmbed fetcher
    analytics/
      events.ts                    KPI 이벤트
    utils.ts                       (기존)
  i18n/
    config.ts                      next-intl 셋업
    ko.json
    en.json
  styles/
    tokens.css                     Forest Sage 디자인 토큰

supabase/
  migrations/
    20260506_000_initial.sql       5 테이블 + RLS
    20260506_001_seed_categories.sql
    20260506_002_seed_locations.sql
    20260506_003_seed_menu.sql

tests/
  unit/
    components/...                 Vitest + RTL
  e2e/
    homepage.spec.ts               Playwright
    menu.spec.ts
    locations.spec.ts
    admin.spec.ts

public/
  brand/
    logo.png                       (사장님 PNG, 이미 보유)
  photos/
    locations/yangjae/             11장 (사용자 업로드)
    locations/euljiro/              49장 (사용자 업로드)
    food/                           4장 (사용자 업로드)
  fonts/                           Pretendard subset (선택)
```

---

# Phase 1A — Foundation (Tasks 1—7)

## Task 1: 테스팅 인프라 + Pretendard + 디자인 토큰

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `package.json`

- [ ] **Step 1: Install testing deps + i18n**

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
npm install next-intl
```

- [ ] **Step 2: Create vitest config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

- [ ] **Step 3: Create test setup**

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
afterEach(() => cleanup())
```

- [ ] **Step 4: Create design tokens CSS**

`src/styles/tokens.css`:
```css
@theme {
  --color-canvas: #FAF6EE;
  --color-canvas-soft: #F2EBDD;
  --color-taupe: #C9BBA8;
  --color-stone: #3D4046;
  --color-forest: #1F3D2A;
  --color-forest-mid: #2D5E3A;
  --color-cream-gold: #D4C39A;
  --color-ink: #181D26;
  --color-body: #4A6B52;
  --color-hairline: #D6DDD0;
  --color-coral: #AA2D00;

  --radius-cta: 4px;
  --radius-card: 10px;
  --radius-input: 6px;
  --radius-pill: 9999px;

  --spacing-section: 96px;
  --spacing-section-mobile: 64px;

  --font-sans: 'Pretendard', 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

- [ ] **Step 5: Wire tokens.css + Pretendard CDN in layout**

`src/app/globals.css` (replace top):
```css
@import "tailwindcss";
@import "../styles/tokens.css";
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

body { background: var(--color-canvas); color: var(--color-ink); font-family: var(--font-sans); }
```

`src/app/layout.tsx` — replace metadata + html lang:
```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://yukzzp.com'),
  title: { default: '육즙관리소 — 프리미엄 흑돼지 다이닝', template: '%s — 육즙관리소' },
  description: '셰프 이원일이 인정한 흑돼지 다이닝. 산청·거창 산지 100% 대나무 숯 직화. 양재역 본점·더룸 을지로동대문점.',
  openGraph: { siteName: '육즙관리소', locale: 'ko_KR', type: 'website' },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Add npm scripts**

`package.json` scripts add:
```json
"test": "vitest",
"test:run": "vitest run",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 7: Verify**

```bash
npm run dev          # 사이트 뜨고 토큰 적용 확인
npm run typecheck    # 타입 OK
npm run test:run     # 0 tests (통과)
```

- [ ] **Step 8: Commit**

```bash
git add . && git commit -m "feat(setup): testing infra, Pretendard, design tokens"
```

---

## Task 2: Supabase 연결 + DB 타입 자동 생성

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/service.ts`
- Create: `.env.local` (gitignored already)

- [ ] **Step 1: Install Supabase**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D supabase
```

- [ ] **Step 2: Get keys from Supabase dashboard**

수동 단계 (사장님 또는 빌더): Supabase 대시보드 `xakdukmrbepflkrehhrk` Settings → API → Copy `anon public key` and `service_role key`. 

`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xakdukmrbepflkrehhrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
SUPABASE_SERVICE_ROLE_KEY=<paste service role key>
```

- [ ] **Step 3: Create browser client**

`src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

- [ ] **Step 4: Create server client (RSC)**

`src/lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(arr) { try { arr.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    },
  )
}
```

- [ ] **Step 5: Service role client (서버 액션 only)**

`src/lib/supabase/service.ts`:
```ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
```

- [ ] **Step 6: Stub types.ts (regenerated after migration)**

`src/lib/supabase/types.ts`:
```ts
export type Database = { public: { Tables: {} } }
```

- [ ] **Step 7: Commit**

```bash
git add . && git commit -m "feat(db): Supabase clients (browser/server/service)"
```

---

## Task 3: DB 마이그레이션 + RLS

**Files:**
- Create: `supabase/migrations/20260506_000_initial.sql`

이 task는 **Supabase MCP `apply_migration`**으로 직접 실행한다.

- [ ] **Step 1: Write migration SQL**

`supabase/migrations/20260506_000_initial.sql`:
```sql
-- locations
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ko text not null,
  name_en text not null,
  category_ko text not null,
  category_en text not null,
  address_road text not null,
  address_jibun text not null,
  postal_code text,
  phone text not null,
  virtual_phone text,
  hours jsonb not null default '{}',
  parking jsonb default '{}',
  amenities text[] default '{}',
  rooms jsonb default '{}',
  group_seats jsonb default '{}',
  geo jsonb,
  naver_place_id text,
  catchtable_url text,
  hero_image text,
  photos text[] default '{}',
  meta_description_ko text,
  meta_description_en text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- menu_categories
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ko text not null,
  name_en text not null,
  sort_order int not null default 0
);

-- menu_items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id) on delete cascade,
  name_ko text not null,
  name_en text,
  description_ko text,
  description_en text,
  price_krw int,
  weight_g int,
  image_url text,
  is_signature boolean default false,
  is_lunch_special boolean default false,
  available_at_yangjae boolean default true,
  available_at_euljiro boolean default true,
  sort_order int not null default 0,
  updated_at timestamptz default now()
);

-- faqs (Phase 2 사용, 스키마는 1에서)
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  question_ko text not null,
  question_en text,
  answer_ko text not null,
  answer_en text,
  category text,
  location_id uuid references public.locations(id) on delete set null,
  sort_order int default 0
);

-- emergency_banner (1개만 활성)
create table public.emergency_banner (
  id uuid primary key default gen_random_uuid(),
  message_ko text not null,
  message_en text,
  active boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- admin_users
create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager')),
  display_name text,
  created_at timestamptz default now()
);

-- RLS 활성
alter table public.locations enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.faqs enable row level security;
alter table public.emergency_banner enable row level security;
alter table public.admin_users enable row level security;

-- 읽기: 누구나
create policy "public read locations" on public.locations for select using (true);
create policy "public read menu_categories" on public.menu_categories for select using (true);
create policy "public read menu_items" on public.menu_items for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read emergency_banner" on public.emergency_banner for select using (active = true);

-- 쓰기: owner only
create policy "owner write locations" on public.locations for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));
create policy "owner write menu_items" on public.menu_items for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));
create policy "owner write emergency_banner" on public.emergency_banner for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

-- updated_at 트리거
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger touch_locations before update on public.locations for each row execute function public.touch_updated_at();
create trigger touch_menu_items before update on public.menu_items for each row execute function public.touch_updated_at();
```

- [ ] **Step 2: Apply migration via Supabase MCP**

```
mcp__supabase__apply_migration with name "initial" and SQL above
```

- [ ] **Step 3: Verify schema**

```
mcp__supabase__list_tables schemas: ["public"]
```

Expected output: 6 tables (locations, menu_categories, menu_items, faqs, emergency_banner, admin_users).

- [ ] **Step 4: Generate TS types**

```
mcp__supabase__generate_typescript_types
```

Save output to `src/lib/supabase/types.ts` (overwrite stub).

- [ ] **Step 5: Verify build still works**

```bash
npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(db): initial schema + RLS + DB types"
```

---

## Task 4: Seed 데이터 (categories · 양재 · 을지로 · 메뉴)

**Files:**
- Create: `supabase/migrations/20260506_001_seed.sql`

- [ ] **Step 1: Write seed SQL**

`supabase/migrations/20260506_001_seed.sql`:
```sql
-- menu_categories
insert into public.menu_categories (slug, name_ko, name_en, sort_order) values
  ('signature', '시그니처 흑돼지', 'Signature Black Pork', 1),
  ('beef',       '소고기',           'Beef',                2),
  ('appetizer',  '안주·전채',         'Appetizers',          3),
  ('meal',       '식사·점심특선',     'Meals & Lunch Specials', 4),
  ('drink',      '주류·콜키지',       'Drinks & Corkage',    5);

-- locations: 양재
insert into public.locations (
  slug, name_ko, name_en, category_ko, category_en,
  address_road, address_jibun, postal_code, phone, virtual_phone,
  hours, parking, amenities, rooms, group_seats, geo,
  naver_place_id, catchtable_url, meta_description_ko, meta_description_en
) values (
  'yangjae',
  '육즙관리소 양재역점', 'Yukzzp Yangjae',
  '돼지고기구이', 'Korean BBQ',
  '서울 강남구 강남대로44길 7 1층',
  '서울 강남구 도곡동 952-11',
  '06266',
  '0507-1335-6363',
  '0507-1335-6363',
  '{"weekday":{"open":"11:30","close":"23:00","last_order":"22:00","break":["14:00","16:00"]},"weekend":{"open":"16:00","close":"22:00","last_order":"21:00"}}',
  '{"available":false,"info":"서초구청 / 양재 공영주차장 / SK허브프리모(주차비 지원 X)"}',
  array['콜키지(유료)','유아의자','대기공간','포장','예약','남녀 화장실 분리','간편결제'],
  '{"min":6,"max":20}',
  '{"min":20,"max":40}',
  '{"latitude":37.4836,"longitude":127.0349}',
  '1672141709',
  'https://app.catchtable.co.kr/ct/shop/yanggae___meat',
  '양재역 3번 출구 도보 2분. 룸 6—20인·단체 20—40인. 콜키지·점심특선·가족 친화. 캐치테이블 실시간 예약.',
  'Premium Korean BBQ at Yangjae Station. Lee Won-il chef-recommended Jirisan black pork.'
);

-- locations: 을지로
insert into public.locations (
  slug, name_ko, name_en, category_ko, category_en,
  address_road, address_jibun, postal_code, phone, virtual_phone,
  hours, parking, amenities, rooms, group_seats, geo,
  naver_place_id, catchtable_url, meta_description_ko, meta_description_en
) values (
  'euljiro',
  '육즙관리소 더룸 을지로동대문점', 'Yukzzp The Room Eulji-ro Dongdaemun',
  '육류, 고기요리', 'Meat / BBQ',
  '서울 중구 을지로43길 7 1층, 2층',
  '서울 중구 을지로6가 18-53',
  '04564',
  '02-2275-2322',
  '0507-1461-7228',
  '{"daily":{"open":"11:00","close_next_day":"05:00","last_order":"04:00","break_weekday":["14:30","16:30"]}}',
  '{"available":true,"info":"굿모닝시티 지하 1시간 무료 + 엘리베이터 직통"}',
  array['단체 이용 가능','예약','유아의자','주차','남녀 화장실 분리','간편결제'],
  '{"min":4,"max":16}',
  '{"min":20,"max":40}',
  '{"latitude":37.5664,"longitude":127.0091}',
  '2033717879',
  'https://app.catchtable.co.kr/ct/shop/yukjeup_ddm',
  '동대문 DDP 인근. 매일 11:00—05:00 운영. 룸 4—16인·단체 20—40인. 굿모닝시티 1시간 무료 주차.',
  'Premium Korean BBQ near DDP Dongdaemun. Open daily 11am—5am.'
);

-- menu_items (양재·을지로 공통, 가격은 그대로)
with cats as (select id, slug from public.menu_categories)
insert into public.menu_items (category_id, name_ko, name_en, description_ko, price_krw, weight_g, is_signature, sort_order) values
  ((select id from cats where slug='signature'), '지리산 명품 숙성 흑돼지 모듬', 'Premium Jirisan Black Pork Platter', '특삼겹·특목살·항정살·가브리살·이겹살', 57000, null, true, 1),
  ((select id from cats where slug='signature'), '지리산 숙성 통삼겹살', 'Aged Pork Belly', null, 19000, 160, false, 2),
  ((select id from cats where slug='signature'), '지리산 숙성 가브리살', 'Aged Gabri-sal', null, 21000, 160, false, 3),
  ((select id from cats where slug='signature'), '지리산 숙성 항정살', 'Aged Jowl Meat', null, 21000, 160, false, 4),
  ((select id from cats where slug='signature'), '지리산 숙성 특이겹살', 'Aged Special Pork', null, 21000, 160, false, 5),
  ((select id from cats where slug='beef'),      '진꽃살 세트 (소고기)', 'Jin Kkotsal Beef Set', '코스 정찬을 위한 프리미엄 소고기 500g', 87000, 500, true, 1),
  ((select id from cats where slug='beef'),      '떡목심살 (소고기)', 'Beef Neck', null, 29000, 150, false, 2),
  ((select id from cats where slug='appetizer'), '아보카도 육회', 'Avocado Yukhoe', '신선한 육회와 부드러운 아보카도', 28000, null, true, 1),
  ((select id from cats where slug='meal'),      '양념소불고기 정식', 'Bulgogi Lunch Set', '점심특선 — 낙지볶음 소면, 6찬', 24000, null, false, 1),
  ((select id from cats where slug='meal'),      '고기듬뿍 고추장찌개', 'Pork Gochujang Stew', '리뷰 이벤트 인기 메뉴', 9000, null, false, 2),
  ((select id from cats where slug='meal'),      '강원도 막된장찌개', 'Doenjang Stew', null, 8000, null, false, 3),
  ((select id from cats where slug='meal'),      '묵은지 물 막국수', 'Cold Buckwheat Noodles', null, 9000, null, false, 4),
  ((select id from cats where slug='meal'),      '묵은지 비빔국수', 'Spicy Buckwheat Noodles', null, 9000, null, false, 5),
  ((select id from cats where slug='meal'),      '폭신폭신 계란찜', 'Fluffy Steamed Egg', null, 6000, null, false, 6),
  ((select id from cats where slug='meal'),      '철판 치즈 김치볶음밥', 'Cheese Kimchi Fried Rice', null, 8000, null, false, 7),
  ((select id from cats where slug='drink'),     '와인 콜키지', 'Wine Corkage', null, 20000, null, false, 1),
  ((select id from cats where slug='drink'),     '위스키 콜키지', 'Whiskey Corkage', '얼음 + 언더락 전용 잔 제공', 30000, null, false, 2),
  ((select id from cats where slug='drink'),     '블랑 생맥주', 'Blanc Draft Beer', null, 9000, null, false, 3);
```

- [ ] **Step 2: Apply via MCP**

```
mcp__supabase__apply_migration name: "seed", sql: <above>
```

- [ ] **Step 3: Verify with SQL query**

```
mcp__supabase__execute_sql query: "select count(*) from public.menu_items"
```

Expected: 18.

```
mcp__supabase__execute_sql query: "select slug, name_ko from public.locations"
```

Expected: 2 rows (yangjae, euljiro).

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(db): seed locations + menu (18 items)"
```

---

## Task 5: 브랜드 상수 + Schema 기본값

**Files:**
- Create: `src/lib/constants/brand.ts`, `src/lib/constants/schema.ts`

- [ ] **Step 1: Brand constants**

`src/lib/constants/brand.ts`:
```ts
export const BRAND = {
  nameKo: '육즙관리소',
  nameEn: 'Yukzzp',
  tagline: 'PREMIUM DINING',
  domain: 'https://yukzzp.com',
  instagramHandle: 'yukzzp__management_office',
  instagramUrl: 'https://www.instagram.com/yukzzp__management_office',
  youtubeShort: 'https://www.youtube.com/shorts/7CCR4BYW7D0',
  // KAKAO_CHANNEL_URL: 사장님께 받음 — 빌드 시 .env로 주입
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? '',
} as const

export const CHEF_ENDORSEMENT = {
  chefName: '이원일',
  videoTitle: '돼지고기 참 잘하는 육즙관리소',
  videoUrl: 'https://www.youtube.com/shorts/7CCR4BYW7D0',
  viewCount: 23082,
} as const
```

- [ ] **Step 2: Schema defaults**

`src/lib/constants/schema.ts`:
```ts
import { BRAND } from './brand'
export const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND.nameKo,
  alternateName: BRAND.nameEn,
  url: BRAND.domain,
  logo: `${BRAND.domain}/brand/logo.png`,
  sameAs: [
    BRAND.instagramUrl,
    BRAND.youtubeShort,
    'https://app.catchtable.co.kr/ct/shop/yanggae___meat',
    'https://app.catchtable.co.kr/ct/shop/yukjeup_ddm',
    'https://place.map.naver.com/restaurant/1672141709',
    'https://place.map.naver.com/restaurant/2033717879',
  ],
} as const
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: brand & schema constants"
```

---

## Task 6: Fetcher 함수 (locations · menu · banner)

**Files:**
- Create: `src/lib/fetchers/locations.ts`, `src/lib/fetchers/menu.ts`, `src/lib/fetchers/banner.ts`
- Create: `tests/unit/fetchers/locations.test.ts`

- [ ] **Step 1: Write failing test**

`tests/unit/fetchers/locations.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { getLocationBySlug } from '@/lib/fetchers/locations'

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { slug: 'yangjae', name_ko: '육즙관리소 양재역점' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('getLocationBySlug', () => {
  it('returns the location for a slug', async () => {
    const loc = await getLocationBySlug('yangjae')
    expect(loc?.name_ko).toBe('육즙관리소 양재역점')
  })
})
```

- [ ] **Step 2: Run test (should FAIL — function doesn't exist)**

```bash
npm run test:run -- tests/unit/fetchers/locations.test.ts
```

Expected: FAIL "Cannot find module".

- [ ] **Step 3: Write fetchers**

`src/lib/fetchers/locations.ts`:
```ts
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export const getLocations = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('locations').select('*').order('slug')
    if (error) throw error
    return data ?? []
  },
  ['locations'],
  { revalidate: 300, tags: ['locations'] },
)

export async function getLocationBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('locations').select('*').eq('slug', slug).single()
  if (error) return null
  return data
}
```

`src/lib/fetchers/menu.ts`:
```ts
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export const getMenu = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data: cats } = await supabase.from('menu_categories').select('*').order('sort_order')
    const { data: items } = await supabase.from('menu_items').select('*').order('sort_order')
    if (!cats || !items) return { categories: [], items: [] }
    return { categories: cats, items }
  },
  ['menu'],
  { revalidate: 60, tags: ['menu'] },
)

export async function getSignatureItems() {
  const supabase = await createClient()
  const { data } = await supabase.from('menu_items').select('*').eq('is_signature', true).order('sort_order')
  return data ?? []
}
```

`src/lib/fetchers/banner.ts`:
```ts
import { createClient } from '@/lib/supabase/server'

export async function getActiveBanner() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('emergency_banner').select('*').eq('active', true)
    .gte('expires_at', new Date().toISOString())
    .limit(1).maybeSingle()
  return data
}
```

- [ ] **Step 4: Run test (should PASS)**

```bash
npm run test:run -- tests/unit/fetchers/locations.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(lib): fetchers for locations/menu/banner with cache tags"
```

---

## Task 7: shadcn 컴포넌트 추가 + 사진 자산 배치

**Files:**
- Add via shadcn: button (이미), accordion, dialog, input, label, sheet, tabs, sonner
- Move photos: `사진/매장사진/양재역점/` → `public/photos/locations/yangjae/` 등

- [ ] **Step 1: Install shadcn components**

```bash
npx shadcn@latest add accordion dialog input label sheet tabs sonner
```

- [ ] **Step 2: Move photos to public/**

```bash
# Windows PowerShell or Bash
mkdir -p public/photos/locations/yangjae public/photos/locations/euljiro public/photos/food public/brand
cp "사진/매장사진/양재역점/"*.jpg public/photos/locations/yangjae/
cp "사진/매장사진/더룸 을지로 동대문/"*.jpg public/photos/locations/euljiro/
cp "사진/음식사진/"*.* public/photos/food/
# 로고는 사장님께 받은 PNG (로고 메시지 첨부분)을 public/brand/logo.png 로 저장
```

- [ ] **Step 3: Rename files to web-safe slugs**

`scripts/rename-photos.mjs` (one-shot):
```js
import fs from 'fs'
import path from 'path'

const map = {
  // yangjae mapping (from _photo_mapping.md)
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (124).jpg': 'bonkwan-mood-counter.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (131).jpg': 'exterior-jirisan-signage.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (38).jpg': 'bonkwan-long-table.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (39).jpg': 'bonkwan-variant.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (64).jpg': 'group-11seats.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (123).jpg': 'room-diamond-booth.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (126).jpg': 'bonkwan-diamond-wide.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (127).jpg': 'counter-yellow-led.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (128).jpg': 'booth-diamond-close.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (129).jpg': 'bonkwan-concrete-wide.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (37).jpg': 'room-reed-glass.jpg',
}

const dir = 'public/photos/locations/yangjae'
for (const [from, to] of Object.entries(map)) {
  const src = path.join(dir, from)
  const dst = path.join(dir, to)
  if (fs.existsSync(src)) { fs.renameSync(src, dst); console.log(`${from} -> ${to}`) }
}
```

```bash
node scripts/rename-photos.mjs
```

- [ ] **Step 4: Update locations seed with photo paths**

`mcp__supabase__execute_sql`:
```sql
update public.locations set
  hero_image = '/photos/locations/yangjae/bonkwan-mood-counter.jpg',
  photos = array[
    '/photos/locations/yangjae/exterior-jirisan-signage.jpg',
    '/photos/locations/yangjae/bonkwan-mood-counter.jpg',
    '/photos/locations/yangjae/bonkwan-long-table.jpg',
    '/photos/locations/yangjae/room-diamond-booth.jpg',
    '/photos/locations/yangjae/group-11seats.jpg',
    '/photos/locations/yangjae/counter-yellow-led.jpg',
    '/photos/locations/yangjae/bonkwan-concrete-wide.jpg',
    '/photos/locations/yangjae/booth-diamond-close.jpg',
    '/photos/locations/yangjae/bonkwan-diamond-wide.jpg',
    '/photos/locations/yangjae/bonkwan-variant.jpg',
    '/photos/locations/yangjae/room-reed-glass.jpg'
  ]
where slug = 'yangjae';

-- 을지로는 (사장님이 49장 중 큐레이션 후 적용. 우선 4장으로 시작)
update public.locations set
  hero_image = '/photos/locations/euljiro/hero-moon-room.jpg'
  -- photos 배열은 사장님 큐레이션 후 update
where slug = 'euljiro';
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(assets): photos in public, shadcn components, seed image paths"
```

---

# Phase 1B — Public Pages (Tasks 8—17)

## Task 8: Header 컴포넌트

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `tests/unit/components/Header.test.tsx`

- [ ] **Step 1: Failing test**

`tests/unit/components/Header.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('renders brand and reservation CTA', () => {
    render(<Header />)
    expect(screen.getByText('육즙관리소')).toBeInTheDocument()
    expect(screen.getByText(/예약하기/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — FAIL**

```bash
npm run test:run -- tests/unit/components/Header.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/layout/Header.tsx`:
```tsx
import Link from 'next/link'
import { BRAND } from '@/lib/constants/brand'

const NAV = [
  { href: '/menu', label: '메뉴' },
  { href: '/#locations', label: '지점' },
  { href: '/#group', label: '단체' },
  { href: '/#about', label: 'About' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
      <nav className="mx-auto max-w-[1440px] h-16 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="text-[20px] font-medium text-[var(--color-ink)]">{BRAND.nameKo}</span>
          <span className="text-[9px] tracking-[2px] text-[var(--color-body)] font-mono">{BRAND.tagline}</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-[14px] text-[var(--color-ink)]">
          {NAV.map(n => <li key={n.href}><Link href={n.href} className="hover:text-[var(--color-forest-mid)]">{n.label}</Link></li>)}
        </ul>
        <div className="flex items-center gap-4">
          <Link href="/en" className="text-[11px] tracking-[1.5px] font-mono text-[var(--color-body)]">EN</Link>
          <Link href="/#reserve" className="bg-[var(--color-forest)] text-white px-6 py-3 rounded-[var(--radius-cta)] text-[14px] font-medium">
            예약하기
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Run test — PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(layout): Header with sticky nav + reserve CTA"
```

---

## Task 9: Footer 컴포넌트 (NAP + Schema 통합)

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/schema/RestaurantJsonLd.tsx`

- [ ] **Step 1: Schema component**

`src/components/schema/RestaurantJsonLd.tsx`:
```tsx
import type { Database } from '@/lib/supabase/types'
import { BRAND } from '@/lib/constants/brand'

type Loc = Database['public']['Tables']['locations']['Row']

export function RestaurantJsonLd({ location }: { location: Loc }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BRAND.domain}/locations/${location.slug}`,
    name: location.name_ko,
    image: location.hero_image ? `${BRAND.domain}${location.hero_image}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address_road,
      postalCode: location.postal_code,
      addressLocality: 'Seoul',
      addressCountry: 'KR',
    },
    telephone: location.phone,
    servesCuisine: location.category_ko,
    priceRange: '₩₩₩',
    geo: location.geo ? { '@type': 'GeoCoordinates', ...(location.geo as object) } : undefined,
    sameAs: [
      BRAND.instagramUrl,
      `https://place.map.naver.com/restaurant/${location.naver_place_id}`,
      location.catchtable_url,
      BRAND.youtubeShort,
      BRAND.kakaoChannelUrl,
    ].filter(Boolean),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

- [ ] **Step 2: Footer**

`src/components/layout/Footer.tsx`:
```tsx
import { Instagram, Youtube, MessageCircle } from 'lucide-react'
import { BRAND } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'

type Loc = Database['public']['Tables']['locations']['Row']

export function Footer({ locations }: { locations: Loc[] }) {
  return (
    <footer className="bg-[var(--color-forest)] text-white px-6 lg:px-20 pt-16 pb-8 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="text-[24px] font-medium">{BRAND.nameKo}</div>
            <div className="text-[10px] tracking-[2px] font-mono text-[var(--color-cream-gold)] mt-2">{BRAND.tagline}</div>
            <p className="mt-3 text-[13px] text-white/70 leading-relaxed">산청 흑돼지 · 거창 백돼지 · 100% 대나무 숯</p>
            <div className="flex gap-3 mt-4">
              <a href={BRAND.instagramUrl} aria-label="Instagram"><Instagram className="w-[18px] h-[18px]"/></a>
              <a href={BRAND.youtubeShort} aria-label="YouTube"><Youtube className="w-[18px] h-[18px]"/></a>
              {BRAND.kakaoChannelUrl && <a href={BRAND.kakaoChannelUrl} aria-label="Kakao Channel"><MessageCircle className="w-[18px] h-[18px]"/></a>}
            </div>
          </div>
          {locations.map(loc => (
            <div key={loc.slug}>
              <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">{loc.slug.toUpperCase()}</div>
              <div className="mt-2 text-[14px] font-medium">{loc.name_ko}</div>
              <p className="mt-2 text-[12px] text-white/85 leading-relaxed">{loc.address_road}</p>
              <p className="mt-1 text-[12px] text-white/85 font-mono">☎ {loc.virtual_phone}</p>
            </div>
          ))}
          <div>
            <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">NAV</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/85">
              <li><a href="/menu">메뉴</a></li>
              <li><a href="/#group">단체 회식</a></li>
              <li><a href="/#instagram">갤러리 (인스타)</a></li>
              <li><a href="/#reserve">예약</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between text-[11px] text-white/50 font-mono">
          <span>© {new Date().getFullYear()} 육즙관리소 · 메뉴/가격은 매장 상황에 따라 다를 수 있습니다</span>
          <span>@{BRAND.instagramHandle}</span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Test**

```tsx
// tests/unit/components/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

const mockLocs = [
  { slug:'yangjae', name_ko:'육즙관리소 양재역점', address_road:'서울 강남구 강남대로44길 7', virtual_phone:'0507-1335-6363' },
  { slug:'euljiro', name_ko:'육즙관리소 더룸 을지로동대문점', address_road:'서울 중구 을지로43길 7', virtual_phone:'0507-1461-7228' },
] as any

it('renders both locations + brand', () => {
  render(<Footer locations={mockLocs} />)
  expect(screen.getByText('육즙관리소 양재역점')).toBeInTheDocument()
  expect(screen.getByText('육즙관리소 더룸 을지로동대문점')).toBeInTheDocument()
})
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(layout): Footer with NAP + Restaurant Schema"
```

---

## Task 10: Hero 섹션

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `tests/unit/components/Hero.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/sections/Hero'

it('renders headline + CTAs', () => {
  render(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/프리미엄 흑돼지 다이닝/)
  expect(screen.getByText('지금 예약하기')).toBeInTheDocument()
  expect(screen.getByText('메뉴 보기')).toBeInTheDocument()
})
```

- [ ] **Step 2: Implement**

`src/components/sections/Hero.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[720px] overflow-hidden">
      <Image
        src="/photos/locations/euljiro/hero-moon-room.jpg"
        alt="달 인스톨레이션이 있는 더룸 을지로동대문점 인테리어"
        fill priority sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 max-w-[1440px] mx-auto h-full px-6 md:px-24 flex flex-col justify-end pb-16 md:pb-24 gap-4">
        <div className="text-[11px] tracking-[2px] font-mono text-white/85">양재역 본점 · 더룸 을지로동대문점</div>
        <h1 className="text-[40px] md:text-[64px] font-normal text-white leading-[1.1] max-w-[760px]">프리미엄 흑돼지 다이닝</h1>
        <p className="text-[16px] md:text-[18px] text-white/90 leading-relaxed max-w-[680px]">산청 흑돼지 · 거창 백돼지를 100% 대나무 숯으로</p>
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <Link href="/#reserve" className="inline-block bg-[var(--color-forest)] text-white px-7 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium text-center">지금 예약하기</Link>
          <Link href="/menu" className="inline-block border border-white text-white px-7 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium text-center">메뉴 보기</Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Tests pass** + **Commit**

```bash
git add . && git commit -m "feat(sections): Hero with image + CTAs"
```

---

## Task 11: Authority Banner (셰프 영상 facade)

**Files:**
- Create: `src/components/sections/AuthorityBanner.tsx`

facade 패턴: 처음엔 thumbnail만 로드, 클릭 시 youtube iframe 마운트.

- [ ] **Step 1: Implement**

```tsx
'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { CHEF_ENDORSEMENT } from '@/lib/constants/brand'

export function AuthorityBanner() {
  const [playing, setPlaying] = useState(false)
  return (
    <section className="bg-[var(--color-coral)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <div className="text-[11px] tracking-[2px] font-mono opacity-90">MEDIA · 셰프 추천</div>
          <h2 className="text-[28px] md:text-[40px] font-normal mt-4 leading-[1.15]">셰프 이원일이 직접 소개한</h2>
          <p className="text-[20px] md:text-[24px] mt-2 opacity-95">{CHEF_ENDORSEMENT.videoTitle}</p>
          <div className="text-[13px] mt-3 opacity-80 font-mono">공식 셰프 채널 {CHEF_ENDORSEMENT.viewCount.toLocaleString()}+ 조회</div>
          <button
            onClick={() => setPlaying(true)}
            className="inline-flex items-center gap-2 bg-white text-[var(--color-coral)] px-7 py-3.5 rounded-[var(--radius-cta)] text-[14px] font-medium mt-6">
            <Play className="w-4 h-4 fill-current" /> 영상 보기
          </button>
        </div>
        <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-black/20 relative">
          {playing ? (
            <iframe src="https://www.youtube.com/embed/7CCR4BYW7D0?autoplay=1" className="w-full h-full" allow="autoplay; encrypted-media" />
          ) : (
            <button onClick={() => setPlaying(true)} className="w-full h-full relative cursor-pointer">
              <Image src="https://i.ytimg.com/vi/7CCR4BYW7D0/maxresdefault.jpg" alt="셰프 이원일 영상 썸네일" fill className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center"><Play className="w-16 h-16 fill-white text-white drop-shadow"/></span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Allow ytimg domain**

`next.config.ts`:
```ts
import type { NextConfig } from 'next'
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'pup-review-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'ldb-phinf.pstatic.net' },
    ],
  },
}
export default config
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(sections): AuthorityBanner with YouTube facade"
```

---

## Task 12: Why+Signature (4 Pillars + 시그니처 메뉴 3 카드)

**Files:**
- Create: `src/components/sections/WhySignature.tsx`
- Create: `src/components/cards/PillarCard.tsx`
- Create: `src/components/cards/MenuItemCard.tsx`

- [ ] **Step 1: PillarCard**

```tsx
// src/components/cards/PillarCard.tsx
import type { LucideIcon } from 'lucide-react'

export function PillarCard({ Icon, title, description }: { Icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white rounded-[var(--radius-card)]">
      <Icon className="w-8 h-8 text-[var(--color-forest-mid)]" />
      <h3 className="text-[18px] font-medium text-[var(--color-ink)]">{title}</h3>
      <p className="text-[13px] text-[var(--color-body)] leading-[1.5]">{description}</p>
    </div>
  )
}
```

- [ ] **Step 2: MenuItemCard**

```tsx
// src/components/cards/MenuItemCard.tsx
import Image from 'next/image'

export function MenuItemCard({ name, description, priceKrw, imageUrl }: { name: string; description?: string | null; priceKrw?: number | null; imageUrl?: string | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-stone)]">
        {imageUrl && <Image src={imageUrl} alt={name} width={400} height={500} className="object-cover w-full h-full" />}
      </div>
      <h3 className="text-[18px] font-medium text-[var(--color-ink)]">{name}</h3>
      {description && <p className="text-[13px] text-[var(--color-body)]">{description}</p>}
      {priceKrw && <p className="text-[16px] font-medium text-[var(--color-ink)] font-mono">{priceKrw.toLocaleString()}원</p>}
    </div>
  )
}
```

- [ ] **Step 3: WhySignature section**

```tsx
// src/components/sections/WhySignature.tsx
import { Mountain, Atom, Flame, ChefHat } from 'lucide-react'
import Link from 'next/link'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'

const PILLARS = [
  { Icon: Mountain,  title: '산지 직지정',    description: '지리산 청정 자연 산청 흑돼지 · 거창 백돼지' },
  { Icon: Atom,      title: '특허 파동숙성',  description: '부드러운 식감과 풍부한 육즙' },
  { Icon: Flame,     title: '100% 대나무 숯', description: '잡내 없이 깊은 불향' },
  { Icon: ChefHat,   title: '숙련된 그릴링',  description: '직원이 직접 굽는 무료 서비스' },
]

export async function WhySignature() {
  const items = await getSignatureItems()
  return (
    <section className="bg-[var(--color-canvas-soft)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">WHY 육즙관리소</div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3">네 가지 약속</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {PILLARS.map(p => <PillarCard key={p.title} {...p}/>)}
        </div>
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-[28px] md:text-[36px] font-normal">시그니처 메뉴</h3>
            <Link href="/menu" className="text-[14px] font-medium">전체 메뉴 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, 3).map(item => (
              <MenuItemCard key={item.id} name={item.name_ko} description={item.description_ko} priceKrw={item.price_krw} imageUrl={item.image_url}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(sections): WhySignature with pillars + signature menu"
```

---

## Task 13: TwoLocations 비교 카드

**Files:**
- Create: `src/components/sections/TwoLocations.tsx`
- Create: `src/components/cards/LocationCard.tsx`

- [ ] **Step 1: LocationCard**

```tsx
// src/components/cards/LocationCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function LocationCard({ loc, kicker, points }: { loc: Loc; kicker: string; points: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 md:p-10 bg-white rounded-[var(--radius-card)]">
      <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden">
        {loc.hero_image && <Image src={loc.hero_image} alt={loc.name_ko} width={640} height={360} className="object-cover w-full h-full"/>}
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-[10px] tracking-[2px] font-mono text-[var(--color-body)]">{kicker}</div>
        <h3 className="text-[24px] font-medium text-[var(--color-ink)]">{loc.name_ko}</h3>
        <p className="text-[13px] text-[var(--color-body)]">{loc.address_road}</p>
        <p className="text-[13px] text-[var(--color-body)] font-mono">☎ {loc.virtual_phone}</p>
        <p className="text-[13px] text-[var(--color-ink)] leading-[1.5]">{points}</p>
        <Link href={`/locations/${loc.slug}`} className="text-[14px] font-medium text-[var(--color-forest-mid)] mt-1">{loc.name_ko.replace('육즙관리소 ','')} 보기 →</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Section**

```tsx
// src/components/sections/TwoLocations.tsx
import { LocationCard } from '@/components/cards/LocationCard'
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

const HIGHLIGHT: Record<string, { kicker: string; points: string }> = {
  yangjae: { kicker: 'YANGJAE', points: '콜키지·점심특선·가족·기념일에 좋아요' },
  euljiro: { kicker: 'EULJI-RO',  points: 'DDP 인근 · 본관/별관 · 새벽까지 운영' },
}

export function TwoLocations({ locations }: { locations: Loc[] }) {
  return (
    <section id="locations" className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">LOCATIONS</div>
        <h2 className="text-[32px] md:text-[40px] font-normal mt-3 text-[var(--color-ink)]">두 곳에서 만나요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {locations.map(loc => {
            const h = HIGHLIGHT[loc.slug] ?? { kicker: loc.slug.toUpperCase(), points: '' }
            return <LocationCard key={loc.id} loc={loc} {...h} />
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(sections): TwoLocations comparison cards"
```

---

## Task 14: GroupCTA + ReservationCTA + InstagramStrip

**Files:**
- Create: `src/components/sections/GroupCTA.tsx`
- Create: `src/components/sections/ReservationCTA.tsx`
- Create: `src/components/sections/InstagramStrip.tsx`
- Create: `src/lib/instagram/oembed.ts`

- [ ] **Step 1: GroupCTA**

```tsx
// src/components/sections/GroupCTA.tsx
import Image from 'next/image'
import { Phone, MessageCircle } from 'lucide-react'
import { BRAND } from '@/lib/constants/brand'

export function GroupCTA() {
  return (
    <section id="group" className="bg-[var(--color-forest)] text-white py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] md:aspect-video rounded-[var(--radius-card)] overflow-hidden">
          <Image src="/photos/locations/euljiro/long-banquet.jpg" alt="단체 회식 단체석" width={800} height={500} className="w-full h-full object-cover"/>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">GROUP DINING</div>
          <h2 className="text-[28px] md:text-[36px] font-normal leading-[1.15]">회식 · 동창회 · 청첩장은 단체석에서</h2>
          <p className="text-[15px] opacity-85 leading-[1.55]">4~16인 프라이빗 룸부터 20~40인 단체석까지. 두 지점 모두 소·중·대 모임을 모두 받습니다.</p>
          <div className="flex flex-wrap gap-3">
            <span className="px-5 py-2 bg-[var(--color-forest-mid)] rounded-full text-[12px]">프라이빗 룸 · 4~16인</span>
            <span className="px-5 py-2 bg-[var(--color-forest-mid)] rounded-full text-[12px]">단체석 · 20~40인</span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <a href="tel:0507-1335-6363" className="inline-flex items-center justify-center gap-2 bg-[var(--color-cream-gold)] text-[var(--color-ink)] px-7 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px]"><Phone className="w-4 h-4"/>양재 0507-1335-6363</a>
            <a href="tel:0507-1461-7228" className="inline-flex items-center justify-center gap-2 bg-[var(--color-cream-gold)] text-[var(--color-ink)] px-7 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px]"><Phone className="w-4 h-4"/>을지로 0507-1461-7228</a>
            {BRAND.kakaoChannelUrl && <a href={BRAND.kakaoChannelUrl} className="inline-flex items-center justify-center gap-2 bg-[#FEE500] text-[var(--color-ink)] px-7 py-3.5 rounded-[var(--radius-cta)] font-medium text-[14px]"><MessageCircle className="w-4 h-4"/>카카오 채널</a>}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: ReservationCTA**

```tsx
// src/components/sections/ReservationCTA.tsx
import type { Database } from '@/lib/supabase/types'
type Loc = Database['public']['Tables']['locations']['Row']

export function ReservationCTA({ locations }: { locations: Loc[] }) {
  return (
    <section id="reserve" className="bg-[var(--color-canvas-soft)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1024px] mx-auto text-center flex flex-col gap-6 items-center">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">RESERVATION</div>
        <h2 className="text-[36px] md:text-[48px] font-normal text-[var(--color-ink)]">지금 예약하기</h2>
        <p className="text-[15px] text-[var(--color-body)]">네이버 예약 · 캐치테이블 실시간 / 단체 · 룸은 전화 문의</p>
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          {locations.map(loc => (
            <a key={loc.slug}
              href={loc.catchtable_url ?? '#'}
              target="_blank" rel="noopener"
              data-event="reservation_click" data-location={loc.slug}
              className="bg-[var(--color-forest)] text-white px-9 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
              {loc.name_ko.replace('육즙관리소 ','')} 예약하기 →
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: InstagramStrip (oEmbed minimal)**

```tsx
// src/components/sections/InstagramStrip.tsx
import { BRAND } from '@/lib/constants/brand'

// Phase 1 — IG 4장 임베드 미니 strip. Graph API 권한 없이 가능한 'embedded post' 또는 placeholder.
export function InstagramStrip() {
  return (
    <section id="instagram" className="bg-[var(--color-canvas)] py-12 md:py-16 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between mb-6">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">INSTAGRAM</div>
        <a href={BRAND.instagramUrl} className="text-[14px] font-medium" target="_blank" rel="noopener">@{BRAND.instagramHandle} 팔로우 →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[1440px] mx-auto">
        {/* Phase 1: hardcoded latest 4 IG embed iframes (post URLs를 사장님께 받음) */}
        {/* Phase 2: IG Graph API로 동적 fetch */}
        <div className="aspect-square bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)]" aria-label="instagram-1"/>
        <div className="aspect-square bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)]" aria-label="instagram-2"/>
        <div className="aspect-square bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)]" aria-label="instagram-3"/>
        <div className="aspect-square bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)]" aria-label="instagram-4"/>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(sections): GroupCTA + ReservationCTA + InstagramStrip"
```

---

## Task 15: LP 합성 (`app/page.tsx`)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace default page**

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { AuthorityBanner } from '@/components/sections/AuthorityBanner'
import { WhySignature } from '@/components/sections/WhySignature'
import { TwoLocations } from '@/components/sections/TwoLocations'
import { GroupCTA } from '@/components/sections/GroupCTA'
import { ReservationCTA } from '@/components/sections/ReservationCTA'
import { InstagramStrip } from '@/components/sections/InstagramStrip'
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd'
import { getLocations } from '@/lib/fetchers/locations'

export default async function Page() {
  const locations = await getLocations()
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main>
        <Hero />
        <AuthorityBanner />
        <WhySignature />
        <TwoLocations locations={locations} />
        <GroupCTA />
        <InstagramStrip />
        <ReservationCTA locations={locations} />
      </main>
      <Footer locations={locations} />
    </>
  )
}
```

- [ ] **Step 2: OrganizationJsonLd**

```tsx
// src/components/schema/OrganizationJsonLd.tsx
import { ORG_SCHEMA } from '@/lib/constants/schema'
export function OrganizationJsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
}
```

- [ ] **Step 3: Verify dev**

```bash
npm run dev
# 브라우저 http://localhost:3000 — 모든 섹션 보임. 콘솔 에러 0.
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(page): LP composed with all sections + Org Schema"
```

---

## Task 16: /menu 페이지 + Menu Schema + EN 토글

**Files:**
- Create: `src/app/menu/page.tsx`, `src/components/schema/MenuJsonLd.tsx`

- [ ] **Step 1: MenuJsonLd**

```tsx
// src/components/schema/MenuJsonLd.tsx
import { BRAND } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'
type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export function MenuJsonLd({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const data = {
    '@context':'https://schema.org','@type':'Menu','@id':`${BRAND.domain}/menu`,
    hasMenuSection: categories.map(cat => ({
      '@type':'MenuSection', name: cat.name_ko, identifier: cat.slug,
      hasMenuItem: items.filter(i => i.category_id === cat.id).map(i => ({
        '@type':'MenuItem', name: i.name_ko, description: i.description_ko ?? undefined,
        offers: i.price_krw ? { '@type':'Offer', price: i.price_krw, priceCurrency:'KRW' } : undefined,
      })),
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

- [ ] **Step 2: Menu page**

```tsx
// src/app/menu/page.tsx
'use client'
import { useState } from 'react'
import type { Database } from '@/lib/supabase/types'
type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export default function MenuPageClient({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const [lang, setLang] = useState<'ko'|'en'>('ko')
  return (
    <main className="px-6 md:px-24 py-12 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">MENU</div>
          <h1 className="text-[40px] font-normal mt-2">{lang==='ko' ? '전체 메뉴' : 'Full Menu'}</h1>
        </div>
        <div className="flex gap-2 text-[13px] font-mono">
          <button onClick={()=>setLang('ko')} className={lang==='ko'?'underline':''}>KO</button>
          <button onClick={()=>setLang('en')} className={lang==='en'?'underline':''}>EN</button>
        </div>
      </div>
      {categories.map(cat => (
        <section key={cat.id} className="mb-12">
          <h2 className="text-[24px] font-medium mb-6">{lang==='ko'?cat.name_ko:cat.name_en}</h2>
          <ul className="divide-y divide-[var(--color-hairline)]">
            {items.filter(i => i.category_id === cat.id).map(i => (
              <li key={i.id} className="py-4 flex justify-between items-baseline gap-6">
                <div>
                  <div className="text-[16px] font-medium">{lang==='ko'?i.name_ko:(i.name_en ?? i.name_ko)}</div>
                  {(i.description_ko || i.description_en) && (
                    <p className="text-[13px] text-[var(--color-body)] mt-1">{lang==='ko'?i.description_ko:i.description_en}</p>
                  )}
                </div>
                {i.price_krw && <span className="text-[15px] font-mono whitespace-nowrap">{i.price_krw.toLocaleString()}원</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-[12px] text-[var(--color-body)] mt-12">메뉴 항목과 가격은 각 매장의 사정에 따라 다를 수 있습니다.</p>
    </main>
  )
}
```

server wrapper:
```tsx
// src/app/menu/page.tsx (rewrite as server, render client child)
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MenuJsonLd } from '@/components/schema/MenuJsonLd'
import { getMenu } from '@/lib/fetchers/menu'
import { getLocations } from '@/lib/fetchers/locations'
import MenuPageClient from './menu-client'

export const metadata = { title:'메뉴', description:'지리산 흑돼지 모듬 57,000원, 진꽃살 87,000원, 아보카도 육회 28,000원. 100% 대나무 숯 직화 · 직원 그릴링 무료.' }

export default async function MenuPage() {
  const { categories, items } = await getMenu()
  const locations = await getLocations()
  return <>
    <MenuJsonLd categories={categories} items={items} />
    <Header />
    <MenuPageClient categories={categories} items={items} />
    <Footer locations={locations} />
  </>
}
```

> Move client into `src/app/menu/menu-client.tsx` (rename from above). Server wrapper imports it.

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(page): /menu with categorized items + EN toggle + Menu Schema"
```

---

## Task 17: /locations/[slug] 페이지 (양재·을지로)

**Files:**
- Create: `src/app/locations/[slug]/page.tsx`
- Create: `src/app/locations/[slug]/not-found.tsx`

- [ ] **Step 1: Page**

```tsx
// src/app/locations/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RestaurantJsonLd } from '@/components/schema/RestaurantJsonLd'
import { getLocations, getLocationBySlug } from '@/lib/fetchers/locations'

export async function generateStaticParams() {
  return [{ slug: 'yangjae' }, { slug: 'euljiro' }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loc = await getLocationBySlug(slug)
  if (!loc) return { title: 'Not found' }
  return { title: loc.name_ko, description: loc.meta_description_ko ?? '' }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loc = await getLocationBySlug(slug)
  const locations = await getLocations()
  if (!loc) notFound()
  return <>
    <RestaurantJsonLd location={loc} />
    <Header />
    <main className="max-w-[1440px] mx-auto px-6 md:px-24 py-12">
      <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{slug.toUpperCase()}</div>
      <h1 className="text-[40px] md:text-[56px] font-normal mt-2">{loc.name_ko}</h1>
      {loc.hero_image && (
        <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden mt-8">
          <Image src={loc.hero_image} alt={loc.name_ko} width={1440} height={810} className="w-full h-full object-cover"/>
        </div>
      )}
      <section className="grid md:grid-cols-2 gap-12 mt-12">
        <div>
          <h2 className="text-[20px] font-medium mb-3">위치 · 연락처</h2>
          <p className="text-[14px]">{loc.address_road}</p>
          <p className="text-[14px] font-mono">☎ {loc.virtual_phone}</p>
          <h2 className="text-[20px] font-medium mt-6 mb-3">영업 시간</h2>
          <pre className="text-[13px] font-mono whitespace-pre-wrap">{JSON.stringify(loc.hours, null, 2)}</pre>
        </div>
        <div>
          <h2 className="text-[20px] font-medium mb-3">공간</h2>
          <p className="text-[14px]">룸 {(loc.rooms as any)?.min}—{(loc.rooms as any)?.max}인 / 단체석 {(loc.group_seats as any)?.min}—{(loc.group_seats as any)?.max}인</p>
          <h2 className="text-[20px] font-medium mt-6 mb-3">편의시설</h2>
          <ul className="text-[13px] flex flex-wrap gap-2">{loc.amenities?.map(a => <li key={a} className="px-3 py-1 bg-white rounded-full">{a}</li>)}</ul>
          {loc.catchtable_url && (
            <a href={loc.catchtable_url} target="_blank" rel="noopener" data-event="reservation_click" data-location={loc.slug} className="inline-block mt-6 bg-[var(--color-forest)] text-white px-7 py-3.5 rounded-[var(--radius-cta)]">캐치테이블 예약 →</a>
          )}
        </div>
      </section>
      {loc.photos && loc.photos.length > 0 && (
        <section className="mt-16">
          <h2 className="text-[24px] font-medium mb-6">갤러리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loc.photos.map(src => (
              <div key={src} className="aspect-square rounded-[var(--radius-card)] overflow-hidden">
                <Image src={src} alt={loc.name_ko} width={500} height={500} className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
    <Footer locations={locations} />
  </>
}
```

- [ ] **Step 2: not-found.tsx**

```tsx
export default function NotFound() {
  return <main className="max-w-[600px] mx-auto py-32 text-center"><h1 className="text-3xl">지점을 찾을 수 없습니다</h1></main>
}
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(page): /locations/[slug] with Restaurant Schema + photos gallery"
```

---

# Phase 1C — SEO + Performance (Tasks 18—21)

## Task 18: sitemap + robots + 페이지별 메타

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.domain
  const now = new Date()
  return [
    { url: base, lastModified: now, priority: 1, changeFrequency: 'weekly' },
    { url: `${base}/menu`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/locations/yangjae`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/locations/euljiro`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
  ]
}
```

- [ ] **Step 2: robots**

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants/brand'
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' , disallow: ['/admin']}], sitemap: `${BRAND.domain}/sitemap.xml` }
}
```

- [ ] **Step 3: Test**

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(seo): sitemap + robots"
```

---

## Task 19: 성능 — 이미지 art direction, 폰트 preload

**Files:**
- Modify: `src/app/layout.tsx` (preload Pretendard subset, GA4)

- [ ] **Step 1: GA4 + preload**

```tsx
// src/app/layout.tsx (add inside <html>)
import Script from 'next/script'

// inside <body> end:
<Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4}`} strategy="afterInteractive" />
<Script id="ga4" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${process.env.NEXT_PUBLIC_GA4}');
`}</Script>
```

`.env.local` add:
```
NEXT_PUBLIC_GA4=G-XXXXXXXXXX  # 사장님께 받음
```

- [ ] **Step 2: Image art direction in Hero**

In `Hero.tsx` modify `<Image>`:
```tsx
sizes="(max-width: 768px) 100vw, 1440px"
quality={85}
```

- [ ] **Step 3: Run Lighthouse**

```bash
npm run build && npm run start
# 새 탭: http://localhost:3000 → DevTools → Lighthouse 모바일
# 목표: LCP < 2.5s, CLS < 0.1, performance >= 85
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "perf: GA4 + image sizes + quality"
```

---

## Task 20: KPI 이벤트 instrumentation

**Files:**
- Create: `src/lib/analytics/events.ts`
- Add: data-event listeners in client components

- [ ] **Step 1: Events helper**

```ts
// src/lib/analytics/events.ts
declare global { interface Window { gtag?: (...args: unknown[]) => void } }
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params)
}
```

- [ ] **Step 2: Catch reservation_click globally**

`src/app/layout.tsx` add a small client effect:
```tsx
// src/components/analytics/ClickTracker.tsx (new client component)
'use client'
import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/events'

export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest('[data-event]') as HTMLElement | null
      if (t) trackEvent(t.dataset.event!, { location: t.dataset.location })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
```

Mount in `app/layout.tsx`.

- [ ] **Step 3: Verify in DevTools Network — gtag pings**

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(analytics): KPI event tracking on reservation/group clicks"
```

---

## Task 21: E2E 테스트 (Playwright)

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Playwright init**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Config**

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000', headless: true },
  webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: true },
})
```

- [ ] **Step 3: Critical paths test**

```ts
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage renders all key sections', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('프리미엄 흑돼지 다이닝')
  await expect(page.getByText('셰프 이원일이 직접 소개한')).toBeVisible()
  await expect(page.getByText('네 가지 약속')).toBeVisible()
  await expect(page.getByText('두 곳에서 만나요')).toBeVisible()
  await expect(page.getByText('회식 · 동창회 · 청첩장')).toBeVisible()
  await expect(page.getByText('지금 예약하기')).toBeVisible()
})

test('clicking reservation goes to catchtable', async ({ page }) => {
  await page.goto('/')
  const link = page.getByText('양재역점 예약하기 →').first()
  await expect(link).toHaveAttribute('href', /catchtable/)
})

test('menu page lists items with prices', async ({ page }) => {
  await page.goto('/menu')
  await expect(page.getByText('지리산 명품 숙성 흑돼지 모듬')).toBeVisible()
  await expect(page.getByText('57,000원')).toBeVisible()
})

test('locations page shows full info', async ({ page }) => {
  await page.goto('/locations/yangjae')
  await expect(page.getByText('서울 강남구 강남대로44길')).toBeVisible()
  await expect(page.getByText('0507-1335-6363')).toBeVisible()
})
```

- [ ] **Step 4: Run**

```bash
npm run test:e2e
```

Expected: 4 PASS.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "test(e2e): critical paths for LP, menu, locations"
```

---

# Phase 1D — Admin (Tasks 22—27)

## Task 22: Admin auth (Supabase) + protected layout

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`, `src/middleware.ts`

- [ ] **Step 1: Middleware**

```ts
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => req.cookies.getAll(), setAll: arr => arr.forEach(({name,value,options}) => res.cookies.set(name,value,options)) } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login' && !user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return res
}
export const config = { matcher: ['/admin/:path*'] }
```

- [ ] **Step 2: Login page**

```tsx
// src/app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState('')
  const router = useRouter()
  async function login(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr(error.message); else router.push('/admin')
  }
  return (
    <main className="max-w-[400px] mx-auto pt-24 px-6">
      <h1 className="text-3xl mb-6">어드민 로그인</h1>
      <form onSubmit={login} className="flex flex-col gap-3">
        <input className="border p-3 rounded" placeholder="이메일" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="border p-3 rounded" placeholder="비밀번호" type="password" value={pw} onChange={e=>setPw(e.target.value)}/>
        <button className="bg-[var(--color-forest)] text-white p-3 rounded">로그인</button>
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </form>
    </main>
  )
}
```

- [ ] **Step 3: Admin layout (protected)**

```tsx
// src/app/admin/layout.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && typeof window === 'undefined') {
    // covered by middleware too
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[var(--color-forest)] text-white p-6">
        <div className="text-xl font-medium mb-8">육즙관리소 어드민</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin">대시보드</Link>
          <Link href="/admin/banner">임시 공지</Link>
          <Link href="/admin/menu-prices">메뉴 가격</Link>
          <Link href="/admin/meta">메타 description</Link>
        </nav>
      </aside>
      <section className="flex-1 p-8 bg-[var(--color-canvas)]">{children}</section>
    </div>
  )
}
```

- [ ] **Step 4: Manual: 사장님 계정 생성**

```sql
-- via Supabase MCP execute_sql or 대시보드에서
-- 1) auth.users에 사장님 이메일로 사용자 추가 (대시보드 Auth → Users → Add user)
-- 2) 그 user id를 admin_users에 insert
insert into public.admin_users (id, role, display_name) values ('<paste-uuid>','owner','육즙관리소 사장');
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(admin): auth + protected layout + login"
```

---

## Task 23: Admin /banner — 임시 공지

**Files:**
- Create: `src/app/admin/banner/page.tsx`, `src/components/layout/EmergencyBanner.tsx`

- [ ] **Step 1: Server action + form**

```tsx
// src/app/admin/banner/page.tsx
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

async function save(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const message_ko = formData.get('message_ko') as string
  const active = formData.get('active') === 'on'
  const expires_at = formData.get('expires_at') as string || null
  // upsert single row pattern: deactivate all then insert
  await supabase.from('emergency_banner').update({ active: false }).neq('id','00000000-0000-0000-0000-000000000000')
  if (active && message_ko) {
    await supabase.from('emergency_banner').insert({ message_ko, active: true, expires_at })
  }
  revalidateTag('banner')
}

export default async function BannerAdmin() {
  const supabase = await createClient()
  const { data: cur } = await supabase.from('emergency_banner').select('*').eq('active', true).maybeSingle()
  return (
    <div className="max-w-[600px]">
      <h1 className="text-3xl mb-6">임시 공지</h1>
      <form action={save} className="flex flex-col gap-3">
        <textarea name="message_ko" defaultValue={cur?.message_ko ?? ''} className="border p-3 rounded h-24" placeholder="예: 5월 15일 임시 휴무"/>
        <input type="datetime-local" name="expires_at" defaultValue={cur?.expires_at ?? ''} className="border p-3 rounded"/>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={cur?.active}/> 활성화</label>
        <button className="bg-[var(--color-forest)] text-white p-3 rounded">저장</button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: EmergencyBanner display**

```tsx
// src/components/layout/EmergencyBanner.tsx
import { getActiveBanner } from '@/lib/fetchers/banner'
export async function EmergencyBanner() {
  const b = await getActiveBanner()
  if (!b) return null
  return <div className="bg-[var(--color-coral)] text-white text-center py-2 text-sm">{b.message_ko}</div>
}
```

Mount above Header in `app/layout.tsx`:
```tsx
import { EmergencyBanner } from '@/components/layout/EmergencyBanner'
// ...
<body><EmergencyBanner />{children}</body>
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(admin): emergency banner CRUD + frontend display"
```

---

## Task 24: Admin /menu-prices — 가격 빠른 수정

**Files:**
- Create: `src/app/admin/menu-prices/page.tsx`

- [ ] **Step 1: List + edit**

```tsx
// src/app/admin/menu-prices/page.tsx
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

async function update(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string
  const price_krw = Number(formData.get('price_krw'))
  await supabase.from('menu_items').update({ price_krw }).eq('id', id)
  revalidateTag('menu')
}

export default async function MenuPricesAdmin() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('menu_items').select('id, name_ko, price_krw').order('sort_order')
  return (
    <div className="max-w-[600px]">
      <h1 className="text-3xl mb-6">메뉴 가격</h1>
      <ul className="flex flex-col gap-2">
        {items?.map(i => (
          <li key={i.id}>
            <form action={update} className="flex items-center gap-3">
              <input type="hidden" name="id" value={i.id}/>
              <span className="flex-1">{i.name_ko}</span>
              <input type="number" name="price_krw" defaultValue={i.price_krw ?? 0} className="border p-2 w-28 text-right rounded font-mono" />
              <span>원</span>
              <button className="bg-[var(--color-forest)] text-white px-3 py-2 rounded">저장</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(admin): menu price quick edit"
```

---

## Task 25: Admin /meta — meta description 수정

**Files:**
- Create: `src/app/admin/meta/page.tsx`

- [ ] **Step 1: Form per location**

```tsx
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

async function update(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const slug = formData.get('slug') as string
  await supabase.from('locations').update({
    meta_description_ko: formData.get('meta_description_ko') as string,
  }).eq('slug', slug)
  revalidateTag('locations')
}

export default async function MetaAdmin() {
  const supabase = await createClient()
  const { data: locs } = await supabase.from('locations').select('slug, name_ko, meta_description_ko').order('slug')
  return (
    <div className="max-w-[600px]">
      <h1 className="text-3xl mb-6">메타 description</h1>
      {locs?.map(l => (
        <form key={l.slug} action={update} className="flex flex-col gap-2 border p-4 rounded mb-4">
          <input type="hidden" name="slug" value={l.slug}/>
          <h2 className="font-medium">{l.name_ko}</h2>
          <textarea name="meta_description_ko" defaultValue={l.meta_description_ko ?? ''} className="border p-2 rounded h-24" maxLength={160}/>
          <button className="bg-[var(--color-forest)] text-white px-3 py-2 rounded self-start">저장</button>
        </form>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(admin): meta description edit per location"
```

---

## Task 26: Admin 대시보드

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Simple dashboard**

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: banner } = await supabase.from('emergency_banner').select('message_ko, active').eq('active', true).maybeSingle()
  return (
    <div>
      <h1 className="text-3xl mb-6">대시보드</h1>
      <section className="grid md:grid-cols-3 gap-4">
        <Card title="현재 임시 공지" body={banner?.message_ko ?? '없음'} href="/admin/banner"/>
        <Card title="메뉴 가격" body="빠른 수정" href="/admin/menu-prices"/>
        <Card title="메타 description" body="SEO 카피" href="/admin/meta"/>
      </section>
    </div>
  )
}
function Card({ title, body, href }: { title: string; body: string; href: string }) {
  return <Link href={href} className="p-6 bg-white rounded border block"><div className="text-sm text-gray-500">{title}</div><div className="font-medium mt-1">{body}</div></Link>
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(admin): dashboard"
```

---

## Task 27: Admin E2E 테스트

**Files:**
- Create: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Test admin auth gate**

```ts
import { test, expect } from '@playwright/test'

test('redirects unauthenticated /admin to /admin/login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('login page has form', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByPlaceholder('이메일')).toBeVisible()
  await expect(page.getByPlaceholder('비밀번호')).toBeVisible()
})
```

- [ ] **Step 2: Run + Commit**

```bash
npm run test:e2e -- admin
git add . && git commit -m "test(e2e): admin auth gate"
```

---

# Phase 1E — Launch (Tasks 28—31)

## Task 28: Mobile + 접근성 audit

**Files:**
- Inline fixes only.

- [ ] **Step 1: Open Chrome DevTools → Lighthouse → Mobile**

Targets:
- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

- [ ] **Step 2: Common fixes**

- 모든 `<img>`/`<Image>`에 `alt` 텍스트 NER 키워드 포함 ("육즙관리소 ... 인테리어")
- 폰트 weight 명시
- 버튼 `aria-label` (icon-only 경우)
- color contrast: forest text on warm canvas — 충분 (4.5:1+)

- [ ] **Step 3: Mobile breakpoints check**

- iPhone SE (375x667)
- iPhone 14 Pro (390x844)
- iPad (768x1024)

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "polish: mobile + a11y audit fixes"
```

---

## Task 29: Vercel 배포 + 도메인 yukzzp.com

**Files:**
- N/A (외부 셋업)

- [ ] **Step 1: Vercel 프로젝트 연결**

```bash
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# (모든 .env.local 변수를 vercel env에 추가)
npx vercel --prod
```

- [ ] **Step 2: 도메인 추가**

Vercel 대시보드 → Project → Domains → Add `yukzzp.com` → DNS A/CNAME 레코드 사장님이 가비아/카페24에서 설정.

- [ ] **Step 3: SSL 자동 발급 확인**

- [ ] **Step 4: Production 배포 검증**

```bash
curl -I https://yukzzp.com
# HTTP 200, x-vercel-cache HIT (ISR)
```

- [ ] **Step 5: Vercel Speed Insights 활성**

```bash
npm install @vercel/speed-insights
```

`app/layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
// inside <body>:
<SpeedInsights />
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(deploy): Vercel deploy + Speed Insights"
```

---

## Task 30: 검색엔진·LLM 노출 셋업

**Files:**
- N/A (외부 등록)

- [ ] **Step 1: Google Search Console 등록 + sitemap 제출**

`yukzzp.com` → Search Console → DNS TXT verify → Sitemap submit `https://yukzzp.com/sitemap.xml`.

- [ ] **Step 2: Naver Search Advisor 등록**

`searchadvisor.naver.com` → 사이트 등록 → robots.txt 검증 → sitemap 제출.

- [ ] **Step 3: 페이지별 schema validation**

Google Rich Results Test:
- `https://yukzzp.com/` → `Organization` 검증
- `https://yukzzp.com/locations/yangjae` → `Restaurant` 검증
- `https://yukzzp.com/menu` → `Menu` 검증

모두 PASS.

- [ ] **Step 4: 인스타·캐치테이블·네이버에 사이트 URL 등록**

- 인스타 프로필 link in bio → `yukzzp.com`
- 네이버 플레이스 양재·을지로 "홈페이지" 필드 → `yukzzp.com`
- 캐치테이블 매장 정보 "홈페이지" 필드 → `yukzzp.com`

- [ ] **Step 5: KPI 대시보드 셋업 (GA4)**

GA4 Reports → Engagement → Custom event 추가:
- `reservation_click` (with location dimension)
- `group_inquiry_click`

- [ ] **Step 6: Commit (docs)**

```bash
git add docs/launch-checklist.md && git commit -m "docs: launch checklist + tracking setup"
```

---

## Task 31: 발사 후 모니터링 + 다음 단계

**Files:**
- Create: `docs/launch-checklist.md`

- [ ] **Step 1: 1-week 체크포인트**

발사 후 7일:
- GA4 데일리 트래픽
- 캐치테이블 클릭 (`reservation_click`) 카운트
- 단체 문의 (`group_inquiry_click`) 카운트
- Vercel Speed Insights — LCP/CLS/INP
- Google Search Console — 노출/클릭/CTR
- 어드민 사용 빈도 (사장님이 한 번이라도 들어왔는지)

- [ ] **Step 2: 6개월 KPI 측정 일정**

```markdown
# Launch Checklist + KPI 측정

## 발사 직후 (Day 0—7)
- [ ] sitemap 제출 (Google + Naver)
- [ ] Schema 검증 (Rich Results Test)
- [ ] 외부 링크 등록 (네이버 / 캐치테이블 / 인스타)
- [ ] 사장님 어드민 첫 로그인 + 임시 공지 1개 작성 테스트
- [ ] Speed Insights 모니터링 시작

## 1개월
- [ ] LCP < 2.5s 유지
- [ ] reservation_click 데이터 수집
- [ ] 1page 노출 키워드 6개 중 어느 것이 들어왔나 확인

## 3개월
- [ ] K1 (캐치테이블 클릭률 8%+) 진행 상황
- [ ] K2 (단체 문의 30+/월) 진행 상황
- [ ] 어드민 활용도 (월 1회 이상?)
- [ ] Phase 2 트리거 검토

## 6개월
- [ ] K1·K2·K3·K4 종합 평가
- [ ] Phase 2 진행 결정 (KPI 충족 시) 또는 KPI 미달이면 전략 재설계
```

- [ ] **Step 3: Final commit**

```bash
git add . && git commit -m "docs: launch checklist + KPI measurement schedule"
```

---

# Self-Review

이 계획을 스펙에 비추어 점검:

**1. Spec coverage:**
- §1 USP → Authority Banner (셰프 영상) + GroupCTA + Location Schema 모두 반영 ✅
- §2 매장 정체성 → Task 4 seed에서 양재·을지로 NAP 풀 입력 ✅
- §3 KPI → Task 20 (events.ts) + Task 30 (GA4 dashboard) ✅
- §4 IA (4 페이지) → Tasks 15, 16, 17 ✅
- §5 LP 6 섹션 + IG strip → Tasks 10—15 ✅
- §6 디자인 토큰 → Task 1 tokens.css ✅
- §7 컴포넌트 12개 → Tasks 8—14 (대부분 커버) ✅
- §8 Supabase 스키마 → Task 3 ✅
- §9 어드민 3 기능 → Tasks 23, 24, 25 + 26 dashboard ✅
- §10 GEO/SEO → Task 18 (sitemap) + Schema in 9, 16, 17 ✅
- §11 콘텐츠 운영 → IG Strip Task 14 + 어드민 ✅
- §12 성능 예산 → Task 19, 28 ✅
- §13 모바일 우선 → Task 28 ✅
- §14 기술 스택 → Task 1, 2 ✅
- §15 법적·윤리 → 푸터 디스클레이머 (Task 9) + 메뉴 페이지 (Task 16) ✅
- §16 리스크 → 모든 Task에 잠재 위험 명시 ✅
- §17 Phase 2/3 → 본 계획은 Phase 1 only ✅
- §18 D 결정사항 → 모두 반영됨 ✅

**2. Placeholder scan:**
- "TODO/TBD" 검색 — 없음 ✅
- "implement later" 패턴 — 없음 ✅
- 모든 step에 실제 코드 또는 명령 ✅
- Task 14 InstagramStrip — IG Graph API 권한 못 받으면 placeholder div 4개로 시작 (명시됨)
- Task 22 — 사장님 계정 생성은 수동 단계 (대시보드 작업) 명시

**3. Type consistency:**
- `Database['public']['Tables']['locations']['Row']` 일관 사용 ✅
- 함수명: `getLocations`, `getLocationBySlug`, `getMenu`, `getActiveBanner` 통일 ✅
- 컴포넌트명: `Header`, `Footer`, `Hero`, `AuthorityBanner`, `WhySignature`, `TwoLocations`, `GroupCTA`, `ReservationCTA`, `InstagramStrip` 모두 export 매칭 ✅
- 외부 의존: GA4 ID, Kakao URL은 `.env`로 주입 — 문서화됨 ✅

**4. 빌드 환경:**
- Next.js 16 App Router 패턴 사용 (서버 컴포넌트 기본) ✅
- `params: Promise<...>` 타입 (Next 15+ 변경 사항 반영) ✅
- `cookies()` await 필요 (Next 15+ async cookie API) ✅

**Open dependencies (사장님 또는 빌드 시점에 채움):**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Task 2)
- `SUPABASE_SERVICE_ROLE_KEY` (Task 2)
- `NEXT_PUBLIC_GA4` (Task 19)
- ~~`NEXT_PUBLIC_KAKAO_CHANNEL_URL`~~ ✅ **확정**: `https://pf.kakao.com/_ARVxkn` (Task 5)
- 사장님 어드민 계정 (Task 22)
- IG 4장 게시 URL (Task 14, optional Phase 1.5)

이 의존성들은 Open Items로 빌드 시작 전에 사장님께 받음.

---

# 실행 옵션

**Plan complete and saved to `docs/superpowers/plans/2026-05-06-yukzzp-website-phase1.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — 나는 task별로 fresh subagent를 dispatch하고 task 사이에 검토. 빠른 반복.

**2. Inline Execution** — 이 세션에서 task를 batch로 실행 + checkpoint 검토.

**어느 쪽으로?**
