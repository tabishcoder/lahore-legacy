/* =========================================================================
   LAHORE LEGACY — BOOTSTRAP
   ========================================================================= */

(function () {
  const $ = (s) => document.querySelector(s);

  /* ---------- Cinematic intro (real photograph, slow push-in) ---------- */
  function showIntro() {
    const intro = $("#intro");
    intro.hidden = false;
    intro.classList.remove("is-leaving");
    document.body.classList.add("is-intro");
    $("#intro-skyline").innerHTML = LL.Illustrations.skyline("#B28A45");
    const ph = $("#intro-photo");
    ph.innerHTML = "";
    const m = LL.UI.media("badshahi-mosque", { width: 2400, eager: true, label: false, start: 4 });
    ph.appendChild(m);
    LL.Photos.resolve("badshahi-mosque", 2400, 4).then((p) => { if (p && p.file) $("#intro-credit").innerHTML = LL.Credits.line(p.file); });
    setTimeout(() => $("#intro-begin").focus({ preventScroll: true }), 300);
  }
  function endIntro() {
    const intro = $("#intro");
    if (intro.classList.contains("is-leaving")) return;
    LL.Audio.play("open");
    LL.Audio.resume();
    intro.classList.add("is-leaving");
    document.body.classList.remove("is-intro");
    try { sessionStorage.setItem("lahoreLegacy.introSeen", "1"); } catch (e) {}
    setTimeout(() => { intro.hidden = true; }, 1200);
    LL.FX.observeReveals(document.querySelector(".view.is-active"));
  }

  /* ---------- Homepage photography ---------- */
  function homePhotos() {
    const art = $("#hero-art");
    art.innerHTML = "";
    art.appendChild(LL.UI.media("badshahi-mosque", { width: 2400, eager: true, label: false }));
    LL.Photos.resolve("badshahi-mosque", 2400, 0).then((p) => { if (p && p.file) { const set = () => ($("#hero-credit").innerHTML = LL.Credits.line(p.file)); set(); document.addEventListener("ll:credits", set); } });

    document.querySelectorAll("#feature-grid [data-photo]").forEach((card) => {
      const slot = card.querySelector(".feature-card__media");
      slot.appendChild(LL.UI.media(card.dataset.photo, { width: 900, start: +(card.dataset.photoStart || 0), label: false }));
    });

    // Walled City band: lead photo + thumbnails that open the lightbox
    const wm = $("#walled-media");
    wm.appendChild(LL.UI.media("walled-city", { width: 1800, label: true }));
    LL.Photos.resolve("walled-city", 1800, 0).then((p) => { if (p && p.file) { const set = () => ($("#walled-credit").innerHTML = LL.Credits.line(p.file)); set(); document.addEventListener("ll:credits", set); } });
    const th = $("#walled-thumbs");
    [1, 2, 3, 4].forEach((i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Open Walled City photograph " + (i + 1));
      b.appendChild(LL.UI.media("walled-city", { width: 400, start: i, label: false }));
      b.addEventListener("click", () => LL.UI.lightbox("walled-city", i));
      th.appendChild(b);
    });
    wm.addEventListener("click", () => LL.UI.lightbox("walled-city", 0));
    wm.style.cursor = "zoom-in";
  }

  /* ---------- Sound panel ---------- */
  function soundPanel() {
    const btn = $("#sound-toggle"), panel = $("#sound-panel");
    const sync = () => {
      const s = LL.Audio.state();
      $("#snd-sfx").checked = s.sfx; $("#snd-amb").checked = s.ambient;
      $("#snd-sfx-vol").value = Math.round(s.sfxVol * 100); $("#snd-amb-vol").value = Math.round(s.ambVol * 100);
      btn.classList.toggle("is-on", s.sfx || s.ambient);
    };
    btn.addEventListener("click", (e) => { e.stopPropagation(); panel.hidden = !panel.hidden; btn.setAttribute("aria-expanded", String(!panel.hidden)); });
    document.addEventListener("click", (e) => { if (!panel.hidden && !e.target.closest(".sound")) { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); } });
    $("#snd-sfx").addEventListener("change", (e) => LL.Audio.setEnabled(e.target.checked));
    $("#snd-amb").addEventListener("change", (e) => LL.Audio.setAmbient(e.target.checked));
    $("#snd-sfx-vol").addEventListener("input", (e) => LL.Audio.setVolume("sfx", e.target.value / 100));
    $("#snd-amb-vol").addEventListener("input", (e) => LL.Audio.setVolume("amb", e.target.value / 100));
    $("#snd-mute").addEventListener("click", () => LL.Audio.muteAll());
    document.addEventListener("ll:sound", sync);
    sync();
    // browsers require a gesture before audio can start: resume ambience on first interaction
    document.addEventListener("pointerdown", () => LL.Audio.resume(), { once: true });
  }

  function boot() {
    LL.Credits.load();
    homePhotos();

    // modules
    LL.Explore.init();
    LL.Panorama.init();
    LL.Passport.init();
    LL.Games.init();
    LL.Nav.on("home", () => { LL.Explore.renderTrail(); LL.Passport.questCard(); });
    LL.Nav.init();
    LL.FX.pointerEffects();
    soundPanel();

    // intro (once per browser session unless replayed)
    let seen = false;
    try { seen = sessionStorage.getItem("lahoreLegacy.introSeen") === "1"; } catch (e) {}
    const deepLink = location.hash && location.hash !== "#home";
    if (seen || deepLink) { $("#intro").hidden = true; document.body.classList.remove("is-intro"); }
    else showIntro();
    $("#intro-begin").addEventListener("click", endIntro);
    $("#intro-skip").addEventListener("click", endIntro);
    $("#replay-intro").addEventListener("click", () => { window.scrollTo(0, 0); showIntro(); });

    // modal + credits
    $("#modal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) LL.UI.closeModal(); });
    $("#open-credits").addEventListener("click", LL.UI.credits);

    // keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (document.querySelector(".lightbox")) return;
      if (!$("#intro").hidden && !$("#intro").classList.contains("is-leaving")) return endIntro();
      if (!$("#modal").hidden) return LL.UI.closeModal();
      if (!$("#game-stage").hidden) return LL.Nav.go("games");
      document.body.classList.remove("nav-open");
    });

    const p = LL.Game.profile;
    if (p.xp > 0) setTimeout(() => LL.UI.toast(`Welcome back, ${p.name}`, `${LL.Game.levelFor(p.xp).name} · ${p.streak.count}-day streak`), 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
