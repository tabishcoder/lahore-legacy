/* =========================================================================
   LAHORE LEGACY — GAME LAYER
   Points, ranks and badges, worked out from progress saved in this
   browser. Nothing is sent anywhere; there is no online leaderboard.
     seen     opened the place page or its virtual-tour stop   +10
     stamp    passed the 3-question check                       +25
     visited  "I've been here"                                  +40
     gps      the phone confirmed you were there                +15
   ========================================================================= */

window.LL = window.LL || {};

LL.Game = (function () {
  const P = () => LL.Progress.state;
  const PTS = { seen: 10, stamp: 25, visited: 40, gps: 15 };

  const RANKS = [
    { min: 0, en: "Newcomer", ur: "نووارد" },
    { min: 100, en: "Explorer", ur: "سیاح" },
    { min: 300, en: "Lahore Lover", ur: "لاہور کا عاشق" },
    { min: 650, en: "Old Lahori", ur: "پرانا لاہوری" },
    { min: 1100, en: "Lahore Legend", ur: "لاہور کا لیجنڈ" },
  ];

  function status(id) {
    const s = P();
    const v = s.visited[id];
    return { seen: !!s.seen[id], stamp: !!s.stamps[id], visited: !!v, gps: !!(v && v.gps) };
  }
  /* the single most important state, for pins and labels */
  function level(id) {
    const st = status(id);
    return st.visited ? "visited" : st.stamp ? "stamp" : st.seen ? "seen" : "new";
  }

  function points() {
    let n = 0;
    LL.SITES.forEach((x) => {
      const st = status(x.id);
      if (st.seen) n += PTS.seen;
      if (st.stamp) n += PTS.stamp;
      if (st.visited) n += PTS.visited;
      if (st.gps) n += PTS.gps;
    });
    return n + (P().quizBest || 0) * 3;
  }
  function rank() {
    const p = points();
    let i = 0;
    RANKS.forEach((r, k) => { if (p >= r.min) i = k; });
    const cur = RANKS[i], next = RANKS[i + 1];
    return { ...cur, index: i, points: p, next, toNext: next ? next.min - p : 0, pct: next ? (p - cur.min) / (next.min - cur.min) : 1 };
  }

  /* an area counts as done when each of its places is stamped or visited */
  const done = (id) => { const st = status(id); return st.stamp || st.visited; };
  function area(areaId) {
    const list = LL.SITES.filter((x) => x.area === areaId);
    return { have: list.filter((x) => done(x.id)).length, need: list.length, seen: list.filter((x) => status(x.id).seen).length };
  }

  const count = (f) => LL.SITES.filter((x) => f(status(x.id))).length;
  const planFinished = () => (LL.PLANS || []).some((p) => {
    const n = p.walk ? LL.WALK.length : p.stops.length;
    return ((P().planDone || {})[p.id] || []).length >= n;
  });

  const BADGES = [
    { id: "first", icon: "flag", en: "First step", ur: "پہلا قدم", how: "Open your first place", prog: () => [Math.min(1, count((s) => s.seen)), 1] },
    { id: "area-fort", icon: "fort", en: "Fort Keeper", ur: "قلعے کا رکھوالا", how: "Stamp or visit every place around the Fort", prog: () => { const a = area("fort"); return [a.have, a.need]; } },
    { id: "area-walled", icon: "gate", en: "Walled City Walker", ur: "اندرون شہر کا راہی", how: "Stamp or visit every Walled City place", prog: () => { const a = area("walled"); return [a.have, a.need]; } },
    { id: "area-shahdara", icon: "tomb", en: "Tomb Hunter", ur: "مقبروں کا کھوجی", how: "Stamp or visit all three Shahdara tombs", prog: () => { const a = area("shahdara"); return [a.have, a.need]; } },
    { id: "area-british", icon: "clock", en: "Mall Road Stroller", ur: "مال روڈ کا سیلانی", how: "Stamp or visit every British-era place", prog: () => { const a = area("british"); return [a.have, a.need]; } },
    { id: "area-gardens", icon: "leaf", en: "Garden Wanderer", ur: "باغوں کا مسافر", how: "Stamp or visit every garden and gateway", prog: () => { const a = area("gardens"); return [a.have, a.need]; } },
    { id: "boots", icon: "foot", en: "Boots on the ground", ur: "خود جا کر دیکھا", how: "Visit 5 places in person", prog: () => [Math.min(5, count((s) => s.visited)), 5] },
    { id: "gps", icon: "pin", en: "Verified traveller", ur: "تصدیق شدہ مسافر", how: "Check in with your phone's location at 3 places", prog: () => [Math.min(3, count((s) => s.gps)), 3] },
    { id: "stamps", icon: "stamp", en: "Stamp Collector", ur: "مہریں جمع کرنے والا", how: "Collect 12 stamps", prog: () => [Math.min(12, count((s) => s.stamp)), 12] },
    { id: "quiz", icon: "bolt", en: "Quick Mind", ur: "تیز دماغ", how: "Score 10 or more in the 60-second quiz", prog: () => [Math.min(10, P().quizBest || 0), 10] },
    { id: "route", icon: "route", en: "Route Finisher", ur: "راستہ مکمل", how: "Tick off every stop of a day plan", prog: () => [planFinished() ? 1 : 0, 1] },
    { id: "all", icon: "crown", en: "All of Lahore", ur: "پورا لاہور", how: "Open all 24 places", prog: () => [count((s) => s.seen), LL.SITES.length] },
  ];
  const earned = (b) => { const [h, n] = b.prog(); return h >= n; };

  /* check for newly earned badges; returns the new ones */
  function check() {
    return BADGES.filter((b) => earned(b) && LL.Progress.earn(b.id));
  }

  /* metres between two [lat, lon] points */
  function distance(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const CHECKIN_RADIUS = 500;
  function locate() {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) return rej(new Error("unsupported"));
      navigator.geolocation.getCurrentPosition((p) => res([p.coords.latitude, p.coords.longitude]), rej, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    });
  }

  return { PTS, RANKS, BADGES, status, level, points, rank, area, earned, check, distance, locate, CHECKIN_RADIUS };
})();
