---
title: 육즙관리소 웹사이트 디자인 스펙
date: 2026-05-06
brand: 육즙관리소 (PREMIUM DINING)
locations:
  - 양재역 본점 (Naver Place 1672141709)
  - 더룸 을지로동대문점 (Naver Place 2033717879)
status: 사장님 검토 대기 (Phase 1 — MVP)
authors: 기획자(Claude) + 검토자 친구 합의
related:
  - airtable-design-reference.md
  - 자영업자를 위한 GEO AEO 완벽가이드북.pdf
  - _photo_mapping.md
  - _visitor_reviews.md / .json
  - _reviews_curated.md
  - _naver_places.md
  - _har_analysis.md
---

# 육즙관리소 웹사이트 디자인 스펙 (Phase 1 — MVP)

## 0. 한 페이지 요약 (TL;DR)

육즙관리소(양재역 본점 · 더룸 을지로동대문점)의 단일 진실 소스 사이트를 구축한다. **Phase 1은 4페이지 LP 중심의 MVP**다. 가치 가설은 "사이트 → 캐치테이블 클릭", "단체 문의 전환", "지역+상황 키워드 SERP 노출"이다. 콘텐츠 95%는 인스타그램 자동 미러링으로 채우고 사장님은 월 1회만 어드민에 들어온다. **가장 중요한 디자인 결정 — 줄이는 것**: 페이지 12→4, 어드민 9→3, 영문 풀→메뉴+토글, 와이어프레임 데스크탑→모바일 우선. 6개월 KPI를 명시하고, 충족 시점에 Phase 2(나머지 페이지·풀 영문·매니저 권한)로 확장한다.

---

## 1. 사이트의 존재 이유 (USP)

네이버 플레이스와 캐치테이블이 **이미 잘 하는 것**: 위치·시간·전화·기본 사진·리뷰·예약. 우리 사이트가 **그들이 못 하는 것**으로 가치를 만든다:

1. **단체 회식·룸 견적 안내** — 4~16인/20~40인 인원별 가격·코스·콜키지 정책을 한 페이지에 (네이버 플레이스 ⇒ 분산)
2. **셰프 권위 영상 컨텍스트** — 이원일 셰프 공식 추천 영상을 사이트의 "이유"로 노출 (네이버 ⇒ 단순 외부 링크)
3. **구조화된 NAP·Schema** — 지점별 LocalBusiness/Restaurant + FAQPage Schema로 SERP 별점·FAQ 박스 점유 (네이버 의존 줄이기)
4. **베트남 진출용 영문 brand intro** — 메뉴 영문 + LP 영문 toggle 1개 영역 (Phase 2에서 확장)

**가치 = 매출** 매핑:

| 사이트 가치 | 추정 매출 경로 |
|---|---|
| 단체 안내 페이지 | 회식·동창회·청첩장 단체 매출 (객단가 100만원+) |
| 셰프 영상 권위 | 첫 방문 결정률 향상 (브랜드 신뢰) |
| SERP·FAQ 박스 점유 | 일반 검색 → 사이트 → 캐치테이블 전환 |
| 영문 brand intro | 베트남 파트너·미디어 인콰이어리 (장기) |

---

## 2. 매장 정체성 (확정 데이터)

### 양재역 본점 (Naver Place: `1672141709`)
- 카테고리: 돼지고기구이
- 도로명: 서울 강남구 강남대로44길 7 1층 (도곡동 952-11, 우편 06266)
- 안심전화: `0507-1335-6363`
- 영업: 평 11:30—23:00 (BT 14:00—16:00) / 주 16:00—22:00
- 좌석: 룸 6—20인, 단체석 20—40인 (입식 전용)
- 주차: **불가** → 서초구청 / 양재 공영 / SK허브프리모(주차비 지원 X)
- 편의시설: 콜키지(유료) · 유아의자 · 대기공간 · 포장 · 예약 · 남녀 화장실 분리 · 간편결제
- 길찾기: 양재역 3번 출구 → 직진 60m → 팀 호튼 도넛 → 우측 골목 → 두 번째 건물
- 누적 리뷰: 방문 2,478 + 블로그 319
- Catchtable: `app.catchtable.co.kr/ct/shop/yanggae___meat`
- 마이크로 리뷰 인사이트: "또 찾게 되는 흑돼지 다이닝" *(네이버 자동 요약을 자체 표현으로 재작성)*

