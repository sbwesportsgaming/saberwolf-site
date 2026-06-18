const SBW_PWA_CACHE = "sbw-pwa-beta-v2";
const SBW_PWA_PRECACHE = [
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/apple-touch-icon.png",
  "/assets/images/app-sbw-beta-promo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SBW_PWA_CACHE)
      .then((cache) => cache.addAll(SBW_PWA_PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SBW_PWA_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  const isPwaStatic =
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/offline.html" ||
    url.pathname === "/assets/images/app-sbw-beta-promo.png" ||
    url.pathname.startsWith("/assets/icons/");

  if (!isPwaStatic) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(SBW_PWA_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
