// Supabase 프로젝트 생성 후 아래 두 값만 교체하면 됩니다.
// Project Settings → API → Project URL / anon public key
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const MAX_MESSAGES = 60;
const MIN_PAPERS = 4; // 첫 화면에 항상 보여줄 최소 페이퍼 수 (빈 종이 포함)
const MY_MESSAGES_KEY = "rolling-paper:my-messages";

// 서버(supabase.sql)에도 같은 목록으로 필터가 걸려있습니다.
// 여기서는 등록 전에 미리 안내하기 위한 1차 체크입니다.
const BANNED_WORDS = [
  "씨발", "씨팔", "시발", "ㅅㅂ", "개새끼", "개새기", "개새키",
  "병신", "ㅂㅅ", "지랄", "미친놈", "미친년", "좆", "존나", "존내",
  "걸레", "창녀", "보지", "자지", "씹", "꺼져", "죽어", "개년", "개놈",
];

const isConfigured =
  SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = isConfigured
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const form = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const messageError = document.getElementById("message-error");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const wallGrid = document.getElementById("wall-grid");
const wallCount = document.getElementById("wall-count");

function formatDate(isoString) {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function containsBannedWord(text) {
  const normalized = text.replace(/\s/g, "").toLowerCase();
  return BANNED_WORDS.some((w) => normalized.includes(w));
}

function getMyMessages() {
  try {
    return JSON.parse(localStorage.getItem(MY_MESSAGES_KEY) || "[]");
  } catch {
    return [];
  }
}

function rememberMyMessage(id, secret) {
  const mine = getMyMessages();
  mine.push({ id, secret });
  localStorage.setItem(MY_MESSAGES_KEY, JSON.stringify(mine));
}

function forgetMyMessage(id) {
  const mine = getMyMessages().filter((m) => m.id !== id);
  localStorage.setItem(MY_MESSAGES_KEY, JSON.stringify(mine));
}

function findMySecret(id) {
  const found = getMyMessages().find((m) => m.id === id);
  return found ? found.secret : null;
}

async function handleDelete(id) {
  const secret = findMySecret(id);
  if (!secret || !supabase) return;
  if (!window.confirm("이 메시지를 삭제할까요? 되돌릴 수 없습니다.")) return;

  const { error } = await supabase
    .from("rolling_messages")
    .delete()
    .eq("id", id)
    .eq("secret", secret);

  if (error) {
    window.alert("삭제에 실패했습니다. 다시 시도해주세요.");
    return;
  }

  forgetMyMessage(id);
  const card = wallGrid.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();

  const remaining = wallGrid.querySelectorAll(".card:not([data-blank])").length;
  updateCapacityState(remaining);
  renumberCards();
  syncBlankPapers();
}

function renderCard(msg, index) {
  const card = document.createElement("article");
  card.className = "card" + (index % 2 === 1 ? " card--alt" : "");
  card.dataset.id = msg.id;

  const isMine = !!findMySecret(msg.id);
  const deleteBtn = isMine
    ? `<button type="button" class="card__delete" aria-label="메시지 삭제" data-delete-id="${msg.id}">×</button>`
    : "";

  card.innerHTML = `
    <div class="card__inner">
      ${deleteBtn}
      <p class="card__message">${escapeHtml(msg.message)}</p>
      <div class="card__meta">
        <span class="card__order">${index + 1}번째 마음</span>
        <span class="card__date">${formatDate(msg.created_at)}</span>
      </div>
    </div>
  `;
  return card;
}

// 삭제 등으로 순번이 비면 1번부터 다시 매김
function renumberCards() {
  wallGrid.querySelectorAll(".card:not([data-blank])").forEach((card, i) => {
    card.classList.toggle("card--alt", i % 2 === 1);
    const order = card.querySelector(".card__order");
    if (order) order.textContent = `${i + 1}번째 마음`;
  });
}

function renderSkeletons(count = 3) {
  wallGrid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "skeleton";
    wallGrid.appendChild(el);
  }
}

function renderEmptyState(text) {
  wallGrid.innerHTML = `<div class="empty-state">${text}</div>`;
}

function makeBlankPaper(positionIndex) {
  const card = document.createElement("article");
  card.dataset.blank = "true";
  card.className = "card card--blank" + (positionIndex % 2 === 1 ? " card--alt" : "");
  card.innerHTML = `<div class="card__inner"></div>`;
  return card;
}

