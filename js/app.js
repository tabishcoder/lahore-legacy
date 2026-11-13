/* =========================================================================
   LAHORE LEGACY — APP (router + pages)
   Routes:  #/            home: two paths (plan a visit / virtual tour) + places
            #/site/<id>   one place, ~1 minute
            #/tour[/<id>] virtual tour, full screen, place by place
            #/plan        tourist guide: day plans, walking route, tips
            #/quiz        60-second quiz + share card
   ========================================================================= */

(function () {
  const { esc, cap, media, lightbox, toast, shuffle } = LL.UI;
  const { t, pick } = LL.I18N;
  const U = () => LL.I18N.attrs();
  // escape + keep number ranges (1641–42) left-to-right inside Urdu text
  const fx = (s) => esc(s).replace(/(\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)+)/g, '<span dir="ltr" class="num">$1</span>');
  const $ = (s, r = document) => r.querySelector(s);
  const main = () => $("#main");
  const site = (id) => LL.SITES.find((s) => s.id === id);
  const TOTAL = () => LL.SITES.length;
  const area = (id) => (LL.AREAS || []).find((a) => a.id === id);
  const CERT_AT = 6;
  const maps = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
  const ICON = {
    places: '<path d="M4 20h16M6 20v-7h12v7M6 13c0-4 3-6 6-8 3 2 6 4 6 8M12 5V2"/>',
    tour: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    plan: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    quiz: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    shirt: '<path d="M8 3l-5 3 2 4 3-1v12h8V9l3 1 2-4-5-3c0 2-2 3-4 3S8 5 8 3z"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
    moon: '<path d="M20 14A8 8 0 1110 4a7 7 0 0010 10z"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.7z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    map: '<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    fort: '<path d="M3 20h18M4 20V9h3v3h3V9h4v3h3V9h3v11M9 20v-4a3 3 0 016 0v4"/>',
    gate: '<path d="M4 20V8l8-5 8 5v12M9 20v-6a3 3 0 016 0v6"/>',
    tomb: '<path d="M3 20h18M5 20v-8h14v8M8 12a4 4 0 018 0M4 20V9M20 20V9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    leaf: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7"/>',
    foot: '<path d="M8 15c-2 0-3-2-3-5s1-6 3-6 3 3 3 6-1 5-3 5zM16 21c-2 0-3-2-3-4s1-4 3-4 3 2 3 4-1 4-3 4z"/>',
    stamp: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5" stroke-dasharray="2 2"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 000-8h-4a4 4 0 010-8h6"/>',
    crown: '<path d="M3 18h18l-2-10-5 4-2-7-2 7-5-4z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    share: '<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>',
    me: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  };
  const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
  let cleanup = null;

  /* ---------------- header ---------------- */
  function header() {
    [["places", "#/"], ["plan", "#/plan"], ["tour", "#/tour"], ["quiz", "#/quiz"], ["me", "#/me"]].forEach(([k]) => {
      const a = $(`#nav-${k}`); a.innerHTML = `${ico(k)}<span>${t(k)}</span>`;
    });
    $("#footer-lang").textContent = `${t("langTitle")}: ${LL.I18N.mode === "mix" ? t("langMix") : t("langEn")} · ${t("langChange")}`;
    const n = LL.Progress.stampCount(), rk = LL.Game.rank();
    const pct = Math.round(rk.pct * 100);
    const toNextTxt = rk.next ? ` · ${rk.toNext} pts to ${rk.next.en}` : "";
    $("#progress-pill").innerHTML = `<span class="pill__seal">${ico("crown")}</span><b>${rk.points}</b><span class="pill__rank">${esc(rk.en)}</span><span class="pill__bar" style="--pct:${pct}%"></span>`;
    $("#progress-pill").title = `${rk.en} · ${rk.points} pts${toNextTxt} · ` + t("progressLine", LL.Progress.seenCount(), n, TOTAL());
    $("#progress-pill").classList.toggle("pill--near-rank", pct > 80 && !!rk.next);
    $("#footer-text").textContent = t("footer");
    const r = route();
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.r === (r.page === "site" ? "home" : r.page === "trail" ? "tour" : r.page)));
  }

  /* ---------------- home ---------------- */
  /* what suits this time of day in Lahore */
  function rightNow() {
    const h = +new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "numeric", hourCycle: "h23" }).format(new Date());
    if (h >= 5 && h < 11) return { k: "morning", ids: ["delhi-gate", "wazir-khan-mosque", "jahangir-tomb", "lahore-fort", "shahi-hammam"] };
    if (h >= 11 && h < 16) return { k: "afternoon", ids: ["lahore-museum", "shahi-hammam", "lahore-fort", "quaid-library", "sunehri-masjid"] };
    if (h >= 16 && !LL.Motion.isNight()) return { k: "evening", ids: ["shalimar-gardens", "minar-e-pakistan", "badshahi-mosque", "chauburji", "hazuri-bagh"] };
    return { k: "night", ids: ["badshahi-mosque", "iqbal-tomb", "data-darbar", "minar-e-pakistan", "lahore-fort"] };
  }

  function home() {
    const P = LL.Progress;
    const seen = P.seenCount(), stamps = P.stampCount(), rk = LL.Game.rank();
    const now = rightNow();
    main().innerHTML = `
      <section class="hero hero--short">
        <div class="hero__photo" id="hero-photo"></div>
        <div class="hero__media-cap" id="hero-cap"><span id="hero-cap-text"></span><button class="hero__vbtn" id="hero-vbtn" hidden aria-label="Pause video">❚❚</button></div>
        <div class="hero__inner">
          <p class="eyebrow">${t("heroEyebrow")}</p>
          <h1>${t("heroTitle")}</h1>
          <p class="lead">${t("heroLead", TOTAL())}</p>
          <div class="search" role="search">
            <span class="search__icon">${ico("search")}</span>
            <input id="q" type="search" autocomplete="off" placeholder="${t("searchPh", TOTAL())}" aria-label="${t("searchPh", TOTAL())}">
            <div class="search__results" id="results" hidden></div>
          </div>
          <div class="actions">
            <a class="action" href="#/map/near"><span class="action__icon">${ico("pin")}</span><b>${t("actNear")}</b><small>${t("actNearSub")}</small></a>
            <a class="action" href="#/plan"><span class="action__icon">${ico("plan")}</span><b>${t("actPlan")}</b><small>${t("actPlanSub")}</small></a>
            <a class="action" href="#/tour"><span class="action__icon">${ico("tour")}</span><b>${t("actTour")}</b><small>${t("actTourSub")}</small></a>
          </div>
          <a class="hero__cue" href="#explore" aria-label="${t("cue")}"><span>${t("cue")}</span><i></i></a>
          ${seen ? `<a class="hero__progress" href="#/me">${ico("crown")} <b>${esc(rk.en)}</b> · ${rk.points} pts · ${t("stampsOf", stamps, TOTAL())} →</a>` : ""}
        </div>
      </section>

      <div class="marquee" id="marquee"></div>

      <section class="glance wrap" id="explore">
        <div><b data-count="${TOTAL()}">${TOTAL()}</b><span>${t("glPlaces")}</span></div>
        <div><b data-count="${LL.TRAIL360.stops.length}">${LL.TRAIL360.stops.length}</b><span>${t("glStops")}</span></div>
        <div><b data-count="${LL.PLANS.length}">${LL.PLANS.length}</b><span>${t("glPlans")}</span></div>
        <div><b data-count="${LL.AREAS.length}">${LL.AREAS.length}</b><span>${t("glAreas")}</span></div>
      </section>

      <section class="row">
        <header class="row__head wrap"><div><h2>${t("now_" + now.k)}</h2><p>${t("nowLine_" + now.k)}</p></div></header>
        <div class="row__scroll" data-ids="${now.ids.join(",")}"></div>
      </section>

      <section class="row">
        <header class="row__head wrap"><div><h2>${t("sitesTitle")}</h2><p>${t("sitesLead")}</p></div></header>
        <div class="row__scroll" data-ids="${LL.SITES.filter((s) => s.top).map((s) => s.id).join(",")}"></div>
      </section>

      <section class="wrap">${trailBand()}</section>

      ${LL.AREAS.map((a) => `
      <section class="row">
        <header class="row__head wrap">
          <div><h2>${esc(a.name.en)} <span lang="ur">${esc(a.name.ur)}</span></h2><p>${esc(a.line.en)} · ${t("placesCount", LL.SITES.filter((s) => s.area === a.id).length)}</p></div>
          <a class="row__more" href="#/map/area-${a.id}">${ico("map")} ${t("onMap")}</a>
        </header>
        <div class="row__scroll" data-ids="${LL.SITES.filter((s) => s.area === a.id).map((s) => s.id).join(",")}"></div>
      </section>`).join("")}

      ${stamps >= CERT_AT ? `<section class="wrap"><div class="band band--cert">
        <div><p class="eyebrow">✓ ${stamps}/${TOTAL()}</p><h2>${t("certTitle")}</h2><p>${t("certLead")}</p></div>
        <form class="cert-form" id="cert-form"><label class="sr" for="cert-name">${t("certName")}</label>
          <input id="cert-name" class="input" maxlength="28" placeholder="${t("certName")}" value="${esc(P.state.name)}">
          <button class="btn btn--gold">${t("certCta")}</button></form>
      </div></section>` : ""}

      <section class="wrap">
        <a class="band band--quiz" href="#/quiz">
          <div><p class="eyebrow">${t("quizEyebrow")}</p><h2>${t("quizTitle")}</h2>
          ${P.state.quizBest ? `<p class="best">${t("best")}: <b>${P.state.quizBest}</b></p>` : `<p>${t("quizLead")}</p>`}</div>
          <span class="btn btn--gold">${t("quizCta")}</span>
        </a>
      </section>`;

    // hero: photo slideshow, then real video when the connection allows
    const heroBox = $("#hero-photo"), capText = $("#hero-cap-text"), vbtn = $("#hero-vbtn");
    const night = LL.Motion.isNight();
    const show = LL.Motion.slideshow(heroBox, night ? "night" : "day", (g) => { capText.innerHTML = `${esc(g.caption)}`; });
    const vids = LL.Motion.videoLoop(heroBox, LL.Motion.pickClips(LL.VIDEOS.home), (c) => {
      show && show.stop();
      capText.innerHTML = `▶ ${esc(c.label)}`;
      vbtn.hidden = false;
    });
    vbtn.addEventListener("click", () => { const on = vids.toggle(); vbtn.textContent = on ? "❚❚" : "▶"; vbtn.setAttribute("aria-label", on ? "Pause video" : "Play video"); });
    LL.Motion.parallax(heroBox);

    // swipe rows
    main().querySelectorAll(".row__scroll").forEach((row) => {
      row.dataset.ids.split(",").forEach((id) => { const s = site(id); if (s) row.appendChild(tile(s)); });
    });
    LL.Ease && LL.Ease.rowArrows(main());
    const mixNames = LL.I18N.mode === "mix";
    LL.Delight.marquee($("#marquee"), LL.SITES.map((x, i) => (mixNames && i % 2 ? `<span lang="ur">${esc(x.name.ur)}</span>` : esc(x.name.en))));
    const stopRows = LL.Delight.rows(main());
    LL.Delight.tiltCards(main());
    $(".hero__cue").addEventListener("click", (e) => { e.preventDefault(); $("#explore").scrollIntoView({ behavior: "smooth", block: "start" }); });
    const back = LL.Motion.lastMorph();
    if (back) { const c = main().querySelector(`.tile[href="#/site/${back}"] .media`); if (c) c.style.viewTransitionName = "hero-photo"; }
    LL.Motion.reveal(main(), ".row__head, .band, .glance > div, .trailband");

    // search
    const q = $("#q"), res = $("#results");
    const norm = (x) => String(x || "").toLowerCase();
    const find = (term) => {
      const k = norm(term).trim();
      if (!k) return [];
      return LL.SITES.map((s) => {
        const a = area(s.area) || { name: {} };
        const hay = [s.name.en, s.name.ur, a.name.en, a.name.ur, s.era.en, s.line.en].map(norm).join(" | ");
        const score = norm(s.name.en).startsWith(k) || norm(s.name.ur).startsWith(k) ? 3 : norm(s.name.en).includes(k) || norm(s.name.ur).includes(k) ? 2 : hay.includes(k) ? 1 : 0;
        return { s, score };
      }).filter((x) => x.score).sort((a, b) => b.score - a.score).slice(0, 6).map((x) => x.s);
    };
    const drawRes = () => {
      const list = find(q.value);
      res.hidden = !q.value.trim();
      res.innerHTML = list.length ? list.map((s) => `<a class="sr-item" href="#/site/${s.id}" data-ph="${s.id}"><span><b>${esc(s.name.en)}</b> <span lang="ur">${esc(s.name.ur)}</span><small>${esc((area(s.area) || { name: { en: "" } }).name.en)} · ${esc(s.era.en)}</small></span></a>`).join("") : `<p class="sr-none">${t("noResults")}</p>`;
      res.querySelectorAll("[data-ph]").forEach((el) => { const m = media(el.dataset.ph, { width: 330 }); m.classList.add("sr-ph"); el.prepend(m); });
    };
    q.addEventListener("input", drawRes);
    q.addEventListener("keydown", (e) => { if (e.key === "Enter") { const f = find(q.value)[0]; if (f) go(`#/site/${f.id}`); } if (e.key === "Escape") { q.value = ""; drawRes(); } });

    const form = $("#cert-form");
    if (form) form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("#cert-name").value.trim();
      LL.Progress.setName(name);
      const cv = await LL.Share.certificate(name);
      LL.Share.deliver(cv, "lahore-legacy-certificate.png", t("certTitle"));
    });
    return () => { show && show.stop(); vids && vids.stop(); stopRows(); };
  }

  /* tall photo tile used in the swipe rows */
  function tile(s) {
    const a = document.createElement("a");
    a.className = "tile";
    a.href = `#/site/${s.id}`;
    const frame = document.createElement("span");
    frame.className = "tile__frame";
    frame.appendChild(media(s.id, { width: 500 }));
    const d = LL.ME && LL.GEO[s.id] ? LL.Game.distance(LL.ME, LL.GEO[s.id]) : null;
    frame.insertAdjacentHTML("beforeend", `<span class="tile__top">${LL.Game.level(s.id) !== "new" ? statusChip(s.id) : ""}${d != null && d < 40000 ? `<span class="tile__dist">${fmtDist(d)}</span>` : ""}</span>`);
    a.appendChild(frame);
    a.insertAdjacentHTML("beforeend", `
      <span class="tile__body"><small>${esc(s.era.en)}</small><b>${esc(s.name.en)}</b><span lang="ur">${esc(s.name.ur)}</span></span>`);
    return a;
  }
  const fmtDist = (m) => (m < 950 ? `${Math.round(m / 50) * 50} m` : `${(m / 1000).toFixed(m < 9500 ? 1 : 0)} km`);

  function card(s, i) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = `#/site/${s.id}`;
    a.style.animationDelay = `${i * 60}ms`;
    a.appendChild(media(s.id, { width: 500 }));
    a.insertAdjacentHTML("beforeend", `<span class="card__shine" aria-hidden="true"></span>
      ${LL.Game.level(s.id) !== "new" ? `<span class="card__stamp">${statusChip(s.id)}</span>` : ""}
      <div class="card__body">
        <p class="card__meta"><span>${esc(s.era.en)}</span><span>${t("min")}</span></p>
        <h3>${esc(s.name.en)} <span class="card__ur" lang="ur">${esc(s.name.ur)}</span></h3>
        <p class="card__line" ${U()}>${fx(pick(s.line))}</p>
      </div>`);
    return a;
  }

  function statusChip(id) {
    const lv = LL.Game.level(id);
    if (lv === "new") return `<span class="status status--new">${t("stNew")}</span>`;
    const g = LL.Game.status(id);
    return `<span class="status status--${lv}">${lv === "visited" ? `${ico("check")} ${t(g.gps ? "stVerified" : "stVisited")}` : lv === "stamp" ? `★ ${t("stamped")}` : `${ico("eye")} ${t("stSeen")}`}</span>`;
  }

  /* compact row card used in the "every place" list */
  function mini(s) {
    const a = document.createElement("a");
    a.className = "mini";
    a.href = `#/site/${s.id}`;
    const m = media(s.id, { width: 330 });
    m.classList.add("mini__media");
    a.appendChild(m);
    a.insertAdjacentHTML("beforeend", `<div class="mini__body">
      <p class="mini__meta">${esc(s.era.en)}</p>
      ${statusChip(s.id)}
      <h4>${esc(s.name.en)} <span lang="ur">${esc(s.name.ur)}</span></h4>
      <p class="mini__line" ${U()}>${fx(pick(s.line))}</p></div>`);
    return a;
  }

  /* ---------------- place page ---------------- */
  function sitePage(id) {
    const s = site(id);
    if (!s) return go("#/");
    const wasNew = !LL.Progress.state.seen[id];
    LL.Progress.see(id);
    const P = LL.Progress.state;
    const idx = LL.SITES.indexOf(s);
    const next = LL.SITES[(idx + 1) % LL.SITES.length];
    const ticked = P.look[id] || [];
    const cfg = LL.ASSETS.locations[id];

    main().innerHTML = `
      <article class="site">
        <header class="site__hero">
          <div class="site__photo" id="site-photo"></div>
          <div class="site__title">
            <a class="back" href="#/">← ${t("back")}</a>
            <p class="eyebrow">${esc(s.era.en)}${area(s.area) ? ` · ${esc(area(s.area).name.en)}` : ""}${LL.ME && LL.GEO[id] && LL.Game.distance(LL.ME, LL.GEO[id]) < 40000 ? ` · <b class="dist">${fmtDist(LL.Game.distance(LL.ME, LL.GEO[id]))} ${t("away")}</b>` : ""}</p>
            <h1>${esc(s.name.en)}</h1>
            <p class="site__ur" lang="ur">${esc(s.name.ur)}</p>
            <div class="site__actions">
              <button class="btn btn--gold btn--sm" id="see-photos">${ico("eye")} ${t("seePhotos")}</button>
              <a class="btn btn--ghost btn--sm" href="#/tour/${id}">${ico("tour")} ${t("virtualView")}</a>
              <a class="btn btn--ghost btn--sm" href="#/map/${id}">${ico("map")} ${t("onMap")}</a>
              <button class="btn btn--ghost btn--sm" id="share-place">${ico("share")} ${t("sharePlace")}</button>
            </div>
          </div>
        </header>

        <div class="site__body wrap-narrow">
          <dl class="quick">${(LL.QUICK[id] || []).map(([k, v]) => `<div><dt>${t("quick")[k]}</dt><dd ${U()}>${fx(pick(v))}</dd></div>`).join("")}</dl>

          <section class="been" id="been"></section>

          ${trailCard(id)}

          <p class="story" ${U()}>${fx(pick(s.story))}</p>

          <section class="block">
            <h2>${t("facts")}</h2>
            <ol class="facts" ${U()}>${pick(s.facts).map((f) => `<li><span>${fx(f).replace(/<span dir="ltr" class="num">(\d{3,4})<\/span>/g, '<span dir="ltr" class="num count">$1</span>')}</span></li>`).join("")}</ol>
          </section>

          <section class="block">
            <h2>${t("look")}</h2>
            <p class="hint">${t("lookHint")}</p>
            <ul class="look" ${U()}>${pick(s.look).map((l, i) => `<li><label><input type="checkbox" data-look="${i}" ${ticked.includes(i) ? "checked" : ""}><span>${fx(l)}</span></label></li>`).join("")}</ul>
          </section>

          <section class="block" id="thennow" hidden></section>

          <section class="block">
            <h2>${t("gallery")}</h2>
            <div class="strip" id="strip"></div>
          </section>

          ${officialBlock(id)}

          <section class="block visit">
            <h2>${t("visit")}</h2>
            <dl ${U()}>${pick(s.visit).map(([k, v]) => `<div><dt>${fx(k)}</dt><dd>${fx(v)}</dd></div>`).join("")}</dl>
            <p><a class="btn btn--ghost btn--sm" href="${maps(s.name.en + ", Lahore")}" target="_blank" rel="noopener">${ico("pin")} ${t("directions")} ↗</a></p>
            <p class="hint">${t("directionsNote")}. ${t("visitNote")}</p>
          </section>

          <section class="block check" id="check"></section>

          <section class="block nearby" id="nearby" hidden><h2>${t("nearbyTitle")}</h2><div class="row__scroll" id="nearby-row"></div></section>

          <a class="next" href="#/site/${next.id}">
            <span class="next__label">${t("next")} →</span>
            <span class="next__name">${esc(next.name.en)}</span>
            <span class="next__media" id="next-media"></span>
          </a>
        </div>
      </article>`;

    const sp = $("#site-photo");
    const heroMedia = media(id, { width: innerWidth > 900 ? 1920 : 960, eager: true });
    LL.Motion.morphTo(heroMedia, id);
    sp.appendChild(heroMedia);
    const vset = LL.VIDEOS.sites[id];
    let siteVid = null;
    if (vset) siteVid = LL.Motion.videoLoop(sp, [LL.Motion.pickClips(vset)], (c) => {
    });
    LL.Motion.parallax(sp);
    document.body.insertAdjacentHTML("beforeend", '<div id="readbar" class="readbar"></div>');
    LL.Motion.reveal(main(), ".quick > div, .been, .story, .block > h2, .facts li, .look li, .strip, .visit dl > div, .next");
    $("#next-media").appendChild(media(next.id, { width: 500 }));

    wireOfficial(main());
    const strip = $("#strip");
    // every photo we have for this place: official sources first, then Wikimedia Commons
    LL.Photos.candidates(id, 500).forEach((g, i) => {
      const b = document.createElement("button");
      b.className = "strip__item";
      b.setAttribute("aria-label", cap(g));
      b.appendChild(media(id, { width: 500, start: i, label: false }));
      b.insertAdjacentHTML("beforeend", `<span>${fx(cap(g))}</span>`);
      b.addEventListener("click", () => lightbox(id, i));
      strip.appendChild(b);
    });

    main().querySelectorAll("[data-look]").forEach((c) => c.addEventListener("change", () => LL.Progress.toggleLook(id, +c.dataset.look)));

    Promise.all([LL.Photos.old(id, 960), LL.Photos.resolve(id, 960, 0)]).then(([oldP, nowP]) => {
      const box = $("#thennow");
      if (!box || !oldP || !nowP) return;
      box.hidden = false;
      box.innerHTML = `<h2>${t("thenNow")}</h2><p class="hint">${t("thenNowHint")}</p>
        <div class="compare" style="--pos:50%">
          <img src="${nowP.url}" alt="${t("now")}" draggable="false">
          <img class="compare__old" src="${oldP.url}" alt="${t("then")}" draggable="false">
          <span class="compare__line"></span>
          <span class="compare__tag compare__tag--then">${t("then")}</span><span class="compare__tag compare__tag--now">${t("now")}</span>
          <input type="range" min="0" max="100" value="50" aria-label="${t("thenNowHint")}">
        </div>`;
      const cmp = box.querySelector(".compare");
      box.querySelector("input").addEventListener("input", (e) => cmp.style.setProperty("--pos", e.target.value + "%"));
    });

    $("#share-place").addEventListener("click", () => shareText(s.name.en, `${s.name.en} — ${s.line.en}\n${t("directions")}: ${maps(s.name.en + ", Lahore")}`, location.href));
    $("#see-photos").addEventListener("click", () => lightbox(id, 0));
    miniQuiz(id);
    beenBox(id);
    nearbyBox(id);
    badgeNudge(id);
    if (wasNew) setTimeout(() => { const h = document.querySelector(".site__title h1"); if (h) LL.FX.points(h, LL.Game.PTS.seen); }, 700);
    return () => { siteVid && siteVid.stop(); const rb = $("#readbar"); if (rb) rb.remove(); };
  }

  /* "Have you been here?" — self check-in, or verified by the phone's location */
  /* a card linking to the matching 360° Royal Trail stop, on the handful of place pages that have one */
  function trailCard(id) {
    const stop = (LL.TRAIL360.stops || []).find((x) => x.site === id);
    if (!stop) return "";
    return `<a class="trailcard" href="#/trail/${stop.id}">
      <span class="trailcard__media"><img src="${LL.Trail360.thumb(stop.id)}" alt="" loading="lazy"></span>
      <span class="trailcard__body">
        <b>${ico("tour")} ${t("trailCardTitle")}</b>
        <span>${t("trailCardText")}</span>
        <span class="btn btn--gold btn--sm">${t("trailCardCta")} →</span>
      </span></a>`;
  }

  /* a handful of other places nearby, so there is always somewhere else to go */
  function nearbyBox(id) {
    const box = $("#nearby"), row = $("#nearby-row");
    if (!box || !row) return;
    const s = site(id);
    const sameArea = LL.SITES.filter((x) => x.id !== id && x.area === s.area);
    const rest = LL.SITES.filter((x) => x.id !== id && x.area !== s.area);
    const list = sameArea.concat(rest).slice(0, 6);
    if (!list.length) return;
    list.forEach((x, i) => { const el = tile(x); el.style.setProperty("--i", Math.min(i, 6)); row.appendChild(el); });
    row.classList.add("is-dealt");
    box.hidden = false;
  }

  /* nudge showing how many more stamps needed for the area badge */
  function badgeNudge(id) {
    const s = site(id);
    if (!s) return;
    const b = LL.Game.BADGES.find((x) => x.id === `area-${s.area}`);
    if (!b) return;
    const [have, need] = b.prog();
    const left = need - have;
    if (left <= 0 || have === 0) return; // done or not started at all yet
    const box = $("#been");
    if (!box) return;
    const nudge = document.createElement("p");
    nudge.className = "badge-nudge";
    nudge.innerHTML = `${ico("stamp")} <b>${left}</b> more stamp${left === 1 ? "" : "s"} to earn <b>${esc(b.en)}</b>`;
    box.appendChild(nudge);
  }

  function beenBox(id) {
    const box = $("#been");
    if (!box) return;
    const st = LL.Game.status(id), G = LL.Game.PTS;
    if (st.visited) {
      box.className = "been is-done";
      box.innerHTML = `<span class="been__icon">${ico("check")}</span>
        <div><b>${t(st.gps ? "beenVerified" : "beenDone")}</b><p>${t("beenDate", LL.Progress.state.visited[id].d)}${st.gps ? "" : ` · <button class="linkish" data-a="gps">${t("beenVerify")}</button>`}${st.gps ? "" : ` · <button class="linkish" data-a="undo">${t("undo")}</button>`}</p></div>`;
    } else {
      box.className = "been";
      box.innerHTML = `<span class="been__icon">${ico("pin")}</span>
        <div><b>${t("beenQ")}</b><p>${t("beenLead", G.visited, G.gps)}</p></div>
        <div class="been__btns"><button class="btn btn--gold btn--sm" data-a="gps">${ico("pin")} ${t("beenGps")}</button><button class="btn btn--ghost btn--sm" data-a="self">${t("beenSelf")}</button></div>`;
    }
    box.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", async () => {
      const a = b.dataset.a;
      if (a === "self") { LL.FX.points(b, G.visited); LL.Progress.visit(id); toast(t("beenDone")); }
      if (a === "undo") LL.Progress.unvisit(id);
      if (a === "gps") {
        b.disabled = true; b.textContent = t("locating");
        try {
          const here = await LL.Game.locate();
          const d = LL.Game.distance(here, LL.GEO[id]);
          if (d <= LL.Game.CHECKIN_RADIUS) { LL.FX.points(b, G.visited + G.gps); LL.FX.confetti(); LL.Progress.visit(id, true); toast(t("beenVerified")); }
          else toast(t("tooFar", d < 10000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d / 1000)} km`));
        } catch (e) { toast(t("noLocation")); }
      }
      beenBox(id);
    }));
  }

  /* 3-question stamp check (2 of 3 correct earns the stamp). */
  function miniQuiz(id) {
    const box = $("#check");
    const s = site(id);
    if (LL.Progress.state.stamps[id]) {
      box.innerHTML = `<div class="stamp-done"><span class="seal">✓</span><div><h2>${t("stampEarned")}</h2><p>${t("stampAlready")}</p></div></div>`;
      return;
    }
    const qs = shuffle(LL.QUIZ.filter((q) => q.s === id)).slice(0, 3);
    let i = 0, right = 0;
    const draw = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      const opts = shuffle(pick(q.a).map((a, k) => ({ a, k })));
      box.innerHTML = `<h2>${t("check")}</h2><p class="hint">${t("checkLead")} · ${t("qOf", i + 1, qs.length)}</p>
        <div ${U()}><p class="q">${fx(pick(q.q))}</p>
        <div class="answers">${opts.map((o) => `<button class="answer" data-k="${o.k}">${fx(o.a)}</button>`).join("")}</div></div>
        <p class="feedback" aria-live="polite"></p>`;
      box.querySelectorAll(".answer").forEach((b) => b.addEventListener("click", () => {
        const ok = +b.dataset.k === q.c;
        if (ok) right++;
        box.querySelectorAll(".answer").forEach((x) => { x.disabled = true; if (+x.dataset.k === q.c) x.classList.add("is-right"); });
        if (!ok) b.classList.add("is-wrong");
        box.querySelector(".feedback").innerHTML = ok ? t("correct") : `${t("wrong")}: <span ${U()}>${fx(pick(q.a)[q.c])}</span>`;
        i++;
        setTimeout(draw, ok ? 700 : 1600);
      }));
    };
    const finish = () => {
      if (right >= 2) {
        LL.FX.stamp(s, LL.Game.PTS.stamp);
        LL.Progress.stamp(id);
        box.innerHTML = `<div class="stamp-done is-new"><span class="seal">✓</span><div><h2>${t("stampEarned")}</h2><p>${esc(s.name.en)} · ${right}/3 · ${t("stampsOf", LL.Progress.stampCount(), TOTAL())}</p></div></div>`;
      } else {
        box.innerHTML = `<h2>${t("check")}</h2><p class="q">${right}/3</p><button class="btn btn--gold" id="retry">${t("tryAgain")}</button>`;
        $("#retry").addEventListener("click", () => miniQuiz(id));
      }
    };
    draw();
  }

  /* ---------------- virtual tour ---------------- */
  function tourPage(id) {
    const s = site(id) || null;
    if (!s) return tourIntro();
    LL.Progress.see(s.id);
    const idx = LL.SITES.indexOf(s);
    const prev = LL.SITES[idx - 1], next = LL.SITES[idx + 1];
    const cfg = LL.ASSETS.locations[s.id];
    const story = pick(s.story);
    const teaser = story.split(/(?<=[.۔])\s+/).slice(0, 2).join(" ");
    const fact = pick(s.facts)[0];
    let viewer = null, views = [], cur = 0, token = 0;

    main().innerHTML = `
      <section class="tour">
        <div class="tour__stage" id="stage" tabindex="0" aria-label="${t("dragHint")}"><div class="tour__loading"></div></div>
        <div class="tour__chips"><span class="chip" id="kind"></span></div>
        <div class="tour__hint" id="hint">${t("dragHint")}</div>
        <div class="tour__tools">
          <button class="tool" data-a="out" aria-label="Zoom out">${ico("minus")}</button>
          <button class="tool" data-a="in" aria-label="Zoom in">${ico("plus")}</button>
          <button class="tool" data-a="motion" aria-label="${t("motion")}" title="${t("motion")}" hidden>${ico("phone")}</button>
          <button class="tool" data-a="full" aria-label="Full screen">${ico("full")}</button>
        </div>
        <div class="tour__thumbs" id="thumbs"></div>
        <aside class="tour__panel">
          <div class="tour__dots">${LL.SITES.map((x, i) => `<a href="#/tour/${x.id}" class="${i === idx ? "on" : LL.Progress.state.seen[x.id] ? "half" : ""}" aria-label="${esc(x.name.en)}"></a>`).join("")}</div>
          <p class="eyebrow">${t("tourEyebrow", idx + 1, LL.SITES.length)}${area(s.area) ? ` · ${esc(area(s.area).name.en)}` : ""}</p>
          <h1>${esc(s.name.en)} <span class="tour__ur" lang="ur">${esc(s.name.ur)}</span></h1>
          <p class="tour__teaser" ${U()}>${fx(teaser)}</p>
          <p class="tour__fact" ${U()}><b>${LL.I18N.mode === "mix" ? "کیا آپ جانتے ہیں؟" : t("didYouKnow")}</b> ${fx(fact)}</p>
          <div class="tour__nav">
            ${prev ? `<a class="btn btn--ghost btn--sm" href="#/tour/${prev.id}">← ${t("prev")}</a>` : "<span></span>"}
            ${next ? `<a class="btn btn--gold btn--sm" href="#/tour/${next.id}">${t("next")} →</a>` : `<a class="btn btn--gold btn--sm" href="#/tour/done">${t("next")} →</a>`}
          </div>
          <p class="tour__links"><a class="btn btn--ghost btn--sm" href="#/site/${s.id}">${ico("flag")} ${t("fullStory")} →</a></p>
        </aside>
      </section>`;
    document.body.classList.add("on-tour");

    const stage = $("#stage");
    async function show(i) {
      if (!views.length) return;
      cur = i;
      const my = ++token, v = views[i];
      const img = new Image();
      img.alt = cap(v) || s.name.en;
      img.decoding = "async";
      img.src = v.url;
      try { await img.decode(); } catch (e) {}
      if (my !== token) return;
      viewer && viewer.destroy();
      stage.querySelector(".tour__loading") && stage.querySelector(".tour__loading").remove();
      viewer = LL.Viewer(stage, img, v.w || img.naturalWidth, v.h || img.naturalHeight);
      stage.classList.remove("is-enter"); void stage.offsetWidth; stage.classList.add("is-enter");
      const wide = (v.w || img.naturalWidth) / (v.h || img.naturalHeight) >= 2;
      $("#kind").textContent = wide ? t("panoLabel") : t("photoLabel");
      document.querySelectorAll("#thumbs button").forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    }
    (async () => {
      const list = [];
      if (cfg.pano && cfg.pano.src) {
        const ok = await LL.Photos.probe(cfg.pano.src);
        if (ok) list.push({ url: cfg.pano.src, local: true, by: cfg.pano.by || (cfg.photo && cfg.photo.by) || "", caption: s.name.en, w: ok.w, h: ok.h });
      }
      const g = await LL.Photos.gallery(s.id, innerWidth > 900 ? 1920 : 1280);
      views = list.concat(g.filter((x) => !list.some((y) => y.url === x.url)));
      if (!views.length) { LL.Photos.placeholder(s.id, stage, true); return; }
      const th = $("#thumbs");
      views.forEach((v, k) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", cap(v) || `View ${k + 1}`);
        b.innerHTML = `<img src="${v.file && !v.local ? LL.ASSETS.commons(v.file, 330) : v.url}" alt="" loading="lazy">`;
        b.addEventListener("click", () => show(k));
        th.appendChild(b);
      });
      show(0);
    })();

    if (window.DeviceOrientationEvent && matchMedia("(hover: none)").matches) $('[data-a="motion"]').hidden = false;
    let motion = false;
    main().querySelector(".tour__tools").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-a]");
      if (!b || !viewer) return;
      const a = b.dataset.a;
      if (a === "in") viewer.zoom(1.25);
      if (a === "out") viewer.zoom(0.8);
      if (a === "motion") { motion = !motion; const ok = await viewer.setMotion(motion); b.classList.toggle("is-on", motion && ok); if (!ok) motion = false; }
      if (a === "full") {
        const el = main().querySelector(".tour");
        if (document.fullscreenElement) document.exitFullscreen();
        else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      }
    });
    stage.addEventListener("viewer:interact", () => { const h = $("#hint"); if (h) h.classList.add("is-hidden"); }, { once: true });
    setTimeout(() => { const h = $("#hint"); if (h) h.classList.add("is-hidden"); }, 4500);

    return () => { viewer && viewer.destroy(); document.body.classList.remove("on-tour"); };
  }

  /* ---------- content from official heritage bodies ---------- */
  function officialBlock(id) {
    const O = LL.OFFICIAL;
    if (!O) return "";
    if (id === "shahi-hammam") {
      const h = O.hammam;
      return `<section class="block official">
        <h2>${esc(pick(h.title))}</h2>
        <p class="lead" ${U()}>${fx(pick(h.lead))}</p>
        <ol class="saga">${h.steps.map((x) => `<li><b class="saga__year">${esc(x.year)}</b><p ${U()}>${fx(pick(x))}</p></li>`).join("")}</ol>
        <div class="story-grid" data-box="story">${(LL.HAMMAM_STORY || []).map((g, i) => `<button class="story-grid__item${i < 4 ? " is-board" : ""}" data-i="${i}"><img src="${g.small}" alt="${esc(cap(g))}" loading="lazy" width="${g.w}" height="${g.h}"><span>${fx(cap(g))}</span></button>`).join("")}</div>
      </section>`;
    }
    if (id === "lahore-museum") {
      const m = O.museum;
      return `<section class="block official">
        <h2>${esc(pick(m.title))}</h2>
        <p class="lead" ${U()}>${fx(pick(m.lead))}</p>
        <div class="collection" data-box="museum">${(LL.MUSEUM_HIGHLIGHTS || []).map((g, i) => `<button class="collection__item" data-i="${i}"><span class="collection__img"><img src="${g.small}" alt="${esc(g.caption)}" loading="lazy"></span><b>${esc(g.caption)}</b><small>${esc(g.note)}</small></button>`).join("")}</div>
        <p><a class="btn btn--ghost btn--sm" href="${m.vr.url}" target="_blank" rel="noopener">${ico("tour")} ${esc(m.vr.label.en)} ↗</a></p>
      </section>`;
    }
    if (id === "lahore-fort" || id === "shalimar-gardens") {
      const f = id === "lahore-fort" ? O.fort : O.shalimar;
      return `<section class="block official">
        <h2>${esc(pick(f.title))}</h2>
        <ul class="official__facts" ${U()}>${f.facts.map((x) => `<li>${fx(pick(x))}</li>`).join("")}</ul>
        ${f.access ? `<div class="access"><h3>${ico("me")} ${esc(pick(f.access.title))}</h3><ul ${U()}>${f.access.items.map((x) => `<li>${fx(pick(x))}</li>`).join("")}</ul></div>` : ""}
      </section>`;
    }
    return "";
  }
  /* photo grids inside official blocks open in the full-screen viewer */
  function wireOfficial(root) {
    root.querySelectorAll("[data-box]").forEach((box) => {
      const list = box.dataset.box === "story" ? LL.HAMMAM_STORY : LL.MUSEUM_HIGHLIGHTS;
      const items = list.map((g) => ({ ...g, url: g.src, official: true, caption: g.note ? `${g.caption} · ${g.note}` : g.caption }));
      box.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) LL.UI.openBox(items, +b.dataset.i); });
    });
  }
  function toursBlock() {
    const T = LL.OFFICIAL && LL.OFFICIAL.tours;
    if (!T) return "";
    return `<section class="wcla-tours">
      <h2>${esc(pick(T.title))}</h2>
      <p ${U()}>${fx(pick(T.lead))}</p>
      <ul>${T.list.map(([n, slug]) => `<li><a href="${T.base}${slug}/" target="_blank" rel="noopener">${ico("flag")} ${esc(n)} <span aria-hidden="true">↗</span></a></li>`).join("")}</ul>
    </section>`;
  }

  /* the 360° Royal Trail, as a feature band */
  function trailBand(cls = "") {
    const st = LL.TRAIL360.stops, pick5 = [0, 3, 5, 10, 14].map((i) => st[i]);
    return `<a class="trailband ${cls}" href="#/trail">
      <span class="trailband__strip">${pick5.map((s) => `<img src="${LL.Trail360.thumb(s.id)}" alt="" loading="lazy">`).join("")}</span>
      <span class="trailband__text">
        <span class="eyebrow">${t("trailNew")} · 360°</span>
        <b>${t("trailTitle")}</b>
        <span class="trailband__lead">${t("trailLead")}</span>
        <span class="btn btn--gold">${ico("tour")} ${t("trailCta")}</span>
      </span></a>`;
  }

  function tourIntro(done) {
    main().innerHTML = `
      <section class="tour-intro">
        <div class="tour-intro__photo" id="ti-photo"></div>
        <div class="tour-intro__inner wrap-narrow">
          <p class="eyebrow">${done ? "✓" : t("farEyebrow")}</p>
          <h1>${done ? t("tourDone") : t("farTitle")}</h1>
          <p class="lead">${done ? t("tourDoneText") : t("farText")}</p>
          <div class="actions">
            ${done ? `<a class="btn btn--gold" href="#/quiz">${t("quizCta")}</a><a class="btn btn--ghost" href="#/plan">${t("planTitle")}</a>`
                   : `<a class="btn btn--gold" href="#/tour/${LL.SITES[0].id}">${t("tourStart")} →</a>`}
          </div>
          ${done ? "" : trailBand("trailband--intro")}
          ${LL.AREAS.map((a) => `<h3 class="tour-area">${esc(a.name.en)} <span lang="ur">${esc(a.name.ur)}</span></h3>
          <ol class="tour-list">${LL.SITES.map((s, i) => (s.area !== a.id ? "" : `<li><a href="#/tour/${s.id}"><span class="n">${i + 1}</span>${esc(s.name.en)} <span lang="ur">${esc(s.name.ur)}</span>${LL.Progress.state.seen[s.id] ? '<span class="seen">✓</span>' : ""}</a></li>`)).join("")}</ol>`).join("")}
        </div>
      </section>`;
    $("#ti-photo").appendChild(media(done ? "minar-e-pakistan" : "lahore-fort", { width: innerWidth > 900 ? 1920 : 960, eager: true, start: done ? 0 : 3 }));
  }

  /* ---------------- map: full screen, nearest first ---------------- */
  function mapPage(param) {
    const G = LL.Game;
    const near = param === "near", areaId = param && param.startsWith("area-") ? param.slice(5) : null;
    const focusId = param && site(param) ? param : null;
    document.body.classList.add("on-map");
    main().innerHTML = `
      <section class="mapview">
        <div class="mapview__map" id="bigmap"></div>
        <div class="mapview__chips chips" id="map-chips">
          <button data-v="" aria-selected="${!areaId}">${t("allAreas")}</button>
          ${LL.AREAS.map((a) => `<button data-v="${a.id}" aria-selected="${areaId === a.id}">${esc(a.name.en)}</button>`).join("")}
        </div>
        <section class="sheet" id="sheet" data-state="peek">
          <button class="sheet__handle" id="sheet-handle" aria-label="${t("showList")}"><i></i></button>
          <header class="sheet__head"><b id="sheet-title"></b><button class="btn btn--ghost btn--sm" id="near-btn">${ico("pin")} ${t("nearMe")}</button></header>
          <ol class="sheet__list" id="sheet-list"></ol>
        </section>
      </section>`;
    let filter = areaId, order = "area";
    const sheet = $("#sheet"), list = $("#sheet-list");
    const setSheet = (st) => { sheet.dataset.state = st; };
    const distOf = (id) => (LL.ME && LL.GEO[id] ? G.distance(LL.ME, LL.GEO[id]) : null);

    const m = LL.LahoreMap($("#bigmap"), {
      me: true,
      padBottom: 150,
      pins: LL.SITES.map((x) => ({ id: x.id, at: LL.GEO[x.id], name: x.name.en, short: x.name.en.replace(/^Tomb of /, "").replace(/ \(.*\)$/, ""), level: G.level(x.id) })),
      focus: focusId ? [focusId] : areaId ? LL.SITES.filter((x) => x.area === areaId).map((x) => x.id) : null,
      nextUp: (LL.SITES.find((x) => G.level(x.id) === "new") || {}).id,
      nextLabel: t("nextUp"),
      onOpen: () => setSheet("peek"),
      onMe: () => { if (order === "near") drawList(); },
      cardHtml: (pin) => {
        const x = site(pin.id), d = distOf(x.id);
        return `<p class="lmap__era">${esc(x.era.en)}${d != null && d < 40000 ? ` · <b>${fmtDist(d)}</b>` : ""}</p>
          <b class="lmap__name">${esc(x.name.en)} <span lang="ur">${esc(x.name.ur)}</span></b>
          ${statusChip(x.id)}
          <div class="lmap__acts">
            <a class="btn btn--gold btn--sm" href="#/site/${x.id}">${t("open")} →</a>
            <a class="btn btn--ghost btn--sm" href="${maps(x.name.en + ", Lahore")}" target="_blank" rel="noopener">${ico("pin")} ${t("directions")} ↗</a>
          </div>`;
      },
    });

    function drawList() {
      let items = LL.SITES.filter((x) => !filter || x.area === filter);
      if (order === "near" && LL.ME) items = items.slice().sort((a, b) => distOf(a.id) - distOf(b.id));
      $("#sheet-title").textContent = order === "near" && LL.ME ? t("nearestFirst", items.length) : filter ? `${area(filter).name.en} · ${t("placesCount", items.length)}` : t("placesCount", items.length);
      list.innerHTML = "";
      items.forEach((x) => {
        const d = distOf(x.id);
        const li = document.createElement("li");
        li.innerHTML = `<button class="pl" data-id="${x.id}">
            <span class="pl__ph"></span>
            <span class="pl__body"><b>${esc(x.name.en)}</b><small>${esc(area(x.area).name.en)}${d != null && d < 40000 ? ` · <em>${fmtDist(d)}</em>` : ""}</small>${G.level(x.id) !== "new" ? statusChip(x.id) : ""}</span>
          </button>
          <a class="pl__go" href="${maps(x.name.en + ", Lahore")}" target="_blank" rel="noopener" aria-label="${t("directions")}: ${esc(x.name.en)}">${ico("route")}</a>`;
        li.querySelector(".pl__ph").appendChild(media(x.id, { width: 330 }));
        list.appendChild(li);
      });
    }
    list.addEventListener("click", (e) => { const b = e.target.closest(".pl"); if (b) m.focus(b.dataset.id); });
    $("#map-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]");
      if (!b) return;
      document.querySelectorAll("#map-chips button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      filter = b.dataset.v || null;
      m.close();
      m.show(filter ? LL.SITES.filter((x) => x.area === filter).map((x) => x.id) : null);
      drawList();
    });
    const nearMe = async () => {
      const b = $("#near-btn");
      b.disabled = true;
      const pos = await m.locate(true);
      b.disabled = false;
      if (!pos) {
        toast(t("noLocation2"));
        // Guide user to browse by area instead of leaving them stuck
        setSheet("half");
        const chips = $("#map-chips");
        chips.classList.add("chips--highlight");
        setTimeout(() => chips.classList.remove("chips--highlight"), 2000);
        return;
      }
      if (G.distance(pos, [31.58, 74.33]) > 40000) toast(t("farAway"));
      order = "near"; filter = null;
      document.querySelectorAll("#map-chips button").forEach((x, i) => x.setAttribute("aria-selected", String(i === 0)));
      drawList(); setSheet("half");
    };
    $("#near-btn").addEventListener("click", nearMe);
    // sheet: tap the handle or drag it
    $("#sheet-handle").addEventListener("click", () => setSheet({ peek: "half", half: "full", full: "peek" }[sheet.dataset.state]));
    let sy = null;
    sheet.addEventListener("touchstart", (e) => { if (e.target.closest(".sheet__handle, .sheet__head")) sy = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener("touchend", (e) => {
      if (sy == null) return;
      const dy = e.changedTouches[0].clientY - sy; sy = null;
      const order3 = ["peek", "half", "full"], i = order3.indexOf(sheet.dataset.state);
      if (dy < -30) setSheet(order3[Math.min(2, i + 1)]);
      if (dy > 30) setSheet(order3[Math.max(0, i - 1)]);
    });
    drawList();
    if (near) setTimeout(nearMe, 300);
    if (focusId) setTimeout(() => m.focus(focusId), 700);
    return () => { m.destroy(); document.body.classList.remove("on-map"); };
  }

  /* ---------------- me: progress, rank, badges ---------------- */
  function mePage() {
    const G = LL.Game, P = LL.Progress, rk = G.rank();
    const earnedN = G.BADGES.filter((b) => P.state.badges[b.id]).length;
    main().innerHTML = `
      <section class="me wrap">
        <header class="me__head">
          <div><p class="eyebrow">${t("meEyebrow")}</p><h1>${t("mapTitle")}</h1><p class="lead">${t("mapLead")}</p></div>
          <div class="rank">
            <span class="rank__icon">${ico("crown")}</span>
            <div class="rank__body">
              <small>${rk.points} pts</small>
              <b>${esc(rk.en)} <span lang="ur">${esc(rk.ur)}</span></b>
              <span class="bar"><i style="width:${Math.round(rk.pct * 100)}%"></i></span>
              <small>${rk.next ? t("ptsTo", rk.toNext, esc(rk.next.en)) : t("maxRank")}</small>
            </div>
          </div>
        </header>
        <div class="stats">
          <div><b class="count">${P.seenCount()}</b><small>/${TOTAL()}</small><span>${t("statSeen")}</span></div>
          <div><b>${P.stampCount()}</b><span>${t("statStamps")}</span></div>
          <div><b>${P.visitedCount()}</b><span>${t("statVisited")}</span></div>
          <div><b>${earnedN}</b><small>/${G.BADGES.length}</small><span>${t("statBadges")}</span></div>
        </div>
        <div class="langpick" role="group" aria-label="${t("langTitle")}">
          <div><b>${t("langTitle")}</b><small>${t("langHint")}</small></div>
          <div class="langpick__opts">
            <button data-lang="mix" aria-pressed="${LL.I18N.mode === "mix"}">${t("langMix")}</button>
            <button data-lang="en" aria-pressed="${LL.I18N.mode === "en"}">${t("langEn")}</button>
          </div>
        </div>
        <div class="me__links">
          <a class="btn btn--gold" href="#/map">${ico("map")} ${t("openMap")}</a>
          <a class="btn btn--ghost" href="#/quiz">${ico("quiz")} ${t("quizTitle")}</a>
        </div>

        <h2 class="me__h">${t("areasTitle")}</h2>
        <div class="areas-prog">${LL.AREAS.map((a) => {
          const g = G.area(a.id), list = LL.SITES.filter((x) => x.area === a.id);
          return `<div class="ap">
            <div class="ap__top"><b>${esc(a.name.en)} <span lang="ur">${esc(a.name.ur)}</span></b><span>${g.have}/${g.need}</span></div>
            <span class="bar"><i style="width:${(g.have / g.need) * 100}%"></i></span>
            <div class="ap__thumbs">${list.map((x) => `<a href="#/site/${x.id}" class="ap__t is-${G.level(x.id)}" data-ph="${x.id}" title="${esc(x.name.en)}" aria-label="${esc(x.name.en)}"></a>`).join("")}</div>
          </div>`;
        }).join("")}</div>

        <h2 class="me__h">${t("badgesTitle")} <small>${earnedN}/${G.BADGES.length}</small></h2>
        <div class="badges">${G.BADGES.map((b) => {
          const [h, n] = b.prog(), got = P.state.badges[b.id] || (h >= n);
          return `<div class="badge ${got ? "is-on" : ""}">
            <span class="badge__icon">${ico(b.icon)}</span>
            <b>${esc(b.en)}</b><span class="badge__ur" lang="ur">${esc(b.ur)}</span>
            <p>${esc(b.how)}</p>
            ${got ? `<small class="badge__got">${ico("check")} ${P.state.badges[b.id] ? t("badgeEarned", P.state.badges[b.id]) : ""}</small>` : `<span class="bar"><i style="width:${(h / n) * 100}%"></i></span><small>${h}/${n}</small>`}
          </div>`;
        }).join("")}</div>

        <details class="pts"><summary>${t("pointsTitle")}</summary>
          <table>${t("pointsRows").map(([k, v]) => `<tr><td>${k}</td><td>+${v}</td></tr>`).join("")}</table>
          <p class="hint">${G.RANKS.map((r) => `${esc(r.en)} ${r.min}+`).join(" · ")}</p>
        </details>
      </section>`;
    main().querySelectorAll("[data-ph]").forEach((el) => el.appendChild(media(el.dataset.ph, { width: 330 })));
    LL.Motion.reveal(main(), ".stats > div, .ap, .badge, .me__h");
  }

  /* ---------------- plan: pick your time, then follow the stops ---------------- */
  function planStops(p) {
    if (p.walk) return LL.WALK.map((w) => ({
      id: w.site ? w.id : null, photo: w.site ? w.id : w.id === "food" ? "food" : null,
      at: LL.GEO[w.id] || LL.GEO_EXTRA[w.id], name: w.name, note: w.note, leg: w.walk, q: w.name.en + ", Lahore",
    }));
    return p.stops.map((st) => {
      const sx = st.site ? site(st.site) : null;
      return {
        id: sx ? sx.id : null, photo: sx ? sx.id : /food street/i.test(st.q || "") ? "food" : null,
        at: sx ? LL.GEO[sx.id] : LL.GEO_EXTRA[st.q], name: sx ? sx.name : st.place, note: st.note, time: st.time, q: sx ? sx.name.en + ", Lahore" : st.q,
      };
    });
  }
  /* walking if every hop is short, otherwise driving */
  function travelMode(stops) {
    const pts = stops.map((s) => s.at).filter(Boolean);
    for (let i = 1; i < pts.length; i++) if (LL.Game.distance(pts[i - 1], pts[i]) > 2500) return "driving";
    return "walking";
  }
  /* one Google Maps link for the whole route, starting from where you are */
  function routeUrl(stops) {
    const names = stops.map((s) => s.q);
    const dest = names[names.length - 1], way = names.slice(0, -1).slice(0, 9);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}${way.length ? `&waypoints=${encodeURIComponent(way.join("|"))}` : ""}&travelmode=${travelMode(stops)}`;
  }
  const stopUrl = (st, mode) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(st.q)}&travelmode=${mode}`;

  function planPage(param) {
    const main3 = LL.PLANS.filter((p) => p.id !== "day2");
    let active = param && LL.PLANS.some((p) => p.id === param) ? param : (LL.PLANS.find((p) => p.recommended) || LL.PLANS[0]).id;
    let overlay = null;
    main().innerHTML = `
      <section class="plan wrap">
        <header class="plan__head">
          <p class="eyebrow">${t("planEyebrow")}</p>
          <h1>${t("planQ")}</h1>
          <div class="choices">${main3.map((p) => `<button class="choice" data-plan="${p.id}">
              <b>${esc(p.label)}</b><small>${t("stopsN", planStops(p).length)} · ${t(travelMode(planStops(p)) === "walking" ? "onFoot" : "byCar")}</small>
              ${p.recommended ? `<em>${t("recommended")}</em>` : ""}</button>`).join("")}</div>
          <button class="linkish plan__more" data-plan="day2">${t("moreDay2")} →</button>
        </header>
        <div id="plan-body"></div>
        <details class="tips">
          <summary>${t("tipsTitle")}</summary>
          <div class="tips__grid">${LL.TIPS.map((x) => `<div class="tip"><span class="tip__icon">${ico(x.icon)}</span><div><b>${esc(x.title)}</b><p ${U()}>${fx(pick(x.text))}</p></div></div>`).join("")}</div>
          <p class="hint">${t("visitNote")}</p>
        </details>
        ${toursBlock()}
      </section>`;
    const body = $("#plan-body");

    const draw = () => {
      const p = LL.PLANS.find((x) => x.id === active);
      const stops = planStops(p), mode = travelMode(stops);
      const done = LL.Progress.state.planDone[p.id] || [];
      const nDone = stops.filter((_, i) => done.includes(i)).length;
      document.querySelectorAll("[data-plan]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.plan === active)));
      body.innerHTML = `
        <div class="plan__top">
          <h2>${esc(p.title.en)}</h2>
          <p class="plan__intro" ${U()}>${fx(pick(p.intro))}</p>
          <div class="plan__bar">
            <button class="btn btn--gold" id="start">${ico("foot")} ${nDone && nDone < stops.length ? t("continueWalk") : t("startWalk")}</button>
            <a class="btn btn--ghost" href="${routeUrl(stops)}" target="_blank" rel="noopener">${ico("route")} ${t("routeAll")}</a>
            <button class="btn btn--ghost" id="share">${ico("share")} ${t("sharePlan")}</button>
            <button class="btn btn--ghost" id="showmap">${ico("map")} ${t("showMap")}</button>
          </div>
          <div class="plan__prog"><span>${t("stopsDone", nDone, stops.length)}</span><span class="bar"><i style="width:${(nDone / stops.length) * 100}%"></i></span>${nDone ? `<button class="linkish" id="reset">${t("reset")}</button>` : ""}</div>
        </div>
        <ol class="stops">
          ${stops.map((st, i) => `
            ${st.leg ? `<li class="leg">${ico("foot")} ${t("walkMin", st.leg)}</li>` : ""}
            <li class="stop ${done.includes(i) ? "is-done" : ""}">
              <button class="stop__tick" data-i="${i}" aria-pressed="${done.includes(i)}" aria-label="${t("markDone")}: ${esc(st.name.en)}">${done.includes(i) ? ico("check") : i + 1}</button>
              <div class="stop__ph" ${st.photo ? `data-ph="${st.photo}"` : ""}></div>
              <div class="stop__body">
                <p class="stop__time">${st.time ? esc(st.time) : t("stop", i + 1)}</p>
                <b>${esc(st.name.en)}</b>
                <p class="stop__note" ${U()}>${fx(pick(st.note))}</p>
                <div class="stop__acts">
                  <a class="btn btn--gold btn--sm" href="${stopUrl(st, mode)}" target="_blank" rel="noopener">${ico("pin")} ${t("navigate")}</a>
                  ${st.id ? `<a class="btn btn--ghost btn--sm" href="#/site/${st.id}">${t("open")}</a>` : ""}
                </div>
              </div>
            </li>`).join("")}
        </ol>`;
      body.querySelectorAll("[data-ph]").forEach((el) => el.appendChild(media(el.dataset.ph, { width: 330 })));
      body.querySelectorAll(".stop__tick").forEach((b) => b.addEventListener("click", () => tick(p, stops, +b.dataset.i, b)));
      const r = $("#reset");
      if (r) r.addEventListener("click", () => { LL.Progress.resetPlan(p.id); draw(); });
      $("#start").addEventListener("click", () => walk(p, stops, mode));
      $("#share").addEventListener("click", () => sharePlan(p, stops));
      $("#showmap").addEventListener("click", () => mapOverlay(p, stops));
      LL.Motion.reveal(body, ".stop, .leg");
    };

    function tick(p, stops, i, b) {
      const on = LL.Progress.togglePlanStop(p.id, i);
      if (on && stops[i].id) { if (!LL.Progress.state.visited[stops[i].id] && b) LL.FX.points(b, LL.Game.PTS.visited); LL.Progress.visit(stops[i].id); }
      const done = LL.Progress.state.planDone[p.id] || [];
      if (on && done.length >= stops.length) { LL.FX.confetti(); toast(t("routeDone")); }
      draw();
    }

    /* full-screen "one stop at a time" mode */
    function walk(p, stops, mode) {
      const done = () => LL.Progress.state.planDone[p.id] || [];
      let i = stops.findIndex((_, k) => !done().includes(k));
      if (i < 0) i = 0;
      overlay && overlay.remove();
      overlay = document.createElement("div");
      overlay.className = "walkmode";
      document.body.appendChild(overlay);
      document.body.classList.add("no-scroll");
      const close = () => { overlay.remove(); overlay = null; document.body.classList.remove("no-scroll"); draw(); };
      const paint = () => {
        const st = stops[i], last = i === stops.length - 1, isDone = done().includes(i);
        overlay.innerHTML = `
          <div class="walkmode__ph" ${st.photo ? `data-ph="${st.photo}"` : ""}></div>
          <button class="walkmode__x" aria-label="${t("close")}">✕</button>
          <div class="walkmode__card">
            <div class="walkmode__prog"><span>${t("stopOf", i + 1, stops.length)}</span><span class="bar"><i style="width:${(done().length / stops.length) * 100}%"></i></span></div>
            ${st.time ? `<p class="stop__time">${esc(st.time)}</p>` : ""}
            <h2>${esc(st.name.en)} <span lang="ur">${esc(st.name.ur)}</span></h2>
            <p class="walkmode__note" ${U()}>${fx(pick(st.note))}</p>
            ${st.leg && i > 0 ? `<p class="hint">${ico("foot")} ${t("walkMin", st.leg)} ${t("fromLast")}</p>` : ""}
            <a class="btn btn--ghost walkmode__nav" href="${stopUrl(st, mode)}" target="_blank" rel="noopener">${ico("pin")} ${t("navigate")}</a>
            <button class="btn btn--gold walkmode__here" id="here">${ico("check")} ${isDone ? (last ? t("finishWalk") : t("nextStop")) : last ? t("hereFinish") : t("hereNext")}</button>
            <div class="walkmode__nav2">
              <button class="linkish" id="prev" ${i === 0 ? "disabled" : ""}>← ${t("prevStop")}</button>
              ${st.id ? `<a class="linkish" href="#/site/${st.id}">${t("aboutPlace")}</a>` : ""}
              <button class="linkish" id="skip" ${last ? "disabled" : ""}>${t("skip")} →</button>
            </div>
          </div>`;
        const ph = overlay.querySelector("[data-ph]");
        if (ph) ph.appendChild(media(ph.dataset.ph, { width: innerWidth > 900 ? 1280 : 960, eager: true }));
        overlay.querySelector(".walkmode__x").addEventListener("click", close);
        overlay.querySelector("#prev").addEventListener("click", () => { i = Math.max(0, i - 1); paint(); });
        overlay.querySelector("#skip").addEventListener("click", () => { i = Math.min(stops.length - 1, i + 1); paint(); });
        const about = overlay.querySelector("a[href^='#/site/']");
        if (about) about.addEventListener("click", close);
        overlay.querySelector("#here").addEventListener("click", (e) => {
          if (!done().includes(i)) {
            LL.Progress.togglePlanStop(p.id, i);
            if (st.id) { if (!LL.Progress.state.visited[st.id]) LL.FX.points(e.currentTarget, LL.Game.PTS.visited); LL.Progress.visit(st.id); }
          }
          if (last) { LL.FX.confetti(); toast(t("routeDone")); return setTimeout(close, 900); }
          i++; paint();
        });
      };
      paint();
    }

    function mapOverlay(p, stops) {
      const o = document.createElement("div");
      o.className = "mapoverlay";
      o.innerHTML = `<div class="mapoverlay__bar"><b>${esc(p.title.en)}</b><button class="btn btn--ghost btn--sm" aria-label="${t("close")}">✕ ${t("close")}</button></div><div class="mapoverlay__map"></div>`;
      document.body.appendChild(o);
      document.body.classList.add("no-scroll");
      const done = LL.Progress.state.planDone[p.id] || [];
      const mm = LL.LahoreMap(o.querySelector(".mapoverlay__map"), {
        me: true, noCluster: true,
        route: stops.map((x) => x.at),
        pins: stops.map((x, i) => (x.at ? { id: x.id || "stop" + i, photo: x.photo, at: x.at, name: x.name.en, num: i + 1, level: done.includes(i) ? "visited" : x.id ? LL.Game.level(x.id) : "seen" } : null)).filter(Boolean),
        cardHtml: (pin) => `<b class="lmap__name">${esc(pin.name)}</b><div class="lmap__acts"><a class="btn btn--gold btn--sm" href="${maps(pin.name + ", Lahore")}" target="_blank" rel="noopener">${ico("pin")} ${t("navigate")}</a>${site(pin.id) ? `<a class="btn btn--ghost btn--sm" href="#/site/${pin.id}">${t("open")}</a>` : ""}</div>`,
      });
      const close = () => { mm.destroy(); o.remove(); document.body.classList.remove("no-scroll"); };
      o.querySelector(".mapoverlay__bar button").addEventListener("click", close);
      o.addEventListener("click", (e) => { if (e.target.closest("a[href^='#/']")) close(); });
    }

    main().querySelector(".plan__head").addEventListener("click", (e) => {
      const b = e.target.closest("[data-plan]");
      if (!b) return;
      active = b.dataset.plan;
      history.replaceState(null, "", `#/plan/${active}`);
      draw();
      $("#plan-body").scrollIntoView({ behavior: LL.Motion.reduce() ? "auto" : "smooth", block: "start" });
    });
    draw();
    return () => { if (overlay) { overlay.remove(); document.body.classList.remove("no-scroll"); } document.querySelectorAll(".mapoverlay").forEach((x) => x.remove()); };
  }

  /* share: native share sheet on phones, WhatsApp link otherwise */
  async function shareText(title, text, url) {
    LL.Analytics && LL.Analytics.event("share", { what: (location.hash || "#/").slice(2) || "home" });
    if (navigator.share) { try { await navigator.share({ title, text, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
    window.open(`https://wa.me/?text=${encodeURIComponent(text + (url ? "\n" + url : ""))}`, "_blank", "noopener");
  }
  function sharePlan(p, stops) {
    const url = location.href.split("#")[0] + `#/plan/${p.id}`;
    const text = `${p.title.en} (Lahore Legacy)\n${stops.map((s, i) => `${i + 1}. ${s.name.en}${s.time ? " · " + s.time : ""}`).join("\n")}\n\n${t("routeAll")}: ${routeUrl(stops)}`;
    shareText(p.title.en, text, url);
  }

  /* ---------------- 60-second quiz ---------------- */
  function quizPage() {
    const TOTAL = 60;
    let timer = null;
    const intro = () => {
      main().innerHTML = `<section class="quiz wrap-narrow">
        <p class="eyebrow">${t("quizEyebrow")}</p><h1>${t("quizTitle")}</h1><p class="lead">${t("quizLead")}</p>
        ${LL.Progress.state.quizBest ? `<p class="best">${t("best")}: <b>${LL.Progress.state.quizBest}</b></p>` : ""}
        <button class="btn btn--gold" id="go">${t("quizCta")}</button></section>`;
      $("#go").addEventListener("click", play);
    };
    const play = () => {
      const qs = shuffle(LL.QUIZ);
      let i = 0, right = 0, answered = 0, left = TOTAL, streak = 0;
      main().innerHTML = `<section class="quiz wrap-narrow">
        <div class="quiz__top"><div class="timer"><i id="bar"></i></div><b id="secs">${left}</b><span class="quiz__score" id="sc">0</span></div>
        <div id="qbox"></div></section>`;
      const draw = () => {
        const q = qs[i % qs.length];
        const opts = shuffle(pick(q.a).map((a, k) => ({ a, k })));
        $("#qbox").innerHTML = `<p class="eyebrow">${esc(site(q.s).name.en)}</p>
          <div ${U()}><p class="q q--big">${fx(pick(q.q))}</p>
          <div class="answers">${opts.map((o) => `<button class="answer" data-k="${o.k}">${fx(o.a)}</button>`).join("")}</div></div>
          <p class="feedback" aria-live="polite"></p>`;
        $("#qbox").querySelectorAll(".answer").forEach((b) => b.addEventListener("click", () => {
          if (left <= 0) return;
          const ok = +b.dataset.k === q.c;
          answered++;
          if (ok) { right++; streak++; } else streak = 0;
          $("#sc").textContent = right;
          $("#qbox").querySelectorAll(".answer").forEach((x) => { x.disabled = true; if (+x.dataset.k === q.c) x.classList.add("is-right"); });
          if (!ok) b.classList.add("is-wrong");
          $("#qbox .feedback").innerHTML = ok ? (streak >= 3 ? `${t("correct")} · ${streak}×` : t("correct")) : `${t("wrong")}: <span ${U()}>${fx(pick(q.a)[q.c])}</span>`;
          i++;
          setTimeout(() => left > 0 && draw(), ok ? 450 : 1100);
        }));
      };
      draw();
      timer = setInterval(() => {
        left--;
        $("#secs").textContent = left;
        $("#bar").style.width = (left / TOTAL) * 100 + "%";
        $("#bar").classList.toggle("is-low", left <= 10);
        if (left <= 0) { clearInterval(timer); done(right, answered); }
      }, 1000);
    };
    const done = (right, answered) => {
      LL.Analytics && LL.Analytics.event("quiz_complete", { score: right, answered });
      const isBest = LL.Progress.quiz(right);
      main().innerHTML = `<section class="quiz wrap-narrow quiz--done">
        <p class="eyebrow">${t("score")}</p>
        <p class="big">${right}<small>/${answered}</small></p>
        <p class="lead">${t("resultLine", right, answered)}${isBest && right ? ` · ${t("best")}!` : ""}</p>
        <div class="actions center">
          <button class="btn btn--gold" id="share">${t("shareScore")}</button>
          <button class="btn btn--ghost" id="again">${t("playAgain")}</button>
        </div>
        <div class="mini-sites">${LL.SITES.filter((x) => x.top).map((s) => `<a href="#/site/${s.id}">${esc(s.name.en)}</a>`).join("")}</div>
      </section>`;
      $("#again").addEventListener("click", play);
      $("#share").addEventListener("click", async () => {
        const cv = await LL.Share.scoreCard(right, answered);
        LL.Share.deliver(cv, "lahore-quiz-score.png", t("shareText", right, answered));
      });
    };
    intro();
    return () => clearInterval(timer);
  }

  /* ---------------- router ---------------- */
  function route() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    const [page, param] = h.split("/");
    return { page: page === "walk" ? "plan" : page || "home", param };
  }
  function go(h) { location.hash = h; }

  /* a distinct <title> and meta description per route — small SEO/sharing win
     even though the site is a single hash-routed page for crawlers */
  const DEFAULT_TITLE = "Lahore Legacy — Lahore Heritage Guide: Places to Visit, Tour Plans & 360° Walled City Tour";
  const DEFAULT_DESC = "A free guide to Lahore's heritage: Badshahi Mosque, Lahore Fort, Shalimar Gardens and 21 more. Visiting times, tickets, ready-made tour plans and a 360° Walled City walk. English and Urdu.";
  function setPageMeta(r) {
    const metaDesc = document.querySelector('meta[name="description"]');
    const set = (title, desc) => { document.title = title; if (metaDesc && desc) metaDesc.setAttribute("content", desc); };
    if (r.page === "site") { const s = site(r.param); if (s) return set(`${s.name.en} — Visiting Times, Tickets & History | Lahore Legacy`, `${s.name.en}, Lahore: ${s.line.en} Visiting times, tickets and what to see, from Lahore Legacy's free heritage guide.`); }
    if (r.page === "trail") return set("Royal Trail in 360° — Walk Through the Walled City | Lahore Legacy", "Walk the Royal Trail in 360°, from Delhi Gate to Wazir Khan's square, across Lahore's Walled City.");
    if (r.page === "plan") return set("Plan a Visit to Lahore's Heritage Sites | Lahore Legacy", "Ready-made tour plans for Lahore's heritage sites, from 2 hours to a full day, with directions and tips.");
    if (r.page === "map") return set("Map of Lahore's Heritage Sites | Lahore Legacy", "An interactive map of Lahore's 24 heritage places, sorted by what's nearest you.");
    if (r.page === "quiz") return set("Lahore Heritage Quiz — How Well Do You Know Lahore? | Lahore Legacy", "A 60-second quiz on Lahore's heritage. Answer what you can, then share your score.");
    set(DEFAULT_TITLE, DEFAULT_DESC);
  }

  function render() { LL.Motion.transition(renderNow); }
  function renderNow() {
    if (cleanup) { cleanup(); cleanup = null; }
    const r = route();
    setPageMeta(r);
    main().classList.remove("is-in"); void main().offsetWidth; main().classList.add("is-in");
    if (r.page === "site") cleanup = sitePage(r.param);
    else if (r.page === "me") mePage();
    else if (r.page === "tour") cleanup = r.param === "done" ? tourIntro(true) : r.param ? tourPage(r.param) : tourIntro();
    else if (r.page === "plan") cleanup = planPage(r.param);
    else if (r.page === "map") cleanup = mapPage(r.param);
    else if (r.page === "quiz") cleanup = quizPage();
    else if (r.page === "trail") cleanup = LL.Trail360.page(main(), r.param, { esc, t, pick, attrs: U, ico });
    else cleanup = home();
    header();
    window.scrollTo(0, 0);
    LL.Ease && LL.Ease.afterRender();
    LL.Delight && LL.Delight.page(main());
  }

  function boot() {
    // language choice (on the Me page)
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lang]");
      if (!b || b.dataset.lang === LL.I18N.mode) return;
      LL.I18N.set(b.dataset.lang);
      LL.Analytics && LL.Analytics.event("language", { mode: LL.I18N.mode });
    });
    document.addEventListener("ll:lang", render);
    document.addEventListener("ll:progress", () => {
      const before = window.__rank;
      header();
      const pill = $("#progress-pill");
      if (pill) { pill.classList.remove("pill--pop"); void pill.offsetWidth; pill.classList.add("pill--pop"); }
      const now = LL.Game.rank().en;
      if (before && before !== now) LL.FX.rank(LL.Game.rank(), ico("crown"));
      LL.Game.check().forEach((b) => (b.id === "first" || b.id === "all" ? toast(`${t("badgeUnlocked")}: ${b.en}`) : LL.FX.badge(b, ico(b.icon))));
      window.__rank = now;
    });
    window.__rank = LL.Game.rank().en;
    LL.Game.check();
    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", () => document.body.classList.toggle("is-scrolled", scrollY > 30), { passive: true });
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
