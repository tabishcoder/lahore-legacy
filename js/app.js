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
    myth: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 3-2.5 4"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    myths: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 3-2.5 4"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    camera: '<rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M15 3l-1.5 3h-3L9 3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4h16v13H6.5A2.5 2.5 0 004 19.5V4z"/>',
    sound: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14"/>',
  };
  const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
  /* content block: renders Urdu by default with an inline EN toggle */
  function cblk(enHtml, urHtml, cls) {
    if (!urHtml) return cls ? `<div class="${cls}" lang="en">${enHtml}</div>` : enHtml;
    const startEn = LL.I18N.mode === "en";
    return `<div class="cblk${cls ? " " + cls : ""}" data-l="${startEn ? "en" : "ur"}">` +
      `<div class="cblk__ur" lang="ur" dir="rtl"${startEn ? " hidden" : ""}>${urHtml}</div>` +
      `<div class="cblk__en" lang="en"${startEn ? "" : " hidden"}>${enHtml}</div>` +
      `<button class="cblk__tog" aria-label="Toggle language">${startEn ? "اردو" : "EN"}</button>` +
      `</div>`;
  }
  let cleanup = null;

  /* ---------------- header ---------------- */
  function header() {
    [["places", "#/"], ["plan", "#/plan"], ["quiz", "#/quiz"], ["myths", "#/myths"], ["me", "#/me"]].forEach(([k]) => {
      const a = $(`#nav-${k}`); a.innerHTML = `${ico(k)}<span>${t(k)}</span>`;
    });
    $("#footer-lang").textContent = `${t("langTitle")}: ${LL.I18N.mode === "mix" ? t("langMix") : t("langEn")} · ${t("langChange")}`;
    const n = LL.Progress.stampCount(), rk = LL.Game.rank();
    const pct = Math.round(rk.pct * 100);
    const toNextTxt = rk.next ? ` · ${rk.toNext} pts to ${rk.next.en}` : "";
    $("#progress-pill").innerHTML = `<span class="pill__seal">${ico("crown")}</span><span class="pill__score"><b>${rk.points}</b><small class="pill__pts-label">pts</small></span><span class="pill__rank">${esc(rk.en)}</span><span class="pill__bar" style="--pct:${pct}%"></span>`;
    $("#progress-pill").title = `${rk.en} · ${rk.points} pts${toNextTxt} · ` + t("progressLine", LL.Progress.seenCount(), n, TOTAL());
    $("#progress-pill").classList.toggle("pill--near-rank", pct > 80 && !!rk.next);
    $("#footer-text").textContent = t("footer");
    const r = route();
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.r === (r.page === "site" ? "home" : r.page)));
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
      <section class="hero hero--home">
        <div class="hero__photo" id="hero-photo"></div>
        <div class="hero__media-cap" id="hero-cap"><span id="hero-cap-text"></span><button class="hero__vbtn" id="hero-vbtn" hidden aria-label="Pause video">❚❚</button></div>
        <div class="hero__inner">
          <p class="eyebrow">${t("heroEyebrow")}</p>
          <h1>${t("heroTitle")}</h1>
          <div class="search" role="search">
            <span class="search__icon">${ico("search")}</span>
            <input id="q" type="search" autocomplete="off" placeholder="${t("searchPh", TOTAL())}" aria-label="${t("searchPh", TOTAL())}">
            <div class="search__results" id="results" hidden></div>
          </div>
          <div class="hero-dock">
            <a class="dock-btn" href="#/plan">${ico("plan")} ${t("actPlan")}</a>
          </div>
          <a class="hero__cue" href="#explore" aria-label="${t("cue")}"><span>${t("cue")}</span><i></i></a>
        </div>
      </section>

      <div class="marquee" id="marquee"></div>

      <section class="glance wrap" id="explore">
        <div><b data-count="${TOTAL()}">${TOTAL()}</b><span>${t("glPlaces")}</span></div>
        <div><b data-count="${LL.PLANS.length}">${LL.PLANS.length}</b><span>${t("glPlans")}</span></div>
        <div><b data-count="${LL.AREAS.length}">${LL.AREAS.length}</b><span>${t("glAreas")}</span></div>
      </section>

      <section class="wrap home-highlights">
        <div class="sites-grid" data-ids="${now.ids.join(",")}"></div>
      </section>

      <section class="all-sites wrap" id="all-sites">
        ${LL.AREAS.map((a) => {
          const areaSites = LL.SITES.filter((s) => s.area === a.id);
          if (!areaSites.length) return "";
          return `<div class="all-sites__group">
            <h3 class="all-sites__area rv">${esc(a.name.en)} <small>${t("placesCount", areaSites.length)}</small></h3>
            <div class="sites-grid" data-ids="${areaSites.map((s) => s.id).join(",")}"></div>
          </div>`;
        }).join("")}
      </section>

      ${stamps >= CERT_AT ? `<section class="wrap"><div class="band band--cert">
        <div><p class="eyebrow">✓ ${stamps}/${TOTAL()}</p><h2>${t("certTitle")}</h2><p>${t("certLead")}</p></div>
        <form class="cert-form" id="cert-form"><label class="sr" for="cert-name">${t("certName")}</label>
          <input id="cert-name" class="input" maxlength="28" placeholder="${t("certName")}" value="${esc(P.state.name)}">
          <button class="btn btn--gold">${t("certCta")}</button></form>
      </div></section>` : ""}

      <section class="discover-outer">
        <div class="wrap"><div class="discover-section rv">
          <div class="discover-hd"><h2>Explore More</h2><p>Go beyond the guidebook</p></div>
          <div class="discover-grid">
            <a class="discover-card dc--myths" href="#/myths">
              <span class="dc__icon">${ico("myth")}</span>
              <strong>Myth or Truth?</strong>
              <span>15 claims about Lahore's heritage — which are fact, which are fiction?</span>
              <span class="dc__cta">Play now →</span>
            </a>
            <a class="discover-card dc--persona" href="#/persona">
              <span class="dc__icon">${ico("crown")}</span>
              <strong>Which Monument Are You?</strong>
              <span>7 questions. Discover your Lahore personality in 60 seconds.</span>
              <span class="dc__cta">Find out →</span>
            </a>
            <a class="discover-card dc--1947" href="#/1947">
              <span class="dc__icon">${ico("book")}</span>
              <strong>Lahore 1947</strong>
              <span>Three quiet stories from the year the city became two worlds.</span>
              <span class="dc__cta">Read the stories →</span>
            </a>
          </div>
        </div></div>
      </section>

      <section class="wrap">
        <a class="band band--quiz" href="#/quiz">
          <div><p class="eyebrow">${t("quizEyebrow")}</p><h2>${t("quizTitle")}</h2>
          ${P.state.quizBest ? `<p class="best">${t("best")}: <b>${P.state.quizBest}</b></p>` : `<p>${t("quizLead")}</p>`}</div>
          <span class="btn btn--gold">${t("quizCta")}</span>
        </a>
      </section>`;

    // Cinema slideshow — all sites cycle every 3 s
    const heroBox = $("#hero-photo"), vbtn = $("#hero-vbtn");
    if (vbtn) vbtn.hidden = true;
    let si = 0;
    const hSlides = LL.SITES.map((s, i) => {
      const div = document.createElement("div");
      div.className = "slide" + (i === 0 ? " is-on" : "");
      const img = media(s.id, { width: 1400 });
      if (i > 2) img.loading = "lazy";
      div.appendChild(img);
      heroBox.appendChild(div);
      return { el: div, s };
    });
    function cinemaGo(n) {
      hSlides[si].el.classList.remove("is-on");
      si = ((n % hSlides.length) + hSlides.length) % hSlides.length;
      hSlides[si].el.classList.add("is-on");
    }
    cinemaGo(0);
    const cinemaT = setInterval(() => cinemaGo(si + 1), 1800);
    LL.Motion.parallax(heroBox);

    // swipe rows
    main().querySelectorAll(".sites-grid").forEach((row) => {
      row.dataset.ids.split(",").forEach((id) => { const s = site(id); if (s) row.appendChild(homeCard(s)); });
    });
    LL.Ease && LL.Ease.rowArrows(main());
    LL.Delight.marquee($("#marquee"), LL.SITES.map((x) => esc(x.name.en)));
    const stopRows = LL.Delight.rows(main());
    LL.Delight.tiltCards(main());
    $(".hero__cue").addEventListener("click", (e) => { e.preventDefault(); $("#explore").scrollIntoView({ behavior: "smooth", block: "start" }); });
    const back = LL.Motion.lastMorph();
    if (back) { const c = main().querySelector(`.tile[href="#/site/${back}"] .media`); if (c) c.style.viewTransitionName = "hero-photo"; }
    LL.Motion.reveal(main(), ".band, .glance > div, .discover-section, .all-sites__area, .sites-grid .hc");

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
      res.innerHTML = list.length ? list.map((s) => `<a class="sr-item" href="#/site/${s.id}" data-ph="${s.id}"><span><b>${esc(s.name.en)}</b><small>${esc((area(s.area) || { name: { en: "" } }).name.en)} · ${esc(s.era.en)}</small></span></a>`).join("") : `<p class="sr-none">${t("noResults")}</p>`;
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
    return () => { clearInterval(cinemaT); stopRows(); };
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
      <span class="tile__body"><small>${esc(s.era.en)}</small><b>${esc(s.name.en)}</b></span>`);
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
        <h3>${esc(s.name.en)}</h3>
        <p class="card__line">${esc(s.line.en)}</p>
      </div>`);
    return a;
  }

  function statusChip(id) {
    const lv = LL.Game.level(id);
    if (lv === "new") return `<span class="status status--new">${t("stNew")}</span>`;
    const g = LL.Game.status(id);
    return `<span class="status status--${lv}">${lv === "visited" ? `${ico("check")} ${t(g.gps ? "stVerified" : "stVisited")}` : lv === "stamp" ? `★ ${t("stamped")}` : `${ico("eye")} ${t("stSeen")}`}</span>`;
  }

  /* large photo card for the home page 24-sites grid */
  function homeCard(s) {
    const a = document.createElement("a");
    a.className = "hc";
    a.href = `#/site/${s.id}`;
    a.appendChild(media(s.id, { width: 700, start: 1 }));
    const seen = LL.Game.level(s.id) !== "new";
    a.insertAdjacentHTML("beforeend", `
      <div class="hc__overlay" aria-hidden="true"></div>
      ${seen ? `<span class="hc__seen" aria-label="Visited">✓</span>` : ""}
      <div class="hc__body">
        <p class="hc__era">${esc(s.era.en)}</p>
        <b class="hc__name">${esc(s.name.en)}</b>
        <span class="hc__cta">Explore <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </div>`);
    return a;
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
      <h4>${esc(s.name.en)}</h4>
      <p class="mini__line">${esc(s.line.en)}</p></div>`);
    return a;
  }

  /* ---------------- helpers for new features ---------------- */
  function photoSpotsHtml(id) {
    const spots = LL.PHOTO_SPOTS && LL.PHOTO_SPOTS[id];
    if (!spots || !spots.length) return "";
    return `<section class="block photo-spots">
      <h2>${ico("camera")} Photo Spots</h2>
      <p class="hint">Best angles and tips for photographing this place.</p>
      <ul class="spots-list">${spots.map((sp) => `
        <li class="spot-tip rv">
          <b class="spot-angle">${esc(sp.angle)}</b>
          <p class="spot-text">${esc(sp.tip)}</p>
          <span class="spot-time">${ico("clock")} ${esc(sp.bestTime)}</span>
        </li>`).join("")}
      </ul>
    </section>`;
  }

  /* ---- Learn / deep-read page ---- */
  function learnPage(id) {
    const s = site(id);
    if (!s) return go("#/");

    const facts_en = (s.facts && s.facts.en) || [];
    const facts_ur = (s.facts && s.facts.ur) || [];
    const look_en = (s.look && s.look.en) || [];
    const look_ur = (s.look && s.look.ur) || [];
    const spots = LL.PHOTO_SPOTS && LL.PHOTO_SPOTS[id] || [];
    const O = LL.OFFICIAL;

    main().innerHTML = `
      <div class="learn-page">
        <header class="learn__header wrap-narrow">
          <a class="back" href="#/site/${id}">← Back to ${esc(s.name.en)}</a>
          <h1 class="learn__h1">${esc(s.name.en)}</h1>
          <p class="learn__line">${esc(s.line.en)}</p>
        </header>

        <div class="learn__body wrap-narrow">

          <section class="learn__section">
            <h2 class="learn__h2">The story</h2>
            ${cblk(
              fx(s.story && s.story.en || "").split(/\n+/).map(p => `<p>${p}</p>`).join(""),
              s.story && s.story.ur ? fx(s.story.ur).split(/\n+/).map(p => `<p>${p}</p>`).join("") : null,
              "learn__story"
            )}
          </section>

          ${(s.history && s.history.en && s.history.en.length) ? s.history.en.map((sec, i) => {
            const urSec = s.history.ur && s.history.ur[i];
            const enHtml = fx(sec.body || "").split(/\n+/).map(p => `<p>${p}</p>`).join("");
            const urHtml = urSec ? fx(urSec.body || "").split(/\n+/).map(p => `<p>${p}</p>`).join("") : null;
            return `<section class="learn__section">
              <h2 class="learn__h2">${esc(sec.heading || "")}</h2>
              ${cblk(enHtml, urHtml, "learn__story")}
            </section>`;
          }).join("") : ""}

          ${facts_en.length ? `<section class="learn__section">
            <h2 class="learn__h2">Key facts</h2>
            ${cblk(
              `<ol class="learn__facts" lang="en">${facts_en.map((f, i) => `<li class="learn__fact rv"><span class="learn__fact-num">${i + 1}</span><p>${fx(f)}</p></li>`).join("")}</ol>`,
              facts_ur.length ? `<ol class="learn__facts" lang="ur" dir="rtl">${facts_ur.map((f, i) => `<li class="learn__fact rv"><span class="learn__fact-num">${i + 1}</span><p>${fx(f)}</p></li>`).join("")}</ol>` : null
            )}
          </section>` : ""}

          ${(s.secrets && s.secrets.en && s.secrets.en.length) ? `
          <section class="learn__section learn__section--secrets">
            <h2 class="learn__h2">Hidden facts &amp; lesser-known history</h2>
            ${cblk(
              `<ul class="learn__secrets" lang="en">${s.secrets.en.map((sec, i) => `<li class="learn__secret rv"><span class="learn__fact-num learn__secret-icon">${i + 1}</span><p>${fx(sec)}</p></li>`).join("")}</ul>`,
              s.secrets.ur && s.secrets.ur.length ? `<ul class="learn__secrets" lang="ur" dir="rtl">${s.secrets.ur.map((sec, i) => `<li class="learn__secret rv"><span class="learn__fact-num learn__secret-icon">${i + 1}</span><p>${fx(sec)}</p></li>`).join("")}</ul>` : null
            )}
          </section>` : ""}

          ${look_en.length ? `<section class="learn__section">
            <h2 class="learn__h2">What to look for</h2>
            <p class="hint">Things worth noticing when you visit.</p>
            ${cblk(
              `<ul class="learn__look" lang="en">${look_en.map(l => `<li class="rv"><span>${fx(l)}</span></li>`).join("")}</ul>`,
              look_ur.length ? `<ul class="learn__look" lang="ur" dir="rtl">${look_ur.map(l => `<li class="rv"><span>${fx(l)}</span></li>`).join("")}</ul>` : null
            )}
          </section>` : ""}

          ${spots.length ? `<section class="learn__section">
            <h2 class="learn__h2">${ico("camera")} Photo spots</h2>
            <p class="hint">Best angles and tips for photographing this place.</p>
            <ul class="spots-list">${spots.map((sp) => `
              <li class="spot-tip rv">
                <b class="spot-angle">${esc(sp.angle)}</b>
                <p class="spot-text">${esc(sp.tip)}</p>
                <span class="spot-time">${ico("clock")} ${esc(sp.bestTime)}</span>
              </li>`).join("")}
            </ul>
          </section>` : ""}

          <section class="learn__section">
            <h2 class="learn__h2">Then &amp; now</h2>
            <div id="learn-thennow"><p class="hint">Loading comparison…</p></div>
          </section>

          <section class="learn__section">
            <h2 class="learn__h2">Gallery</h2>
            <div class="strip" id="learn-strip"></div>
          </section>

          <section class="block check" id="check"></section>

          <div class="learn__back-cta">
            <a class="btn btn--gold" href="#/site/${id}">${ico("back")} Back to ${esc(s.name.en)}</a>
            <a class="btn btn--ghost" href="#/tour/${id}">${ico("tour")} 360° view</a>
          </div>
        </div>
      </div>`;

    LL.Motion.reveal(main(), ".learn__fact, .learn__secret, .learn__look li, .spot-tip, .learn__back-cta");
    miniQuiz(id);

    const strip = $("#learn-strip");
    LL.Photos.candidates(id, 500).forEach((g, i) => {
      const b = document.createElement("button");
      b.className = "strip__item";
      b.setAttribute("aria-label", cap(g));
      b.appendChild(media(id, { width: 500, start: i, label: false }));
      b.insertAdjacentHTML("beforeend", `<span>${fx(cap(g))}</span>`);
      b.addEventListener("click", () => lightbox(id, i));
      strip.appendChild(b);
    });

    Promise.all([LL.Photos.old(id, 960), LL.Photos.resolve(id, 960, 0)]).then(([oldP, nowP]) => {
      const box = $("#learn-thennow");
      if (!box || !oldP || !nowP) { if (box) box.innerHTML = "<p class='hint'>No historical photo available for this site.</p>"; return; }
      box.innerHTML = `<p class="hint">${t("thenNowHint")}</p>
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

    if (O) wireOfficial(main());
  }

  /* ---- Myths page ---- */
  function mythsPage() {
    const u = U();
    main().innerHTML = `
      <div class="feature-page">
        <header class="feature-header wrap-narrow">
          <a class="back" href="#/">← ${t("back")}</a>
          <p class="eyebrow">Test Yourself</p>
          <h1>Myth or Truth?</h1>
          <p class="lead">15 claims about Lahore's heritage. Can you tell the real from the legend?</p>
          <div class="myths-scoreline"><span>Score <b id="myth-score">0</b> / ${(LL.MYTHS || []).length}</span><span id="myth-remain">0 answered</span></div>
        </header>
        <div class="myths-grid wrap">
          ${(LL.MYTHS || []).map((m) => `
            <div class="myth-card myth-card--${m.category} rv" data-id="${m.id}" data-verdict="${m.verdict}">
              <span class="myth-cat myth-cat--${m.category}">${m.category}</span>
              ${cblk(esc(m.claim && m.claim.en || ""), m.claim && m.claim.ur ? esc(m.claim.ur) : null, "myth-claim")}
              <div class="myth-vote-row">
                <button class="myth-btn myth-btn--truth" data-v="truth">✓ Truth</button>
                <button class="myth-btn myth-btn--myth" data-v="myth">✗ Myth</button>
                <button class="myth-btn myth-btn--legend" data-v="legend">? Legend</button>
              </div>
              <div class="myth-reveal" hidden>
                <span class="myth-verdict mv--${m.verdict}">${m.verdict === "truth" ? "✓ True!" : m.verdict === "myth" ? "✗ Myth!" : "⟡ Legend"}</span>
                ${cblk(esc(m.explanation && m.explanation.en || ""), m.explanation && m.explanation.ur ? esc(m.explanation.ur) : null, "myth-exp")}
              </div>
            </div>`).join("")}
        </div>
      </div>`;

    let answered = 0, score = 0;
    const scoreEl = $("#myth-score"), remainEl = $("#myth-remain");
    main().querySelectorAll(".myth-card").forEach((card) => {
      card.querySelectorAll(".myth-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (card.classList.contains("is-answered")) return;
          const chosen = btn.dataset.v, correct = card.dataset.verdict, right = chosen === correct;
          if (right) { score++; card.classList.add("is-correct"); } else { card.classList.add("is-wrong"); }
          card.classList.add("is-answered");
          card.querySelectorAll(".myth-btn").forEach((b) => { b.disabled = true; if (b.dataset.v === correct) b.classList.add("is-the-truth"); });
          card.querySelector(".myth-reveal").hidden = false;
          answered++;
          scoreEl.textContent = score;
          remainEl.textContent = `${answered} answered`;
          if (right) LL.FX && LL.FX.points(btn, 5);
          if (answered === (LL.MYTHS || []).length && score >= 10) setTimeout(() => LL.FX && LL.FX.confetti && LL.FX.confetti(), 300);
        });
      });
    });
    LL.Motion.reveal(main(), ".myth-card");
  }

  /* ---- Persona quiz ---- */
  function personaPage() {
    if (!LL.PERSONA) return go("#/");
    const qs = LL.PERSONA.questions, results = LL.PERSONA.results;
    let qIdx = 0;
    const tally = {};
    const u = U();

    function drawQ() {
      const q = qs[qIdx], pct = Math.round((qIdx / qs.length) * 100);
      main().innerHTML = `
        <div class="feature-page persona-page">
          <div class="persona-top">
            <a class="back" href="#/">← ${t("back")}</a>
            <div class="persona-prog"><div class="persona-prog__bar"><i style="width:${pct}%"></i></div><span>${qIdx + 1} / ${qs.length}</span></div>
          </div>
          <div class="persona-wrap">
            <p class="persona-num">Question ${qIdx + 1}</p>
            <h2 class="persona-q-text" ${u}>${esc(pick(q.q))}</h2>
            <div class="persona-opts">
              ${q.options.map((o, i) => `<button class="persona-opt" style="--i:${i}" data-m="${o.m}">${esc(pick(o.label))}</button>`).join("")}
            </div>
          </div>
        </div>`;
      main().querySelectorAll(".persona-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          tally[btn.dataset.m] = (tally[btn.dataset.m] || 0) + 1;
          btn.classList.add("is-selected");
          btn.closest(".persona-opts").querySelectorAll(".persona-opt").forEach((b) => { b.disabled = true; });
          setTimeout(() => { qIdx++; qIdx < qs.length ? drawQ() : drawResult(); }, 380);
        });
      });
    }

    function drawResult() {
      const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || "lahore-fort";
      const res = results[winner];
      const siteData = site(winner);
      main().innerHTML = `
        <div class="feature-page persona-result-page">
          <div class="persona-result">
            <div class="persona-result__photo" id="persona-ph"></div>
            <div class="persona-result__body">
              <p class="eyebrow">You are</p>
              <h1 ${u}>${esc(pick(res.title))}</h1>
              <p class="persona-monument">${siteData ? `<a href="#/site/${winner}">${esc(siteData.name.en)}</a>` : ""}</p>
              <p class="persona-tagline" ${u}>${esc(pick(res.tagline))}</p>
              <p class="persona-desc" ${u}>${esc(pick(res.desc))}</p>
              <div class="persona-acts">
                <button class="btn btn--gold" id="persona-share">${ico("share")} Share</button>
                ${siteData ? `<a class="btn btn--ghost" href="#/site/${winner}">${ico("eye")} Visit →</a>` : ""}
                <button class="btn btn--ghost" id="persona-retry">Try Again</button>
              </div>
            </div>
          </div>
        </div>`;
      const ph = $("#persona-ph");
      if (ph && siteData) ph.appendChild(media(winner, { width: 960, eager: true }));
      LL.Motion.reveal(main(), ".persona-result__body");
      setTimeout(() => LL.FX && LL.FX.confetti && LL.FX.confetti(), 400);
      $("#persona-share").addEventListener("click", async () => {
        const title = pick(res.title), monument = siteData ? siteData.name.en : winner;
        const text = `I'm "${title}" (${monument}) according to the Lahore Legacy quiz!`;
        if (navigator.share) { try { await navigator.share({ title: "Lahore Personality Quiz", text, url: location.href }); } catch(e) {} }
        else { try { await navigator.clipboard.writeText(text); toast("Copied!"); } catch(e) {} }
      });
      $("#persona-retry").addEventListener("click", () => { qIdx = 0; Object.keys(tally).forEach(k => delete tally[k]); drawQ(); });
    }

    drawQ();
  }

  /* ---- 1947 Stories page ---- */
  function page1947() {
    const stories = LL.STORIES_1947 || [];
    const u = U();
    const storyHtml = (s) => esc(s).replace(/\*(.*?)\*/g, "<em>$1</em>");
    main().innerHTML = `
      <div class="feature-page page-1947">
        <header class="feature-header wrap-narrow">
          <a class="back" href="#/">← ${t("back")}</a>
          <p class="eyebrow">1947</p>
          <h1>Lahore, Divided</h1>
          <p class="lead">Three quiet stories from the year the city became two cities.</p>
        </header>
        ${stories.map((s, i) => `
          <article class="story-1947 rv" id="story-${s.id}">
            <header class="story-header">
              <span class="story-loc">${esc(s.location && s.location.en || "")}</span>
              <h2>${esc(s.title && s.title.en || "")}</h2>
            </header>
            ${cblk(
              `"${esc(s.pullQuote && s.pullQuote.en || "")}"`,
              s.pullQuote && s.pullQuote.ur ? `"${esc(s.pullQuote.ur)}"` : null,
              "pull-quote"
            )}
            ${cblk(
              (s.story && s.story.en || "").split(/\n\n/).map(p => `<p>${storyHtml(p)}</p>`).join(""),
              s.story && s.story.ur ? (s.story.ur).split(/\n\n/).map(p => `<p>${storyHtml(p)}</p>`).join("") : null,
              "story-body"
            )}
          </article>
          ${i < stories.length - 1 ? '<div class="story-divider wrap-narrow" aria-hidden="true"><span>✦ ✦ ✦</span></div>' : ""}`).join("")}
      </div>`;
    LL.Motion.reveal(main(), ".story-1947");
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
    const cfg = LL.ASSETS.locations[id];

    main().innerHTML = `
      <article class="site">
        <header class="site__hero">
          <div class="site__photo" id="site-photo"></div>
          <div class="site__title">
            <a class="back" href="#/">← ${t("back")}</a>
            <p class="eyebrow">${esc(s.era.en)}${area(s.area) ? ` · ${esc(area(s.area).name.en)}` : ""}${LL.ME && LL.GEO[id] && LL.Game.distance(LL.ME, LL.GEO[id]) < 40000 ? ` · <b class="dist">${fmtDist(LL.Game.distance(LL.ME, LL.GEO[id]))} ${t("away")}</b>` : ""}</p>
            <h1>${esc(s.name.en)}</h1>
            <div class="site__utils">
              <a class="btn btn--ghost btn--sm" href="#/map/${id}">${ico("map")} ${t("onMap")}</a>
              <button class="btn btn--ghost btn--sm" id="share-place">${ico("share")} ${t("sharePlace")}</button>
              <button class="btn btn--ghost btn--sm sounds-btn" id="sounds-btn" hidden>${ico("sound")} Ambience</button>
            </div>
          </div>
        </header>

        <div class="site__body wrap-narrow">
          <section class="site__photo-first">
            <div class="strip" id="strip"></div>
            <div class="site__actions">
              <button class="btn btn--gold btn--sm" id="see-photos">${ico("eye")} ${t("seePhotos")}</button>
              <a class="btn btn--ghost btn--sm" href="#/tour/${id}">${ico("tour")} ${t("virtualView")}</a>
            </div>
          </section>

          <dl class="quick">${(LL.QUICK[id] || []).map(([k, v]) => `<div><dt>${t("quick")[k]}</dt><dd>${fx(v && typeof v === "object" ? v.en : v || "")}</dd></div>`).join("")}</dl>

          <section class="been" id="been"></section>

          ${trailCard(id)}

          <a class="deepread rv" href="#/learn/${id}">
            <span class="deepread__icon">${ico("book")}</span>
            <span class="deepread__body">
              <strong>Full history &amp; story</strong>
              <span>Deep read: facts, what to look for, photo spots, sources &amp; more</span>
            </span>
            <span class="deepread__arrow">→</span>
          </a>

          <section class="block visit">
            <h2>${t("visit")}</h2>
            <dl>${(s.visit && s.visit.en ? s.visit.en : (s.visit || [])).map(([k, v]) => `<div><dt>${fx(k)}</dt><dd>${fx(v)}</dd></div>`).join("")}</dl>
            <p><a class="btn btn--ghost btn--sm" href="${maps(s.name.en + ", Lahore")}" target="_blank" rel="noopener">${ico("pin")} ${t("directions")} ↗</a></p>
            <p class="hint">${t("directionsNote")}. ${t("visitNote")}</p>
          </section>

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
    let sfxAudio = null;
    const soundsBtn = $("#sounds-btn");
    if (soundsBtn) {
      const au = new Audio();
      au.loop = true;
      au.addEventListener("canplaythrough", () => { soundsBtn.hidden = false; }, { once: true });
      let sfxPlaying = false;
      soundsBtn.addEventListener("click", () => {
        if (sfxPlaying) { au.pause(); sfxPlaying = false; soundsBtn.classList.remove("is-playing"); soundsBtn.innerHTML = `${ico("sound")} Ambience`; }
        else { au.play().then(() => { sfxPlaying = true; soundsBtn.classList.add("is-playing"); soundsBtn.innerHTML = `${ico("sound")} ◼ Playing`; }).catch(() => {}); }
      });
      au.src = `assets/audio/${id}.mp3`;
      sfxAudio = au;
    }
    document.body.insertAdjacentHTML("beforeend", '<div id="readbar" class="readbar"></div>');
    LL.Motion.reveal(main(), ".quick > div, .been, .deepread, .strip, .visit dl > div, .next");
    $("#next-media").appendChild(media(next.id, { width: 500 }));

    const strip = $("#strip");
    LL.Photos.candidates(id, 500).forEach((g, i) => {
      const b = document.createElement("button");
      b.className = "strip__item";
      b.setAttribute("aria-label", cap(g));
      b.appendChild(media(id, { width: 500, start: i, label: false }));
      b.insertAdjacentHTML("beforeend", `<span>${fx(cap(g))}</span>`);
      b.addEventListener("click", () => lightbox(id, i));
      strip.appendChild(b);
    });

    $("#share-place").addEventListener("click", () => shareText(s.name.en, `${s.name.en} — ${s.line.en}\n${t("directions")}: ${maps(s.name.en + ", Lahore")}`, location.href));
    $("#see-photos").addEventListener("click", () => lightbox(id, 0));
    beenBox(id);
    nearbyBox(id);
    badgeNudge(id);
    if (wasNew) setTimeout(() => { const h = document.querySelector(".site__title h1"); if (h) LL.FX.points(h, LL.Game.PTS.seen); }, 700);
    return () => { siteVid && siteVid.stop(); if (sfxAudio) { sfxAudio.pause(); sfxAudio.src = ""; } const rb = $("#readbar"); if (rb) rb.remove(); };
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

  async function beenBox(id) {
    const box = $("#been");
    if (!box) return;
    /* Check if geolocation permission is already denied so we can show the right UI */
    let locDenied = false;
    if (navigator.permissions) {
      try {
        const perm = await navigator.permissions.query({ name: "geolocation" });
        locDenied = perm.state === "denied";
        perm.onchange = () => beenBox(id);
      } catch {}
    }
    const st = LL.Game.status(id), G = LL.Game.PTS;
    if (st.visited) {
      box.className = "been is-done";
      box.innerHTML = `<span class="been__icon">${ico("check")}</span>
        <div><b>${t(st.gps ? "beenVerified" : "beenDone")}</b><p>${t("beenDate", LL.Progress.state.visited[id].d)}${st.gps ? "" : ` · <button class="linkish" data-a="gps">${t("beenVerify")}</button>`}${st.gps ? "" : ` · <button class="linkish" data-a="undo">${t("undo")}</button>`}</p></div>`;
    } else {
      const gpsBtn = locDenied
        ? `<button class="btn btn--ghost btn--sm been__loc-off" disabled title="${t("locDeniedTip")}">${ico("pin")} ${t("locDeniedBtn")}</button>`
        : `<button class="btn btn--gold btn--sm" data-a="gps">${ico("pin")} ${t("beenGps")}</button>`;
      box.className = "been";
      box.innerHTML = `<span class="been__icon">${ico("pin")}</span>
        <div><b>${t("beenQ")}</b><p>${t("beenLead2", G.visited, G.gps)}</p></div>
        <div class="been__btns">${gpsBtn}<button class="btn btn--ghost btn--sm" data-a="self">${t("beenSelf")}</button></div>`;
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
        } catch (e) {
          if (e && e.code === 1) toast(t("locPermDenied"));
          else toast(t("noLocation"));
          b.disabled = false;
          b.innerHTML = `${ico("pin")} ${t("beenGps")}`;
        }
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
    const story_en = (s.story && s.story.en) || "";
    const story_ur = (s.story && s.story.ur) || "";
    const teaser_en = story_en.split(/(?<=[.۔])\s+/).slice(0, 2).join(" ");
    const teaser_ur = story_ur ? story_ur.split(/(?<=[.۔])\s+/).slice(0, 2).join(" ") : "";
    const facts_en = (s.facts && s.facts.en) || [];
    const facts_ur = (s.facts && s.facts.ur) || [];
    const fact_en = facts_en[0] || "";
    const fact_ur = facts_ur[0] || "";
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
          <h1>${esc(s.name.en)}</h1>
          ${cblk(fx(teaser_en), teaser_ur ? fx(teaser_ur) : null, "tour__teaser")}
          ${cblk(`<b>${t("didYouKnow")}</b> ${fx(fact_en)}`, fact_ur ? `<b>کیا آپ جانتے ہیں؟</b> ${fx(fact_ur)}` : null, "tour__fact")}
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
        <h2>${esc(h.title && h.title.en || "")}</h2>
        ${cblk(fx(h.lead && h.lead.en || ""), h.lead && h.lead.ur ? fx(h.lead.ur) : null, "lead")}
        <ol class="saga">${h.steps.map((x) => `<li><b class="saga__year">${esc(x.year)}</b>${cblk(fx(x.en || ""), x.ur ? fx(x.ur) : null)}</li>`).join("")}</ol>
        <div class="story-grid" data-box="story">${(LL.HAMMAM_STORY || []).map((g, i) => `<button class="story-grid__item${i < 4 ? " is-board" : ""}" data-i="${i}"><img src="${g.small}" alt="${esc(cap(g))}" loading="lazy" width="${g.w}" height="${g.h}"><span>${fx(cap(g))}</span></button>`).join("")}</div>
      </section>`;
    }
    if (id === "lahore-museum") {
      const m = O.museum;
      return `<section class="block official">
        <h2>${esc(m.title && m.title.en || "")}</h2>
        ${cblk(fx(m.lead && m.lead.en || ""), m.lead && m.lead.ur ? fx(m.lead.ur) : null, "lead")}
        <div class="collection" data-box="museum">${(LL.MUSEUM_HIGHLIGHTS || []).map((g, i) => `<button class="collection__item" data-i="${i}"><span class="collection__img"><img src="${g.small}" alt="${esc(g.caption)}" loading="lazy"></span><b>${esc(g.caption)}</b><small>${esc(g.note)}</small></button>`).join("")}</div>
        <p><a class="btn btn--ghost btn--sm" href="${m.vr.url}" target="_blank" rel="noopener">${ico("tour")} ${esc(m.vr.label.en)} ↗</a></p>
      </section>`;
    }
    if (id === "lahore-fort" || id === "shalimar-gardens") {
      const f = id === "lahore-fort" ? O.fort : O.shalimar;
      return `<section class="block official">
        <h2>${esc(f.title && f.title.en || "")}</h2>
        ${cblk(
          `<ul class="official__facts" lang="en">${f.facts.map(x => `<li>${fx(x && x.en || "")}</li>`).join("")}</ul>`,
          f.facts.some(x => x && x.ur) ? `<ul class="official__facts" lang="ur" dir="rtl">${f.facts.map(x => `<li>${fx(x && x.ur || x.en || "")}</li>`).join("")}</ul>` : null
        )}
        ${f.access ? `<div class="access"><h3>${ico("me")} ${esc(f.access.title && f.access.title.en || "")}</h3>${cblk(
          `<ul lang="en">${f.access.items.map(x => `<li>${fx(x && x.en || "")}</li>`).join("")}</ul>`,
          f.access.items.some(x => x && x.ur) ? `<ul lang="ur" dir="rtl">${f.access.items.map(x => `<li>${fx(x && x.ur || x.en || "")}</li>`).join("")}</ul>` : null
        )}</div>` : ""}
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
      <h2>${esc(T.title && T.title.en || "")}</h2>
      ${cblk(fx(T.lead && T.lead.en || ""), T.lead && T.lead.ur ? fx(T.lead.ur) : null)}
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
          ${LL.AREAS.map((a) => `<h3 class="tour-area">${esc(a.name.en)}</h3>
          <ol class="tour-list">${LL.SITES.map((s, i) => (s.area !== a.id ? "" : `<li><a href="#/tour/${s.id}"><span class="n">${i + 1}</span>${esc(s.name.en)}${LL.Progress.state.seen[s.id] ? '<span class="seen">✓</span>' : ""}</a></li>`)).join("")}</ol>`).join("")}
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
          <b class="lmap__name">${esc(x.name.en)}</b>
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
              <b>${esc(rk.en)}</b>
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
            <div class="ap__top"><b>${esc(a.name.en)}</b><span>${g.have}/${g.need}</span></div>
            <span class="bar"><i style="width:${(g.have / g.need) * 100}%"></i></span>
            <div class="ap__thumbs">${list.map((x) => `<a href="#/site/${x.id}" class="ap__t is-${G.level(x.id)}" data-ph="${x.id}" title="${esc(x.name.en)}" aria-label="${esc(x.name.en)}"></a>`).join("")}</div>
          </div>`;
        }).join("")}</div>

        <h2 class="me__h">${t("badgesTitle")} <small>${earnedN}/${G.BADGES.length}</small></h2>
        <div class="badges">${G.BADGES.map((b) => {
          const [h, n] = b.prog(), got = P.state.badges[b.id] || (h >= n);
          return `<div class="badge ${got ? "is-on" : ""}">
            <span class="badge__icon">${ico(b.icon)}</span>
            <b>${esc(b.en)}</b>
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
          <div class="tips__grid">${LL.TIPS.map((x) => `<div class="tip"><span class="tip__icon">${ico(x.icon)}</span><div><b>${esc(x.title)}</b><p>${fx(x.text && typeof x.text === "object" ? x.text.en : x.text || "")}</p></div></div>`).join("")}</div>
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
          ${cblk(fx(p.intro && p.intro.en || ""), p.intro && p.intro.ur ? fx(p.intro.ur) : null, "plan__intro")}
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
                ${cblk(fx(st.note && st.note.en || ""), st.note && st.note.ur ? fx(st.note.ur) : null, "stop__note")}
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
            <h2>${esc(st.name.en)}</h2>
            ${cblk(fx(st.note && st.note.en || ""), st.note && st.note.ur ? fx(st.note.ur) : null, "walkmode__note")}
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
    if (r.page === "learn") { const s = site(r.param); if (s) return set(`${s.name.en} — Full History, Facts & Story | Lahore Legacy`, `Deep read: the full story, key facts, what to look for, photo spots and historical comparison for ${s.name.en}, Lahore.`); }
    if (r.page === "myths") return set("Myth or Truth? — Lahore Heritage Facts & Legends | Lahore Legacy", "15 claims about Lahore's heritage — test yourself on myths, truths and legends.");
    if (r.page === "persona") return set("Which Lahore Monument Are You? — Personality Quiz | Lahore Legacy", "Take a 7-question quiz to discover which Lahore monument matches your personality.");
    if (r.page === "1947") return set("Lahore 1947 — Stories from the Partition | Lahore Legacy", "Three quiet stories from 1947: personal accounts from the year Lahore became two cities.");
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
    else if (r.page === "learn") learnPage(r.param);
    else if (r.page === "myths") mythsPage();
    else if (r.page === "persona") personaPage();
    else if (r.page === "1947") page1947();
    else if (r.page === "trail") cleanup = LL.Trail360.page(main(), r.param, { esc, t, pick, attrs: U, ico });
    else cleanup = home();
    header();
    window.scrollTo(0, 0);
    LL.Ease && LL.Ease.afterRender();
    LL.Delight && LL.Delight.page(main());
  }

  function runIntro(onDone) {
    if (sessionStorage.getItem("ll-intro")) { onDone(); return; }
    sessionStorage.setItem("ll-intro", "1");
    const overlay = document.createElement("div");
    overlay.id = "ll-intro";
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML =
      '<canvas id="ll-intro-cv" aria-hidden="true"></canvas>' +
      '<div class="ll-intro__copy">' +
        '<div class="ll-intro__city">LAHORE</div>' +
        '<div class="ll-intro__ur">لاہور کی وراثت</div>' +
        '<div class="ll-intro__tag">A&nbsp;LIVING&nbsp;MUSEUM</div>' +
      '</div>' +
      '<div class="ll-intro__tap">tap to enter ›</div>';
    document.body.appendChild(overlay);
    const cv = document.getElementById("ll-intro-cv");
    const ctx = cv.getContext("2d");
    let W, H, R, cx, cy;
    const stars = [];
    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      R = Math.min(W, H) * 0.38;
      cx = W / 2; cy = H / 2;
      stars.length = 0;
      for (let i = 0; i < 200; i++) {
        let sx, sy;
        do { sx = Math.random(); sy = Math.random(); }
        while (Math.hypot(sx * W - cx, sy * H - cy) < R + 24);
        stars.push({ x: sx, y: sy, r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.55 + 0.3, ph: Math.random() * Math.PI * 2 });
      }
    }
    resize();
    window.addEventListener("resize", resize);
    let rot = 0, fN = 0, exited = false, raf;
    const DUR = 80;
    function globe() {
      ctx.clearRect(0, 0, W, H);
      // Stars
      stars.forEach(s => {
        ctx.globalAlpha = s.a * (0.45 + 0.55 * (Math.sin(fN * 0.04 + s.ph) * 0.5 + 0.5));
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      // Atmosphere outer glow
      for (let i = 10; i >= 1; i--) {
        ctx.beginPath(); ctx.arc(cx, cy, R + i * 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(50,130,220," + (0.1 / i) + ")"; ctx.lineWidth = 2.5; ctx.stroke();
      }
      // 3-D sphere base (radial gradient with offset highlight)
      const sph = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.3, R * 0.08, cx, cy, R);
      sph.addColorStop(0, "rgba(60,88,160,0.95)");
      sph.addColorStop(0.3, "rgba(22,36,88,0.97)");
      sph.addColorStop(0.7, "rgba(8,14,42,0.98)");
      sph.addColorStop(1, "rgba(2,4,14,1)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sph; ctx.fill();
      // Grid lines clipped to sphere
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = lat * Math.PI / 180;
        const cosP = Math.cos(phi), sinP = Math.sin(phi);
        const ey = cy - sinP * R, rx = cosP * R;
        if (rx < 2) continue;
        ctx.beginPath(); ctx.ellipse(cx, ey, rx, rx * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(70,155,255,0.22)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(90,180,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      for (let lon = 0; lon < 180; lon += 20) {
        const a = (lon + rot) * Math.PI / 180;
        const cosA = Math.cos(a), rx = Math.abs(cosA) * R;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
        ctx.strokeStyle = cosA > 0 ? "rgba(70,155,255,0.42)" : "rgba(70,155,255,0.08)";
        ctx.lineWidth = cosA > 0 ? 0.65 : 0.25; ctx.stroke();
      }
      ctx.restore();
      // Sphere outline
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(80,170,255,0.55)"; ctx.lineWidth = 1.3; ctx.stroke();
      // Specular highlight
      const spec = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.32, 0, cx - R * 0.2, cy - R * 0.2, R * 0.55);
      spec.addColorStop(0, "rgba(255,255,255,0.14)"); spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = spec; ctx.fill();
      // Lahore marker (lat 31.5°N, lon 74.3°E)
      const lPhi = 31.5 * Math.PI / 180;
      const lTheta = (74.3 + rot) * Math.PI / 180;
      const lz = Math.cos(lPhi) * Math.cos(lTheta);
      const lx = cx + Math.cos(lPhi) * Math.sin(lTheta) * R;
      const ly = cy - Math.sin(lPhi) * R;
      if (lz > -0.1) {
        const aa = Math.max(0.1, (lz + 0.1) / 1.1);
        const pulse = (Math.sin(fN * 0.09) + 1) * 0.5;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath(); ctx.arc(lx, ly, 5 + i * (8 + pulse * 4), 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,100,40," + (aa * 0.2 / i) + ")"; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,100,40," + aa + ")"; ctx.fill();
        ctx.beginPath(); ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,170," + aa + ")"; ctx.fill();
      }
    }
    function setOp(sel, op) {
      const e = overlay.querySelector(sel);
      if (e) e.style.opacity = op;
    }
    function tick() {
      if (exited) return;
      rot += 0.3; fN++;
      globe();
      const p = Math.min(1, fN / DUR);
      if (p > 0.14) setOp(".ll-intro__city", Math.min(1, (p - 0.14) * 9));
      if (p > 0.30) setOp(".ll-intro__ur", Math.min(1, (p - 0.30) * 9));
      if (p > 0.46) setOp(".ll-intro__tag", Math.min(1, (p - 0.46) * 9));
      if (p > 0.72) setOp(".ll-intro__tap", Math.min(1, (p - 0.72) * 12));
      if (fN >= DUR) { exit(); return; }
      raf = requestAnimationFrame(tick);
    }
    function exit() {
      if (exited) return; exited = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      overlay.classList.add("ll-intro--out");
      setTimeout(() => { overlay.remove(); onDone(); }, 450);
    }
    overlay.addEventListener("click", exit);
    raf = requestAnimationFrame(tick);
  }

  function boot() {
    // content-block language toggle (EN ↔ اردو per block)
    document.addEventListener("click", (e) => {
      const tog = e.target.closest(".cblk__tog");
      if (!tog) return;
      const cb = tog.closest(".cblk");
      if (!cb) return;
      const toEn = cb.dataset.l === "ur";
      cb.dataset.l = toEn ? "en" : "ur";
      cb.querySelector(".cblk__ur").hidden = toEn;
      cb.querySelector(".cblk__en").hidden = !toEn;
      tog.textContent = toEn ? "اردو" : "EN";
    });
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
    runIntro(() => {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
