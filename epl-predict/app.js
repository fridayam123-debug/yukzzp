// ===== 게임 상태 =====
let playerName = "";                              // 플레이어 이름
let picks = new Array(MATCHES.length).fill(null); // 내 예측 (home/draw/away)
const MAX_SCORE = MATCHES.length * 3;             // 만점 = 경기수 × 3

// ===== 화면 요소 가져오기 =====
const nameInput = document.getElementById("name-input");
const startBtn = document.getElementById("start-btn");
const gameSection = document.getElementById("game-section");
const matchList = document.getElementById("match-list");
const scoreBtn = document.getElementById("score-btn");
const progress = document.getElementById("progress");

// ===== 도우미: 예측/결과 코드를 한글 라벨로 =====
function labelOf(code) {
  if (code === "home") return "홈 승";
  if (code === "away") return "원정 승";
  return "무승부";
}

// 팀 순위 라벨 ("15위") — 표에 없으면 빈 문자열
function rankLabel(team) {
  return TEAM_RANK[team] ? TEAM_RANK[team] + "위" : "";
}

// 실제 경기 결과(home/draw/away) 계산
function resultOf(match) {
  if (match.homeScore > match.awayScore) return "home";
  if (match.homeScore < match.awayScore) return "away";
  return "draw";
}

// ===== 1. 게임 시작 =====
startBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  if (name === "") {
    alert("이름을 입력해주세요!");
    return;
  }
  playerName = name;
  document.getElementById("name-section").classList.add("hidden");
  gameSection.classList.remove("hidden");
  renderMatches();
});

// ===== 2. 경기 카드 그리기 =====
function renderMatches() {
  matchList.innerHTML = "";
  for (let i = 0; i < MATCHES.length; i++) {
    const match = MATCHES[i];
    const card = document.createElement("div");
    card.className = "match-card";
    // 팀 이름·날짜는 우리가 만든 데이터(data.js)라 안전 → innerHTML 사용
    card.innerHTML =
      '<div class="match-date">' + match.date + "</div>" +
      '<div class="match-teams">' +
        '<div class="team-row"><span class="badge home-badge">홈</span>' +
          '<span class="team-name">' + match.home + "</span>" +
          '<span class="rank">' + rankLabel(match.home) + "</span></div>" +
        '<div class="vs">vs</div>' +
        '<div class="team-row"><span class="badge away-badge">원정</span>' +
          '<span class="team-name">' + match.away + "</span>" +
          '<span class="rank">' + rankLabel(match.away) + "</span></div>" +
      "</div>" +
      '<div class="pick-buttons">' +
      '<button data-match="' + i + '" data-pick="home">홈 승</button>' +
      '<button data-match="' + i + '" data-pick="draw">무승부</button>' +
      '<button data-match="' + i + '" data-pick="away">원정 승</button>' +
      "</div>";
    matchList.appendChild(card);
  }
  updateProgress();
}

// 진행 상황 표시 + 채점 버튼 활성화
function updateProgress() {
  const picked = picks.filter(function (p) { return p !== null; }).length;
  progress.textContent = picked + " / " + MATCHES.length + " 경기 선택";
  scoreBtn.disabled = picked !== MATCHES.length;
}

// ===== 3. 예측 버튼 클릭 =====
matchList.addEventListener("click", function (e) {
  if (e.target.tagName !== "BUTTON") return;
  const matchIndex = Number(e.target.dataset.match);
  picks[matchIndex] = e.target.dataset.pick;

  // 같은 경기의 다른 버튼 선택 해제 → 클릭한 버튼만 선택 표시
  const buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(function (btn) { btn.classList.remove("selected"); });
  e.target.classList.add("selected");

  updateProgress();
});

// ===== 4. 채점하기 =====
// ⚠️ 보안 문제: 정답(data.js), 채점, 점수 저장이 전부 "사용자 브라우저"에서 일어난다.
//    → F12 개발자도구로 정답을 미리 보거나 localStorage 점수를 조작할 수 있다!
//    → 실제 서비스라면: 정답은 서버에만 두고, 채점도 서버에서 해야 조작을 막을 수 있다.
scoreBtn.addEventListener("click", function () {
  let score = 0;
  const details = []; // 경기별 채점 결과 (화면에 보여줄 용도)
  for (let i = 0; i < MATCHES.length; i++) {
    const match = MATCHES[i];
    const result = resultOf(match);
    const correct = picks[i] === result;
    if (correct) score += 3;
    details.push({ match: match, myPick: picks[i], result: result, correct: correct });
  }
  saveRanking(playerName, score);
  showResult(score, details);
});

