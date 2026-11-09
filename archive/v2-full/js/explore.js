/* =========================================================================
   LAHORE LEGACY — EXPLORE LAHORE
   Location cards, filters and the site dossier (overview · history &
   architecture · timeline · gallery · missions · sources).
   ========================================================================= */

window.LL = window.LL || {};

LL.Explore = (function () {
  const { esc, media } = LL.UI;
  let filter = "all";

  function progressFor(locId) {
    const ms = LL.Game.locationMissions(locId);
    const n = ms.filter((m) => LL.Game.done(m.id)).length;
    return { done: n, total: ms.length, pct: n / ms.length };
  }

  function card(loc) {
    const p = LL.Game.profile;
    const prog = progressFor(loc.id);
    const el = document.createElement("article");
    el.className = "loc-card reveal";
    el.dataset.id = loc.id;
    el.appendChild(media(loc.id, { width: 900, label: false }));
    if (p.stamps[loc.id]) el.insertAdjacentHTML("afterbegin", `<div class="loc-card__stamp" aria-label="Passport stamped">Stamped</div>`);
    el.insertAdjacentHTML("beforeend", `
      <div class="loc-card__body">
        <span class="loc-card__era">${esc(loc.era)}</span>
        <h3>${esc(loc.name)}</h3>
        <span class="loc-card__urdu" lang="ur">${esc(loc.urdu)}</span>
        <p>${esc(loc.tagline)} — ${esc(loc.area)}.</p>
        <div class="loc-card__progress"><span>${prog.done}/${prog.total} missions</span><div class="progress"><i style="width:${prog.pct * 100}%"></i></div></div>
        <div class="loc-card__actions">
          <button class="btn btn--gold btn--sm" data-open="${loc.id}">Open dossier</button>
          <button class="btn btn--ghost btn--sm" data-pano="${loc.id}">Site viewer</button>
        </div>
      </div>`);
    return el;
  }

  function render() {
    const grid = document.getElementById("location-grid");
    const p = LL.Game.profile;
    grid.innerHTML = "";
    LL.LOCATIONS.filter((l) => {
      if (filter === "all") return true;
      if (filter === "stamped") return !!p.stamps[l.id];
      if (filter === "unstamped") return !p.stamps[l.id];
      if (filter === "Mughal") return l.era.startsWith("Mughal");
      if (filter === "Modern") return !l.era.startsWith("Mughal");
      return true;
    }).forEach((l) => grid.appendChild(card(l)));
    if (!grid.children.length) grid.innerHTML = `<p class="muted" style="grid-column:1/-1;text-align:center">No sites match this filter yet.</p>`;
    LL.FX.observeReveals(grid);
  }

  function renderTrail() {
    const trail = document.getElementById("home-trail");
    if (!trail) return;
    const p = LL.Game.profile;
    trail.innerHTML = "";
    LL.LOCATIONS.forEach((l) => {
      const a = document.createElement("a");
      a.href = `#explore/${l.id}`;
      a.className = "trail-item reveal";
      a.appendChild(media(l.id, { width: 600, label: false, start: 1 }));
      a.insertAdjacentHTML("beforeend", `<span>${esc(l.name)}</span>${p.stamps[l.id] ? '<b class="stamp-dot" title="Stamped">Stamped</b>' : ""}`);
      trail.appendChild(a);
    });
    LL.FX.observeReveals(trail);
  }

  /* ---------- Dossier ---------- */
  function open(locId) {
    const loc = LL.LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;
    LL.Game.explore(locId);
    const p = LL.Game.profile;
    const revealed = p.facts[locId] || [];
    const missions = LL.Game.locationMissions(locId);
    const stampQ = LL.TRIVIA.filter((t) => t.loc === locId);
    const q = stampQ[Math.floor(Math.random() * stampQ.length)];
    const cfg = LL.ASSETS.locations[locId];

    const wrap = document.createElement("div");
    wrap.className = "dossier";
    const hero = document.createElement("div");
    hero.className = "dossier__hero";
    const m = media(locId, { width: 2000, eager: true, credit: true });
    m.classList.add("dossier__media");
    hero.appendChild(m);
    wrap.appendChild(hero);

    const tabs = [["overview", "Overview"], ["history", "History & architecture"], ["timeline", "Timeline"], ["gallery", "Gallery"], ["missions", "Missions"], ["sources", "Sources"]];
    wrap.insertAdjacentHTML("beforeend", `
      <div class="dossier__head">
        <div><p class="eyebrow">${esc(loc.era)}</p><h2>${esc(loc.name)}</h2></div>
        <span class="urdu" lang="ur" style="font-size:1.6rem;color:var(--sand)">${esc(loc.urdu)}</span>
      </div>
      <div class="dossier__tabs" role="tablist">${tabs.map(([k, l], i) => `<button role="tab" data-tab="${k}" aria-selected="${i === 0}">${l}</button>`).join("")}</div>

      <section class="dossier__pane" data-pane="overview">
        <div class="dossier__meta">
          <div class="meta-box"><small>Location</small><span>${esc(loc.area)}</span></div>
          <div class="meta-box"><small>Coordinates</small><span>${esc(loc.coords)}</span></div>
          <div class="meta-box"><small>Period</small><span>${esc(loc.era)}</span></div>
        </div>
        <div class="dossier__grid">
          <div>
            <p class="dossier__overview">${esc(loc.overview)}</p>
            <div class="dossier__links">
              <button class="btn btn--gold btn--sm" data-pano="${loc.id}">Open site viewer</button>
              ${cfg.panorama && cfg.panorama.tour360 ? `<a class="btn btn--ghost btn--sm" href="${cfg.panorama.tour360}" target="_blank" rel="noopener">Real 360° tour ↗</a>` : ""}
            </div>
          </div>
          <div>
            <h3>Facts <small>tap to reveal · +5 XP each</small></h3>
            <div class="fact-list">
              ${loc.facts.map((f, i) => `<button class="fact ${revealed.includes(i) ? "is-revealed" : ""}" data-fact="${i}" aria-label="Reveal fact ${i + 1}"><span class="fact__num">${i + 1}</span><span class="fact__text">${esc(f)}</span></button>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="dossier__pane prose" data-pane="history" hidden>
        <div class="dossier__grid">
          <div><h3>Historical significance</h3><p>${esc(loc.significance || "")}</p></div>
          <div><h3>Architecture</h3><p>${esc(loc.architecture || "")}</p></div>
        </div>
      </section>

      <section class="dossier__pane" data-pane="timeline" hidden>
        <h3>Key dates</h3>
        <ol class="timeline">${(loc.timeline || []).map(([d, t]) => `<li><b>${esc(d)}</b><span>${esc(t)}</span></li>`).join("")}</ol>
        <p class="muted small">Dates follow widely documented sources; where sources vary, the most commonly cited figure is given.</p>
      </section>

      <section class="dossier__pane" data-pane="gallery" hidden>
        <div class="gallery" data-gallery></div>
        <p class="muted small" style="margin-top:.8rem">Select a photograph to view it full screen with its credit.</p>
      </section>

      <section class="dossier__pane" data-pane="missions" hidden>
        <div class="dossier__grid">
          <div>
            <h3>Site missions</h3>
            <ul class="quest-list" data-missions>
              ${missions.map((ms) => `<li class="${LL.Game.done(ms.id) ? "is-done" : ""}" data-m="${ms.id}"><span class="check">✓</span>${esc(ms.label)}<span class="xp">+${ms.xp}</span></li>`).join("")}
            </ul>
            <h3 style="margin-top:1.6rem">Related games</h3>
            <div class="dossier__links">
              ${loc.games.map((g) => { const meta = LL.GAMES.find((x) => x.id === g); return `<button class="btn btn--quiet btn--sm" data-game="${g}">${LL.Icons.get(meta.icon)} ${esc(meta.name)}</button>`; }).join("")}
            </div>
          </div>
          <div>
            <h3>Stamp test</h3>
            <div class="stamp-test" data-stamp>
              ${p.stamps[locId]
                ? `<p>Passport stamped on ${esc(p.stamps[locId])}.</p>`
                : `<p>${esc(q.q)}</p><div class="answer-list">${LL.UI.shuffle(q.a.map((a, i) => ({ a, i }))).map((o) => `<button class="answer" data-ans="${o.i}">${esc(o.a)}</button>`).join("")}</div>`}
            </div>
          </div>
        </div>
      </section>

      <section class="dossier__pane" data-pane="sources" hidden>
        <h3>References</h3>
        <ul class="sources">${(loc.sources || []).map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul>
        <p class="muted small" style="margin-top:1rem">Photographs: Wikimedia Commons contributors — see each image's credit line, or the full register in the footer.</p>
      </section>`);

    const body = LL.UI.openModal(wrap, { label: loc.name });

    // gallery (lazy)
    let galleryBuilt = false;
    function buildGallery() {
      if (galleryBuilt) return; galleryBuilt = true;
      const g = body.querySelector("[data-gallery]");
      (cfg.gallery || []).forEach((it, i) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Open photograph: " + it.caption);
        const mm = media(locId, { width: 700, start: i, label: false });
        b.appendChild(mm);
        b.insertAdjacentHTML("beforeend", `<figcaption>${esc(it.caption)}</figcaption>`);
        b.addEventListener("click", () => LL.UI.lightbox(locId, i));
        g.appendChild(b);
      });
    }

    body.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab]");
      if (tab) {
        body.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        body.querySelectorAll("[data-pane]").forEach((pn) => (pn.hidden = pn.dataset.pane !== tab.dataset.tab));
        if (tab.dataset.tab === "gallery") buildGallery();
        LL.Audio.play("page");
        return;
      }
      const f = e.target.closest("[data-fact]");
      if (f && !f.classList.contains("is-revealed")) {
        f.classList.add("is-revealed");
        LL.Audio.play("page");
        LL.Game.revealFact(locId, +f.dataset.fact);
        refreshMissions(body, locId);
        return;
      }
      const ans = e.target.closest("[data-ans]");
      if (ans && !ans.disabled) {
        const correct = +ans.dataset.ans === q.c;
        body.querySelectorAll("[data-ans]").forEach((b) => { b.disabled = true; if (+b.dataset.ans === q.c) b.classList.add("is-correct"); });
        if (correct) {
          LL.Audio.play("stamp");
          setTimeout(() => {
            LL.Game.stamp(locId);
            body.querySelector("[data-stamp]").innerHTML = `<p class="stamp-in" style="color:var(--sand)">Passport stamped — ${esc(loc.name)} has been added to your passport.</p>`;
            refreshMissions(body, locId);
          }, 500);
        } else {
          ans.classList.add("is-wrong", "shake");
          LL.Audio.play("fail");
          const box = body.querySelector("[data-stamp]");
          box.insertAdjacentHTML("beforeend", `<p class="muted" style="margin:.8rem 0 .6rem;font-size:.9rem">Not quite — read the dossier and try again.</p><button class="btn btn--ghost btn--sm" data-retry>Try another question</button>`);
        }
        return;
      }
      if (e.target.closest("[data-retry]")) { LL.UI.closeModal(); setTimeout(() => open(locId), 120); return; }
      const g = e.target.closest("[data-game]");
      if (g) { LL.UI.closeModal(); LL.Nav.go("games", g.dataset.game); return; }
      const pn = e.target.closest("[data-pano]");
      if (pn) { LL.UI.closeModal(); LL.Nav.go("panorama", pn.dataset.pano); return; }
      if (e.target.closest(".dossier__media")) LL.UI.lightbox(locId, 0);
    });
  }

  function refreshMissions(body, locId) {
    body.querySelectorAll("[data-m]").forEach((li) => li.classList.toggle("is-done", LL.Game.done(li.dataset.m)));
  }

  function init() {
    document.querySelector(".view--explore .filter-bar").addEventListener("click", (e) => {
      const c = e.target.closest("[data-filter]");
      if (!c) return;
      filter = c.dataset.filter;
      document.querySelectorAll(".view--explore .chip").forEach((x) => x.classList.toggle("is-active", x === c));
      LL.Audio.play("click");
      render();
    });
    document.getElementById("location-grid").addEventListener("click", (e) => {
      const o = e.target.closest("[data-open]");
      if (o) return LL.Nav.go("explore", o.dataset.open);
      const pn = e.target.closest("[data-pano]");
      if (pn) return LL.Nav.go("panorama", pn.dataset.pano);
      const c = e.target.closest(".loc-card");
      if (c && !e.target.closest("button")) LL.Nav.go("explore", c.dataset.id);
    });
    document.addEventListener("ll:modal-closed", () => {
      if (LL.Nav.current === "explore" && LL.Nav.parse().param) history.replaceState(null, "", "#explore");
      if (LL.Nav.current === "explore") render();
      renderTrail();
    });
    LL.Nav.on("explore", (param) => {
      render();
      if (param) open(param);
    });
  }

  return { init, render, renderTrail, open, progressFor };
})();
