/* =========================================================================
   LAHORE LEGACY — GAMIFICATION ENGINE
   XP · levels · achievements · passport stamps · missions · daily challenge ·
   streaks · local profiles & leaderboard.

   PERSISTENCE: localStorage (this browser, this device only).
   A real shared leaderboard and secure user accounts need a backend +
   database (e.g. Supabase / Firebase / your own API). See README.md.
   ========================================================================= */

window.LL = window.LL || {};

LL.Game = (function () {
  const KEY = "lahoreLegacy.v1";
  const AVATARS = ["🦚", "🕌", "🏰", "🌙", "⭐", "🪔", "🐎", "🌹"];

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  function blankProfile(name) {
    return {
      id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name || "Traveller",
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      created: today(),
      xp: 0,
      explored: {}, stamps: {}, panoramas: {}, hotspots: {}, facts: {},
      missions: {}, games: {}, achievements: {},
      daily: { date: null, done: false },
      streak: { count: 0, last: null, best: 0 },
      log: [], flags: {},
    };
  }

  let store = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && raw.profiles && raw.active && raw.profiles[raw.active]) return raw;
    } catch (e) {}
    const p = blankProfile("Traveller");
    return { active: p.id, profiles: { [p.id]: p } };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  const P = () => store.profiles[store.active];

  function emit() { document.dispatchEvent(new CustomEvent("ll:update", { detail: P() })); }

  /* ---------- levels ---------- */
  function levelFor(xp) {
    let idx = 0;
    LL.LEVELS.forEach((l, i) => { if (xp >= l.xp) idx = i; });
    const cur = LL.LEVELS[idx], next = LL.LEVELS[idx + 1];
    const pct = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
    return { index: idx, name: cur.name, next: next ? next.name : null, nextXp: next ? next.xp : cur.xp, pct: Math.max(0, Math.min(1, pct)) };
  }

  /* ---------- core award ---------- */
  function award(xp, reason) {
    const p = P();
    if (!xp) { emit(); return; }
    const before = levelFor(p.xp).index;
    p.xp += xp;
    p.log.unshift({ t: Date.now(), xp, reason });
    p.log = p.log.slice(0, 40);
    save();
    LL.UI && LL.UI.toast(`+${xp} XP`, reason, "xp");
    LL.Audio.play("xp");
    const after = levelFor(p.xp);
    if (after.index > before) {
      setTimeout(() => {
        LL.Audio.play("level");
        LL.UI && LL.UI.celebrate("New rank", `You are now <strong>${after.name}</strong>${unlockedAt(after.index)}`, "crown");
      }, 500);
    }
    checkAchievements();
    emit();
  }

  function unlock(id) {
    const p = P();
    if (p.achievements[id]) return;
    const a = LL.ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;
    p.achievements[id] = today();
    save();
    setTimeout(() => {
      LL.Audio.play("success");
      LL.UI && LL.UI.celebrate("Achievement unlocked", `<strong>${a.name}</strong> — ${a.desc}`, a.icon);
    }, 900);
    emit();
  }

  function checkAchievements() {
    const p = P();
    const completedGames = Object.keys(p.games).filter((g) => p.games[g].completed > 0);
    if (Object.keys(p.explored).length >= 1) unlock("first-discovery");
    if ((p.games["heritage-detective"] && p.games["heritage-detective"].completed) || (p.games["mystery-chamber"] && p.games["mystery-chamber"].completed)) unlock("mystery-solver");
    if (p.games["rebuild-lahore"] && p.games["rebuild-lahore"].completed) unlock("monument-master");
    if (Object.keys(p.stamps).length >= LL.LOCATIONS.length) unlock("heritage-explorer");
    if (completedGames.length >= 4) unlock("puzzle-champion");
    if (levelFor(p.xp).index >= LL.LEVELS.length - 1) unlock("lahore-legend");
    if (LL.LOCATIONS.every((l) => (p.facts[l.id] || []).length >= l.facts.length)) unlock("scholar");
    if (discoveryCount(p) >= 25) unlock("archivist");
    if (p.flags && p.flags.questExpert) unlock("cartographer");
    if (p.flags && p.flags.rebuildHard) unlock("restorer");
    if ((p.streak.best || 0) >= 7) unlock("devotee");
    if (((p.games["history-rush"] || {}).best || 0) >= 2500) unlock("polymath");
    checkExpeditions();
  }

  /* ---------- discoveries & expeditions ---------- */
  function discoveryCount(p = P()) {
    let n = 0;
    Object.values(p.facts || {}).forEach((a) => (n += a.length));
    Object.values(p.hotspots || {}).forEach((a) => (n += a.length));
    return n;
  }
  function discoveryTotal() { return LL.LOCATIONS.reduce((n, l) => n + l.facts.length + l.hotspots.length, 0); }
  function expeditionState(e, p = P()) {
    const rank = levelFor(p.xp).index;
    if (p.missions[e.id]) return "done";
    if (rank < e.rank) return "locked";
    return "open";
  }
  function checkExpeditions() {
    const p = P();
    (LL.EXPEDITIONS || []).forEach((e) => {
      if (expeditionState(e, p) !== "open") return;
      let ok = false;
      try { ok = !!e.check(p); } catch (err) {}
      if (ok) {
        p.missions[e.id] = today(); save();
        setTimeout(() => { award(e.xp, `Expedition: ${e.name}`); LL.UI && LL.UI.celebrate("Expedition complete", `<strong>${e.name}</strong>`, e.icon); }, 1200);
      }
    });
  }
  function unlockedAt(idx) {
    const ex = (LL.EXPEDITIONS || []).filter((e) => e.rank === idx);
    return ex.length ? ` — new expedition unlocked: <em>${ex.map((e) => e.name).join(", ")}</em>` : ".";
  }
  function flag(name, value = true) { const p = P(); p.flags = p.flags || {}; p.flags[name] = value; save(); checkAchievements(); emit(); }

  /* ---------- missions (once-only XP) ---------- */
  function mission(id, xp, label) {
    const p = P();
    if (p.missions[id]) return false;
    p.missions[id] = today();
    save();
    award(xp, label);
    return true;
  }
  const done = (id) => !!P().missions[id];

  function locationMissions(locId) {
    return [
      { id: `${locId}:visit`, label: "Open the site dossier", xp: 25 },
      { id: `${locId}:facts`, label: "Reveal every fact", xp: 30 },
      { id: `${locId}:panorama`, label: "Enter the panorama", xp: 20 },
      { id: `${locId}:hotspots`, label: "Study every point of interest", xp: 40 },
      { id: `${locId}:stamp`, label: "Pass the stamp test", xp: 50 },
    ];
  }

  function explore(locId) {
    const p = P();
    p.explored[locId] = p.explored[locId] || today();
    save();
    const loc = LL.LOCATIONS.find((l) => l.id === locId);
    mission(`${locId}:visit`, 25, `Explored ${loc ? loc.name : locId}`);
    checkAchievements(); emit();
  }

  function revealFact(locId, idx) {
    const p = P();
    p.facts[locId] = p.facts[locId] || [];
    if (!p.facts[locId].includes(idx)) {
      p.facts[locId].push(idx);
      save();
      const loc = LL.LOCATIONS.find((l) => l.id === locId);
      award(5, "Fact discovered");
      if (loc && p.facts[locId].length >= loc.facts.length) mission(`${locId}:facts`, 30, `All facts: ${loc.name}`);
    }
  }

  function hotspot(locId, idx) {
    const p = P();
    p.hotspots[locId] = p.hotspots[locId] || [];
    if (p.hotspots[locId].includes(idx)) return;
    p.hotspots[locId].push(idx);
    save();
    const loc = LL.LOCATIONS.find((l) => l.id === locId);
    if (loc && p.hotspots[locId].length >= loc.hotspots.length) mission(`${locId}:hotspots`, 40, `Points of interest: ${loc.name}`);
    else emit();
  }

  function panorama(locId) {
    P().panoramas[locId] = true; save();
    const loc = LL.LOCATIONS.find((l) => l.id === locId);
    mission(`${locId}:panorama`, 20, `Panorama: ${loc ? loc.name : locId}`);
  }

  function stamp(locId) {
    const p = P();
    if (p.stamps[locId]) return;
    p.stamps[locId] = today();
    save();
    const loc = LL.LOCATIONS.find((l) => l.id === locId);
    mission(`${locId}:stamp`, 50, `Passport stamp: ${loc.name}`);
    LL.UI && LL.UI.celebrate("Passport stamped", `${loc.name} <span class="urdu">${loc.urdu}</span>`, "stamp");
    checkAchievements(); emit();
  }

  /* ---------- games ---------- */
  function completeGame(gameId, { score = 0, xp = 0, label } = {}) {
    const p = P();
    const g = (p.games[gameId] = p.games[gameId] || { completed: 0, best: 0, plays: 0 });
    g.completed += 1;
    g.best = Math.max(g.best, score);
    save();
    const meta = LL.GAMES.find((x) => x.id === gameId);
    award(xp, label || `${meta ? meta.name : gameId} complete`);
    checkAchievements(); emit();
  }
  function playedGame(gameId) {
    const p = P();
    const g = (p.games[gameId] = p.games[gameId] || { completed: 0, best: 0, plays: 0 });
    g.plays += 1; save();
  }
  function recordScore(gameId, score) {
    const p = P();
    const g = (p.games[gameId] = p.games[gameId] || { completed: 0, best: 0, plays: 0 });
    const isBest = score > g.best;
    g.best = Math.max(g.best, score); save(); emit();
    return isBest;
  }

  /* ---------- daily challenge & streak ---------- */
  function touchStreak() {
    const p = P(), t = today();
    if (p.streak.last === t) return;
    if (p.streak.last && dayDiff(p.streak.last, t) === 1) p.streak.count += 1;
    else p.streak.count = 1;
    p.streak.last = t;
    p.streak.best = Math.max(p.streak.best || 0, p.streak.count);
    save();
  }

  function dailyQuestion() {
    const t = today();
    let h = 0;
    for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return LL.TRIVIA[h % LL.TRIVIA.length];
  }
  function dailyDone() { const p = P(); return p.daily.date === today() && p.daily.done; }
  function completeDaily(correct) {
    const p = P();
    if (dailyDone()) return;
    p.daily = { date: today(), done: true, correct };
    save();
    const bonus = Math.min(p.streak.count, 7) * 5;
    award(correct ? 50 + bonus : 10, correct ? `Daily challenge (+${bonus} streak bonus)` : "Daily challenge attempted");
  }

  /* ---------- profiles & leaderboard ---------- */
  function profiles() { return Object.values(store.profiles); }
  function switchProfile(id) { if (store.profiles[id]) { store.active = id; save(); touchStreak(); emit(); } }
  function createProfile(name) {
    const p = blankProfile(name);
    store.profiles[p.id] = p; store.active = p.id; save(); touchStreak(); emit();
    return p;
  }
  function renameProfile(name, avatar) {
    const p = P();
    if (name) p.name = name.slice(0, 24);
    if (avatar) p.avatar = avatar;
    save(); emit();
  }
  function deleteProfile(id) {
    if (Object.keys(store.profiles).length <= 1) return false;
    delete store.profiles[id];
    if (store.active === id) store.active = Object.keys(store.profiles)[0];
    save(); emit(); return true;
  }
  function resetProgress() {
    const p = P();
    const fresh = blankProfile(p.name);
    fresh.id = p.id; fresh.avatar = p.avatar;
    store.profiles[p.id] = fresh; save(); touchStreak(); emit();
  }
  function leaderboard() {
    return profiles()
      .map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, xp: p.xp, level: levelFor(p.xp).name, rush: (p.games["history-rush"] || {}).best || 0, stamps: Object.keys(p.stamps).length, me: p.id === store.active }))
      .sort((a, b) => b.xp - a.xp);
  }

  touchStreak();

  return {
    get profile() { return P(); },
    levelFor, award, unlock, mission, done, locationMissions,
    discoveryCount, discoveryTotal, expeditionState, flag,
    explore, revealFact, hotspot, panorama, stamp,
    completeGame, playedGame, recordScore,
    dailyQuestion, dailyDone, completeDaily,
    profiles, switchProfile, createProfile, renameProfile, deleteProfile, resetProgress, leaderboard,
    AVATARS, emit, persist: () => save(),
  };
})();
