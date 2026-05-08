# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin panel at `/admin/*` so the owner can independently manage copy (문구), images (이미지), and video (영상) without a developer.

**Architecture:** `site_config` key-value table in Supabase stores editable copy and media URLs; Supabase Storage `media` bucket holds uploaded images; a middleware-protected `/admin/*` route group uses Supabase Auth (email/password) for authentication. Server Actions handle all mutations and revalidate cache tags.

**Tech Stack:** Next.js 16.2.4 (App Router, Server Actions), Supabase Auth + Supabase Storage, vitest + @testing-library/react, Tailwind v4, shadcn components.

---

## File Map

```
supabase/migrations/20260508_003_admin_panel.sql   — site_config table + media bucket RLS + seed
src/lib/supabase/types.ts                           — add site_config Row/Insert/Update types
src/lib/fetchers/config.ts                          — getSiteConfig(), getSiteConfigValue()
tests/lib/fetchers/config.test.ts                   — unit tests for config fetcher
src/middleware.ts                                   — protect /admin/* routes
src/app/admin/login/page.tsx                        — login form (client component)
src/app/admin/login/actions.ts                      — signIn / signOut server actions
tests/app/admin/login/actions.test.ts               — unit tests for auth actions
src/app/admin/layout.tsx                            — admin shell: auth check + sidebar nav
src/app/admin/page.tsx                              — dashboard (redirects to /admin/copy)
src/app/admin/copy/page.tsx                         — edit hero + pillar copy
src/app/admin/copy/actions.ts                       — upsertConfig server action
tests/app/admin/copy/actions.test.ts               — unit tests for copy actions
src/app/admin/banner/page.tsx                       — list/toggle/create emergency banners
src/app/admin/banner/actions.ts                     — createBanner, toggleBanner, deleteBanner
tests/app/admin/banner/actions.test.ts             — unit tests for banner actions
src/app/admin/media/page.tsx                        — set chef video URL + upload hero images
src/app/admin/media/actions.ts                      — saveVideoUrl, uploadHeroImage server actions
tests/app/admin/media/actions.test.ts              — unit tests for media actions
src/app/admin/menu/page.tsx                         — list/edit menu items + image upload
src/app/admin/menu/actions.ts                       — updateMenuItem, uploadMenuImage
tests/app/admin/menu/actions.test.ts               — unit tests for menu actions
src/components/sections/Hero.tsx                    — read hero copy from site_config (fallback to COPY_KO)
src/components/sections/WhySignature.tsx            — read pillar copy from site_config (fallback to COPY_KO)
```

---

## Task 1: DB Migration — site_config Table + Storage Bucket + Seed

**Files:**
- Create: `supabase/migrations/20260508_003_admin_panel.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20260508_003_admin_panel.sql

-- 1. site_config key-value table
create table public.site_config (
  key   text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- 2. RLS: public read, admin-only write
alter table public.site_config enable row level security;

create policy "public_read_site_config"
  on public.site_config for select
  using (true);

create policy "admin_write_site_config"
  on public.site_config for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- 3. Supabase Storage bucket for media (created via API, not SQL)
-- Run after migration:
--   supabase storage create media --public

-- 4. Seed default copy values
insert into public.site_config (key, value) values
  ('hero_h1',          '상위1% 서울 3대 목살맛집'),
  ('hero_sub',         '야생쑥을 먹고 자란 산청 흑돼지 · 거창 백돼지. 불포화지방산이 풍부하고 쫄깃한 육질과 담백한 맛이 일품입니다.'),
  ('hero_eyebrow',     '양재역 본점 · 더룸 을지로동대문점'),
  ('pillar_1_title',   '가장 좋은 식재료'),
  ('pillar_1_desc',    '팔도의 가장 좋은 식재료를 고집합니다. 야생쑥을 먹고 자란 산청 흑돼지·거창 백돼지의 쫄깃한 육질, 뛰어난 향미의 고급 품종 수향미 밥까지 — 모든 식재료에서 차이를 만듭니다.'),
  ('pillar_2_title',   '특허 파동숙성'),
  ('pillar_2_desc',    '파동 에너지로 근섬유를 이완시켜 효소 숙성을 극대화. 육즙 손실 없이 고기 전체가 고르게 부드러워지고, 잡내 없이 깊고 진한 풍미를 끌어냅니다.'),
  ('pillar_3_title',   '하향식 덕트'),
  ('pillar_3_desc',    '100% 대나무 숯으로 잡내 없는 깊은 불향을 내고, 하향식 덕트로 연기·냄새를 식탁 아래로 즉시 흡입. 옷에 냄새가 배지 않고 눈이 맵지 않아 데이트·회식·청첩장 자리에서도 깔끔하게 즐길 수 있습니다.'),
  ('pillar_4_title',   '직접 담근 정성찬'),
  ('pillar_4_desc',    '매장에서 직접 만드는 반찬과 7가지 소스. 유자청 겉절이 · 계절 장아찌.'),
  ('chef_video_url',   'https://www.youtube.com/shorts/7CCR4BYW7D0'),
  ('hero_image_yangjae', ''),
  ('hero_image_euljiro', '')
on conflict (key) do nothing;
```

