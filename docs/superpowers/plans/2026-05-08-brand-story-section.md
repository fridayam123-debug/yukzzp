# Brand Story Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 메인 LP에 `BrandStory` 섹션을 추가한다 — `AuthorityBanner`와 `WhySignature` 사이에, dark forest 배경 + 좌우 분할(텍스트/사진) 레이아웃으로.

**Architecture:** 순수 서버 컴포넌트(async 불필요). 카피는 `COPY_KO` 상수, 사진은 `public/photos/brand/brand-story.jpg` 로컬 파일. `page.tsx`에 한 줄 삽입으로 완성.

**Tech Stack:** Next.js 16 App Router · React 19 · Tailwind v4 CSS 변수 · `next/image`

---

## File Map

| 역할 | 경로 |
|---|---|
| 사진 원본 | `사진/매장사진/더룸 을지로 동대문/동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (33).jpg` |
| 사진 public 배치 | `public/photos/brand/brand-story.jpg` (새로 복사) |
| 카피 상수 | `src/lib/constants/brand.ts` — `COPY_KO` 에 4개 키 추가 |
| 신규 컴포넌트 | `src/components/sections/BrandStory.tsx` (새로 생성) |
| 페이지 배선 | `src/app/page.tsx` — import + render 1줄씩 추가 |

---

## Task 1: 사진 파일 public 폴더에 복사

**Files:**
- Create: `public/photos/brand/brand-story.jpg`

- [ ] **Step 1: 디렉터리 생성 및 파일 복사**

PowerShell에서 실행 (프로젝트 루트 기준):

```powershell
New-Item -ItemType Directory -Force -Path "public\photos\brand"
Copy-Item "사진\매장사진\더룸 을지로 동대문\동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (33).jpg" -Destination "public\photos\brand\brand-story.jpg"
```

- [ ] **Step 2: 복사 확인**

```powershell
Test-Path "public\photos\brand\brand-story.jpg"
```

Expected: `True`

- [ ] **Step 3: 커밋**

```bash
git add public/photos/brand/brand-story.jpg
git commit -m "feat(assets): add brand story photo (euljiro counter)"
```

---

## Task 2: COPY_KO 상수 추가

**Files:**
- Modify: `src/lib/constants/brand.ts:59-60`

`authoritySub` 키 바로 아래(60번째 줄 빈 줄)에 brand story 카피 4개를 삽입한다.

- [ ] **Step 1: `src/lib/constants/brand.ts` 수정**

`authoritySub: '돼지고기 참 잘하는 육즙관리소',` 바로 다음 빈 줄 자리에 아래 블록을 삽입:

```typescript
  brandStoryEyebrow: 'BRAND STORY',
  brandStoryH2: '대기업과 패션이 만나\n탄생한 정직한 다이닝',
  brandStoryP1: '대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.\n두 사람이 육즙관리소를 시작한 이유는 단순했습니다.\n자신들이 진짜 먹고 싶은 고기를, 자신들이 대접받고 싶은 방식으로.',
  brandStoryP2: '산청 흑돼지와 거창 백돼지를 산지에서 직계약합니다.\n특허 파동숙성 기술로 육즙을 살리고,\n100% 대나무 숯 직화로 불향을 더합니다.\n재료에 정직한 기술을 더해 한 접시를 완성합니다.',
```

결과 (수정 후 해당 영역):

```typescript
  authorityEyebrow: 'MEDIA · 셰프 추천',
  authorityH2: '셰프 이원일이 직접 소개한',
  authoritySub: '돼지고기 참 잘하는 육즙관리소',

  brandStoryEyebrow: 'BRAND STORY',
  brandStoryH2: '대기업과 패션이 만나\n탄생한 정직한 다이닝',
  brandStoryP1: '대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.\n두 사람이 육즙관리소를 시작한 이유는 단순했습니다.\n자신들이 진짜 먹고 싶은 고기를, 자신들이 대접받고 싶은 방식으로.',
  brandStoryP2: '산청 흑돼지와 거창 백돼지를 산지에서 직계약합니다.\n특허 파동숙성 기술로 육즙을 살리고,\n100% 대나무 숯 직화로 불향을 더합니다.\n재료에 정직한 기술을 더해 한 접시를 완성합니다.',

  whyEyebrow: 'WHY 육즙관리소',
```

- [ ] **Step 2: TypeScript 타입 에러 없는지 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음 (0 errors)

- [ ] **Step 3: 커밋**

```bash
git add src/lib/constants/brand.ts
git commit -m "feat(copy): add brand story copy constants to COPY_KO"
```

---

## Task 3: BrandStory 컴포넌트 생성