### 더룸 을지로동대문점 (Naver Place: `2033717879`)
- 카테고리: 육류, 고기요리
- 도로명: 서울 중구 을지로43길 7 1·2층 (을지로6가 18-53, 우편 04564)
- 안심전화: `0507-1461-7228` *(02-2275-2322 아닌 안심전화를 공식 표기)*
- 영업: 매일 11:00—익일 05:00 (월—금 BT 14:30—16:30, 토·일 BT 없음, 연중무휴)
- 좌석: 룸 4—16인, 단체석 20—40인 (입식 전용 — 좌식 X)
- 주차: 굿모닝시티 지하 1시간 무료 + 엘리베이터 직통
- 편의시설: 단체 이용 가능 · 예약 · 유아의자 · 주차 · 남녀 화장실 분리 · 간편결제
- 길찾기: 동대문역사문화공원역 13번 출구 도보 2분 (DDP·두산타워·동대문 현대아울렛·굿모닝시티·국립중앙의료원 인근)
- 누적 리뷰: 방문 1,059 + 블로그 45
- Catchtable: `app.catchtable.co.kr/ct/shop/yukjeup_ddm` (별관 전용)
- 마이크로 리뷰 인사이트: "데이트와 가족 모임이 함께 어울리는 공간" *(자체 재작성)*

### 권위 신호 (양 지점 공통)
- **이원일 셰프 공식 영상** — `youtube.com/shorts/7CCR4BYW7D0` (조회 23k+)
- **산청 흑돼지 + 거창 백돼지** — 지리산 산지 직지정
- **특허 파동숙성 기술**
- **100% 대나무 숯 직화**
- **유자청 겉절이 · 해남 3년 묵은지 · 수향미 밥 · 무한리필 반찬**
- **대기업 출신 남편 + 패션디자이너 아내** 창업 스토리 (E-E-A-T)

### 공식 인스타그램
`@yukzzp__management_office` (브랜드 통합 1개)

---

## 3. 6개월 KPI (수정 #14, 가장 중요)

| KPI | 목표값 | 측정 방법 |
|---|---|---|
| **K1** 사이트 → 캐치테이블 클릭률 | 8% 이상 | 외부 링크 click event (GA4) |
| **K2** 단체 문의 전환 (전화 또는 폼) | 30+/월 | click-to-call event + 폼 제출 |
| **K3** 타겟 키워드 1page 노출 | 6개 키워드 1page | "양재역 회식·동대문 데이트·양재 흑돼지·DDP 고기집·동대문 단체룸·서울 셰프 추천 고기집" Search Console |
| **K4** 평균 세션 길이 | 90초 이상 | GA4 평균 세션 |

**미달 시:** Phase 2 보류, KPI 달성 전략 재설계.
**달성 시:** Phase 2 확장 시작.

---

## 4. 정보 아키텍처 — Phase 1 (수정 #2: 12→4 페이지)

```
/                LP (단일 긴 페이지, 모든 핵심 섹션)
/menu            전체 메뉴 + 영문 토글 (수정 #3)
/locations/yangjae   양재역 본점 (※ 양재 사진 정책은 §16 A4·D1 참조)
/locations/euljiro   더룸 을지로동대문점
```

### Phase 2 트리거 (KPI K1—K3 충족 또는 베트남 진출 발표)
```
+ /about · /groups · /gallery · /reviews · /news · /faq · /contact
+ /en/* 풀 영문 (12 페이지)
+ /admin/menu · /admin/locations (가격·지점 정보 직접 수정)
+ 매니저 권한 분리
```

### Phase 3 트리거 (베트남 진출 1호점 확정)
```
+ /vi/* 베트남어 또는 yukzzp.vn 별도 도메인
+ /en/brand (international showcase)
+ /locations/[neighbourhood] 베트남 신규 지점
```

---

## 5. 메인 페이지 (LP) — 6 섹션 구조 (수정 #2: 11→6)

