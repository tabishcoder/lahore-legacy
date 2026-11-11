/* =========================================================================
   LAHORE LEGACY — DELIGHT (motion that invites people in)
   - headline(h)     page titles arrive word by word
   - marquee(el)     a slow band of place names under the home hero
   - counters(root)  numbers count up when they scroll into view
   - rows(root)      cards deal in one after another, then each row drifts
                     slowly sideways until someone touches it
   - tiltCards(root) cards lean toward the mouse (computers only)
   Everything is skipped when the visitor asks for reduced motion.
   ========================================================================= */

window.LL = window.LL || {};

LL.Delight = (function () {
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;

  /* ---------- titles: word by word ---------- */
  function headline(h) {
    if (!h || h.dataset.split || reduce()) return;
    h.dataset.split = "1";
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            const s = document.createElement("span");
            s.className = "w";
            s.style.setProperty("--w", i++);
            s.textContent = w;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches("[lang='ur'], svg")) walk(n);
      });
    };
    walk(h);
    h.classList.add("is-split");
  }

  /* ---------- band of place names ---------- */
  function marquee(el, items) {
    if (!el || !items.length) return;
    const one = items.map((t) => `<span>${t}</span><i aria-hidden="true"></i>`).join("");
    el.innerHTML = `<div class="marquee__track" aria-hidden="true">${one}${one}</div>`;
    el.style.setProperty("--dur", `${Math.max(40, items.length * 3.2)}s`);
  }

  /* ---------- numbers count up ---------- */
  function counters(root) {
    const els = root.querySelectorAll("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const to = +el.dataset.count, suffix = el.dataset.suffix || "";
      if (reduce()) { el.textContent = to + suffix; return; }
      const t0 = performance.now(), dur = 1300;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * e) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- card rows: deal in, then drift ---------- */
  function rows(root) {
    const list = [...root.querySelectorAll(".row__scroll")];
    if (!list.length) return () => {};
    const state = new Map();
    let raf = 0, alive = true;

    list.forEach((row, n) => {
      [...row.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 6)));
      const st = { on: false, stopped: reduce(), dir: n % 2 ? -1 : 1, x: 0, wait: 0 };
      state.set(row, st);
      const stop = () => { if (st.stopped) return; st.stopped = true; row.classList.remove("is-drifting"); };
      ["pointerdown", "wheel", "touchstart", "keydown", "focusin"].forEach((ev) => row.addEventListener(ev, stop, { passive: true }));
      row.addEventListener("mouseenter", () => { st.hover = true; });
      row.addEventListener("mouseleave", () => { st.hover = false; });
      const head = row.parentElement.querySelector(".row__arrows");
      if (head) head.addEventListener("click", stop);
    });

    const io = "IntersectionObserver" in window ? new IntersectionObserver((en) => en.forEach((x) => {
      const st = state.get(x.target);
      st.on = x.isIntersecting;
      if (x.isIntersecting && !x.target.classList.contains("is-dealt")) {
        x.target.classList.add("is-dealt");
        st.wait = performance.now() + 1600;      // let the cards land before drifting
        if (!st.stopped && x.target.scrollWidth > x.target.clientWidth + 40) { x.target.classList.add("is-drifting"); st.x = x.target.scrollLeft; }
      }
    }), { threshold: 0.25 }) : null;
    if (io) list.forEach((r) => io.observe(r)); else list.forEach((r) => r.classList.add("is-dealt"));

    let last = performance.now();
    const tick = (t) => {
      if (!alive) return;
      const dt = Math.min(50, t - last); last = t;
      state.forEach((st, row) => {
        if (!st.on || st.stopped || st.hover || t < st.wait || !row.classList.contains("is-drifting")) return;
        const max = row.scrollWidth - row.clientWidth;
        st.x += st.dir * dt * 0.022;             // about 22 px a second
        if (st.x >= max) { st.x = max; st.dir = -1; st.wait = t + 1400; }
        if (st.x <= 0) { st.x = 0; st.dir = 1; st.wait = t + 1400; }
        row.scrollLeft = st.x;
      });
      raf = requestAnimationFrame(tick);
    };
    if (!reduce()) raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); io && io.disconnect(); };
  }

  /* ---------- cards lean toward the mouse ---------- */
  function tiltCards(root) {
    if (touch || reduce()) return;
    root.addEventListener("pointermove", (e) => {
      const c = e.target.closest && e.target.closest(".tile");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--ry", `${px * 7}deg`);
      c.style.setProperty("--rx", `${-py * 6}deg`);
    });
    root.addEventListener("pointerout", (e) => {
      const c = e.target.closest && e.target.closest(".tile");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--ry", "0deg"); c.style.setProperty("--rx", "0deg"); }
    });
  }

  /* called by the router on every page */
  function page(root) {
    headline(root.querySelector("h1"));
    counters(root);
  }

  return { headline, marquee, counters, rows, tiltCards, page, reduce };
})();
