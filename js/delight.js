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

  /* ---------- numbers run up, every time they come into view ---------- */
  function counters(root) {
    const els = root.querySelectorAll("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const to = +el.dataset.count, suffix = el.dataset.suffix || "";
      if (reduce()) { el.textContent = to + suffix; return; }
      if (el._running) return;
      el._running = true;
      const t0 = performance.now(), dur = 1500 + Math.min(900, to * 30);
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(to * e) + suffix;
        if (k < 1) requestAnimationFrame(step); else { el._running = false; el.classList.add("is-done"); setTimeout(() => el.classList.remove("is-done"), 600); }
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) run(x.target); else if (!x.target._running) x.target.textContent = "0" + (x.target.dataset.suffix || ""); }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- card rows: deal in, then glide ----------
     The glide is a CSS transform on an inner track (smooth on phones, no
     fight with scrolling). The moment someone touches a row, the glide is
     swapped for the same position as a real scroll, and never restarts. */
  function rows(root) {
    const list = [...root.querySelectorAll(".row__scroll")];
    if (!list.length) return () => {};
    const stops = [];

    list.forEach((row, n) => {
      const track = document.createElement("div");
      track.className = "row__track";
      while (row.firstChild) track.appendChild(row.firstChild);
      row.appendChild(track);
      row.classList.add("has-track");
      [...track.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 6)));

      let stopped = reduce();
      const stop = () => {
        if (stopped) return;
        stopped = true;
        const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        row.classList.remove("is-gliding");
        track.style.animation = "none";
        track.style.transform = "none";
        row.scrollTo({ left: -m.m41, behavior: "instant" });   // carry on from exactly where it was
      };
      ["pointerdown", "touchstart", "wheel", "keydown", "focusin"].forEach((ev) => row.addEventListener(ev, stop, { passive: true }));
      const arrows = row.parentElement.querySelector(".row__arrows");
      if (arrows) arrows.addEventListener("pointerdown", stop, { capture: true });
      stops.push(stop);

      const start = () => {
        if (stopped) return;
        const dist = track.scrollWidth - row.clientWidth + 2 * parseFloat(getComputedStyle(row).paddingLeft || 0);
        if (dist < 60) return;
        track.style.setProperty("--dist", `${-dist}px`);
        track.style.setProperty("--dur", `${Math.max(14, dist / 34)}s`);   // about 34 px a second
        track.style.animationDirection = n % 2 ? "alternate-reverse" : "alternate";
        row.classList.add("is-gliding");
      };

      if (!("IntersectionObserver" in window)) { row.classList.add("is-dealt"); return; }
      const io = new IntersectionObserver((en) => en.forEach((x) => {
        if (x.isIntersecting && !row.classList.contains("is-dealt")) { row.classList.add("is-dealt"); setTimeout(start, 1500); }
        row.classList.toggle("is-off", !x.isIntersecting);       // pause while off screen
      }), { threshold: 0.2 });
      io.observe(row);
      stops.push(() => io.disconnect());
    });
    return () => stops.forEach((f) => f());
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
