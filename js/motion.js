/* =========================================================================
   LAHORE LEGACY — MOTION
   Background videos, the hero photo slideshow, scroll reveals, parallax,
   counting numbers, the reading bar, card tilt and page morphs.
   Everything is plain CSS + a little JS (no libraries), uses only
   transform / opacity, and switches itself off for "reduce motion".
   ========================================================================= */

window.LL = window.LL || {};

LL.Motion = (function () {
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
  const tall = () => innerHeight > innerWidth;

  /* ---------- is it night in Lahore? (rough sunrise / sunset by month) ---------- */
  function isNight() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "numeric", minute: "numeric", month: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const g = (k) => +parts.find((p) => p.type === k).value;
    const m = g("month"), h = g("hour") + g("minute") / 60;
    const sunset = [17.6, 18.0, 18.4, 18.7, 19.0, 19.3, 19.3, 19.0, 18.5, 17.9, 17.3, 17.2][m - 1];
    const sunrise = [7.0, 6.8, 6.3, 5.8, 5.3, 5.0, 5.1, 5.4, 5.7, 6.0, 6.4, 6.9][m - 1];
    return h >= sunset + 0.4 || h < sunrise - 0.3;
  }

  /* ---------- background video ---------- */
  function videoAllowed() {
    if (reduce()) return false;
    const c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || ""))) return false;
    try { if (localStorage.getItem("lahoreLegacy.video") === "off") return false; } catch (e) {}
    return true;
  }
  function setVideoPref(on) { try { localStorage.setItem("lahoreLegacy.video", on ? "on" : "off"); } catch (e) {} }

  /* lighter files first; the verified file last (a missing source is skipped) */
  function sources(clip) {
    if (clip.local) return [clip.local];
    const list = [];
    if (clip.id && clip.fps && !clip.tall) {
      if (innerWidth < 700) list.push(`https://videos.pexels.com/video-files/${clip.id}/${clip.id}-sd_960_540_${clip.fps}fps.mp4`);
      list.push(`https://videos.pexels.com/video-files/${clip.id}/${clip.id}-hd_1280_720_${clip.fps}fps.mp4`);
    }
    if (clip.id && clip.fps && clip.tall) list.push(`https://videos.pexels.com/video-files/${clip.id}/${clip.id}-hd_720_1280_${clip.fps}fps.mp4`);
    list.push(clip.src);
    return list;
  }
  function makeVideo(clip) {
    const v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = false;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.preload = "auto";
    v.className = "bgvideo";
    sources(clip).forEach((u) => { const s = document.createElement("source"); s.src = u; s.type = "video/mp4"; v.appendChild(s); });
    v.addEventListener("loadedmetadata", () => { try { v.currentTime = clip.local ? 0 : clip.from || 0; } catch (e) {} }, { once: true });
    return v;
  }

  /**
   * Plays clips one after another inside `box`, cross-fading between two
   * <video> elements. Shows `onClip(clip)` for the caption. Pauses when
   * off-screen or when the tab is hidden. Returns { stop, toggle }.
   */
  function videoLoop(box, clipIds, onClip, opts = {}) {
    const C = LL.VIDEOS.clips, ids = clipIds.filter((k) => C[k]);
    if (!ids.length || !videoAllowed()) return null;
    let i = 0, active = null, stopped = false, paused = false, timer = null, failed = 0;
    const secs = opts.seconds || LL.VIDEOS.clipSeconds;
    const vids = [];
    function next() {
      if (stopped) return;
      const clip = C[ids[i % ids.length]];
      i++;
      const v = makeVideo(clip);
      box.appendChild(v);
      vids.push(v);
      const go = () => {
        if (stopped) return;
        v.classList.add("is-on");
        box.classList.add("has-video");
        if (active && active !== v) { const old = active; old.classList.remove("is-on"); setTimeout(() => { old.pause(); old.remove(); }, 1300); }
        active = v;
        onClip && onClip(clip);
        clearTimeout(timer);
        if (ids.length > 1) timer = setTimeout(next, secs * 1000);
        else v.loop = true;
      };
      v.addEventListener("playing", go, { once: true });
      v.addEventListener("ended", () => { if (ids.length === 1) { v.currentTime = clip.local ? 0 : clip.from || 0; v.play(); } else next(); });
      // every source failed (each missing lighter file is skipped automatically)
      const last = v.querySelector("source:last-of-type");
      if (last) last.addEventListener("error", () => { v.remove(); if (++failed < ids.length * 2) next(); });
      const p = v.play();
      if (p && p.catch) p.catch((err) => { if (err && err.name === "NotAllowedError") { v.remove(); stopped = true; } });
    }
    const io = new IntersectionObserver(([e]) => {
      if (!active || paused) return;
      e.isIntersecting ? active.play().catch(() => {}) : active.pause();
    });
    io.observe(box);
    const vis = () => { if (!active || paused) return; document.hidden ? active.pause() : active.play().catch(() => {}); };
    document.addEventListener("visibilitychange", vis);
    next();
    return {
      stop() { stopped = true; clearTimeout(timer); io.disconnect(); document.removeEventListener("visibilitychange", vis); vids.forEach((v) => { v.pause(); v.removeAttribute("src"); v.querySelectorAll("source").forEach((s) => s.remove()); v.load(); }); },
      toggle() {
        paused = !paused;
        if (paused) { clearTimeout(timer); active && active.pause(); }
        else { active && active.play().catch(() => {}); if (ids.length > 1) timer = setTimeout(next, secs * 1000); }
        return !paused;
      },
      get paused() { return paused; },
    };
  }
  const pickClips = (set) => (tall() ? set.tall : set.wide);

  /* ---------- hero photo slideshow (Ken Burns + cross-fade) ---------- */
  function slideshow(box, key, onSlide, seconds = 7) {
    const src = LL.ASSETS.extras[key];
    const n = (src && src.gallery.length) || 0;
    if (!n) return null;
    let i = 0, timer = null, stopped = false;
    const width = innerWidth > 900 ? 1920 : 960;
    function show() {
      if (stopped) return;
      const el = LL.UI.media(key, { width, start: i % n, eager: i === 0 });
      el.classList.add("slide");
      if (!reduce()) el.classList.add(["kb1", "kb2", "kb3"][i % 3]);
      box.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-on")));
      const olds = [...box.querySelectorAll(".slide")].filter((x) => x !== el);
      setTimeout(() => olds.forEach((x) => x.remove()), 1600);
      const g = src.gallery[i % n];
      onSlide && onSlide(g);
      i++;
      if (!reduce()) timer = setTimeout(show, seconds * 1000);
    }
    show();
    return { stop() { stopped = true; clearTimeout(timer); } };
  }

  /* ---------- scroll reveal ---------- */
  let io = null;
  function reveal(root, selector) {
    const els = [...root.querySelectorAll(selector)];
    if (reduce() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver((list) => list.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      e.target.querySelectorAll(".count").forEach(countUp);
      if (e.target.classList.contains("count")) countUp(e.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const groups = new Map();
    els.forEach((e) => {
      const k = groups.get(e.parentElement) || 0;
      groups.set(e.parentElement, k + 1);
      e.style.setProperty("--i", Math.min(k, 8));
      e.classList.add("rv");
      io.observe(e);
    });
  }

  /* ---------- count numbers up (years, scores) ---------- */
  function countUp(el) {
    if (el.dataset.counted || reduce()) return;
    const txt = el.textContent.trim();
    if (!/^\d{2,4}$/.test(txt)) return;
    el.dataset.counted = "1";
    const end = +txt, start = end >= 1000 ? end - Math.min(120, end) : 0, t0 = performance.now(), D = 900;
    el.style.minWidth = el.offsetWidth + "px";
    el.style.display = "inline-block";
    const step = (t) => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(start + (end - start) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- parallax + reading bar ---------- */
  let pEls = [], raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const y = scrollY;
      pEls.forEach((el) => { if (el.isConnected) el.style.transform = `translate3d(0, ${Math.min(y, innerHeight) * 0.3}px, 0) scale(${1 + Math.min(y, innerHeight) * 0.0002})`; });
      const bar = document.getElementById("readbar");
      if (bar) {
        const h = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      }
    });
  }
  function parallax(...els) {
    pEls = reduce() ? [] : els.filter(Boolean);
    onScroll();
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3D tilt on photo cards (mouse only) ---------- */
  function tilt(root, selector) {
    if (reduce() || !fine()) return;
    root.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", `${x * 8}deg`);
        el.style.setProperty("--rx", `${-y * 8}deg`);
        el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }

  /* ---------- page morph with the View Transitions API ---------- */
  let morphFrom = null; // place id whose photo should morph into the next page
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#/site/']");
    if (!a) return;
    morphFrom = a.getAttribute("href").split("/")[2];
    document.querySelectorAll("[style*='view-transition-name']").forEach((x) => (x.style.viewTransitionName = ""));
    const m = a.querySelector(".media");
    if (m) m.style.viewTransitionName = "hero-photo";
  }, true);
  function transition(update) {
    if (!document.startViewTransition || reduce()) return update();
    try { document.startViewTransition(update); } catch (e) { update(); }
  }
  /** mark the element that should receive the morph on the new page */
  function morphTo(el, id) {
    if (el && id && morphFrom === id) el.style.viewTransitionName = "hero-photo";
  }
  const lastMorph = () => morphFrom;

  return { isNight, videoAllowed, setVideoPref, videoLoop, pickClips, slideshow, reveal, countUp, parallax, tilt, transition, morphTo, lastMorph, reduce };
})();
