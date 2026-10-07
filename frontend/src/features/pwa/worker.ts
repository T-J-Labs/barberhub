/** Sem bibliotecas de precache: esta lista é toda a persistência da PWA. */
export const pwaCachePrefix = "barberhub-pwa-"
export const pwaCacheVersion = "v2"
export const pwaOfflineAssets = ["/pwa/offline.html", "/pwa/icon-192.png"] as const

export function pwaWorkerSource(origin: string) {
  return `"use strict";
const ORIGIN = ${JSON.stringify(origin)};
const PREFIX = ${JSON.stringify(pwaCachePrefix)};
const CACHE = PREFIX + ${JSON.stringify(pwaCacheVersion)};
const ASSETS = ${JSON.stringify(pwaOfflineAssets)};
// Defesa adicional: não instalar nem interceptar em outra origem.
if (self.location.origin === ORIGIN) {
  self.addEventListener('install', event => {
    event.waitUntil((async () => {
      const responses = await Promise.all(ASSETS.map(async path => {
        const response = await fetch(new Request(ORIGIN + path, { cache: 'no-store', credentials: 'omit', redirect: 'error' }));
        if (!response.ok || response.type === 'opaque') throw new Error('Offline assets unavailable');
        return response;
      }));
      const cache = await caches.open(CACHE);
      await Promise.all(ASSETS.map((path, index) => cache.put(ORIGIN + path, responses[index])));
    })());
    // Sem skipWaiting: atualizações esperam o fechamento das abas controladas.
  });
  self.addEventListener('activate', event => {
    event.waitUntil((async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
      }
    })());
    // Sem clients.claim ou recarga: a primeira preparação exige nova navegação.
  });
  self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    if (url.origin !== ORIGIN || request.method !== 'GET') return;
    // Nunca substituir RSC/prefetch, API, autenticação ou recursos do Next por HTML.
    if (request.headers.has('rsc') || request.headers.has('next-router-prefetch') ||
        request.headers.has('next-router-segment-prefetch') || url.searchParams.has('_rsc') ||
        /prefetch/i.test(request.headers.get('purpose') || request.headers.get('sec-purpose') || '') ||
        /^\\/(api|_next|auth|oauth)(\\/|$)/.test(url.pathname) ||
        /^\\/(login|cadastro|register)(\\/|$)/.test(url.pathname)) return;
    if (ASSETS.includes(url.pathname) && !url.search) {
      event.respondWith(fetch(request).catch(async () => (await (await caches.open(CACHE)).match(ORIGIN + url.pathname)) || Response.error()));
      return;
    }
    if (request.mode !== 'navigate') return;
    // HTTP 403/500 são devolvidos intactos; somente rejeição da rede usa fallback.
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(async () => {
      const fallback = await (await caches.open(CACHE)).match(ORIGIN + ASSETS[0]);
      if (fallback) return fallback;
      return Response.error();
    }));
  });
}
`
}
