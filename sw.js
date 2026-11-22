const C = "sohbet-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET") return;
  if (u.hostname === "cdn.jsdelivr.net") {
    e.respondWith(caches.open(C).then(c => c.match(r).then(h => h || fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x }))));
  } else if (u.origin === location.origin && (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html"))) {
    e.respondWith(fetch(r).then(x => { const y = x.clone(); caches.open(C).then(c => c.put(r, y)); return x }).catch(() => caches.match(r)));
  }
});
