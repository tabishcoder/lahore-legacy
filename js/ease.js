/* =========================================================================
   LAHORE LEGACY — EASE OF USE
   - Full screen on the first tap (Android / phones that allow it; iPhone
     Safari does not, so there the site can be added to the Home Screen,
     where it opens without the browser bars).
   - Back button returns to where you were on the page, not the top.
   - Arrows to scroll the photo rows on computers (no sideways wheel).
   - A "back to top" button on long pages.
   ========================================================================= */

window.LL = window.LL || {};

LL.Ease = (function () {
  const touch = matchMedia("(pointer: coarse)").matches;
  const installed = matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches || navigator.standalone;

  /* ---------- full screen on first tap ---------- */
  const el = document.documentElement;
  const canFull = !!(el.requestFullscreen || el.webkitRequestFullscreen);
  let asked = false;
  try { asked = sessionStorage.getItem("ll.full") === "1"; } catch (e) {}
  function goFull() {
    if (asked || installed || !touch || !canFull || document.fullscreenElement) return;
    asked = true;
    try { sessionStorage.setItem("ll.full", "1"); } catch (e) {}
    const req = el.requestFullscreen ? el.requestFullscreen({ navigationUI: "hide" }) : el.webkitRequestFullscreen();
    if (req && req.catch) req.catch(() => {});
  }
  document.addEventListener("click", goFull, { capture: true, once: false });
  document.addEventListener("touchend", goFull, { capture: true, passive: true });

  /* ---------- install support ---------- */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  /* ---------- remember scroll position for the back button ---------- */
  const pos = {};
  const stack = [location.hash || "#/"];
  let restoreTo = null;
  addEventListener("scroll", () => { pos[location.hash || "#/"] = scrollY; }, { passive: true });
  addEventListener("hashchange", (e) => {
    const now = location.hash || "#/";
    const oldH = "#" + (e.oldURL.split("#")[1] || "/");
    if (stack.length > 1 && stack[stack.length - 2] === now) { stack.pop(); restoreTo = pos[now] || 0; }
    else { if (stack[stack.length - 1] !== oldH) stack.push(oldH); stack.push(now); restoreTo = null; }
  });
  /* called by the router after a page is drawn */
  function afterRender() {
    if (restoreTo == null) return;
    const y = restoreTo; restoreTo = null;
    requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(0, y)));
  }

  /* ---------- arrows for the sideways photo rows (mouse users) ---------- */
  function rowArrows(root) {
    if (touch) return;
    root.querySelectorAll(".row").forEach((row) => {
      const sc = row.querySelector(".row__scroll"), head = row.querySelector(".row__head");
      if (!sc || !head || head.querySelector(".row__arrows")) return;
      const box = document.createElement("div");
      box.className = "row__arrows";
      box.innerHTML = '<button type="button" data-d="-1" aria-label="Scroll left">‹</button><button type="button" data-d="1" aria-label="Scroll right">›</button>';
      head.appendChild(box);
      const update = () => {
        box.children[0].disabled = sc.scrollLeft < 8;
        box.children[1].disabled = sc.scrollLeft + sc.clientWidth > sc.scrollWidth - 8;
        box.hidden = sc.scrollWidth <= sc.clientWidth + 8;
      };
      box.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) sc.scrollBy({ left: +b.dataset.d * sc.clientWidth * 0.8, behavior: "smooth" }); });
      sc.addEventListener("scroll", update, { passive: true });
      setTimeout(update, 300);
    });
  }

  /* ---------- back to top ---------- */
  const top = document.createElement("button");
  top.className = "to-top";
  top.type = "button";
  top.setAttribute("aria-label", "Back to top");
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6"/></svg>';
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(top));
  addEventListener("scroll", () => top.classList.toggle("is-on", scrollY > innerHeight * 1.5), { passive: true });

  return { afterRender, rowArrows };
})();
