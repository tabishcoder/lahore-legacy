/* =========================================================================
   LAHORE LEGACY — NAVIGATION (hash router + responsive menu)
   Routes: #home  #explore  #explore/<location-id>  #panorama/<location-id>
           #games  #games/<game-id>  #passport
   ========================================================================= */

window.LL = window.LL || {};

LL.Nav = (function () {
  const views = ["home", "explore", "panorama", "games", "passport"];
  const handlers = {};
  let current = null;

  function on(view, fn) { handlers[view] = fn; }

  function parse() {
    const h = (location.hash || "#home").slice(1);
    const [view, param] = h.split("/");
    return { view: views.includes(view) ? view : "home", param: param ? decodeURIComponent(param) : null };
  }

  function go(view, param) {
    const target = "#" + view + (param ? "/" + encodeURIComponent(param) : "");
    if (location.hash === target) route(); else location.hash = target;
  }

  function route() {
    const { view, param } = parse();
    const changed = view !== current;
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === view));
    document.querySelectorAll(".main-nav a").forEach((a) => {
      const active = a.dataset.nav === view;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    closeMenu();
    document.body.classList.toggle("on-home", view === "home");
    if (changed) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    current = view;
    handlers[view] && handlers[view](param, changed);
    LL.FX.observeReveals(document.querySelector(`.view[data-view="${view}"]`));
  }

  /* ---------- mobile menu ---------- */
  const toggle = () => document.getElementById("nav-toggle");
  function closeMenu() { document.body.classList.remove("nav-open"); toggle() && toggle().setAttribute("aria-expanded", "false"); }

  function init() {
    window.addEventListener("hashchange", route);
    toggle().addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle().setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-nav]");
      if (a && a.tagName === "A") { e.preventDefault(); LL.Audio.play("click"); go(a.dataset.nav); return; }
      const b = e.target.closest("[data-nav-to]");
      if (b) { LL.Audio.play("click"); go(b.dataset.navTo); }
    });
    // shrink header on scroll
    let lastY = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      document.body.classList.toggle("is-scrolled", y > 40);
      lastY = y;
    }, { passive: true });
    route();
  }

  return { init, on, go, parse, get current() { return current; } };
})();
