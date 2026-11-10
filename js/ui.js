/* =========================================================================
   LAHORE LEGACY — UI HELPERS + PROGRESS
   ========================================================================= */

window.LL = window.LL || {};

LL.UI = (function () {
  const cap = (it) => (LL.I18N && LL.I18N.lang === "ur" && it.ur ? it.ur : it.caption || "");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const lazyIO = "IntersectionObserver" in window ? new IntersectionObserver((list) => list.forEach((e) => {
    if (!e.isIntersecting) return;
    lazyIO.unobserve(e.target);
    const f = e.target.__load; e.target.__load = null; f && f();
  }), { rootMargin: "300px 300px" }) : null;
  function lazy(el, f) { el.__load = f; lazyIO.observe(el); }

  /** Photo element: own photo → local WebP → Wikimedia thumbnail → name card.
      Big eager photos show a small version first, then sharpen. */
  function media(key, opts = {}) {
    const el = document.createElement("div");
    el.className = "media is-loading " + (opts.className || "");
    const width = opts.width || 960;
    let sharpDone = false;
    const put = (p, sharp) => {
      let img = el.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.alt = cap(p);
        img.decoding = "async";
        if (!opts.eager) img.loading = "lazy";
        else img.fetchPriority = "high";
        img.draggable = false;
        img.onload = () => el.classList.add("is-ready");
        el.appendChild(img);
      }
      img.src = p.url;
      el.classList.toggle("is-soft", !sharp);
      el.classList.remove("is-loading");
      if (opts.onPhoto) opts.onPhoto(p);
    };
    const pk = LL.Photos.peek(key, opts.start || 0);
    if (pk) put(pk, pk.w0 >= LL.ASSETS.snap(width));
    const start = () => {
      if (opts.eager && width > 500 && !pk) {
        LL.Photos.resolve(key, 330, opts.start || 0).then((p) => { if (p && !sharpDone) put(p, false); });
      }
      LL.Photos.resolve(key, width, opts.start || 0).then((p) => {
        sharpDone = true;
        if (p) put(p, true);
        else if (!el.querySelector("img")) { el.classList.remove("is-loading"); LL.Photos.placeholder(key, el); }
      });
    };
    // only fetch a photo when it is about to be seen (saves mobile data)
    if (opts.eager || (pk && pk.w0 >= LL.ASSETS.snap(width)) || !("IntersectionObserver" in window)) start();
    else lazy(el, start);
    return el;
  }

  function credit(p) {
    if (!p) return "";
    if (p.official) return `Photo: <a href="${p.from}" target="_blank" rel="noopener">${esc(p.by)}</a> · used with permission`;
    if (p.local) return p.by ? `Photo: ${esc(p.by)}` : "";
    return LL.Credits.line(p.file);
  }

  /* Full-screen photo viewer with swipe/keys. */
  async function lightbox(key, startIdx = 0) {
    const items = await LL.Photos.gallery(key, innerWidth > 900 ? 1920 : 1280);
    return openBox(items, startIdx);
  }
  /* open the viewer on any list of { url, caption, ur, official, by, from } */
  function openBox(items, startIdx = 0) {
    if (!items.length) return;
    let i = Math.max(0, Math.min(items.length - 1, startIdx));
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `<button class="lightbox__close" aria-label="Close">✕</button>
      <button class="lightbox__nav prev" aria-label="Previous">‹</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lightbox__nav next" aria-label="Next">›</button>`;
    document.body.appendChild(lb);
    document.body.style.overflow = "hidden";
    const img = lb.querySelector("img"), capEl = lb.querySelector("figcaption");
    const show = () => {
      const it = items[i];
      img.classList.remove("is-ready");
      img.onload = () => img.classList.add("is-ready");
      img.src = it.url; img.alt = cap(it);
      capEl.innerHTML = `<b>${esc(cap(it))}</b> <span>${i + 1} / ${items.length}</span>`;
    };
    const go = (d) => { i = (i + d + items.length) % items.length; show(); };
    const close = () => { document.removeEventListener("keydown", onKey); lb.remove(); document.body.style.overflow = ""; };
    const onKey = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    let sx = null;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.closest(".lightbox__close")) close();
      if (e.target.closest(".next")) go(1);
      if (e.target.closest(".prev")) go(-1);
    });
    document.addEventListener("keydown", onKey);
    show();
    lb.querySelector(".lightbox__close").focus();
  }

  function toast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("is-out"), 2200);
    setTimeout(() => t.remove(), 2700);
  }

  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  return { esc, cap, media, credit, lightbox, openBox, toast, shuffle };
})();

/* ---------- Progress (this browser only) ---------- */
LL.Progress = (function () {
  const KEY = "lahoreLegacy.v3";
  let s = { seen: {}, stamps: {}, look: {}, quizBest: 0, name: "", visited: {}, planDone: {}, badges: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) s = Object.assign(s, saved, { visited: saved.visited || {}, planDone: saved.planDone || {}, badges: saved.badges || {} });
    else {
      // carry over stamps from the earlier version, if any
      const v1 = JSON.parse(localStorage.getItem("lahoreLegacy.v1"));
      const p = v1 && v1.profiles && v1.profiles[v1.active];
      if (p) { s.stamps = p.stamps || {}; s.seen = p.explored || {}; s.name = p.name && p.name !== "Traveller" ? p.name : ""; s.quizBest = 0; }
    }
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} document.dispatchEvent(new CustomEvent("ll:progress")); };
  const today = () => new Date().toLocaleDateString("en-CA"); // local date, YYYY-MM-DD

  return {
    get state() { return s; },
    seenCount: () => LL.SITES.filter((x) => s.seen[x.id]).length,
    stampCount: () => LL.SITES.filter((x) => s.stamps[x.id]).length,
    see(id) { if (!s.seen[id]) { s.seen[id] = today(); save(); } },
    stamp(id) { if (!s.stamps[id]) { s.stamps[id] = today(); save(); return true; } return false; },
    toggleLook(id, i) { const a = (s.look[id] = s.look[id] || []); const k = a.indexOf(i); k < 0 ? a.push(i) : a.splice(k, 1); save(); },
    quiz(score) { const best = score > s.quizBest; if (best) { s.quizBest = score; save(); } return best; },
    setName(n) { s.name = n; save(); },
    visitedCount: () => LL.SITES.filter((x) => s.visited[x.id]).length,
    /** Mark a place as visited in person. gps=true when the phone confirmed it. */
    visit(id, gps = false) {
      const v = s.visited[id];
      if (v && (v.gps || !gps)) return false;
      s.visited[id] = { d: today(), gps: !!(gps || (v && v.gps)) };
      save(); return true;
    },
    unvisit(id) { if (s.visited[id] && !s.visited[id].gps) { delete s.visited[id]; save(); } },
    togglePlanStop(plan, i) { const a = (s.planDone[plan] = s.planDone[plan] || []); const k = a.indexOf(i); k < 0 ? a.push(i) : a.splice(k, 1); save(); return k < 0; },
    resetPlan(plan) { s.planDone[plan] = []; save(); },
    earn(badge) { if (!s.badges[badge]) { s.badges[badge] = today(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return true; } return false; },
  };
})();
