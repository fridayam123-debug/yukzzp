// ===== AI 예측 모델 =====
// 25/26 시즌 실데이터(TEAM_STATS)로 26/27 경기의 승/무/패 확률을 계산한다.
//
// 모델이 고려하는 것:
//   1. 홈/원정 경기당 평균 승점 (팀은 홈에서 더 강하다 → 홈·원정을 따로 본다)
//   2. 최근 10경기 폼 (시즌 후반 기세)
//   3. 홈 어드밴티지 보정
// 모델이 고려하지 못하는 것 (정직한 한계):
//   - 여름 이적, 감독 교체·전술 변화, 부상 (수치 데이터가 없음)
//   - 승격팀의 진짜 전력 (EPL 기록이 없어 '강등 3팀 평균'으로 대신함)

const HOME_ADV = 0.3; // 홈 어드밴티지: 경기당 승점 +0.3 보정

// 팀의 "전력 점수" = 홈(또는 원정) 평균 승점 60% + 최근 폼 40% (+ 홈이면 보정)
function strengthOf(team, isHome) {
  const s = TEAM_STATS[team];
  const base = isHome ? s.homePPG : s.awayPPG;
  return 0.6 * base + 0.4 * s.formPPG + (isHome ? HOME_ADV : 0);
}

// 경기 하나의 확률 계산 → { pHome, pDraw, pAway, pick }
function predictMatch(home, away) {
  const hs = strengthOf(home, true);   // 홈팀 전력
  const as = strengthOf(away, false);  // 원정팀 전력

  // 무승부 확률: 두 팀 전력이 비슷할수록 높다 (20% ~ 28%)
  const diff = Math.abs(hs - as);
  const drawP = 20 + 8 * Math.max(0, 1 - diff / 2);

  // 남은 확률을 "전력의 제곱" 비율로 나눈다 (제곱 = 전력 차이를 강조)
  const rest = 100 - drawP;
  const hw = hs * hs;
  const aw = as * as;
  let pHome = rest * (hw / (hw + aw));
  let pAway = rest - pHome;

  // 소수 첫째 자리로 반올림하고, 합이 정확히 100.0이 되게 무승부로 보정
  pHome = Math.round(pHome * 10) / 10;
  pAway = Math.round(pAway * 10) / 10;
  const pDraw = Math.round((100 - pHome - pAway) * 10) / 10;

  // 판정 규칙: 홈팀 승률 50% 초과 → 홈 승 / 45% 미만 → 원정 승 / 45~50% → 무승부
  let pick;
  if (pHome > 50) pick = "home";
  else if (pHome < 45) pick = "away";
  else pick = "draw";

  return { pHome: pHome, pDraw: pDraw, pAway: pAway, pick: pick };
}
