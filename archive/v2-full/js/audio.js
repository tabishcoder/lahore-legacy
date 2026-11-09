/* =========================================================================
   LAHORE LEGACY — SOUND (effects + ambient soundscape)
   Synthesised with the Web Audio API — no audio files required, nothing
   autoplays. Effects and ambience are OFF until the visitor turns them on
   in the sound panel, and each has its own volume.
   To use recorded audio, add files to assets/audio/ and map them in
   LL.Audio.files (effects) or LL.Audio.ambientFile (ambience loop).
   ========================================================================= */

window.LL = window.LL || {};

LL.Audio = (function () {
  const KEY = "lahoreLegacy.audio.v2";
  let ctx = null, master = null, sfxBus = null, ambBus = null, ambNodes = null;
  const st = { sfx: false, ambient: false, sfxVol: 0.6, ambVol: 0.35 };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) Object.assign(st, saved);
    else if (localStorage.getItem("lahoreLegacy.sound") === "on") st.sfx = true; // v1 setting
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  const files = {};          // e.g. { success: "assets/audio/success.mp3" }
  let ambientFile = null;    // e.g. "assets/audio/ambience.mp3"
  let ambEl = null;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = st.sfxVol; sfxBus.connect(master);
      ambBus = ctx.createGain(); ambBus.gain.value = 0; ambBus.connect(master);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = "sine", vol = 0.12, bus) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    const t = a.currentTime + start;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // soft plucked / bell timbre (two partials)
  function bell(freq, start = 0, dur = 1.2, vol = 0.08) { tone(freq, start, dur, "sine", vol); tone(freq * 2.01, start, dur * 0.6, "sine", vol * 0.35); }

  const sfx = {
    click: () => tone(520, 0, 0.06, "triangle", 0.04),
    hover: () => {},
    page: () => tone(340, 0, 0.12, "sine", 0.05),
    open: () => tone(392, 0, 0.18, "sine", 0.05),
    xp: () => bell(1046, 0, 0.5, 0.05),
    success: () => { bell(523, 0); bell(659, 0.12); bell(784, 0.24, 1.6); },
    fail: () => { tone(196, 0, 0.35, "triangle", 0.06); },
    level: () => { bell(392, 0, 1.6); bell(523, 0.15, 1.6); bell(659, 0.3, 2); },
    milestone: () => { bell(659, 0, 1.4, 0.06); bell(988, 0.18, 1.8, 0.05); },
    unlock: () => { tone(440, 0, 0.12, "triangle", 0.05); bell(880, 0.1, 0.8, 0.06); },
    tick: () => tone(1100, 0, 0.03, "square", 0.015),
    stamp: () => { tone(110, 0, 0.18, "triangle", 0.12); tone(80, 0.02, 0.25, "sine", 0.1); },
  };

  function play(name) {
    if (!st.sfx) return;
    if (files[name]) { const el = new Audio(files[name]); el.volume = st.sfxVol; el.play().catch(() => {}); return; }
    try { sfx[name] && sfx[name](); } catch (e) {}
  }

  /* ---------- Ambient soundscape: warm drone, breeze and distant bells ---------- */
  function startAmbient() {
    if (ambientFile) {
      if (!ambEl) { ambEl = new Audio(ambientFile); ambEl.loop = true; }
      ambEl.volume = st.ambVol; ambEl.play().catch(() => {});
      return;
    }
    const a = ac(); if (!a || ambNodes) return;
    const nodes = [];
    // drone (D2 + A2), slowly breathing
    [73.42, 110, 146.83].forEach((f, i) => {
      const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = i === 2 ? "triangle" : "sine"; o.frequency.value = f;
      g.gain.value = i === 2 ? 0.015 : 0.035;
      lfo.frequency.value = 0.05 + i * 0.03; lg.gain.value = 0.015;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(ambBus); o.start(); lfo.start();
      nodes.push(o, lfo);
    });
    // breeze: filtered noise
    const len = a.sampleRate * 2, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = a.createBufferSource(); n.buffer = buf; n.loop = true;
    const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 500; bp.Q.value = 0.6;
    const ng = a.createGain(); ng.gain.value = 0.02;
    const nl = a.createOscillator(), nlg = a.createGain(); nl.frequency.value = 0.07; nlg.gain.value = 260;
    nl.connect(nlg).connect(bp.frequency);
    n.connect(bp).connect(ng).connect(ambBus); n.start(); nl.start();
    nodes.push(n, nl);
    // occasional distant bell notes from a pentatonic scale
    const scale = [293.66, 349.23, 392, 440, 523.25, 587.33];
    const timer = setInterval(() => {
      if (!st.ambient) return;
      const f = scale[Math.floor(Math.random() * scale.length)];
      tone(f, 0, 3.5, "sine", 0.02, ambBus); tone(f * 2, 0.02, 2, "sine", 0.006, ambBus);
    }, 5200);
    ambNodes = { nodes, timer };
    ambBus.gain.cancelScheduledValues(a.currentTime);
    ambBus.gain.setTargetAtTime(st.ambVol, a.currentTime, 1.5);
  }
  function stopAmbient() {
    if (ambEl) ambEl.pause();
    if (!ambNodes || !ctx) return;
    ambBus.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
    const n = ambNodes; ambNodes = null;
    setTimeout(() => { clearInterval(n.timer); n.nodes.forEach((x) => { try { x.stop(); } catch (e) {} }); }, 2500);
  }

  function emit() { document.dispatchEvent(new CustomEvent("ll:sound", { detail: { ...st } })); }

  function setEnabled(v) { st.sfx = !!v; save(); if (st.sfx) { ac(); play("unlock"); } emit(); }
  function setAmbient(v) { st.ambient = !!v; save(); if (st.ambient) startAmbient(); else stopAmbient(); emit(); }
  function setVolume(kind, v) {
    v = Math.max(0, Math.min(1, v));
    if (kind === "sfx") { st.sfxVol = v; if (sfxBus) sfxBus.gain.value = v; }
    else { st.ambVol = v; if (ambBus && st.ambient) ambBus.gain.setTargetAtTime(v, ctx.currentTime, 0.2); if (ambEl) ambEl.volume = v; }
    save(); emit();
  }
  function muteAll() { setEnabled(false); setAmbient(false); }

  return {
    play, setEnabled, setAmbient, setVolume, muteAll, files,
    set ambientFile(v) { ambientFile = v; },
    isEnabled: () => st.sfx, state: () => ({ ...st }),
    resume: () => { if (st.ambient) startAmbient(); },
  };
})();
