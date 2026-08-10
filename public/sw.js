/* IK-HOUSE Service Worker — production-safe стратегия кэширования.
 *
 * Кэшируем: статику Next.js, иконки, шрифты, изображения (с лимитом).
 * НИКОГДА не кэшируем: /api/*, Supabase (auth/data), приватные разделы
 * (/account, /owner, /admin), POST-запросы. Бронирование offline невозможно —
 * пользователь видит honest offline-страницу, а не «заявка отправлена».
 */
const VERSION = "ikh-v2";
const STATIC_CACHE = `${VERSION}-static`;
const IMAGE_CACHE = `${VERSION}-images`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline.html";
const IMAGE_LIMIT = 60;

const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isPrivatePath(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/owner") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth")
  );
}

async function limitCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > limit) {
    await cache.delete(keys[0]);
    return limitCache(cacheName, limit);
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // POST/PUT и т.п. — только сеть

  const url = new URL(req.url);

  // Supabase и любые сторонние API — только сеть, без кэша
  if (url.origin !== self.location.origin) {
    if (url.hostname.endsWith("supabase.co")) return;
    // сторонние изображения (Unsplash, storage) — cache-first с лимитом
    if (req.destination === "image") {
      event.respondWith(cacheFirstImage(req));
    }
    return;
  }

  // Приватные разделы и API — только сеть; для навигации offline-fallback
  if (isPrivatePath(url.pathname)) {
    if (req.mode === "navigate") {
      event.respondWith(
        fetch(req).catch(() => caches.match(OFFLINE_URL)),
      );
    }
    return;
  }

  // Статика Next.js — cache-first (файлы иммутабельны)
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Изображения — cache-first с лимитом
  if (req.destination === "image") {
    event.respondWith(cacheFirstImage(req));
    return;
  }

  // Публичные страницы — network-first, при отказе кэш → offline
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
          return res;
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match(OFFLINE_URL);
        }
      })(),
    );
  }
});

async function cacheFirstImage(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const copy = res.clone();
      const cache = await caches.open(IMAGE_CACHE);
      await cache.put(req, copy);
      limitCache(IMAGE_CACHE, IMAGE_LIMIT);
    }
    return res;
  } catch {
    return Response.error();
  }
}
