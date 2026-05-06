# 네이버 플레이스 경쟁업체 정보 정리 도구 — 설계 문서

- **작성일**: 2026-05-06
- **버전**: 0.1 (브레인스토밍 결과)
- **상태**: 사용자 승인 대기

## 1. 목적과 사용 시나리오

GEO/AEO(생성형 검색·답변 엔진 최적화) 컨설팅을 위한 **개인용 경쟁업체 분석 도구**. 사용자가 정한 N개의 네이버 플레이스 업체를 한 화면에 가로로 비교해, 평점·리뷰량·자주 등장하는 키워드·AI 브리핑 노출 문구 등을 한눈에 파악한다.

### 1.1 사용자

- **단일 사용자(본인)**, 본인 PC에서 로컬 실행
- 인증·다중 사용자·SSO 없음

### 1.2 핵심 사용 흐름 (MVP)

1. "프로젝트 만들기" → 이름 입력 (예: `양재동-양식당-2026-05`)
2. 네이버 플레이스 URL 여러 개 붙여넣기 (한 줄에 하나)
3. "수집" 버튼 → 시스템이 각 URL의 SSR HTML을 fetch + 필요 시 AI 브리핑 GraphQL POST
4. 비교 테이블 자동 표시 (정렬·필터 가능)
5. 행 클릭 → 우측 슬라이드 패널에서 상세
6. CSV export

### 1.3 비범위 (MVP에서 안 함)

- 시계열 추적 (스펙에는 ⓒ로 명시, 2단계 구현)
- 검색어로 자동 발견 / 지도 영역 선택
- LLM 기반 키워드 재추출 (네이버 응답에 이미 빈도 데이터가 있어 불필요)
- Excel/PDF export
- 카드 뷰
- SaaS화·인증·멀티 테넌시

## 2. 데이터 수집 전략 (HAR 검증 결과 반영)

### 2.1 1차 호출 — SSR HTML fetch (필수)

**엔드포인트**: `https://pcmap.place.naver.com/{businessType}/{placeId}/home`

`businessType`은 URL에서 추출. 카페·식당은 `restaurant`, 그 외 카테고리는 `place` 등이 가능 (수집 시 동적 결정 필요).

응답 HTML에서 `window.__APOLLO_STATE__ = {...};` 정규식으로 추출 → JSON 파싱.

**추출 가능한 데이터**:

| Apollo 키 | 추출 필드 |
|---|---|
| `PlaceDetailBase:{id}` | `name`, `category`, `categoryCodeList`, `address`, `roadAddress`, `coordinate{x,y}`, `phone`, `virtualPhone`, `conveniences[]`, `microReviews[]`, `visitorReviewsTotal`, `openingHours`, `categoryCount` |
| `Menu:{id}_*` | `name`, `price`, `description`, `images[]`, `recommend` |
| `VisitorReviewStatsResult:{id}` | `review.totalCount`, `review.imageReviewCount`, `analysis.themes[]` (label, count), `analysis.menus[]` (label, count) |

**위험도**: 낮음. 일반 브라우저의 페이지 진입과 동일한 GET 요청 1회.

### 2.2 2차 호출 — AI 브리핑 GraphQL (선택)

**엔드포인트**: `POST https://pcmap-api.place.naver.com/graphql`

**오퍼레이션**: `getAiBriefing`

**페이로드 형태** (HAR에서 발견한 구조 그대로 재현):
```json
{ "operationName": "getAiBriefing", "variables": {...}, "query": "..." }
```

응답 필드: `aiBriefing.textSummaries[]` (sentence + relatedReviews), `relatedQueries[]`.

**위험도**: 중간. GraphQL 직접 호출은 SSR HTML보다 봇 패턴이 명확히 잡힘. → 토글로 끌 수 있게 함 (기본 ON, 차단 시 OFF).

### 2.3 호출 정책

- **순차 호출**, 업체 1개당 1.5~3초 랜덤 지연
- User-Agent는 일반 데스크톱 Chrome으로 위장
- Referer 헤더 적절히 설정
- **글로벌 rate limit** (프로젝트 무관, 본인 IP 단위): 분당 20개 업체. 동시 수집은 1개씩 순차.
- 401/403/429 응답 받으면 즉시 중단 + 사용자에게 알림 ("차단 가능성, 잠시 후 재시도")
- AI 브리핑 호출은 **프로젝트별 설정 토글**(상세 패널 또는 프로젝트 설정 모달)로 ON/OFF. 기본 ON. 호출 실패가 잦으면 OFF.

### 2.4 폴백 — HAR 업로드 모드 (스펙만, 2단계 구현)

