// === 26/27 시즌 개막 라운드 (미래 경기, 공식 일정) ===
// 결과가 아직 없다! 예측 후 경기가 끝나면 '결과 입력'으로 채점한다.
const FIXTURES = [
  {
    "home": "아스날",
    "away": "코번트리",
    "date": "2026-08-21",
    "homeRank": 1,
    "awayRank": 0,
    "h2h": []
  },
  {
    "home": "헐 시티",
    "away": "맨체스터 유나이티드",
    "date": "2026-08-22",
    "homeRank": 0,
    "awayRank": 3,
    "h2h": []
  },
  {
    "home": "에버턴",
    "away": "크리스탈 팰리스",
    "date": "2026-08-22",
    "homeRank": 13,
    "awayRank": 15,
    "h2h": [
      {
        "date": "2025/10",
        "home": "에버턴",
        "away": "크리스탈 팰리스",
        "score": "2:1",
        "res": "홈승"
      },
      {
        "date": "2026/05",
        "home": "크리스탈 팰리스",
        "away": "에버턴",
        "score": "2:2",
        "res": "무승부"
      }
    ]
  },
  {
    "home": "입스위치",
    "away": "선덜랜드",
    "date": "2026-08-22",
    "homeRank": 0,
    "awayRank": 7,
    "h2h": []
  },
  {
    "home": "노팅엄 포레스트",
    "away": "리즈",
    "date": "2026-08-22",
    "homeRank": 16,
    "awayRank": 14,
    "h2h": [
      {
        "date": "2025/11",
        "home": "노팅엄 포레스트",
        "away": "리즈",
        "score": "3:1",
        "res": "홈승"
      },
      {
        "date": "2026/02",
        "home": "리즈",
        "away": "노팅엄 포레스트",
        "score": "3:1",
        "res": "홈승"
      }
    ]
  },
  {
    "home": "브렌트포드",
    "away": "토트넘",
    "date": "2026-08-22",
    "homeRank": 9,
    "awayRank": 17,
    "h2h": [
      {
        "date": "2025/12",
        "home": "토트넘",
        "away": "브렌트포드",
        "score": "2:0",
        "res": "홈승"
      },
      {
        "date": "2026/01",
        "home": "브렌트포드",
        "away": "토트넘",
        "score": "0:0",
        "res": "무승부"
      }
    ]
  },
  {
    "home": "맨체스터 시티",
    "away": "본머스",
    "date": "2026-08-23",
    "homeRank": 2,
    "awayRank": 6,
    "h2h": [
      {
        "date": "2025/11",
        "home": "맨체스터 시티",
        "away": "본머스",
        "score": "3:1",
        "res": "홈승"
      },
      {
        "date": "2026/05",
        "home": "본머스",
        "away": "맨체스터 시티",
        "score": "1:1",
        "res": "무승부"
      }
    ]
  },
  {
    "home": "브라이턴",
    "away": "아스톤 빌라",
    "date": "2026-08-23",
    "homeRank": 8,
    "awayRank": 4,
    "h2h": [
      {
        "date": "2025/12",
        "home": "브라이턴",
        "away": "아스톤 빌라",
        "score": "3:4",
        "res": "원정승"
      },
      {
        "date": "2026/02",
        "home": "아스톤 빌라",
        "away": "브라이턴",
        "score": "1:0",
        "res": "홈승"
      }
    ]
  },
  {
    "home": "뉴캐슬",
    "away": "리버풀",
    "date": "2026-08-23",
    "homeRank": 12,
    "awayRank": 5,
    "h2h": [
      {
        "date": "2025/08",
        "home": "뉴캐슬",
        "away": "리버풀",
        "score": "2:3",
        "res": "원정승"
      },
      {
        "date": "2026/01",
        "home": "리버풀",
        "away": "뉴캐슬",
        "score": "4:1",
        "res": "홈승"
      }
    ]
  },
  {
    "home": "풀럼",
    "away": "첼시",
    "date": "2026-08-24",
    "homeRank": 10,
    "awayRank": 11,
    "h2h": [
      {
        "date": "2025/08",
        "home": "첼시",
        "away": "풀럼",
        "score": "2:0",
        "res": "홈승"
      },
      {
        "date": "2026/01",
        "home": "풀럼",
        "away": "첼시",
        "score": "2:1",
        "res": "홈승"
      }
    ]
  }
];

