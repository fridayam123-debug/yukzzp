# 셰프 채널 풀 (Phase 2 RAG 시드)

AI 메뉴 개발 도구의 Phase 2에서 사용할 유튜브 채널 큐레이션. 자막 추출 → 임베딩 → 재료 멘션 추출용.

- **수집일**: 2026-05-13
- **수집자**: 배문진 대표
- **활용 시점**: Phase 2 (MVP 검증 후)
- **활용 방식**: yt-dlp로 채널별 영상·자막 다운로드 → embedding → RAG로 `ingredient_catalog` 보강 및 레시피 생성 시 셰프 멘션 컨텍스트 주입

## 채널 목록

| # | 핸들/ID | 채널명 (확인된 경우) | 추정 분야 | 비고 |
|---|---|---|---|---|
| 1 | @nsmyung2023 | (Phase 2 시작 시 확인) | (확인 필요) | |
| 2 | @kimchef76 | 전설의요리TV | 셰프·요리 | |
| 3 | @lets_ceo | 과장말고 사장하자 | F&B 사장학 | |
| 4 | @restaurantrecipelab | 식당레시피연구소 | 식당 레시피 | |
| 5 | @mrs_macarons | (확인 필요) | 베이킹·디저트 추정 | 한식 외이지만 디저트 메뉴 개발 참고용 |
| 6 | @strikerchef1542 | (확인 필요) | 셰프 | |
| 7 | @chefkds | (확인 필요) | (확인 필요) | |
| 8 | UCmzaVMzEPxg2z-aFpVBUBBg | (확인 필요) | (확인 필요) | 핸들 미상, 채널 ID로 보관 |

## 큐레이션 정책

### 신뢰도 가중치
- 정규 영상(브이로그 제외) 우선
- 광고/협찬 자막 자동 제외: 영상 자막에 "오늘 협찬", "광고 포함", "유료 광고", "PPL" 키워드 들어가면 해당 영상 통째로 RAG 제외
- 다수 셰프가 동일 브랜드 언급 시 신뢰도 가산 (`source_score` 컬럼)

### 환각 방어 연계
- 셰프 멘션이 있는 브랜드만 `ingredient_catalog`에 추가
- 멘션 출처(채널·영상·타임스탬프)를 `catalog.chef_mentions` 메타에 저장
- 레시피 생성 시 LLM이 출처 표기 가능: "백종원 골목식당 102회에서 사용한 X 브랜드"

## Phase 2 작업 항목

1. yt-dlp로 8개 채널 영상·자막 다운로드 스크립트
2. 자막 청크 → text-embedding-004 임베딩 → Supabase Vector 저장
3. 브랜드·제품 멘션 추출 (Gemini Flash로 자막 chunk → JSON 추출)
4. 추출 결과를 `ingredient_catalog` upsert + `chef_mentions` 메타 추가
5. Edge Function `analyze-recipe-photo`에 `relevant_chef_mentions` 컨텍스트 단계 추가