```
① Sticky Nav (64px)
   로고+PREMIUM DINING / 메뉴 단체 지점 About* About는 LP 내 앵커 / EN 토글 / 예약 검정 pill

② Hero (모바일 80vh / 데스크탑 720px)
   배경: 매장사진 (15) — 미닫이문 너머 달방 (을지로 시그니처)
   다크 오버레이 35%
   eyebrow: 양재역 본점 · 더룸 을지로동대문점
   H1: 프리미엄 흑돼지 다이닝
   sub: 산청·거창 흑돼지 — 100% 대나무 숯 직화
   CTA pair: [지금 예약하기] [메뉴 보기]
   하단: 셰프 이원일 영상 ▶ 작은 링크 (모바일은 hero 아래 분리 배너)

③ 권위 배너 (Airtable signature-coral 풀-블리드)
   Background: #aa2d00
   Left: 셰프 이원일 영상 ▶ 임베드
   Right: H2 "셰프 이원일이 직접 소개한 — 돼지고기 참 잘하는 육즙관리소"
          sub: 공식 셰프 채널 23,000+ 조회
          [영상 보기 →]

④ Why + 시그니처 (병합 — 수정으로 4 Pillars + 시그니처 메뉴를 한 섹션 안에)
   상단: 4 Pillars (산지·파동숙성·대나무 숯·그릴링)
   하단: 시그니처 메뉴 3 카드 (모듬 57k · 진꽃살 87k · 아보카도 육회 28k)
   배경: cream callout #f5e9d4
   "전체 메뉴 보기 →" /menu

⑤ 두 지점 + 단체 + 예약 (병합 — 수정 #2 의 핵심)
   상단: 두 지점 비교 카드 (양재 / 을지로)
   중간: 단체 시그니처 카드 (forest #1F3D2A 풀-블리드)
         "회식·동창회·청첩장은 단체석에서"
         4~16인 룸 / 20~40인 단체석 chip
         CTA pair:
           [☎ 전화 문의 — 양재 0507... / 을지로 0507...]
           [💬 카카오 채널 문의] ← D5 운영 중
   하단: 예약 CTA 밴드 (light gray)
         양재·을지로 분리 외부 링크 버튼

⑤b 인스타그램 미니 strip (Phase 1, 푸터 직전)
   @yukzzp__management_office 최신 4장 임베드 (oEmbed 또는 IG Graph API)
   "@yukzzp__management_office 팔로우 →" 작은 텍스트 링크
   Phase 1 콘텐츠 신선도 보장 장치 (자동 갱신, 사장님 부담 X)

⑥ Footer (다크 forest)
   로고 + 두 지점 NAP + 인스타·유튜브 + 카피라이트 + 디스클레이머
```

**삭제된 섹션 (Phase 1)**: ⑧갤러리 미리보기 / ⑨후기 카드 / FAQ — Phase 2로 이동.
**이유**: LP 길이 단축 (CWV LCP 개선) + MVP 집중도 향상.

---

## 6. 디자인 토큰 (Forest Sage + 브랜드)

```css
/* 컬러 — Pencil Forest Sage 검증된 팔레트 */
--canvas:        #FAF6EE;  /* warm ivory, 90% surface */
--canvas-soft:   #F2EBDD;
--taupe:         #C9BBA8;
--stone:         #3D4046;
--forest:        #1F3D2A;  /* 브랜드 시그니처 */
--forest-mid:    #2D5E3A;
--cream-gold:    #D4C39A;  /* 로고/강조 */
--ink:           #181D26;
--body:          #4A6B52;
--hairline:      #D6DDD0;
--coral:         #AA2D00;  /* 셰프 권위 1곳 */

/* Spacing */
--space-section: 96px (모바일 64px);
--space-card:    32px (모바일 24px);
--space-gutter:  24px (모바일 16px);

/* Radius */
--r-cta: 4px;       /* 검정 pill 직사각 */
--r-card: 10px;
--r-input: 6px;
--r-pill: 9999px;

/* Typography */
- 한국어: Pretendard (preload, swap)
- Latin: Geist (next/font)
- 수치/날짜: Geist Mono (가격 19,000원 등)
- H1: 40—64px (mobile—desktop) / weight 400
- H2: 32—48px / weight 400
- Body: 14—16px / weight 400
- Eyebrow: 11px Mono / letter-spacing 2px
```

---

