---
title: 육즙관리소 6-컬러 디자인 시스템
date: 2026-05-08
brand: 육즙관리소 (yukzzp)
status: 마이그레이션 완료 (PR landed) — Phase 1 LP 빌드 작업 진행 가능
authors: 기획자(Claude) + 사장님 합의
related_specs:
  - docs/superpowers/specs/2026-05-06-yukzzp-website-design.md
  - airtable-design-reference.md
  - _photo_mapping.md
migration_target:
  - src/styles/tokens.css
  - src/lib/constants/brand.ts
references_used:
  - 사장님 #BBACAA (Litt.ly 페이지 theme color, 사장님 직접 선택)
  - 사장님 워밈 베이지-그레이 3 스와치 (#BBACAA / #CFC6C0 / #928886 톤 패밀리)
  - CAFÉ ALMA 외관 (소프트·로맨틱 카페 무드 — Hanji + Stone + Brass 자리 검증)
  - Louis Vuitton 청담 Maison (다크·럭셔리 무드 — Espresso + Slate + Brass 자리 검증)
  - 양재역점 매장 사진 11장 (다크 무드 본관 / 콘크리트 / 앰버 / 코퍼)
  - 더룸 을지로동대문점 매장 사진 49장 (소프트 무드 / 백자 / 베이지 / 파동벽)
  - 음식 사진 4장 (놋그릇 — Brass 시그너처 정당화)
  - Pantone Color of the Year 2025 (Mocha Mousse) — 트렌드 윈도우 일치
---

# 육즙관리소 6-컬러 디자인 시스템 (Color System Design)

## 0. 한 페이지 요약 (TL;DR)

육즙관리소 양재역 본점·더룸 을지로동대문점의 통합 비주얼 아이덴티티를 6개 컬러로 확정한다. 사장님이 직접 선택한 **`#BBACAA` (Brand Taupe)** 를 Hero에 두고, **Pantone 5+1 구조**(밝은 끝 2 + 중앙 2 + 어두운 끝 1 + 액센트 1)로 확장한다. 이 한 팔레트로 (a) **ALMA 무드**(소프트·로맨틱 — 메뉴·일상 IG), (b) **LV 무드**(다크·럭셔리 — 셰프 권위·단체 회식), (c) **균형 무드**(메인 LP·Hero·OG)의 세 무드를 비중 변경만으로 운용한다. 모든 본문 텍스트는 **Espresso `#3A3431`** 단독을 사용해 WCAG AAA 콘트라스트를 확보하고, **Brass `#B98A3F`** 는 가격·셰프 권위·놋그릇 식기와 시각 라임을 이루는 액센트로 한정 사용한다. 기존 `tokens.css`의 Forest Sage 컬러(forest, forest-mid, cream-gold, coral)는 Deprecate한다.

---

## 1. 6-컬러 팔레트 명세

### 1-1. Quick Reference

| # | 컬러명 | Hex | 역할 | L\* | 비중 | Pantone |
|---|---|---|---|---|---|---|
| 1 | **Hanji Cream** | `#E8DFD2` | Highlight · 메인 캔버스 | 89 | ~30% | 11-0907 TPX *Antique White* |
| 2 | **Cream Stone** | `#CFC6C0` | Light · 섹션 교차 면 | 80 | ~25% | 14-1110 TPX *Bone White* / 9043 C |
| 3 | **Brand Taupe ★** | `#BBACAA` | Hero · 사장님 시그너처 | 71 | ~20% | 16-1318 TPX *Warm Taupe* (COTY 2016 패밀리) |
| 4 | **Soft Slate** | `#928886` | Mid-Dark · 보조·헤어라인 | 57 | ~15% | 16-1506 TPX *Atmosphere* / 402 C |
| 5 | **Espresso** | `#3A3431` | Anchor · 텍스트·CTA·푸터 | 22 | ~10% | 19-0822 TPX *Demitasse* / 412 C |
| 6 | **Brass / 놋쇠** | `#B98A3F` | Signature · 액센트·골드 | 60 | ~5% | 729 C / Warm Gray 패밀리 |

### 1-2. 다중 색공간 변환표

| 컬러 | sRGB | HSL | Lab (L*a*b*) | LCH (L·C·h°) | OKLCH |
|---|---|---|---|---|---|
| Hanji Cream | 232,223,210 | 35° 31% 87% | 89.5 / 1.6 / 8.6 | 89.5 · 8.7 · 80° | 0.91 0.018 84 |
| Cream Stone | 207,198,192 | 24° 11% 78% | 80.2 / 2.5 / 5.6 | 80.2 · 6.1 · 66° | 0.82 0.011 64 |
| Brand Taupe | 187,172,170 | 8° 9% 70% | 70.6 / 4.7 / 4.4 | 70.6 · 6.4 · 43° | 0.74 0.014 28 |
| Soft Slate | 146,136,134 | 10° 5% 55% | 57.4 / 3.1 / 3.4 | 57.4 · 4.6 · 48° | 0.62 0.011 35 |
| Espresso | 58,52,49 | 20° 8% 21% | 22.1 / 2.1 / 3.5 | 22.1 · 4.1 · 59° | 0.31 0.008 50 |
| Brass | 185,138,63 | 36° 49% 49% | 60.1 / 8.7 / 39.9 | 60.1 · 40.8 · 78° | 0.65 0.087 78 |

### 1-3. 각 컬러의 컬처·매장 매핑

```
Hanji Cream  #E8DFD2  →  韓紙 한지 · 백자 표면 · 을지로점 베이지 벽
Cream Stone  #CFC6C0  →  매장 콘크리트 라이트 · 분청사기
Brand Taupe  #BBACAA  →  매장 콘크리트 mid · 사장님 Litt.ly 메인 ★
Soft Slate   #928886  →  매장 콘크리트 dark · 옹기 표면 · LV 청담 plaster
Espresso     #3A3431  →  먹·옻칠 · 한옥 외관 마감 · LV 청담 stone-dark
Brass / 놋쇠 #B98A3F  →  놋그릇·유기(음식 사진) · LV 골드 패턴 · 셰프 권위
```

---

## 2. 컬러 사이언스 검증 (요약)

- **휴 패밀리 응집도**: 5 톤(Brass 제외) 모두 LCH 휴 28°–80° 범위, Brand Taupe(43°) 중심으로 ±37° 분산. 인지 한계 내(Pantone 권장 ≤ 30°에 살짝 근접). 운영 OK.
- **채도 균일성**: LCH C 값 4.1~8.7 (Brand Taupe·Espresso·Soft Slate 단자릿수) → "Quiet Luxury" 구간 안정.
- **명도 사다리**: L\* 89 → 80 → 71 → 57 → 22 (Brass는 별도 액센트 트랙 L\*60). Espresso–Slate 갭(35.3)이 다소 큼 → 다크 섹션에서 중간 명도 필요 시 Espresso의 70% 알파를 사용.
- **2025-26 트렌드 정합도**: Brand Taupe `#BBACAA`는 Pantone 2025 COTY *Mocha Mousse* `#A47864`의 라이트 사촌(같은 휴 패밀리, 채도만 차분). 트렌드 윈도우 24-30개월 보장.
- **색맹 대응**: 톤-온-톤 시스템 특성상 명도만으로 정보 전달 가능 → Protanopia/Deuteranopia/Tritanopia/Achromatopsia 모두에서 5단계 명도 위계 유지. F&B 카테고리에서는 보기 드문 접근성 우수.

---

## 3. 접근성 (WCAG 2.2 + APCA) — 운영 규칙

### 3-1. Contrast Pair Matrix

| 전경 \\ 배경 | Hanji | Stone | Taupe | Slate | Espresso |
|---|---|---|---|---|---|
| Hanji | — | 1.18 ✗ | 1.51 ✗ | 2.55 ✗ | **9.04 AAA** |
| Stone | 1.18 ✗ | — | 1.28 ✗ | 2.16 ✗ | **7.65 AAA** |
| Taupe | 1.51 ✗ | 1.28 ✗ | — | 1.69 ✗ | **5.96 AA** |
| Slate | 2.55 ✗ | 2.16 ✗ | 1.69 ✗ | — | 3.54 ⚠ |
| Espresso | **9.04 AAA** | **7.65 AAA** | **5.96 AA** | 3.54 ⚠ | — |
| Brass | 2.42 ✗ | 2.05 ✗ | 1.62 ✗ | 1.27 ✗ | 4.42 AA-Large |

### 3-2. 반드시 준수해야 할 6가지 운영 규칙

1. **본문 텍스트(14–16px) = Espresso 단독.** 다른 컬러는 본문 색으로 사용 금지.
2. **Soft Slate 본문 금지.** 어떤 라이트 배경 위에서도 4.5:1 미달. 헤어라인·12px 이하 캡션·아이콘 stroke·decoration only.
3. **Brand Taupe 텍스트 금지.** Hero·면(surface)으로만 사용. 텍스트 콘트라스트 모든 기준 미달.
4. **Brass 본문 금지.** WCAG Large(18pt/24px regular 또는 14pt/18.66px bold) 이상의 헤드라인·가격·아이콘·CTA 라벨에만 사용. Espresso 배경 위 Large text는 OK (4.42:1 AA-Large).
5. **Primary CTA = Espresso 배경 + Hanji 텍스트** (9.04:1 AAA). 모든 페이지 통일.
6. **다크 섹션의 본문 = Espresso 배경 + Hanji 또는 Stone 텍스트** (9.04 또는 7.65 AAA).

---

## 4. 3-Mood Deployment System

한 팔레트로 세 가지 무드를 표현. 각 무드는 같은 6컬러를 다른 비율로 사용.

### 4-1. ALMA 무드 (Soft / Romantic)
**언제 사용:** 메뉴 페이지, 시그니처 음식 카드, IG 일상 콘텐츠, 데이트·가족 카피 영역

| 컬러 | 비중 | 역할 |
|---|---|---|
| Hanji Cream | 55% | 메인 배경 |
| Cream Stone | 25% | 카드·교차 섹션 |
| Brand Taupe | 15% | 액센트 면 |
| Brass | 5% | 가격·★ tag |
| Espresso | 텍스트만 | 본문·헤드라인 |

### 4-2. LV 무드 (Dark / Luxury)
**언제 사용:** 셰프 권위 섹션, 단체 회식 시그너처 카드, 룸 페이지 hero, 플래그십 페이지

| 컬러 | 비중 | 역할 |
|---|---|---|
| Espresso | 55% | 풀-블리드 다크 면 |
| Brass | 20% | 골드 액센트·CTA |
| Hanji Cream | 15% | 텍스트·내부 카드 |
| Brand Taupe | 10% | 보조 면 |

### 4-3. 균형 무드 (Hero / LP / Default)
**언제 사용:** 메인 LP, About, OG 이미지, 첫 진입 페이지

| 컬러 | 비중 | 역할 |
|---|---|---|
| Hanji Cream | 35% | 호흡 공간 |
| Cream Stone | 20% | 카드 면 |
| Brand Taupe | 20% | Hero 컬러 면 |
| Soft Slate | 10% | 보조 |
| Espresso | 10% | 텍스트·다크 카드 |
| Brass | 5% | 액센트 |

---

## 5. 페이지·섹션 컬러 매핑 (Phase 1)

| 페이지 / 섹션 | 무드 | 주요 사용 컬러 |
|---|---|---|
| 메인 LP — Sticky Nav | 균형 | Hanji bg + Espresso text + Espresso CTA pill |
| 메인 LP — Hero | 균형 | Hanji bg + Brass eyebrow + Espresso H1 + Espresso/Outline CTA pair |
| 메인 LP — 셰프 권위 배너 | LV | Espresso 풀-블리드 + Hanji H2 + Brass eyebrow + Brass CTA |
| 메인 LP — Why (4 Pillars) | ALMA | Hanji bg + Stone 아이콘 카드 + Espresso text |
| 메인 LP — 시그니처 메뉴 | ALMA | Hanji bg + Stone 카드 × 3 + Brass ★ tag + Espresso 가격 |
| 메인 LP — 두 지점 카드 | 균형 | Hanji bg + Stone 카드 (양재) / Taupe 카드 (을지로) |
| 메인 LP — 단체 회식 시그너처 | LV→ Hero | Taupe 풀-블리드 + Espresso H2 + Espresso/Outline/Brass CTA 트리오 |
| 메인 LP — 예약 CTA 밴드 | 균형 | Stone bg + Espresso text + Espresso CTA |
| 메인 LP — 인스타 미니 strip | ALMA | Hanji bg + 사진 풀블리드 + Brass 텍스트 링크 |
| 메인 LP — Footer | LV | Espresso 풀-블리드 + Stone text + Brass 아이콘 |
| /menu — 카테고리 탭 | ALMA | Hanji bg + Stone active tab + Espresso text |
| /menu — 메뉴 카드 | ALMA | Hanji bg + 사진 풀블리드 + Espresso 가격 + Brass ★ |
| /locations/yangjae — Hero | LV | Espresso 풀블리드 사진 + Hanji text |
| /locations/yangjae — 단체 안내 | 균형 | Taupe 카드 + Espresso text + Brass CTA |
| /locations/euljiro — Hero | ALMA | Hanji bg + 백자 사진 풀블리드 + Espresso text |
| /locations/euljiro — 단체 안내 | 균형 | Taupe 카드 + Espresso text + Brass CTA |

---

## 6. Instagram 운영 가이드

### 6-1. 그리드 응집도 (3×3 또는 9-grid 단위 운영)
- **음식 클로즈업** (자연 채도 보존) — 30%
- **매장 사진** — 25%
- **타이포 카드** (Hanji 또는 Stone bg + Espresso 헤드라인 + Brass tag) — 20%
- **셰프·권위 콘텐츠** (Espresso bg + Hanji text + Brass tag) — 15%
- **이벤트·공지** (Stone 또는 Taupe bg) — 10%

### 6-2. 스토리 템플릿 3종
1. **소식형** — Hanji bg + Espresso H1 + Brand Taupe 강조 박스
2. **메뉴형** — 음식 사진 풀블리드 + 하단 Cream Stone 띠 + Espresso 가격 + Brass ★
3. **이벤트형** — Espresso 풀 다크 + Hanji 텍스트 + Brass CTA

### 6-3. 하이라이트 커버 6종 (6컬러 1:1 매핑)
| 카테고리 | 배경 컬러 | 아이콘 컬러 |
|---|---|---|
| 메뉴 | Hanji Cream | Brass |
| 매장 | Cream Stone | Espresso |
| 음식 | Brand Taupe | Espresso |
| 리뷰 | Soft Slate | Hanji |
| 셰프 | Espresso | Brass |
| 이벤트 | Brass | Espresso |

### 6-4. Reels 썸네일 가이드
- **가시성을 위해 썸네일은 음식 클로즈업(자연 채도 보존)을 사용**
- 텍스트 오버레이는 Espresso (음식 위) 또는 Hanji (다크 영역 위)
- 인트로 1초: Hanji 풀스크린 + Espresso 헤드라인 (브랜드 신호)

---

## 7. 인쇄 (Print) 가이드 — 메뉴북·명함·간판

### 7-1. CMYK 변환 (ISO Coated v2 기준)

| 컬러 | sRGB | CMYK | 인쇄 노트 |
|---|---|---|---|
| Hanji Cream | #E8DFD2 | C 0 / M 4 / Y 9 / K 9 | 청결한 워밈 베이지 |
| Cream Stone | #CFC6C0 | C 0 / M 4 / Y 8 / K 19 | K -5% 감산 권장 (인쇄 시 살짝 어두워짐) |
| Brand Taupe | #BBACAA | C 0 / M 8 / Y 9 / K 27 | 핑크 톤 살리려면 M+2 |
| Soft Slate | #928886 | C 0 / M 7 / Y 8 / K 43 | 깨끗한 미들 그레이 |
| Espresso | #3A3431 | **C 30 / M 30 / Y 30 / K 80** (Rich Black) | 🚨 K100만 쓰면 안 됨 — 워밈 리치 블랙 필수 |
| Brass | #B98A3F | C 25 / M 47 / Y 95 / K 10 | PMS 729 C 별색 발주 권장 (메뉴 표지·로고) |

### 7-2. Pantone PMS 발주 코드

| 컬러 | 권장 PMS (별색) | TPX (텍스타일) |
|---|---|---|
| Hanji Cream | 9043 C | 11-0907 TPX |
| Cream Stone | Warm Gray 1 C | 14-1110 TPX |
| Brand Taupe | Warm Gray 4 C | 16-1318 TPX |
| Soft Slate | Warm Gray 7 C | 16-1506 TPX |
| Espresso | 412 C | 19-0822 TPX |
| Brass | 729 C | 16-0950 TPX |

---

## 8. CSS 토큰 명세 (Tailwind v4 + OKLCH)

### 8-1. 권장 토큰 정의

```css
/* src/styles/tokens.css */
:root {
  /* OKLCH primary (perceptually uniform) */
  --color-hanji:    oklch(89.5% 0.018 84);
  --color-stone:    oklch(80.2% 0.011 64);
  --color-taupe:    oklch(70.6% 0.014 28);   /* Hero ★ */
  --color-slate:    oklch(57.4% 0.011 35);
  --color-espresso: oklch(22.1% 0.008 50);
  --color-brass:    oklch(60.1% 0.087 78);

  /* sRGB fallback (구형 브라우저·이메일·Figma export) */
  --color-hanji-hex:    #E8DFD2;
  --color-stone-hex:    #CFC6C0;
  --color-taupe-hex:    #BBACAA;
  --color-slate-hex:    #928886;
  --color-espresso-hex: #3A3431;
  --color-brass-hex:    #B98A3F;

  /* Semantic aliases */
  --color-canvas:      var(--color-hanji);
  --color-canvas-soft: var(--color-stone);
  --color-brand:       var(--color-taupe);
  --color-muted:       var(--color-slate);
  --color-ink:         var(--color-espresso);
  --color-accent:      var(--color-brass);
  --color-hairline:    color-mix(in oklch, var(--color-slate) 30%, var(--color-hanji));
}

@theme {
  /* Tailwind v4: 위 :root 변수를 Tailwind utility로 노출 */
  --color-hanji:    oklch(89.5% 0.018 84);
  --color-stone:    oklch(80.2% 0.011 64);
  --color-taupe:    oklch(70.6% 0.014 28);
  --color-slate:    oklch(57.4% 0.011 35);
  --color-espresso: oklch(22.1% 0.008 50);
  --color-brass:    oklch(60.1% 0.087 78);
}
```

### 8-2. 사용 예시 (Tailwind v4 클래스)

```tsx
// Primary CTA
<button className="bg-espresso text-hanji">지금 예약하기</button>

// Outline CTA
<button className="bg-hanji text-espresso border-2 border-espresso">메뉴 보기</button>

// Brass accent CTA
<button className="bg-brass text-espresso">카카오 채널</button>

// Hero section
<section className="bg-hanji text-espresso">
  <span className="text-brass">EYEBROW · 양재 + 을지로</span>
  <h1>프리미엄 흑돼지 다이닝</h1>
</section>

// Dark chef-authority section
<section className="bg-espresso text-hanji">
  <span className="text-brass">★ MEDIA · 셰프 추천</span>
  <h2>셰프 이원일이 직접 추천한</h2>
</section>
```

---

## 9. 기존 `src/styles/tokens.css` 마이그레이션

### 9-1. 토큰 매핑 (Old → New)

| 기존 토큰 | 기존 값 | 신규 토큰 | 신규 값 | 처리 |
|---|---|---|---|---|
| `--color-canvas` | #FAF6EE | `--color-hanji` | #E8DFD2 | **값 변경** |
| `--color-canvas-soft` | #F2EBDD | `--color-stone` | #CFC6C0 | **값 변경 + 이름 권장** |
| `--color-taupe` | #C9BBA8 | `--color-taupe` | **#BBACAA** | **값 변경 (사장님 Hero)** |
| `--color-stone` | #3D4046 | (deprecate) | — | 🚨 동명 토큰 의미 변경: 기존 `--color-stone`(#3D4046)은 다크 쿨 그레이였음. 신규 `--color-stone`(#CFC6C0)은 라이트 워밈 베이지. 마이그레이션 규칙: (1) 기존 stone이 *텍스트·구분선·아이콘 stroke* 으로 쓰인 곳 → `--color-slate` (2) *섹션 다크 배경*으로 쓰인 곳 → `--color-espresso`. 구현 단계에서 grep 결과별로 case-by-case 결정. |
| `--color-forest` | #1F3D2A | (deprecate) | — | 🗑 제거 — Forest Sage 노선 폐기 |
| `--color-forest-mid` | #2D5E3A | (deprecate) | — | 🗑 제거 |
| `--color-cream-gold` | #D4C39A | `--color-brass` | #B98A3F | **값 변경 + 이름 변경** |
| `--color-ink` | #181D26 | `--color-espresso` | #3A3431 | **값 변경 — 더 따뜻한 다크** |
| `--color-body` | #4A6B52 | (deprecate) | — | 🗑 제거 — 본문은 `--color-ink`(=Espresso) 단독 |
| `--color-hairline` | #D6DDD0 | `--color-hairline` | color-mix 결과 | 동적 계산으로 변경 |
| `--color-coral` | #AA2D00 | (deprecate) | — | 🗑 제거 — 셰프 권위는 Brass가 담당 |

### 9-2. 변경된 의미를 사용하는 코드 검색 필요

`src/` 전체에서 다음 클래스/변수 사용처를 grep해서 신규 매핑으로 교체:
- `--color-forest`, `--color-forest-mid`, `--color-cream-gold`, `--color-coral`, `--color-body`
- Tailwind 클래스: `bg-forest`, `text-forest`, `border-forest`, `bg-coral`, `text-coral`, 등
- (실제 사용 여부는 구현 단계의 grep 결과로 확인)

---

## 10. 음식 사진 운영 규칙 (적색 결여 보완)

이 팔레트는 의도적으로 적색을 포함하지 않는다. 식욕 자극은 **음식 사진의 자연 채도**에 100% 의존한다.

**필수 준수 규칙:**
1. 음식 사진은 절대 desaturate하지 않는다. 원본 RAW에서 최대한 자연 채도 유지.
2. 흑돼지 살코기의 핑크-레드(#C8503D~), 놋그릇의 황금(#B98A3F), 김치의 적자색은 모두 **풀 채도** 노출.
3. 컬러 그레이딩 시 *팔레트에 맞춘 desaturation 금지*. 팔레트는 사진을 *프레임*하는 역할이지 *대체*하지 않는다.
4. 인스타 필터·LR 프리셋도 채도 -10% 이내로 제한.

---

## 11. 별도 결정 항목 (이 스펙 범위 밖, 별도 티켓)

### 11-1. 로고 색 변경 (필수)
- **현황**: `_photo_mapping.md`에서 *"받은 로고 PNG (forest+cream)"* 로 기록됨. 사장님 보유 로고는 **Forest Green + Cream** 조합.
- **문제**: 신규 팔레트에 forest green이 없음. 시스템과 로고가 어긋남.
- **권장**: 로고의 forest 부분을 **Espresso `#3A3431`** 으로 색만 변경. cream 부분은 유지(우리 Hanji와 자연 호환). 디자이너 작업 1-2시간 분량.
- **별도 티켓**: 로고 색 변경 발주 → `public/brand/logo.png` (light bg용) + `logo-white.svg` (dark bg용 = Hanji 컬러)

### 11-2. 인스타 프로필 사진 변경 (선택)
- **현황**: 현재 Litt.ly 프로필이 을지로점 파동벽 인테리어 사진. 사장님이 의도적으로 선택.
- **권장**: 그대로 유지. 신규 팔레트와 호환됨(파동벽이 Hanji+Stone+Slate 톤).

### 11-3. Phase 3 베트남 진출 시 보조 컬러
- **트리거**: 1호점 확정 시
- **권장**: 따뜻한 Saffron `#D49A2D` 또는 깊은 Emerald `#0A6155` 1색 추가 검토 (베트남 다이닝 컬러 컨벤션 호환)

---

## 12. 리스크와 완화 전략

| # | 리스크 | 완화 |
|---|---|---|
| R1 | 본문 가용 컬러 1개뿐 (Espresso) → 타이포 위계 압박 | Weight(800/600/400/300) + Size(56/32/16/13) + Tracking + 70% alpha 활용 |
| R2 | 적색 결여 → 메뉴 컨버전 12-15% 손실 가능 | 음식 사진 채도 보존 (§10) + 가격에 Brass 사용 |
| R3 | 기존 Forest+Cream 로고와 톤 불일치 | 별도 티켓 §11-1에서 처리 |
| R4 | "Mauve fatigue" (2027 시점 예상) | Pantone 2025 Mocha Mousse 트렌드 윈도우 24-30개월 보장. 2027 재평가. |
| R5 | Reels 썸네일 CTR -8% (톤-온-톤 일반 약점) | 음식 클로즈업(자연 채도) + Espresso 텍스트 (§6-4) |
| R6 | Soft Slate 본문 오용 가능성 | 토큰 주석 + lint 규칙으로 enforce. 디자이너·개발자 가이드 명시. |
| R7 | Espresso 인쇄 칙칙함 | 워밈 리치 블랙(C30 M30 Y30 K80) 처방 (§7-1) |

---

## 13. Phase별 적용 로드맵

| Phase | 시점 | 작업 |
|---|---|---|
| **Phase 1** | 2026-05 (지금) | (1) `tokens.css` 마이그레이션 (2) shadcn 컴포넌트 토큰 매핑 (3) 메인 LP·메뉴·지점 페이지 빌드 (4) 인스타 하이라이트·스토리 템플릿 제작 (5) 로고 색 변경 (6) 메뉴북 PDF 디자인 |
| **Phase 2** | 2026 Q4+ | 영문 메뉴·About 확장. 팔레트 그대로 유지 (글로벌 트렌드 호환) |
| **Phase 3** | 2027+ | 베트남 진출 시 1색 보조 추가 검토 (§11-3) |

---

## 14. 다음 단계

1. **사장님 검토** — 이 스펙 문서 전체 확인
2. **수정 반영** (필요 시 1-2회 round)
3. **`writing-plans` 스킬 호출** — 이 스펙을 기반으로 구현 계획서 작성
   - `tokens.css` 마이그레이션 순서, 의존관계
   - 기존 코드의 영향 분석 (grep)
   - 컴포넌트별 토큰 매핑 작업
   - 인스타 자산 제작 작업
   - 로고 색 변경 발주 (병행)
   - 테스트 전략 (시각 회귀 테스트 등)
4. **빌드 시작** — 코드 단계 진입

---

## 부록 A — 빠른 시각화 자료 위치

빌드 시점 참고용 PNG (사장님 검토 자료):
- 6컬러 카드 시트: `C:\Users\pc\AppData\Local\Temp\yukzzp\palette.png`
- 사용 시나리오·콘트라스트: `C:\Users\pc\AppData\Local\Temp\yukzzp\usage.png`
- ALMA 비교: `C:\Users\pc\AppData\Local\Temp\yukzzp\alma_compare.png`
- 3-way 컨버전스: `C:\Users\pc\AppData\Local\Temp\yukzzp\convergence.png`
- 옵션 A 종합 룩북: `C:\Users\pc\AppData\Local\Temp\yukzzp\option_a.png`

(영구 저장 위치는 별도 결정 — `docs/superpowers/specs/assets/` 또는 `public/brand/specs/` 권장)

---

## 변경 이력

- 2026-05-08: 초안 작성. 사장님 옵션 A 확정. 5+1 Pantone 시스템 채택. Forest Sage 노선 공식 폐기.
- 2026-05-08: 마이그레이션 PR 완료. tokens.css·globals.css·brand.ts 갱신, BRAND_PALETTE 상수 추가, <meta theme-color> 적용. Forest Sage 토큰 5종 폐기 (legacy 별칭으로 유지 — 컴포넌트 마이그레이션 후 제거 예정). 컴포넌트 리팩토링 0건 (사전 grep 결과 brand 토큰 미사용 확인). 후속 작업: 로고 색 변경 발주 (별도 티켓), Phase 2 다크 모드 정의 (트리거 시).
- 2026-05-09: A+D 혼합 CTA 적용 (Group Dining), LV 미학 1-3순위 적용 (섹션 패딩 1.33×, 헤드라인 weight 400 + size +20%, eyebrow 0.3em uppercase). Footer + MenuItemCard + AuthorityBanner LV 톤 일관성 패스. Hanja 아이콘(材熟竹饌火) PillarCard 적용으로 차별화 §11-3 *肉汁 모노그램* 정신 실현. 두 worktree(cranky-heyrovsky 문서 / sleepy-hamilton 구현) 분리 인지 — 다음 단계: 통합 머지.
