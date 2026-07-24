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
// rank: 최종 순위 / pts: 승점 / played: 경기수 / gf·ga·gd: 득점·실점·득실차
// homePPG·awayPPG: 홈·원정 경기당 평균 승점 / formPPG: 마지막 10경기 평균 승점
// recent5: 최근 5경기 결과(W/D/L)
// promoted: 승격팀 → 25/26 EPL 기록이 없어 '강등 3팀 평균'을 대입 (모델의 한계!)
// (FIXTURES의 h2h = 두 팀 25/26 상대 전적. 승격팀 경기는 빈 배열 = 상대 전적 없음)
const TEAM_STATS = {
  "리버풀": {
    "rank": 5,
    "pts": 60,
    "played": 38,
    "gf": 63,
    "ga": 53,
    "gd": 10,
    "homePPG": 1.895,
    "awayPPG": 1.263,
    "formPPG": 1.2,
    "recent5": [
      "W",
      "L",
      "D",
      "L",
      "D"
    ],
    "promoted": false
  },
  "본머스": {
    "rank": 6,
    "pts": 57,
    "played": 38,
    "gf": 58,
    "ga": 54,
    "gd": 4,
    "homePPG": 1.632,
    "awayPPG": 1.368,
    "formPPG": 1.8,
    "recent5": [
      "D",
      "W",
      "W",
      "D",
      "D"
    ],
    "promoted": false
  },
  "아스톤 빌라": {
    "rank": 4,
    "pts": 65,
    "played": 38,
    "gf": 56,
    "ga": 49,
    "gd": 7,
    "homePPG": 2.0,
    "awayPPG": 1.421,
    "formPPG": 1.4,
    "recent5": [
      "L",
      "L",
      "D",
      "W",
      "W"
    ],
    "promoted": false
  },
  "뉴캐슬": {
    "rank": 12,
    "pts": 49,
    "played": 38,
    "gf": 53,
    "ga": 55,
    "gd": -2,
    "homePPG": 1.684,
    "awayPPG": 0.895,
    "formPPG": 1.3,
    "recent5": [
      "L",
      "W",
      "D",
      "W",
      "L"
    ],
    "promoted": false
  },
  "브라이턴": {
    "rank": 8,
    "pts": 53,
    "played": 38,
    "gf": 52,
    "ga": 46,
    "gd": 6,
    "homePPG": 1.737,
    "awayPPG": 1.053,
    "formPPG": 1.6,
    "recent5": [
      "W",
      "L",
      "W",
      "L",
      "L"
    ],
    "promoted": false
  },
  "풀럼": {
    "rank": 10,
    "pts": 52,
    "played": 38,
    "gf": 47,
    "ga": 51,
    "gd": -4,
    "homePPG": 1.842,
    "awayPPG": 0.895,
    "formPPG": 1.2,
    "recent5": [
      "W",
      "L",
      "L",
      "D",
      "W"
    ],
    "promoted": false
  },
  "선덜랜드": {
    "rank": 7,
    "pts": 54,
    "played": 38,
    "gf": 42,
    "ga": 48,
    "gd": -6,
    "homePPG": 1.737,
    "awayPPG": 1.105,
    "formPPG": 1.7,
    "recent5": [
      "L",
      "D",
      "D",
      "W",
      "W"
    ],
    "promoted": false
  },
  "웨스트햄": {
    "rank": 18,
    "pts": 39,
    "played": 38,
    "gf": 46,
    "ga": 65,
    "gd": -19,
    "homePPG": 1.158,
    "awayPPG": 0.895,
    "formPPG": 1.4,
    "recent5": [
      "W",
      "L",
      "L",
      "L",
      "W"
    ],
    "promoted": false
  },
  "토트넘": {
    "rank": 17,
    "pts": 41,
    "played": 38,
    "gf": 48,
    "ga": 57,
    "gd": -9,
    "homePPG": 0.789,
    "awayPPG": 1.368,
    "formPPG": 1.2,
    "recent5": [
      "W",
      "W",
      "D",
      "L",
      "W"
    ],
    "promoted": false
  },
  "번리": {
    "rank": 19,
    "pts": 22,
    "played": 38,
    "gf": 38,
    "ga": 75,
    "gd": -37,
    "homePPG": 0.684,
    "awayPPG": 0.474,
    "formPPG": 0.3,
    "recent5": [
      "L",
      "L",
      "D",
      "L",
      "D"
    ],
    "promoted": false
  },
  "울버햄튼": {
    "rank": 20,
    "pts": 20,
    "played": 38,
    "gf": 27,
    "ga": 68,
    "gd": -41,
    "homePPG": 0.737,
    "awayPPG": 0.316,
    "formPPG": 1.0,
    "recent5": [
      "L",
      "D",
      "L",
      "D",
      "D"
    ],
    "promoted": false
  },
  "맨체스터 시티": {
    "rank": 2,
    "pts": 78,
    "played": 38,
    "gf": 77,
    "ga": 35,
    "gd": 42,
    "homePPG": 2.368,
    "awayPPG": 1.737,
    "formPPG": 1.9,
    "recent5": [
      "D",
      "W",
      "W",
      "D",
      "L"
    ],
    "promoted": false
  },
  "노팅엄 포레스트": {
    "rank": 16,
    "pts": 44,
    "played": 38,
    "gf": 48,
    "ga": 51,
    "gd": -3,
    "homePPG": 1.053,
    "awayPPG": 1.263,
    "formPPG": 1.7,
    "recent5": [
      "W",
      "W",
      "D",
      "L",
      "D"
    ],
    "promoted": false
  },
  "브렌트포드": {
    "rank": 9,
    "pts": 53,
    "played": 38,
    "gf": 55,
    "ga": 52,
    "gd": 3,
    "homePPG": 1.684,
    "awayPPG": 1.105,
    "formPPG": 1.0,
    "recent5": [
      "L",
      "W",
      "L",
      "D",
      "D"
    ],
    "promoted": false
  },
  "첼시": {
    "rank": 11,
    "pts": 52,
    "played": 38,
    "gf": 58,
    "ga": 52,
    "gd": 6,
    "homePPG": 1.368,
    "awayPPG": 1.368,
    "formPPG": 0.7,
    "recent5": [
      "L",
      "L",
      "D",
      "W",
      "L"
    ],
    "promoted": false
  },
  "크리스탈 팰리스": {
    "rank": 15,
    "pts": 45,
    "played": 38,
    "gf": 41,
    "ga": 51,
    "gd": -10,
    "homePPG": 1.105,
    "awayPPG": 1.263,
    "formPPG": 1.0,
    "recent5": [
      "L",
      "D",
      "L",
      "D",
      "L"
    ],
    "promoted": false
  },
  "맨체스터 유나이티드": {
    "rank": 3,
    "pts": 71,
    "played": 38,
    "gf": 69,
    "ga": 50,
    "gd": 19,
    "homePPG": 2.211,
    "awayPPG": 1.526,
    "formPPG": 2.0,
    "recent5": [
      "W",
      "W",
      "D",
      "W",
      "W"
    ],
    "promoted": false
  },
  "아스날": {
    "rank": 1,
    "pts": 85,
    "played": 38,
    "gf": 71,
    "ga": 27,
    "gd": 44,
    "homePPG": 2.474,
    "awayPPG": 2.0,
    "formPPG": 2.4,
    "recent5": [
      "W",
      "W",
      "W",
      "W",
      "W"
    ],
    "promoted": false
  },
  "리즈": {
    "rank": 14,
    "pts": 47,
    "played": 38,
    "gf": 49,
    "ga": 56,
    "gd": -7,
    "homePPG": 1.684,
    "awayPPG": 0.789,
    "formPPG": 1.6,
    "recent5": [
      "D",
      "W",
      "D",
      "W",
      "L"
    ],
    "promoted": false
  },
  "에버턴": {
    "rank": 13,
    "pts": 49,
    "played": 38,
    "gf": 47,
    "ga": 50,
    "gd": -3,
    "homePPG": 1.211,
    "awayPPG": 1.368,
    "formPPG": 0.9,
    "recent5": [
      "L",
      "D",
      "D",
      "L",
      "L"
    ],
    "promoted": false
  },
  "코번트리": {
    "rank": 0,
    "pts": 27,
    "played": 0,
    "gf": null,
    "ga": null,
    "gd": null,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "recent5": [],
    "promoted": true
  },
  "헐 시티": {
    "rank": 0,
    "pts": 27,
    "played": 0,
    "gf": null,
    "ga": null,
    "gd": null,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "recent5": [],
    "promoted": true
  },
  "입스위치": {
    "rank": 0,
    "pts": 27,
    "played": 0,
    "gf": null,
    "ga": null,
    "gd": null,
    "homePPG": 0.86,
    "awayPPG": 0.562,
    "formPPG": 0.9,
    "recent5": [],
    "promoted": true
  }
};
