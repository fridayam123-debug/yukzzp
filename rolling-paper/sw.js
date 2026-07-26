// 안드로이드 Chrome에서 "설치"(주소창 없는 앱 모드)가 뜨려면 fetch 핸들러가 있는
// 서비스워커가 필요하다. 캐시는 일부러 쓰지 않는다 —
// 메시지 목록이 실시간으로 바뀌는 페이지라, 캐싱하면 학생들이 옛 화면을 보게 된다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// 항상 네트워크로 그대로 통과시킨다 (오프라인 캐시 없음)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
