// Supabase 프로젝트 생성 후 아래 두 값만 교체하면 됩니다.
// Project Settings → API → Project URL / anon public key
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const isConfigured =
  SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabase = isConfigured
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const form = document.getElementById("message-form");
const nameInput = document.getElementById("name");
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

function renderCard(msg, index) {
  const card = document.createElement("article");
  card.className = "card" + (index % 2 === 1 ? " card--alt" : "");
  const displayName = msg.name && msg.name.trim() ? msg.name.trim() : "익명";
  card.innerHTML = `
    <div class="card__inner">
      <p class="card__message">${escapeHtml(msg.message)}</p>
      <div class="card__meta">
        <span class="card__from">from. ${escapeHtml(displayName)}</span>
        <span class="card__date">${formatDate(msg.created_at)}</span>
      </div>
    </div>
  `;
  return card;
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

function renderMessages(messages) {
  wallCount.textContent = `${messages.length}개의 마음`;
  if (messages.length === 0) {
    renderEmptyState("첫 메시지를 남겨보세요");
    return;
  }
  wallGrid.innerHTML = "";
  messages.forEach((msg, i) => wallGrid.appendChild(renderCard(msg, i)));
}

function prependMessage(msg, currentTotal) {
  if (currentTotal === 0) {
    wallGrid.innerHTML = "";
  }
  const card = renderCard(msg, 0);
  wallGrid.prepend(card);
  wallCount.textContent = `${currentTotal + 1}개의 마음`;
}

async function loadMessages() {
  if (!supabase) {
    renderEmptyState("Supabase 연결 정보가 설정되지 않았습니다. app.js 상단의 SUPABASE_URL / SUPABASE_ANON_KEY를 입력해주세요.");
    return;
  }

  renderSkeletons();

  const { data, error } = await supabase
    .from("messages")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    renderEmptyState("메시지를 불러오지 못했습니다. 잠시 후 새로고침해주세요.");
    return;
  }

  renderMessages(data);
}

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

  if (!supabase) {
    formError.textContent = "Supabase 연결 정보가 설정되지 않아 등록할 수 없습니다.";
    formError.hidden = false;
    return;
  }

  const name = nameInput.value.trim();
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "등록 중...";

  const { data, error } = await supabase
    .from("messages")
    .insert({ name: name || null, message })
    .select("id, name, message, created_at")
    .single();

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;

  if (error) {
    formError.textContent = "메시지 등록에 실패했습니다. 다시 시도해주세요.";
    formError.hidden = false;
    return;
  }

  const currentTotal = wallGrid.querySelectorAll(".card").length;
  prependMessage(data, currentTotal);

  form.reset();
  charCount.textContent = "0";
});

loadMessages();
