/* =========================================================================
   GAME 3 — MYSTERY CHAMBER  (escape room · v2)
   FICTIONAL setting: a sealed chamber beneath an old haveli.
   The codes are built from DOCUMENTED dates and facts.
   v2: archive "plates" with real photographs, three difficulty levels,
   wrong-attempt and hint penalties, score breakdown with star rating,
   personal bests per difficulty, replay.
   ========================================================================= */

(function () {
  const STAGES = [
    {
      name: "Door of the Emperor's Year",
      type: "dial",
      code: "1673",
      prompt: "Four bronze dials are set into the door. An inscription reads: “Enter the year the Emperor's Mosque was completed.”",
      hint: "The Emperor's Mosque is the Badshahi Mosque. Search the bookshelf.",
      objects: [
        { id: "scroll", icon: "scroll", label: "Scroll", x: 12, y: 58, text: "“The emperor who raised the great mosque facing the Fort was Aurangzeb. Its year will open the first door.”", clue: true },
        { id: "shelf", icon: "book", label: "Bookshelf", x: 84, y: 30, text: "One volume falls open at a photographic plate: “Badshahi Mosque — construction 1671 to 1673.”", clue: true, plate: ["badshahi-mosque", 0] },
        { id: "vase", icon: "garden", label: "Vase", x: 86, y: 72, text: "A blue-glazed vase. Empty, but beautiful." },
        { id: "rug", icon: "tile", label: "Rug", x: 30, y: 86, text: "A woven rug. Underneath: only dust." },
      ],
    },
    {
      name: "Door of the Four Emblems",
      type: "symbols",
      code: ["gate", "tile", "dome", "tower"],
      pad: ["dome", "garden", "tower", "gate", "flame", "tile"],
      names: { gate: "Fort", tile: "Tiles", dome: "Dome", tower: "Tower", garden: "Garden", flame: "Flame" },
      prompt: "Six emblems are carved into the door. A line below them reads: “Press four emblems — the oldest monument first, the youngest last.”",
      hint: "Fort rebuilt 1566 → Wazir Khan Mosque c. 1641 → Badshahi Mosque 1673 → Minar-e-Pakistan 1968.",
      objects: [
        { id: "lamp", icon: "lantern", label: "Oil lamp", x: 12, y: 40, text: "Lamplight reveals a scratched note beside the Fort emblem: “Rebuilt in brick by Akbar from 1566.”", clue: true },
        { id: "tile", icon: "tile", label: "Loose tile", x: 86, y: 34, text: "On the back of a glazed tile: “The tiled mosque of Wazir Khan, completed around 1641.”", clue: true, plate: ["wazir-khan-mosque", 2] },
        { id: "chest", icon: "lock", label: "Chest", x: 16, y: 80, text: "Two folded cards: “The Dome — the Emperor's Mosque, 1673.” and “The Tower — completed 1968.”", clue: true },
        { id: "fountain", icon: "garden", label: "Dry fountain", x: 86, y: 78, text: "A small marble basin, long dry. The Garden and Flame emblems seem to be decoys." },
      ],
    },
    {
      name: "Door of the Garden's Name",
      type: "riddle",
      answer: /sh?al[ia]?ma?r/i,
      prompt: "The final door has no handle — only a carved mouth. Its riddle: “Laid out for Shah Jahan in 1641–42, I fall in three terraces and feed some 410 fountains. Speak my name.”",
      hint: "A Mughal garden in Baghbanpura, inscribed by UNESCO with the Fort in 1981. It begins with S.",
      objects: [
        { id: "map", icon: "map", label: "Old map", x: 14, y: 46, text: "A map of Lahore. East of the Walled City, a garden is drawn with three stepped terraces.", clue: true, plate: ["shalimar-gardens", 1] },
        { id: "rose", icon: "garden", label: "Pressed rose", x: 86, y: 40, text: "A pressed rose with a label: “From the gardens of Shah Jahan.”" },
        { id: "plaque", icon: "stamp", label: "Brass plaque", x: 50, y: 92, text: "“Farah Bakhsh · Faiz Bakhsh · Hayat Bakhsh” — the traditional names of three terraces.", clue: true },
      ],
    },
  ];

  const DIFF = {
    relaxed: { t: 480, label: "Relaxed", desc: "8 minutes · hints −20 s", hint: 20, wrong: 5 },
    standard: { t: 300, label: "Standard", desc: "5 minutes · hints −30 s", hint: 30, wrong: 10 },
    expert: { t: 180, label: "Expert", desc: "3 minutes · hints −45 s · wrong codes −20 s", hint: 45, wrong: 20 },
  };

  LL.Games.register("mystery-chamber", {
    mount(root, api) {
      let stage, time, timer = null, clues, dial, seq, diff = "standard", hintsUsed, wrongs;
      const $ = (s) => root.querySelector(s);
      const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      const D = () => DIFF[diff];

      function meta() { api.setMeta(`<span class="meta-pill ${time <= 30 ? "is-danger" : ""}">${LL.Icons.get("hourglass")} ${fmt(Math.max(0, time))}</span><span class="meta-pill">Door ${Math.min(stage + 1, 3)}/3</span>`); }

      function intro() {
        clearInterval(timer);
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-intro g-intro--photo">
          <div class="g-intro__media" data-ph></div>
          <div class="g-intro__body">
            <span class="tag tag--fiction">Fictional setting</span> <span class="tag tag--real">Documented codes</span>
            <h2>Mystery Chamber</h2>
            <p>You followed a rumour into a sealed chamber beneath an old haveli in the Walled City. The trapdoor has closed above you. Three locked doors stand between you and daylight, and the lamp oil is running low.</p>
            <ul class="g-rules"><li>Search objects in the room. Useful finds are recorded in your clue log; some reveal archive photographs.</li><li>Every code is built from documented Lahore history.</li><li>Wrong codes and hints cost time. Your score is the time you keep.</li></ul>
            <div class="seg seg--stack" role="radiogroup" aria-label="Difficulty">${Object.entries(DIFF).map(([k, v]) => `<button role="radio" aria-checked="${k === diff}" data-diff="${k}"><b>${v.label}</b><small>${v.desc}${api.levelBest(k) ? ` · best ${api.levelBest(k)}` : ""}</small></button>`).join("")}</div>
            <button class="btn btn--gold btn--lg" data-start>Enter the chamber</button>
          </div></div></div>`;
        $("[data-ph]").appendChild(api.photo("lahore-fort", { width: 1200, start: 3, label: false }));
        api.setMeta("");
      }

      function start() {
        stage = 0; clues = []; hintsUsed = 0; wrongs = 0; time = D().t;
        clearInterval(timer);
        timer = setInterval(() => {
          time--; meta();
          if (time <= 10 && time > 0) api.sound("tick");
          if (time <= 0) { clearInterval(timer); fail(); }
        }, 1000);
        room();
      }

      function room() {
        const s = STAGES[stage];
        dial = [0, 0, 0, 0]; seq = [];
        root.innerHTML = `<div class="g-wrap chamber">
          <div class="chamber__room" id="ch-room">
            <div class="chamber__bg" data-bg></div>
            ${s.objects.map((o) => `<button class="obj" style="left:${o.x}%;top:${o.y}%" data-obj="${o.id}"><span class="obj__icon">${LL.Icons.get(o.icon)}</span><small>${o.label}</small></button>`).join("")}
            <div class="chamber__door" id="ch-door">
              <div class="door__panel">
                <p class="eyebrow">Door ${stage + 1} of 3</p><h3>${s.name}</h3>
                <p class="door__prompt">${LL.UI.esc(s.prompt)}</p>
                <div id="ch-lock"></div>
              </div>
            </div>
          </div>
          <aside class="g-panel chamber__side">
            <h3>Clue log</h3>
            <ul class="inv" id="ch-clues"></ul>
            <div class="chamber__msg" id="ch-msg" aria-live="polite">Search the room…</div>
            <button class="btn btn--ghost btn--sm" data-hint>Use a hint (−${D().hint} s)</button>
          </aside></div>`;
        $("[data-bg]").appendChild(api.photo("lahore-fort", { width: 1600, start: 4, label: false }));
        renderClues(); lock(); meta();
      }

      function renderClues() {
        const ul = $("#ch-clues");
        if (!ul) return;
        ul.innerHTML = clues.length ? clues.map((c) => `<li class="inv__item is-found"><b>${c.label}</b><small>${LL.UI.esc(c.text)}</small></li>`).join("") : '<li class="muted small">Nothing recorded yet.</li>';
      }

      function lock() {
        const s = STAGES[stage], el = $("#ch-lock");
        if (s.type === "dial") {
          el.innerHTML = `<div class="dials">${dial.map((d, i) => `<div class="dial"><button data-dial="${i}" data-dir="1" aria-label="Increase digit ${i + 1}">▲</button><output id="dial-${i}">${d}</output><button data-dial="${i}" data-dir="-1" aria-label="Decrease digit ${i + 1}">▼</button></div>`).join("")}</div>
            <button class="btn btn--gold btn--sm" data-try>Turn the handle</button>`;
        } else if (s.type === "symbols") {
          el.innerHTML = `<div class="seq" id="ch-seq">${[0, 1, 2, 3].map((i) => `<span>${seq[i] ? LL.Icons.get(seq[i]) : ""}</span>`).join("")}</div>
            <div class="sympad">${s.pad.map((p) => `<button data-sym="${p}" aria-label="${s.names[p]} emblem">${LL.Icons.get(p)}<small>${s.names[p]}</small></button>`).join("")}</div>
            <button class="btn btn--ghost btn--sm" data-clear>Clear</button>`;
        } else {
          el.innerHTML = `<form class="form-row" data-riddle><label class="sr-only" for="ch-ans">Your answer</label><input class="input" id="ch-ans" autocomplete="off" placeholder="Speak the name…"><button class="btn btn--gold btn--sm">Speak</button></form>`;
        }
      }

      function msg(html, kind) { const m = $("#ch-msg"); if (m) { m.className = "chamber__msg pop " + (kind || ""); m.innerHTML = html; } }

      function wrong() {
        wrongs++;
        api.sound("fail");
        const d = $("#ch-door .door__panel"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
        time = Math.max(1, time - D().wrong);
        msg(`The lock grinds and holds. (−${D().wrong} s)`, "is-bad"); meta();
      }

      function open() {
        api.sound("unlock");
        LL.Game.award(20, `Unlocked: ${STAGES[stage].name}`);
        $("#ch-door").classList.add("is-open");
        msg("The door swings open.", "is-good");
        setTimeout(() => { stage++; if (stage >= STAGES.length) win(); else room(); }, 1300);
      }

      function win() {
        clearInterval(timer);
        const timeBonus = time * 5, hintPen = hintsUsed * 60, wrongPen = wrongs * 25, base = 400;
        const mult = { relaxed: 0.8, standard: 1, expert: 1.5 }[diff];
        const score = Math.max(50, Math.round((base + timeBonus - hintPen - wrongPen) * mult));
        const stars = time / D().t > 0.45 && !hintsUsed ? 3 : time / D().t > 0.2 ? 2 : 1;
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-result">
          <p class="eyebrow">Escaped · ${D().label}</p>
          <h2>Daylight over the Walled City</h2>
          <p class="g-result__lead">The last door opens onto the lanes near Delhi Gate.</p>
          <div class="stars" aria-label="${stars} of 3 stars">${[1, 2, 3].map((i) => `<span class="${i <= stars ? "is-on" : ""}">${LL.Icons.get("star")}</span>`).join("")}</div>
          <dl class="g-stats"><div><dt>Time left</dt><dd>${fmt(time)}</dd></div><div><dt>Hints</dt><dd>${hintsUsed}</dd></div><div><dt>Wrong codes</dt><dd>${wrongs}</dd></div><div><dt>Score</dt><dd>${score}</dd></div></dl>
          <p class="muted small">Base ${base} + time ${timeBonus} − hints ${hintPen} − errors ${wrongPen}, × ${mult} difficulty.</p>
          <div class="g-btns"><button class="btn btn--gold" data-restart>Play again</button><button class="btn btn--ghost" data-levels>Change difficulty</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div></div>`;
        api.setMeta(`<span class="meta-pill">Escaped</span>`);
        api.burst(); api.sound("level");
        api.saveLevel(diff, score);
        api.complete({ score, xp: { relaxed: 110, standard: 160, expert: 220 }[diff], label: `Mystery Chamber — escaped (${D().label})` });
      }

      function fail() {
        api.sound("fail");
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-result">
          <p class="eyebrow">Out of time</p><h2>The lamp has gone out</h2>
          <p class="g-result__lead">Darkness fills the chamber at door ${stage + 1} of 3. Every clue you need is in the room — try again.</p>
          <div class="g-btns"><button class="btn btn--gold" data-restart>Try again</button><button class="btn btn--ghost" data-levels>Change difficulty</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div></div>`;
      }

      function plate(o) {
        const [key, start] = o.plate;
        const wrap = document.createElement("div");
        wrap.innerHTML = `<p class="eyebrow">Archive plate</p><h3 style="margin-top:0">${LL.UI.esc(api.location(key).name)}</h3><div class="plate"></div><p class="muted" style="margin-top:.8rem">${LL.UI.esc(o.text)}</p>`;
        wrap.querySelector(".plate").appendChild(api.photo(key, { width: 1200, start, label: false, credit: true }));
        LL.UI.openModal(wrap, { label: "Archive plate" });
      }

      root.addEventListener("click", (e) => {
        const t = e.target;
        const df = t.closest("[data-diff]");
        if (df) { diff = df.dataset.diff; root.querySelectorAll("[data-diff]").forEach((b) => b.setAttribute("aria-checked", String(b === df))); api.sound("click"); return; }
        if (t.closest("[data-start]") || t.closest("[data-restart]")) { api.sound("open"); return start(); }
        if (t.closest("[data-levels]")) return intro();
        if (t.closest("[data-exit]")) return api.exit();
        const ob = t.closest("[data-obj]");
        if (ob) {
          const o = STAGES[stage].objects.find((x) => x.id === ob.dataset.obj);
          ob.classList.add("is-searched");
          api.sound("page");
          msg(`<b>${o.label}.</b> ${LL.UI.esc(o.text)}${o.plate ? ` <button class="link-btn" data-plate="${o.id}">View the plate</button>` : ""}`);
          if (o.clue && !clues.find((c) => c.id === o.id)) { clues.push(o); renderClues(); }
          return;
        }
        const pl = t.closest("[data-plate]");
        if (pl) return plate(STAGES[stage].objects.find((x) => x.id === pl.dataset.plate));
        const dl = t.closest("[data-dial]");
        if (dl) { const i = +dl.dataset.dial; dial[i] = (dial[i] + +dl.dataset.dir + 10) % 10; $("#dial-" + i).textContent = dial[i]; api.sound("tick"); return; }
        if (t.closest("[data-try]")) return dial.join("") === STAGES[stage].code ? open() : wrong();
        const sy = t.closest("[data-sym]");
        if (sy && seq.length < 4) {
          seq.push(sy.dataset.sym); api.sound("click");
          $("#ch-seq").innerHTML = [0, 1, 2, 3].map((i) => `<span class="${seq[i] ? "pop" : ""}">${seq[i] ? LL.Icons.get(seq[i]) : ""}</span>`).join("");
          if (seq.length === 4) { if (seq.join() === STAGES[stage].code.join()) open(); else { wrong(); seq = []; setTimeout(lock, 500); } }
          return;
        }
        if (t.closest("[data-clear]")) { seq = []; lock(); return; }
        if (t.closest("[data-hint]")) { hintsUsed++; time = Math.max(1, time - D().hint); meta(); msg(`<b>Hint.</b> ${LL.UI.esc(STAGES[stage].hint)}`, "is-hint"); return; }
      });
      root.addEventListener("submit", (e) => {
        if (!e.target.matches("[data-riddle]")) return;
        e.preventDefault();
        const v = $("#ch-ans").value.trim().replace(/\s+/g, "");
        if (STAGES[stage].answer.test(v)) open(); else wrong();
      });
      intro();
      return () => clearInterval(timer);
    },
  });
})();
