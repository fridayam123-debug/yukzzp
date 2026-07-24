// EPL 2024-25 시즌 실제 경기 결과 20개
// 출처: openfootball (github.com/openfootball/football.json → 2024-25/en.1.json)
// date/homeScore/awayScore 모두 실제 파일에서 검증한 값.
// 이미 끝난 경기를 쓰는 이유: 예측 후 바로 채점할 수 있어서!
const MATCHES = [
  { home: "맨체스터 유나이티드", away: "풀럼",              date: "2024-08-16", homeScore: 1, awayScore: 0 },
  { home: "첼시",                away: "맨체스터 시티",      date: "2024-08-18", homeScore: 0, awayScore: 2 },
  { home: "아스날",              away: "울버햄튼",          date: "2024-08-17", homeScore: 2, awayScore: 0 },
  { home: "토트넘",              away: "에버턴",            date: "2024-09-14", homeScore: 4, awayScore: 0 },
  { home: "맨체스터 시티",       away: "아스날",            date: "2024-09-22", homeScore: 2, awayScore: 2 },
  { home: "뉴캐슬",              away: "맨체스터 시티",      date: "2024-09-28", homeScore: 1, awayScore: 1 },
  { home: "리버풀",              away: "첼시",              date: "2024-10-20", homeScore: 2, awayScore: 1 },
  { home: "에버턴",              away: "아스날",            date: "2024-12-14", homeScore: 0, awayScore: 0 },
  { home: "맨체스터 시티",       away: "맨체스터 유나이티드", date: "2024-12-15", homeScore: 1, awayScore: 2 },
  { home: "아스톤 빌라",         away: "맨체스터 시티",      date: "2024-12-21", homeScore: 2, awayScore: 1 },
  { home: "토트넘",              away: "리버풀",            date: "2024-12-22", homeScore: 3, awayScore: 6 },
  { home: "리버풀",              away: "맨체스터 유나이티드", date: "2025-01-05", homeScore: 0, awayScore: 3 },
  { home: "노팅엄 포레스트",     away: "리버풀",            date: "2025-01-14", homeScore: 1, awayScore: 1 },
  { home: "브라이턴",            away: "맨체스터 유나이티드", date: "2025-01-19", homeScore: 3, awayScore: 1 },
  { home: "울버햄튼",            away: "첼시",              date: "2025-01-20", homeScore: 3, awayScore: 1 },
  { home: "풀럼",                away: "뉴캐슬",            date: "2025-02-01", homeScore: 1, awayScore: 2 },
  { home: "아스날",              away: "맨체스터 시티",      date: "2025-02-02", homeScore: 5, awayScore: 1 },
  { home: "브렌트포드",          away: "토트넘",            date: "2025-02-02", homeScore: 0, awayScore: 2 },
  { home: "웨스트햄",            away: "첼시",              date: "2025-02-03", homeScore: 2, awayScore: 1 },
  { home: "크리스탈 팰리스",     away: "아스톤 빌라",        date: "2025-02-25", homeScore: 4, awayScore: 1 },
];
