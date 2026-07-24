// EPL 2024-25 시즌 실제 경기 결과 10개
// 출처: openfootball (github.com/openfootball/football.json → 2024-25/en.1.json)
// 이미 끝난 경기를 쓰는 이유: 예측 후 바로 채점할 수 있어서!
const MATCHES = [
  { home: "맨체스터 유나이티드", away: "풀럼",              homeScore: 1, awayScore: 0 },
  { home: "첼시",                away: "맨체스터 시티",      homeScore: 0, awayScore: 2 },
  { home: "토트넘",              away: "에버턴",            homeScore: 4, awayScore: 0 },
  { home: "아스날",              away: "울버햄튼",          homeScore: 2, awayScore: 0 },
  { home: "맨체스터 시티",       away: "아스날",            homeScore: 2, awayScore: 2 },
  { home: "리버풀",              away: "첼시",              homeScore: 2, awayScore: 1 },
  { home: "토트넘",              away: "리버풀",            homeScore: 3, awayScore: 6 },
  { home: "맨체스터 시티",       away: "맨체스터 유나이티드", homeScore: 1, awayScore: 2 },
  { home: "리버풀",              away: "맨체스터 유나이티드", homeScore: 0, awayScore: 3 },
  { home: "아스날",              away: "맨체스터 시티",      homeScore: 5, awayScore: 1 },
];
