/* =========================================================================
   GAME 2 — HERITAGE DETECTIVE  (mystery investigation · v2)
   The case framing (a mixed-up museum archive) is FICTIONAL.
   Every piece of evidence describes a REAL documented fact.
   Mechanics: flashlight search of a dark evidence board, hidden evidence,
   case file, historical riddle, accusation, reputation, XP.
   ========================================================================= */

(function () {
  const CASES = [
    {
      title: "The Palace of Mirrors",
      brief: "A crate of restoration samples arrived at the archive without a label. Identify which monument it belongs to.",
      answer: "lahore-fort",
      riddle: "Rebuilt in brick from 1566, I hold a palace of a thousand mirrors and a gate that faces an emperor's mosque. What am I?",
      evidence: [
        { icon: "eye", name: "Mirror shard", text: "A sliver of convex mirror glass set in white marble plaster — mirror mosaic work like the Sheesh Mahal of 1631–32." },
        { icon: "gate", name: "Brick sample", text: "A small Mughal-era brick. Note attached: “Akbar's rebuilding, 1566.”" },
        { icon: "gate", name: "Gate sketch", text: "A drawing of a huge gate flanked by semi-octagonal towers, dated 1674 — the reign of Aurangzeb." },
        { icon: "tile", name: "Glazed fragment", text: "A tile mosaic piece labelled “Picture Wall” — tilework and frescoes from the reigns of Jahangir and Shah Jahan.", hidden: true },
      ],
    },
    {
      title: "The Sky-Coloured Tiles",
      brief: "A merchant's ledger and a box of tiles were found together in a donation. Where do they come from?",
      answer: "wazir-khan-mosque",
      riddle: "A royal physician turned governor commissioned me near Delhi Gate. My walls are dressed in glazed tiles. What am I?",
      evidence: [
        { icon: "tile", name: "Cobalt tile", text: "A glazed tile in cobalt and turquoise — kashi kari, the tile mosaic Lahore is famous for." },
        { icon: "book", name: "Merchant's ledger", text: "Rent records for shops built into a mosque complex, intended to pay for its upkeep." },
        { icon: "map", name: "Walled City map", text: "A map with a circle drawn just inside Delhi Gate, on the old royal route through the city." },
        { icon: "scroll", name: "Signed letter", text: "A letter signed “Hakim Ilm-ud-din Ansari” — known as Wazir Khan, governor of Lahore under Shah Jahan.", hidden: true },
      ],
    },
    {
      title: "The Four Hundred Fountains",
      brief: "A rusted fountain nozzle and a garden plan were left on the archive desk. Which site do they describe?",
      answer: "shalimar-gardens",
      riddle: "Built for Shah Jahan in 1641–42, I step down in three terraces and am said to have 410 fountains. What am I?",
      evidence: [
        { icon: "garden", name: "Fountain nozzle", text: "A copper nozzle tagged “one of 410” — the number of fountains most often cited for this garden." },
        { icon: "map", name: "Garden plan", text: "A plan of a garden divided into four parts by water channels — the Persian charbagh layout." },
        { icon: "puzzle", name: "Section drawing", text: "A cross-section showing three terraces descending one below another." },
        { icon: "stamp", name: "Terrace label", text: "A brass label reading “Farah Bakhsh” — the traditional name of one terrace.", hidden: true },
      ],
    },
    {
      title: "The Emperor's Courtyard",
      brief: "A sandstone sample and a visitor count arrived with no paperwork. Name the monument.",
      answer: "badshahi-mosque",
      riddle: "Completed in 1673 for Aurangzeb, I was the world's largest mosque for over three centuries. What am I?",
      evidence: [
        { icon: "dome", name: "Sandstone chip", text: "A chip of red sandstone with white marble inlay along one edge." },
        { icon: "book", name: "Capacity note", text: "A note: “Courtyard capacity — around 100,000 worshippers.”" },
        { icon: "scroll", name: "Dated plaque", text: "A rubbing from a plaque: construction 1671 to 1673." },
        { icon: "trophy", name: "Record card", text: "An index card: “World's largest mosque until 1986.”", hidden: true },
      ],
    },
    {
      title: "The Architect's Plaque",
      brief: "A rolled drawing and a stone fragment were found in a closed drafting office. Identify the monument they belong to.",
      answer: "minar-e-pakistan",
      riddle: "Designed by Nasreddin Murat-Khan and completed in 1968, I mark the ground where a resolution was presented in March 1940. What am I?",
      evidence: [
        { icon: "map", name: "Rolled drawing", text: "An elevation of a tapering tower with galleries, signed by the architect Nasreddin Murat-Khan." },
        { icon: "scroll", name: "Plaque rubbing", text: "A rubbing of a text beginning with the Lahore Resolution of 1940." },
        { icon: "book", name: "Works register", text: "A register entry: construction 1960 — completion 1968." },
        { icon: "garden", name: "Petal stone", text: "A curved white slab from a raised, flower-like platform.", hidden: true },
      ],
    },
  ];


  const RANKS = {
    constable: { label: "Constable", cases: 3, options: 4, time: 0, needAll: false, desc: "3 cases · 4 suspects · no clock" },
    inspector: { label: "Inspector", cases: 4, options: 6, time: 120, needAll: false, desc: "4 cases · 6 suspects · 2 minutes per case" },
    chief: { label: "Chief Inspector", cases: 5, options: 6, time: 75, needAll: true, desc: "5 cases · all evidence required · 75 s per case" },
  };
  const ALL = ["lahore-fort", "wazir-khan-mosque", "shalimar-gardens", "badshahi-mosque", "minar-e-pakistan", "iqbal-park"];

  LL.Games.register("heritage-detective", {
    mount(root, api) {
      let rank = "inspector", order, caseIdx, rep, solved, collected, totalScore, clock, timer = null;
      const $ = (s) => root.querySelector(s);
      const R = () => RANKS[rank];

      function pill() {
        const t = R().time ? `<span class="meta-pill ${clock <= 15 ? "is-danger" : ""}">${LL.Icons.get("hourglass")} ${Math.max(0, clock)}s</span>` : "";
        api.setMeta(`${t}<span class="meta-pill">Case ${Math.min(caseIdx + 1, order.length)}/${order.length}</span><span class="meta-pill">${"●".repeat(rep)}${"○".repeat(3 - rep)}</span>`);
      }

      function intro() {
        clearInterval(timer);
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-intro g-intro--photo">
          <div class="g-intro__media" data-ph></div>
          <div class="g-intro__body">
            <span class="tag tag--fiction">Fictional case files</span> <span class="tag tag--real">Documented evidence</span>
            <h2>Heritage Detective</h2>
            <p>The Lahore Heritage Archive has received crates of unlabelled objects. Search each evidence table by torchlight, read the riddle and name the monument before the trail goes cold.</p>
            <ul class="g-rules"><li>Move your torch over the dark table to find evidence. One item in every case is hidden.</li><li>You need 3 pieces of evidence to accuse — Chief Inspectors need all 4.</li><li>Wrong accusations cost reputation; lose all three marks and the archive closes.</li><li>Score: evidence, time remaining and reputation.</li></ul>
            <div class="seg seg--stack" role="radiogroup" aria-label="Rank">${Object.entries(RANKS).map(([k, v]) => `<button role="radio" aria-checked="${k === rank}" data-rank="${k}"><b>${v.label}</b><small>${v.desc}${api.levelBest(k) ? ` · best ${api.levelBest(k)}` : ""}</small></button>`).join("")}</div>
            <button class="btn btn--gold btn--lg" data-start>Open the first case</button>
          </div></div></div>`;
        $("[data-ph]").appendChild(api.photo("wazir-khan-mosque", { width: 1200, start: 2, label: false }));
        api.setMeta("");
      }

      function start() { order = LL.UI.shuffle(CASES).slice(0, R().cases); caseIdx = 0; rep = 3; solved = 0; totalScore = 0; showCase(); }

      function layout(n) {
        const spots = LL.UI.shuffle([[16, 24], [44, 18], [76, 28], [22, 70], [56, 62], [84, 72], [36, 44], [66, 84]]);
        return Array.from({ length: n }, (_, i) => spots[i]);
      }

      function showCase() {
        const c = order[caseIdx];
        collected = new Set();
        clearInterval(timer);
        clock = R().time;
        const pos = layout(c.evidence.length);
        const opts = LL.UI.shuffle(ALL.filter((x) => x !== c.answer)).slice(0, R().options - 1).concat(c.answer);
        const need = R().needAll ? c.evidence.length : 3;
        root.innerHTML = `<div class="g-wrap det">
          <div class="g-panel det__file">
            <p class="eyebrow">Case file ${caseIdx + 1} of ${order.length}</p><h2>${LL.UI.esc(c.title)}</h2>
            <p>${LL.UI.esc(c.brief)}</p>
            <h3>Evidence <span id="det-n">0</span>/${c.evidence.length}</h3>
            <ul class="det__list" id="det-list"></ul>
          </div>
          <div class="det__board" id="det-board" aria-label="Evidence table. Search with your torch or Tab through items.">
            ${c.evidence.map((ev, i) => `<button class="evidence ${ev.hidden ? "is-hidden" : ""}" style="left:${pos[i][0]}%;top:${pos[i][1]}%" data-ev="${i}" aria-label="Examine ${LL.UI.esc(ev.name)}">${LL.Icons.get(ev.icon)}</button>`).join("")}
            <div class="det__torch" id="det-torch"></div>
            <p class="det__tip">Move to search · select an object to examine it</p>
          </div>
          <div class="g-panel det__accuse" id="det-accuse">
            <h3>The riddle</h3><p class="det__riddle">${LL.UI.esc(c.riddle)}</p>
            <div class="answer-list det__opts">${LL.UI.shuffle(opts).map((id) => `<button class="answer" data-acc="${id}" disabled>${LL.UI.esc(api.location(id).name)}</button>`).join("")}</div>
            <p class="muted small" id="det-lock">${LL.Icons.get("lock")} Collect ${need === c.evidence.length ? "all" : "at least " + need} pieces of evidence to make an accusation.</p>
          </div></div>`;
        const board = $("#det-board"), torch = $("#det-torch");
        const move = (x, y) => { const r = board.getBoundingClientRect(); torch.style.setProperty("--x", x - r.left + "px"); torch.style.setProperty("--y", y - r.top + "px"); };
        board.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
        board.addEventListener("pointerdown", (e) => move(e.clientX, e.clientY));
        board.addEventListener("focusin", (e) => { const b = e.target.getBoundingClientRect(); move(b.left + b.width / 2, b.top + b.height / 2); });
        const r0 = board.getBoundingClientRect(); move(r0.left + r0.width / 2, r0.top + r0.height / 2);
        if (R().time) timer = setInterval(() => { clock--; pill(); if (clock <= 5 && clock > 0) api.sound("tick"); if (clock <= 0) { clearInterval(timer); coldCase(); } }, 1000);
        pill();
      }

      function examine(i) {
        const c = order[caseIdx], ev = c.evidence[i];
        if (collected.has(i)) return;
        collected.add(i);
        root.querySelector(`[data-ev="${i}"]`).classList.add("is-collected");
        api.sound(ev.hidden ? "unlock" : "page");
        if (ev.hidden) LL.UI.toast("Hidden evidence found", ev.name);
        $("#det-list").insertAdjacentHTML("beforeend", `<li class="pop"><span>${LL.Icons.get(ev.icon)}</span><div><b>${LL.UI.esc(ev.name)}</b><small>${LL.UI.esc(ev.text)}</small></div></li>`);
        $("#det-n").textContent = collected.size;
        const need = R().needAll ? c.evidence.length : 3;
        if (collected.size >= need) {
          root.querySelectorAll("[data-acc]").forEach((b) => (b.disabled = false));
          $("#det-lock").textContent = "You may now name the monument.";
        }
      }

      function closeCase(id, pts) {
        const loc = api.location(id);
        root.querySelector("#det-accuse").innerHTML = `<div class="det__reveal"><div data-reveal></div><div>
          <p class="eyebrow">Case closed</p><h3>${LL.UI.esc(loc.name)}</h3><p class="muted small">${LL.UI.esc(loc.facts[0])}</p>
          <p><b style="color:var(--gold-2)">+${pts}</b> points</p>
          <button class="btn btn--gold btn--sm" data-next>${caseIdx + 1 < order.length ? "Next case →" : "Close the archive"}</button></div></div>`;
        root.querySelector("[data-reveal]").appendChild(api.photo(id, { width: 600, label: false }));
      }

      function accuse(id, btn) {
        const c = order[caseIdx];
        if (id === c.answer) {
          clearInterval(timer);
          btn.classList.add("is-correct");
          root.querySelectorAll("[data-acc]").forEach((b) => (b.disabled = true));
          api.sound("success");
          const pts = 200 + collected.size * 25 + (R().time ? clock * 3 : 60) + rep * 30;
          totalScore += pts; solved++;
          LL.Game.award(25, `Case closed: ${c.title}`);
          setTimeout(() => closeCase(id, pts), 500);
        } else {
          btn.classList.add("is-wrong", "shake"); btn.disabled = true;
          api.sound("fail");
          rep--; pill();
          if (rep <= 0) { clearInterval(timer); setTimeout(() => finish(), 700); }
        }
      }

      function coldCase() {
        api.sound("fail");
        rep--; pill();
        root.querySelectorAll("[data-acc]").forEach((b) => (b.disabled = true));
        root.querySelector("#det-accuse").insertAdjacentHTML("beforeend", `<div class="det__cold"><p><b>The trail went cold.</b> The answer was ${LL.UI.esc(api.location(order[caseIdx].answer).name)}. You lose a reputation mark.</p>
          <button class="btn btn--ghost btn--sm" data-next>${rep > 0 && caseIdx + 1 < order.length ? "Next case →" : "Close the archive"}</button></div>`);
      }

      function finish() {
        clearInterval(timer);
        const ok = solved === order.length;
        const title = ok ? (rank === "chief" ? "Chief Inspector of the Archive" : rank === "inspector" ? "Archive Inspector" : "Archive Constable") : "Junior Investigator";
        root.innerHTML = `<div class="g-wrap g-center"><div class="g-panel g-result">
          <p class="eyebrow">${ok ? "All cases closed" : "The archive is closed"}</p>
          <h2>${ok ? title : "Some cases remain open"}</h2>
          <p class="g-result__lead">${ok ? `Every object is labelled and returned to its monument, with ${rep} reputation mark${rep === 1 ? "" : "s"} intact.` : `You closed ${solved} of ${order.length} cases. Study the evidence and the site dossiers, then reopen the files.`}</p>
          <dl class="g-stats"><div><dt>Cases</dt><dd>${solved}/${order.length}</dd></div><div><dt>Reputation</dt><dd>${rep}/3</dd></div><div><dt>Rank</dt><dd>${R().label}</dd></div><div><dt>Score</dt><dd>${totalScore}</dd></div></dl>
          <div class="g-btns"><button class="btn btn--gold" data-restart>Investigate again</button><button class="btn btn--ghost" data-ranks>Change rank</button><button class="btn btn--ghost" data-exit>Games Center</button></div></div></div>`;
        api.setMeta("");
        if (ok) {
          api.burst(); api.sound("level");
          api.saveLevel(rank, totalScore);
          if (rank === "chief") api.flag("detectiveExpert");
          api.complete({ score: totalScore, xp: { constable: 90, inspector: 120, chief: 170 }[rank], label: `Heritage Detective — ${title}` });
        } else api.record(totalScore);
      }

      root.addEventListener("click", (e) => {
        const rk = e.target.closest("[data-rank]");
        if (rk) { rank = rk.dataset.rank; root.querySelectorAll("[data-rank]").forEach((b) => b.setAttribute("aria-checked", String(b === rk))); api.sound("click"); return; }
        if (e.target.closest("[data-start]") || e.target.closest("[data-restart]")) { api.sound("open"); return start(); }
        if (e.target.closest("[data-ranks]")) return intro();
        const ev = e.target.closest("[data-ev]"); if (ev) return examine(+ev.dataset.ev);
        const acc = e.target.closest("[data-acc]"); if (acc && !acc.disabled) return accuse(acc.dataset.acc, acc);
        if (e.target.closest("[data-next]")) { caseIdx++; return caseIdx < order.length && rep > 0 ? showCase() : finish(); }
        if (e.target.closest("[data-exit]")) return api.exit();
      });
      intro();
      return () => clearInterval(timer);
    },
  });
})();