- [ ] **Step 2: Apply migration to Supabase**

```bash
# If using Supabase CLI with local dev:
npx supabase db push

# OR apply via Supabase MCP tool (execute_sql):
# Paste the SQL above into mcp__supabase__apply_migration
```

Expected: Table `site_config` created, 15 rows seeded.

- [ ] **Step 3: Create storage bucket**

Via Supabase dashboard → Storage → New bucket → name: `media`, Public: ON.

OR via MCP:
```
mcp__supabase__execute_sql:
  INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260508_003_admin_panel.sql
git commit -m "feat(db): site_config table + media storage bucket + seed defaults"
```

---

## Task 2: Update TypeScript Types for site_config

**Files:**
- Modify: `src/lib/supabase/types.ts` — add `site_config` table definition

- [ ] **Step 1: Add site_config to the Tables section of types.ts**

In `src/lib/supabase/types.ts`, inside the `Tables` object (after `menu_items` and before `}` closing), add:

```typescript
      site_config: {
        Row: {
          key: string
          value: string
          updated_at: string | null
        }
        Insert: {
          key: string
          value: string
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/types.ts
git commit -m "feat(types): add site_config table to Database types"
```

---

## Task 3: site_config Fetcher

**Files:**
- Create: `src/lib/fetchers/config.ts`
- Create: `tests/lib/fetchers/config.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/fetchers/config.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase service module
vi.mock('@/lib/supabase/service', () => ({
  createPublicClient: vi.fn(),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))

import { createPublicClient } from '@/lib/supabase/service'
import { getSiteConfig, getSiteConfigValue } from '@/lib/fetchers/config'

const mockClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createPublicClient).mockReturnValue(mockClient as never)
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
})

describe('getSiteConfig', () => {
  it('returns record map from DB', async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { key: 'hero_h1', value: '상위1% 서울 3대 목살맛집', updated_at: null },
          { key: 'hero_sub', value: '야생쑥...', updated_at: null },
        ],
        error: null,
      }),
    })

    const result = await getSiteConfig()

    expect(result).toEqual({
      hero_h1: '상위1% 서울 3대 목살맛집',
      hero_sub: '야생쑥...',
    })
  })

  it('returns empty object when env var missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    const result = await getSiteConfig()
    expect(result).toEqual({})
  })
})

describe('getSiteConfigValue', () => {
  it('returns value for existing key', async () => {
    mockClient.single.mockResolvedValue({
      data: { key: 'hero_h1', value: '상위1%', updated_at: null },
      error: null,
    })

    const result = await getSiteConfigValue('hero_h1')
    expect(result).toBe('상위1%')
  })

  it('returns null for missing key', async () => {
    mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
    const result = await getSiteConfigValue('nonexistent')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/lib/fetchers/config.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/fetchers/config'"

- [ ] **Step 3: Create the fetcher**

Create `src/lib/fetchers/config.ts`:

```typescript
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/service'

export type SiteConfig = Record<string, string>

export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return {}
    const supabase = createPublicClient()
    const { data } = await supabase.from('site_config').select('key, value')
    if (!data) return {}
    return Object.fromEntries(data.map(row => [row.key, row.value]))
  },
  ['site_config'],
  { revalidate: 60, tags: ['site_config'] },
)

