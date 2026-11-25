// Offline support. Online: always fetch the newest files (and keep a copy).
// Offline: serve the last copy, so the app opens with no connection.
const CACHE = "iron-council-v16";

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Read index.html and store every script, stylesheet and icon it names.
    const res = await fetch("./", { cache: "no-cache" });
    const html = await res.clone().text();
    await cache.put("./", res);
    const urls = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((m) => m[1]);
    // fonts named inside css/fonts.css
    try { const fc = await (await fetch("css/fonts.css", { cache: "no-cache" })).text(); for (const m of fc.matchAll(/url\(\.\.\/([^)]+)\)/g)) urls.push(m[1]); } catch {}
    await Promise.all(["manifest.webmanifest", "favicon.svg", ...urls].map((u) =>
      fetch(u, { cache: "no-cache" }).then((r) => r.ok && cache.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(e.request);
      if (res.ok || res.type === "opaque") cache.put(e.request, res.clone());
      return res;
    } catch {
      return (await cache.match(e.request)) ||
             (await cache.match(e.request, { ignoreSearch: true })) ||
             (e.request.mode === "navigate" ? cache.match("./") : Response.error());
    }
  })());
});