## 7. 컴포넌트 (Phase 1 필수 12개)

```
<Header>           sticky nav
<Footer>           dark forest, NAP·Schema 자동
<HeroSection>      풀-블리드 사진 + 다크 오버레이 + 헤드라인 + CTA pair
<SignatureCard>    forest / coral / cream variants
<PillarCard>       icon + title + description (4컬럼)
<MenuItemCard>     사진 + 이름 + 가격(Mono)
<LocationCard>     인테리어 + NAP + 영업시간 + CTA
<GroupCTA>         "단체 문의" 양재/을지로 click-to-call
<ReservationCTA>   양재/을지로 외부 링크 분리
<JsonLd>           Schema.org 자동 마크업
<LangToggle>       KO/EN (Phase 1은 메뉴 페이지에서만 활성)
<EmergencyBanner>  어드민이 작성한 임시 공지 (있을 때만 노출)
```

---

## 8. Supabase 스키마 (수정 #5: 간소화)

```sql
locations (
  id uuid pk, slug text unique,
  name_ko, name_en,
  category_ko, category_en,
  address_road, address_jibun, postal_code,
  phone, virtual_phone,
  hours jsonb,
  parking jsonb,
  amenities text[],
  rooms jsonb, group_seats jsonb,
  geo jsonb,
  naver_place_id, catchtable_url,
  hero_image, photos text[],
  meta_description_ko, meta_description_en,
  created_at, updated_at
);

menu_categories (id, slug, name_ko, name_en, sort_order);

menu_items (
  id, category_id fk,
  name_ko, name_en, description_ko, description_en,
  price_krw, weight_g, image_url,
  is_signature, is_lunch_special,
  available_at_yangjae, available_at_euljiro,
  sort_order
);

faqs (
  id, slug,
  question_ko, question_en, answer_ko, answer_en,
  category, location_id fk nullable, sort_order
);  -- Phase 2 사용, 스키마는 1에서 잡아둠

emergency_banner (
  id, message_ko, message_en,
  active bool, created_at, expires_at
);  -- 어드민 임시 공지 1개

admin_users (
  id (= auth.users.id),
  role text default 'owner',  -- Phase 1은 owner만
  display_name
);
```

**삭제된 테이블 (Phase 2로 이동):** posts, post_images, reviews, audit_log.
**이유:** Phase 1은 인스타 미러링 95% + 어드민 3 기능만. 별도 글·후기 큐레이션·감사 로그는 Phase 2 트리거 시.

### RLS 정책
- **읽기:** public (모든 테이블)
- **쓰기:** `owner` only (`auth.uid() = admin_users.id AND role='owner'`)

### Storage Buckets
- `photos/` (public read) — 매장·음식·로고
- `private/` (auth) — 어드민 임시 업로드

---

## 9. 어드민 (수정 #5: Owner-only, 3 기능만)

```
/admin/login          이메일 + Supabase Auth
/admin                대시보드 (현재 임시 공지 / 메뉴 가격 변경 이력 / 사이트 viewing 통계)
/admin/banner         임시 공지 작성·해제 (1개만 활성)
/admin/menu-prices    메뉴 가격 빠른 수정 (전체 메뉴는 코드, 가격만 DB)
/admin/meta           각 페이지 hero subheadline / meta description 수정
```

**원칙:**
- 모바일 우선 (375px 기준 첫 디자인)
- 3-스텝 작업 (선택 → 수정 → 발행)
- 자동 미러: 변경 시 ISR revalidate
- 카카오톡 OAuth 추가는 Phase 2

**삭제된 기능 (Phase 2):**
- 소식 글 작성 (`/admin/posts`)
- 갤러리 업로드 (`/admin/gallery`) — 인스타 미러링이 대체
- 후기 큐레이션 (`/admin/reviews`)
- 매니저 권한 분리

---

## 10. GEO/SEO 전략 (수정 #9: honest 표현)

### 검증된 가치 (확실한 SEO)
- **Schema.org JSON-LD** 풀 마크업 → 구글 SERP 별점·FAQ 박스·이벤트 노출
- **NAP 일관성** (사이트 = 네이버 = 캐치테이블 = 인스타)
- **Image SEO** (alt 텍스트 NER 키워드, WebP/AVIF, sitemap)
- **모바일·CWV** (LCP < 2.5s, CLS < 0.1)
- **Hreflang** ko/en 토글

