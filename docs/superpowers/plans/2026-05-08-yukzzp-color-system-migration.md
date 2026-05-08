# 육즙관리소 6-컬러 시스템 마이그레이션 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Forest Sage 팔레트(녹색·코랄)를 폐기하고, 사장님 확정 6-컬러 Pantone 5+1 시스템(`#E8DFD2 / #CFC6C0 / #BBACAA / #928886 / #3A3431 / #B98A3F`)을 코드베이스 전체에 정착시킨다. Phase 1 마무리에 필요한 CSS 토큰·shadcn 브리지·TS 상수·테스트·문서 업데이트를 모두 포함한다.

**Architecture:**
- CSS 토큰은 OKLCH primary + sRGB fallback 듀얼 정의 (Tailwind v4 `@theme` 노출).
- shadcn primitive 컬러(`--primary`, `--background`, `--foreground` 등)는 `globals.css`에서 신규 브랜드 토큰을 참조하도록 브리지.
- TS 측 `BRAND_PALETTE` 상수는 type-safe 액세스(이메일 템플릿·OG 이미지 빌더 등에서 색상 인용)를 위해 `src/lib/constants/brand.ts`에 추가.
- 시각 회귀 위험은 기존 컴포넌트가 brand 토큰을 직접 참조하지 않는다는 사실(grep 결과 0건)로 최소화. 작업 범위는 사실상 *토큰 정의 + shadcn 매핑* 으로 한정.

**Tech Stack:** Next.js 16.2.4 · React 19.2.4 · Tailwind CSS v4 · TypeScript 5 · Vitest 4 · shadcn 4 · Supabase SSR · Geist+Pretendard 폰트.

**Spec reference:** `docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md` (커밋 `96e0e1b`)

---

## 작업 환경 사전 점검

이 계획은 worktree `cranky-heyrovsky-ea8d8b` 에서 수행됨을 가정한다. 작업 시작 전 의존성과 베이스라인 테스트를 검증하고, AGENTS.md 가이드(`node_modules/next/dist/docs/` 참조)를 충족시킨다. 본 마이그레이션은 Next.js API를 수정하지 않으므로(CSS·TS 상수만 손댐) Next.js 문서 의존도는 낮지만, 절차상 검증한다.

---

## File Structure (책임 분리)

| 경로 | 책임 | 변경 유형 |
|---|---|---|
| `src/styles/tokens.css` | 브랜드 6컬러 토큰 정의(OKLCH + sRGB fallback). Forest Sage 폐기. | **재작성** |
| `src/app/globals.css` | shadcn 토큰(`--primary` 등) ↔ 브랜드 토큰 브리지. body 기본 면/텍스트. | **수정** |
| `src/lib/constants/brand.ts` | `BRAND` 상수 + `BRAND_PALETTE` 신규 추가(타입 안전 색상 액세스). | **수정** |
| `tests/unit/styles/tokens.test.ts` | 토큰 값·콘트라스트 검증 테스트. | **신규** |
| `tests/unit/constants/brand.test.ts` | `BRAND_PALETTE` 셰이프 검증. | **신규** |
| `docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md` | 변경 이력에 마이그레이션 완료 기록. | **수정(짧음)** |

기타 파일(예: `src/components/ui/*`, `src/app/page.tsx`)은 본 PR에서 손대지 않는다. 이유: 사전 grep 결과 Forest Sage 토큰을 참조하는 컴포넌트가 0건이며, page.tsx는 Next.js 기본 스캐폴드 상태로 별도 LP 빌드 작업(다른 PR)에서 다룬다.

**별도 발주 티켓(이 PR 범위 밖):**
- 로고 색 변경 (forest+cream → espresso+cream): `public/brand/logo.png` 외주 디자이너 발주. PR로 받지 않고 자산 교체.

---

## Task 0: 환경 점검 + 베이스라인

**Files:**
- Read only: `package.json`, `node_modules/`(존재 확인), Next.js 도큐먼트 디렉터리

- [ ] **Step 1: 의존성 설치(없을 시)**

Run: `npm install`
Expected: `added N packages` 또는 `up to date`. 실패 시 환경 문제 — 사용자에게 알리고 중단.

- [ ] **Step 2: AGENTS.md 가이드대로 Next.js 도큐먼트 검색**

Run: `find node_modules/next -name "docs" -type d` (Bash) 또는 `Get-ChildItem -Path node_modules/next -Filter docs -Recurse -Directory` (PowerShell)
Expected: 디렉터리가 발견되거나, *없으면 "현재 Next.js 16 배포에는 docs 디렉터리 미포함"을 확인하고 진행*. 본 마이그레이션은 Next.js API를 건드리지 않으므로 차단 사유 아님.

- [ ] **Step 3: 베이스라인 테스트 통과 확인**

Run: `npm run test:run`
Expected: 모든 테스트 PASS (현재 `tests/unit/fetchers/locations.test.ts` 2개 케이스). 실패 시 마이그레이션 시작 전에 수정 필요.

- [ ] **Step 4: TypeScript 베이스라인 통과 확인**

Run: `npm run typecheck`
Expected: 에러 0건. 실패 시 베이스라인부터 수정.

