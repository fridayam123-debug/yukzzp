// 이 서비스워커의 목적은 두 가지다.
//  1) 안드로이드 Chrome에서 "앱 설치"(주소창 없는 앱 모드)가 뜨게 하는 설치 조건 충족
//     — 여기엔 오프라인에서도 뭔가 응답할 수 있어야 한다는 조건이 포함된다.
//  2) 그러면서도 온라인일 때는 항상 최신 화면을 보여줘야 한다
//     — 메시지 목록이 계속 바뀌는 페이지라 캐시가 굳으면 안 된다.
//
// 그래서 "네트워크 우선, 실패했을 때만 캐시" 전략을 쓴다.
// 온라인이면 무조건 새로 받아오고, 캐시는 오프라인 대비용으로만 갱신해 둔다.
const CACHE = "rolling-paper-shell-v1";
const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./lecturer.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Supabase API 등 다른 출처와 GET 이외 요청은 손대지 않고 그대로 통과
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        // 성공하면 그 응답을 그대로 쓰고, 사본만 오프라인 대비로 갱신
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(async () => {
        // 네트워크가 죽었을 때만 캐시에서 꺼낸다
        const hit = await caches.match(req);
        if (hit) return hit;
        if (req.mode === "navigate") {
          const shell = await caches.match("./index.html");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