### 보너스 가능성 (미증명, 측정 KPI에 포함)
- LLM(ChatGPT·Claude·Gemini) 인용 점유 — Schema가 풍부하면 가능성 증가하지만 보장 안 됨

### Schema.org 매핑 (페이지별)

| 페이지 | Schema 타입 |
|---|---|
| `/` | `Organization` + `WebSite` (with sitelinks searchbox) |
| `/locations/yangjae` | `Restaurant` + `LocalBusiness` (with `aggregateRating`, `geo`, `openingHoursSpecification`, `amenityFeature`, `sameAs`) |
| `/locations/euljiro` | `Restaurant` + `LocalBusiness` (동일) |
| `/menu` | `Menu` + `MenuSection` × 6 + `MenuItem` × N |

`Restaurant.sameAs` 필드 (각 지점 NAP 일관성 강화):
```json
"sameAs": [
  "https://place.map.naver.com/restaurant/{naver_place_id}",
  "https://www.instagram.com/yukzzp__management_office",
  "https://app.catchtable.co.kr/ct/shop/{slug}",
  "https://www.youtube.com/shorts/7CCR4BYW7D0",
  "https://pf.kakao.com/_{kakao_channel_id}"  // D5 카카오 채널 (URL 빌드 시 확보)
]
```

### 메타 description (페이지별, 자체 카피)

| 페이지 | description (50—150자) |
|---|---|
| `/` | 셰프 이원일이 인정한 흑돼지 다이닝. 산청·거창 산지 100% 대나무 숯 직화. 양재역 본점·더룸 을지로동대문점 운영. |
| `/locations/yangjae` | 양재역 3번 출구 도보 2분. 룸 6—20인·단체 20—40인. 콜키지·점심특선·가족 친화. 캐치테이블 실시간 예약. |
| `/locations/euljiro` | 동대문 DDP 인근. 매일 11:00—05:00 운영. 룸 4—16인·단체 20—40인. 굿모닝시티 1시간 무료 주차. |
| `/menu` | 지리산 흑돼지 모듬 57,000원, 진꽃살 87,000원, 아보카도 육회 28,000원. 100% 대나무 숯 직화 · 직원 그릴링 무료. |

### 자동 sitemap.xml + robots.txt (Next.js `app/sitemap.ts`)

---

## 11. 콘텐츠 운영 모델 (수정 #12)

```
인스타그램 자동 미러링 — 95%의 콘텐츠 출처
  ├ 사장님은 인스타에 평소처럼 주 1—2회 게시
  ├ 사이트는 IG Graph API 또는 oEmbed로 hourly 폴링
  ├ Phase 1에서는 메인 LP의 §5b 인스타 미니 strip(4장)에 임베드
  └ Phase 2에서 /gallery 페이지로 풀 임베드 분리

사장님 직접 작업 — 5%
  ├ 임시 공지 (월 0—1회) — /admin/banner
  ├ 메뉴 가격 변경 (분기 0—1회) — /admin/menu-prices
  └ 메타 description 미세 조정 (분기 0—1회) — /admin/meta

콘텐츠 신선도 보장 장치
  └ 메인 LP는 인스타 임베드로 자동 신선
  └ Schema의 `dateModified`는 IG 폴링 결과로 자동 갱신
  └ 사장님 부담 없이도 "살아 있는" 사이트 유지
```

---

## 12. 성능 예산 (수정 #10)

| 지표 | 모바일 목표 | 데스크탑 목표 | 측정 |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 1.5s | PageSpeed Insights / Vercel Speed Insights |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.1 | 〃 |
| **TBT/INP** | < 200ms | < 100ms | 〃 |
| **TTFB** | < 800ms | < 400ms | Vercel Edge |
| **JS Bundle (initial)** | < 200KB | < 200KB | next-bundle-analyzer |
| **첫 이미지 weight** | < 200KB | < 400KB | art direction (`<picture>`) |

