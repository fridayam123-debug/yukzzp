# EPL 승부예측 게임 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 브라우저에서 HTML 파일을 직접 열어 플레이하는 EPL 승부예측 게임 (디미고 입시학원 과제, 중3 수준).

**Architecture:** 순수 HTML/CSS/JS 4파일. 서버·빌드 도구·프레임워크 없음. 경기 데이터는 `data.js`에 JS 변수로 내장(file:// CORS 회피). 점수·랭킹은 localStorage — 의도적으로 조작 가능하게 두고 보안 시연 소재로 사용.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, localStorage

## Global Constraints

- 위치: `epl-predict/` (j project 저장소 루트 하위)
- 중3이 따라 만들 수 있는 수준: 클래스·모듈·빌드 금지, 함수 + 전역 변수만
- 모든 UI 텍스트 한국어
- fetch() 사용 금지 (file:// 환경에서 CORS 오류)
- 채점 규칙: 승무패 적중 시 +3점, 총 10경기 = 만점 30점
- 테스트는 브라우저 수동 확인 (테스트 프레임워크 없음 — 과제 범위 밖)

---

### Task 1: data.js — 경기 데이터

**Files:**
- Create: `epl-predict/data.js`

**Interfaces:**
- Produces: 전역 상수 `MATCHES` — `{ home, away, homeScore, awayScore }` 객체 10개 배열. app.js가 인덱스로 접근.

- [ ] **Step 1: data.js 작성**

```js
// EPL 2024-25 시즌 실제 경기 결과 10개 (openfootball 데이터 기반)
// 이미 끝난 경기를 쓰는 이유: 예측 후 바로 채점할 수 있어서!
const MATCHES = [
  { home: "맨체스터 유나이티드", away: "풀럼",             homeScore: 1, awayScore: 0 },
  { home: "첼시",               away: "맨체스터 시티",     homeScore: 0, awayScore: 2 },
  { home: "토트넘",             away: "에버턴",           homeScore: 4, awayScore: 0 },
  { home: "맨체스터 유나이티드", away: "리버풀",           homeScore: 0, awayScore: 3 },
  { home: "토트넘",             away: "아스날",           homeScore: 0, awayScore: 1 },
  { home: "맨체스터 시티",       away: "아스날",           homeScore: 2, awayScore: 2 },
  { home: "리버풀",             away: "첼시",             homeScore: 2, awayScore: 1 },
  { home: "맨체스터 시티",       away: "맨체스터 유나이티드", homeScore: 1, awayScore: 2 },
  { home: "토트넘",             away: "리버풀",           homeScore: 3, awayScore: 6 },
  { home: "아스날",             away: "맨체스터 시티",     homeScore: 5, awayScore: 1 },
];
```

- [ ] **Step 2: 브라우저 콘솔로 확인**

임시 확인: 브라우저에서 빈 HTML에 스크립트 로드 후 콘솔에서 `MATCHES.length` → `10` 출력 확인. (Task 2 완료 후 index.html에서 같이 확인해도 됨)

- [ ] **Step 3: Commit**

```bash
git add epl-predict/data.js
git commit -m "feat: EPL 경기 데이터 10개 추가"
```

### Task 2: index.html + style.css — 화면 뼈대

**Files:**
- Create: `epl-predict/index.html`
- Create: `epl-predict/style.css`

**Interfaces:**
- Produces: `#name-input`, `#start-btn`, `#game-section`, `#match-list`, `#score-btn`, `#result-section`, `#my-score`, `#ranking-table` — app.js가 이 id로 DOM 접근.

- [ ] **Step 1: index.html 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EPL 승부예측 게임</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>⚽ EPL 승부예측 게임</h1>
    <p>경기 결과를 예측하고 친구들과 점수를 겨뤄보세요!</p>
  </header>

  <!-- 1. 이름 입력 -->
  <section id="name-section">
    <input id="name-input" type="text" placeholder="이름을 입력하세요" maxlength="10">
    <button id="start-btn">게임 시작</button>
  </section>

  <!-- 2. 경기 예측 (시작 전에는 숨김) -->
  <section id="game-section" class="hidden">
    <h2>경기 결과를 예측하세요 (적중 시 +3점)</h2>
    <div id="match-list"></div>
    <button id="score-btn" disabled>채점하기</button>
  </section>

  <!-- 3. 결과 + 랭킹 (채점 전에는 숨김) -->
  <section id="result-section" class="hidden">
    <h2>내 점수: <span id="my-score">0</span>점 / 30점</h2>
    <h2>🏆 랭킹</h2>
    <table id="ranking-table">
      <thead><tr><th>순위</th><th>이름</th><th>점수</th></tr></thead>
      <tbody></tbody>
    </table>
    <button id="retry-btn">다시 하기</button>
  </section>

  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: style.css 작성**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Malgun Gothic', sans-serif;
  background: #f0f4f8;
  color: #1a2332;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
}

header { text-align: center; margin-bottom: 24px; }
header h1 { font-size: 24px; margin-bottom: 8px; }
header p { color: #5a6b7f; font-size: 14px; }

section { margin-bottom: 24px; }
h2 { font-size: 16px; margin-bottom: 12px; }

.hidden { display: none; }

#name-section { display: flex; gap: 8px; }
#name-input {
  flex: 1; padding: 12px; font-size: 16px;
  border: 1px solid #c5d0dc; border-radius: 8px;
}

button {
  padding: 12px 20px; font-size: 15px; font-weight: bold;
  border: none; border-radius: 8px; cursor: pointer;
  background: #3d195b; color: #fff;      /* EPL 보라색 */
}
button:disabled { background: #c5d0dc; cursor: not-allowed; }

.match-card {
  background: #fff; border-radius: 12px;
  padding: 14px; margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.match-teams { font-size: 15px; font-weight: bold; text-align: center; margin-bottom: 10px; }
.pick-buttons { display: flex; gap: 6px; }
.pick-buttons button {
  flex: 1; padding: 10px 4px; font-size: 13px;
  background: #eef2f6; color: #1a2332;
}
.pick-buttons button.selected { background: #3d195b; color: #fff; }

#score-btn, #retry-btn { width: 100%; margin-top: 8px; }

#ranking-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; }
#ranking-table th, #ranking-table td { padding: 10px; text-align: center; border-bottom: 1px solid #eef2f6; }
#ranking-table th { background: #3d195b; color: #fff; }
```

- [ ] **Step 3: 브라우저에서 index.html 열어 확인**

확인 항목: 제목·이름 입력·시작 버튼 표시, 게임/결과 섹션은 숨김 상태.

- [ ] **Step 4: Commit**

```bash
git add epl-predict/index.html epl-predict/style.css
git commit -m "feat: 게임 화면 뼈대 + 스타일"
```

### Task 3: app.js — 게임 시작 + 경기 카드 + 예측 선택

**Files:**
- Create: `epl-predict/app.js`

**Interfaces:**
- Consumes: `MATCHES` (data.js), Task 2의 DOM id들
- Produces: 전역 `playerName`(string), `picks`(길이 10 배열, "home"|"draw"|"away"|null) — Task 4의 채점 로직이 사용

- [ ] **Step 1: app.js 작성 (시작 → 카드 렌더 → 선택)**

```js
// ===== 게임 상태 =====
let playerName = "";                          // 플레이어 이름
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
```

- [ ] **Step 2: 브라우저 확인**

새로고침 → 이름 없이 시작 클릭 시 알림 → 이름 입력 후 시작 → 카드 10개 표시 → 버튼 선택 시 보라색 표시, 같은 경기 재선택 시 이전 선택 해제 → 10개 모두 선택 시 채점 버튼 활성화.

- [ ] **Step 3: Commit**

```bash
git add epl-predict/app.js
git commit -m "feat: 게임 시작·경기 카드·예측 선택"
```

### Task 4: app.js — 채점 + 랭킹 (localStorage)

**Files:**
- Modify: `epl-predict/app.js` (하단에 추가)

**Interfaces:**
- Consumes: `playerName`, `picks`, `MATCHES`
- Produces: localStorage 키 `"rankings"` — `[{ name, score }]` JSON 배열

- [ ] **Step 1: 채점·랭킹 코드 추가**

```js
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
```

- [ ] **Step 2: 브라우저 확인 (전체 플로우)**

- 전부 "홈 승" 선택 → 채점 → 12점(홈승 4경기 × 3점) 표시 확인
- 랭킹 표에 이름·점수 표시 확인
- 다시 하기 → 다른 이름으로 플레이 → 랭킹 2줄 누적 확인

- [ ] **Step 3: 조작 시연 확인**

F12 → Console에서:
```js
localStorage.setItem("rankings", JSON.stringify([{name:"해커", score:999}]))
```
→ 채점 후 랭킹에 "해커 999점" 1위 표시 확인. (이게 보안 과제 시연 소재)

- [ ] **Step 4: Commit**

```bash
git add epl-predict/app.js
git commit -m "feat: 채점·랭킹·localStorage 저장"
```

### Task 5: GUIDE.md — 예준이용 가이드

**Files:**
- Create: `epl-predict/GUIDE.md`

**Interfaces:**
- Consumes: 완성된 4파일

- [ ] **Step 1: GUIDE.md 작성**

내용 (전체 코드 설명 포함, 실행 시 실제 작성):
1. **이 앱이 뭔지** — 한 문단
2. **실행 방법** — index.html 더블클릭
3. **파일 4개가 각각 하는 일** — 표
4. **따라 만들기 순서** — 빈 폴더에서 4단계 (data.js → html/css → 선택 로직 → 채점/랭킹), 단계마다 "여기까지 하면 뭐가 보이는지"
5. **코드 핵심 개념 6개** — 변수/배열/함수/이벤트/DOM/localStorage, 각각 이 코드 어디에 쓰였는지
6. **보안 시연 (제출 포인트)** — F12 조작 순서 스크린샷 없이 글로, "왜 서버 채점이 필요한가" 결론
7. **제출할 때 말할 포인트 3개**

- [ ] **Step 2: Commit**

```bash
git add epl-predict/GUIDE.md
git commit -m "docs: 예준이용 따라 만들기 가이드"
```

### Task 6: 최종 QA

**Files:** 없음 (검증만)

- [ ] **Step 1: 전체 플로우 재확인** — 새 시크릿 창 기준 처음부터 끝까지
- [ ] **Step 2: 375px 모바일 폭 확인** — 카드·버튼 레이아웃 안 깨지는지
- [ ] **Step 3: 엣지 케이스** — 이름 미입력, 9개만 선택(채점 버튼 비활성), localStorage 깨진 값 넣고 새로고침(빈 랭킹으로 복구)
- [ ] **Step 4: 이상 있으면 수정 후 커밋**
