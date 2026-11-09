/* =========================================================================
   LAHORE LEGACY — PANORAMA EXPLORER
   -------------------------------------------------------------------------
   Two engines, chosen per location from js/config/assets.js:

   • "equirect"  → true 360° spherical image, rendered by Marzipano
                   (loaded on demand from CDN; Apache-2.0).
   • "partial" / "photo" / "illustration" → a flat pan-and-zoom viewer
                   written here in vanilla JS. It never wraps around, so a
                   flat image is never presented as a 360° view.

   Features: drag, inertia, wheel / pinch zoom, keyboard, buttons,
   fullscreen, hotspots with info panel, location switching with a
   transition.
   ========================================================================= */

window.LL = window.LL || {};

LL.Panorama = (function () {
  const { esc } = LL.UI;
  const TYPE_LABEL = {
    equirect: ["360° Spherical", "tag--real"],
    partial: ["Partial Panorama", "tag--real"],
    photo: ["Photograph · not a 360° view", "tag--real"],
    illustration: ["Annotated illustration · not a photograph", ""],
  };

  let vp, world, current = null, engine = null, marzipanoLoading = null;

  /* ================= FLAT ENGINE ================= */
  function FlatEngine(viewport, content, natW, natH, hotspots, onHot, fitMode = "cover") {
    const s = { scale: 1, min: 1, max: 4, x: 0, y: 0, vx: 0, vy: 0 };
    world = document.createElement("div");
    world.className = "pano-world";
    const tile = document.createElement("div");
    tile.className = "pano-tile";
    tile.style.left = "0"; tile.style.width = "100%";
    if (typeof content === "string") tile.innerHTML = content; else tile.appendChild(content);
    world.appendChild(tile);
    hotspots.forEach((h, i) => {
      const b = document.createElement("button");
      b.className = "hotspot";
      b.style.left = h.x + "%"; b.style.top = h.y + "%";
      b.textContent = i + 1;
      b.setAttribute("aria-label", `Hotspot ${i + 1}: ${h.title}`);
      b.dataset.hot = i;
      world.appendChild(b);
    });
    viewport.appendChild(world);

    function fit() {
      const vw = viewport.clientWidth, vh = viewport.clientHeight;
      s.min = fitMode === "contain" ? Math.min(vw / natW, vh / natH) : Math.max(vw / natW, vh / natH);
      s.max = s.min * (fitMode === "contain" ? 4.5 : 3.2);
      s.scale = Math.min(Math.max(s.scale, s.min), s.max);
      apply();
    }
    function clamp() {
      const vw = viewport.clientWidth, vh = viewport.clientHeight;
      const w = natW * s.scale, h = natH * s.scale;
      s.x = w <= vw ? (vw - w) / 2 : Math.min(0, Math.max(vw - w, s.x));
      s.y = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, s.y));
    }
    function apply() {
      clamp();
      world.style.width = natW * s.scale + "px";
      world.style.height = natH * s.scale + "px";
      world.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    }
    function zoomAt(factor, cx, cy) {
      const ns = Math.min(s.max, Math.max(s.min, s.scale * factor));
      const k = ns / s.scale;
      s.x = cx - (cx - s.x) * k; s.y = cy - (cy - s.y) * k; s.scale = ns;
      apply();
    }
    function center() { s.scale = s.min; s.x = -(natW * s.scale - viewport.clientWidth) / 2; s.y = -(natH * s.scale - viewport.clientHeight) / 2; apply(); }

    // pointer interaction
    const ptrs = new Map();
    let last = null, pinchD = 0, raf = null, moved = 0;
    function onDown(e) {
      if (e.target.closest(".hotspot")) return;
      viewport.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      viewport.classList.add("is-dragging");
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      s.vx = s.vy = 0; moved = 0;
      cancelAnimationFrame(raf);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinchD = Math.hypot(a.x - b.x, a.y - b.y); }
      hideHint();
    }
    function onMove(e) {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const r = viewport.getBoundingClientRect();
        if (pinchD) zoomAt(d / pinchD, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        pinchD = d; return;
      }
      const now = performance.now(), dx = e.clientX - last.x, dy = e.clientY - last.y, dt = Math.max(1, now - last.t);
      s.x += dx; s.y += dy; s.vx = (dx / dt) * 16; s.vy = (dy / dt) * 16; moved += Math.abs(dx) + Math.abs(dy);
      last = { x: e.clientX, y: e.clientY, t: now };
      apply();
    }
    function onUp(e) {
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinchD = 0;
      if (ptrs.size === 0) { viewport.classList.remove("is-dragging"); if (!LL.FX.reduce) glide(); }
    }
    function glide() {
      s.vx *= 0.93; s.vy *= 0.93;
      if (Math.abs(s.vx) < 0.2 && Math.abs(s.vy) < 0.2) return;
      s.x += s.vx; s.y += s.vy; apply();
      raf = requestAnimationFrame(glide);
    }
    function onWheel(e) {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
      hideHint();
    }
    function onClick(e) { const h = e.target.closest(".hotspot"); if (h) onHot(+h.dataset.hot, h); }

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("click", onClick);
    const ro = new ResizeObserver(fit); ro.observe(viewport);
    fit(); center();

    return {
      pan(dx) { s.x += dx; apply(); },
      zoom(f) { zoomAt(f, viewport.clientWidth / 2, viewport.clientHeight / 2); },
      reset: center,
      markFound(i) { const b = world.querySelector(`[data-hot="${i}"]`); b && b.classList.add("is-found"); },
      destroy() {
        cancelAnimationFrame(raf); ro.disconnect();
        viewport.removeEventListener("pointerdown", onDown); viewport.removeEventListener("pointermove", onMove);
        viewport.removeEventListener("pointerup", onUp); viewport.removeEventListener("pointercancel", onUp);
        viewport.removeEventListener("wheel", onWheel); viewport.removeEventListener("click", onClick);
        viewport.innerHTML = "";
      },
    };
  }

  /* ================= 360° ENGINE (Marzipano) ================= */
  function loadMarzipano() {
    if (window.Marzipano) return Promise.resolve();
    if (marzipanoLoading) return marzipanoLoading;
    marzipanoLoading = new Promise((res, rej) => {
      const sc = document.createElement("script");
      sc.src = LL.ASSETS.marzipanoCDN; sc.onload = res; sc.onerror = () => { marzipanoLoading = null; rej(new Error("Marzipano failed to load")); };
      document.head.appendChild(sc);
    });
    return marzipanoLoading;
  }

  function SphereEngine(viewport, src, hotspots, onHot) {
    const M = window.Marzipano;
    const viewer = new M.Viewer(viewport, { controls: { mouseViewMode: "drag" } });
    const source = M.ImageUrlSource.fromString(src);
    const geometry = new M.EquirectGeometry([{ width: 4000 }]);
    const limiter = M.RectilinearView.limit.traditional(4096, (120 * Math.PI) / 180);
    const view = new M.RectilinearView({ yaw: 0, pitch: 0, fov: Math.PI / 2 }, limiter);
    const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
    scene.switchTo({ transitionDuration: 800 });
    const els = hotspots.map((h, i) => {
      const b = document.createElement("button");
      b.className = "hotspot"; b.textContent = i + 1; b.dataset.hot = i;
      b.setAttribute("aria-label", `Hotspot ${i + 1}: ${h.title}`);
      b.style.margin = "0";
      b.addEventListener("click", () => onHot(i, b));
      scene.hotspotContainer().createHotspot(b, { yaw: (h.x / 100 - 0.5) * 2 * Math.PI, pitch: (h.y / 100 - 0.5) * Math.PI * 0.6 });
      return b;
    });
    return {
      pan(dx) { view.setYaw(view.yaw() - dx / 400); },
      zoom(f) { view.setFov(view.fov() / f); },
      reset() { view.setParameters({ yaw: 0, pitch: 0, fov: Math.PI / 2 }); },
      markFound(i) { els[i] && els[i].classList.add("is-found"); },
      destroy() { viewer.destroy(); viewport.innerHTML = ""; },
    };
  }


  /* ================= CONTROLLER ================= */
  let hintTimer = null, mode = "photo", photos = [], photoIdx = 0, loc = null, loadToken = 0;
  function hideHint() { const h = document.getElementById("pano-hint"); if (h) h.style.opacity = "0"; }
  const $ = (id) => document.getElementById(id);

  function setInfo(i) {
    const info = $("pano-info");
    document.querySelectorAll("#poi-list .poi").forEach((b) => b.classList.toggle("is-active", +b.dataset.poi === i));
    if (i == null) { info.innerHTML = `<p>Select a point of interest to learn about that part of ${esc(loc.name)}.</p>`; return; }
    const h = loc.hotspots[i];
    info.innerHTML = `<h4>${i + 1}. ${esc(h.title)}</h4><p>${esc(h.text)}</p>`;
    info.classList.remove("pop"); void info.offsetWidth; info.classList.add("pop");
  }

  function study(i) {
    LL.Audio.play("page");
    setInfo(i);
    engine && engine.markFound(i);
    LL.Game.hotspot(loc.id, i);
    renderPOIs();
  }

  function renderPOIs() {
    const found = LL.Game.profile.hotspots[loc.id] || [];
    $("pano-found").textContent = found.length;
    $("pano-total").textContent = loc.hotspots.length;
    const list = $("poi-list");
    const active = list.querySelector(".is-active");
    list.innerHTML = loc.hotspots.map((h, i) => `<button class="poi ${found.includes(i) ? "is-found" : ""} ${active && +active.dataset.poi === i ? "is-active" : ""}" data-poi="${i}"><span class="poi__n">${i + 1}</span>${esc(h.title)}</button>`).join("");
  }

  function renderNav(activeId) {
    const nav = $("pano-nav");
    if (!nav.children.length) {
      LL.LOCATIONS.forEach((l) => {
        const b = document.createElement("button");
        b.setAttribute("role", "tab"); b.dataset.loc = l.id;
        b.appendChild(LL.UI.media(l.id, { width: 400, label: false }));
        b.insertAdjacentHTML("beforeend", `<span>${esc(l.name.replace(/ \(.*\)/, ""))}</span>`);
        b.addEventListener("click", () => { LL.Audio.play("click"); LL.Nav.go("panorama", l.id); });
        nav.appendChild(b);
      });
    }
    nav.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.loc === activeId)));
  }

  function renderStrip() {
    const strip = $("pano-strip");
    strip.innerHTML = "";
    if (mode !== "photo" || photos.length < 2) return;
    photos.forEach((p, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `View ${i + 1}: ${p.caption || ""}`);
      if (i === photoIdx) b.setAttribute("aria-current", "true");
      const im = document.createElement("img"); im.src = p.url.replace(/width=\d+/, "width=200"); im.alt = ""; im.loading = "lazy"; im.style.objectFit = "cover";
      b.appendChild(im);
      b.addEventListener("click", () => showPhoto(i));
      strip.appendChild(b);
    });
  }

  function setBadge(type, extra = "") {
    const [label, cls] = TYPE_LABEL[type];
    $("pano-badge").innerHTML = `<span class="tag ${cls}">${label}</span>${extra}`;
  }

  async function transition(fn) {
    const trans = $("pano-transition");
    trans.classList.add("is-on");
    await new Promise((r) => setTimeout(r, engine ? 380 : 30));
    await fn();
    trans.classList.remove("is-on");
  }

  function mountFlat(content, w, h, hotspots, fit) {
    engine && engine.destroy();
    engine = FlatEngine(vp, content, w, h, hotspots, (i) => study(i), fit);
    (LL.Game.profile.hotspots[loc.id] || []).forEach((i) => engine.markFound(i));
  }

  async function showPhoto(i) {
    if (!photos.length) return showIllustration();
    photoIdx = (i + photos.length) % photos.length;
    const p = photos[photoIdx];
    const token = ++loadToken;
    await transition(async () => {
      const img = new Image();
      img.alt = p.caption || loc.name; img.draggable = false; img.decoding = "async";
      img.src = p.url;
      try { await img.decode(); } catch (e) {}
      if (token !== loadToken) return;
      vp.className = "pano-viewport is-photo";
      mountFlat(img, p.w || img.naturalWidth, p.h || img.naturalHeight, [], "contain");
      setBadge("photo", `<span class="tag">${photoIdx + 1} / ${photos.length}</span>`);
      $("pano-credit").innerHTML = p.file ? LL.Credits.line(p.file) : "Local photograph";
      let cap = vp.parentElement.querySelector(".pano-caption");
      if (!cap) { cap = document.createElement("div"); cap.className = "pano-caption"; vp.parentElement.appendChild(cap); }
      cap.innerHTML = `<b>${esc(p.caption || "")}</b>`;
      renderStrip();
    });
  }

  async function showIllustration() {
    const cfg = LL.ASSETS.locations[loc.id];
    await transition(async () => {
      vp.className = "pano-viewport";
      mountFlat(LL.Illustrations.get(cfg.illustration), 1200, 700, loc.hotspots, "cover");
      setBadge("illustration");
      $("pano-credit").textContent = "Annotated illustration made for this site — a diagram for locating features, not a photographic record.";
      const cap = vp.parentElement.querySelector(".pano-caption"); cap && cap.remove();
      renderStrip();
    });
  }

  async function showSphere(pano) {
    await transition(async () => {
      engine && engine.destroy(); engine = null;
      vp.innerHTML = `<div class="loader">Loading 360° viewer…</div>`;
      try {
        await loadMarzipano();
        vp.innerHTML = "";
        engine = SphereEngine(vp, pano.src, loc.hotspots, (i) => study(i));
        setBadge("equirect");
        $("pano-credit").textContent = [pano.attribution || pano.photographer, pano.license, pano.source].filter(Boolean).join(" · ");
      } catch (err) { console.warn("[Viewer] 360° unavailable:", err.message || err); mode = "photo"; await showPhoto(0); }
    });
  }

  function syncMode() { document.querySelectorAll("#pano-mode [data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === mode))); }

  async function show(locId, force) {
    const next = LL.LOCATIONS.find((l) => l.id === locId) || LL.LOCATIONS[0];
    if (!force && loc && loc.id === next.id && engine) { renderNav(loc.id); return; }
    loc = next;
    const cfg = LL.ASSETS.locations[loc.id];
    const pano = cfg.panorama || {};
    renderNav(loc.id);
    $("pano-title").textContent = loc.name;
    $("pano-era").textContent = loc.era;
    setInfo(null); renderPOIs();
    const t360 = $("pano-360");
    if (pano.tour360) { t360.hidden = false; t360.href = pano.tour360; t360.textContent = "Open real 360° tour ↗"; t360.title = pano.tour360Label || "External 360° tour"; }
    else t360.hidden = true;

    if (pano.type === "equirect" && pano.src) { mode = "photo"; syncMode(); await showSphere(pano); }
    else {
      photos = await LL.Photos.gallery(loc.id, 2400);
      if (!photos.length && mode === "photo") mode = "illustration";
      syncMode();
      if (mode === "photo") await showPhoto(0); else await showIllustration();
    }
    const hint = $("pano-hint");
    hint.style.opacity = "1";
    clearTimeout(hintTimer); hintTimer = setTimeout(hideHint, 4000);
    LL.Game.panorama(loc.id);
  }

  function init() {
    vp = $("pano-viewport");
    document.querySelector(".pano-controls").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pano]");
      if (!b || !engine) return;
      LL.Audio.play("click");
      const a = b.dataset.pano;
      if (a === "prev") { if (mode === "photo" && photos.length > 1) showPhoto(photoIdx - 1); else engine.pan(160); }
      if (a === "next") { if (mode === "photo" && photos.length > 1) showPhoto(photoIdx + 1); else engine.pan(-160); }
      if (a === "zoom-in") engine.zoom(1.25);
      if (a === "zoom-out") engine.zoom(0.8);
      if (a === "reset") engine.reset();
      if (a === "fullscreen") {
        const stage = $("pano-stage");
        if (document.fullscreenElement) document.exitFullscreen();
        else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
        else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
      }
    });
    $("poi-list").addEventListener("click", (e) => { const b = e.target.closest("[data-poi]"); if (b) study(+b.dataset.poi); });
    $("pano-mode").addEventListener("click", (e) => {
      const b = e.target.closest("[data-mode]");
      if (!b || b.dataset.mode === mode) return;
      mode = b.dataset.mode; syncMode(); LL.Audio.play("click");
      if (mode === "photo") showPhoto(photoIdx); else showIllustration();
    });
    vp.addEventListener("keydown", (e) => {
      if (!engine) return;
      const map = { ArrowLeft: () => engine.pan(80), ArrowRight: () => engine.pan(-80), "+": () => engine.zoom(1.2), "=": () => engine.zoom(1.2), "-": () => engine.zoom(0.83), "0": () => engine.reset(), PageDown: () => mode === "photo" && showPhoto(photoIdx + 1), PageUp: () => mode === "photo" && showPhoto(photoIdx - 1) };
      if (map[e.key]) { e.preventDefault(); map[e.key](); }
    });
    LL.Nav.on("panorama", (param) => show(param || (loc && loc.id) || LL.LOCATIONS[0].id));
  }

  return { init, show };
})();