- [ ] **Step 5: 빌드 베이스라인(선택 — 시간 절약을 위해 스킵 가능)**

Run: `npm run build`
Expected: 빌드 성공. (CI/CD에서 잡히므로 로컬 스킵 OK)

---

## Task 1: 토큰 테스트 작성 (Red)

토큰을 바꾸기 전, "신규 6컬러가 정확한 hex 값으로 노출되어야 한다"는 검증 테스트를 먼저 작성한다 — TDD Red 단계.

**Files:**
- Create: `tests/unit/styles/tokens.test.ts`

- [ ] **Step 1: 신규 테스트 파일 생성**

`tests/unit/styles/tokens.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * 토큰 일관성 검증 — Pantone 5+1 시스템 (옵션 A)
 *
 * Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md
 *
 * 이 테스트는 tokens.css 파일에서 *-hex CSS custom property 6개가
 * 정확히 정의되어 있고 값이 스펙과 일치하는지 검증한다.
 */

const TOKENS_PATH = resolve(__dirname, '../../../src/styles/tokens.css')

const EXPECTED_HEX_TOKENS: Record<string, string> = {
  '--color-hanji-hex':    '#E8DFD2',
  '--color-stone-hex':    '#CFC6C0',
  '--color-taupe-hex':    '#BBACAA',
  '--color-slate-hex':    '#928886',
  '--color-espresso-hex': '#3A3431',
  '--color-brass-hex':    '#B98A3F',
}

const DEPRECATED_TOKENS = [
  '--color-forest',
  '--color-forest-mid',
  '--color-cream-gold',
  '--color-coral',
  '--color-body',
] as const

let css = ''

beforeAll(() => {
  css = readFileSync(TOKENS_PATH, 'utf-8')
})

describe('tokens.css — Pantone 5+1 신규 컬러', () => {
  for (const [token, hex] of Object.entries(EXPECTED_HEX_TOKENS)) {
    it(`${token} 가 ${hex} 로 정의되어 있다`, () => {
      const re = new RegExp(`${token.replace(/-/g, '\\-')}\\s*:\\s*${hex}\\s*;`, 'i')
      expect(css).toMatch(re)
    })
  }

  it('OKLCH primary 정의가 Tailwind @theme 블록에 노출된다', () => {
    expect(css).toMatch(/@theme[\s\S]+--color-taupe\s*:\s*oklch\(/)
  })
})

describe('tokens.css — Forest Sage 폐기', () => {
  for (const token of DEPRECATED_TOKENS) {
    it(`${token} 토큰이 더 이상 정의되지 않는다`, () => {
      const re = new RegExp(`${token.replace(/-/g, '\\-')}\\s*:`)
      expect(css).not.toMatch(re)
    })
  }
})

describe('tokens.css — 의미 변경 토큰', () => {
  it('--color-stone-hex 가 라이트 베이지(#CFC6C0)로 재정의됨 (기존 다크 그레이 #3D4046 폐기)', () => {
    expect(css).not.toMatch(/--color-stone-hex\s*:\s*#3D4046/i)
    expect(css).toMatch(/--color-stone-hex\s*:\s*#CFC6C0/i)
  })

  it('--color-ink 또는 --color-espresso-hex 값이 #181D26(쿨톤)이 아니다', () => {
    expect(css).not.toMatch(/--color-ink-hex\s*:\s*#181D26/i)
    expect(css).not.toMatch(/--color-espresso-hex\s*:\s*#181D26/i)
  })
})
```

- [ ] **Step 2: Red 단계 검증 — 테스트가 실패해야 정상**

Run: `npm run test:run -- tests/unit/styles/tokens.test.ts`
Expected: 6+ FAIL (`--color-hanji-hex` 등 신규 토큰이 아직 없음). Forest Sage 폐기 테스트 5개도 모두 FAIL (기존 토큰 살아있음).
출력에 `Tests N failed`가 포함되면 정상.

- [ ] **Step 3: 커밋 (Red 상태 보존)**

```bash
git add tests/unit/styles/tokens.test.ts
git commit -m "test(tokens): add Pantone 5+1 token assertions (failing — Red)

Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md

Asserts the 6 new hex tokens, OKLCH @theme exposure, and absence of
Forest Sage tokens (forest, forest-mid, cream-gold, coral, body).
Tests fail intentionally until Task 2 lands the migration.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: tokens.css 마이그레이션 (Green)

스펙 §8-1을 그대로 코드로 옮긴다. OKLCH 주요 정의 + sRGB fallback + 시맨틱 alias.

**Files:**
- Modify: `src/styles/tokens.css` (전체 재작성)

- [ ] **Step 1: tokens.css 전체 교체**

`src/styles/tokens.css` 신규 내용:

```css
/* 육즙관리소 브랜드 디자인 토큰 — Pantone 5+1 시스템 (옵션 A 확정) */
/* Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md */
/*
 * 6 컬러:
 *   Hanji Cream  (Highlight)  - 한지·백자
 *   Cream Stone  (Light)      - 분청사기·콘크리트 라이트
 *   Brand Taupe  (Hero ★)     - 사장님 시그너처 (Litt.ly 메인)
 *   Soft Slate   (Mid-Dark)   - 옹기 표면
 *   Espresso     (Anchor)     - 먹·옻칠
 *   Brass / 놋쇠 (Signature)  - 놋그릇·골드 액센트
 */