export async function getSiteConfigValue(key: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', key)
    .single()
  return data?.value ?? null
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/lib/fetchers/config.test.ts
```

Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/fetchers/config.ts tests/lib/fetchers/config.test.ts
git commit -m "feat(lib): site_config fetcher with cache tag + unit tests"
```

---

## Task 4: Middleware — Protect /admin/* Routes

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write the middleware**

Create `src/middleware.ts`:

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(admin): middleware guards /admin/* — redirects unauthenticated to /admin/login"
```

---

## Task 5: Login Page + Auth Server Actions

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/actions.ts`
- Create: `tests/app/admin/login/actions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/login/actions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/app/admin/login/actions'

const mockAuth = {
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}
const mockClient = { auth: mockAuth }

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
})

describe('signIn', () => {
  it('redirects to /admin on success', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({ error: null })
    const formData = new FormData()
    formData.set('email', 'owner@yukzzp.com')
    formData.set('password', 'secret')

    await signIn(formData)

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@yukzzp.com',
      password: 'secret',
    })
    expect(redirect).toHaveBeenCalledWith('/admin')
  })

  it('returns error message on failure', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      error: { message: '이메일 또는 비밀번호가 잘못되었습니다.' },
    })
    const formData = new FormData()
    formData.set('email', 'wrong@email.com')
    formData.set('password', 'wrong')

    const result = await signIn(formData)

    expect(result).toEqual({ error: '이메일 또는 비밀번호가 잘못되었습니다.' })
    expect(redirect).not.toHaveBeenCalled()
  })
})

describe('signOut', () => {
  it('signs out and redirects to /admin/login', async () => {
    mockAuth.signOut.mockResolvedValue({ error: null })

    await signOut()

    expect(mockAuth.signOut).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/admin/login')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/admin/login/actions.test.ts
```

Expected: FAIL — "Cannot find module '@/app/admin/login/actions'"

- [ ] **Step 3: Create the server actions**

Create `src/app/admin/login/actions.ts`:

```typescript
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/admin/login/actions.test.ts
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Create the login page**

Create `src/app/admin/login/page.tsx`:

```tsx
'use client'

import { useActionState } from 'react'
import { signIn } from './actions'

const initialState = { error: '' }

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error: string }, formData: FormData) => {
      const result = await signIn(formData)
      return result ?? { error: '' }
    },
    initialState,
  )

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-normal text-[var(--color-ink)] mb-8">
          육즙관리소 관리자
        </h1>
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] text-[var(--color-body)] mb-1">이메일</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-forest-mid)]"
            />
          </div>
          <div>
            <label className="block text-[13px] text-[var(--color-body)] mb-1">비밀번호</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-forest-mid)]"
            />
          </div>
          {state.error && (
            <p className="text-red-600 text-[13px]">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="bg-[var(--color-forest)] text-white py-3 rounded-lg text-[15px] font-medium disabled:opacity-50"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/login/ tests/app/admin/login/
git commit -m "feat(admin): login page + signIn/signOut server actions"
```

---

## Task 6: Admin Layout + Sidebar Navigation

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create the admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './login/actions'

const NAV = [
  { href: '/admin/copy',   label: '문구 관리' },
  { href: '/admin/menu',   label: '메뉴 관리' },
  { href: '/admin/banner', label: '임시 공지' },
  { href: '/admin/media',  label: '미디어' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-[var(--color-canvas-soft)]">
      <aside className="w-56 bg-[var(--color-forest)] flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-white text-[14px] font-medium">육즙관리소 관리자</span>
        </div>
        <nav className="flex flex-col py-4 gap-1 flex-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="mx-3 px-3 py-2 rounded-lg text-white/80 text-[14px] hover:bg-white/10 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <form
          action={signOut}
          className="px-3 py-4 border-t border-white/10"
        >
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-white/60 text-[13px] hover:text-white"
          >
            로그아웃
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create the admin dashboard page**

Create `src/app/admin/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/copy')
}
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat(admin): admin layout with sidebar nav + dashboard redirect"
```

---

## Task 7: Copy Management Page

**Files:**
- Create: `src/app/admin/copy/page.tsx`
- Create: `src/app/admin/copy/actions.ts`
- Create: `tests/app/admin/copy/actions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/copy/actions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { upsertConfig } from '@/app/admin/copy/actions'

const mockUpsert = vi.fn()
const mockClient = {
  from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
})

describe('upsertConfig', () => {
  it('upserts each key and revalidates site_config tag', async () => {
    mockUpsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.set('hero_h1', '새로운 제목')
    formData.set('pillar_1_title', '새 타이틀')

    await upsertConfig(formData)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'hero_h1', value: '새로운 제목' }),
        expect.objectContaining({ key: 'pillar_1_title', value: '새 타이틀' }),
      ]),
      { onConflict: 'key' },
    )
    expect(revalidateTag).toHaveBeenCalledWith('site_config')
  })

  it('returns error when DB fails', async () => {
    mockUpsert.mockResolvedValue({ error: { message: 'DB error' } })

    const formData = new FormData()
    formData.set('hero_h1', '제목')

    const result = await upsertConfig(formData)
    expect(result).toEqual({ error: 'DB error' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/admin/copy/actions.test.ts
```

Expected: FAIL — "Cannot find module '@/app/admin/copy/actions'"

- [ ] **Step 3: Create copy actions**

Create `src/app/admin/copy/actions.ts`:

```typescript
'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function upsertConfig(formData: FormData) {
  const rows = Array.from(formData.entries()).map(([key, value]) => ({
    key,
    value: value as string,
    updated_at: new Date().toISOString(),
  }))

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (error) return { error: error.message }

  revalidateTag('site_config')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/admin/copy/actions.test.ts
```

Expected: PASS — 2 tests.

- [ ] **Step 5: Create the copy management page**

Create `src/app/admin/copy/page.tsx`:

```tsx
import { getSiteConfig } from '@/lib/fetchers/config'
import { upsertConfig } from './actions'

const FIELDS = [
  { key: 'hero_h1',        label: '메인 타이틀 (H1)',      multiline: false },
  { key: 'hero_sub',       label: '메인 소제목',            multiline: true },
  { key: 'hero_eyebrow',   label: '상단 지점 안내 텍스트',  multiline: false },
  { key: 'pillar_1_title', label: '특징 1 제목',            multiline: false },
  { key: 'pillar_1_desc',  label: '특징 1 설명',            multiline: true },
  { key: 'pillar_2_title', label: '특징 2 제목',            multiline: false },
  { key: 'pillar_2_desc',  label: '특징 2 설명',            multiline: true },
  { key: 'pillar_3_title', label: '특징 3 제목',            multiline: false },
  { key: 'pillar_3_desc',  label: '특징 3 설명',            multiline: true },
  { key: 'pillar_4_title', label: '특징 4 제목',            multiline: false },
  { key: 'pillar_4_desc',  label: '특징 4 설명',            multiline: true },
] as const

export default async function CopyPage() {
  const config = await getSiteConfig()

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-6">문구 관리</h1>
      <form action={upsertConfig} className="flex flex-col gap-6">
        {FIELDS.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="block text-[13px] font-medium text-[var(--color-body)] mb-1.5">
              {label}
            </label>
            {multiline ? (
              <textarea
                name={key}
                defaultValue={config[key] ?? ''}
                rows={3}
                className="w-full border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] resize-y focus:outline-none focus:border-[var(--color-forest-mid)]"
              />
            ) : (
              <input
                name={key}
                type="text"
                defaultValue={config[key] ?? ''}
                className="w-full border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[var(--color-forest-mid)]"
              />
            )}
          </div>
        ))}
        <div>
          <button
            type="submit"
            className="bg-[var(--color-forest)] text-white px-6 py-3 rounded-lg text-[14px] font-medium"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/copy/ tests/app/admin/copy/
git commit -m "feat(admin): copy management page — edit hero + pillar text via site_config"
```

---

## Task 8: Emergency Banner Management

**Files:**
- Create: `src/app/admin/banner/page.tsx`
- Create: `src/app/admin/banner/actions.ts`
- Create: `tests/app/admin/banner/actions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/banner/actions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { createBanner, toggleBanner } from '@/app/admin/banner/actions'

const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockClient = {
  from: vi.fn().mockReturnValue({
    insert: mockInsert,
    update: vi.fn().mockReturnValue({ eq: mockEq }),
  }),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
  mockInsert.mockResolvedValue({ error: null })
  mockEq.mockResolvedValue({ error: null })
})

describe('createBanner', () => {
  it('inserts banner and revalidates', async () => {
    const formData = new FormData()
    formData.set('message_ko', '오늘 임시 휴무입니다.')
    formData.set('expires_at', '2026-05-09T23:59')

    await createBanner(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      message_ko: '오늘 임시 휴무입니다.',
      active: true,
    }))
    expect(revalidateTag).toHaveBeenCalledWith('banner')
  })

  it('omits expires_at when empty', async () => {
    const formData = new FormData()
    formData.set('message_ko', '공지')
    formData.set('expires_at', '')

    await createBanner(formData)

    const inserted = mockInsert.mock.calls[0][0]
    expect(inserted.expires_at).toBeNull()
  })
})

describe('toggleBanner', () => {
  it('toggles active state for given id', async () => {
    await toggleBanner('some-uuid', false)

    const updateCall = mockClient.from().update
    expect(updateCall).toHaveBeenCalledWith({ active: false })
    expect(mockEq).toHaveBeenCalledWith('id', 'some-uuid')
    expect(revalidateTag).toHaveBeenCalledWith('banner')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/admin/banner/actions.test.ts
```

Expected: FAIL — "Cannot find module '@/app/admin/banner/actions'"

- [ ] **Step 3: Create banner actions**

Create `src/app/admin/banner/actions.ts`:

```typescript
'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createBanner(formData: FormData) {
  const message_ko = formData.get('message_ko') as string
  const expiresRaw = formData.get('expires_at') as string

  const supabase = await createClient()
  const { error } = await supabase.from('emergency_banner').insert({
    message_ko,
    active: true,
    expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
  })

  if (error) return { error: error.message }
  revalidateTag('banner')
}

export async function toggleBanner(id: string, active: boolean) {
  const supabase = await createClient()
  await supabase
    .from('emergency_banner')
    .update({ active })
    .eq('id', id)
  revalidateTag('banner')
}

export async function deleteBanner(id: string) {
  const supabase = await createClient()
  await supabase.from('emergency_banner').delete().eq('id', id)
  revalidateTag('banner')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/admin/banner/actions.test.ts
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Create the banner management page**

Create `src/app/admin/banner/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createBanner, toggleBanner, deleteBanner } from './actions'
import type { Database } from '@/lib/supabase/types'

type Banner = Database['public']['Tables']['emergency_banner']['Row']

export default async function BannerPage() {
  const supabase = await createClient()
  const { data: banners } = await supabase
    .from('emergency_banner')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-6">임시 공지 관리</h1>

      {/* New banner form */}
      <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 mb-8">
        <h2 className="text-[16px] font-medium mb-4">새 공지 추가</h2>
        <form action={createBanner} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] text-[var(--color-body)] mb-1">공지 내용</label>
            <textarea
              name="message_ko"
              required
              rows={2}
              placeholder="예: 오늘은 사정으로 임시 휴무합니다."
              className="w-full border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] resize-none focus:outline-none focus:border-[var(--color-forest-mid)]"
            />
          </div>
          <div>
            <label className="block text-[13px] text-[var(--color-body)] mb-1">종료 일시 (비워두면 수동 종료)</label>
            <input
              name="expires_at"
              type="datetime-local"
              className="border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[var(--color-forest-mid)]"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-[var(--color-forest)] text-white px-6 py-3 rounded-lg text-[14px] font-medium"
            >
              공지 등록
            </button>
          </div>
        </form>
      </div>

      {/* Banner list */}
      <div className="flex flex-col gap-3">
        {(banners ?? []).map((banner: Banner) => (
          <div
            key={banner.id}
            className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${
              banner.active ? 'border-[var(--color-forest-mid)]' : 'border-[var(--color-hairline)] opacity-60'
            }`}
          >
            <div className="flex-1">
              <p className="text-[14px] text-[var(--color-ink)]">{banner.message_ko}</p>
              {banner.expires_at && (
                <p className="text-[12px] text-[var(--color-body)] mt-1">
                  종료: {new Date(banner.expires_at).toLocaleString('ko-KR')}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <form action={toggleBanner.bind(null, banner.id, !banner.active)}>
                <button
                  type="submit"
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${
                    banner.active
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {banner.active ? '비활성화' : '활성화'}
                </button>
              </form>
              <form action={deleteBanner.bind(null, banner.id)}>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[var(--color-body)] hover:text-red-600"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
        {(banners ?? []).length === 0 && (
          <p className="text-[14px] text-[var(--color-body)]">등록된 공지가 없습니다.</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/banner/ tests/app/admin/banner/
git commit -m "feat(admin): emergency banner management page"
```

---

## Task 9: Media Management Page (Video URL + Hero Images)

**Files:**
- Create: `src/app/admin/media/page.tsx`
- Create: `src/app/admin/media/actions.ts`
- Create: `tests/app/admin/media/actions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/media/actions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { saveVideoUrl } from '@/app/admin/media/actions'

const mockUpsert = vi.fn().mockResolvedValue({ error: null })
const mockClient = {
  from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
})

describe('saveVideoUrl', () => {
  it('upserts chef_video_url and revalidates', async () => {
    const formData = new FormData()
    formData.set('chef_video_url', 'https://www.youtube.com/shorts/newId')

    await saveVideoUrl(formData)

    expect(mockUpsert).toHaveBeenCalledWith(
      [expect.objectContaining({ key: 'chef_video_url', value: 'https://www.youtube.com/shorts/newId' })],
      { onConflict: 'key' },
    )
    expect(revalidateTag).toHaveBeenCalledWith('site_config')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/admin/media/actions.test.ts
```

Expected: FAIL — "Cannot find module '@/app/admin/media/actions'"

- [ ] **Step 3: Create media actions**

Create `src/app/admin/media/actions.ts`:

```typescript
'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveVideoUrl(formData: FormData) {
  const value = formData.get('chef_video_url') as string

  const supabase = await createClient()
  const { error } = await supabase.from('site_config').upsert(
    [{ key: 'chef_video_url', value, updated_at: new Date().toISOString() }],
    { onConflict: 'key' },
  )

  if (error) return { error: error.message }
  revalidateTag('site_config')
}

export async function uploadHeroImage(
  locationKey: 'hero_image_yangjae' | 'hero_image_euljiro',
  formData: FormData,
) {
  const file = formData.get('image') as File
  if (!file || file.size === 0) return { error: '이미지를 선택하세요.' }

  const supabase = await createClient()
  const ext = file.name.split('.').pop()
  const path = `hero/${locationKey}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

  const { error: configError } = await supabase.from('site_config').upsert(
    [{ key: locationKey, value: publicUrl, updated_at: new Date().toISOString() }],
    { onConflict: 'key' },
  )

  if (configError) return { error: configError.message }
  revalidateTag('site_config')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/admin/media/actions.test.ts
```

Expected: PASS — 1 test.

- [ ] **Step 5: Create the media management page**

Create `src/app/admin/media/page.tsx`:

```tsx
import { getSiteConfig } from '@/lib/fetchers/config'
import { saveVideoUrl, uploadHeroImage } from './actions'

export default async function MediaPage() {
  const config = await getSiteConfig()

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-6">미디어 관리</h1>

      {/* Chef video URL */}
      <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 mb-6">
        <h2 className="text-[16px] font-medium mb-4">셰프 추천 영상 URL</h2>
        <p className="text-[13px] text-[var(--color-body)] mb-4">
          YouTube Shorts URL을 붙여넣으세요. (예: https://www.youtube.com/shorts/...)
        </p>
        <form action={saveVideoUrl} className="flex gap-3">
          <input
            name="chef_video_url"
            type="url"
            defaultValue={config['chef_video_url'] ?? ''}
            placeholder="https://www.youtube.com/shorts/..."
            className="flex-1 border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[var(--color-forest-mid)]"
          />
          <button
            type="submit"
            className="bg-[var(--color-forest)] text-white px-5 py-3 rounded-lg text-[14px] font-medium shrink-0"
          >
            저장
          </button>
        </form>
      </div>

      {/* Hero images */}
      {(['yangjae', 'euljiro'] as const).map((location) => {
        const key = `hero_image_${location}` as const
        const label = location === 'yangjae' ? '양재 본점' : '을지로동대문점'
        const currentUrl = config[key]

        return (
          <div key={key} className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 mb-4">
            <h2 className="text-[16px] font-medium mb-3">{label} 대표 이미지</h2>
            {currentUrl && (
              <img
                src={currentUrl}
                alt={`${label} 대표 이미지`}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <form action={uploadHeroImage.bind(null, key)} className="flex gap-3 items-center">
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="text-[13px] text-[var(--color-body)]"
              />
              <button
                type="submit"
                className="bg-[var(--color-forest)] text-white px-5 py-3 rounded-lg text-[14px] font-medium shrink-0"
              >
                업로드
              </button>
            </form>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/media/ tests/app/admin/media/
git commit -m "feat(admin): media management page — video URL + hero image upload"
```

---

## Task 10: Menu Management Page (Edit + Image Upload)

**Files:**
- Create: `src/app/admin/menu/page.tsx`
- Create: `src/app/admin/menu/actions.ts`
- Create: `tests/app/admin/menu/actions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/menu/actions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { updateMenuItem } from '@/app/admin/menu/actions'

const mockEq = vi.fn().mockResolvedValue({ error: null })
const mockClient = {
  from: vi.fn().mockReturnValue({
    update: vi.fn().mockReturnValue({ eq: mockEq }),
  }),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
})

describe('updateMenuItem', () => {
  it('updates menu item fields and revalidates', async () => {
    const formData = new FormData()
    formData.set('id', 'item-uuid')
    formData.set('name_ko', '산청 흑돼지 목살')
    formData.set('price_krw', '25000')
    formData.set('description_ko', '새 설명')

    await updateMenuItem(formData)

    const updateArg = mockClient.from().update.mock.calls[0][0]
    expect(updateArg).toMatchObject({
      name_ko: '산청 흑돼지 목살',
      price_krw: 25000,
      description_ko: '새 설명',
    })
    expect(mockEq).toHaveBeenCalledWith('id', 'item-uuid')
    expect(revalidateTag).toHaveBeenCalledWith('menu')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/admin/menu/actions.test.ts
```

Expected: FAIL — "Cannot find module '@/app/admin/menu/actions'"

- [ ] **Step 3: Create menu actions**

Create `src/app/admin/menu/actions.ts`:

```typescript
'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateMenuItem(formData: FormData) {
  const id = formData.get('id') as string
  const name_ko = formData.get('name_ko') as string
  const description_ko = formData.get('description_ko') as string
  const priceRaw = formData.get('price_krw') as string

  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_items')
    .update({
      name_ko,
      description_ko: description_ko || null,
      price_krw: priceRaw ? parseInt(priceRaw, 10) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidateTag('menu')
}

export async function uploadMenuImage(formData: FormData) {
  const id = formData.get('id') as string
  const file = formData.get('image') as File
  if (!file || file.size === 0) return { error: '이미지를 선택하세요.' }

  const supabase = await createClient()
  const ext = file.name.split('.').pop()
  const path = `menu/${id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

  const { error } = await supabase
    .from('menu_items')
    .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidateTag('menu')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/admin/menu/actions.test.ts
```

Expected: PASS — 1 test.

- [ ] **Step 5: Create the menu management page**

Create `src/app/admin/menu/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { updateMenuItem, uploadMenuImage } from './actions'
import type { Database } from '@/lib/supabase/types'

type MenuItem = Database['public']['Tables']['menu_items']['Row']

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order')

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-6">메뉴 관리</h1>
      <div className="flex flex-col gap-4">
        {(items ?? []).map((item: MenuItem) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-[var(--color-hairline)] p-5"
          >
            <div className="flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="w-20 h-20 bg-[var(--color-canvas-soft)] rounded-lg overflow-hidden shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name_ko} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] text-[var(--color-body)]">
                    이미지 없음
                  </div>
                )}
              </div>
              {/* Edit form */}
              <form action={updateMenuItem} className="flex-1 grid grid-cols-2 gap-3">
                <input type="hidden" name="id" value={item.id} />
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] text-[var(--color-body)] mb-1">메뉴명</label>
                  <input
                    name="name_ko"
                    defaultValue={item.name_ko}
                    className="w-full border border-[var(--color-hairline)] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--color-forest-mid)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--color-body)] mb-1">가격 (원)</label>
                  <input
                    name="price_krw"
                    type="number"
                    defaultValue={item.price_krw ?? ''}
                    className="w-full border border-[var(--color-hairline)] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--color-forest-mid)]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-[var(--color-body)] mb-1">설명</label>
                  <textarea
                    name="description_ko"
                    defaultValue={item.description_ko ?? ''}
                    rows={2}
                    className="w-full border border-[var(--color-hairline)] rounded-lg px-3 py-2 text-[13px] resize-none focus:outline-none focus:border-[var(--color-forest-mid)]"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg text-[13px] font-medium"
                  >
                    저장
                  </button>
                </div>
              </form>
              {/* Image upload form */}
              <form action={uploadMenuImage} className="shrink-0 flex flex-col gap-2">
                <input type="hidden" name="id" value={item.id} />
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="text-[11px] text-[var(--color-body)] max-w-[140px]"
                />
                <button
                  type="submit"
                  className="text-[12px] text-[var(--color-forest-mid)] underline text-left"
                >
                  이미지 업로드
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/menu/ tests/app/admin/menu/
git commit -m "feat(admin): menu management page — edit items + upload images"
```

---

## Task 11: Update Hero.tsx to Read from site_config

**Files:**
- Modify: `src/components/sections/Hero.tsx`

The component currently reads from `COPY_KO` constants. After this task, it reads from `site_config` DB (populated by the admin copy page) with the constants as fallback.

- [ ] **Step 1: Update Hero.tsx**

Replace the full content of `src/components/sections/Hero.tsx`:

```tsx
import Link from 'next/link'
import { getSiteConfig } from '@/lib/fetchers/config'
import { COPY_KO } from '@/lib/constants/brand'

export async function Hero() {
  const config = await getSiteConfig()

  const heroEyebrow = config['hero_eyebrow'] || COPY_KO.heroEyebrow
  const heroH1      = config['hero_h1']      || COPY_KO.heroH1
  const heroSub     = config['hero_sub']      || COPY_KO.heroSub

  const bgImage = config['hero_image_yangjae']

  return (
    <section
      className="relative h-[80vh] md:h-[720px] overflow-hidden bg-[var(--color-stone)] flex items-end"
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-24 pb-16 md:pb-24 flex flex-col gap-4">
        <div className="text-[11px] tracking-[2px] font-mono text-white/80">{heroEyebrow}</div>
        <h1 className="text-[40px] md:text-[64px] font-normal text-white leading-[1.1] max-w-[760px]">{heroH1}</h1>
        <p className="text-[16px] md:text-[18px] text-white/90 leading-relaxed max-w-[560px]">{heroSub}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link href="/#reserve" className="inline-flex items-center justify-center bg-[var(--color-forest)] text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {COPY_KO.heroCtaPrimary}
          </Link>
          <Link href="/menu" className="inline-flex items-center justify-center border border-white text-white px-8 py-4 rounded-[var(--radius-cta)] text-[15px] font-medium">
            {COPY_KO.heroCtaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): read hero copy from site_config DB with COPY_KO fallback"
```

---

## Task 12: Update WhySignature.tsx to Read from site_config

**Files:**
- Modify: `src/components/sections/WhySignature.tsx`

- [ ] **Step 1: Update WhySignature.tsx**

Replace the full content of `src/components/sections/WhySignature.tsx`:

```tsx
import Link from 'next/link'
import { PillarCard } from '@/components/cards/PillarCard'
import { MenuItemCard } from '@/components/cards/MenuItemCard'
import { getSignatureItems } from '@/lib/fetchers/menu'
import { getSiteConfig } from '@/lib/fetchers/config'
import { COPY_KO } from '@/lib/constants/brand'

const PILLAR_ICONS = ['🏔', '⚛', '💨', '🫙']

const PILLAR_DEFAULTS = [
  { title: COPY_KO.pillars[0].title, description: COPY_KO.pillars[0].description },
  { title: COPY_KO.pillars[1].title, description: COPY_KO.pillars[1].description },
  { title: COPY_KO.pillars[2].title, description: COPY_KO.pillars[2].description },
  { title: COPY_KO.pillars[3].title, description: COPY_KO.pillars[3].description },
]

export async function WhySignature() {
  const [items, config] = await Promise.all([
    getSignatureItems(),
    getSiteConfig(),
  ])

  const pillars = PILLAR_DEFAULTS.map((defaults, i) => ({
    icon: PILLAR_ICONS[i],
    title: config[`pillar_${i + 1}_title`] || defaults.title,
    description: config[`pillar_${i + 1}_desc`] || defaults.description,
  }))

  return (
    <section className="bg-[var(--color-canvas-soft)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{COPY_KO.whyEyebrow}</div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3">{COPY_KO.whyH2}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {pillars.map(p => <PillarCard key={p.title} {...p} />)}
        </div>
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h3 className="text-[28px] md:text-[36px] font-normal text-[var(--color-ink)]">{COPY_KO.signatureH2}</h3>
            <Link href="/menu" className="text-[14px] font-medium text-[var(--color-forest-mid)]">{COPY_KO.signatureMore}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.slice(0, 3).map(item => (
              <MenuItemCard
                key={item.id}
                name={item.name_ko}
                description={item.description_ko}
                priceKrw={item.price_krw}
                isSignature={item.is_signature ?? false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WhySignature.tsx
git commit -m "feat(why): read pillar copy from site_config DB with COPY_KO fallback"
```

---

## Self-Review

**Spec coverage:**
- ✅ 문구 (copy): `site_config` table + `/admin/copy` page covers hero + pillar text
- ✅ 이미지 (images): Supabase Storage `media` bucket + `/admin/media` (hero images) + `/admin/menu` (menu item images)
- ✅ 영상 (video): `chef_video_url` in `site_config` + `/admin/media` page
- ✅ Auth: middleware + login page + server-side session check in layout
- ✅ Banner management: `/admin/banner` page with create/toggle/delete
- ✅ Fallback: Hero.tsx and WhySignature.tsx fall back to `COPY_KO` when DB is empty
- ✅ Cache invalidation: all mutations call `revalidateTag` with the appropriate tag

**Placeholder scan:** No TBD or TODO in any code block.

**Type consistency:**
- `getSiteConfig()` returns `Record<string, string>` — consistent across fetcher, pages, components
- `uploadHeroImage(locationKey, formData)` — location key type `'hero_image_yangjae' | 'hero_image_euljiro'` used correctly in the page with `.bind(null, key)`
- `upsertConfig(formData)` — receives `FormData`, consistent across test and action
