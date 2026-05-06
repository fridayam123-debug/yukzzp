# HAR Network Analysis

**Total entries:** 804
**Creator:** {'name': '웹 인스펙터', 'version': '1.0.0'}

## Top 15 도메인
-   293  search.pstatic.net
-   161  map.pstatic.net
-    49  ssl.pstatic.net
-    49  pcmap.place.naver.com
-    35  g-place.pstatic.net
-    33  map.naver.com
-    29  maps-service.pstatic.net
-    27  pup-review-phinf.pstatic.net
-    20  ncpt.naver.com
-    17  
-    16  nlog.naver.com
-    13  tivan.naver.com
-    13  pcmap-api.place.naver.com
-     8  static-feedback.pstatic.net
-     6  nelo2-col.navercorp.com

## 캡처 시간
- 시작: 2026-05-06T05:27:49.562Z
- 끝: 2026-05-06T05:29:00.967Z

## 방문한 Naver Place 매장 ID
- 2056408561

## Apollo State 추출 성공
- URL: https://pcmap.place.naver.com/restaurant/2056408561/home?from=map&fromPanelNum=2&timestamp=202605061428&locale=ko&svcName=map_pcv5
- 키 개수: 36

### 데이터 타입 분포 (Top 20)
  - Menu: 10
  - InformationFacilities: 8
  - BusStation: 6
  - InnerRoute: 4
  - FsasReview: 3
  - Panorama: 1
  - PlaceDetailBase: 1
  - VisitorReviewStatsResult: 1
  - SubwayStationInfo: 1
  - ROOT_QUERY: 1

## 매장 상세 정보 (Apollo에서 추출)

### `PlaceDetailBase:2056408561`
  - **id:** 2056408561
  - **name:** 카펫앤스카이 후암
  - **reviewSettings:** {"__typename": "ReviewSettings", "keyword": null, "blog": 1, "cafe": 1, "showVisitorReviewScore": false}
  - **siteId:** sp_61ecbd8622ef20
  - **road:** 용산고 사거리 부근입니다. 주차는 10분거리에 공용주차장을 이용해주세요.
  - **conveniences:** (6개) ["단체 이용 가능", "포장", "무선 인터넷"]
  - **category:** 카페,디저트
  - **categoryCode:** 220563
  - **categoryCodeList:** (5개) ["220036", "220052", "220563"]
  - **defaultCategoryCodeList:** (3개) ["220036", "220052", "220563"]
  - **categoryCount:** 2
  - **rcode:** 09170101
  - **roadAddress:** 서울 용산구 후암로 11 4층 401호
  - **address:** 서울 용산구 후암동 214-4
  - **streetPanorama:** → Panorama:/jsX2Yin5+KwHtutjxqLkw==
  - **visitorReviewsTotal:** 68
  - **missingInfo:** {"__typename": "MissingInfo", "businessType": "restaurant", "isBizHourMissing": true, "isMenuImageMissing": false, "isAccessorMissing": false, "isDescriptionMissing": false, "isConveniencesMissing": false, "needLargeSuggestionBanner": true, "isBoss": false}
  - **microReviews:** (1개) ["작업과 대화가 어울리는 차분한 공간"]
  - **coordinate:** {"__typename": "Coordinate", "x": "126.9780558", "y": "37.5470236", "mapZoomLevel": 12}
  - **poiInfo:** {"__typename": "PoiInfo", "polyline": null, "land": null, "polygon": null, "relation": null, "parentRelation": null}
  - **virtualPhone:** 0507-1330-0905
  - **visitorReviewsTextReviewTotal:** 66

## 후기 관련 엔드포인트 (174개 호출)
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMDZfMTU4%2FMDAxNzcyNzczNjgyM
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMDhfMjk1%2FMDAxNzcyOTU5NDM1O
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAxMDJfNTUg%2FMDAxNzY3MzM0NjUxO
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAxMzFfMTky%2FMDAxNzY5ODI4ODc2N
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTExMjBfMTcy%2FMDAxNzYzNjIxMDc2O
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAxMThfMjYg%2FMDAxNzY4NzA0MjMwM
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEwMTFfNTgg%2FMDAxNzYwMTYzNjI5O
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMDJfNTMg%2FMDAxNzcyNDUxNTQwO
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAyMDJfMTU0%2FMDAxNzcwMDEyMzkxN
  - https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEyMTlfMTQ1%2FMDAxNzY2MTM5MjUwM

## GraphQL Operations (20회 호출)
  - getVisitorReviews: 2
  - getVisitorReviewStats: 2
  - getFeeds: 2
  - getMyPlaceProfile: 1
  - getUnifiedCoupons: 1
  - getAiBriefing: 1
  - getAnnouncements: 1
  - getReactionTypes: 1
  - getReviewAwardCoupons: 1
  - getVisitorReviewPhotosInVisitorReviewTab: 1
  - getMyRecentVisitorReviewAndVisit: 1
  - getMyRecentVisit: 1
  - getFollowingReviews: 1
  - getVisitorRatingReviews: 1
  - getVisitorReviewThemeLists: 1
  - getPhotoViewerItems: 1
  - getPhotoTabFilters: 1