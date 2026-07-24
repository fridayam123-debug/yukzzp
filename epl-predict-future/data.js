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

// 감독·전술 (외부 조사, 2026-07-25 기준 공식 구단·언론 소스로 교차 검증된 것만 채움)
// manager: 감독 이름 뒤에 "이 감독이 만드는 축구 스타일"을 함께 서술
// null = 공신력 있는 소스로 확인하지 못함 → 화면에 "확인 필요"로 정직하게 표시
//   (헐 시티·크리스탈 팰리스·풀럼: 26/27 감독이 미정이거나 검증되지 않아 비워둠)
const TEAM_TACTICS = {
  "아스날": {
    "manager": "미켈 아르테타 — 높은 점유율을 기반으로 측면을 침투하며 세트피스를 적극 활용하는 축구",
    "formation": "4-3-3", "style": "높은 점유율과 측면 침투 위주", "confidence": "high"
  },
  "코번트리": {
    "manager": "프랭크 램파드 — 조직적인 중원 장악과 규율 잡힌 수비 전환을 강조하는 축구",
    "formation": "4-2-3-1", "style": "조직적이고 규율있는 중원 장악", "confidence": "high"
  },
  "헐 시티": { "manager": null, "formation": null, "style": null, "confidence": "low" },
  "맨체스터 유나이티드": {
    "manager": "마이클 캐릭 — 인내심 있는 빌드업과 중원 장악을 바탕으로 기회를 노리는 축구",
    "formation": "4-2-3-1", "style": "중원 장악과 인내심 있는 포지셔닝", "confidence": "high"
  },
  "에버턴": {
    "manager": "데이비드 모예스 — 탄탄한 조직력과 세트피스, 빠른 역습을 앞세우는 실용적인 축구",
    "formation": "4-2-3-1", "style": "조직력과 세트피스 중심의 실용 축구", "confidence": "high"
  },
  "크리스탈 팰리스": { "manager": null, "formation": null, "style": null, "confidence": "low" },
  "입스위치": {
    "manager": "게리 오닐 — 상황에 따라 형태를 바꾸는 유연하고 실용적인 축구",
    "formation": "3-4-2-1", "style": "유동적 형태의 실용주의", "confidence": "medium"
  },
  "선덜랜드": {
    "manager": "레지 르 브리 — 측면 1대1 돌파와 빠른 역습 전환을 중시하는 축구",
    "formation": "4-2-3-1", "style": "측면 1대1과 빠른 전환", "confidence": "high"
  },
  "노팅엄 포레스트": {
    "manager": "올리버 글라스너 — 공격적이고 유동적인 대형으로 측면을 적극 활용하는 축구",
    "formation": "3-4-2-1", "style": "공격적·유동적인 측면 공략", "confidence": "high"
  },
  "리즈": {
    "manager": "다니엘 파르케 — 풀백을 활용한 점유율 장악과 측면 전개를 중시하는 축구",
    "formation": "3-4-2-1", "style": "풀백 기반 점유율과 측면 활용", "confidence": "high"
  },
  "브렌트포드": {
    "manager": "키스 앤드루스 — 직접적이고 빠른 측면 공략과 강한 압박을 강조하는 축구",
    "formation": "4-2-3-1", "style": "직선적인 측면 공략과 압박", "confidence": "high"
  },
  "토트넘": {
    "manager": "로베르토 데제르비 — 점유율을 지배하며 의도적으로 변칙을 섞는(controlled chaos) 축구",
    "formation": "4-2-3-1", "style": "점유율 지배 + 변칙적 측면 공격", "confidence": "high"
  },
  "맨체스터 시티": {
    "manager": "엔조 마레스카 — 기술적인 점유율 장악과 풀백의 중원 침투를 활용하는 포지셔널 축구",
    "formation": "3-2-2-3", "style": "기술적 점유율과 풀백의 중원 침투", "confidence": "high"
  },
  "본머스": {
    "manager": "마르코 로제 — 강한 전방 압박(게겐프레싱)과 빠른 수직 전개를 강조하는 축구",
    "formation": "4-3-3", "style": "강한 전방 압박과 수직 플레이", "confidence": "high"
  },
  "브라이턴": {
    "manager": "파비안 휘르첼러 — 유동적인 포지셔닝과 측면 압박을 활용하는 역동적인 축구",
    "formation": "4-2-3-1", "style": "유동적 포지셔닝과 측면 압박", "confidence": "high"
  },
  "아스톤 빌라": {
    "manager": "우나이 에메리 — 탄탄한 수비 구조를 바탕으로 측면을 노리는 실리적인 축구",
    "formation": "4-2-3-1", "style": "수비 구조 + 측면 공략의 실리 축구", "confidence": "high"
  },
  "뉴캐슬": {
    "manager": "에디 하우 — 조직적인 측면 공격과 빠른 전환을 앞세우는 축구",
    "formation": "4-3-3", "style": "조직적 측면 공격과 빠른 전환", "confidence": "high"
  },
  "리버풀": {
    "manager": "안도니 이라올라 — 강한 전방 압박(게겐프레싱)으로 빠르게 볼을 탈취해 측면을 공략하는 축구",
    "formation": "4-2-3-1", "style": "강한 게겐프레싱과 측면 공략", "confidence": "high"
  },
  "풀럼": { "manager": null, "formation": null, "style": null, "confidence": "low" },
  "첼시": {
    "manager": "사비 알론소 — 후방 빌드업부터 통제된 점유율을 유지하는 포제셔널 축구",
    "formation": "3-4-3", "style": "통제된 점유율 기반 포제셔널 플레이", "confidence": "high"
  }
};

