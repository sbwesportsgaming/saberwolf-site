/*
  -SBW- PWA Beta Service Worker v1.6.41
  - Cache conservador com versionamento para evitar assets antigos no app instalado.
  - HTML/pages usam network-first e caem para offline.html somente sem conexão.
  - Não cacheia Supabase, Auth, Admin, dados privados ou páginas dinâmicas de forma agressiva.
*/

const SBW_PWA_CACHE = "sbw-pwa-beta-v4";
const SBW_PWA_PRECACHE = [
  "/offline.html",
  "/manifest.webmanifest?v=20260618-1641",
  "/assets/icons/icon-192-v3.png",
  "/assets/icons/icon-512-v3.png",
  "/assets/icons/apple-touch-icon-v3.png",
  "/assets/images/app-sbw-beta-promo-v2.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SBW_PWA_CACHE)
      .then((cache) => cache.addAll(SBW_PWA_PRECACHE))
      .then(() => self.skipWaiting())
  );
});


self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SBW_SKIP_WAITING" || data.type === "SBW_APPLY_UPDATE") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SBW_PWA_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isPwaStaticAsset(pathname) {
  return (
    pathname === "/manifest.webmanifest" ||
    pathname === "/offline.html" ||
    pathname === "/assets/images/app-sbw-beta-promo-v2.png" ||
    pathname === "/assets/icons/icon-192-v3.png" ||
    pathname === "/assets/icons/icon-512-v3.png" ||
    pathname === "/assets/icons/apple-touch-icon-v3.png"
  );
}

function networkFirst(request, fallbackUrl) {
  return fetch(request, { cache: "no-store" }).catch(() => {
    if (fallbackUrl) return caches.match(fallbackUrl);
    return caches.match(request);
  });
}

function networkFirstStatic(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(SBW_PWA_CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => caches.match(request));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/offline.html"));
    return;
  }

  if (!isPwaStaticAsset(url.pathname)) return;

  event.respondWith(networkFirstStatic(request));
});
