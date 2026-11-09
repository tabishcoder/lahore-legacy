/* =========================================================================
   LAHORE LEGACY — LOOK-AROUND VIEWER
   Fills the stage with an image and lets people look around it:
   drag (with inertia), pinch / wheel zoom, arrow keys, an optional
   phone-motion mode, and a slow automatic drift for wide panoramas.
   Works with ordinary photos and with wide panoramas (e.g. an iPhone
   "Pano" shot). It never wraps around, so it never pretends a flat image
   is a 360° sphere.
   ========================================================================= */

window.LL = window.LL || {};

LL.Viewer = function (stage, img, natW, natH) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = document.createElement("div");
  world.className = "viewer__world";
  img.draggable = false;
  world.appendChild(img);
  stage.appendChild(world);

  const s = { scale: 1, min: 1, max: 3, x: 0, y: 0, vx: 0, vy: 0 };
  let raf = null, drifting = !reduce, driftDir = -1, lastInteract = 0, motionOn = false;

  function fit() {
    const vw = stage.clientWidth, vh = stage.clientHeight;
    const prevMin = s.min;
    s.min = Math.max(vw / natW, vh / natH);
    s.max = s.min * 3;
    if (s.scale === prevMin || s.scale < s.min) s.scale = s.min;
    apply();
  }
  function clamp() {
    const vw = stage.clientWidth, vh = stage.clientHeight, w = natW * s.scale, h = natH * s.scale;
    s.x = w <= vw ? (vw - w) / 2 : Math.min(0, Math.max(vw - w, s.x));
    s.y = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, s.y));
  }
  function apply() {
    clamp();
    world.style.width = natW * s.scale + "px";
    world.style.height = natH * s.scale + "px";
    world.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
  }
  function zoomAt(f, cx, cy) {
    const ns = Math.min(s.max, Math.max(s.min, s.scale * f)), k = ns / s.scale;
    s.x = cx - (cx - s.x) * k; s.y = cy - (cy - s.y) * k; s.scale = ns;
    apply();
  }
  function center() {
    s.scale = s.min;
    s.x = -(natW * s.scale - stage.clientWidth) / 2;
    s.y = -(natH * s.scale - stage.clientHeight) / 2;
    apply();
  }
  const touch = () => { lastInteract = performance.now(); };

  /* slow drift across wide images when nobody is touching */
  function tick(t) {
    const idle = t - lastInteract > 2500;
    const extra = natW * s.scale - stage.clientWidth;
    if (drifting && idle && !motionOn && extra > 40) {
      s.x += driftDir * 0.35;
      if (s.x <= stage.clientWidth - natW * s.scale) driftDir = 1;
      if (s.x >= 0) driftDir = -1;
      apply();
    } else if (Math.abs(s.vx) > 0.2 || Math.abs(s.vy) > 0.2) {
      s.vx *= 0.92; s.vy *= 0.92; s.x += s.vx; s.y += s.vy; apply();
    }
    raf = requestAnimationFrame(tick);
  }

  /* pointer: drag + pinch */
  const ptrs = new Map();
  let last = null, pinch = 0;
  function down(e) {
    stage.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last = { x: e.clientX, y: e.clientY, t: performance.now() };
    s.vx = s.vy = 0; touch();
    stage.classList.add("is-dragging");
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    stage.dispatchEvent(new CustomEvent("viewer:interact"));
  }
  function move(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    touch();
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), r = stage.getBoundingClientRect();
      if (pinch) zoomAt(d / pinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      pinch = d; return;
    }
    const now = performance.now(), dx = e.clientX - last.x, dy = e.clientY - last.y, dt = Math.max(1, now - last.t);
    s.x += dx; s.y += dy; s.vx = (dx / dt) * 16; s.vy = (dy / dt) * 16;
    last = { x: e.clientX, y: e.clientY, t: now };
    apply();
  }
  function up(e) {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = 0;
    if (!ptrs.size) stage.classList.remove("is-dragging");
    if (reduce) s.vx = s.vy = 0;
  }
  function wheel(e) {
    e.preventDefault(); touch();
    const r = stage.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
  }
  function key(e) {
    const m = { ArrowLeft: () => (s.x += 80), ArrowRight: () => (s.x -= 80), ArrowUp: () => (s.y += 60), ArrowDown: () => (s.y -= 60) };
    if (m[e.key]) { e.preventDefault(); touch(); m[e.key](); apply(); }
    if (e.key === "+" || e.key === "=") zoomAt(1.2, stage.clientWidth / 2, stage.clientHeight / 2);
    if (e.key === "-") zoomAt(1 / 1.2, stage.clientWidth / 2, stage.clientHeight / 2);
  }

  /* phone motion: tilt left/right to look around */
  let base = null;
  function orient(e) {
    if (e.gamma == null) return;
    if (base == null) base = e.gamma;
    const extra = natW * s.scale - stage.clientWidth;
    const k = Math.max(-1, Math.min(1, (e.gamma - base) / 30));
    s.x = -extra / 2 - k * (extra / 2);
    apply();
  }
  async function setMotion(on) {
    if (on && typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try { if ((await DeviceOrientationEvent.requestPermission()) !== "granted") return false; } catch (err) { return false; }
    }
    motionOn = on; base = null;
    if (on) window.addEventListener("deviceorientation", orient);
    else window.removeEventListener("deviceorientation", orient);
    return true;
  }

  stage.addEventListener("pointerdown", down);
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
  stage.addEventListener("wheel", wheel, { passive: false });
  stage.addEventListener("keydown", key);
  const ro = new ResizeObserver(fit);
  ro.observe(stage);
  fit(); center();
  raf = requestAnimationFrame(tick);

  return {
    zoom: (f) => { touch(); zoomAt(f, stage.clientWidth / 2, stage.clientHeight / 2); },
    reset: () => { touch(); center(); },
    setMotion,
    get isWide() { return natW / natH >= 2; },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("deviceorientation", orient);
      stage.removeEventListener("pointerdown", down); stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up); stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("wheel", wheel); stage.removeEventListener("keydown", key);
      world.remove();
    },
  };
};
