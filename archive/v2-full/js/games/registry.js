/* =========================================================================
   LAHORE LEGACY — GAMES CENTER & GAME STAGE
   Each game registers itself with:
     LL.Games.register("id", { mount(root, api) { ...; return cleanupFn; } })
   api = { setMeta(html), complete({score, xp, label}), played(), exit(),
           location(id), sound(name), celebrate(...) }
   ========================================================================= */

window.LL = window.LL || {};

LL.Games = (function () {
  const { esc } = LL.UI;
  const registry = {};
  let cleanup = null, activeId = null;

  function register(id, def) { registry[id] = def; }

  const ART = { "lost-lahore": ["walled-city", 0], "heritage-detective": ["wazir-khan-mosque", 2], "mystery-chamber": ["lahore-fort", 3], "rebuild-lahore": ["badshahi-mosque", 1], "heritage-quest": ["shalimar-gardens", 0], "history-rush": ["minar-e-pakistan", 0] };

  function renderGrid() {
    const grid = document.getElementById("game-grid");
    const p = LL.Game.profile;
    grid.innerHTML = LL.GAMES.map((g) => {
      const s = p.games[g.id];
      return `<article class="game-card reveal" data-art="${g.id}">
        <div class="game-card__art"><span class="game-card__icon" aria-hidden="true">${LL.Icons.get(g.icon)}</span></div>
        ${s && s.completed ? `<span class="tag tag--gold game-card__done">Completed ×${s.completed}</span>` : ""}
        <div class="game-card__body">
          <span class="game-card__genre">${esc(g.genre)}</span>
          <h3>${esc(g.name)}</h3>
          <p>${esc(g.desc)}</p>
          <div class="game-card__meta"><span>${g.time}</span><span>${g.xp ? "Up to +" + g.xp + " XP" : "XP = score ÷ 10"}</span>${s && s.best ? `<span>Best ${s.best}</span>` : ""}</div>
          <button class="btn btn--gold" data-play="${g.id}">Play</button>
        </div></article>`;
    }).join("");
    grid.querySelectorAll("[data-art]").forEach((card) => {
      const [key, start] = ART[card.dataset.art];
      card.querySelector(".game-card__art").prepend(LL.UI.media(key, { width: 900, start, label: false }));
    });
    LL.FX.observeReveals(grid);
  }

  function open(id) {
    const def = registry[id], meta = LL.GAMES.find((g) => g.id === id);
    if (!def || !meta) return;
    close(true);
    activeId = id;
    const stage = document.getElementById("game-stage");
    // fresh root node per game so event listeners never leak between games
    const oldRoot = document.getElementById("game-root");
    const root = oldRoot.cloneNode(false);
    oldRoot.replaceWith(root);
    document.getElementById("game-stage-title").innerHTML = `${LL.Icons.get(meta.icon)} ${esc(meta.name)}`;
    document.getElementById("game-stage-meta").innerHTML = "";
    root.innerHTML = "";
    root.scrollTop = 0;
    stage.hidden = false;
    document.body.classList.add("is-locked");
    LL.Game.playedGame(id);
    LL.Audio.play("unlock");
    const api = {
      setMeta: (html) => (document.getElementById("game-stage-meta").innerHTML = html),
      complete: (o) => LL.Game.completeGame(id, o),
      record: (score) => LL.Game.recordScore(id, score),
      exit: () => LL.Nav.go("games"),
      sound: (n) => LL.Audio.play(n),
      burst: () => LL.FX.burst(),
      location: (lid) => LL.LOCATIONS.find((l) => l.id === lid),
      restart: () => open(id),
      photo: (key, opts) => LL.UI.media(key, opts),
      flag: (name, v) => LL.Game.flag(name, v),
      levelBest: (k) => ((LL.Game.profile.games[id] || {}).levels || {})[k] || 0,
      saveLevel: (k, v) => { const g = (LL.Game.profile.games[id] = LL.Game.profile.games[id] || { completed: 0, best: 0, plays: 0 }); g.levels = g.levels || {}; g.levels[k] = Math.max(g.levels[k] || 0, v); LL.Game.persist(); LL.Game.emit(); },
    };
    try { cleanup = def.mount(root, api) || null; }
    catch (err) { console.error(err); root.innerHTML = `<div class="g-panel"><p>Sorry, this game failed to start.</p></div>`; }
    setTimeout(() => document.getElementById("game-exit").focus(), 60);
  }

  function close(silent) {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    activeId = null;
    const stage = document.getElementById("game-stage");
    if (!stage.hidden) {
      stage.hidden = true;
      document.body.classList.remove("is-locked");
      if (!silent) renderGrid();
    }
  }

  function init() {
    document.getElementById("game-grid").addEventListener("click", (e) => {
      const b = e.target.closest("[data-play]");
      if (b) LL.Nav.go("games", b.dataset.play);
    });
    document.getElementById("game-exit").addEventListener("click", () => LL.Nav.go("games"));
    LL.Nav.on("games", (param) => {
      if (param && registry[param]) { if (activeId !== param) open(param); }
      else { close(); renderGrid(); }
    });
    // leaving the games view closes the stage
    window.addEventListener("hashchange", () => { if (LL.Nav.parse().view !== "games") close(); });
  }

  return { register, init, open, close, renderGrid };
})();