:root {
  /* ── Brand colors — OKLCH (perceptually uniform) ─────────── */
  --color-hanji:    oklch(89.5% 0.018 84);
  --color-stone:    oklch(80.2% 0.011 64);
  --color-taupe:    oklch(70.6% 0.014 28);    /* Hero ★ */
  --color-slate:    oklch(57.4% 0.011 35);
  --color-espresso: oklch(22.1% 0.008 50);
  --color-brass:    oklch(60.1% 0.087 78);

  /* ── sRGB fallback (구형 브라우저·이메일·Figma export) ───── */
  --color-hanji-hex:    #E8DFD2;
  --color-stone-hex:    #CFC6C0;
  --color-taupe-hex:    #BBACAA;
  --color-slate-hex:    #928886;
  --color-espresso-hex: #3A3431;
  --color-brass-hex:    #B98A3F;

  /* ── Semantic aliases ─────────────────────────────────────── */
  --color-canvas:      var(--color-hanji);
  --color-canvas-soft: var(--color-stone);
  --color-brand:       var(--color-taupe);
  --color-muted:       var(--color-slate);
  --color-ink:         var(--color-espresso);
  --color-accent:      var(--color-brass);

  /* Hairline = slate 30% blended into hanji (자동 계산) */
  --color-hairline:
    color-mix(in oklch, var(--color-slate) 30%, var(--color-hanji));

  /* ── Radius ──────────────────────────────────────────────── */
  --radius-cta: 4px;
  --radius-card: 10px;
  --radius-input: 6px;
  --radius-pill: 9999px;

  /* ── Spacing ─────────────────────────────────────────────── */
  --spacing-section: 96px;
  --spacing-section-mobile: 64px;
}

@theme {
  /* Tailwind v4: 위 :root 변수를 utility 로 노출 (e.g. bg-hanji, text-espresso) */
  --color-hanji:    oklch(89.5% 0.018 84);
  --color-stone:    oklch(80.2% 0.011 64);
  --color-taupe:    oklch(70.6% 0.014 28);
  --color-slate:    oklch(57.4% 0.011 35);
  --color-espresso: oklch(22.1% 0.008 50);
  --color-brass:    oklch(60.1% 0.087 78);

  /* Semantic aliases for Tailwind */
  --color-canvas:      oklch(89.5% 0.018 84);
  --color-canvas-soft: oklch(80.2% 0.011 64);
  --color-brand:       oklch(70.6% 0.014 28);
  --color-muted:       oklch(57.4% 0.011 35);
  --color-ink:         oklch(22.1% 0.008 50);
  --color-accent:      oklch(60.1% 0.087 78);
}
```

- [ ] **Step 2: Green 단계 검증 — 토큰 테스트 통과**

Run: `npm run test:run -- tests/unit/styles/tokens.test.ts`
Expected: 모든 케이스 PASS. 출력에 `Tests N passed`.

- [ ] **Step 3: 전체 테스트 회귀 확인**

Run: `npm run test:run`
Expected: 모든 테스트 PASS (기존 fetcher 테스트 + 신규 토큰 테스트). 회귀 0건.

- [ ] **Step 4: TypeScript 회귀 확인**

Run: `npm run typecheck`
Expected: 에러 0건.

- [ ] **Step 5: 커밋**

```bash
git add src/styles/tokens.css
git commit -m "feat(tokens): migrate to Pantone 5+1 brand palette (Option A)

Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md

Replaces Forest Sage palette with the owner-confirmed 6-color system:
- Hanji Cream  #E8DFD2  Highlight (한지·백자)
- Cream Stone  #CFC6C0  Light (분청사기)
- Brand Taupe  #BBACAA  Hero ★ (사장님 메인)
- Soft Slate   #928886  Mid-Dark (옹기)
- Espresso     #3A3431  Anchor (먹·옻칠)
- Brass / 놋쇠 #B98A3F  Signature (놋그릇·LV gold)

