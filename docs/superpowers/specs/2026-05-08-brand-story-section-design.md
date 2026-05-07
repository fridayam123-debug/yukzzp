# 브랜드 스토리 섹션 디자인 스펙

> **For agentic workers:** Use `superpowers:writing-plans` to create an implementation plan from this spec.

**Goal:** 메인 LP에 브랜드 스토리 섹션을 추가한다. 창업자 부부(대기업 출신 남편 + 패션디자이너 아내) 스토리와 식재료·기술 철학을 한 섹션에 담는다.

**Placement:** `AuthorityBanner` 아래, `WhySignature` 위 (`src/app/page.tsx`)

---

## 1. 레이아웃

### 데스크탑 (md 이상)
```
┌──────────────────────────────────────────────────┐
│  [텍스트 영역 — 50%]    [사진 영역 — 50%]         │
│  bg: --color-forest     object-fit: cover        │
│  (#1F3D2A)              aspect-ratio: auto       │
└──────────────────────────────────────────────────┘
```
- 텍스트 왼쪽, 사진 오른쪽
- 섹션 높이: 데스크탑 최소 560px, 사진이 높이에 맞게 `object-fit: cover`

### 모바일 (md 미만)
```
┌──────────────────┐
│   [사진 — 100%]  │  aspect-ratio: 4/3
│   [텍스트 — 100%]│  bg: --color-forest, padding 충분히
└──────────────────┘
```
- 사진 위, 텍스트 아래 (세로 스택)

---

## 2. 텍스트 영역 (왼쪽)

```
padding: py-16 md:py-24, px-6 md:px-16 lg:px-20
max-width: 텍스트 가독성 상한 prose-ish (~560px)

eyebrow:  "BRAND STORY"
          11px / font-mono / tracking-[2px] / --color-body (밝은 sage 톤)

H2:       "대기업과 패션이 만나\n탄생한 정직한 다이닝"
          32px(mobile) → 40px(desktop) / font-normal / white (#fff)
          mt-3, max-w-[480px]

단락 1 — 창업 스토리 (임시 카피, 인터뷰 후 교체):
  "대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.
   두 사람이 육즙관리소를 시작한 이유는 단순했습니다.
   자신들이 진짜 먹고 싶은 고기를, 자신들이 대접받고 싶은 방식으로."
  14px / leading-relaxed / color: rgba(255,255,255,0.75) / mt-6

단락 2 — 철학:
  "산청 흑돼지와 거창 백돼지를 산지에서 직계약합니다.
   특허 파동숙성 기술로 육즙을 살리고,
   100% 대나무 숯 직화로 불향을 더합니다.
   재료에 정직한 기술을 더해 한 접시를 완성합니다."
  14px / leading-relaxed / color: rgba(255,255,255,0.75) / mt-4
```

---

## 3. 사진 영역 (오른쪽)

- **파일:** `사진/매장사진/더룸 을지로 동대문/동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (33).jpg`
  - 파동숙성 웨이브 아트월 + 브랜드 로고 기둥 + amber LED 구멍블록 카운터 + POS 단말
- **복사 경로:** `public/photos/brand/brand-story.jpg`
- **렌더링:** `next/image`, `fill` 또는 고정 height, `object-fit: cover`, `object-position: center`
- **alt:** `"육즙관리소 을지로동대문점 입구 카운터 — 프리미엄 흑돼지 다이닝"`
- **교체 시점:** CEO 부부 프로필 사진 촬영 완료 후 동일 경로에 덮어쓰기

---

## 4. 카피 상수 (brand.ts)

`COPY_KO` 에 추가:
```typescript
brandStoryEyebrow: 'BRAND STORY',
brandStoryH2: '대기업과 패션이 만나\n탄생한 정직한 다이닝',
brandStoryP1: '대기업에서 일하던 남편과 패션 디자이너로 활동하던 아내.\n두 사람이 육즙관리소를 시작한 이유는 단순했습니다.\n자신들이 진짜 먹고 싶은 고기를, 자신들이 대접받고 싶은 방식으로.',
brandStoryP2: '산청 흑돼지와 거창 백돼지를 산지에서 직계약합니다.\n특허 파동숙성 기술로 육즙을 살리고,\n100% 대나무 숯 직화로 불향을 더합니다.\n재료에 정직한 기술을 더해 한 접시를 완성합니다.',
```

---

## 5. 신규 파일

### `src/components/sections/BrandStory.tsx`
- 순수 서버 컴포넌트 (async 불필요 — 카피는 상수, 이미지는 로컬)
- `next/image` import
- `COPY_KO` import from `@/lib/constants/brand`
- 구조: `<section>` → `<div className="max-w-[1440px] mx-auto flex flex-col md:flex-row">`
  - 왼쪽: `<div className="... flex flex-col justify-center">` 텍스트
  - 오른쪽: `<div className="relative ... md:w-1/2">` + `<Image>`

---

## 6. 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `src/app/page.tsx` | `import { BrandStory }` 추가, `<AuthorityBanner />` 바로 아래 `<BrandStory />` 삽입 |
| `src/lib/constants/brand.ts` | `COPY_KO`에 `brandStoryEyebrow`, `brandStoryH2`, `brandStoryP1`, `brandStoryP2` 추가 |

---

## 7. 디자인 토큰

기존 토큰 그대로 사용 (신규 토큰 불필요):
- `--color-forest` (#1F3D2A) — 섹션 배경
- `--color-body` (#4A6B52) — eyebrow 텍스트 (forest 위에서 sage 그린으로 읽힘)
- white `#ffffff` — H2
- `rgba(255,255,255,0.75)` — 본문 단락

---

## 8. 향후 교체 계획

| 시점 | 작업 |
|---|---|
| CEO 부부 인터뷰 + 사진 촬영 | `public/photos/brand/brand-story.jpg` 덮어쓰기 |
| 창업 스토리 확정 | `COPY_KO.brandStoryP1` 업데이트 |
| 어드민 연동 (선택) | `site_config`에 `brand_story_p1`, `brand_story_p2` 키 추가하여 DB에서 관리 |

---

## 9. 범위 외 (이 스펙에서 다루지 않음)

- 인스타그램 게시물 고정 기능 — 별도 스펙
- 어드민에서 브랜드 스토리 카피 수정 — Phase 2 어드민 작업과 연계
