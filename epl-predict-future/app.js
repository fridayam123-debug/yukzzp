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
      '<button class="form-toggle" data-index="' + i + '">▼ 상대 전적 보기</button>' +
      '<div class="form-box hidden" data-form="' + i + '"></div>' +
      '<button class="info-toggle" data-index="' + i + '">▼ 팀 정보 보기</button>' +
      '<div class="info-box hidden" data-info="' + i + '"></div>' +
      '<button class="tactic-toggle" data-index="' + i + '">▼ 감독·전술·약점 보기</button>' +
      '<div class="tactic-box hidden" data-tactic="' + i + '"></div>' +
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

  // (a) 상대 전적(head-to-head) 토글
  if (btn.classList.contains("form-toggle")) {
    const i = Number(btn.dataset.index);
    const box = matchList.querySelector('[data-form="' + i + '"]');
    if (box.classList.contains("hidden")) {
      if (box.innerHTML === "") box.innerHTML = buildH2HHTML(FIXTURES[i]);
      box.classList.remove("hidden");
      btn.textContent = "▲ 상대 전적 닫기";
    } else {
      box.classList.add("hidden");
      btn.textContent = "▼ 상대 전적 보기";
    }
    return;
  }

  // (a-2) 팀 정보 토글
  if (btn.classList.contains("info-toggle")) {
    const i = Number(btn.dataset.index);
    const box = matchList.querySelector('[data-info="' + i + '"]');
    if (box.classList.contains("hidden")) {
      if (box.innerHTML === "") box.innerHTML = buildInfoHTML(FIXTURES[i]);
      box.classList.remove("hidden");
      btn.textContent = "▲ 팀 정보 닫기";
    } else {
      box.classList.add("hidden");
      btn.textContent = "▼ 팀 정보 보기";
    }
    return;
  }

  // (a-3) 감독·전술·약점 토글
  if (btn.classList.contains("tactic-toggle")) {
    const i = Number(btn.dataset.index);
    const box = matchList.querySelector('[data-tactic="' + i + '"]');
    if (box.classList.contains("hidden")) {
      if (box.innerHTML === "") box.innerHTML = buildTacticHTML(FIXTURES[i]);
      box.classList.remove("hidden");
      btn.textContent = "▲ 감독·전술·약점 닫기";
    } else {
      box.classList.add("hidden");
      btn.textContent = "▼ 감독·전술·약점 보기";
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

// 두 팀 상대 전적(head-to-head) HTML — 25/26 시즌 맞대결
function buildH2HHTML(fixture) {
  const games = fixture.h2h;
  let html = '<div class="form-team"><div class="form-team-name">' +
             fixture.home + " vs " + fixture.away + " — 25/26 상대 전적</div>";
  if (!games || games.length === 0) {
    html += '<div class="form-none">승격팀 경기 — 지난 시즌 상대 전적 없음</div></div>';
    return html;
  }
  html += '<div class="form-games">';
  for (let i = 0; i < games.length; i++) {
    const g = games[i];
    // 결과 색상: 이 경기의 홈팀 기준(홈승=초록, 원정승=빨강, 무=회색)
    const cls = g.res === "홈승" ? "W" : (g.res === "원정승" ? "L" : "D");
    html += '<span class="form-chip ' + cls + '">' + g.date + " " +
            g.home + " " + g.score + " " + g.away +
            '<span class="r">' + g.res + "</span></span>";
  }
  html += "</div></div>";
  return html;
}

// 두 팀 정보(25/26 성적) HTML
function buildInfoHTML(fixture) {
  return oneTeamInfo(fixture.home) + oneTeamInfo(fixture.away);
}
function oneTeamInfo(team) {
  const s = TEAM_STATS[team];
  let html = '<div class="info-team"><div class="info-team-name">' + team + "</div>";
  if (s.promoted) {
    html += '<div class="form-none">승격팀 — 지난 시즌 EPL 기록 없음 (챔피언십에서 승격)</div></div>';
    return html;
  }
  const gd = (s.gd >= 0 ? "+" : "") + s.gd;
  html +=
    '<div class="stat-grid">' +
      '<span class="stat"><b>' + s.rank + "위</b> 최종순위</span>" +
      '<span class="stat"><b>' + s.pts + "점</b> 승점</span>" +
      '<span class="stat"><b>' + s.gf + ":" + s.ga + "</b> 득실 (" + gd + ")</span>" +
      '<span class="stat"><b>' + s.homePPG.toFixed(2) + "</b> 홈 평균승점</span>" +
      '<span class="stat"><b>' + s.awayPPG.toFixed(2) + "</b> 원정 평균승점</span>" +
    "</div>" +
    '<div class="recent-form"><span class="recent-label">최근 5경기</span>';
  for (let i = 0; i < s.recent5.length; i++) {
    const r = s.recent5[i];
    html += '<span class="rchip ' + r + '">' + r + "</span>";
  }
  html += "</div></div>";
  return html;
}

// 감독·전술·약점 HTML (감독·전술은 조사된 데이터가 있을 때만 표시)
function buildTacticHTML(fixture) {
  return oneTeamTactic(fixture.home) + oneTeamTactic(fixture.away);
}
function oneTeamTactic(team) {
  const s = TEAM_STATS[team];
  const t = (typeof TEAM_TACTICS !== "undefined") ? TEAM_TACTICS[team] : null;
  let html = '<div class="tactic-team"><div class="tactic-team-name">' + team + "</div>";

  if (t && t.manager) {
    // manager 필드에 "감독 이름 — 만드는 축구 스타일"이 함께 서술되어 있음
    html += '<div class="tactic-line"><b>감독</b> ' + t.manager + "</div>";
  } else {
    html += '<div class="tactic-line unknown"><b>감독</b> 26/27 시즌 확정 정보 없음 (확인 필요)</div>';
  }
  if (t && t.formation) {
    html += '<div class="tactic-line"><b>선호 포메이션</b> ' + t.formation + "</div>";
  }

  const weaknesses = weaknessOf(team, s);
  html += '<div class="tactic-line"><b>약점(25/26 데이터 근거)</b></div><ul class="weakness-list">';
  for (let i = 0; i < weaknesses.length; i++) {
    html += "<li>" + weaknesses[i] + "</li>";
  }
  html += "</ul></div>";
  return html;
}

// 25/26 실데이터로 약점을 자동 도출 (추측이 아니라 숫자 근거)
function weaknessOf(team, s) {
  if (s.promoted) {
    return ["승격팀 — 25/26 EPL 데이터가 없어 약점을 산출할 수 없음 (챔피언십에서 승격)"];
  }
  const list = [];
  const gaPerGame = s.ga / s.played;
  const gfPerGame = s.gf / s.played;

  if (gaPerGame >= 1.3) {
    list.push("수비 불안 — 경기당 평균 " + gaPerGame.toFixed(2) + "실점 (시즌 총 " + s.ga + "실점)");
  }
  if (gfPerGame <= 1.1) {
    list.push("득점력 부족 — 경기당 평균 " + gfPerGame.toFixed(2) + "득점 (시즌 총 " + s.gf + "득점)");
  }
  if (s.awayPPG < s.homePPG - 0.5) {
    list.push("원정 경기에 약함 — 홈 평균승점 " + s.homePPG.toFixed(2) +
               " vs 원정 " + s.awayPPG.toFixed(2));
  }
  const recentPts = s.recent5.reduce(function (sum, r) {
    return sum + (r === "W" ? 3 : r === "D" ? 1 : 0);
  }, 0);
  if (recentPts <= 4) {
    list.push("최근 폼 하락 — 최근 5경기 " + s.recent5.join("") +
               " (승점 " + recentPts + "/15)");
  }
  if (list.length === 0) {
    list.push("25/26 데이터 기준 뚜렷한 약점 없음 (안정적인 시즌)");
  }
  return list;
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