α(자동 호출)가 차단되면 사용자가 직접 브라우저로 페이지를 보고 HAR을 저장 → 업로드. 같은 추출 로직 재사용.

## 3. 아키텍처

### 3.1 기술 스택

- **Next.js 16** (App Router), React 19, TypeScript
- **Tailwind v4** + shadcn/ui (이미 설치됨)
- **next-intl** (i18n; ko/en/ja JSON)
- **데이터 저장**: 파일 시스템 — `data/projects/{slug}.json`
- **Cheerio + JSDOM** 등 외부 의존성은 사용 안 함. SSR HTML에서 `__APOLLO_STATE__`만 정규식 + JSON.parse로 충분.
- **HTTP 클라이언트**: Node 내장 `fetch`

### 3.2 디렉토리 구조 (제안)

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx                  // 프로젝트 리스트 + 새 프로젝트 모달
      projects/
        [slug]/
          page.tsx              // 비교 테이블 화면
    api/
      projects/route.ts         // GET 목록, POST 생성
      projects/[slug]/route.ts  // GET 1개, PATCH 메타, DELETE
      projects/[slug]/collect/route.ts  // POST: URL 목록 → 수집 실행
      projects/[slug]/export/route.ts   // GET ?format=csv
  components/
    project-list.tsx
    new-project-dialog.tsx
    compare-table.tsx
    place-detail-panel.tsx
    keyword-chip.tsx
    locale-switcher.tsx
    ui/                         // shadcn 컴포넌트
  lib/
    naver/
      url.ts                    // URL → {placeId, businessType} 파싱
      fetch-place.ts            // SSR HTML fetch + Apollo 추출
      fetch-ai-briefing.ts      // GraphQL POST
      types.ts                  // PlaceSnapshot 타입
    storage/
      projects.ts               // JSON 파일 read/write
    csv.ts                      // 비교 테이블 → CSV 직렬화
  i18n/
    request.ts                  // next-intl 설정
    messages/{ko,en,ja}.json
__fixtures__/                   // HAR에서 추출한 실제 응답들 (테스트용)
  place-restaurant.html
  ai-briefing.json
data/
  projects/                     // JSON 파일들 (gitignore)
```

### 3.3 데이터 흐름

```
[사용자] URL 붙여넣기 → POST /api/projects/[slug]/collect
                              │
                              ▼
                      lib/naver/url.ts (parse)
                              │
                              ▼
              [for each] lib/naver/fetch-place.ts (SSR HTML)
                              │
                              ▼
                  Apollo State 추출 → PlaceSnapshot
                              │
                              ▼ (옵션)
              lib/naver/fetch-ai-briefing.ts (GraphQL)
                              │
                              ▼
                       PlaceSnapshot 보강
                              │
                              ▼
              storage/projects.ts (JSON 파일에 누적 저장)
                              │
                              ▼
                       [클라이언트] 테이블 갱신
```

## 4. 데이터 모델

```ts
// lib/naver/types.ts

export type PlaceSnapshot = {
  // === 식별 ===
  placeId: string;              // "2056408561"
  businessType: string;         // "restaurant" 등
  collectedAt: string;          // ISO datetime
  sourceUrl: string;            // 사용자가 붙여넣은 원본 URL

  // === 기본 메타 ===
  name: string;
  category: string;             // "카페,디저트"
  categoryCodes: string[];
  address: string;
  roadAddress: string;
  coordinate: { x: number; y: number };  // 경도, 위도
  phone: string | null;
  virtualPhone: string | null;
  conveniences: string[];       // ["단체 이용 가능", "포장", ...]

  // === 리뷰 통계 ===
  reviewTotal: number;
  imageReviewCount: number;
  avgRating: number | null;     // 0이거나 null인 케이스 있음 (평점 비공개)

  // === 키워드/메뉴 빈도 (GEO/AEO 핵심) ===
  themeFrequency: { code: string; label: string; count: number }[];
  menuFrequency: { code: string; label: string; count: number }[];

  // === 마이크로 리뷰 ===
  microReviews: string[];       // 짧은 한 줄 요약들

  // === 메뉴 ===
  menus: {
    name: string;
    price: string;              // "8,000원" 또는 ""
    description: string;
    images: string[];
    recommend: boolean;
  }[];

  // === AI 브리핑 (옵션 호출 결과) ===
  aiBriefing?: {
    sentences: string[];        // textSummaries의 sentence만 추출
    fetched: boolean;           // 호출 시도했는지
    error?: string;             // 차단/실패 사유
  };
};