// ===== 5. 랭킹 저장 (localStorage) =====
function saveRanking(name, score) {
  const rankings = loadRankings();
  rankings.push({ name: name, score: score });
  rankings.sort(function (a, b) { return b.score - a.score; }); // 높은 점수 순
  localStorage.setItem("rankings", JSON.stringify(rankings));
}

// localStorage에서 랭킹 읽기 (깨진 데이터는 빈 배열로)
function loadRankings() {
  try {
    return JSON.parse(localStorage.getItem("rankings")) || [];
  } catch (e) {
    return [];
  }
}

// 점수 유효성 검사: 0~만점 사이의 3의 배수인가?
//  · 999 같은 "순진한 조작"은 여기서 걸러진다 (⚠️ 표시).
//  · 하지만 60처럼 "유효 범위 안의 조작"은 못 막는다 → 그래서 서버 채점이 필요하다.
function isValidScore(score) {
  return typeof score === "number" && score >= 0 && score <= MAX_SCORE && score % 3 === 0;
}

// ===== 6. 결과 + 경기별 상세 + 랭킹 표시 =====
function showResult(score, details) {
  gameSection.classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  // 점수 + 백분율
  document.getElementById("my-score").textContent = score;
  document.getElementById("max-score").textContent = MAX_SCORE;
  document.getElementById("my-percent").textContent = Math.round((score / MAX_SCORE) * 100);

  renderDetail(details);
  renderRanking(score);
}

// 경기별 "내 예측 vs 실제 결과"
function renderDetail(details) {
  const box = document.getElementById("result-detail");
  box.innerHTML = "";
  for (let i = 0; i < details.length; i++) {
    const d = details[i];
    const row = document.createElement("div");
    row.className = "detail-row " + (d.correct ? "correct" : "wrong");
    const realScore = d.match.homeScore + ":" + d.match.awayScore;
    // 팀 이름은 우리 데이터라 안전
    row.innerHTML =
      '<span class="detail-teams">' +
        '<span class="mini-badge">홈</span>' + d.match.home +
        " vs " + d.match.away + '<span class="mini-badge out">원정</span>' +
      "</span>" +
      '<span class="detail-meta">내 예측: ' + labelOf(d.myPick) +
        " · 실제: " + labelOf(d.result) + " (" + realScore + ")" +
      '<span class="detail-mark">' + (d.correct ? "⭕" : "❌") + "</span></span>";
    box.appendChild(row);
  }
}

// 랭킹 표 (내 점수와 같은 첫 줄을 하이라이트)
function renderRanking(myScore) {
  const rankings = loadRankings();
  const tbody = document.querySelector("#ranking-table tbody");
  tbody.innerHTML = "";
  let highlighted = false;
  for (let i = 0; i < rankings.length; i++) {
    const entry = rankings[i];
    const valid = isValidScore(entry.score);
    const row = document.createElement("tr");

    const rankTd = document.createElement("td");
    rankTd.textContent = i + 1;

    // ⚠️ 이름은 사용자가 입력한 값 → textContent로 넣어야 XSS를 막는다.
    //    (innerHTML로 넣으면 이름에 <script>를 심어 공격할 수 있음)
    const nameTd = document.createElement("td");
    nameTd.textContent = entry.name;

    const scoreTd = document.createElement("td");
    scoreTd.textContent = valid ? (entry.score + "점") : (entry.score + "점 ⚠️검증실패");

    row.appendChild(rankTd);
    row.appendChild(nameTd);
    row.appendChild(scoreTd);

    // 내 이름·점수와 같은 첫 줄을 노란색으로 강조
    if (!highlighted && entry.name === playerName && entry.score === myScore) {
      row.className = "me";
      highlighted = true;
    }
    tbody.appendChild(row);
  }
}

// ===== 7. 다시 하기 =====
document.getElementById("retry-btn").addEventListener("click", function () {
  location.reload();
});
