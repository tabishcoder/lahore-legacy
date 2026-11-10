/* =========================================================================
   LAHORE LEGACY — ANALYTICS
   Paste your IDs below. Leave one empty to switch that tool off.
     GA4_ID      Google Analytics 4 → Admin → Data streams → Measurement ID
                 (looks like "G-ABC123XYZ")
     CLARITY_ID  Microsoft Clarity → Settings → Overview → Project ID
                 (looks like "abcd1234ef")
   Nothing loads while both are empty, and nothing loads on localhost.

   What is sent:
     page_view       every page change (the site uses #/ links, so GA can't
                     see them on its own)
     open_place      a place page is opened (place)
     stamp_earned    a place's 3-question check is passed (place)
     quiz_complete   the 60-second quiz ends (score, answered)
     trail_stop      a stop in the 360° Royal Trail is opened (stop)
     get_directions  a Google Maps link is tapped (place, if known)
     share           the share button is used (what)
     outbound_click  any other link to another website (url)
     language        the English / Urdu switch is used (mode)
   ========================================================================= */

window.LL = window.LL || {};

LL.Analytics = (function () {
  const GA4_ID = "";
  const CLARITY_ID = "";

  const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname) || location.protocol === "file:";
  const gaOn = !!GA4_ID && !local;
  const clarityOn = !!CLARITY_ID && !local;

  if (gaOn) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    // page views are sent by hand on every route change, see page()
    gtag("config", GA4_ID, { send_page_view: false });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(s);
  }

  if (clarityOn) {
    (function (c, l, a, r, i) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  function event(name, params = {}) {
    if (gaOn) gtag("event", name, params);
    if (clarityOn && window.clarity) window.clarity("event", name);
  }

  let lastPath = null;
  function page() {
    const path = "/" + (location.hash || "#/").replace(/^#\/?/, "");
    if (path === lastPath) return;
    lastPath = path;
    if (gaOn) gtag("event", "page_view", { page_title: document.title, page_location: location.href, page_path: path });
    if (clarityOn && window.clarity) window.clarity("set", "page", path);
    const m = path.match(/^\/site\/([\w-]+)/);
    if (m) event("open_place", { place: m[1] });
  }

  // taps on links: directions, other websites
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (/google\.[^/]+\/maps|maps\.app\.goo\.gl/.test(href)) {
      const m = (location.hash || "").match(/#\/site\/([\w-]+)/);
      event("get_directions", { place: m ? m[1] : "plan" });
    } else if (/^https?:\/\//.test(href) && !href.startsWith(location.origin)) {
      event("outbound_click", { url: href.slice(0, 100) });
    }
  }, true);

  window.addEventListener("hashchange", page);
  document.addEventListener("DOMContentLoaded", page);

  return { event, page, get on() { return gaOn || clarityOn; } };
})();
