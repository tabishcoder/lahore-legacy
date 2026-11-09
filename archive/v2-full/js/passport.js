/* =========================================================================
   LAHORE LEGACY — PASSPORT, HUD, DAILY CHALLENGE & QUEST TRACKER
   ========================================================================= */

window.LL = window.LL || {};

LL.Passport = (function () {
  const { esc } = LL.UI;
  const CRESTS = ["#C9B89A", "#B28A45", "#8E5A63", "#6F8CA8", "#7FA18A", "#D9C7A7", "#A8786B", "#9AA3AD"];

  /* Monogram avatar (replaces v1 emoji; the old emoji field is kept but unused). */
  function crestColor(p) { return p.crest || CRESTS[(p.name || "T").charCodeAt(0) % CRESTS.length]; }
  function monogram(p, cls = "monogram") { return `<span class="${cls}" style="--av:${crestColor(p)}">${esc((p.name || "T").trim().charAt(0).toUpperCase() || "T")}</span>`; }

  /* ---------- HUD ---------- */
  function hud() {
    const p = LL.Game.profile, lv = LL.Game.levelFor(p.xp);
    LL.FX.countUp(document.getElementById("hud-xp"), p.xp);
    document.getElementById("hud-level").textContent = lv.name;
    document.getElementById("hud-bar").style.width = lv.pct * 100 + "%";
    const av = document.getElementById("hud-avatar");
    av.textContent = (p.name || "T").trim().charAt(0).toUpperCase();
    av.style.setProperty("--av", crestColor(p));
    document.querySelector("#hud-streak b").textContent = p.streak.count;
    document.getElementById("hud-streak").title = `${p.streak.count}-day streak (best ${p.streak.best || p.streak.count})`;
  }

  /* ---------- Daily challenge card ---------- */
  function daily() {
    const el = document.getElementById("daily-card");
    if (!el) return;
    const q = LL.Game.dailyQuestion();
    const p = LL.Game.profile;
    const head = `<p class="eyebrow">Daily challenge · ${p.streak.count}-day streak</p><h3>Today's question</h3>`;
    if (LL.Game.dailyDone()) {
      el.innerHTML = `${head}<p class="daily-q">${esc(q.q)}</p><p>Answer: <strong style="color:var(--gold-2)">${esc(q.a[q.c])}</strong></p>
        ${q.x ? `<p class="muted">${esc(q.x)}</p>` : ""}
        <p class="muted small">${p.daily.correct ? "Correct. " : ""}Return tomorrow to extend your streak — the streak bonus grows to +35 XP.</p>`;
      return;
    }
    const opts = LL.UI.shuffle(q.a.map((a, i) => ({ a, i })));
    el.innerHTML = `${head}<p class="daily-q">${esc(q.q)}</p>
      <div class="answer-list">${opts.map((o) => `<button class="answer" data-daily="${o.i}">${esc(o.a)}</button>`).join("")}</div>
      <p class="muted small" style="margin:.9rem 0 0">Correct answer: +50 XP, plus a ${Math.min(p.streak.count, 7) * 5} XP streak bonus.</p>`;
    el.onclick = (e) => {
      const b = e.target.closest("[data-daily]");
      if (!b || b.disabled) return;
      const ok = +b.dataset.daily === q.c;
      el.querySelectorAll("[data-daily]").forEach((x) => { x.disabled = true; if (+x.dataset.daily === q.c) x.classList.add("is-correct"); });
      if (!ok) { b.classList.add("is-wrong", "shake"); LL.Audio.play("fail"); } else LL.Audio.play("success");
      LL.Game.completeDaily(ok);
      setTimeout(daily, 1800);
    };
  }

  /* ---------- Quest tracker ---------- */
  function nextQuests(limit = 5) {
    const out = [];
    const p = LL.Game.profile;
    (LL.EXPEDITIONS || []).forEach((e) => { if (LL.Game.expeditionState(e) === "open") out.push({ id: e.id, label: `Expedition — ${e.name}`, xp: e.xp, href: "#passport" }); });
    LL.GAMES.forEach((g) => { if (!(p.games[g.id] && p.games[g.id].completed)) out.push({ id: "game:" + g.id, label: `Complete ${g.name}`, xp: g.xp || "★", href: "#games/" + g.id }); });
    for (const loc of LL.LOCATIONS) for (const m of LL.Game.locationMissions(loc.id)) if (!LL.Game.done(m.id)) out.push({ ...m, sub: loc.name, href: "#explore/" + loc.id });
    // interleave: one expedition, then alternate site missions and games
    const ex = out.filter((x) => x.id.startsWith("exp-")), gm = out.filter((x) => x.id.startsWith("game:")), st = out.filter((x) => !x.id.startsWith("exp-") && !x.id.startsWith("game:"));
    const mix = ex.slice(0, 1);
    while (mix.length < limit && (gm.length || st.length)) { if (st.length) mix.push(st.shift()); if (gm.length && mix.length < limit) mix.push(gm.shift()); }
    return mix.slice(0, limit);
  }

  function questCard() {
    const el = document.getElementById("quest-card");
    if (!el) return;
    const qs = nextQuests(5);
    const p = LL.Game.profile;
    const total = LL.LOCATIONS.length * 5, done = Object.keys(p.missions).filter((k) => k.includes(":")).length;
    el.innerHTML = `<p class="eyebrow">Quest tracker</p><h3>Your next missions</h3>
      <div class="loc-card__progress"><span>${done}/${total} site missions</span><div class="progress"><i style="width:${(done / total) * 100}%"></i></div></div>
      <ul class="quest-list">${qs.map((q) => `<li><span class="check"></span><a href="${q.href}">${esc(q.label)}${q.sub ? ` · <span class="muted">${esc(q.sub)}</span>` : ""}</a><span class="xp">+${q.xp}</span></li>`).join("") || "<li>Every mission complete — a true Lahore Legend.</li>"}</ul>`;
  }

  /* ---------- Passport view ---------- */
  function render() {
    const root = document.getElementById("passport");
    const p = LL.Game.profile, lv = LL.Game.levelFor(p.xp);
    const circ = 2 * Math.PI * 70;
    const gamesDone = Object.values(p.games).filter((g) => g.completed).length;
    const disc = LL.Game.discoveryCount(p), discTotal = LL.Game.discoveryTotal();
    const stamps = LL.LOCATIONS.map((l, i) => {
      const s = p.stamps[l.id];
      return `<div class="stamp ${s ? "is-earned" : ""}" style="--stamp-c:${l.stampColor};--rot:${[-9, 6, -4, 8, -7, 5][i]}deg">
        <b>${esc(l.name.replace(/ \(.*\)/, ""))}</b><span class="urdu" lang="ur">${esc(l.urdu)}</span><small>${s ? esc(s) : "Not yet stamped"}</small></div>`;
    }).join("");
    const ach = LL.ACHIEVEMENTS.map((a) => `<div class="ach ${p.achievements[a.id] ? "is-earned" : ""}"><span class="ach__icon">${LL.Icons.get(a.icon)}</span><div><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></div></div>`).join("");
    const exps = (LL.EXPEDITIONS || []).map((e) => {
      const st = LL.Game.expeditionState(e);
      return `<article class="exp is-${st}"><header><h4>${esc(e.name)}</h4><span class="tag ${st === "done" ? "tag--gold" : ""}">${st === "done" ? "Complete" : st === "locked" ? "Unlocks at " + esc(LL.LEVELS[e.rank].name) : "+" + e.xp + " XP"}</span></header><p>${esc(e.desc)}</p></article>`;
    }).join("");
    const levels = LL.LEVELS.map((l, i) => `<li class="${i <= lv.index ? "is-done" : ""}"><span class="check">${i <= lv.index ? "✓" : ""}</span>${esc(l.name)}<span class="xp">${l.xp} XP</span></li>`).join("");
    const board = LL.Game.leaderboard().map((r, i) => {
      const prof = LL.Game.profiles().find((x) => x.id === r.id) || {};
      return `<tr class="${r.me ? "is-me" : ""}"><td class="rank">${i + 1}</td><td><span class="who">${monogram(prof)} ${esc(r.name)}${r.me ? ' <span class="tag">You</span>' : ""}</span></td><td>${esc(r.level)}</td><td>${r.stamps}/6</td><td>${r.rush}</td><td><b>${r.xp}</b></td></tr>`;
    }).join("");
    const gameRows = LL.GAMES.map((g) => { const s = p.games[g.id] || {}; const rate = s.plays ? Math.round(((s.completed || 0) / s.plays) * 100) : 0; return `<tr><td>${esc(g.name)}</td><td>${s.plays || 0}</td><td>${s.completed || 0}</td><td>${s.plays ? rate + "%" : "—"}</td><td>${s.best || 0}</td></tr>`; }).join("");
    const log = p.log.slice(0, 15).map((l) => `<li><span>${esc(l.reason)}</span><b>+${l.xp}</b></li>`).join("") || `<li class="muted">No activity yet — open a site dossier to begin.</li>`;

    root.innerHTML = `
      <aside class="passport__card panel">
        ${monogram(p, "monogram passport__avatar")}
        <p class="passport__name">${esc(p.name)}</p>
        <p class="passport__rank">${esc(lv.name)}</p>
        <div class="ring">
          <svg viewBox="0 0 160 160"><circle class="ring__bg" cx="80" cy="80" r="70"/><circle class="ring__fg" cx="80" cy="80" r="70" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - lv.pct)}"/></svg>
          <div class="ring__label"><b>${p.xp}</b><small>XP${lv.next ? ` · ${lv.nextXp - p.xp} to ${esc(lv.next)}` : " · highest rank"}</small></div>
        </div>
        <div class="stat-row">
          <div><b>${Object.keys(p.stamps).length}</b><small>Stamps</small></div>
          <div><b>${Object.keys(p.achievements).length}</b><small>Honours</small></div>
          <div><b>${p.streak.count}</b><small>Streak</small></div>
        </div>
        <div class="stat-row">
          <div><b>${disc}</b><small>Discoveries</small></div>
          <div><b>${gamesDone}</b><small>Games</small></div>
          <div><b>${p.streak.best || p.streak.count}</b><small>Best streak</small></div>
        </div>
        <details style="text-align:left;margin-top:1.2rem">
          <summary style="cursor:pointer;color:var(--gold-2);font-weight:600;font-size:.88rem">Edit player profile</summary>
          <div style="margin-top:.9rem">
            <label class="sr-only" for="pf-name">Player name</label>
            <div class="form-row"><input class="input" id="pf-name" maxlength="24" value="${esc(p.name)}"><button class="btn btn--gold btn--sm" id="pf-save">Save</button></div>
            <div class="avatar-pick" role="group" aria-label="Crest colour">${CRESTS.map((c) => `<button data-crest="${c}" style="--av:${c}" aria-label="Crest colour ${c}" aria-pressed="${c === crestColor(p)}"></button>`).join("")}</div>
            <p class="muted small" style="margin:.6rem 0 .4rem">Players on this device</p>
            <div class="form-row" style="margin-bottom:.5rem">${LL.Game.profiles().map((x) => `<button class="chip ${x.id === p.id ? "is-active" : ""}" data-switch="${x.id}">${esc(x.name)}</button>`).join("")}</div>
            <div class="form-row"><input class="input" id="pf-new" placeholder="New player name" maxlength="24"><button class="btn btn--ghost btn--sm" id="pf-add">Add player</button></div>
            <div class="form-row" style="margin-top:.8rem"><button class="btn btn--ghost btn--sm" id="pf-reset">Reset my progress</button>${LL.Game.profiles().length > 1 ? '<button class="btn btn--ghost btn--sm" id="pf-del">Delete this player</button>' : ""}</div>
          </div>
        </details>
      </aside>
      <div>
        <section class="passport__panel panel"><h2>Heritage stamps <small>${Object.keys(p.stamps).length} of 6 collected</small></h2><div class="stamp-grid">${stamps}</div></section>
        <section class="passport__panel panel"><h2>Expeditions <small>unlocked as your rank rises</small></h2><div class="expeditions">${exps}</div></section>
        <section class="passport__panel panel"><h2>Discovery collection <small>${disc} of ${discTotal} facts &amp; points of interest</small></h2>
          <div class="collection">${LL.LOCATIONS.map((l) => { const n = (p.facts[l.id] || []).length + (p.hotspots[l.id] || []).length, t = l.facts.length + l.hotspots.length; return `<a href="#explore/${l.id}" class="collection__site ${n ? "" : "is-empty"}" data-col="${l.id}"><span class="col-media"></span>${esc(l.name.replace(/ \(.*\)/, ""))}<b style="color:var(--gold-2)">${n}/${t}</b></a>`; }).join("")}</div></section>
        <section class="passport__panel panel"><h2>Honours <small>${Object.keys(p.achievements).length} of ${LL.ACHIEVEMENTS.length}</small></h2><div class="ach-grid">${ach}</div></section>
        <section class="passport__panel panel"><h2>Ranks</h2><ul class="quest-list">${levels}</ul></section>
        <section class="passport__panel panel"><h2>Leaderboard <small>Players on this device only</small></h2>
          <div class="table-wrap"><table class="board"><thead><tr><th>#</th><th>Player</th><th>Rank</th><th>Stamps</th><th>Rush best</th><th>XP</th></tr></thead><tbody>${board}</tbody></table></div>
          <div class="note"><span>ⓘ</span><div><b>This is not an online leaderboard.</b> Progress is stored in this browser (localStorage), so the table compares players on this device only. A shared, tamper-resistant leaderboard and secure accounts require a backend and database — for example Supabase or Firebase with authentication. See README.md.</div></div>
        </section>
        <section class="passport__panel panel"><h2>Game statistics</h2><div class="table-wrap"><table class="board"><thead><tr><th>Game</th><th>Plays</th><th>Completed</th><th>Completion</th><th>Best score</th></tr></thead><tbody>${gameRows}</tbody></table></div></section>
        <section class="passport__panel panel"><h2>Recent activity</h2><ul class="log">${log}</ul></section>
      </div>`;

    root.querySelectorAll("[data-col]").forEach((a) => a.querySelector(".col-media").replaceWith(LL.UI.media(a.dataset.col, { width: 300, label: false })));
    root.querySelector("#pf-save").onclick = () => { LL.Game.renameProfile(root.querySelector("#pf-name").value.trim()); LL.UI.toast("Profile saved"); };
    root.querySelectorAll("[data-crest]").forEach((b) => (b.onclick = () => { LL.Game.profile.crest = b.dataset.crest; LL.Game.renameProfile(null, null); }));
    root.querySelectorAll("[data-switch]").forEach((b) => (b.onclick = () => { LL.Game.switchProfile(b.dataset.switch); LL.UI.toast("Switched player"); }));
    root.querySelector("#pf-add").onclick = () => { const n = root.querySelector("#pf-new").value.trim(); if (!n) return root.querySelector("#pf-new").focus(); LL.Game.createProfile(n); LL.UI.toast("Welcome, " + n); };
    root.querySelector("#pf-reset").onclick = () => { if (confirm("Reset all progress for this player? This cannot be undone.")) LL.Game.resetProgress(); };
    const del = root.querySelector("#pf-del");
    if (del) del.onclick = () => { if (confirm("Delete this player from this device?")) LL.Game.deleteProfile(p.id); };
  }

  function init() {
    LL.Nav.on("passport", render);
    document.addEventListener("ll:update", () => {
      hud(); questCard();
      if (LL.Nav.current === "passport") {
        const open = document.querySelector("#passport details[open]");
        render();
        if (open) document.querySelector("#passport details").open = true;
      }
    });
    hud(); daily(); questCard();
  }

  return { init, hud, daily, questCard, render, monogram };
})();
