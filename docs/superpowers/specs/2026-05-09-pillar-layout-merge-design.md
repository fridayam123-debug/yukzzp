---
title: WhySignature 4-약속 레이아웃 (그릴링+덕트 통합) 디자인 스펙
date: 2026-05-09
brand: 육즙관리소 (yukzzp)
status: 사장님 확정 — 구현 계획 단계 진입
authors: 기획자(Claude) + 사장님 합의
related_specs:
  - docs/superpowers/specs/2026-05-08-yukzzp-color-system-design.md
  - docs/superpowers/specs/2026-05-06-yukzzp-website-design.md
target_files:
  - src/components/sections/WhySignature.tsx (PILLARS 배열 + 그리드 클래스 + 카피)
  - src/lib/constants/brand.ts (COPY_KO.whyH2)
references_used:
  - LV 청담 메종 — 모바일 2-up / 데스크탑 4-up 카드 그리드 패턴
  - Pantone 5+1 컬러 시스템 (인접 스펙)
---

# WhySignature 4-약속 레이아웃 디자인 스펙

## 0. 한 단락 요약

현재 5개 PillarCard ("다섯 가지 약속")는 모바일 2-up 그리드에 *2의 배수 아님* — 마지막 카드가 홀로 남아 어색. **3번째 "하향식 덕트(竹)"와 5번째 "전문 그릴링 서비스(火)" 를 단일 카드로 통합**하여 4개로 축소. 모바일 2×2 / 데스크탑 4-col 정확한 그리드 수학 확보. 통합 카드는 *그릴링 경험*이라는 단일 USP 메시지로 강화 — 두 약속이 분리됐을 때보다 콘텐츠 임팩트 ↑. 카피는 "다섯 가지" → "**네 가지 약속**" 으로 갱신. JS 의존 없는 Tailwind 정공법.

---

## 1. 결정 배경

### 1-1. 문제

[`WhySignature.tsx:18-30`](src/components/sections/WhySignature.tsx) 에서 `lg:grid-cols-5` 사용 중. 모바일 (375px) 에서 `grid-cols-1`로 collapse 되어 5장 세로 스택 → *총 ~2,170px* 길이의 한 섹션. 사장님이 LV 패턴(데스크탑 4-up, 모바일 2-up) 적용 의도 → 5는 2의 배수가 아니라 마지막 1개 *고립*.

### 1-2. 검토된 5가지 해법

| 옵션 | 요약 | 평가 |
|---|---|---|
| A | 4+1 Editorial Hero (5번째만 풀-너비) | 가능, 그러나 *5번째에 인위적 위계* 부여 |
| B | 6번째 추가 → 2×3 | 필러 위험 |
| C | 모바일 캐러셀 | JS lib + 미발견 위험 5-15% |
| D | 3+2 비대칭 | 데스크탑 비대칭 모호 |
| **E** ★ | **그릴링+덕트 통합 → 4개 2×2** | **사장님 제안 · 가장 깔끔** |

### 1-3. 옵션 E 채택 사유

- 그릴링 (火) 과 덕트 (竹) 는 *같은 그릴링 경험* USP — 분리됐을 때 메시지 약함
- 통합 후 단일 카드가 *가장 풍부한 콘텐츠*로 자연스러운 핵심 USP 작동
- 그리드 수학 100% 깔끔 (4 = 2² = 2×2 mobile, 4×1 desktop)
- JS 의존 X
- 카피 변경 1곳 ("다섯 가지" → "네 가지")

---

## 2. 최종 4-약속 명세

| # | Hanja | 제목 | 본문 | ordinal |
|---|---|---|---|---|
| 1 | **材** | 가장 좋은 식재료 | (기존 본문 유지) | 첫번째 |
| 2 | **熟** | 특허 파동숙성 | (기존 본문 유지) | 두번째 |
| 3 | **火** ★ | **전문 그릴링 + 대나무 숯** (통합) | **전문 서버가 직접 구워드립니다. 100% 대나무 숯 + 하향식 덕트로 연기·냄새 차단.** | 세번째 |
| 4 | **饌** | 직접 담근 정성찬 | (기존 본문 유지) | 네번째 |

