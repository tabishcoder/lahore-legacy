/* =========================================================================
   GAME 1 — THE LOST LAHORE  (story adventure · v2)
   FICTIONAL STORY: Bibi Noor, Ustad Karim, Bilal and the journal are
   invented. Every "Documented history" note and knowledge check uses
   documented facts. Scenes use real photographs of each location.

   v2: three difficulty levels, a lamp-oil turn budget, knowledge checks
   at chapter gates, hidden clue words (unmarked on the hardest level),
   chapter progress, scoring with a final title, replay.
   ========================================================================= */

(function () {
  const PAGES = {
    p1: { title: "Page I — Colours of the Sky", real: "The Wazir Khan Mosque (completed c. 1641) is famous for kashi kari — glazed tile mosaic in cobalt, turquoise, yellow and green." },
    p2: { title: "Page II — The Red Gate", real: "The Alamgiri Gate of the Lahore Fort was built under Emperor Aurangzeb in 1674." },
    p3: { title: "Page III — A Thousand Mirrors", real: "The Sheesh Mahal, built under Shah Jahan in 1631–32, is decorated with mirror mosaic set in white marble." },
    p4: { title: "Page IV — The Emperor's Courtyard", real: "The Badshahi Mosque was completed in 1673; its courtyard can hold around 100,000 worshippers." },
    p5: { title: "Page V — The Tower of Resolve", real: "Minar-e-Pakistan (built 1960–1968) marks where the Lahore Resolution was presented on 23 March 1940." },
  };
  // scene → real photograph [location key, gallery index]
  const SCENES = {
    gate: ["walled-city", 0], bazaar: ["walled-city", 2], wazir: ["wazir-khan-mosque", 0], tiles: ["wazir-khan-mosque", 2],
    fort: ["lahore-fort", 0], sheesh: ["lahore-fort", 3], badshahi: ["badshahi-mosque", 4], minar: ["minar-e-pakistan", 0], park: ["iqbal-park", 0],
  };
  const CHAPTERS = { gate: 0, bazaar: 0, wazir: 1, tiles: 1, fort: 2, sheesh: 2, badshahi: 3, minar: 4, park: 4 };
  const CHAPTER_NAMES = ["Prologue · Delhi Gate", "I · Wazir Khan Mosque", "II · Lahore Fort", "III · Badshahi Mosque", "IV · Minar-e-Pakistan"];

  // [[visible words|clueId]] marks a hidden clue inside narration.
  // check: knowledge check {q, a:[...], c} — wrong answers cost lamp oil.
  const NODES = {
    start: { who: "Narrator", scene: "gate", text: "Dusk settles over Delhi Gate. Rickshaw bells fade as you step into the Walled City. At a tiny stall of old books, an elderly woman — Bibi Noor — presses a leather journal into your hands. Its spine is cracked and five pages have been torn out.",
      choices: [{ t: "Open the journal", to: "journal" }, { t: "Ask Bibi Noor where she found it", to: "noor" }] },
    noor: { who: "Bibi Noor", scene: "gate", text: "“It belonged to my grandfather, a tile-maker. Before he died he hid its pages across the city, so that whoever found them would truly see Lahore. My eyes are too old for the chase, beta. Will you go? Take this lamp — but the oil will not last all night.”",
      choices: [{ t: "“I'll find every page.”", to: "journal" }] },
    journal: { who: "The Journal", scene: "gate", text: "The first line is written in faded ink: “Begin where the walls wear the colours of the sky — the mosque the governor built just inside this very gate.”",
      choices: [{ t: "Walk along the royal route to the Wazir Khan Mosque", to: "wk" }, { t: "Wander the bazaar instead", to: "bazaar" }] },
    bazaar: { who: "Narrator", scene: "bazaar", text: "Spice sellers call out and brass glints under hanging bulbs. It is beautiful — but the journal's words tug at you. The colours of the sky are not in the bazaar.",
      choices: [{ t: "Return to the clue", to: "journal" }] },
    wk: { who: "Narrator", scene: "wazir", text: "The facade of the Wazir Khan Mosque blazes with cobalt, turquoise and saffron tiles. Near the great portal, you notice [[one tile sitting slightly loose|p1]] in the mosaic.",
      choices: [{ t: "Talk to the artisan restoring the tiles", to: "karim" }, { t: "Study the tile panels closely", to: "wk2" }, { t: "Head north along the royal route to the Fort", to: "gateCheck", req: "p1" }] },
    wk2: { who: "Narrator", scene: "tiles", text: "Up close, each flower is made of hundreds of hand-cut pieces of glazed tile. Stunning — but nothing is hidden here. Perhaps the portal itself holds the secret.",
      choices: [{ t: "Look at the portal again", to: "wk" }] },
    karim: { who: "Ustad Karim", scene: "tiles", text: "“Kashi kari,” he smiles, brushing dust from a cobalt tile. “Every piece cut and set by hand. This mosque was built for Hakim Ilm-ud-din Ansari — the governor everyone called Wazir Khan. Look near the portal; the old craftsmen loved to leave secrets.”",
      choices: [{ t: "Return to the portal", to: "wk" }] },
    gateCheck: { who: "Bilal", scene: "fort", check: { q: "A young guide named Bilal blocks the path with a grin: “Before I show you the fort's secret — which emperor built this great gate?”", a: ["Aurangzeb", "Akbar", "Babur", "Ranjit Singh"], c: 0, ok: "fort", why: "The Alamgiri Gate was built under Aurangzeb (Alamgir) in 1674." } },
    fort: { who: "Narrator", scene: "fort", text: "“Correct!” Bilal laughs. The Alamgiri Gate towers above you between its rounded bastions. On the lowest step you spot [[a line of chalk handwriting|p2]].",
      choices: [{ t: "Ask Bilal about the fort", to: "bilal" }, { t: "Enter the fort", to: "inside", req: "p2" }] },
    bilal: { who: "Bilal", scene: "fort", text: "“The fort is older than this gate. Akbar rebuilt it in brick from 1566; Jahangir and Shah Jahan added palaces and painted walls. Later the Sikh rulers of Lahore lived here too.”",
      choices: [{ t: "Thank him and look around", to: "fort" }] },
    inside: { who: "The Journal", scene: "fort", text: "Page II reads: “Where a single candle becomes ten thousand stars, look into the light.” Bilal knows exactly where that is. He leads you to the Sheesh Mahal, the Palace of Mirrors.",
      choices: [{ t: "Raise your lamp to the ceiling", to: "sheesh" }, { t: "Search the marble floor", to: "floor" }] },
    floor: { who: "Narrator", scene: "sheesh", text: "The floor is cool white marble, smooth and empty. In the dark the mirrors are only grey. You need light.",
      choices: [{ t: "Raise your lamp", to: "sheesh" }] },
    sheesh: { who: "Narrator", scene: "sheesh", text: "Your lamp's flame bursts into thousands of glittering points across the ceiling. In one alcove, the reflections line up into [[letters spelling “COUNT THE DOMES”|p3]].",
      choices: [{ t: "Cross the Hazuri Bagh to the Badshahi Mosque", to: "badshahi", req: "p3" }, { t: "Admire the mirrors a little longer", to: "sheesh" }] },
    badshahi: { who: "Bilal", scene: "badshahi", check: { q: "The Badshahi Mosque glows above its red sandstone steps. “Count the domes,” Bilal repeats. “How many white marble domes crown the prayer hall?”", a: ["Three", "Five", "Seven", "One"], c: 0, ok: "domesRight", why: "The prayer hall carries three marble domes — a large central dome and one on each side." } },
    domesRight: { who: "Narrator", scene: "badshahi", text: "Three. As you say it aloud, you notice that the third step below the gateway hides [[a folded paper tucked into a crack|p4]]. Beside the steps stands the tomb of Allama Iqbal, the poet-philosopher.",
      choices: [{ t: "Follow the journal to the tower in the park", to: "minarCheck", req: "p4" }] },
    minarCheck: { who: "Bilal", scene: "minar", check: { q: "Across the road, Minar-e-Pakistan rises white against the night. “Last question,” says Bilal. “What happened on this ground in March 1940?”", a: ["The Lahore Resolution was presented", "The Lahore Fort was rebuilt", "The Shalimar Gardens were laid out", "Lahore became a Mughal capital"], c: 0, ok: "minar", why: "The Lahore Resolution was presented here on 23 March 1940." } },
    minar: { who: "Narrator", scene: "minar", text: "Families stroll the lawns of Greater Iqbal Park. At the foot of the tower you find [[a plaque with a page pressed behind its frame|p5]].",
      choices: [{ t: "Read the journal's final words", to: "ending" }, { t: "Walk through the gardens first", to: "garden" }] },
    garden: { who: "Narrator", scene: "park", text: "Fountains whisper and lamps glow along the walkways. In the British era this open ground was called Minto Park.",
      choices: [{ t: "Return to the tower", to: "minar" }] },
    ending: { ending: true },
  };

  const LEVELS = {
    storyteller: { label: "Storyteller", oil: Infinity, marked: true, desc: "No lamp limit · clues underlined" },
    explorer: { label: "Explorer", oil: 34, marked: true, desc: "34 moves of lamp oil · clues underlined" },
    chronicler: { label: "Chronicler", oil: 26, marked: false, desc: "26 moves · clues are not marked — read carefully" },
  };

  function parseText(t, found, marked) {
    return LL.UI.esc(t).replace(/\[\[([^|]+)\|(p\d)\]\]/g, (m, words, id) =>
      found.has(id) ? `<mark class="clue-word is-found">${words}</mark>` : `<button class="clue-word ${marked ? "" : "is-subtle"}" data-clue="${id}">${words}</button>`);
  }

  LL.Games.register("lost-lahore", {
    mount(root, api) {
      let found, node, steps, oil, level = "explorer", checksRight, checksWrong, currentScene;
      const $ = (s) => root.querySelector(s);

      function intro() {
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-intro g-intro--photo">
          <div class="g-intro__media" data-ph></div>
          <div class="g-intro__body">
            <span class="tag tag--fiction">Fictional story</span> <span class="tag tag--real">Documented history</span>
            <h2>The Lost Lahore</h2>
            <p>A tile-maker's journal, five missing pages, one night in the Walled City. Follow the royal route from Delhi Gate to Minar-e-Pakistan, read every scene closely for hidden clues, and answer the guide's questions before your lamp runs dry.</p>
            <ul class="g-rules"><li>Each move uses lamp oil. Wrong answers to knowledge checks cost 3 more.</li><li>Clues hide inside the narration — on Chronicler they are not marked.</li><li>Score: pages found, oil remaining and knowledge checks answered.</li></ul>
            <div class="seg seg--stack" role="radiogroup" aria-label="Difficulty">${Object.entries(LEVELS).map(([k, v]) => `<button role="radio" aria-checked="${k === level}" data-level="${k}"><b>${v.label}</b><small>${v.desc}${api.levelBest(k) ? ` · best ${api.levelBest(k)}` : ""}</small></button>`).join("")}</div>
            <button class="btn btn--gold btn--lg" data-start>Begin the night</button>
          </div></div></div>`;
        $("[data-ph]").appendChild(api.photo("walled-city", { width: 1200, label: false }));
        api.setMeta("");
      }

      function start() {
        found = new Set(); steps = 0; checksRight = 0; checksWrong = 0; currentScene = null;
        oil = LEVELS[level].oil;
        root.innerHTML = `<div class="g-wrap story">
          <div class="story__scene" id="ll-scene"><div class="story__chapters" id="ll-chap"></div></div>
          <div class="story__main">
            <div class="g-panel story__box">
              <div class="story__head"><span class="tag tag--fiction">Fictional story</span><span class="story__chapter" id="ll-chapter"></span></div>
              <p class="story__who" id="ll-who"></p>
              <div class="story__text" id="ll-text" aria-live="polite"></div>
              <div class="story__choices" id="ll-choices"></div>
            </div>
            <aside class="g-panel story__inv">
              <h3>Journal pages <span id="ll-count">0 / 5</span></h3>
              ${LEVELS[level].marked ? `<p class="muted small">Look for <span class="clue-word demo">underlined words</span> in the story — they hide clues.</p>` : `<p class="muted small">Clues are unmarked. Hover or tab through the narration to find them.</p>`}
              <ul class="inv" id="ll-inv"></ul>
            </aside>
          </div></div>`;
        renderInv();
        go("start", true);
      }

      function meta() {
        const L = LEVELS[level];
        const oilPill = L.oil === Infinity ? "" : `<span class="meta-pill ${oil <= 6 ? "is-danger" : ""}">${LL.Icons.get("lantern")} ${Math.max(0, oil)}</span>`;
        api.setMeta(`${oilPill}<span class="meta-pill">${LL.Icons.get("scroll")} ${found.size}/5</span>`);
      }

      function renderInv() {
        $("#ll-count").textContent = `${found.size} / 5`;
        $("#ll-inv").innerHTML = Object.entries(PAGES).map(([id, p]) => found.has(id)
          ? `<li class="inv__item is-found"><b>${p.title}</b><small><span class="tag tag--real">Documented history</span> ${LL.UI.esc(p.real)}</small></li>`
          : `<li class="inv__item"><b>Missing page</b><small>Still hidden somewhere in Lahore…</small></li>`).join("");
        meta();
      }

      function setScene(scene) {
        if (scene === currentScene) return;
        currentScene = scene;
        const sc = $("#ll-scene");
        const old = sc.querySelector(".media");
        const [key, start] = SCENES[scene];
        const m = api.photo(key, { width: 1800, start, label: false, credit: true });
        sc.prepend(m);
        if (old) setTimeout(() => old.remove(), 900);
        const ch = CHAPTERS[scene];
        $("#ll-chap").innerHTML = CHAPTER_NAMES.map((n, i) => `<span class="${i < ch ? "is-done" : i === ch ? "is-current" : ""}" title="${n}"></span>`).join("");
        $("#ll-chapter").textContent = "Chapter " + CHAPTER_NAMES[ch];
      }

      function spend(n) {
        if (LEVELS[level].oil === Infinity) return true;
        oil -= n; meta();
        if (oil <= 0) { setTimeout(() => ending(true), 400); return false; }
        return true;
      }

      function go(id, free) {
        node = id;
        if (!free) { steps++; if (!spend(1)) return; }
        const n = NODES[id];
        if (n.ending) return ending(false);
        setScene(n.scene);
        $("#ll-who").textContent = n.who;
        const textEl = $("#ll-text");
        if (n.check) {
          textEl.innerHTML = `<p>${LL.UI.esc(n.check.q)}</p>`;
          $("#ll-choices").innerHTML = `<p class="eyebrow" style="margin:0">Knowledge check</p>` + LL.UI.shuffle(n.check.a.map((a, i) => ({ a, i }))).map((o, k) => `<button class="choice" data-check="${o.i}"><span class="choice__n">${k + 1}</span>${LL.UI.esc(o.a)}</button>`).join("");
        } else {
          textEl.innerHTML = `<p>${parseText(n.text, found, LEVELS[level].marked)}</p>`;
          $("#ll-choices").innerHTML = n.choices.map((c, i) => {
            const locked = c.req && !found.has(c.req);
            return `<button class="choice ${locked ? "is-locked" : ""}" data-to="${c.to}" ${locked ? 'disabled aria-disabled="true" title="Find the hidden clue first"' : ""}>
              <span class="choice__n">${i + 1}</span>${LL.UI.esc(c.t)}${locked ? ` <span class="muted small">${LL.Icons.get("lock")} find the clue first</span>` : ""}</button>`;
          }).join("");
        }
        textEl.classList.remove("type-in"); void textEl.offsetWidth; textEl.classList.add("type-in");
      }

      function answerCheck(i, btn) {
        const n = NODES[node];
        const ok = i === n.check.c;
        root.querySelectorAll("[data-check]").forEach((b) => { b.disabled = true; if (+b.dataset.check === n.check.c) b.classList.add("is-correct"); });
        $("#ll-text").insertAdjacentHTML("beforeend", `<p class="story__note"><span class="tag tag--real">Documented history</span> ${LL.UI.esc(n.check.why)}</p>`);
        if (ok) { checksRight++; api.sound("success"); }
        else { checksWrong++; btn.classList.add("is-wrong"); api.sound("fail"); if (!spend(3)) return; }
        $("#ll-choices").insertAdjacentHTML("beforeend", `<button class="btn btn--gold btn--sm" data-to="${n.check.ok}">Continue</button>`);
      }

      function ending(dark) {
        const all = found.size === 5 && !dark;
        const L = LEVELS[level];
        const oilLeft = L.oil === Infinity ? 0 : Math.max(0, oil);
        const mult = { storyteller: 1, explorer: 1.25, chronicler: 1.6 }[level];
        const score = Math.round((found.size * 120 + oilLeft * 12 + checksRight * 60 - checksWrong * 20) * mult);
        const title = !all ? "Wanderer of the Lanes" : level === "chronicler" ? "Keeper of the Journal" : level === "explorer" ? "Chronicler of Lahore" : "Storyteller";
        setScene(all ? "minar" : "gate");
        root.querySelector(".story__main").innerHTML = `<div class="g-panel g-result g-result--wide">
          <p class="eyebrow">${all ? "Journal restored" : dark ? "The lamp has gone out" : "Pages still missing"}</p>
          <h2>${all ? title : dark ? "Night falls on the Walled City" : "An unfinished journal"}</h2>
          <p class="g-result__lead">${all
            ? "Back at the bookstall, Bibi Noor reads the restored journal by lamplight. The last page, in her grandfather's hand, says: “A city lives as long as someone remembers it. Now you remember Lahore.”"
            : dark ? `Your lamp sputters out with ${found.size} of 5 pages in hand. Bibi Noor smiles: “The city will wait for you.”`
            : `You reached the final page with ${5 - found.size} page(s) still missing. The journal's last words blur on the paper.`}</p>
          <dl class="g-stats"><div><dt>Pages</dt><dd>${found.size}/5</dd></div><div><dt>Knowledge checks</dt><dd>${checksRight}/${checksRight + checksWrong}</dd></div><div><dt>Oil left</dt><dd>${L.oil === Infinity ? "—" : oilLeft}</dd></div><div><dt>Score</dt><dd>${score}</dd></div></dl>
          <div class="g-btns"><button class="btn btn--gold" data-restart>Play again</button><button class="btn btn--ghost" data-levels>Change difficulty</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div>`;
        api.setMeta(`<span class="meta-pill">${all ? "Complete" : "Ended"}</span>`);
        if (all) {
          api.sound("level"); api.burst();
          api.saveLevel(level, score);
          api.complete({ score, xp: { storyteller: 100, explorer: 150, chronicler: 200 }[level], label: `The Lost Lahore — ${title}` });
        } else { api.sound("fail"); api.record(score); }
      }

      root.addEventListener("click", (e) => {
        const lv = e.target.closest("[data-level]");
        if (lv) { level = lv.dataset.level; root.querySelectorAll("[data-level]").forEach((b) => b.setAttribute("aria-checked", String(b === lv))); api.sound("click"); return; }
        if (e.target.closest("[data-start]") || e.target.closest("[data-restart]")) { api.sound("open"); return start(); }
        if (e.target.closest("[data-levels]")) return intro();
        if (e.target.closest("[data-exit]")) return api.exit();
        const clue = e.target.closest("[data-clue]");
        if (clue) {
          const id = clue.dataset.clue;
          if (found.has(id)) return;
          found.add(id);
          api.sound("unlock");
          LL.UI.toast("Journal page found", PAGES[id].title);
          LL.Game.award(10, "Hidden clue discovered");
          renderInv();
          go(node, true);
          return;
        }
        const chk = e.target.closest("[data-check]");
        if (chk && !chk.disabled) return answerCheck(+chk.dataset.check, chk);
        const ch = e.target.closest("[data-to]");
        if (ch && !ch.disabled) { api.sound("page"); go(ch.dataset.to); }
      });
      function onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 9) { const b = root.querySelectorAll(".choice:not([disabled])")[n - 1]; b && b.click(); }
      }
      document.addEventListener("keydown", onKey);
      intro();
      return () => document.removeEventListener("keydown", onKey);
    },
  });
})();
