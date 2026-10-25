const CACHE_NAME = "artur-cheats-shell-v6";
const APP_SHELL = ["/", "/manifest.json", "/artur-cheats-banner.jpeg", "/artur-cheats-icon-180.png", "/artur-cheats-icon-192.png", "/artur-cheats-icon-512.png", "/artur-cheats-icon-maskable-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