### 2-1. 통합 카드 (#3) 세부

**제목**: `전문 그릴링 + 대나무 숯`
- 두 USP (서버 직접 그릴링 + 100% 대나무 숯) 명시
- SEO·검색 친화 (사용자가 "대나무 숯 고기집" 검색 가능성)

**본문** (35자):
> 전문 서버가 직접 구워드립니다. 100% 대나무 숯 + 하향식 덕트로 연기·냄새 차단.

- 첫 문장 = *서비스 핵심* (서버 직접 그릴링)
- 둘째 문장 = *환경* (숯·덕트)
- 형용사 절제 (LV 헤리티지 voice 정합)

**Hanja**: `火` (불)
- 그릴링·대나무 숯·열기 모두 포괄
- 가장 직관적 문자
- 기존 5번째 카드 Hanja 그대로 유지 (자산 재활용)

**제거되는 자산**:
- 기존 3번째 카드 Hanja `竹` (대나무) → 본문 텍스트로 흡수 ("100% 대나무 숯")
- 기존 5번째 카드 (전문 그릴링 서비스) → 통합

---

## 3. 레이아웃 — 반응형 그리드

### 3-1. Tailwind 그리드 클래스 (변경)

```tsx
// 기존
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">

// 신규 (옵션 E)
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
```

**주요 변경**:
- `grid-cols-1` (모바일 default) → `grid-cols-2` ★ 모바일에서 즉시 2-up
- `sm:grid-cols-2` 제거 (이미 default가 2-up)
- `lg:grid-cols-5` → `lg:grid-cols-4` (5→4 카드 수 변경)
- `gap-6` → `gap-4 md:gap-6` (모바일에선 좁게, 데스크탑에선 그대로)

### 3-2. 카드 사이즈 (자동 계산)

| 디바이스 | 그리드 | 카드 폭 | 카드 높이 (참고) |
|---|---|---|---|
| 모바일 (375px) | 2-col | (375 - 48 padding - 16 gap) / 2 = 155px | ~340px (text wrap) |
| 태블릿 (768px) | 2-col | ~336px | ~410px |
| 데스크탑 (≥1024px) | 4-col | ~280px | ~430px |

**중요**: 모바일 카드 폭 155px는 좁음. PillarCard의 한자 크기 (62px) + 제목 (20px font-bold) 가 그대로면 텍스트가 *자주 wrap*. 다음 절에서 카드 내부 반응형 처리.

### 3-3. PillarCard 내부 반응형 (수정 권고)

[`PillarCard.tsx:13`](src/components/cards/PillarCard.tsx) — 현재 `px-5 pt-12 pb-5` 고정. 모바일에서 좁은 폭에 맞춰:

```tsx
// 기존: 고정 패딩
className="... px-5 pt-12 pb-5 ..."

// 신규: 모바일 컴팩트
className="... px-3 md:px-5 pt-10 md:pt-12 pb-4 md:pb-5 ..."
```

**제목 사이즈** (LV 원칙 weight 400 + 사이즈):
```tsx
// 기존
<h3 className="text-[20px] font-bold ...">

// 신규
<h3 className="text-[16px] md:text-[20px] font-normal tracking-[-0.005em] leading-[1.25] ...">
```

(LV 미학 적용 — `font-bold` 폐기, weight 400 + 사이즈로 위계)

**Hanja 사이즈** (모바일 살짝 줄임):
```tsx
// 기존
className="text-[62px] ..."

// 신규
className="text-[44px] md:text-[62px] ..."
```

---

## 4. 카피 변경

### 4-1. `src/lib/constants/brand.ts` `COPY_KO.whyH2`

```typescript
// 기존
whyH2: '다섯 가지 약속',

// 신규
whyH2: '네 가지 약속',
```

### 4-2. `WhySignature.tsx` PILLARS 배열

