/* =========================================================================
   LAHORE LEGACY — SHARED UI HELPERS
   Photo media (Commons → placeholder), lightbox, modal, toasts,
   milestone notices, live credits table.
   ========================================================================= */

window.LL = window.LL || {};

LL.UI = (function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Remembers which photo each location ended up showing (for credit lines). */
  const shown = {};

  /**
   * Returns a .media element for a location or extra scene.
   * opts: width (px to request), start (gallery index), label (show source tag),
   *       credit (show credit overlay), eager, className
   */
  function media(key, opts = {}) {
    const el = document.createElement("div");
    el.className = "media is-loading " + (opts.className || "");
    const width = opts.width || 1200;
    LL.Photos.resolve(key, width, opts.start || 0).then((p) => {
      el.classList.remove("is-loading");
      if (!p) { LL.Photos.placeholder(key, el, opts.label !== false || width >= 500); return; }
      shown[key] = shown[key] || p;
      const img = document.createElement("img");
      img.alt = p.caption || (LL.Photos.source(key) || {}).name || "";
      img.decoding = "async";
      if (!opts.eager) img.loading = "lazy";
      img.src = p.url;
      img.draggable = false;
      el.appendChild(img);
      el.dataset.file = p.file || "";
      requestAnimationFrame(() => el.classList.add("is-ready"));
      if (opts.credit && p.file) {
        const c = document.createElement("span");
        c.className = "media__credit";
        c.innerHTML = LL.Credits.line(p.file);
        el.appendChild(c);
        document.addEventListener("ll:credits", () => (c.innerHTML = LL.Credits.line(p.file)), { once: true });
      }
    });
    return el;
  }

  function creditFor(key) {
    const p = shown[key];
    if (!p) return "";
    if (p.local) return "Photo: local photograph";
    return LL.Credits.line(p.file);
  }

  /* ---------- Lightbox gallery ---------- */
  async function lightbox(key, startIdx = 0) {
    const items = await LL.Photos.gallery(key, 2000);
    if (!items.length) return;
    let i = Math.max(0, Math.min(items.length - 1, startIdx));
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `<button class="lightbox__close icon-btn" aria-label="Close">✕</button>
      <button class="lightbox__nav prev icon-btn" aria-label="Previous">‹</button>
      <figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure>
      <button class="lightbox__nav next icon-btn" aria-label="Next">›</button>`;
    document.body.appendChild(lb);
    const img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
    const show = () => {
      const it = items[i];
      img.classList.remove("is-ready");
      img.onload = () => img.classList.add("is-ready");
      img.src = it.url; img.alt = it.caption || "";
      cap.innerHTML = `<b>${esc(it.caption || "")}</b><span>${i + 1} / ${items.length}</span><small>${it.file ? LL.Credits.line(it.file) : ""}</small>`;
    };
    const close = () => { document.removeEventListener("keydown", key2); lb.remove(); };
    const key2 = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") { i = (i + 1) % items.length; show(); } if (e.key === "ArrowLeft") { i = (i - 1 + items.length) % items.length; show(); } };
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.closest(".lightbox__close")) close();
      if (e.target.closest(".next")) { i = (i + 1) % items.length; show(); LL.Audio.play("page"); }
      if (e.target.closest(".prev")) { i = (i - 1 + items.length) % items.length; show(); LL.Audio.play("page"); }
    });
    document.addEventListener("keydown", key2);
    show();
    lb.querySelector(".lightbox__close").focus();
  }

  /* ---------- Modal ---------- */
  let lastFocus = null;
  function openModal(html, opts = {}) {
    const m = $("#modal");
    const panel = m.querySelector(".modal__panel");
    panel.classList.toggle("modal__panel--sm", !!opts.small);
    panel.classList.toggle("modal__panel--wide", !!opts.wide);
    // fresh body node each time so listeners from a previous dialog never leak
    const oldBody = $("#modal-body");
    oldBody.replaceWith(oldBody.cloneNode(false));
    if (typeof html === "string") $("#modal-body").innerHTML = html;
    else $("#modal-body").appendChild(html);
    lastFocus = document.activeElement;
    m.hidden = false;
    m.setAttribute("aria-label", opts.label || "Dialog");
    document.body.classList.add("is-locked");
    panel.scrollTop = 0;
    setTimeout(() => m.querySelector(".modal__close").focus({ preventScroll: true }), 50);
    LL.Audio.play("open");
    return $("#modal-body");
  }
  function closeModal() {
    const m = $("#modal");
    if (m.hidden) return;
    m.hidden = true;
    if ($("#game-stage").hidden) document.body.classList.remove("is-locked");
    document.dispatchEvent(new CustomEvent("ll:modal-closed"));
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }

  /* ---------- Toasts (XP toasts are merged so they never pile up) ---------- */
  let xpToast = null, xpSum = 0, xpReasons = [], xpTimer = null;
  function toast(title, sub, kind) {
    const wrap = $("#toasts");
    if (kind === "xp") {
      const n = parseInt(title.replace(/\D/g, ""), 10) || 0;
      xpSum += n; xpReasons.unshift(sub);
      if (!xpToast || !xpToast.isConnected) {
        xpToast = document.createElement("div");
        xpToast.className = "toast toast--xp";
        wrap.appendChild(xpToast);
      }
      xpToast.innerHTML = `<span class="toast__badge">+${xpSum}</span><div><b>Experience gained</b><small>${esc(xpReasons[0] || "")}${xpReasons.length > 1 ? ` · +${xpReasons.length - 1} more` : ""}</small></div>`;
      clearTimeout(xpTimer);
      xpTimer = setTimeout(() => { const t = xpToast; xpToast = null; xpSum = 0; xpReasons = []; t.classList.add("is-out"); setTimeout(() => t.remove(), 450); }, 2600);
      return;
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="toast__badge toast__badge--icon">◆</span><div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div>`;
    wrap.appendChild(t);
    while (wrap.children.length > 3) wrap.firstChild.remove();
    setTimeout(() => { t.classList.add("is-out"); setTimeout(() => t.remove(), 450); }, 2800);
  }

  /* ---------- Milestone notices (rank, achievement, stamp) ----------
     Elegant, unobtrusive card; queued; never more than one on screen.   */
  const queue = [];
  let showing = false;
  function celebrate(title, html, icon) {
    if (queue.length >= 3) queue.shift();
    queue.push({ title, html, icon });
    if (!showing) next();
  }
  function next() {
    const c = $("#celebrate");
    const item = queue.shift();
    if (!item) { showing = false; c.hidden = true; c.innerHTML = ""; return; }
    showing = true;
    c.hidden = false;
    c.innerHTML = `<div class="notice" role="status">
      <div class="notice__seal" aria-hidden="true">${item.icon && item.icon.startsWith("<svg") ? item.icon : LL.Icons.get(item.icon || "seal")}</div>
      <div class="notice__text"><small>${esc(item.title)}</small><p>${item.html}</p></div>
      <button class="notice__close" aria-label="Dismiss">✕</button></div>`;
    LL.Audio.play("milestone");
    const done = () => { clearTimeout(timer); const n = c.querySelector(".notice"); if (n) { n.classList.add("is-out"); setTimeout(next, 380); } else next(); };
    c.querySelector(".notice__close").addEventListener("click", done);
    const timer = setTimeout(done, 4200);
  }

  /* ---------- Credits table (live from Commons) ---------- */
  function credits() {
    const body = openModal(`<p class="eyebrow">Image credits & licences</p><h2>Photography Register</h2>
      <p class="muted">Photographs are freely-licensed files from <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>. Author and licence are read live from the Commons API for each file. Files that fail to load are replaced by a clearly labelled placeholder illustration. Edit the list in <code>js/config/assets.js</code>.</p>
      <div id="credits-table"><div class="loader">Fetching credits from Wikimedia Commons…</div></div>
      <p class="muted small" style="margin-top:1rem">Typefaces: Cormorant Garamond, Manrope and Noto Nastaliq Urdu via Google Fonts (SIL Open Font License). Optional 360° viewer: Marzipano (Apache-2.0). External 360° tours link to 360Cities and remain the property of their photographers.</p>`, { label: "Image credits", wide: true });
    LL.Credits.load().then(() => {
      const rows = [];
      const sections = { ...LL.ASSETS.locations, ...LL.ASSETS.extras };
      Object.values(sections).forEach((s) => (s.gallery || []).forEach((g) => {
        const c = LL.Credits.get(g.file) || {};
        rows.push(`<tr><td><b>${esc(s.name)}</b><br><small class="muted">${esc(g.caption)}</small></td>
          <td><a href="${LL.ASSETS.commonsPage(g.file)}" target="_blank" rel="noopener">${esc(g.file)}</a></td>
          <td>${c.missing ? '<span class="tag tag--warn">Not found</span>' : esc(c.artist || "—")}</td>
          <td>${c.licenseUrl ? `<a href="${c.licenseUrl}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license || "See file page")}</td></tr>`);
      }));
      const t = body.querySelector("#credits-table");
      if (t) t.innerHTML = `<div class="table-wrap"><table class="credits-table"><thead><tr><th>Subject</th><th>Commons file</th><th>Author</th><th>Licence</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
    });
  }

  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  return { $, esc, media, creditFor, lightbox, openModal, closeModal, toast, celebrate, credits, shuffle };
})();

/* ---------- Monoline icon set (replaces emoji in the interface) ---------- */
LL.Icons = (function () {
  const P = {
    seal: '<circle cx="12" cy="12" r="8"/><path d="M12 6.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.3 9.3l6.1-.7z"/>',
    crown: '<path d="M4 17h16M5 17l-1-9 5 4 3-6 3 6 5-4-1 9"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
    puzzle: '<path d="M5 9h3a2 2 0 114 0h3v3a2 2 0 110 4v3H5z"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    scroll: '<path d="M6 4h11a2 2 0 012 2v12a2 2 0 01-2 2H8"/><path d="M6 4a2 2 0 00-2 2v1h4V6a2 2 0 00-2-2zM8 20a2 2 0 01-2-2V7M10 9h6M10 13h6"/>',
    dome: '<path d="M4 20h16M6 20v-6h12v6M6 14c0-4 3-6 6-8 3 2 6 4 6 8M12 6V3"/>',
    gate: '<path d="M4 21V8l3-3 3 3v13M14 21V8l3-3 3 3v13M10 21v-6a2 2 0 014 0v6"/>',
    tower: '<path d="M10 21l1-15h2l1 15M8 21h8M11 6l1-3 1 3M9.5 12h5M9 17h6"/>',
    garden: '<path d="M3 20h18M12 20V10M12 10c-3 0-5-2-5-5 3 0 5 2 5 5zM12 13c3 0 5-2 5-5-3 0-5 2-5 5z"/>',
    tile: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7"/>',
    flame: '<path d="M12 21c-4 0-6-3-6-6 0-4 4-6 4-10 3 2 4 4 4 6 1-1 2-2 2-3 2 2 2 4 2 7 0 3-2 6-6 6z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l2-3h4l2 3"/><circle cx="12" cy="13.5" r="3.5"/>',
    pano: '<path d="M3 7c6-2 12-2 18 0v10c-6-2-12-2-18 0z"/><path d="M12 9v6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8 21h8M9 17h6"/>',
    stamp: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2"/><path d="M9 12h6"/>',
    lantern: '<path d="M9 4h6M10 4v2M14 4v2M7 8h10l-1 10H8zM10 21h4"/>',
    coin: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/>',
    hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 10 6 10 9s-10 4-10 9M17 3c0 5-10 6-10 9s10 4 10 9"/>',
    sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 010 7"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
  };
  function get(name, cls = "") {
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.seal}</svg>`;
  }
  return { get, names: Object.keys(P) };
})();