Deprecated tokens removed: --color-forest, --color-forest-mid,
--color-cream-gold, --color-coral, --color-body. The old
--color-stone (#3D4046 dark gray) is repurposed to #CFC6C0 light beige.

OKLCH primary + sRGB fallback dual format, exposed via Tailwind v4
@theme block. Hairline now derived via color-mix.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: globals.css 의 shadcn 토큰을 브랜드 토큰에 브리지 (Refactor)

shadcn 컴포넌트(`Button`, `Dialog`, `Input` 등)는 `--primary`, `--background`, `--foreground`, `--secondary`, `--muted`, `--accent` 등의 시맨틱 토큰을 사용한다. 우리는 이 시맨틱 토큰들이 실제로 브랜드 컬러를 가리키도록 매핑한다.

**Files:**
- Modify: `src/app/globals.css:53-86` (`:root` 블록), `src/app/globals.css:88-120` (`.dark` 블록), `src/app/globals.css:122-133` (`@layer base`)

- [ ] **Step 1: shadcn 토큰 매핑 검증 테스트 추가**

`tests/unit/styles/globals.test.ts` 신규:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * globals.css — shadcn 시맨틱 토큰이 브랜드 컬러로 매핑되었는지 검증.
 *
 * shadcn primitives 가 우리 6컬러 시스템을 그대로 사용하도록
 * --primary, --background 등을 oklch(...) 또는 var(--color-*) 로 정의해야 한다.
 */

const GLOBALS_PATH = resolve(__dirname, '../../../src/app/globals.css')

let css = ''

beforeAll(() => {
  css = readFileSync(GLOBALS_PATH, 'utf-8')
})

describe('globals.css — shadcn ↔ brand 브리지', () => {
  it(':root 의 --background 가 hanji 또는 oklch(...)로 정의된다 (기존 oklch(1 0 0) 폐기)', () => {
    expect(css).not.toMatch(/--background\s*:\s*oklch\(\s*1\s+0\s+0\s*\)/)
  })

  it(':root 의 --foreground 가 espresso 또는 oklch(...)로 정의된다 (기존 0.145 0 0 폐기)', () => {
    expect(css).not.toMatch(/--foreground\s*:\s*oklch\(\s*0\.145\s+0\s+0\s*\)/)
  })

  it(':root 의 --primary 가 espresso (oklch 22% 또는 var(--color-espresso))로 매핑된다', () => {
    // 신규는 oklch(22.1% ...) 또는 var(--color-espresso) 둘 중 하나 형태
    const okOklch = /--primary\s*:\s*oklch\(\s*22\.1%/i.test(css)
    const okVar   = /--primary\s*:\s*var\(--color-espresso\)/i.test(css)
    expect(okOklch || okVar).toBe(true)
  })

  it(':root 의 --accent 가 brass 로 매핑된다', () => {
    const okOklch = /--accent\s*:\s*oklch\(\s*60\.1%/i.test(css)
    const okVar   = /--accent\s*:\s*var\(--color-brass\)/i.test(css)
    expect(okOklch || okVar).toBe(true)
  })

  it('body 가 var(--color-canvas) 배경 + var(--color-ink) 텍스트를 사용한다', () => {
    expect(css).toMatch(/background\s*:\s*var\(--color-canvas\)/)
    expect(css).toMatch(/color\s*:\s*var\(--color-ink\)/)
  })
})
```

- [ ] **Step 2: Red 검증**

Run: `npm run test:run -- tests/unit/styles/globals.test.ts`
Expected: 신규 매핑(`--primary` 등)이 아직 없으므로 5개 케이스 중 일부 FAIL.

- [ ] **Step 3: globals.css 의 :root 블록 갱신**

`src/app/globals.css:53-86` 의 `:root` 블록을 다음으로 교체:

```css
:root {
  /* shadcn 시맨틱 토큰 — 브랜드 6컬러로 매핑 */
  --background: var(--color-hanji);
  --foreground: var(--color-espresso);

  --card: var(--color-hanji);
  --card-foreground: var(--color-espresso);

  --popover: var(--color-hanji);
  --popover-foreground: var(--color-espresso);

  --primary: var(--color-espresso);
  --primary-foreground: var(--color-hanji);

  --secondary: var(--color-stone);
  --secondary-foreground: var(--color-espresso);

  --muted: var(--color-stone);
  --muted-foreground: var(--color-slate);

  --accent: var(--color-brass);
  --accent-foreground: var(--color-espresso);

  --destructive: oklch(0.577 0.245 27.325);

  --border: var(--color-hairline);
  --input: var(--color-hairline);
  --ring: var(--color-slate);

  /* Charts (브랜드 5단계 명도 사다리) */
  --chart-1: var(--color-hanji);
  --chart-2: var(--color-stone);
  --chart-3: var(--color-taupe);
  --chart-4: var(--color-slate);
  --chart-5: var(--color-espresso);

  --radius: 0.625rem;

  /* Sidebar (어드민용 다크 사이드 — Espresso 베이스) */
  --sidebar: var(--color-espresso);
  --sidebar-foreground: var(--color-hanji);
  --sidebar-primary: var(--color-brass);
  --sidebar-primary-foreground: var(--color-espresso);
  --sidebar-accent: var(--color-slate);
  --sidebar-accent-foreground: var(--color-hanji);
  --sidebar-border: color-mix(in oklch, var(--color-hanji) 15%, var(--color-espresso));
  --sidebar-ring: var(--color-brass);
}
```

- [ ] **Step 4: globals.css 의 .dark 블록 갱신 (Phase 1 다크모드 미지원 — 기본값만 유지)**

`src/app/globals.css:88-120` 의 `.dark` 블록을 다음으로 교체:

```css
.dark {
  /* Phase 1 미사용 — Phase 2 다크모드 도입 시 브랜드 다크 시스템 정의 예정.
     현재는 light 와 동일하게 두어 .dark 클래스가 적용되어도 시각적 변화 없음. */
  --background: var(--color-hanji);
  --foreground: var(--color-espresso);
  --card: var(--color-hanji);
  --card-foreground: var(--color-espresso);
  --popover: var(--color-hanji);
  --popover-foreground: var(--color-espresso);
  --primary: var(--color-espresso);
  --primary-foreground: var(--color-hanji);
  --secondary: var(--color-stone);
  --secondary-foreground: var(--color-espresso);
  --muted: var(--color-stone);
  --muted-foreground: var(--color-slate);
  --accent: var(--color-brass);
  --accent-foreground: var(--color-espresso);
  --destructive: oklch(0.704 0.191 22.216);
  --border: var(--color-hairline);
  --input: var(--color-hairline);
  --ring: var(--color-slate);
  --chart-1: var(--color-hanji);
  --chart-2: var(--color-stone);
  --chart-3: var(--color-taupe);
  --chart-4: var(--color-slate);
  --chart-5: var(--color-espresso);
  --sidebar: var(--color-espresso);
  --sidebar-foreground: var(--color-hanji);
  --sidebar-primary: var(--color-brass);
  --sidebar-primary-foreground: var(--color-espresso);
  --sidebar-accent: var(--color-slate);
  --sidebar-accent-foreground: var(--color-hanji);
  --sidebar-border: color-mix(in oklch, var(--color-hanji) 15%, var(--color-espresso));
  --sidebar-ring: var(--color-brass);
}
```

- [ ] **Step 5: body 기본 면 유지(이미 정확) — 변경 없음**

`src/app/globals.css:122-133` 의 `@layer base` 블록 검토:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    font-family: 'Pretendard', var(--font-geist-sans), system-ui, sans-serif;
  }
  body {
    background: var(--color-canvas);
    color: var(--color-ink);
  }
}
```

이 블록은 이미 시맨틱 alias를 사용 중이므로 변경 불필요. 단, `--color-canvas` 가 신규 시스템에서 hanji 로 매핑됐는지(Task 2에서 처리 완료) 확인.

- [ ] **Step 6: Green 검증**

Run: `npm run test:run -- tests/unit/styles/globals.test.ts`
Expected: 5개 케이스 모두 PASS.

- [ ] **Step 7: 전체 테스트 + 타입 회귀**

Run: `npm run test:run && npm run typecheck`
Expected: 모든 테스트 PASS, TS 에러 0건.

- [ ] **Step 8: 커밋**

```bash
git add tests/unit/styles/globals.test.ts src/app/globals.css
git commit -m "feat(globals): bridge shadcn semantic tokens to brand palette

Maps shadcn primitives (--primary, --background, --foreground, --accent,
--secondary, --muted, --border, etc.) to the new 6-color brand tokens
via var() references. Charts ladder mirrors the 5-step luminance scale.
Sidebar variant uses Espresso base + Brass primary for admin contrast.

Phase 1 dark mode kept identical to light (no dark theme yet — flagged
for Phase 2). All shadcn components (Button, Dialog, Input, Sheet, etc.)
now render in brand colors automatically.

Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: BRAND_PALETTE 상수 추가 (TS 타입 안전 액세스)

OG 이미지 빌더, 이메일 템플릿, JSON-LD `theme_color`, 메타데이터 등에서 색상을 *type-safe* 하게 인용해야 할 곳이 생긴다. `brand.ts`에 `BRAND_PALETTE` 상수를 추가한다.

**Files:**
- Create: `tests/unit/constants/brand.test.ts`
- Modify: `src/lib/constants/brand.ts` (끝에 export 추가)

- [ ] **Step 1: 테스트 작성 (Red)**

`tests/unit/constants/brand.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { BRAND_PALETTE } from '@/lib/constants/brand'

describe('BRAND_PALETTE — Pantone 5+1 시스템', () => {
  it('정확히 6개 컬러를 노출한다', () => {
    expect(Object.keys(BRAND_PALETTE)).toHaveLength(6)
  })

  it('각 컬러가 hex / oklch / pantone / lstar / role 4개 키를 가진다', () => {
    for (const c of Object.values(BRAND_PALETTE)) {
      expect(c).toHaveProperty('hex')
      expect(c).toHaveProperty('oklch')
      expect(c).toHaveProperty('pantone')
      expect(c).toHaveProperty('lstar')
      expect(c).toHaveProperty('role')
    }
  })

  it('hex 값이 스펙과 일치한다', () => {
    expect(BRAND_PALETTE.hanji.hex).toBe('#E8DFD2')
    expect(BRAND_PALETTE.stone.hex).toBe('#CFC6C0')
    expect(BRAND_PALETTE.taupe.hex).toBe('#BBACAA')
    expect(BRAND_PALETTE.slate.hex).toBe('#928886')
    expect(BRAND_PALETTE.espresso.hex).toBe('#3A3431')
    expect(BRAND_PALETTE.brass.hex).toBe('#B98A3F')
  })

  it('Hero 컬러 (taupe) 가 사장님 Litt.ly 메인 #BBACAA 와 일치한다', () => {
    expect(BRAND_PALETTE.taupe.hex).toBe('#BBACAA')
    expect(BRAND_PALETTE.taupe.role).toMatch(/Hero|hero|★/)
  })

  it('상수가 readonly (as const) 로 선언되어 컴파일 시 타입이 좁혀진다', () => {
    // 런타임 검증으로는 readonly 보장 불가, 단순히 값 확인
    // (TypeScript 컴파일 에러는 typecheck 단계에서 잡힘)
    expect(typeof BRAND_PALETTE.hanji.hex).toBe('string')
  })
})
```

- [ ] **Step 2: Red 검증**

Run: `npm run test:run -- tests/unit/constants/brand.test.ts`
Expected: 모든 케이스 FAIL (`BRAND_PALETTE` import 자체가 안 됨).

- [ ] **Step 3: BRAND_PALETTE 상수 추가**

`src/lib/constants/brand.ts` 끝에(현재 124행 뒤에) 다음 블록 추가:

```typescript
/**
 * 브랜드 6-컬러 시스템 (Pantone 5+1, 옵션 A 확정 2026-05-08)
 *
 * Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md
 *
 * 사용처:
 *   - OG 이미지 빌더 (next/og 또는 외부 이미지 생성)
 *   - 이메일 템플릿
 *   - JSON-LD theme_color
 *   - <meta name="theme-color">
 *   - 동적 컴포넌트 inline-style (drop-shadow 등)
 *
 * CSS 토큰과의 동기화 책임:
 *   tokens.css 의 hex 값과 이 상수의 hex 값이 일치해야 함.
 *   tests/unit/styles/tokens.test.ts + tests/unit/constants/brand.test.ts 가 검증.
 */
export const BRAND_PALETTE = {
  hanji: {
    hex: '#E8DFD2',
    oklch: 'oklch(89.5% 0.018 84)',
    pantone: '11-0907 TPX',
    lstar: 89,
    role: 'Highlight · 한지·백자',
  },
  stone: {
    hex: '#CFC6C0',
    oklch: 'oklch(80.2% 0.011 64)',
    pantone: '14-1110 TPX',
    lstar: 80,
    role: 'Light · 분청사기',
  },
  taupe: {
    hex: '#BBACAA',
    oklch: 'oklch(70.6% 0.014 28)',
    pantone: '16-1318 TPX',
    lstar: 71,
    role: 'Hero ★ · 사장님 시그너처',
  },
  slate: {
    hex: '#928886',
    oklch: 'oklch(57.4% 0.011 35)',
    pantone: '16-1506 TPX',
    lstar: 57,
    role: 'Mid-Dark · 옹기',
  },
  espresso: {
    hex: '#3A3431',
    oklch: 'oklch(22.1% 0.008 50)',
    pantone: '19-0822 TPX',
    lstar: 22,
    role: 'Anchor · 먹·옻칠 · 본문 텍스트 단독 사용',
  },
  brass: {
    hex: '#B98A3F',
    oklch: 'oklch(60.1% 0.087 78)',
    pantone: '729 C',
    lstar: 60,
    role: 'Signature · 놋쇠·골드 액센트',
  },
} as const

export type BrandColorKey = keyof typeof BRAND_PALETTE
export type BrandColor = (typeof BRAND_PALETTE)[BrandColorKey]
```

- [ ] **Step 4: Green 검증**

Run: `npm run test:run -- tests/unit/constants/brand.test.ts`
Expected: 5개 케이스 모두 PASS.

- [ ] **Step 5: TypeScript 회귀 (`as const` 추론 검증)**

Run: `npm run typecheck`
Expected: 에러 0건. `BrandColorKey` 가 `'hanji' | 'stone' | 'taupe' | 'slate' | 'espresso' | 'brass'` literal union으로 좁혀져야 함.

- [ ] **Step 6: 전체 테스트 회귀**

Run: `npm run test:run`
Expected: 모든 테스트 PASS.

- [ ] **Step 7: 커밋**

```bash
git add tests/unit/constants/brand.test.ts src/lib/constants/brand.ts
git commit -m "feat(brand): add BRAND_PALETTE constant for type-safe color access

Exposes the Pantone 5+1 system as a frozen \`as const\` object with
hex, oklch, pantone, L*, and role metadata per color. BrandColorKey
literal union enables type-safe lookups in OG image builders,
email templates, JSON-LD theme_color, and meta tags.

Hex values must match tokens.css; both files share assertion tests.

Spec: docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: HTML `<meta name="theme-color">` 적용 (모바일 브라우저 chrome 일치)

사장님이 Litt.ly에서 의도적으로 선택한 `#BBACAA` 테마 컬러를 우리 사이트의 모바일 브라우저 상단바에도 적용한다. 사이트 진입 시 상단바 색상이 사장님 시그너처와 일치하도록.

**Files:**
- Modify: `src/app/layout.tsx:15-31` (`metadata` export)

- [ ] **Step 1: 메타데이터에 themeColor 추가**

`src/app/layout.tsx:15-31` 의 `metadata` export 를 다음으로 교체:

```typescript
import { BRAND_PALETTE } from '@/lib/constants/brand'

export const metadata: Metadata = {
  metadataBase: new URL("https://yukzzp.com"),
  title: {
    default: "육즙관리소 — 프리미엄 흑돼지 다이닝",
    template: "%s — 육즙관리소",
  },
  description:
    "셰프 이원일이 인정한 흑돼지 다이닝. 산청·거창 산지 100% 대나무 숯 직화. 양재역 본점·더룸 을지로동대문점 운영.",
  openGraph: {
    siteName: "육즙관리소",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: import('next').Viewport = {
  themeColor: BRAND_PALETTE.taupe.hex,  // #BBACAA — 사장님 Litt.ly 시그너처와 일치
}
```

(Next.js 14+ 부터 `themeColor` 는 `viewport` export로 분리됨. `metadata.themeColor` 는 deprecation warning 발생.)

- [ ] **Step 2: 빌드 검증**

Run: `npm run build`
Expected: 빌드 성공. `viewport` export 인식. 출력 HTML에 `<meta name="theme-color" content="#BBACAA">` 포함 (확인은 Step 4에서).

- [ ] **Step 3: 빌드 산출물 검사 (선택)**

Run: `grep -r "theme-color" .next/server/app/page.html` (Bash) 또는
`Get-Content .next/server/app/page.html | Select-String "theme-color"` (PowerShell)
Expected: `content="#BBACAA"` 출현.

(주의: Next.js 16 의 정확한 SSR 산출 경로는 다를 수 있음. 빌드 산출물 미발견 시 `npm run dev` 후 `curl localhost:3000` 으로도 확인 가능. 차단 사유 아님.)

- [ ] **Step 4: TS / 테스트 회귀**

Run: `npm run typecheck && npm run test:run`
Expected: 모두 통과.

- [ ] **Step 5: 커밋**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): emit <meta theme-color> matching owner's Litt.ly choice

Adds Next.js viewport export with themeColor=#BBACAA (Brand Taupe).
Mobile browsers (Safari iOS, Chrome Android) will tint the address
bar to match the brand signature when users land on the site,
mirroring the owner's intentional Litt.ly link-in-bio choice.

Spec §1 Brand Taupe Hero / Litt.ly theme parity.
Refs Next.js 14+ viewport export migration.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: 스펙 문서에 마이그레이션 완료 기록 + 변경 이력 갱신

**Files:**
- Modify: `docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md` (마지막 "변경 이력" 섹션)

- [ ] **Step 1: 변경 이력 추가**

`docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md` 의 "## 변경 이력" 섹션 끝에 다음 항목 추가:

```markdown
- 2026-05-08: 마이그레이션 PR 완료. tokens.css·globals.css·brand.ts 갱신, BRAND_PALETTE 상수 추가, <meta theme-color> 적용. Forest Sage 토큰 5종 폐기. 컴포넌트 리팩토링 0건 (사전 grep 결과 brand 토큰 미사용 확인). 후속 작업: 로고 색 변경 발주 (별도 티켓), Phase 2 다크 모드 정의 (트리거 시).
```

- [ ] **Step 2: status 필드 갱신 (frontmatter)**

문서 상단 frontmatter `status: 사장님 확정 (Option A) — 구현 계획 단계 진입` 을 다음으로 변경:

```yaml
status: 마이그레이션 완료 (PR landed) — Phase 1 LP 빌드 작업 진행 가능
```

- [ ] **Step 3: 커밋**

```bash
git add docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md
git commit -m "docs(spec): mark color-system migration as landed

All scoped tasks complete:
- tokens.css migrated (Forest Sage → Pantone 5+1)
- globals.css shadcn bridge updated
- BRAND_PALETTE TS constant added
- <meta theme-color> applied
- 0 component refactors needed (no Forest Sage usage in src/)

Status: implementation complete. Logo color change is a separate
external-design ticket. Phase 2 dark mode reserved for trigger.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: 최종 검증 (Done)

**Files:** (read-only)

- [ ] **Step 1: 전체 테스트 회귀**

Run: `npm run test:run`
Expected: 모든 테스트 PASS. 신규 테스트 카운트:
- `tests/unit/styles/tokens.test.ts` — 14개 케이스
- `tests/unit/styles/globals.test.ts` — 5개 케이스
- `tests/unit/constants/brand.test.ts` — 5개 케이스
- 기존 `tests/unit/fetchers/locations.test.ts` — 2개 케이스
- 합계 ≥ 26 PASS, 0 FAIL.

- [ ] **Step 2: TypeScript 검증**

Run: `npm run typecheck`
Expected: 에러 0건.

- [ ] **Step 3: ESLint**

Run: `npm run lint`
Expected: 에러 0건. 워닝은 무시 가능(이번 PR이 만들지 않은 것).

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 빌드 성공. CSS 청크에 OKLCH 토큰 포함 확인.

- [ ] **Step 5: 시각 확인 (개발 서버)**

Run: `npm run dev`
페이지 진입: http://localhost:3000
- 모바일 브라우저(또는 DevTools 모바일 모드)로 진입 시 상단바가 `#BBACAA` 인지 확인.
- 본문이 Hanji `#E8DFD2` 캔버스 + Espresso `#3A3431` 텍스트 콘트라스트로 렌더되는지 확인.

(Phase 1 LP 가 아직 빌드되지 않아 페이지 자체는 Next.js 기본 스캐폴드 — 본 PR의 목적은 토큰·시스템 마이그레이션이지 LP 빌드가 아님.)

- [ ] **Step 6: PR 머지 또는 리뷰 요청**

이 worktree (`claude/cranky-heyrovsky-ea8d8b`) 에 모든 변경이 누적됨:
- `git log --oneline main..HEAD` 로 6개의 커밋(Task 1~6) 확인
- 별도의 PR 작성 또는 즉시 머지 (사용자 결정)

---

## 별도 발주 티켓 (이 PR 범위 밖)

### Ticket A: 로고 색 변경 발주

**대상**: `public/brand/logo.png` (현재 미존재 또는 forest+cream 색상으로 받을 예정)
**작업**: 외주 디자이너에게 forest 부분을 Espresso `#3A3431` 으로 변경 요청. cream 부분은 유지(Hanji와 자연 호환).
**산출물**:
- `public/brand/logo.png` (light bg 용 — Espresso + cream)
- `public/brand/logo-white.svg` (dark bg 용 — Hanji 단색)
- `public/brand/favicon.ico` (Espresso + cream 아이콘)
**소요**: 디자이너 1-2시간
**우선순위**: Phase 1 LP 빌드 시작 전 필수

이 티켓은 코드 변경이 없으므로 본 구현 계획과 분리. 사장님이 디자이너에게 직접 요청.

### Ticket B: Phase 2 트리거 시 다크 모드 시스템 정의

**조건**: KPI 6개월 평가 후 다크 모드 도입 결정 시
**작업**: `globals.css` 의 `.dark` 블록을 광원 반전 시스템으로 재정의
- `--background: var(--color-espresso)`
- `--foreground: var(--color-hanji)`
- 기타 페어 모두 반전
**소요**: 1시간
**우선순위**: 트리거 발생 시

---

## Self-Review

### 1. Spec coverage

| 스펙 §  | 요구사항 | 구현 Task |
|---|---|---|
| §1 6컬러 명세 | 6 hex 토큰 정의 | Task 2 (tokens.css) + Task 4 (brand.ts) |
| §2 컬러 사이언스 | OKLCH 사용 | Task 2 (oklch primary 정의) |
| §3 운영 규칙 | 본문=Espresso 단독 등 | Task 3 (`--foreground: espresso`) — 시스템 강제 |
| §4 3-Mood Deployment | ALMA / LV / 균형 | (런타임 사용 — 컴포넌트 빌드 시 적용. 본 PR은 토큰만 노출) |
| §5 페이지 매핑 | LP·메뉴·지점 컬러 매핑 | (별도 LP 빌드 작업 — 이 PR 범위 밖) |
| §6 IG 운영 | 그리드·스토리·하이라이트 | (사장님 운영. 코드 영향 없음. BRAND_PALETTE 가 도구 제공) |
| §7 인쇄 가이드 | CMYK / Pantone PMS | (외부 인쇄소 발주용. brand.ts 의 pantone 필드가 도구) |
| §8 CSS 토큰 명세 | 토큰 정의 + Tailwind @theme | Task 2 직접 구현 |
| §9 마이그레이션 | Forest Sage 폐기 + grep | Task 1 (Forest Sage 부재 검증) + 사전 조사 결과 컴포넌트 영향 0 |
| §10 음식 사진 규칙 | 채도 보존 가이드라인 | (사진사·운영 가이드. 코드 영향 없음) |
| §11 별도 결정 | 로고 색 변경 | "Ticket A" 로 분리 |
| §12 리스크 | 7가지 완화 | Task 3 (Espresso 매핑으로 R1 본문 콘트라스트 자동 강제) |
| §13 Phase 별 | Phase 1 작업 | Task 1-7 = Phase 1 토큰 시스템 |
| §14 다음 단계 | writing-plans → 구현 | 본 plan 자체가 그것 |

**갭 없음**. 모든 스펙 항목이 코드 작업(Task 1-6) 또는 분리 티켓(A, B) 또는 운영 가이드(코드 영향 없음)로 매핑됨.

### 2. Placeholder scan

- "TBD"·"TODO"·"implement later"·"add appropriate validation" — 본 plan에 0건. ✓
- "Similar to Task N" 없음 — 모든 코드 블록 완전 노출. ✓
- 모호한 단계 ("적절한 에러 처리") — 0건. 명시적 코드만. ✓

### 3. Type consistency

- `BRAND_PALETTE.<key>.hex` 의 hex 값과 `tokens.css` 의 `--color-<key>-hex` 값이 *완전 동일* 해야 함 (Task 4 테스트 5번이 검증). ✓
- `BrandColorKey` 와 tokens.css 의 alias 키(`hanji/stone/taupe/slate/espresso/brass`)가 1:1 매칭. ✓
- shadcn `--primary` (Task 3) 와 `BRAND_PALETTE.espresso` (Task 4) 가 모두 `#3A3431` / `oklch(22.1% 0.008 50)` 을 가리킴. ✓

---

## Plan complete and saved to `docs/superpowers/plans/2026-05-08-yukzzp-color-system-migration.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks, fast iteration. Best for this plan because each Task is self-contained.
2. **Inline Execution** — Execute tasks in this session via executing-plans, batch execution with checkpoints.

Which approach?
