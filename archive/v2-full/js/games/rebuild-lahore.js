/* =========================================================================
   GAME 4 — REBUILD LAHORE  (restoration puzzle · v2)
   Reassemble a real photograph of a monument tile by tile.
   v2: real Commons photographs (aspect-correct), level progression
   (Medium unlocks after any Easy, Hard after any Medium), star ratings,
   per-monument records, "study" peek that costs time, hint highlight.
   Mouse, touch and pen (Pointer Events), or tap/keyboard select-and-place.
   ========================================================================= */

(function () {
  const MONUMENTS = [
    { id: "badshahi-mosque", start: 0 },
    { id: "lahore-fort", start: 0 },
    { id: "minar-e-pakistan", start: 0 },
    { id: "wazir-khan-mosque", start: 0 },
    { id: "shalimar-gardens", start: 0 },
    { id: "iqbal-park", start: 0 },
  ];
  const LEVELS = {
    easy: { n: 3, t: 120, label: "Apprentice", grid: "3 × 3", bonus: 0, xp: 80 },
    medium: { n: 4, t: 210, label: "Craftsman", grid: "4 × 4", bonus: 40, xp: 120, needs: "easy" },
    hard: { n: 6, t: 360, label: "Master", grid: "6 × 6", bonus: 100, xp: 180, needs: "medium" },
  };

  LL.Games.register("rebuild-lahore", {
    mount(root, api) {
      let mon = MONUMENTS[0], lvl = "easy", time = 0, timer = null, placed = 0, total = 0, selected = null, moves = 0, img = "", photo = null, peeks = 0, misses = 0;
      const $ = (s) => root.querySelector(s);
      const rec = (m, l) => api.levelBest(`${m}:${l}`);
      const unlocked = (l) => !LEVELS[l].needs || MONUMENTS.some((m) => rec(m.id, LEVELS[l].needs) > 0);

      function setup() {
        clearInterval(timer);
        if (!unlocked(lvl)) lvl = "easy";
        root.innerHTML = `<div class="g-wrap"><div class="g-panel rebuild__setup">
          <div class="rebuild__setup-head"><div><p class="eyebrow">Restoration workshop</p><h2>Rebuild Lahore</h2>
          <p class="muted">A photograph of a monument has been cut into tiles. Restore it before time runs out. Faster restorations earn more stars.</p></div></div>
          <h3>Choose a monument</h3>
          <div class="mon-pick">${MONUMENTS.map((m) => `<button class="mon ${m === mon ? "is-active" : ""}" data-mon="${m.id}"><span class="mon__media" data-mph="${m.id}"></span><small>${LL.UI.esc(api.location(m.id).name)}</small><span class="mon__stars">${["easy", "medium", "hard"].map((l) => `<i class="${rec(m.id, l) ? "is-on" : ""}" title="${LEVELS[l].label}"></i>`).join("")}</span></button>`).join("")}</div>
          <h3>Level</h3>
          <div class="seg" role="radiogroup" aria-label="Level">${Object.entries(LEVELS).map(([k, v]) => { const ok = unlocked(k); return `<button role="radio" aria-checked="${k === lvl}" data-lvl="${k}" ${ok ? "" : "disabled"}><b>${v.label}</b><br><small>${ok ? `${v.grid} · ${Math.round(v.t / 60)} min` : `${LL.Icons.get("lock")} complete a ${LEVELS[v.needs].label} restoration`}</small></button>`; }).join("")}</div>
          <div><button class="btn btn--gold btn--lg" data-start>Start restoring</button></div></div></div>`;
        root.querySelectorAll("[data-mph]").forEach((s) => s.appendChild(api.photo(s.dataset.mph, { width: 500, label: false })));
        api.setMeta("");
      }

      async function start() {
        const L = LEVELS[lvl], n = L.n;
        root.innerHTML = `<div class="g-wrap"><div class="loader">Preparing the photograph…</div></div>`;
        photo = await LL.Photos.resolve(mon.id, 1600, mon.start);
        let ratio = 12 / 7;
        if (photo) { img = `url("${photo.url}")`; ratio = Math.min(1.9, Math.max(1.2, photo.w / photo.h)); }
        else img = `url("${LL.Illustrations.dataURI(LL.ASSETS.locations[mon.id].illustration)}")`;
        total = n * n; placed = 0; moves = 0; time = L.t; selected = null; peeks = 0; misses = 0;
        const pieces = LL.UI.shuffle(Array.from({ length: total }, (_, i) => i));
        root.innerHTML = `<div class="g-wrap rebuild">
          <div class="rebuild__top">
            <div><p class="eyebrow">${L.label} · ${L.grid}</p><h3>${LL.UI.esc(api.location(mon.id).name)}</h3></div>
            <div class="rebuild__prog"><span id="rb-pct">0%</span><div class="progress"><i id="rb-bar"></i></div></div>
            <div class="rebuild__tools">
              <label class="toggle"><input type="checkbox" id="rb-ghost" ${lvl === "hard" ? "" : "checked"}> Faint guide</label>
              <button class="btn btn--ghost btn--sm" data-peek>Study photo (−10 s)</button>
              <button class="btn btn--ghost btn--sm" data-hintpiece>Hint (−15 s)</button>
            </div>
          </div>
          <div class="rebuild__area">
            <div class="board ${lvl === "hard" ? "" : "ghost"}" id="rb-board" style="--n:${n};--ratio:${ratio}">${Array.from({ length: total }, (_, i) => `<div class="slot" data-slot="${i}" tabindex="0" aria-label="Slot ${i + 1}"></div>`).join("")}<div class="board__peek" id="rb-peek"></div></div>
            <div class="tray" id="rb-tray" style="--n:${Math.min(n, 5)};--ratio:${ratio}">${pieces.map((i) => tile(i, n)).join("")}</div>
          </div>
          <p class="muted small center">Drag a tile onto the board — or select a tile, then select its slot.${photo && photo.file ? ` · ${LL.Credits.line(photo.file)}` : ""}</p></div>`;
        $("#rb-board").style.setProperty("--img", img);
        $("#rb-peek").style.backgroundImage = img;
        root.querySelectorAll(".tile").forEach((t) => (t.style.backgroundImage = img));
        $("#rb-ghost").addEventListener("change", (e) => $("#rb-board").classList.toggle("ghost", e.target.checked));
        clearInterval(timer);
        timer = setInterval(() => {
          time--; meta();
          if (time <= 10 && time > 0) api.sound("tick");
          if (time <= 0) { clearInterval(timer); lose(); }
        }, 1000);
        meta();
      }

      function tile(i, n) {
        const r = Math.floor(i / n), c = i % n, k = 100 / (n - 1);
        return `<button class="tile" data-piece="${i}" style="background-size:${n * 100}% ${n * 100}%;background-position:${c * k}% ${r * k}%" aria-label="Tile ${i + 1}"></button>`;
      }

      function meta() {
        const t = Math.max(0, time);
        api.setMeta(`<span class="meta-pill ${time <= 20 ? "is-danger" : ""}">${LL.Icons.get("hourglass")} ${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}</span><span class="meta-pill">${placed}/${total}</span>`);
      }

      function tryPlace(pieceEl, slotEl) {
        if (!slotEl || slotEl.classList.contains("is-filled")) { bounce(pieceEl); return; }
        moves++;
        if (+pieceEl.dataset.piece === +slotEl.dataset.slot) {
          slotEl.classList.add("is-filled", "pop");
          slotEl.style.backgroundImage = img;
          slotEl.style.backgroundSize = pieceEl.style.backgroundSize;
          slotEl.style.backgroundPosition = pieceEl.style.backgroundPosition;
          pieceEl.remove();
          placed++;
          api.sound("click");
          const pct = Math.round((placed / total) * 100);
          $("#rb-pct").textContent = pct + "%"; $("#rb-bar").style.width = pct + "%";
          meta();
          if (placed === total) win();
        } else {
          misses++;
          api.sound("fail"); bounce(pieceEl);
          slotEl.classList.remove("shake"); void slotEl.offsetWidth; slotEl.classList.add("shake");
        }
      }
      function bounce(el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }

      function win() {
        clearInterval(timer);
        const L = LEVELS[lvl];
        const frac = time / L.t;
        const stars = frac > 0.5 && misses <= total / 4 ? 3 : frac > 0.25 ? 2 : 1;
        const score = Math.max(50, time * 10 + total * 15 + L.bonus * 5 - misses * 10 - peeks * 40);
        const loc = api.location(mon.id);
        api.saveLevel(`${mon.id}:${lvl}`, stars);
        if (lvl === "hard") api.flag("rebuildHard");
        setTimeout(() => {
          $("#rb-board").classList.add("is-complete");
          api.burst(); api.sound("level");
          root.querySelector(".rebuild").insertAdjacentHTML("beforeend", `<div class="g-panel g-result g-result--inline pop">
            <p class="eyebrow">Restoration complete · ${L.label}</p><h2>${LL.UI.esc(loc.name)}</h2>
            <div class="stars" aria-label="${stars} of 3 stars">${[1, 2, 3].map((i) => `<span class="${i <= stars ? "is-on" : ""}">${LL.Icons.get("star")}</span>`).join("")}</div>
            <p><span class="tag tag--real">Documented history</span> ${LL.UI.esc(loc.facts[1] || loc.facts[0])}</p>
            <dl class="g-stats"><div><dt>Time left</dt><dd>${time}s</dd></div><div><dt>Misplaced</dt><dd>${misses}</dd></div><div><dt>Studies</dt><dd>${peeks}</dd></div><div><dt>Score</dt><dd>${score}</dd></div></dl>
            ${lvl !== "hard" && !unlockedBefore(lvl === "easy" ? "medium" : "hard") ? `<p class="muted">New level unlocked: <b>${LEVELS[lvl === "easy" ? "medium" : "hard"].label}</b>.</p>` : ""}
            <div class="g-btns"><button class="btn btn--gold" data-again>Restore another</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div>`);
          root.querySelector(".g-result--inline").scrollIntoView({ behavior: "smooth", block: "center" });
          api.complete({ score, xp: L.xp + (stars - 1) * 15, label: `Restored ${loc.name} (${L.label})` });
        }, 350);
      }
      let unlockedSnapshot = {};
      function unlockedBefore(l) { return unlockedSnapshot[l]; }

      function lose() {
        api.sound("fail");
        $("#rb-tray").innerHTML = `<div class="g-panel g-result"><p class="eyebrow">Time's up</p><h2>Restoration unfinished</h2><p>You placed ${placed} of ${total} tiles. Try keeping the faint guide on, or a gentler level.</p>
          <div class="g-btns"><button class="btn btn--gold" data-retry>Retry</button><button class="btn btn--ghost" data-again>Change puzzle</button></div></div>`;
      }

      /* ----- drag with pointer events ----- */
      let drag = null;
      function onDown(e) {
        const p = e.target.closest(".tile");
        if (!p || e.button > 0) return;
        e.preventDefault();
        const r = p.getBoundingClientRect();
        const ghost = p.cloneNode(true);
        ghost.classList.add("tile--drag");
        ghost.style.width = r.width + "px"; ghost.style.height = r.height + "px";
        document.body.appendChild(ghost);
        drag = { p, ghost, ox: e.clientX - r.left, oy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false };
        p.classList.add("is-lifted");
        moveGhost(e);
      }
      function moveGhost(e) {
        if (!drag) return;
        if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 6) drag.moved = true;
        drag.ghost.style.transform = `translate(${e.clientX - drag.ox}px, ${e.clientY - drag.oy}px) scale(1.05)`;
        root.querySelectorAll(".slot.is-over").forEach((s) => s.classList.remove("is-over"));
        drag.ghost.style.visibility = "hidden";
        const under = document.elementFromPoint(e.clientX, e.clientY);
        drag.ghost.style.visibility = "";
        const slot = under && under.closest(".slot:not(.is-filled)");
        slot && slot.classList.add("is-over");
      }
      function onUp(e) {
        if (!drag) return;
        const { p, ghost, moved } = drag;
        ghost.remove(); p.classList.remove("is-lifted");
        root.querySelectorAll(".slot.is-over").forEach((s) => s.classList.remove("is-over"));
        drag = null;
        if (!moved) { select(p); return; }
        const under = document.elementFromPoint(e.clientX, e.clientY);
        const slot = under && under.closest(".slot");
        if (slot) tryPlace(p, slot);
      }
      function select(p) {
        root.querySelectorAll(".tile.is-selected").forEach((x) => x.classList.remove("is-selected"));
        if (selected === p) { selected = null; return; }
        selected = p; p.classList.add("is-selected"); api.sound("click");
      }

      root.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", moveGhost);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      root.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const t = e.target.closest(".tile"); if (t) { e.preventDefault(); select(t); return; }
        const s = e.target.closest(".slot"); if (s && selected) { e.preventDefault(); const p = selected; selected = null; p.classList.remove("is-selected"); tryPlace(p, s); }
      });
      root.addEventListener("click", (e) => {
        const s = e.target.closest(".slot");
        if (s && selected) { const p = selected; selected = null; p.classList.remove("is-selected"); tryPlace(p, s); return; }
        const m = e.target.closest("[data-mon]");
        if (m) { mon = MONUMENTS.find((x) => x.id === m.dataset.mon); root.querySelectorAll("[data-mon]").forEach((b) => b.classList.toggle("is-active", b === m)); api.sound("click"); return; }
        const l = e.target.closest("[data-lvl]");
        if (l && !l.disabled) { lvl = l.dataset.lvl; root.querySelectorAll("[data-lvl]").forEach((b) => b.setAttribute("aria-checked", String(b === l))); api.sound("click"); return; }
        if (e.target.closest("[data-peek]")) {
          peeks++; time = Math.max(1, time - 10); meta(); api.sound("page");
          const pk = $("#rb-peek"); pk.classList.add("is-on"); setTimeout(() => pk.classList.remove("is-on"), 2200); return;
        }
        if (e.target.closest("[data-hintpiece]")) {
          const left = [...root.querySelectorAll(".tile")];
          if (!left.length) return;
          const t = left[Math.floor(Math.random() * left.length)];
          time = Math.max(1, time - 15); meta(); api.sound("page");
          select(t);
          const slot = root.querySelector(`.slot[data-slot="${t.dataset.piece}"]`);
          slot.classList.add("is-hinted"); setTimeout(() => slot.classList.remove("is-hinted"), 2500);
          return;
        }
        if (e.target.closest("[data-start]") || e.target.closest("[data-retry]")) {
          unlockedSnapshot = { easy: true, medium: unlocked("medium"), hard: unlocked("hard") };
          api.sound("open"); return start();
        }
        if (e.target.closest("[data-again]")) return setup();
        if (e.target.closest("[data-exit]")) return api.exit();
      });
      setup();
      return () => {
        clearInterval(timer);
        window.removeEventListener("pointermove", moveGhost);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.querySelectorAll(".tile--drag").forEach((g) => g.remove());
      };
    },
  });
})();
