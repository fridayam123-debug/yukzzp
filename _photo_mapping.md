# 매장 사진 → 사이트 섹션 매핑 (Next.js 빌드 시 사용)

**상태:** Pencil 시안에는 AI placeholder 이미지 사용. Next.js 빌드 시점에 아래 매핑대로 실제 사진을 `/public/` 폴더에 배치.

## 권장 폴더 구조

```
public/
  brand/
    logo.png                              # 받은 로고 PNG (forest+cream)
    logo-white.svg                        # 어두운 배경용 (생성 예정)
  photos/
    locations/
      euljiro/
        hero-moon-room.jpg                # = 매장사진 (15)
        long-banquet.jpg                  # = 매장사진 (5)
        booth-diamond.jpg                 # = 매장사진 (1)
        wide-banquet.jpg                  # = 매장사진 (20)
        wave-wall.jpg                     # = 매장사진 (35)
        moonjar-window.jpg                # = 매장사진 (40)  ← 시그니처
        entry-counter.jpg                 # = 매장사진 (25)
        exterior-kbbq.jpg                 # = 매장사진 (45)  ← 외관 정체성
      yangjae/                            # ⭐ 사용자가 직접 올린 공식 양재역점 사진 11장 (사진/매장사진/양재역점/)
        room-reed-glass.jpg                # = 사용자 (37) 입식 룸 + reeded glass
        bonkwan-long-table.jpg             # = 사용자 (38) 본관 와이드 + 긴 테이블
        bonkwan-variant.jpg                # = 사용자 (39) 본관 변형 각도
        group-11seats.jpg                  # = 사용자 (64) 단체석 11명석 (폰컷)
        room-diamond-booth.jpg             # = 사용자 (123) 다이아몬드 패널 룸 + 부스
        bonkwan-mood-counter.jpg           # = 사용자 (124) ⭐ 다크 무드 + 동테 카운터 (hero 후보)
        bonkwan-diamond-wide.jpg           # = 사용자 (126) 본관 + 다이아몬드 패널
        counter-yellow-led.jpg             # = 사용자 (127) ⭐ 카운터 + 노란 LED + 콘크리트
        booth-diamond-close.jpg            # = 사용자 (128) 다이아몬드 부스 클로즈업
        bonkwan-concrete-wide.jpg          # = 사용자 (129) 콘크리트 모던 본관 와이드
        exterior-jirisan-signage.jpg       # = 사용자 (131) ⭐ 외관 "지리산 돼지전문점" 사이니지

  # 참고: _unused_internal_naver_pull/ — 내부 작업용 4장 (사용자 공식 사진으로 대체되어 사용 X)
    food/
      yukhoe-bowl.jpg                     # = 음식사진 (20)
      modeum-platter.jpg                  # = 음식사진 (3)
      avocado-yukhoe-mini.jpg             # = 음식사진 (2)
      bulgogi-set.jpg                     # = 음식사진 (4)
    reviews/
      (네이버 후기 캡쳐 8장 — 트러스트 신호)
    menu-prices/
      (가격표 캡쳐 6장 — 메뉴 페이지 보조)

```

## 섹션별 매핑

| 사이트 위치 | 사용 파일 | 비고 |
|---|---|---|
| **메인 / Hero** | `hero-moon-room.jpg` (15) | 시네마틱 + 다크 오버레이 |
| **메인 / 권위 배너** | YouTube 셰프 영상 썸네일 (자동) | iframe 임베드 |
| **메인 / 4 Pillars 아이콘** | lucide-react 아이콘 (코드) | 산·원자·불·셰프모자 |
| **메인 / 시그니처 메뉴 3개** | `food/modeum-platter` `food/jin-kkotsal` (TBD) `food/yukhoe-bowl` | 음식사진 폴더 |
| **메인 / 두 지점 카드 (양재)** | `yangjae/bonkwan-mood-counter.jpg` (124) | 양재 분위기 시그니처 |
| **메인 / 두 지점 카드 (을지로)** | `long-banquet.jpg` (5) | 단체석 강조 |
| **메인 / 단체 시그니처 카드** | `wide-banquet.jpg` (20) | 풀-블리드 단체 테이블 |
| **메인 / 갤러리 6장** | (15) (35) (40) (25) (1) (45) | 다양성 |
| **/about / Hero** | `moonjar-window.jpg` (40) ⭐ | 한국 전통+모던+봄 |
| **/locations/euljiro / Hero** | `hero-moon-room.jpg` 또는 `wide-banquet.jpg` | — |
| **/locations/yangjae / Hero** | `yangjae/bonkwan-mood-counter.jpg` (124) ⭐ | 다크 무드 본관 + 동테 카운터 |
| **/locations/yangjae / 외관** | `yangjae/exterior-jirisan-signage.jpg` (131) ⭐ | "지리산 돼지전문점" 외관 |
| **/locations/yangjae / 본관 와이드** | `yangjae/bonkwan-long-table.jpg` (38) | 긴 단체 테이블 |
| **/locations/yangjae / 룸** | `yangjae/room-diamond-booth.jpg` (123) | 다이아몬드 패널 룸 |
| **/locations/yangjae / 단체석** | `yangjae/group-11seats.jpg` (64) | 단체석 11명석 |
| **/locations/yangjae / 카운터·디테일** | `yangjae/counter-yellow-led.jpg` (127) | 카운터 + 노란 LED |
| **/groups / Hero** | `wide-banquet.jpg` (20) | 단체 페이지 메인 |
| **/gallery 전체** | 49장 전체 + 음식 4장 + 인스타 임베드 | 탭 분리 |
| **푸터 우상단 / 외관 thumb** | `exterior-kbbq.jpg` (45) | "PREMIUM DINING" 사이니지 |

## OG / 소셜 공유 이미지

| 페이지 | OG 이미지 |
|---|---|
| 메인 `/` | `hero-moon-room.jpg` 1200×630 크롭 |
| `/about` | `moonjar-window.jpg` 1200×630 |
| `/locations/yangjae` | `booth-diamond.jpg` 1200×630 |
| `/locations/euljiro` | `wide-banquet.jpg` 1200×630 |
| `/groups` | `wide-banquet.jpg` 1200×630 |

## Image SEO 체크리스트 (Next.js `<Image>` + `alt`)

- 모든 이미지 alt에 **NER 키워드 포함** (예: "육즙관리소 더룸 을지로동대문점 본관 부스석")
- WebP/AVIF 자동 생성 (Next.js 기본)
- 사이트맵에 Image Sitemap 포함
- 파일명을 영문 슬러그(kebab-case)로 (검색엔진이 키워드로 인식)
