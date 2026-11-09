/* =========================================================================
   LAHORE LEGACY — MOTION
   Restrained, cinematic motion: scroll reveals, a slow photographic
   push-in on hero images, gentle parallax, number count-ups.
   (v1's particles, cursor glow, card tilt and confetti were retired in the
   v2 redesign; `burst` remains as a quiet no-op hook for older callers.)
   Everything respects prefers-reduced-motion.
   ========================================================================= */

window.LL = window.LL || {};

LL.FX = (function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Celebration hook: a soft gold ring pulse on the stage instead of confetti. */
  function burst() {
    if (reduce) return;
    const r = document.createElement("div");
    r.className = "fx-ring";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 1400);
  }

  /* ---------- Scroll reveals ---------- */
  let io = null;
  function observeReveals(root = document) {
    if (!root) return;
    const els = root.querySelectorAll(".reveal:not(.is-visible)");
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    }
    els.forEach((e, i) => { e.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`; io.observe(e); });
  }

  /* ---------- Gentle hero parallax on scroll ---------- */
  function pointerEffects() {
    if (reduce) return;
    const art = document.getElementById("hero-art");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (art && y < innerHeight * 1.2) art.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el, to, dur = 900) {
    if (!el) return;
    if (reduce) { el.textContent = to; return; }
    const from = parseInt(el.textContent, 10) || 0;
    if (from === to) return;
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  return { burst, observeReveals, pointerEffects, countUp, reduce };
})();