export type Project = {
  slug: string;                 // 파일명·URL 안전 슬러그
  name: string;                 // 표시명
  memo: string;                 // 자유 메모
  createdAt: string;
  updatedAt: string;
  urls: string[];               // 사용자가 붙여넣은 원본 URL들
  snapshots: PlaceSnapshot[];   // urls와 1:1로 매칭, 수집 후 채워짐
  collectionLog: {
    timestamp: string;
    successCount: number;
    failureCount: number;
    errors: { url: string; reason: string }[];
  }[];
};
```

저장 형식: `data/projects/{slug}.json` (한 프로젝트 = 한 파일).

## 5. UI 설계

### 5.1 화면 구조 (2개)

**A. 프로젝트 리스트** (`/[locale]/`)
- 좌측: 프로젝트 카드 그리드 (이름, 업체 수, 마지막 수집 시각)
- 우측 상단: "+ 새 프로젝트" 버튼 → 모달
- 헤더: 로케일 스위처 (KO / EN / JA)

**B. 비교 테이블** (`/[locale]/projects/[slug]`)
- 상단: 프로젝트 이름, 메모 편집, "URL 추가" 버튼, "재수집" 버튼, "CSV" 버튼
- 메인: 비교 테이블 (행=업체, 열=비교 차원)
- 행 클릭 시 우측에서 슬라이드 패널 (`PlaceDetailPanel`) 등장

### 5.2 비교 테이블 컬럼 (메인 7개)

| # | 컬럼 | 데이터 | 표현 |
|---|---|---|---|
| 1 | 업체명 | `name` | 텍스트 + 카테고리 작게 |
| 2 | 평점 | `avgRating` | 별 + 숫자, 0/null이면 "—" |
| 3 | 리뷰 수 | `reviewTotal` | 숫자, 정렬 가능 |
| 4 | 사진 리뷰 비중 | `imageReviewCount / reviewTotal` | % 막대 |
| 5 | 테마 키워드 Top5 | `themeFrequency` 정렬 후 Top5 | 컬러 칩 (테마별 고정 색) |
| 6 | 메뉴 키워드 Top5 | `menuFrequency` 정렬 후 Top5 | 컬러 칩 (전체 공통 색 팔레트, 같은 키워드는 같은 색) |
| 7 | AI 브리핑 첫 문장 | `aiBriefing.sentences[1]` (0번은 안내 문구라 제외) | 텍스트 truncate, 호버 시 전체 |

정렬은 #2, #3, #4 클릭으로 가능. #5, #6은 셀 정렬은 안 하되 같은 키워드끼리 색이 동일해서 시각적으로 비교됨.

### 5.3 컬러 칩 정책

- **테마 키워드 (#5)**: `taste`/`mood`/`service`/`menu`/`location`/`view`/`purpose`/`total` 8개 코드에 고정 색 매핑. **다국어 표시는 `code` 기준으로 i18n 키 조회**(예: `theme.taste` → "맛"/"Taste"/"味"). 데이터 모델의 `label` 필드는 네이버가 준 한국어 원본을 보존하되 화면 렌더링엔 i18n 매핑을 우선 사용.
- **메뉴 키워드 (#6)**: 한 프로젝트 안에서 등장하는 메뉴 라벨에 동적 색 부여 (해시 기반). 같은 단어는 같은 색이라 시각적 매칭이 됨.

### 5.4 상세 패널 (`PlaceDetailPanel`)

행 클릭 시 우측에서 슬라이드. 섹션:
1. 헤더: 이름·카테고리·주소·전화·좌표 링크(네이버 지도 새 창)
2. 마이크로 리뷰 (한 줄들)
3. AI 브리핑 전체 문장 리스트
4. 테마 키워드 (전체, 숫자 포함)
5. 메뉴 키워드 (전체, 숫자 포함)
6. 메뉴 카드 그리드 (이름, 가격, 사진)
7. 편의시설 칩
8. 원본 네이버 페이지 링크 (`sourceUrl` 그대로 새 창에 오픈)

### 5.5 다국어 (next-intl)

- 메시지 키 파일 3개: `messages/ko.json`, `en.json`, `ja.json`
- AI로 ko 초벌 → en/ja 자동 생성, 본인 검수
- **데이터(리뷰·메뉴 등 한국어 원문)는 번역하지 않음**. 라벨만 번역.
- 테마 코드 → 다국어 라벨 매핑 표 (`taste` → "맛"/"Taste"/"味")는 i18n 키에 포함

### 5.6 디자인 톤

`airtable-design-reference.md`의 토큰 그대로 적용 — 흰 캔버스, dark-ink 본문, near-black pill CTA, signature 색 4종으로 카드/포인트.

## 6. 에러 핸들링

| 케이스 | 처리 |
|---|---|
| 잘못된 네이버 URL | 수집 시 행 단위로 빨간 배지 + 사유 표시. 다른 행은 계속. |
| `__APOLLO_STATE__` 추출 실패 | 페이지 구조 변경 가능성. 로그에 기록, 행 단위 실패. |
| HTTP 4xx/5xx | 행 단위 실패 + 재시도 버튼 |
| 401/403/429 (차단 의심) | **전체 수집 즉시 중단** + 모달 안내 ("IP 차단 가능성, 30분 후 재시도 권장"). 이미 수집된 행은 보존. |
| AI 브리핑 GraphQL 실패 | 무시하고 계속. `aiBriefing.error`에만 기록. 메인 컬럼은 "—". |
| 타임아웃 (10초) | 행 단위 실패로 처리, 다음 URL로 진행 |

## 7. 테스트 전략

### 7.1 단위 테스트
- `lib/naver/url.ts`: URL 파싱 — placeId/businessType 케이스별 (restaurant, cafe, place 등). 잘못된 URL은 throw.
- `lib/naver/fetch-place.ts`: HAR에서 추출한 실제 응답 HTML을 fixture로 두고 Apollo 추출 → `PlaceSnapshot` 변환 검증.
- `lib/csv.ts`: 비교 테이블 → CSV 직렬화. 따옴표·쉼표·줄바꿈 이스케이프.

### 7.2 통합 테스트
- API route mocking: `nock` 또는 `msw`로 네이버 응답 mock → 수집 플로우 e2e.
- 프로젝트 CRUD: JSON 파일 read/write 검증.

### 7.3 fixture
- `__fixtures__/place-restaurant.html` — HAR에서 추출한 실제 SSR 페이지 HTML (한 케이스)
- `__fixtures__/ai-briefing.json` — GraphQL 응답
- 추후 `place-cafe.html` 등 다른 카테고리 케이스 추가

### 7.4 수동 검증
- 본 HAR의 placeId(2056408561 — 카펫앤스카이 후암)로 첫 통합 테스트 실행
- 본인 클라이언트 1명의 실제 경쟁사 5곳으로 첫 수집 → 결과 검토

## 8. 단계별 범위 (Phase Plan)

### Phase 1 — MVP (이 문서의 주 범위)
- 프로젝트 CRUD (JSON 파일)
- URL 붙여넣기 → SSR HTML 수집 → 비교 테이블
- AI 브리핑 GraphQL 호출 (토글)
- 다국어 UI (ko/en/ja)
- CSV export
- 1차 폴백 없음 (차단 시 "잠시 후 재시도" 안내만)

### Phase 2 — 시계열 (ⓒ)
- SQLite로 마이그
- 스케줄러 (윈도우 작업 스케줄러 또는 Node `node-cron`)
- 일자별 스냅샷 누적 → 변화량 차트 (평점·리뷰수·새 키워드)

### Phase 3 — 보강
- HAR 업로드 폴백 모드 (β)
- LLM 폴백 키워드 추출 (네이버 응답이 비어있는 업체 대비)
- Excel/PDF export
- 카드 뷰

## 9. 보안·법적 고려사항

- **개인 분석용**, 본인 IP, 분당 20건 이하 → 일반 사용자 패턴과 유사
- 수집한 데이터는 본인 PC에만 저장, 재배포·재판매 금지
- 네이버 ToS 변경·차단 시 수집 즉시 중단
- 본 도구는 **내부 분석 전용**. SaaS·외부 공유 단계로 가면 별도 법적 검토 필요.

## 10. 운영 체크리스트

- [ ] 첫 실행 시 `data/projects/` 자동 생성
- [ ] `.gitignore`에 `data/` 추가
- [ ] `.env.local`에 User-Agent 문자열 등 환경 변수
- [ ] README에 "분당 20건 제한·차단 시 30분 대기" 명시

## 11. 미해결·향후 검토

- 카테고리에 따른 `businessType` 매핑 표가 완전한지 (HAR엔 `restaurant`만 확인됨). URL 파싱 시 케이스별 fallback 로직 필요.
- AI 브리핑이 모든 업체에 있는 건 아님. 영세 업체에는 빈 문자열일 가능성 → UI에 "—" 처리.
- 네이버가 SSR을 SPA로 전환하면 1차 호출 전략이 깨짐. 그 시점에 GraphQL 직접 호출 또는 HAR 업로드(β)로 전환 가능하도록 추출 로직 추상화.