**적용 기법:**
- Hero 이미지: `<picture>` art direction (모바일 768w · 데스크탑 1440w · WebP/AVIF)
- 갤러리: lazy load (`loading="lazy"`, `IntersectionObserver`)
- 비디오: facade pattern (썸네일 → 클릭 시 iframe 로드)
- 폰트: `next/font`로 self-hosting + `display: swap` + Pretendard preload
- ISR: 메뉴·지점 페이지 60s, LP 5min revalidate

---

## 13. 모바일 우선 디자인 (수정 #11)

### 브레이크포인트
```
mobile:    375px (iPhone SE 기준)
tablet:    768px (iPad portrait)
laptop:    1024px
desktop:   1440px (Pencil 시안 기준)
```

### 모바일 우선 적용 사항 (LP 기준)
- Hero CTAs: 모바일에서 stacked vertical, 데스크탑에서 horizontal
- 두 지점 카드: 모바일 좌우 swipe carousel, 데스크탑 2-column grid
- 단체 시그니처 카드: 사진과 텍스트 stack (모바일) vs 좌우 (데스크탑)
- 메뉴 페이지: 카테고리 sticky tab (모바일) vs sidebar (데스크탑)
- 갤러리: masonry → 모바일 1-column → 데스크탑 3-column
- click-to-call: 모바일에서만 active (전화 아이콘이 자동 `tel:` 링크)

### 모바일 와이어프레임 (Phase 1 코드 빌드 단계에서 작성)
- Pencil 추가 시안 또는 Next.js 코드 직접 빌드 후 사장님께 라이브 검토.

---

## 14. 기술 스택

| 영역 | 선택 | 메모 |
|---|---|---|
| Framework | **Next.js 16.2.4** App Router | 이미 셋업, ISR/SSG 활용 |
| Language | TypeScript 5 | 〃 |
| UI | React 19 + Tailwind CSS v4 + shadcn | 〃 |
| Icons | lucide-react | 〃 |
| Backend | Supabase (Postgres + Auth + Storage) | `xakdukmrbepflkrehhrk` (빈 프로젝트) |
| Fonts | next/font (Geist) + Pretendard CDN | Korean fallback |
| i18n | next-intl (또는 `app/[locale]`) | Phase 1은 메뉴만 |
| Analytics | Vercel Analytics + GA4 | KPI 측정 |
| Hosting | **Vercel** (권장) | Next.js 최적화·자동 배포 |
| 도메인 | TBD (사장님 결정) — `yukzzp.com`/`yukzzp.kr` 추천 | Phase 1 마무리 시점 |
| CI/CD | GitHub → Vercel auto-deploy | PR Preview |
| 모니터링 | Vercel Speed Insights | CWV 자동 추적 |

---

## 15. 법적·윤리 고려 (수정 #6, #7)

| 영역 | 결정 |
|---|---|
| **방문자 리뷰 직접 인용** | **하지 않는다.** 대신 (a) AggregateRating Schema (별점·리뷰 수) (b) 키워드 패턴 통계 ("손님이 자주 말씀하시는 것 — 직접 그릴링·육즙·하향식 환기") (c) 직접 인용은 작성자 동의 받은 케이스만 |
| **네이버 자동 마이크로 리뷰** | **자체 표현으로 재작성.** "매번 찾게 되는 맛집" → "또 찾게 되는 흑돼지 다이닝" |
| **사진 출처** | (a) 을지로점 매장 사진 49장 (`사진/매장사진/더룸 을지로 동대문/`) — 사장님 보유 (외주 촬영 권리 확인 필요) (b) **양재역점 공식 사진 11장** (`사진/매장사진/양재역점/`) — 사장님이 직접 업로드한 공식 자료 (외관·본관·룸·단체석·카운터 디테일 포함) (c) AI 생성 placeholder — Pencil 시안에만, 코드에는 사용 X (d) `_unused_internal_naver_pull/` — 내부 작업용 다운로드 4장, 사용 X |
| **개인정보** | 어드민 사장님 본인. 손님 PII 수집 X (예약은 외부로) |
| **쿠키 정책** | GA4 분석 동의 배너 (한국 정보통신망법 준수) |
| **저작권 표시** | 푸터에 사업자 정보 + © 2026 육즙관리소 |

---

## 16. 리스크 · 가정 (수정 #9, #13, #14)

