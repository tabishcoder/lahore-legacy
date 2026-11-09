/* =========================================================================
   GAME 6 — HISTORY RUSH  (timed trivia · v2: explanations, lifeline, sudden death)
   Real-history multiple-choice questions against the clock.
   Difficulty levels, streak multipliers, instant feedback, local scoreboard.
   ========================================================================= */

(function () {
  const KEY = "lahoreLegacy.rushScores";
  const MODES = {
    easy: { label: "Visitor", time: 90, pool: [1, 2], penalty: 0, desc: "90 s · gentler questions" },
    medium: { label: "Scholar", time: 75, pool: [1, 2, 3], penalty: 3, desc: "75 s · −3 s per mistake" },
    hard: { label: "Historian", time: 60, pool: [2, 3], penalty: 6, desc: "60 s · hardest questions · −6 s per mistake" },
    sudden: { label: "Sudden death", time: 150, pool: [1, 2, 3], penalty: 0, sudden: true, desc: "One mistake ends the run · ×1.5 points" },
  };

  function getScores() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function saveScore(entry) {
    const all = getScores(); all.push(entry);
    all.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20))); } catch (e) {}
    return all;
  }

  LL.Games.register("history-rush", {
    mount(root, api) {
      let mode = "medium", time = 0, timer = null, score = 0, streak = 0, best = 0, right = 0, asked = 0, queue = [], q = null, locked = false, lifeline = true;
      const $ = (s) => root.querySelector(s);

      function board(highlightTs) {
        const s = getScores();
        if (!s.length) return '<p class="muted small">No scores yet — be the first!</p>';
        return `<table class="board"><thead><tr><th>#</th><th>Player</th><th>Mode</th><th>Score</th></tr></thead><tbody>${s.slice(0, 8).map((r, i) => `<tr class="${r.ts === highlightTs ? "is-me" : ""}"><td class="rank">${i + 1}</td><td>${LL.UI.esc(r.avatar || "")} ${LL.UI.esc(r.name)}</td><td>${LL.UI.esc(r.mode)}</td><td><b>${r.score}</b></td></tr>`).join("")}</tbody></table>`;
      }

      function intro() {
        clearInterval(timer);
        root.innerHTML = `<div class="g-wrap rush__intro">
          <div class="g-panel g-intro">
            <h2>History Rush</h2>
            <p>How much do you know about Lahore? Answer as many real-history questions as you can before the timer hits zero.</p>
            <ul class="g-rules"><li>Correct answer: 100 points × your streak multiplier (up to ×5).</li><li>Every 3-answer streak adds 3 seconds.</li><li>One 50:50 lifeline per run removes two wrong answers.</li><li>After each answer, a short note explains the history. Keyboard: press 1–4 to answer.</li></ul>
            <div class="seg seg--stack" role="radiogroup" aria-label="Difficulty">${Object.entries(MODES).map(([k, v]) => `<button role="radio" aria-checked="${k === mode}" data-mode="${k}"><b>${v.label}</b><small>${v.desc}</small></button>`).join("")}</div>
            <button class="btn btn--gold btn--lg" data-go>Start the Rush</button>
          </div>
          <div class="g-panel"><h3>Scoreboard <small class="muted">this device only</small></h3>${board()}</div></div>`;
        api.setMeta("");
      }

      function refill() {
        const m = MODES[mode];
        queue = queue.concat(LL.UI.shuffle(LL.TRIVIA.filter((t) => m.pool.includes(t.d))));
      }

      function start() {
        const m = MODES[mode];
        time = m.time; score = 0; streak = 0; best = 0; right = 0; asked = 0; queue = []; lifeline = true; refill();
        root.innerHTML = `<div class="g-wrap rush">
          <div class="rush__hud">
            <div class="rush__timer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="rt-bg"/><circle cx="50" cy="50" r="44" class="rt-fg" id="rt-fg"/></svg><b id="rt-t">${time}</b></div>
            <div class="rush__stat"><small>Score</small><b id="rs-score">0</b></div>
            <div class="rush__stat"><small>Streak</small><b id="rs-streak">0</b><span class="mult" id="rs-mult">×1</span></div>
            <button class="btn btn--ghost btn--sm" data-life id="rs-life">50 : 50</button>
          </div>
          <div class="g-panel rush__card" id="rush-card"></div></div>`;
        next();
        timer = setInterval(tick, 1000);
        meta();
      }

      function meta() { api.setMeta(`<span class="meta-pill">${MODES[mode].label}</span><span class="meta-pill">✓ ${right}/${asked}</span>`); }

      function tick() {
        time--;
        const t = $("#rt-t"); if (!t) return;
        t.textContent = Math.max(0, time);
        const fg = $("#rt-fg"), c = 2 * Math.PI * 44;
        fg.style.strokeDasharray = c; fg.style.strokeDashoffset = c * (1 - Math.max(0, time) / MODES[mode].time);
        fg.classList.toggle("is-danger", time <= 10);
        if (time <= 5 && time > 0) api.sound("tick");
        if (time <= 0) end();
      }

      function next() {
        if (queue.length < 2) refill();
        q = queue.shift(); locked = false;
        const opts = LL.UI.shuffle(q.a.map((a, i) => ({ a, i })));
        const loc = api.location(q.loc);
        $("#rush-card").innerHTML = `<div class="rush__head"><span class="rush__thumb" data-thumb></span><p class="eyebrow">${"●".repeat(q.d)}${"○".repeat(3 - q.d)} · ${LL.UI.esc(loc.name)}</p></div>
          <h3 class="rush__q">${LL.UI.esc(q.q)}</h3>
          <div class="answer-list rush__answers">${opts.map((o, k) => `<button class="answer" data-a="${o.i}"><span class="key">${k + 1}</span>${LL.UI.esc(o.a)}</button>`).join("")}</div>
          <p class="rush__fb" id="rush-fb" aria-live="polite"></p>`;
        $("#rush-card [data-thumb]").appendChild(api.photo(q.loc, { width: 200, label: false }));
        $("#rush-card").classList.remove("pop"); void $("#rush-card").offsetWidth; $("#rush-card").classList.add("pop");
      }

      function answer(btn) {
        if (locked || time <= 0) return;
        locked = true; asked++;
        const ok = +btn.dataset.a === q.c;
        root.querySelectorAll("[data-a]").forEach((b) => { b.disabled = true; if (+b.dataset.a === q.c) b.classList.add("is-correct"); });
        const fb = $("#rush-fb");
        if (ok) {
          streak++; right++; best = Math.max(best, streak);
          const mult = Math.min(5, 1 + Math.floor(streak / 2));
          const pts = Math.round(100 * mult * (MODES[mode].sudden ? 1.5 : 1));
          score += pts;
          if (streak % 3 === 0) { time += 3; fb.innerHTML = `<b class="good">+${pts}</b> · Streak bonus +3s!`; }
          else fb.innerHTML = `<b class="good">+${pts}</b> Correct!`;
          api.sound("xp");
        } else {
          streak = 0;
          btn.classList.add("is-wrong", "shake");
          time = Math.max(0, time - MODES[mode].penalty);
          fb.innerHTML = `<b class="bad">Not quite.</b> Answer: ${LL.UI.esc(q.a[q.c])}${MODES[mode].penalty ? ` · −${MODES[mode].penalty}s` : ""}`;
          api.sound("fail");
        }
        if (q.x) fb.insertAdjacentHTML("beforeend", `<span class="rush__why">${LL.UI.esc(q.x)}</span>`);
        if (!ok && MODES[mode].sudden) { setTimeout(end, 1600); return; }
        $("#rs-score").textContent = score;
        $("#rs-streak").textContent = streak;
        $("#rs-mult").textContent = "×" + Math.min(5, 1 + Math.floor(streak / 2));
        meta();
        setTimeout(() => { if (time > 0) next(); }, ok ? (q.x ? 1300 : 650) : 2200);
      }

      function end() {
        clearInterval(timer);
        const p = LL.Game.profile, ts = Date.now();
        saveScore({ name: p.name, avatar: p.avatar, score, mode: MODES[mode].label, ts });
        const isBest = score > ((p.games["history-rush"] || {}).best || 0);
        const xp = Math.min(200, Math.floor(score / 10));
        const acc = asked ? Math.round((right / asked) * 100) : 0;
        root.innerHTML = `<div class="g-wrap rush__intro">
          <div class="g-panel g-result">
            <p class="eyebrow">${LL.UI.esc(MODES[mode].label)}</p><h2>${isBest && score ? "New Personal Best!" : "Time's Up!"}</h2>
            <p class="g-score">Score <b>${score}</b></p>
            <div class="stat-row"><div><b>${right}/${asked}</b><small>Correct</small></div><div><b>${acc}%</b><small>Accuracy</small></div><div><b>${best}</b><small>Best streak</small></div></div>
            <p class="muted">+${xp} XP earned</p>
            <div class="g-btns"><button class="btn btn--gold" data-go>Play Again</button><button class="btn btn--ghost" data-modes>Change Difficulty</button><button class="btn btn--ghost" data-exit>Games Center</button></div>
          </div>
          <div class="g-panel"><h3>Scoreboard <small class="muted">this device only</small></h3>${board(ts)}</div></div>`;
        if (isBest && score) api.burst();
        api.sound(score >= 1000 ? "success" : "click");
        if (right > 0) api.complete({ score, xp, label: `History Rush — ${score} points` });
        else api.record(score);
      }

      function useLifeline() {
        if (!lifeline || locked || !q) return;
        lifeline = false;
        const b = root.querySelector("#rs-life"); b.disabled = true;
        const wrongs = LL.UI.shuffle([...root.querySelectorAll("[data-a]")].filter((x) => +x.dataset.a !== q.c)).slice(0, 2);
        wrongs.forEach((x) => { x.disabled = true; x.classList.add("is-removed"); });
        api.sound("page");
      }
      function onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4) { const b = root.querySelectorAll("[data-a]")[n - 1]; b && answer(b); }
      }
      document.addEventListener("keydown", onKey);
      root.addEventListener("click", (e) => {
        const md = e.target.closest("[data-mode]");
        if (md) { mode = md.dataset.mode; root.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b === md))); api.sound("click"); return; }
        if (e.target.closest("[data-go]")) return start();
        if (e.target.closest("[data-modes]")) return intro();
        if (e.target.closest("[data-exit]")) return api.exit();
        const a = e.target.closest("[data-a]");
        if (a) answer(a);
        if (e.target.closest("[data-life]")) useLifeline();
      });
      intro();
      return () => { clearInterval(timer); document.removeEventListener("keydown", onKey); };
    },
  });
})();
