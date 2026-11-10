/* =========================================================================
   LAHORE LEGACY — REWARD MOMENTS
   Stamp slam, floating points, badge unlock card, rank-up banner and a
   short burst of confetti in brick, kashi blue and haldi. Short, skippable (tap anywhere), and
   replaced by a plain message when "reduce motion" is on.
   ========================================================================= */

window.LL = window.LL || {};

LL.FX = (function () {
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => LL.UI.esc(s);
  const queue = [];
  let busy = false;

  function run(fn) { queue.push(fn); if (!busy) pump(); }
  function pump() {
    const fn = queue.shift();
    if (!fn) { busy = false; return; }
    busy = true;
    fn(() => setTimeout(pump, 250));
  }

  function overlay(cls, html, ms, done) {
    const o = document.createElement("div");
    o.className = "fx " + cls;
    o.innerHTML = html;
    document.body.appendChild(o);
    let closed = false;
    const close = () => { if (closed) return; closed = true; o.classList.add("is-out"); setTimeout(() => { o.remove(); done && done(); }, 380); };
    o.addEventListener("click", (e) => { if (!e.target.closest("a")) close(); });
    setTimeout(close, ms);
    return o;
  }

  /* confetti from a point (defaults to the screen centre) */
  function confetti(x = innerWidth / 2, y = innerHeight * 0.4, n = 90) {
    if (reduce()) return;
    const cv = document.createElement("canvas");
    cv.className = "fx-confetti";
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    const cols = ["#9A3A1F", "#1F5A78", "#D49A2A", "#F6EEDC", "#4F6B3A", "#C4683A"];
    const ps = Array.from({ length: n }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1, sp = 6 + Math.random() * 9;
      return { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cols[(Math.random() * cols.length) | 0], s: Math.random() < 0.5 };
    });
    const t0 = performance.now();
    const step = (t) => {
      const k = (t - t0) / 1700;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * k); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.s) ctx.fillRect(-p.r, -p.r / 3, p.r * 2, p.r / 1.5); else { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.6, 0, 7); ctx.fill(); }
        ctx.restore();
      });
      if (k < 1) requestAnimationFrame(step); else cv.remove();
    };
    requestAnimationFrame(step);
  }

  /* "+25" rising from a button */
  function points(from, n) {
    if (!from || !n) return;
    const r = from.getBoundingClientRect();
    const el = document.createElement("span");
    el.className = "fx-points";
    el.textContent = `+${n}`;
    el.style.left = r.left + r.width / 2 + "px";
    el.style.top = r.top + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  /* the passport stamp lands on the screen */
  function stamp(site, pts) {
    if (reduce()) return LL.UI.toast(`${LL.I18N.t("stampEarned")} · +${pts}`);
    run((done) => {
      const d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      overlay("fx--stamp", `
        <div class="fx-stamp">
          <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 5"/></svg>
          <div class="fx-stamp__in"><small>Lahore Legacy</small><b>${esc(site.name.en)}</b><span lang="ur">${esc(site.name.ur)}</span><small>${d}</small></div>
        </div>
        <p class="fx-cap">${LL.I18N.t("stampEarned")} <b>+${pts}</b></p>`, 2100, done);
      setTimeout(() => { document.body.classList.add("fx-shake"); confetti(innerWidth / 2, innerHeight * 0.42, 70); setTimeout(() => document.body.classList.remove("fx-shake"), 380); }, 330);
    });
  }

  /* a badge card flips over */
  function badge(b, icon) {
    if (reduce()) return LL.UI.toast(`${LL.I18N.t("badgeUnlocked")}: ${b.en}`);
    run((done) => {
      overlay("fx--badge", `
        <div class="fx-badge">
          <p class="fx-badge__eyebrow">${LL.I18N.t("badgeUnlocked")}</p>
          <span class="fx-badge__icon">${icon}</span>
          <b>${esc(b.en)}</b><span lang="ur">${esc(b.ur)}</span>
          <p>${esc(b.how)}</p>
          <a class="btn btn--gold btn--sm" href="#/map">${LL.I18N.t("seeBadges")} →</a>
        </div>`, 3600, done);
      setTimeout(() => confetti(innerWidth / 2, innerHeight * 0.45, 110), 420);
    });
  }

  /* new rank banner */
  function rank(r, icon) {
    if (reduce()) return LL.UI.toast(`${LL.I18N.t("rankUp")}: ${r.en}`);
    run((done) => {
      overlay("fx--rank", `<div class="fx-rank"><span class="fx-rank__icon">${icon}</span><div><small>${LL.I18N.t("rankUp")}</small><b>${esc(r.en)}</b><span lang="ur">${esc(r.ur)}</span></div></div>`, 2600, done);
      setTimeout(() => confetti(innerWidth / 2, 90, 80), 250);
    });
  }

  return { confetti, points, stamp, badge, rank };
})();
