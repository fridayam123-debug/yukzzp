// === 26/27 시즌 개막 라운드 (미래 경기, 공식 일정) ===
// 결과가 아직 없다! 예측 후 경기가 끝나면 '결과 입력'으로 채점한다.
const FIXTURES = [
  {
    "home": "아스날",
    "away": "코번트리",
    "date": "2026-08-21",
    "homeRank": 1,
    "awayRank": 0
  },
  {
    "home": "헐 시티",
    "away": "맨체스터 유나이티드",
    "date": "2026-08-22",
    "homeRank": 0,
    "awayRank": 3
  },
  {
    "home": "에버턴",
    "away": "크리스탈 팰리스",
    "date": "2026-08-22",
    "homeRank": 13,
    "awayRank": 15
  },
  {
    "home": "입스위치",
    "away": "선덜랜드",
    "date": "2026-08-22",
    "homeRank": 0,
    "awayRank": 7
  },
  {
    "home": "노팅엄 포레스트",
    "away": "리즈",
    "date": "2026-08-22",
    "homeRank": 16,
    "awayRank": 14
  },
  {
    "home": "브렌트포드",
    "away": "토트넘",
    "date": "2026-08-22",
    "homeRank": 9,
    "awayRank": 17
  },
  {
    "home": "맨체스터 시티",
    "away": "본머스",
    "date": "2026-08-23",
    "homeRank": 2,
    "awayRank": 6
  },
  {
    "home": "브라이턴",
    "away": "아스톤 빌라",
    "date": "2026-08-23",
    "homeRank": 8,
    "awayRank": 4
  },
  {
    "home": "뉴캐슬",
    "away": "리버풀",
    "date": "2026-08-23",
    "homeRank": 12,
    "awayRank": 5
  },
  {
    "home": "풀럼",
    "away": "첼시",
    "date": "2026-08-24",
    "homeRank": 10,
    "awayRank": 11
  }
];