// 실제 메시지 카드 뒤에 빈 페이퍼를 채워 화면에 항상 최소 MIN_PAPERS장이 보이게 유지.
// 수강생이 작성하면 빈 페이퍼 한 장이 실제 메시지로 채워지고,
// 실제 메시지가 MIN_PAPERS장을 넘어서면 그때부터는 작성될 때마다 페이퍼가 추가로 늘어남.
function syncBlankPapers() {
  const realCount = wallGrid.querySelectorAll(".card:not([data-blank])").length;
  const blanks = wallGrid.querySelectorAll(".card[data-blank]");
  const desired = Math.max(0, MIN_PAPERS - realCount);
  for (let i = blanks.length - 1; i >= desired; i--) {
    blanks[i].remove();
  }
  for (let i = blanks.length; i < desired; i++) {
    wallGrid.appendChild(makeBlankPaper(realCount + i));
  }
}

function updateCapacityState(total) {
  wallCount.textContent = `${total}개의 마음`;
  if (total >= MAX_MESSAGES) {
    submitBtn.disabled = true;
    submitBtn.textContent = "정원이 가득 찼습니다";
    formError.hidden = true;
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "등록하기";
  }
}

function renderMessages(messages) {
  updateCapacityState(messages.length);
  wallGrid.innerHTML = "";
  messages.forEach((msg, i) => wallGrid.appendChild(renderCard(msg, i)));
  syncBlankPapers();
}

// 새 메시지는 목록 맨 아래(마지막 순번)에 추가 — 1번부터 아래로 내려가는 등록순 유지
function appendMessage(msg, currentTotal) {
  const card = renderCard(msg, currentTotal);
  const firstBlank = wallGrid.querySelector(".card[data-blank]");
  if (firstBlank) {
    wallGrid.insertBefore(card, firstBlank);
  } else {
    wallGrid.appendChild(card);
  }
  syncBlankPapers();
  updateCapacityState(currentTotal + 1);
}

async function loadMessages() {
  if (!supabase) {
    renderEmptyState("Supabase 연결 정보가 설정되지 않았습니다. app.js 상단의 SUPABASE_URL / SUPABASE_ANON_KEY를 입력해주세요.");
    return;
  }

  renderSkeletons();

  const { data, error } = await supabase
    .from("rolling_messages")
    .select("id, message, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    renderEmptyState("메시지를 불러오지 못했습니다. 잠시 후 새로고침해주세요.");
    return;
  }

  renderMessages(data);
}

wallGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-delete-id]");
  if (!btn) return;
  handleDelete(btn.dataset.deleteId);
});

messageInput.addEventListener("input", () => {
  charCount.textContent = String(messageInput.value.length);
  if (messageInput.value.trim()) {
    messageError.hidden = true;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.hidden = true;
  messageError.hidden = true;

  const message = messageInput.value.trim();
  if (!message) {
    messageError.hidden = false;
    messageInput.focus();
    return;
  }

  if (containsBannedWord(message)) {
    formError.textContent = "부적절한 표현이 포함되어 있어 등록할 수 없습니다.";
    formError.hidden = false;
    return;
  }

  if (!supabase) {
    formError.textContent = "Supabase 연결 정보가 설정되지 않아 등록할 수 없습니다.";
    formError.hidden = false;
    return;
  }

  const currentTotal = wallGrid.querySelectorAll(".card:not([data-blank])").length;
  if (currentTotal >= MAX_MESSAGES) {
    formError.textContent = "정원(60개)이 가득 차 더 이상 등록할 수 없습니다.";
    formError.hidden = false;
    return;
  }

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "등록 중...";

  const secret = crypto.randomUUID();

  const { data, error } = await supabase
    .from("rolling_messages")
    .insert({ message, secret })
    .select("id, message, created_at, secret")
    .single();

  if (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    formError.textContent = error.message && error.message.includes("banned word")
      ? "부적절한 표현이 포함되어 있어 등록할 수 없습니다."
      : error.message && error.message.includes("message limit")
      ? "정원(60개)이 가득 차 더 이상 등록할 수 없습니다."
      : "메시지 등록에 실패했습니다. 다시 시도해주세요.";
    formError.hidden = false;
    return;
  }

  submitBtn.textContent = originalLabel;
  rememberMyMessage(data.id, data.secret);
  appendMessage(data, currentTotal);

  form.reset();
  charCount.textContent = "0";
});

loadMessages();
