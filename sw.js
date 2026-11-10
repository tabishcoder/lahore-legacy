/* Lahore Legacy service worker.
   Only here so phones offer "Install app" / "Add to Home screen".
   It caches nothing: every request goes to the network as usual,
   so visitors always get the latest version of the site. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
