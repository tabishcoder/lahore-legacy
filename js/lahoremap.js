/* =========================================================================
   LAHORE LEGACY — MAP
   A small, dependency-free street map: OpenStreetMap tiles (CARTO
   "Voyager" style) drawn in Web Mercator, photo pins with names, the
   user's own location, routes, clustering, and a card for the tapped
   place. If the tiles can't load (offline), it falls back to a simple
   drawn outline of the river, Walled City and main roads.
   ========================================================================= */

window.LL = window.LL || {};

LL.LahoreMap = function (box, opts = {}) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TILE = 256, ZMIN = 11, ZMAX = 18.5;
  const KEY = (LL.KEYS && LL.KEYS.carto) || "";
  const retina = (devicePixelRatio || 1) > 1.4 ? "@2x" : "";
  const tileUrl = (z, x, y) => `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${retina}.png?key=${encodeURIComponent(KEY)}`;
  if (!KEY && !LL.__keyWarned) { LL.__keyWarned = true; console.warn("Lahore Legacy: add a free CARTO key in js/config/keys.js to show street maps."); }

  /* Web Mercator: lat/lon -> world units (0..256 at zoom 0) */
  const W0 = ([lat, lon]) => {
    const s = Math.sin((lat * Math.PI) / 180);
    return [((lon + 180) / 360) * TILE, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TILE];
  };
  const pins = (opts.pins || []).filter((p) => p.at);
  const route = (opts.route || []).filter(Boolean).map(W0);

  box.classList.add("lmap");
  box.innerHTML = `
    <div class="lmap__tiles"></div>
    <svg class="lmap__base" aria-hidden="true"></svg>
    <div class="lmap__pins"></div>
    <div class="lmap__tools">
      <button type="button" data-z="in" aria-label="Zoom in">+</button>
      <button type="button" data-z="out" aria-label="Zoom out">−</button>
      ${opts.me ? `<button type="button" data-z="me" aria-label="Show my location" class="lmap__me">◎</button>` : ""}
      <button type="button" data-z="fit" aria-label="Show all places">⤢</button>
    </div>
    <div class="lmap__card" hidden></div>
    <p class="lmap__attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a></p>`;
  const tilesEl = box.querySelector(".lmap__tiles"), svg = box.querySelector("svg"), layer = box.querySelector(".lmap__pins"), card = box.querySelector(".lmap__card");

  /* fallback outline + route, in world units */
  const B = LL.BASEMAP;
  const poly = (pts) => pts.map(W0).map(([x, y]) => `${x.toFixed(5)},${y.toFixed(5)}`).join(" ");
  svg.innerHTML = `
    <g class="lmap__fallback">
      <polyline class="lmap__river" points="${poly(B.ravi)}"/>
      <polygon class="lmap__walled" points="${poly(B.walled)}"/>
      ${B.roads.map((r) => `<polyline class="lmap__road" points="${poly(r.pts)}"/>`).join("")}
    </g>
    ${route.length ? `<polyline class="lmap__route-bg" points=""/><polyline class="lmap__route" points=""/>` : ""}`;
  const routeEls = svg.querySelectorAll(".lmap__route, .lmap__route-bg");

  /* view state: centre in world units + zoom */
  const v = { cx: 0, cy: 0, z: 13 };
  let W = 0, H = 0, anim = null, tilesOk = 0, tilesBad = 0, me = null, watch = null;
  const scale = () => Math.pow(2, v.z);
  const toPx = ([x, y]) => [(x - v.cx) * scale() + W / 2, (y - v.cy) * scale() + H / 2];

  function fitTo(points, pad = 60) {
    const pts = points && points.length ? points : pins.map((p) => W0(p.at)).concat(route);
    if (!pts.length) return { ...v };
    let [x0, y0] = pts[0], [x1, y1] = pts[0];
    pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const padB = opts.padBottom || 0;
    const w = Math.max(x1 - x0, 1e-5), h = Math.max(y1 - y0, 1e-5);
    const z = Math.log2(Math.max(1e-6, Math.min(Math.max(40, W - pad * 2) / w, Math.max(40, H - pad * 2 - padB) / h)));
    const zz = Math.max(ZMIN, Math.min(16.5, z));
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 + padB / 2 / Math.pow(2, zz), z: zz };
  }
  const idsToPts = (ids) => pins.filter((p) => ids.includes(p.id)).map((p) => W0(p.at));

  function go(target, D = 650) {
    cancelAnimationFrame(anim);
    if (reduce) { Object.assign(v, target); return draw(); }
    const from = { ...v }, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / D), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      v.cx = from.cx + (target.cx - from.cx) * e;
      v.cy = from.cy + (target.cy - from.cy) * e;
      v.z = from.z + (target.z - from.z) * e;
      draw();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  /* ---------- tiles ---------- */
  const tiles = new Map();
  function drawTiles() {
    if (!KEY) { box.classList.add("no-tiles"); return; }
    const tz = Math.max(0, Math.min(19, Math.round(v.z)));
    const k = Math.pow(2, v.z - tz), size = TILE * k, n = Math.pow(2, tz);
    const wx = v.cx * Math.pow(2, tz), wy = v.cy * Math.pow(2, tz); // centre in tile-zoom pixels
    const x0 = Math.floor((wx - W / 2 / k) / TILE), x1 = Math.floor((wx + W / 2 / k) / TILE);
    const y0 = Math.floor((wy - H / 2 / k) / TILE), y1 = Math.floor((wy + H / 2 / k) / TILE);
    const want = new Set();
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
      if (y < 0 || y >= n) continue;
      const xx = ((x % n) + n) % n, key = `${tz}/${xx}/${y}`;
      want.add(key);
      let im = tiles.get(key);
      if (!im) {
        im = new Image();
        im.className = "lmap__tile";
        im.alt = "";
        im.decoding = "async";
        im.draggable = false;
        im.onload = () => { im.classList.add("is-on"); tilesOk++; box.classList.remove("no-tiles"); };
        im.onerror = () => { tilesBad++; if (!tilesOk && tilesBad >= 4) box.classList.add("no-tiles"); };
        im.src = tileUrl(tz, xx, y);
        tiles.set(key, im);
        tilesEl.appendChild(im);
      }
      const px = (x * TILE - wx) * k + W / 2, py = (y * TILE - wy) * k + H / 2;
      im.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${k})`;
      im.dataset.z = tz;
    }
    // keep tiles of other zoom levels underneath until the new ones load
    tiles.forEach((im, key) => {
      if (want.has(key)) { im.style.zIndex = 2; return; }
      const [z, x, y] = key.split("/").map(Number);
      if (Math.abs(z - tz) > 1 || tiles.size > 160) { im.remove(); tiles.delete(key); return; }
      const kk = Math.pow(2, v.z - z), wxx = v.cx * Math.pow(2, z), wyy = v.cy * Math.pow(2, z);
      im.style.zIndex = 1;
      im.style.transform = `translate3d(${(x * TILE - wxx) * kk + W / 2}px, ${(y * TILE - wyy) * kk + H / 2}px, 0) scale(${kk})`;
    });
  }

  /* ---------- pins ---------- */
  const R = 24;
  pins.forEach((p, k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `lpin is-${p.level || "new"}`;
    b.dataset.id = p.id;
    b.setAttribute("aria-label", p.name);
    b.appendChild(LL.UI.media(p.photo || p.id, { width: 330 }));
    b.insertAdjacentHTML("beforeend", `${p.num ? `<span class="lpin__num">${p.num}</span>` : ""}${p.level === "visited" ? '<span class="lpin__mark">✓</span>' : p.level === "stamp" ? '<span class="lpin__mark is-stamp">★</span>' : ""}<span class="lpin__label">${LL.UI.esc(p.short || p.name)}</span>`);
    b.addEventListener("click", (e) => { e.stopPropagation(); open(p); });
    if (!reduce) { b.classList.add("drop"); b.style.setProperty("--d", `${100 + k * 35}ms`); }
    if (p.id === opts.nextUp) { b.classList.add("is-next"); b.insertAdjacentHTML("beforeend", `<span class="lpin__next">${opts.nextLabel || "Next"}</span>`); }
    p.el = b;
    p.w = W0(p.at);
    layer.appendChild(b);
  });
  const meEl = document.createElement("div");
  meEl.className = "lme";
  meEl.hidden = true;
  layer.appendChild(meEl);
  const clusters = [];

  function drawRoute(f = 1) {
    if (!route.length) return;
    const segs = route.length - 1, upto = f * segs, n = Math.floor(upto), pts = route.slice(0, n + 1);
    if (n < segs) { const a = route[n], b = route[n + 1], kk = upto - n; pts.push([a[0] + (b[0] - a[0]) * kk, a[1] + (b[1] - a[1]) * kk]); }
    const str = pts.map(([x, y]) => `${x.toFixed(6)},${y.toFixed(6)}`).join(" ");
    routeEls.forEach((el) => el.setAttribute("points", str));
  }

  function draw() {
    if (!ready || !isFinite(v.z)) return;
    const s = scale(), vbW = W / s, vbH = H / s;
    svg.setAttribute("viewBox", `${v.cx - vbW / 2} ${v.cy - vbH / 2} ${vbW} ${vbH}`);
    drawTiles();
    const placed = [];
    pins.forEach((p) => {
      const [x, y] = toPx(p.w);
      const near = !opts.noCluster && v.z < 16 && placed.find((c) => Math.hypot(c.x - x, c.y - y) < R * 1.6);
      if (near) near.items.push(p); else placed.push({ x, y, items: [p] });
    });
    clusters.forEach((c) => c.remove());
    clusters.length = 0;
    pins.forEach((p) => { p.el.hidden = true; });
    placed.forEach((c) => {
      if (c.items.length === 1) {
        const p = c.items[0];
        p.el.hidden = false;
        p.el.style.transform = `translate(${c.x - R}px, ${c.y - R}px)`;
      } else {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "lcluster";
        b.innerHTML = `<b>${c.items.length}</b><small>places</small>`;
        b.style.transform = `translate(${c.x - 27}px, ${c.y - 27}px)`;
        b.setAttribute("aria-label", `${c.items.length} places here. Zoom in`);
        b.addEventListener("click", (e) => { e.stopPropagation(); const f = fitTo(c.items.map((p) => p.w), 80); go({ ...f, z: Math.max(f.z, v.z + 1.5) }); });
        layer.appendChild(b);
        clusters.push(b);
      }
    });
    // labels: show a name only where it doesn't sit on another name or pin
    const boxes = placed.map((c) => (c.items.length === 1 ? [c.x - R, c.y - R, c.x + R, c.y + R] : [c.x - 27, c.y - 27, c.x + 27, c.y + 27]));
    const hit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
    placed.filter((c) => c.items.length === 1).sort((a, b) => (b.items[0].el.classList.contains("is-active") ? 1 : 0) - (a.items[0].el.classList.contains("is-active") ? 1 : 0)).forEach((c) => {
      const el = c.items[0].el, lb = el.querySelector(".lpin__label");
      if (!lb) return;
      const w = lb._w || (lb._w = lb.offsetWidth || 90), top = c.y + R + 4;
      const box = [c.x - w / 2, top, c.x + w / 2, top + 24];
      const free = box[0] > 0 && box[2] < W && box[3] < H && !boxes.some((b) => hit(box, b));
      el.classList.toggle("no-label", !free);
      if (free) boxes.push(box);
    });
    if (me) { const [x, y] = toPx(W0(me)); meEl.hidden = false; meEl.style.transform = `translate(${x - 11}px, ${y - 11}px)`; }
  }

  function open(p) {
    card.hidden = false;
    card.innerHTML = "";
    card.appendChild(LL.UI.media(p.photo || p.id, { width: 500, eager: true }));
    card.insertAdjacentHTML("beforeend", `<div class="lmap__cardbody">
      <button class="lmap__close" type="button" aria-label="Close">✕</button>
      ${opts.cardHtml ? opts.cardHtml(p, me) : `<b>${LL.UI.esc(p.name)}</b>`}
    </div>`);
    card.querySelector(".lmap__close").addEventListener("click", close);
    layer.querySelectorAll(".lpin").forEach((x) => x.classList.toggle("is-active", x === p.el));
    if (opts.onOpen) opts.onOpen(p);
  }
  function close() { card.hidden = true; layer.querySelectorAll(".lpin").forEach((x) => x.classList.remove("is-active")); if (opts.onClose) opts.onClose(); }

  /* ---------- gestures: drag, pinch, wheel, double-tap ---------- */
  const ptrs = new Map();
  let last = null, pinch = 0, moved = 0, lastTap = 0;
  function zoomAround(nz, mx, my) {
    nz = Math.max(ZMIN, Math.min(ZMAX, nz));
    const s0 = scale(), s1 = Math.pow(2, nz);
    v.cx += (mx - W / 2) / s0 - (mx - W / 2) / s1;
    v.cy += (my - H / 2) / s0 - (my - H / 2) / s1;
    v.z = nz;
  }
  box.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".lmap__card, .lmap__tools, .lmap__attr")) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    last = [e.clientX, e.clientY]; moved = 0;
    cancelAnimationFrame(anim);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); }
  });
  box.addEventListener("pointermove", (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    const r = box.getBoundingClientRect();
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinch) { zoomAround(v.z + Math.log2(d / pinch), (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); draw(); }
      pinch = d; moved += 10; return;
    }
    const dx = e.clientX - last[0], dy = e.clientY - last[1];
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 4 && !box.hasPointerCapture(e.pointerId)) { try { box.setPointerCapture(e.pointerId); } catch (err) {} }
    v.cx -= dx / scale(); v.cy -= dy / scale(); last = [e.clientX, e.clientY];
    draw();
  });
  const up = (e) => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = 0;
    if (moved < 6 && e.type === "pointerup" && !e.target.closest(".lpin, .lcluster, .lmap__card, .lmap__tools, .lmap__attr")) {
      const now = performance.now(), r = box.getBoundingClientRect();
      if (now - lastTap < 320) { const t = { ...v }; const tmp = { ...v }; zoomAround(v.z + 1, e.clientX - r.left, e.clientY - r.top); const target = { ...v }; Object.assign(v, tmp); go(target, 300); lastTap = 0; }
      else { lastTap = now; close(); }
    }
  };
  box.addEventListener("pointerup", up);
  box.addEventListener("pointercancel", up);
  box.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = box.getBoundingClientRect();
    zoomAround(v.z + (e.deltaY < 0 ? 0.35 : -0.35), e.clientX - r.left, e.clientY - r.top);
    cancelAnimationFrame(anim); draw();
  }, { passive: false });
  box.querySelector(".lmap__tools").addEventListener("click", (e) => {
    const zb = e.target.closest("[data-z]");
    if (!zb) return;
    const a = zb.dataset.z;
    if (a === "fit") go(fitTo());
    else if (a === "me") locate(true);
    else go({ ...v, z: Math.max(ZMIN, Math.min(ZMAX, v.z + (a === "in" ? 1 : -1))) }, 300);
  });

  /* ---------- my location ---------- */
  function locate(center) {
    if (!navigator.geolocation) return Promise.resolve(null);
    box.classList.add("is-locating");
    return new Promise((res) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        box.classList.remove("is-locating");
        me = [pos.coords.latitude, pos.coords.longitude];
        LL.ME = me;
        try { sessionStorage.setItem("lahoreLegacy.me", JSON.stringify(me)); } catch (e) {}
        if (!watch) watch = navigator.geolocation.watchPosition((p) => { me = [p.coords.latitude, p.coords.longitude]; LL.ME = me; draw(); opts.onMe && opts.onMe(me); }, () => {}, { enableHighAccuracy: true, maximumAge: 15000 });
        draw();
        if (center) {
          const inLahore = LL.Game.distance(me, [31.58, 74.33]) < 40000;
          if (inLahore) go({ ...fitTo([W0(me)]), z: Math.max(v.z, 15) });
        }
        opts.onMe && opts.onMe(me);
        res(me);
      }, () => { box.classList.remove("is-locating"); res(null); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
  }
  try { const m = JSON.parse(sessionStorage.getItem("lahoreLegacy.me") || "null"); if (m) { me = m; LL.ME = m; } } catch (e) {}

  let ready = false;
  const ro = new ResizeObserver(() => {
    W = box.clientWidth; H = box.clientHeight;
    if (!W || !H) return;
    const first = !ready;
    ready = true;
    if (first) Object.assign(v, opts.focus ? { ...fitTo(idsToPts(opts.focus)), z: 16 } : fitTo());
    draw();
  });
  ro.observe(box);

  if (route.length) {
    if (reduce) drawRoute(1);
    else { const t0 = performance.now() + 450, D = 1600; const st = (t) => { const k = Math.max(0, Math.min(1, (t - t0) / D)); drawRoute(1 - Math.pow(1 - k, 2)); if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }
  }

  return {
    show(ids) { go(ids && ids.length ? fitTo(idsToPts(ids), 70) : fitTo()); },
    focus(id, openCard = true) {
      const p = pins.find((x) => x.id === id);
      if (!p) return;
      const f = fitTo([p.w]);
      go({ cx: f.cx, cy: f.cy + (opts.padBottom ? opts.padBottom / 2 / Math.pow(2, 16) : 0), z: Math.max(16, v.z) });
      if (openCard) open(p);
    },
    locate,
    close,
    get me() { return me; },
    destroy() { ro.disconnect(); cancelAnimationFrame(anim); if (watch) navigator.geolocation.clearWatch(watch); },
  };
};
