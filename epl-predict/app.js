// ===== 게임 상태 =====
let playerName = "";                              // 플레이어 이름
let picks = new Array(MATCHES.length).fill(null); // 내 예측 (home/draw/away)

// ===== 화면 요소 가져오기 =====
const nameInput = document.getElementById("name-input");
const startBtn = document.getElementById("start-btn");
const gameSection = document.getElementById("game-section");
const matchList = document.getElementById("match-list");
const scoreBtn = document.getElementById("score-btn");

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
    card.innerHTML =
      '<div class="match-teams">' + match.home + " vs " + match.away + "</div>" +
      '<div class="pick-buttons">' +
      '<button data-match="' + i + '" data-pick="home">홈 승</button>' +
      '<button data-match="' + i + '" data-pick="draw">무승부</button>' +
      '<button data-match="' + i + '" data-pick="away">원정 승</button>' +
      "</div>";
    matchList.appendChild(card);
  }
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

  // 10경기 전부 선택하면 채점 버튼 활성화
  const allPicked = picks.every(function (p) { return p !== null; });
  scoreBtn.disabled = !allPicked;
});

// ===== 4. 채점하기 =====
// ⚠️ 보안 문제: 채점과 점수 저장이 전부 "사용자 브라우저"에서 일어난다.
//    → F12 개발자도구로 localStorage 점수를 마음대로 조작할 수 있다!
//    → 실제 서비스라면: 서버가 예측만 받고, 채점은 서버에서 해야 한다.
scoreBtn.addEventListener("click", function () {
  let score = 0;
  for (let i = 0; i < MATCHES.length; i++) {
    const match = MATCHES[i];
    // 실제 경기 결과 계산
    let result;
    if (match.homeScore > match.awayScore) result = "home";
    else if (match.homeScore < match.awayScore) result = "away";
    else result = "draw";
    // 내 예측과 비교
    if (picks[i] === result) score += 3;
  }
  saveRanking(playerName, score);
  showResult(score);
});

// ===== 5. 랭킹 저장 (localStorage) =====
function saveRanking(name, score) {
  let rankings = [];
  try {
    rankings = JSON.parse(localStorage.getItem("rankings")) || [];
  } catch (e) {
    rankings = []; // 저장된 데이터가 깨져 있으면 빈 랭킹으로 시작
  }
  rankings.push({ name: name, score: score });
  rankings.sort(function (a, b) { return b.score - a.score; }); // 높은 점수 순
  localStorage.setItem("rankings", JSON.stringify(rankings));
}

// ===== 6. 결과 + 랭킹 표시 =====
function showResult(score) {
  gameSection.classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");
  document.getElementById("my-score").textContent = score;

  let rankings = [];
  try {
    rankings = JSON.parse(localStorage.getItem("rankings")) || [];
  } catch (e) {
    rankings = [];
  }
  const tbody = document.querySelector("#ranking-table tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < rankings.length; i++) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td>" + rankings[i].name + "</td>" +
      "<td>" + rankings[i].score + "점</td>";
    tbody.appendChild(row);
  }
}

// ===== 7. 다시 하기 =====
document.getElementById("retry-btn").addEventListener("click", function () {
  location.reload();
});
