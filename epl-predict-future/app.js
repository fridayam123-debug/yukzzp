// ===== 게임 상태 =====
let playerName = "";
let myPicks = new Array(FIXTURES.length).fill(null);   // 내 예측 (home/draw/away)
let modelPicks = FIXTURES.map(function (f) {           // 모델 예측 (미리 계산)
  return predictMatch(f.home, f.away);
});

// ===== 화면 요소 =====
const nameInput = document.getElementById("name-input");
const startBtn = document.getElementById("start-btn");
const gameSection = document.getElementById("game-section");
const matchList = document.getElementById("match-list");
const saveBtn = document.getElementById("save-btn");
const progress = document.getElementById("progress");

// ===== 도우미 =====
function labelOf(code) {
  if (code === "home") return "홈 승";
  if (code === "away") return "원정 승";
  if (code === "draw") return "무승부";
  return "-";
}
function rankLabel(rank) {
  return rank && rank > 0 ? rank + "위" : "승격";
}

// ===== 1. 예측 시작 =====
startBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  if (name === "") { alert("이름을 입력해주세요!"); return; }
  playerName = name;
  document.getElementById("name-section").classList.add("hidden");
  gameSection.classList.remove("hidden");
  renderMatches();
});

// ===== 2. 경기 카드 그리기 =====
function renderMatches() {
  matchList.innerHTML = "";
  for (let i = 0; i < FIXTURES.length; i++) {
    const f = FIXTURES[i];
    const card = document.createElement("div");
    card.className = "match-card";
    // 팀 이름·순위는 우리 데이터라 안전 → innerHTML 사용
    card.innerHTML =
      '<div class="match-date">' + f.date + " 개막전</div>" +
      '<div class="match-teams">' +
        '<div class="team-row"><span class="badge home-badge">홈</span>' +
          '<span class="team-name">' + f.home + "</span>" +
          '<span class="rank">' + rankLabel(f.homeRank) + "</span></div>" +
        '<div class="vs">vs</div>' +
        '<div class="team-row"><span class="badge away-badge">원정</span>' +
          '<span class="team-name">' + f.away + "</span>" +
          '<span class="rank">' + rankLabel(f.awayRank) + "</span></div>" +
      "</div>" +
      '<div class="pick-buttons">' +
        '<button data-index="' + i + '" data-pick="home">홈 승</button>' +
        '<button data-index="' + i + '" data-pick="draw">무승부</button>' +
        '<button data-index="' + i + '" data-pick="away">원정 승</button>' +
      "</div>" +
      '<button class="form-toggle" data-index="' + i + '">▼ 최근 전적 보기</button>' +
      '<div class="form-box hidden" data-form="' + i + '"></div>' +
      '<div class="model-box hidden" data-model="' + i + '"></div>';
    matchList.appendChild(card);
  }
  updateProgress();
}

function updateProgress() {
  const picked = myPicks.filter(function (p) { return p !== null; }).length;
  progress.textContent = picked + " / " + FIXTURES.length + " 경기 선택";
  saveBtn.disabled = picked !== FIXTURES.length;
}

// ===== 3. 카드 안의 클릭 처리 (예측 / 최근전적 토글) =====
matchList.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  // (a) 최근 전적 토글
  if (btn.classList.contains("form-toggle")) {
    const i = Number(btn.dataset.index);
    const box = matchList.querySelector('[data-form="' + i + '"]');
    if (box.classList.contains("hidden")) {
      if (box.innerHTML === "") box.innerHTML = buildFormHTML(FIXTURES[i]);
      box.classList.remove("hidden");
      btn.textContent = "▲ 최근 전적 닫기";
    } else {
      box.classList.add("hidden");
      btn.textContent = "▼ 최근 전적 보기";
    }
    return;
  }

  // (b) 예측 선택
  if (btn.dataset.pick) {
    const i = Number(btn.dataset.index);
    myPicks[i] = btn.dataset.pick;
    const group = btn.parentElement.querySelectorAll("button");
    group.forEach(function (b) { b.classList.remove("selected"); });
    btn.classList.add("selected");
    revealModel(i);          // 내가 고른 뒤에 모델 예측 공개
    updateProgress();
  }
});

// 최근 5경기 전적 HTML (두 팀)
function buildFormHTML(fixture) {
  return oneTeamForm(fixture.home) + oneTeamForm(fixture.away);
}
function oneTeamForm(team) {
  const s = TEAM_STATS[team];
  let html = '<div class="form-team"><div class="form-team-name">' + team +
             " <span class=\"rank\">(25/26 " + s.pts + "점)</span></div>";
  if (s.promoted || s.last5.length === 0) {
    html += '<div class="form-none">승격팀 — 지난 시즌 EPL 전적 없음 (모델은 강등 3팀 평균으로 추정)</div></div>';
    return html;
  }
  html += '<div class="form-games">';
  for (let i = 0; i < s.last5.length; i++) {
    const g = s.last5[i];
    const vs = g.venue === "H" ? "vs" : "@";  // H=홈, A=원정(@)
    html += '<span class="form-chip ' + g.res + '">' + vs + g.opp + " " + g.score +
            '<span class="r">' + g.res + "</span></span>";
  }
  html += "</div></div>";
  return html;
}