// === 25/26 시즌 380경기 전체에서 계산한 팀별 통계 (openfootball 실데이터) ===
// pts: 시즌 승점 / homePPG·awayPPG: 홈·원정 경기당 평균 승점
// formPPG: 마지막 10경기 평균 승점(최근 폼)
// promoted: 승격팀 → 25/26 EPL 기록이 없어 '강등 3팀 평균'을 대입 (모델의 한계!)
// (FIXTURES의 h2h = 두 팀 25/26 상대 전적. 승격팀 경기는 빈 배열 = 상대 전적 없음)
const TEAM_STATS = {
  "리버풀": {
    "pts": 60,
    "homePPG": 1.895,
    "awayPPG": 1.263,
    "formPPG": 1.2,
    "promoted": false
  },
  "본머스": {
    "pts": 57,
    "homePPG": 1.632,
    "awayPPG": 1.368,
    "formPPG": 1.8,
    "promoted": false
  },
  "아스톤 빌라": {
    "pts": 65,
    "homePPG": 2.0,
    "awayPPG": 1.421,
    "formPPG": 1.4,
    "promoted": false
  },
  "뉴캐슬": {
    "pts": 49,
    "homePPG": 1.684,
    "awayPPG": 0.895,
    "formPPG": 1.3,
    "promoted": false
  },
  "브라이턴": {
    "pts": 53,
    "homePPG": 1.737,
    "awayPPG": 1.053,
    "formPPG": 1.6,
    "promoted": false
  },
  "풀럼": {
    "pts": 52,
    "homePPG": 1.842,
    "awayPPG": 0.895,
    "formPPG": 1.2,
    "promoted": false
  },
  "선덜랜드": {
    "pts": 54,
    "homePPG": 1.737,
    "awayPPG": 1.105,
    "formPPG": 1.7,
    "promoted": false
  },
  "웨스트햄": {
    "pts": 39,
    "homePPG": 1.158,
    "awayPPG": 0.895,
    "formPPG": 1.4,
    "promoted": false
  },
  "토트넘": {
    "pts": 41,
    "homePPG": 0.789,
    "awayPPG": 1.368,
    "formPPG": 1.2,
    "promoted": false
  },
  "번리": {
    "pts": 22,
    "homePPG": 0.684,
    "awayPPG": 0.474,
    "formPPG": 0.3,
    "promoted": false
  },
  "울버햄튼": {
    "pts": 20,
    "homePPG": 0.737,
    "awayPPG": 0.316,
    "formPPG": 1.0,
    "promoted": false
  },
  "맨체스터 시티": {
    "pts": 78,
    "homePPG": 2.368,
    "awayPPG": 1.737,
    "formPPG": 1.9,
    "promoted": false
  },
  "노팅엄 포레스트": {
    "pts": 44,
    "homePPG": 1.053,
    "awayPPG": 1.263,
    "formPPG": 1.7,
    "promoted": false
  },
  "브렌트포드": {
    "pts": 53,
    "homePPG": 1.684,
    "awayPPG": 1.105,
    "formPPG": 1.0,
    "promoted": false
  },
  "첼시": {
    "pts": 52,
    "homePPG": 1.368,
    "awayPPG": 1.368,
    "formPPG": 0.7,
    "promoted": false
  },
  "크리스탈 팰리스": {
    "pts": 45,
    "homePPG": 1.105,
    "awayPPG": 1.263,
    "formPPG": 1.0,
    "promoted": false
  },
  "맨체스터 유나이티드": {
    "pts": 71,
    "homePPG": 2.211,
    "awayPPG": 1.526,
    "formPPG": 2.0,
    "promoted": false
  },
  "아스날": {
    "pts": 85,
    "homePPG": 2.474,
    "awayPPG": 2.0,
    "formPPG": 2.4,
    "promoted": false
  },
  "리즈": {
    "pts": 47,
    "homePPG": 1.684,
    "awayPPG": 0.789,
    "formPPG": 1.6,
    "promoted": false
  },
  "에버턴": {
    "pts": 49,
    "homePPG": 1.211,
    "awayPPG": 1.368,
    "formPPG": 0.9,
    "promoted": false
  },
  "코번트리": {
    "pts": 27,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "promoted": true,
    "last5": []
  },
  "헐 시티": {
    "pts": 27,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "promoted": true,
    "last5": []
  },
  "입스위치": {
    "pts": 27,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "promoted": true,
    "last5": []
  }
};