```tsx
// 신규 4-element 배열
const PILLARS = [
  {
    icon: '材',
    title: '가장 좋은 식재료',
    description: '...(기존 본문 유지)...'
  },
  {
    icon: '熟',
    title: '특허 파동숙성',
    description: '...(기존 본문 유지)...'
  },
  {
    icon: '火',  // ★ 통합 — 기존 #3 (竹) 와 #5 (火) 자리 흡수
    title: '전문 그릴링 + 대나무 숯',
    description: '전문 서버가 직접 구워드립니다. 100% 대나무 숯 + 하향식 덕트로 연기·냄새 차단.',
  },
  {
    icon: '饌',
    title: '직접 담근 정성찬',
    description: '...(기존 본문 유지)...'
  },
]
```

### 4-3. ordinal 배열 변경

```tsx
// 기존
ordinal={['첫번째', '두번째', '세번째', '네번째', '다섯번째'][i]}

// 신규
ordinal={['첫번째', '두번째', '세번째', '네번째'][i]}
```

(또는 `ordinal` prop 자체를 PillarCard 에서 props로 받으면서 불필요 — 검토)

---

## 5. 영향 범위 (변경 안 되는 것)

다음 파일/요소는 *변경 없음*:
- `tokens.css` (컬러/스페이싱)
- `Header.tsx` / `Footer.tsx`
- 기타 LP 섹션 (Hero, Authority, TwoLocations, Group, Reservation, Instagram)
- 메뉴/지점 페이지
- Supabase 스키마

---

## 6. 마이그레이션 리스크

### 6-1. SEO — "다섯 가지" 검색어 손실
- 현재 페이지는 dev 환경. 운영 배포 전 → SEO 영향 없음.
- 사장님 인스타·카카오 채널에서 "다섯 가지 약속" 사용 중이면 점진적 갱신 필요.

### 6-2. 기존 인스타 자산
- 만약 기존 IG 게시물에 "다섯 가지" 카피 있으면 *변경 권장하되 강제 X*.
- 신규 IG 콘텐츠부터 "네 가지" 통일.

### 6-3. PillarCard.tsx 내부 변경 = 다른 곳에 영향?
- 사용처 grep: `PillarCard` 는 `WhySignature.tsx` 에서만 사용 (단일 사용처).
- 안전.

### 6-4. ordinal 5번째 → 4번째 보존
- "네번째" 가 마지막. "다섯번째" 카피 자산 없음 (개별 카드 본문에만 있던 ordinal).
- 변경 안전.

---

## 7. 시각 검증 (옵션 E mockup)

```
모바일 (375px)              데스크탑 (1440px)
┌──────────────┐            ┌──────────────────────────┐
│ 첫번째 두번째 │            │ 첫    두    세    네     │
│ 材    熟    │            │ 材    熟    火    饌     │
├──────────────┤            └──────────────────────────┘
│ 세번째 네번째│              4-col flat row
│ 火    饌    │              "네 가지 약속"
└──────────────┘
"네 가지 약속"
```

(상세 시각: `C:\Users\pc\AppData\Local\Temp\yukzzp\option_e.png`)

---

## 8. 구현 작업 (writing-plans 단계로)

### 8-1. 작업 목록 (예상 — writing-plans에서 정밀화)

1. `src/lib/constants/brand.ts` — `COPY_KO.whyH2` "다섯 가지" → "네 가지"
2. `src/components/sections/WhySignature.tsx` — PILLARS 배열 5→4 (3·5 통합), ordinal 5→4, grid 클래스 변경
3. `src/components/cards/PillarCard.tsx` — 모바일 반응형 패딩 + 제목 weight 400 + Hanja 사이즈 반응형
4. (선택) Snapshot test for PillarCard at mobile/desktop breakpoints
5. 라이브 검증 (preview_inspect at 375px + 1440px)

### 8-2. 예상 소요
- 코드 변경: 30-45분
- 테스트: 30분 (선택)
- 라이브 검증: 10분
- **총 1-1.5시간**

---

## 9. 다음 단계

1. **사장님 검토** — 이 스펙 문서 전체
2. **수정 반영** (필요 시)
3. **`writing-plans` 스킬 호출** — 이 스펙을 기반으로 정밀 구현 계획서 작성
4. **빌드** — 코드 변경 + 라이브 검증 + 커밋

---

## 변경 이력

- 2026-05-09: 초안 작성. 옵션 E (그릴링+덕트 통합 → 4약속) 사장님 확정. 통합 본문 옵션 B 채택. Hanja 火 그대로.