### 가정 — 사실인지 확인 필요
- **A1**: 사장님이 인스타에 주 1—2회 게시한다 (확인됨)
- **A2**: 외주 사진 49장의 권리는 사장님이 소유한다 (확인 필요)
- **A3**: 베트남 진출은 미정 시점이다 — Phase 2/3 트리거가 적절할 때까지 기다린다
- **A4**: ~~양재 인테리어 사진~~ — **해결됨** (사장님 공식 11장 업로드 완료)
- **A5**: 캐치테이블·네이버 예약 외부 링크가 사이트의 1차 전환 채널로 충분하다

### 리스크와 완화
| 리스크 | 영향 | 완화 |
|---|---|---|
| GEO 효과 미증명 | KPI K3 미달 | "검증된 SEO + GEO 보너스"로 honest 포지셔닝, 측정해서 학습 |
| 사장님 어드민 사용 빈도 낮음 | 콘텐츠 stale | 인스타 미러링이 95% 차지 — 어드민 미사용해도 사이트 신선도 유지 |
| 양재 사진 (해결됨) | — | **해결**: 사장님이 공식 사진 11장 직접 업로드 (`사진/매장사진/양재역점/`) — 외관 (#131) · 다크 무드 본관 (#124) · 카운터 (#127) · 다이아몬드 패널 룸 (#123) · 단체석 (#64) · 본관 와이드 (#38, #126, #129) · 부스 (#128) 포함. 양재 전용 페이지 빌드에 충분한 풍성한 자료. |
| Wix 같은 저비용 대안 미고려 | 사장님 선택지 부족 | 부록 A에 Wix 비교 1페이지 첨부 |
| 베트남 진출 무한 보류 | 영문 자료 미사용 | Phase 1 영문은 메뉴+toggle만, 풀 영문은 트리거 기반 |
| 네이버 ToS / 저작권 분쟁 | 평판·법적 위험 | 직접 인용 X, 통계+재작성만 |
| Core Web Vitals 미달 | SEO 페널티 | 성능 예산 적용, 매 디자인 결정 시 체크 |

---

## 17. Phase 2 / Phase 3 로드맵

### Phase 2 트리거: KPI K1—K3 충족 또는 베트남 진출 발표
**추가 페이지 (한국어):**
- `/about` (창업 스토리·산지·셰프 영상 풀 + 후기 통합)
- `/groups` (단체 회식 전용)
- `/gallery` (사진·영상 풀 페이지)
- `/news` (소식 — 어드민에서 직접 작성)
- `/faq` (Q&A 30개 + FAQPage Schema 풀)
- `/contact` (Press / Partnership 문의)

**영문 풀 미러:** 위 한국어 페이지의 EN 버전.

**어드민 추가:**
- `/admin/posts` 소식 작성·수정
- `/admin/gallery` 사진 업로드·정렬
- `/admin/reviews` 후기 큐레이션 (동의 받은 것만)
- 매니저 권한 분리 (RLS 정책 확장)
- `audit_log` 테이블 활성

### Phase 3 트리거: 베트남 진출 1호점 확정
- `/vi/*` 또는 `yukzzp.vn` 별도 도메인
- `/en/brand` international showcase
- `/locations/[neighbourhood]` 신규 베트남 지점

---

## 18. 사장님 결정 사항 (확정)

| # | 항목 | **확정 답변** |
|---|---|---|
| ~~D1~~ | ~~양재 사진~~ | ✅ 해결됨 — 사장님 공식 11장 업로드 |
| **D2** | 사진 권리 (을지로 49장 + 양재 11장) | ✅ **사장님 소유** (사이트에서 자유 사용 가능) |
| **D3** | 도메인 | ✅ **`yukzzp.com`** |
| **D4** | 기술 스택 | ✅ **Next.js 그대로** (Schema·CWV·확장성 우월) |
| **D5** | 카카오톡 채널 | ✅ **운영 중** → 사이트에 활용 (단체 문의 보조 채널 + 푸터 + Schema sameAs) — *카카오 채널 URL은 빌드 시점에 받음* |
| **D6** | 콜키지 정책 | ✅ "와인 20,000원 / 위스키 30,000원 (언더락 잔 제공)" 메뉴 페이지에 노출 |
| **D7** | 사장님 부부 인터뷰 | ✅ Phase 1 안 함 → Phase 2 About 페이지에서 검토 |
| **D8** | 자체 예약 폼 | ✅ Phase 1은 외부 채널 (네이버·캐치테이블) 그대로 → Phase 2 검토 |

### D5 변경에 따른 사이트 반영

카카오톡 채널 운영 중이므로 다음 위치에 추가:
- **메인 LP §⑤ 단체 CTA 영역**: "단체 전화 문의 / **카카오 채널 문의**" 두 채널 노출
- **`/locations/*` 페이지**: 단체 문의 박스에 카카오 채널 버튼 추가
- **푸터**: 인스타·유튜브 옆에 카카오 채널 아이콘
- **Schema.org `sameAs`**: 카카오 채널 URL 추가 (NAP 일관성 신호)
- **모바일 우선**: 카카오 채널 deep link (`kakaotalk://...`) — 앱 설치된 경우 즉시 채널 진입

**확정 (2026-05-06):**
- 카카오 채널 URL: **`https://pf.kakao.com/_ARVxkn`** (브랜드 통합 1개 채널, 양재·을지로 공통)
- `.env`: `NEXT_PUBLIC_KAKAO_CHANNEL_URL=https://pf.kakao.com/_ARVxkn`

---

## 19. 부록 A — Wix vs Next.js 비교 (수정 #13)

| 항목 | Wix (또는 Cafe24 식당 솔루션) | Next.js (현재 안) |
|---|---|---|
| 구축 시간 | 1—2주 | 4—6주 (Phase 1) |
| 월 운영비 | $20—50/월 | $0—20/월 (Vercel 무료 티어) |
| 디자인 자유도 | 템플릿 한정 | 100% 자유 |
| Schema.org 컨트롤 | 부분적 | 풀 컨트롤 |
| CWV 최적화 | 자동 (한계 있음) | 수동 최적화 가능 (더 빠름) |
| 어드민 학습 곡선 | 매우 낮음 | 사장님 학습 필요 |
| 수정 비용 | 즉시 (UI) | 코드 변경 필요 |
| 다국어 | 추가 비용 | next-intl 무료 |
| 인스타 미러링 | 플러그인 | 자체 구현 |
| GEO/AEO 풀 활용 | 어렵 | 풀 활용 |
| 베트남 진출 확장 | 어렵 | 쉬움 |

**결론:** Phase 1에서 Wix가 빠르고 저렴. Next.js는 Schema·CWV·다국어·확장에서 우월. **사장님이 "GEO 풀 컨트롤 + 베트남 확장"을 가치 있게 보면 Next.js, "빠른 런칭·낮은 운영비"를 우선하면 Wix.** 의식적 선택이 중요.

---

## 20. 다음 단계

1. **사장님 검토** — 이 스펙 문서 전체 + Open Items D1—D8 답변
2. **수정 반영** (필요 시 1—2회 round)
3. **`writing-plans` 스킬 호출** — 이 스펙을 기반으로 Phase 1 구현 계획서 작성
   - 작업 순서, 마일스톤, 의존관계, 테스트 전략
4. **빌드 시작** — 코드 단계 진입

---

## 부록 B — 관련 자료 일람

| 파일 | 내용 |
|---|---|
| `airtable-design-reference.md` | Artisan Editorial 컬러·레이아웃 원칙 |
| `자영업자를 위한 GEO AEO 완벽가이드북.pdf` | CITE / E-E-A-T 프레임워크 |
| `_photo_mapping.md` | 매장사진 49장 → 섹션 매핑 |
| `_visitor_reviews.json` / `_visitor_reviews.md` | Naver 방문자 리뷰 58개 (raw) |
| `_reviews_curated.md` | 키워드 패턴 + 베스트 7개 (인용 X, 인사이트만 사용) |
| `_naver_places.md` | 두 지점 공식 데이터 |
| `_har_analysis.md` | Naver Place getAiBriefing 등 GraphQL 인사이트 |
| `pencil-new.pen` | 메인 페이지 Pencil 시안 (참고용, 코드는 새로 작성) |
| `사진/` | 매장 49 + 음식 4 + 후기 8 + 가격 6 |

---

## 변경 이력
- 2026-05-06: 초안 작성 (Q1—Q8 + 비판적 검토 통합)