// 모델 확률 공개
function revealModel(i) {
  const box = matchList.querySelector('[data-model="' + i + '"]');
  if (!box.classList.contains("hidden")) return; // 이미 공개됨
  const m = modelPicks[i];
  box.innerHTML =
    '<div class="model-title">🤖 AI 모델 예측</div>' +
    '<div class="prob-bar">' +
      '<span class="ph" style="width:' + m.pHome + '%">' + m.pHome + "%</span>" +
      '<span class="pd" style="width:' + m.pDraw + '%">' + m.pDraw + "%</span>" +
      '<span class="pa" style="width:' + m.pAway + '%">' + m.pAway + "%</span>" +
    "</div>" +
    '<div class="model-pick">모델의 예측: ' + labelOf(m.pick) +
      " (홈 " + m.pHome + "% · 무 " + m.pDraw + "% · 원정 " + m.pAway + "%)</div>";
  box.classList.remove("hidden");
}

// ===== 4. 예측 저장 =====
saveBtn.addEventListener("click", function () {
  const data = { name: playerName, myPicks: myPicks };
  localStorage.setItem("futurePrediction", JSON.stringify(data));
  showCompare();
});

// ===== 5. 내 예측 vs 모델 비교 + 결과 입력 화면 =====
function showCompare() {
  gameSection.classList.add("hidden");
  document.getElementById("compare-section").classList.remove("hidden");

  const cmp = document.getElementById("compare-list");
  cmp.innerHTML = "";
  for (let i = 0; i < FIXTURES.length; i++) {
    const f = FIXTURES[i];
    const mine = myPicks[i], model = modelPicks[i].pick;
    const agree = mine === model;
    const row = document.createElement("div");
    row.className = "compare-row";
    row.innerHTML =
      '<span class="compare-teams">' + f.home + " vs " + f.away + "</span>" +
      '<span class="compare-picks">나: ' + labelOf(mine) +
        ' / 모델: <span class="' + (agree ? "agree" : "disagree") + '">' + labelOf(model) +
        "</span></span>";
    cmp.appendChild(row);
  }

  // 결과 입력 칸 생성
  const entry = document.getElementById("result-entry");
  entry.innerHTML = "";
  for (let i = 0; i < FIXTURES.length; i++) {
    const f = FIXTURES[i];
    const row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML =
      '<span class="entry-teams">' + f.home + " vs " + f.away + "</span>" +
      '<input type="number" min="0" data-home="' + i + '" placeholder="0"> : ' +
      '<input type="number" min="0" data-away="' + i + '" placeholder="0">';
    entry.appendChild(row);
  }
}

// ===== 6. 채점 (나 vs 모델) =====
document.getElementById("grade-btn").addEventListener("click", function () {
  let myScore = 0, modelScore = 0, entered = 0;
  for (let i = 0; i < FIXTURES.length; i++) {
    const hv = document.querySelector('[data-home="' + i + '"]').value;
    const av = document.querySelector('[data-away="' + i + '"]').value;
    if (hv === "" || av === "") continue; // 아직 안 끝난 경기는 건너뜀
    entered++;
    const h = Number(hv), a = Number(av);
    let actual;
    if (h > a) actual = "home";
    else if (h < a) actual = "away";
    else actual = "draw";
    if (myPicks[i] === actual) myScore += 3;
    if (modelPicks[i].pick === actual) modelScore += 3;
  }
  if (entered === 0) {
    alert("실제 스코어를 하나 이상 입력해주세요! (경기가 끝난 뒤 채점합니다)");
    return;
  }
  showFinal(myScore, modelScore, entered);
});

function showFinal(myScore, modelScore, entered) {
  document.getElementById("final-box").classList.remove("hidden");
  const rows = [
    { name: playerName, score: myScore, cls: "me" },
    { name: "AI 모델", score: modelScore, cls: "ai" },
  ];
  rows.sort(function (a, b) { return b.score - a.score; });

  const tbody = document.querySelector("#score-table tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < rows.length; i++) {
    const tr = document.createElement("tr");
    tr.className = rows[i].cls;
    const rankTd = document.createElement("td"); rankTd.textContent = i + 1;
    const nameTd = document.createElement("td"); nameTd.textContent = rows[i].name; // XSS 방지: textContent
    const scoreTd = document.createElement("td"); scoreTd.textContent = rows[i].score + "점";
    tr.appendChild(rankTd); tr.appendChild(nameTd); tr.appendChild(scoreTd);
    tbody.appendChild(tr);
  }

  const v = document.getElementById("verdict");
  if (myScore > modelScore) v.textContent = "🎉 " + playerName + " 승리! 모델을 이겼어요 (" + entered + "경기 채점)";
  else if (myScore < modelScore) v.textContent = "🤖 AI 모델 승리 (" + entered + "경기 채점) — 다음엔 이겨봐요!";
  else v.textContent = "🤝 무승부! 모델과 동점 (" + entered + "경기 채점)";
}

// ===== 7. 새로 예측 =====
document.getElementById("reset-btn").addEventListener("click", function () {
  location.reload();
});
