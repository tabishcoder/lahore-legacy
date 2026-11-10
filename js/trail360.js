/* =========================================================================
   LAHORE LEGACY — ROYAL TRAIL IN 360° (viewer page)
   #/trail            starts at Delhi Gate
   #/trail/<stopId>   opens one stop
   Uses Pannellum (loaded only when this page opens) with cube-map scenes
   built from the Walled City of Lahore Authority's 360° photography.
   ========================================================================= */

window.LL = window.LL || {};

LL.Trail360 = (function () {
  const PAN_JS = "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js";
  const PAN_CSS = "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css";
  let loading = null, current = null;

  function loadLib() {
    if (window.pannellum) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((res, rej) => {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = PAN_CSS;
      document.head.appendChild(l);
      const s = document.createElement("script");
      s.src = PAN_JS; s.async = true;
      s.onload = () => res(); s.onerror = () => { loading = null; rej(new Error("viewer")); };
      document.head.appendChild(s);
    });
    return loading;
  }

  const faces = (id) => ["f", "r", "b", "l", "u", "d"].map((f) => `assets/pano360/${id}/${f}.webp`);
  const thumb = (id) => `assets/pano360/${id}/thumb.webp`;

  /* Mount the page into <main>. Returns a cleanup function. */
  function page(main, startId, ui) {
    const { esc, t, pick, attrs, ico } = ui;
    const T = LL.TRAIL360, stops = T.stops;
    const idx = (id) => Math.max(0, stops.findIndex((s) => s.id === id));
    let cur = idx(startId);
    let viewer = null, gyro = false;
    const mix = LL.I18N.mode === "mix";

    document.body.classList.add("on-trail");
    main.innerHTML = `
      <section class="trail">
        <div class="trail__stage">
          <div class="trail__pano" id="trail-pano" tabindex="0" aria-label="${t("trailAria")}"></div>
          <div class="trail__veil is-on" id="trail-veil"><span class="trail__spinner"></span><span>${t("trailLoading")}</span></div>
          <p class="trail__hint" id="trail-hint">${t("trailHint")}</p>
          <div class="trail__tools">
            <button class="tool" data-act="out" aria-label="Zoom out">${ico("minus")}</button>
            <button class="tool" data-act="in" aria-label="Zoom in">${ico("plus")}</button>
            <button class="tool" data-act="gyro" aria-label="${t("motion")}" hidden>${ico("phone")}</button>
            <button class="tool" data-act="full" aria-label="Full screen">${ico("full")}</button>
          </div>
          <p class="trail__credit">360°: <a href="${T.source.url}" target="_blank" rel="noopener">${esc(T.source.name)}</a></p>
        </div>
        <aside class="trail__panel" id="trail-panel"></aside>
      </section>`;

    const panel = main.querySelector("#trail-panel"), veil = main.querySelector("#trail-veil"), hint = main.querySelector("#trail-hint");

    function drawPanel() {
      const s = stops[cur], prev = stops[cur - 1], next = stops[cur + 1];
      panel.innerHTML = `
        <p class="eyebrow">${t("trailEyebrow", cur + 1, stops.length)}</p>
        <h1>${esc(s.name.en)}${mix ? `<span lang="ur" class="trail__ur">${esc(s.name.ur)}</span>` : ""}</h1>
        <p class="trail__note" ${attrs()}>${esc(pick(s.note))}</p>
        ${s.site ? `<p><a class="linkish" href="#/site/${s.site}">${t("trailReadMore")} →</a></p>` : ""}
        <div class="trail__nav">
          <button class="btn btn--ghost btn--sm" data-go="${prev ? prev.id : ""}" ${prev ? "" : "disabled"}>← ${t("prevStop")}</button>
          ${next ? `<button class="btn btn--gold btn--sm" data-go="${next.id}">${t("trailNext")} →</button>`
                 : `<a class="btn btn--gold btn--sm" href="#/site/wazir-khan-mosque">${t("trailEnd")} →</a>`}
        </div>
        <div class="trail__prog"><span class="bar"><i style="width:${((cur + 1) / stops.length) * 100}%"></i></span></div>
        <ol class="trail__stops">
          ${stops.map((x, i) => `<li><button data-go="${x.id}" ${i === cur ? 'aria-current="true"' : ""}>
            <img src="${thumb(x.id)}" alt="" loading="lazy" width="64" height="64"><span class="n">${i + 1}</span>
            <span class="trail__sname">${esc(x.name.en)}${mix ? `<small lang="ur">${esc(x.name.ur)}</small>` : ""}</span></button></li>`).join("")}
        </ol>
        <p class="hint">${t("trailCredit")} <a href="${T.source.url}" target="_blank" rel="noopener">${esc(T.source.name)}</a>.</p>`;
      const curEl = panel.querySelector('[aria-current="true"]');
      if (curEl && innerWidth > 960) curEl.scrollIntoView({ block: "nearest" });
    }

    function hotspot(div, args) {
      div.innerHTML = `<span class="trail-hot"><span class="trail-hot__arrow"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6"/></svg></span><span class="trail-hot__label">${esc(args.label)}</span></span>`;
      div.setAttribute("role", "button");
      div.setAttribute("aria-label", args.label);
    }

    function scenes() {
      const out = {};
      stops.forEach((s) => {
        out[s.id] = {
          type: "cubemap", cubeMap: faces(s.id), yaw: 0, pitch: 0, hfov: innerWidth < 700 ? 100 : 90,
          hotSpots: s.links.map((l) => {
            const to = stops[idx(l.to)];
            const label = l.label ? l.label.en : to.name.en;
            return { pitch: l.pitch != null ? l.pitch : -6, yaw: l.yaw, type: "scene", sceneId: l.to, cssClass: "trail-hot-wrap", createTooltipFunc: hotspot, createTooltipArgs: { label } };
          }),
        };
      });
      return out;
    }

    function go(id, fromViewer) {
      const i = idx(id);
      if (i === cur && viewer && fromViewer !== "init") return;
      cur = i;
      history.replaceState(null, "", `#/trail/${stops[cur].id}`);
      drawPanel();
      if (viewer && !fromViewer) { veil.classList.add("is-on"); viewer.loadScene(stops[cur].id); }
    }

    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-go]");
      if (b && b.dataset.go) { go(b.dataset.go); if (innerWidth <= 960) main.querySelector(".trail__stage").scrollIntoView({ behavior: "smooth" }); }
    });

    main.querySelector(".trail__tools").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b || !viewer) return;
      const a = b.dataset.act;
      if (a === "in") viewer.setHfov(viewer.getHfov() - 15);
      if (a === "out") viewer.setHfov(viewer.getHfov() + 15);
      if (a === "full") viewer.toggleFullscreen();
      if (a === "gyro") {
        if (gyro) { viewer.stopOrientation(); gyro = false; }
        else { viewer.startOrientation(); gyro = true; }
        b.classList.toggle("is-on", gyro);
      }
    });

    drawPanel();
    let hintTimer = setTimeout(() => hint.classList.add("is-hidden"), 6000);

    loadLib().then(() => {
      if (!document.body.contains(panel)) return;
      viewer = window.pannellum.viewer("trail-pano", {
        default: { firstScene: stops[cur].id, sceneFadeDuration: 900, autoLoad: true, showControls: false, compass: false, mouseZoom: true, minHfov: 40, maxHfov: 120, friction: 0.12 },
        scenes: scenes(),
      });
      current = viewer;
      viewer.on("load", () => veil.classList.remove("is-on"));
      viewer.on("scenechange", (id) => { veil.classList.add("is-on"); go(id, true); });
      viewer.on("mousedown", () => hint.classList.add("is-hidden"));
      viewer.on("touchstart", () => hint.classList.add("is-hidden"));
      viewer.on("error", () => { veil.innerHTML = `<span>${t("trailError")}</span>`; });
      if (window.DeviceOrientationEvent && matchMedia("(pointer: coarse)").matches) main.querySelector('[data-act="gyro"]').hidden = false;
      veil.classList.add("is-on");
      // warm the next stop's faces so the walk feels instant
      viewer.on("load", () => { const n = stops[cur + 1]; if (n) faces(n.id).forEach((u) => { const im = new Image(); im.src = u; }); });
    }).catch(() => { veil.innerHTML = `<span>${t("trailError")}</span>`; });

    return () => {
      clearTimeout(hintTimer);
      document.body.classList.remove("on-trail");
      if (viewer) { try { viewer.destroy(); } catch (e) {} viewer = null; current = null; }
    };
  }

  return { page, thumb, stops: () => LL.TRAIL360.stops, viewer: () => current };
})();
