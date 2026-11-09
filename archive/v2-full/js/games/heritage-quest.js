/* =========================================================================
   GAME 5 — HERITAGE QUEST  (treasure hunt · v2)
   Follow clue cards across a stylised map of Lahore, travel to the right
   site, then search its scene for hidden treasures. Clues use real facts.
   The map is a stylised illustration and is not drawn to scale.
   ========================================================================= */

(function () {
  const SITES = {
    "lahore-fort": { x: 478, y: 268, clue: "Find the citadel Akbar rebuilt in brick in 1566, where a palace glitters with mirrors." },
    "badshahi-mosque": { x: 392, y: 300, clue: "Find the mosque of red sandstone completed in 1673, once the largest in the world." },
    "minar-e-pakistan": { x: 372, y: 178, clue: "Find the tower that marks where the Lahore Resolution was presented on 23 March 1940." },
    "iqbal-park": { x: 300, y: 214, clue: "Find the open ground once called Minto Park, renamed in honour of a poet-philosopher." },
    "wazir-khan-mosque": { x: 612, y: 370, clue: "Find the tile-covered mosque built for a royal physician-governor, near Delhi Gate." },
    "shalimar-gardens": { x: 880, y: 300, clue: "Head east to the garden of three terraces laid out for Shah Jahan in 1641–42." },
  };
  const TREASURES = ["coin", "key", "lantern", "scroll", "tile", "star"];

  function mapSVG() {
    const markers = Object.entries(SITES).map(([id, s]) => {
      const n = LL.LOCATIONS.find((l) => l.id === id).name.replace(/ \(.*\)/, "");
      return `<g class="qmark" data-site="${id}" tabindex="0" role="button" aria-label="Travel to ${n}" transform="translate(${s.x} ${s.y})">
        <circle r="26" class="qmark__halo"/><circle r="13" class="qmark__dot"/><text y="44" text-anchor="middle" class="qmark__label">${n}</text></g>`;
    }).join("");
    return `<svg viewBox="0 0 1000 560" class="qmap" role="img" aria-label="Stylised map of Lahore's heritage sites">
      <defs><pattern id="qgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#D6A84F" stroke-opacity=".07"/></pattern>
        <radialGradient id="qparch" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#0E4A3D"/><stop offset="1" stop-color="#031A16"/></radialGradient></defs>
      <rect width="1000" height="560" fill="url(#qparch)"/><rect width="1000" height="560" fill="url(#qgrid)"/>
      <path d="M -10 90 C 120 60, 200 140, 260 110 S 380 40, 470 70 S 620 30, 700 20" fill="none" stroke="#2F8A9E" stroke-width="22" stroke-opacity=".55" stroke-linecap="round"/>
      <text x="120" y="70" class="qmap__river">River Ravi</text>
      <path d="M 430 240 L 640 250 L 670 330 L 640 420 L 520 440 L 430 400 L 410 320 Z" fill="#D6A84F" fill-opacity=".06" stroke="#D6A84F" stroke-dasharray="6 6" stroke-opacity=".6"/>
      <text x="520" y="425" text-anchor="middle" class="qmap__area">Walled City</text>
      <path d="M 0 470 C 200 460, 400 480, 520 470 S 820 440, 1000 450" fill="none" stroke="#F5EBDD" stroke-opacity=".12" stroke-width="10"/>
      <path d="M 640 330 C 720 320, 800 310, 880 300" fill="none" stroke="#F5EBDD" stroke-opacity=".14" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/>
      <g class="qmap__compass" transform="translate(940 500)"><circle r="30" fill="none" stroke="#D6A84F" stroke-opacity=".5"/><path d="M0 -26 L6 0 L0 26 L-6 0Z" fill="#D6A84F"/><text y="-34" text-anchor="middle" fill="#F5C76A" font-size="13">N</text></g>
      <path id="qpath" d="" fill="none" stroke="#F5C76A" stroke-width="3" stroke-dasharray="8 8"/>
      ${markers}
      <g id="qplayer" transform="translate(520 520)"><circle r="11" fill="#F5C76A"/><circle r="4" fill="#17191B"/></g>
      <text x="16" y="544" class="qmap__note">Stylised map · not to scale</text></svg>`;
  }


  const MODES = {
    standard: { label: "Standard", lanterns: 3, labels: true, clues: 5, desc: "Labelled map · 3 lanterns · 5 clue cards" },
    expert: { label: "Expert", lanterns: 2, labels: false, clues: 6, desc: "No map labels · 2 lanterns · all 6 sites" },
  };

  LL.Games.register("heritage-quest", {
    mount(root, api) {
      let mode = "standard", route, step, lanterns, score, pos, collected, busy, searchStart;
      const $ = (s) => root.querySelector(s);
      const M = () => MODES[mode];

      function meta() { api.setMeta(`<span class="meta-pill">Clue ${Math.min(step + 1, route.length)}/${route.length}</span><span class="meta-pill">${LL.Icons.get("lantern")} ${lanterns}</span><span class="meta-pill">${score} pts</span>`); }

      function intro() {
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-intro g-intro--photo">
          <div class="g-intro__media" data-ph></div>
          <div class="g-intro__body">
            <h2>Heritage Quest</h2>
            <p>A treasure map of Lahore has been cut into clue cards. Read each clue, travel to the right monument, then search a real photograph of the site for three hidden sigils.</p>
            <ul class="g-rules"><li>Clues are built from documented history.</li><li>A wrong journey burns a lantern — lose them all and night falls.</li><li>Find sigils quickly for a speed bonus; each site rewards a postcard.</li><li>Expert hides every label on the map.</li></ul>
            <div class="seg seg--stack" role="radiogroup" aria-label="Mode">${Object.entries(MODES).map(([k, v]) => `<button role="radio" aria-checked="${k === mode}" data-mode="${k}"><b>${v.label}</b><small>${v.desc}${api.levelBest(k) ? ` · best ${api.levelBest(k)}` : ""}</small></button>`).join("")}</div>
            <button class="btn btn--gold btn--lg" data-start>Begin the quest</button>
          </div></div></div>`;
        $("[data-ph]").appendChild(api.photo("shalimar-gardens", { width: 1200, label: false }));
        api.setMeta("");
      }

      function start() {
        route = LL.UI.shuffle(Object.keys(SITES)).slice(0, M().clues);
        step = 0; lanterns = M().lanterns; score = 0; collected = []; pos = { x: 520, y: 520 }; busy = false;
        root.innerHTML = `<div class="g-wrap quest">
          <div class="quest__map ${M().labels ? "" : "no-labels"}">${mapSVG()}</div>
          <aside class="quest__side">
            <div class="g-panel clue-card" id="q-clue"></div>
            <div class="g-panel"><h3>Objectives</h3><ul class="quest-list" id="q-obj"></ul></div>
            <div class="g-panel"><h3>Postcards</h3><div class="postcards" id="q-coins"></div></div>
          </aside></div>`;
        renderSide(); meta();
      }

      function renderSide() {
        const id = route[step];
        $("#q-clue").innerHTML = `<p class="eyebrow">Clue card ${step + 1} of ${route.length}</p><p class="clue-card__text">“${LL.UI.esc(SITES[id].clue)}”</p><p class="muted small">Select the matching site on the map.</p>`;
        $("#q-clue").classList.remove("pop"); void $("#q-clue").offsetWidth; $("#q-clue").classList.add("pop");
        $("#q-obj").innerHTML = route.map((r, i) => `<li class="${i < step ? "is-done" : i > step ? "is-locked" : ""}"><span class="check">${i < step ? "✓" : ""}</span>${i < step ? LL.UI.esc(api.location(r).name) : i === step ? "Solve the current clue" : "Sealed clue card"}</li>`).join("");
        const box = $("#q-coins");
        box.innerHTML = collected.length ? "" : '<p class="muted small">No postcards yet.</p>';
        collected.forEach((c) => { const d = document.createElement("div"); d.className = "postcard"; d.appendChild(api.photo(c, { width: 300, label: false })); d.insertAdjacentHTML("beforeend", `<small>${LL.UI.esc(api.location(c).name.replace(/ \(.*\)/, ""))}</small>`); box.appendChild(d); });
      }

      function travel(id) {
        if (busy) return;
        const target = SITES[id], mark = root.querySelector(`[data-site="${id}"]`);
        if (id !== route[step]) {
          if (collected.includes(id)) { LL.UI.toast("Already explored", "Read the current clue card."); return; }
          lanterns--; meta(); api.sound("fail");
          mark.classList.remove("is-wrong"); void mark.getBBox(); mark.classList.add("is-wrong");
          LL.UI.toast("Wrong destination", "A lantern burns out.");
          if (lanterns <= 0) return end(false);
          return;
        }
        busy = true;
        api.sound("unlock");
        const path = $("#qpath");
        path.setAttribute("d", `M ${pos.x} ${pos.y} Q ${(pos.x + target.x) / 2} ${Math.min(pos.y, target.y) - 80} ${target.x} ${target.y}`);
        const len = path.getTotalLength();
        const player = $("#qplayer");
        const t0 = performance.now(), dur = LL.FX.reduce ? 10 : 1100;
        (function anim(t) {
          const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const pt = path.getPointAtLength(len * e);
          player.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          if (k < 1) requestAnimationFrame(anim);
          else { pos = { x: target.x, y: target.y }; mark.classList.add("is-visited"); setTimeout(() => search(id), 250); }
        })(t0);
      }

      function search(id) {
        const loc = api.location(id);
        const found = new Set();
        searchStart = performance.now();
        const spots = LL.UI.shuffle([[12, 22], [28, 72], [46, 40], [64, 80], [82, 28], [90, 60], [20, 46], [58, 16], [74, 54], [38, 86]]).slice(0, 3);
        const wrap = document.createElement("div");
        wrap.innerHTML = `<p class="eyebrow">You have arrived</p><h2 style="margin-bottom:.3rem">${LL.UI.esc(loc.name)}</h2>
          <p class="muted">Three gold sigils are hidden in this photograph. <b id="hs-n">0</b>/3 found.</p>
          <div class="hidden-scene" id="hs-scene">${spots.map((s, i) => `<button class="hidden-obj" style="left:${s[0]}%;top:${s[1]}%" data-h="${i}" aria-label="Hidden sigil">${LL.Icons.get(TREASURES[(step + i) % TREASURES.length])}</button>`).join("")}</div>
          <div id="hs-reward"></div>`;
        wrap.querySelector("#hs-scene").prepend(api.photo(id, { width: 1600, start: Math.floor(Math.random() * 2), label: false, credit: true }));
        const body = LL.UI.openModal(wrap, { label: "Hidden sigils" });
        body.addEventListener("click", (e) => {
          const h = e.target.closest("[data-h]");
          if (h && !found.has(h.dataset.h)) {
            found.add(h.dataset.h); h.classList.add("is-found"); api.sound("xp"); score += 30;
            body.querySelector("#hs-n").textContent = found.size; meta();
            if (found.size === 3) {
              const secs = Math.round((performance.now() - searchStart) / 1000);
              const speed = Math.max(0, 60 - secs) * 3;
              const fact = loc.facts[Math.floor(Math.random() * loc.facts.length)];
              collected.push(id);
              score += 100 + lanterns * 20 + speed;
              LL.Game.award(15, `Sigils found at ${loc.name}`);
              body.querySelector("#hs-reward").innerHTML = `<div class="reward pop"><div><b>Postcard collected · +${100 + lanterns * 20} pts${speed ? ` · speed bonus +${speed}` : ""}</b><p><span class="tag tag--real">Documented history</span> ${LL.UI.esc(fact)}</p></div></div>
                <button class="btn btn--gold" data-cont>${step + 1 < route.length ? "Next clue card →" : "Open the treasure"}</button>`;
              api.sound("success");
            }
          }
          if (e.target.closest("[data-cont]")) {
            LL.UI.closeModal();
            step++; busy = false; meta();
            if (step >= route.length) end(true); else renderSide();
          }
        });
        const onClose = () => { document.removeEventListener("ll:modal-closed", onClose); if (found.size < 3) { busy = false; LL.UI.toast("Sigils remain", "Select the site again to keep searching."); } };
        document.addEventListener("ll:modal-closed", onClose);
      }

      function end(win) {
        busy = false;
        const title = win ? (mode === "expert" ? "Cartographer of Lahore" : "Treasure Seeker") : "Lost in the Lanes";
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-result">
          <p class="eyebrow">${win ? "Quest complete" : "Night has fallen"}</p>
          <h2>${title}</h2>
          <p class="g-result__lead">${win ? "The final clue leads back to where you began. The treasure was the route itself — every postcard now sits in your passport." : `You followed ${step} of ${route.length} clues before your lanterns burnt out.`}</p>
          <dl class="g-stats"><div><dt>Sites</dt><dd>${collected.length}/${route.length}</dd></div><div><dt>Lanterns</dt><dd>${lanterns}</dd></div><div><dt>Mode</dt><dd>${M().label}</dd></div><div><dt>Score</dt><dd>${score}</dd></div></dl>
          <div class="postcards postcards--center" id="end-cards"></div>
          <div class="g-btns"><button class="btn btn--gold" data-restart>New quest</button><button class="btn btn--ghost" data-modes>Change mode</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div></div>`;
        collected.forEach((c) => { const d = document.createElement("div"); d.className = "postcard"; d.appendChild(api.photo(c, { width: 300, label: false })); $("#end-cards").appendChild(d); });
        if (win) {
          api.burst(); api.sound("level");
          api.saveLevel(mode, score);
          if (mode === "expert") api.flag("questExpert");
          api.complete({ score, xp: mode === "expert" ? 200 : 140, label: `Heritage Quest — ${title}` });
        } else { api.sound("fail"); api.record(score); }
      }

      root.addEventListener("click", (e) => {
        const md = e.target.closest("[data-mode]");
        if (md) { mode = md.dataset.mode; root.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b === md))); api.sound("click"); return; }
        if (e.target.closest("[data-start]") || e.target.closest("[data-restart]")) { api.sound("open"); return start(); }
        if (e.target.closest("[data-modes]")) return intro();
        if (e.target.closest("[data-exit]")) return api.exit();
        const m = e.target.closest("[data-site]");
        if (m) travel(m.dataset.site);
      });
      root.addEventListener("keydown", (e) => { const m = e.target.closest && e.target.closest("[data-site]"); if (m && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); travel(m.dataset.site); } });
      intro();
      return () => { if (!document.getElementById("modal").hidden) LL.UI.closeModal(); };
    },
  });
})();