**Files:**
- Create: `src/components/sections/BrandStory.tsx`

이 컴포넌트는 순수 서버 컴포넌트다. `async` 불필요. 카피는 `COPY_KO`, 사진은 `next/image`.

**레이아웃 규칙:**
- 모바일: 사진(위) + 텍스트(아래), 세로 스택 — `flex-col`
- 데스크탑(md+): 텍스트(왼쪽 50%) + 사진(오른쪽 50%) — `md:flex-row`
- 사진은 모바일에서 `order-first`, 데스크탑에서 오른쪽에 자연 순서 → `order-first md:order-last`

- [ ] **Step 1: `src/components/sections/BrandStory.tsx` 생성**

```tsx
import Image from 'next/image'
import { COPY_KO } from '@/lib/constants/brand'

export function BrandStory() {
  return (
    <section className="bg-[var(--color-forest)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[400px] md:min-h-[560px]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24 md:w-1/2">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">
            {COPY_KO.brandStoryEyebrow}
          </div>
          <h2 className="mt-3 text-[32px] md:text-[40px] font-normal text-white max-w-[480px] whitespace-pre-line">
            {COPY_KO.brandStoryH2}
          </h2>
          <p className="mt-6 text-[14px] leading-relaxed text-white/75 whitespace-pre-line">
            {COPY_KO.brandStoryP1}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-white/75 whitespace-pre-line">
            {COPY_KO.brandStoryP2}
          </p>
        </div>
        <div className="relative order-first md:order-last md:w-1/2 aspect-[4/3] md:aspect-auto">
          <Image
            src="/photos/brand/brand-story.jpg"
            alt="육즙관리소 을지로동대문점 입구 카운터 — 프리미엄 흑돼지 다이닝"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript 에러 없는지 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/components/sections/BrandStory.tsx
git commit -m "feat(sections): add BrandStory server component"
```

---

## Task 4: page.tsx에 BrandStory 배선

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: import 추가**

`page.tsx` 상단 import 블록에 한 줄 추가.

현재:
```tsx
import { AuthorityBanner } from '@/components/sections/AuthorityBanner'
import { WhySignature } from '@/components/sections/WhySignature'
```

수정 후:
```tsx
import { AuthorityBanner } from '@/components/sections/AuthorityBanner'
import { BrandStory } from '@/components/sections/BrandStory'
import { WhySignature } from '@/components/sections/WhySignature'
```

- [ ] **Step 2: JSX에 `<BrandStory />` 삽입**

현재:
```tsx
        <AuthorityBanner />
        <WhySignature />
```

수정 후:
```tsx
        <AuthorityBanner />
        <BrandStory />
        <WhySignature />
```

- [ ] **Step 3: dev 서버에서 시각 확인**

dev 서버가 이미 실행 중이라면 `http://localhost:3000` (또는 3001) 새로고침.

확인 체크리스트:
- [ ] 셰프 영상 섹션 바로 아래에 dark forest 배경 섹션이 보인다
- [ ] 데스크탑: 왼쪽에 텍스트, 오른쪽에 매장 사진
- [ ] 모바일 (DevTools 375px): 사진 위, 텍스트 아래
- [ ] eyebrow `BRAND STORY`, H2 2줄, 본문 단락 2개 렌더링 확인
- [ ] 사진 로드 오류(404) 없음 — 브라우저 콘솔 확인

- [ ] **Step 4: TypeScript + lint 최종 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/app/page.tsx
git commit -m "feat(page): wire BrandStory section between AuthorityBanner and WhySignature"
```

---

## 셀프리뷰 체크리스트 (구현자용)

스펙 [`docs/superpowers/specs/2026-05-08-brand-story-section-design.md`](../specs/2026-05-08-brand-story-section-design.md) 대조:

| 스펙 요구 | 구현 위치 | 확인 |
|---|---|---|
| AuthorityBanner 아래, WhySignature 위 배치 | Task 4 Step 2 | - |
| dark forest 배경 | Task 3 Step 1 `bg-[var(--color-forest)]` | - |
| 데스크탑 50/50 좌우 분할 | Task 3 Step 1 `md:w-1/2` | - |
| 모바일 세로 스택 (사진 위) | Task 3 Step 1 `flex-col` + `order-first` | - |
| eyebrow / H2 / P1 / P2 카피 | Task 2 + Task 3 | - |
| 사진 `(33).jpg` → `public/photos/brand/brand-story.jpg` | Task 1 | - |
| `next/image` + alt 텍스트 | Task 3 Step 1 | - |
| TypeScript 에러 없음 | Task 2 Step 2, Task 3 Step 2, Task 4 Step 4 | - |