// === 25/26 시즌 380경기 전체에서 계산한 팀별 통계 (openfootball 실데이터) ===
// pts: 시즌 승점 / homePPG·awayPPG: 홈·원정 경기당 평균 승점
// formPPG: 마지막 10경기 평균 승점(최근 폼) / last5: 마지막 5경기 상세
// promoted: 승격팀 → 25/26 EPL 기록이 없어 '강등 3팀 평균'을 대입 (모델의 한계!)
const TEAM_STATS = {
  "리버풀": {
    "pts": 60,
    "homePPG": 1.895,
    "awayPPG": 1.263,
    "formPPG": 1.2,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "크리스탈 팰리스",
        "venue": "H",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/03",
        "opp": "맨체스터 유나이티드",
        "venue": "A",
        "score": "2:3",
        "res": "L"
      },
      {
        "date": "05/09",
        "opp": "첼시",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/15",
        "opp": "아스톤 빌라",
        "venue": "A",
        "score": "2:4",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "브렌트포드",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "본머스": {
    "pts": 57,
    "homePPG": 1.632,
    "awayPPG": 1.368,
    "formPPG": 1.8,
    "promoted": false,
    "last5": [
      {
        "date": "04/22",
        "opp": "리즈",
        "venue": "H",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/03",
        "opp": "크리스탈 팰리스",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/09",
        "opp": "풀럼",
        "venue": "A",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/19",
        "opp": "맨체스터 시티",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "노팅엄 포레스트",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "아스톤 빌라": {
    "pts": 65,
    "homePPG": 2.0,
    "awayPPG": 1.421,
    "formPPG": 1.4,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "풀럼",
        "venue": "A",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/03",
        "opp": "토트넘",
        "venue": "H",
        "score": "1:2",
        "res": "L"
      },
      {
        "date": "05/10",
        "opp": "번리",
        "venue": "A",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/15",
        "opp": "리버풀",
        "venue": "H",
        "score": "4:2",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "맨체스터 시티",
        "venue": "A",
        "score": "2:1",
        "res": "W"
      }
    ]
  },
  "뉴캐슬": {
    "pts": 49,
    "homePPG": 1.684,
    "awayPPG": 0.895,
    "formPPG": 1.3,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "아스날",
        "venue": "A",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/02",
        "opp": "브라이턴",
        "venue": "H",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/10",
        "opp": "노팅엄 포레스트",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "웨스트햄",
        "venue": "H",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "풀럼",
        "venue": "A",
        "score": "0:2",
        "res": "L"
      }
    ]
  },
  "브라이턴": {
    "pts": 53,
    "homePPG": 1.737,
    "awayPPG": 1.053,
    "formPPG": 1.6,
    "promoted": false,
    "last5": [
      {
        "date": "04/21",
        "opp": "첼시",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/02",
        "opp": "뉴캐슬",
        "venue": "A",
        "score": "1:3",
        "res": "L"
      },
      {
        "date": "05/09",
        "opp": "울버햄튼",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/17",
        "opp": "리즈",
        "venue": "A",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "맨체스터 유나이티드",
        "venue": "H",
        "score": "0:3",
        "res": "L"
      }
    ]
  },
  "풀럼": {
    "pts": 52,
    "homePPG": 1.842,
    "awayPPG": 0.895,
    "formPPG": 1.2,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "아스톤 빌라",
        "venue": "H",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/02",
        "opp": "아스날",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/09",
        "opp": "본머스",
        "venue": "H",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/17",
        "opp": "울버햄튼",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "뉴캐슬",
        "venue": "H",
        "score": "2:0",
        "res": "W"
      }
    ]
  },
  "선덜랜드": {
    "pts": 54,
    "homePPG": 1.737,
    "awayPPG": 1.105,
    "formPPG": 1.7,
    "promoted": false,
    "last5": [
      {
        "date": "04/24",
        "opp": "노팅엄 포레스트",
        "venue": "H",
        "score": "0:5",
        "res": "L"
      },
      {
        "date": "05/02",
        "opp": "울버햄튼",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/09",
        "opp": "맨체스터 유나이티드",
        "venue": "H",
        "score": "0:0",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "에버턴",
        "venue": "A",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "첼시",
        "venue": "H",
        "score": "2:1",
        "res": "W"
      }
    ]
  },
  "웨스트햄": {
    "pts": 39,
    "homePPG": 1.158,
    "awayPPG": 0.895,
    "formPPG": 1.4,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "에버턴",
        "venue": "H",
        "score": "2:1",
        "res": "W"
      },
      {
        "date": "05/02",
        "opp": "브렌트포드",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/10",
        "opp": "아스날",
        "venue": "H",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/17",
        "opp": "뉴캐슬",
        "venue": "A",
        "score": "1:3",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "리즈",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      }
    ]
  },
  "토트넘": {
    "pts": 41,
    "homePPG": 0.789,
    "awayPPG": 1.368,
    "formPPG": 1.2,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "울버햄튼",
        "venue": "A",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/03",
        "opp": "아스톤 빌라",
        "venue": "A",
        "score": "2:1",
        "res": "W"
      },
      {
        "date": "05/11",
        "opp": "리즈",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/19",
        "opp": "첼시",
        "venue": "A",
        "score": "1:2",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "에버턴",
        "venue": "H",
        "score": "1:0",
        "res": "W"
      }
    ]
  },
  "번리": {
    "pts": 22,
    "homePPG": 0.684,
    "awayPPG": 0.474,
    "formPPG": 0.3,
    "promoted": false,
    "last5": [
      {
        "date": "04/22",
        "opp": "맨체스터 시티",
        "venue": "H",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/01",
        "opp": "리즈",
        "venue": "A",
        "score": "1:3",
        "res": "L"
      },
      {
        "date": "05/10",
        "opp": "아스톤 빌라",
        "venue": "H",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/18",
        "opp": "아스날",
        "venue": "A",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "울버햄튼",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "울버햄튼": {
    "pts": 20,
    "homePPG": 0.737,
    "awayPPG": 0.316,
    "formPPG": 1.0,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "토트넘",
        "venue": "H",
        "score": "0:1",
        "res": "L"
      },
      {
        "date": "05/02",
        "opp": "선덜랜드",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/09",
        "opp": "브라이턴",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/17",
        "opp": "풀럼",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "번리",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "맨체스터 시티": {
    "pts": 78,
    "homePPG": 2.368,
    "awayPPG": 1.737,
    "formPPG": 1.9,
    "promoted": false,
    "last5": [
      {
        "date": "05/04",
        "opp": "에버턴",
        "venue": "A",
        "score": "3:3",
        "res": "D"
      },
      {
        "date": "05/09",
        "opp": "브렌트포드",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/13",
        "opp": "크리스탈 팰리스",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/19",
        "opp": "본머스",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "아스톤 빌라",
        "venue": "H",
        "score": "1:2",
        "res": "L"
      }
    ]
  },
  "노팅엄 포레스트": {
    "pts": 44,
    "homePPG": 1.053,
    "awayPPG": 1.263,
    "formPPG": 1.7,
    "promoted": false,
    "last5": [
      {
        "date": "04/24",
        "opp": "선덜랜드",
        "venue": "A",
        "score": "5:0",
        "res": "W"
      },
      {
        "date": "05/04",
        "opp": "첼시",
        "venue": "A",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/10",
        "opp": "뉴캐슬",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "맨체스터 유나이티드",
        "venue": "A",
        "score": "2:3",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "본머스",
        "venue": "H",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "브렌트포드": {
    "pts": 53,
    "homePPG": 1.684,
    "awayPPG": 1.105,
    "formPPG": 1.0,
    "promoted": false,
    "last5": [
      {
        "date": "04/27",
        "opp": "맨체스터 유나이티드",
        "venue": "A",
        "score": "1:2",
        "res": "L"
      },
      {
        "date": "05/02",
        "opp": "웨스트햄",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/09",
        "opp": "맨체스터 시티",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/17",
        "opp": "크리스탈 팰리스",
        "venue": "H",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "리버풀",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      }
    ]
  },
  "첼시": {
    "pts": 52,
    "homePPG": 1.368,
    "awayPPG": 1.368,
    "formPPG": 0.7,
    "promoted": false,
    "last5": [
      {
        "date": "04/21",
        "opp": "브라이턴",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/04",
        "opp": "노팅엄 포레스트",
        "venue": "H",
        "score": "1:3",
        "res": "L"
      },
      {
        "date": "05/09",
        "opp": "리버풀",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/19",
        "opp": "토트넘",
        "venue": "H",
        "score": "2:1",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "선덜랜드",
        "venue": "A",
        "score": "1:2",
        "res": "L"
      }
    ]
  },
  "크리스탈 팰리스": {
    "pts": 45,
    "homePPG": 1.105,
    "awayPPG": 1.263,
    "formPPG": 1.0,
    "promoted": false,
    "last5": [
      {
        "date": "05/03",
        "opp": "본머스",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/10",
        "opp": "에버턴",
        "venue": "H",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/13",
        "opp": "맨체스터 시티",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      },
      {
        "date": "05/17",
        "opp": "브렌트포드",
        "venue": "A",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/24",
        "opp": "아스날",
        "venue": "H",
        "score": "1:2",
        "res": "L"
      }
    ]
  },
  "맨체스터 유나이티드": {
    "pts": 71,
    "homePPG": 2.211,
    "awayPPG": 1.526,
    "formPPG": 2.0,
    "promoted": false,
    "last5": [
      {
        "date": "04/27",
        "opp": "브렌트포드",
        "venue": "H",
        "score": "2:1",
        "res": "W"
      },
      {
        "date": "05/03",
        "opp": "리버풀",
        "venue": "H",
        "score": "3:2",
        "res": "W"
      },
      {
        "date": "05/09",
        "opp": "선덜랜드",
        "venue": "A",
        "score": "0:0",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "노팅엄 포레스트",
        "venue": "H",
        "score": "3:2",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "브라이턴",
        "venue": "A",
        "score": "3:0",
        "res": "W"
      }
    ]
  },
  "아스날": {
    "pts": 85,
    "homePPG": 2.474,
    "awayPPG": 2.0,
    "formPPG": 2.4,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "뉴캐슬",
        "venue": "H",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/02",
        "opp": "풀럼",
        "venue": "H",
        "score": "3:0",
        "res": "W"
      },
      {
        "date": "05/10",
        "opp": "웨스트햄",
        "venue": "A",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/18",
        "opp": "번리",
        "venue": "H",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "크리스탈 팰리스",
        "venue": "A",
        "score": "2:1",
        "res": "W"
      }
    ]
  },
  "리즈": {
    "pts": 47,
    "homePPG": 1.684,
    "awayPPG": 0.789,
    "formPPG": 1.6,
    "promoted": false,
    "last5": [
      {
        "date": "04/22",
        "opp": "본머스",
        "venue": "A",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/01",
        "opp": "번리",
        "venue": "H",
        "score": "3:1",
        "res": "W"
      },
      {
        "date": "05/11",
        "opp": "토트넘",
        "venue": "A",
        "score": "1:1",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "브라이턴",
        "venue": "H",
        "score": "1:0",
        "res": "W"
      },
      {
        "date": "05/24",
        "opp": "웨스트햄",
        "venue": "A",
        "score": "0:3",
        "res": "L"
      }
    ]
  },
  "에버턴": {
    "pts": 49,
    "homePPG": 1.211,
    "awayPPG": 1.368,
    "formPPG": 0.9,
    "promoted": false,
    "last5": [
      {
        "date": "04/25",
        "opp": "웨스트햄",
        "venue": "A",
        "score": "1:2",
        "res": "L"
      },
      {
        "date": "05/04",
        "opp": "맨체스터 시티",
        "venue": "H",
        "score": "3:3",
        "res": "D"
      },
      {
        "date": "05/10",
        "opp": "크리스탈 팰리스",
        "venue": "A",
        "score": "2:2",
        "res": "D"
      },
      {
        "date": "05/17",
        "opp": "선덜랜드",
        "venue": "H",
        "score": "1:3",
        "res": "L"
      },
      {
        "date": "05/24",
        "opp": "토트넘",
        "venue": "A",
        "score": "0:1",
        "res": "L"
      }
    ]
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
