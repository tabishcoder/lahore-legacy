/* =========================================================================
   LAHORE LEGACY — ORIGINAL SVG ILLUSTRATIONS
   -------------------------------------------------------------------------
   Hand-built vector artwork of each monument (original work, no third-party
   imagery). Used as artwork, as the fallback when a photograph is missing,
   as illustrated panorama scenes and as Rebuild Lahore puzzle images.
   These are artistic interpretations, not architectural drawings.
   ========================================================================= */

window.LL = window.LL || {};

LL.Illustrations = (function () {
  let uid = 0;
  const W = 1200, H = 700;

  /* ---------- primitives ---------- */
  function onion(cx, baseY, r, fill, stroke) {
    const p = `M ${cx - r} ${baseY} C ${cx - r * 1.08} ${baseY - r * 1.05}, ${cx - r * 0.25} ${baseY - r * 1.2}, ${cx} ${baseY - r * 1.62}
      C ${cx + r * 0.25} ${baseY - r * 1.2}, ${cx + r * 1.08} ${baseY - r * 1.05}, ${cx + r} ${baseY} Z`;
    return `<rect x="${cx - r * 0.92}" y="${baseY}" width="${r * 1.84}" height="${r * 0.28}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <path d="${p}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <path d="M ${cx - r * 0.55} ${baseY - r * 0.5} Q ${cx - r * 0.4} ${baseY - r * 1.05} ${cx - r * 0.05} ${baseY - r * 1.35}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${Math.max(2, r * 0.06)}" stroke-linecap="round"/>
      <line x1="${cx}" y1="${baseY - r * 1.62}" x2="${cx}" y2="${baseY - r * 2.05}" stroke="#F5C76A" stroke-width="${Math.max(2, r * 0.05)}"/>
      <circle cx="${cx}" cy="${baseY - r * 1.78}" r="${Math.max(3, r * 0.07)}" fill="#F5C76A"/>`;
  }

  function arch(cx, baseY, w, h, fill, stroke, sw = 2) {
    return `<path d="M ${cx - w / 2} ${baseY} L ${cx - w / 2} ${baseY - h * 0.55} Q ${cx - w / 2} ${baseY - h * 0.93} ${cx} ${baseY - h}
      Q ${cx + w / 2} ${baseY - h * 0.93} ${cx + w / 2} ${baseY - h * 0.55} L ${cx + w / 2} ${baseY} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }

  function chhatri(cx, baseY, w, fill, stroke) {
    const h = w * 0.7;
    return `<rect x="${cx - w / 2}" y="${baseY - 4}" width="${w}" height="6" fill="${stroke}"/>
      <rect x="${cx - w / 2 + 2}" y="${baseY - h}" width="${w * 0.12}" height="${h - 4}" fill="${fill}"/>
      <rect x="${cx + w / 2 - 2 - w * 0.12}" y="${baseY - h}" width="${w * 0.12}" height="${h - 4}" fill="${fill}"/>
      <rect x="${cx - w / 2 - 3}" y="${baseY - h - 5}" width="${w + 6}" height="6" fill="${stroke}"/>
      ${onion(cx, baseY - h - 5, w * 0.45, "#EFE6D6", stroke)}`;
  }

  function minaret(cx, baseY, topY, w, body, band, stroke, opts = {}) {
    const hgt = baseY - topY;
    const tw = w * 0.78;
    let s = `<polygon points="${cx - w / 2},${baseY} ${cx + w / 2},${baseY} ${cx + tw / 2},${topY} ${cx - tw / 2},${topY}" fill="${body}" stroke="${stroke}" stroke-width="1.5"/>`;
    // vertical flutes
    for (let i = -1; i <= 1; i++) {
      s += `<line x1="${cx + i * w * 0.22}" y1="${baseY}" x2="${cx + i * tw * 0.22}" y2="${topY}" stroke="${stroke}" stroke-opacity=".35" stroke-width="1"/>`;
    }
    const bands = opts.bands || 3;
    for (let i = 1; i <= bands; i++) {
      const y = baseY - (hgt * i) / (bands + 0.6);
      const bw = w * 1.45 - i * 2;
      s += `<rect x="${cx - bw / 2}" y="${y - 5}" width="${bw}" height="10" rx="2" fill="${band}" stroke="${stroke}" stroke-width="1"/>`;
      if (opts.tiles) {
        s += `<rect x="${cx - w / 2 + 3}" y="${y + 8}" width="${w - 6}" height="14" fill="url(#${opts.tiles})" opacity=".95"/>`;
      }
    }
    s += chhatri(cx, topY, w * 1.25, body, band);
    return s;
  }

  function stars(n, seed) {
    let s = "";
    let x = seed || 7;
    const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < n; i++) {
      const cx = rnd() * W, cy = rnd() * H * 0.45, r = rnd() * 1.4 + 0.3;
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}" fill="#F5EBDD" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`;
    }
    return s;
  }

  function sky(id, mood = "dusk") {
    const top = "#03140F", mid = "#0A3B31", low = mood === "dawn" ? "#E9B46A" : "#C9893F";
    return `<defs>
      <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset=".86" stop-color="${low}" stop-opacity=".85"/><stop offset="1" stop-color="#F5C76A"/>
      </linearGradient>
      <radialGradient id="glow${id}" cx=".5" cy=".82" r=".55"><stop offset="0" stop-color="#F5C76A" stop-opacity=".55"/><stop offset="1" stop-color="#F5C76A" stop-opacity="0"/></radialGradient>
      <linearGradient id="ground${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E3A30"/><stop offset="1" stop-color="#031A16"/></linearGradient>
      <linearGradient id="sand${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B85E3E"/><stop offset="1" stop-color="#7A3624"/></linearGradient>
      <linearGradient id="brick${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A65E3A"/><stop offset="1" stop-color="#6B3620"/></linearGradient>
      <linearGradient id="marble${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#D9CDB8"/></linearGradient>
      <linearGradient id="water${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB5A8"/><stop offset="1" stop-color="#0E5A50"/></linearGradient>
      <pattern id="tiles${id}" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#1F5C8C"/><path d="M7 0 L14 7 L7 14 L0 7 Z" fill="#3FA7B5"/><circle cx="7" cy="7" r="2.4" fill="#F2C14E"/>
      </pattern>
      <pattern id="tiles2${id}" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#E9DCC2"/><path d="M10 2 Q14 10 10 18 Q6 10 10 2Z" fill="#2B6CA3"/><path d="M2 10 Q10 14 18 10 Q10 6 2 10Z" fill="#3A9C7A" opacity=".85"/>
      </pattern>
      <pattern id="brickpat${id}" width="24" height="12" patternUnits="userSpaceOnUse">
        <rect width="24" height="12" fill="none"/><path d="M0 6 H24 M12 0 V6 M0 6 V12" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky${id})"/>
    <rect width="${W}" height="${H}" fill="url(#glow${id})"/>
    ${stars(70, id * 13 + 5)}
    <circle cx="980" cy="120" r="34" fill="#F5EBDD" opacity=".9"/><circle cx="994" cy="112" r="32" fill="url(#sky${id})"/>`;
  }

  function trees(xs, baseY, color = "#062F28") {
    return xs.map(([x, s]) => `<g transform="translate(${x} ${baseY}) scale(${s})">
      <rect x="-4" y="-40" width="8" height="40" fill="#031A16"/>
      <ellipse cx="0" cy="-70" rx="34" ry="40" fill="${color}"/><ellipse cx="-20" cy="-52" rx="22" ry="22" fill="${color}"/><ellipse cx="22" cy="-55" rx="22" ry="24" fill="${color}"/>
    </g>`).join("");
  }

  function cypress(xs, baseY) {
    return xs.map(([x, s]) => `<g transform="translate(${x} ${baseY}) scale(${s})"><path d="M0 -150 C 18 -100, 18 -30, 0 0 C -18 -30, -18 -100, 0 -150Z" fill="#0A3B31" stroke="#062F28"/></g>`).join("");
  }

  function wrap(id, inner, label) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">${inner}</svg>`;
  }

  /* ---------- monuments ---------- */
  const scenes = {
    badshahi(id) {
      const S = "#5A2416", M = `url(#marble${id})`;
      let s = sky(id);
      s += `<rect x="0" y="560" width="${W}" height="140" fill="url(#ground${id})"/>`;
      s += `<rect x="110" y="520" width="980" height="44" fill="url(#sand${id})" stroke="${S}"/>`;
      s += `<rect x="110" y="520" width="980" height="6" fill="#F5C76A" opacity=".5"/>`;
      // courtyard wall arcades
      for (let i = 0; i < 18; i++) s += arch(160 + i * 49 + (i > 8 ? 60 : 0), 560, 26, 30, "#3E180F", "#D6A84F", 1);
      // outer minarets
      s += minaret(160, 540, 130, 46, `url(#sand${id})`, "#EFE6D6", S, { bands: 3 });
      s += minaret(1040, 540, 130, 46, `url(#sand${id})`, "#EFE6D6", S, { bands: 3 });
      // prayer hall
      s += `<rect x="320" y="330" width="560" height="190" fill="url(#sand${id})" stroke="${S}" stroke-width="2"/>`;
      s += `<rect x="320" y="330" width="560" height="190" fill="url(#brickpat${id})" opacity=".4"/>`;
      s += `<rect x="314" y="322" width="572" height="12" fill="#EFE6D6" stroke="${S}"/>`;
      for (let i = 0; i < 28; i++) s += `<rect x="${318 + i * 20.4}" y="312" width="10" height="10" fill="#EFE6D6" stroke="${S}" stroke-width=".8"/>`;
      // side arches
      [370, 430, 490, 710, 770, 830].forEach((x) => { s += arch(x, 510, 42, 110, "#3A140C", "#EFE6D6", 2); s += arch(x, 510, 30, 96, "#5c2216", "none"); });
      // central iwan
      s += `<rect x="530" y="270" width="140" height="250" fill="url(#sand${id})" stroke="${S}" stroke-width="2"/>`;
      s += `<rect x="524" y="262" width="152" height="12" fill="#EFE6D6" stroke="${S}"/>`;
      s += arch(600, 510, 112, 220, "#EFE6D6", S, 2);
      s += arch(600, 510, 92, 200, "#2E0F08", "#D6A84F", 2);
      s += arch(600, 510, 40, 90, "#4a1a10", "#D6A84F", 1);
      // hall corner minarets
      s += minaret(328, 330, 220, 22, "#EFE6D6", "#D6A84F", S, { bands: 1 });
      s += minaret(872, 330, 220, 22, "#EFE6D6", "#D6A84F", S, { bands: 1 });
      // domes
      s += onion(450, 322, 58, M, "#B9A98E");
      s += onion(750, 322, 58, M, "#B9A98E");
      s += onion(600, 262, 86, M, "#B9A98E");
      // chhatris flanking iwan
      s += chhatri(530, 262, 26, "#EFE6D6", S) + chhatri(670, 262, 26, "#EFE6D6", S);
      s += `<rect x="0" y="600" width="${W}" height="100" fill="#031A16" opacity=".35"/>`;
      return wrap(id, s, "Illustration of the Badshahi Mosque");
    },

    fort(id) {
      const S = "#3E1C0E";
      let s = sky(id);
      s += `<rect x="0" y="560" width="${W}" height="140" fill="url(#ground${id})"/>`;
      // back palaces
      s += `<rect x="760" y="250" width="240" height="120" fill="url(#marble${id})" stroke="#9e8f74"/>`;
      for (let i = 0; i < 5; i++) s += arch(790 + i * 45, 365, 30, 70, "#2E2A22", "#D6A84F", 1.5);
      s += `<path d="M 750 250 Q 880 205 1010 250 Z" fill="#EFE6D6" stroke="#9e8f74"/>`;
      s += onion(880, 228, 26, `url(#marble${id})`, "#9e8f74");
      s += `<rect x="190" y="280" width="170" height="90" fill="url(#marble${id})" stroke="#9e8f74"/>`;
      s += onion(275, 280, 34, `url(#marble${id})`, "#9e8f74");
      // main wall
      s += `<rect x="40" y="350" width="1120" height="210" fill="url(#brick${id})" stroke="${S}" stroke-width="2"/>`;
      s += `<rect x="40" y="350" width="1120" height="210" fill="url(#brickpat${id})"/>`;
      for (let x = 44; x < 1150; x += 34) s += `<path d="M ${x} 350 h 22 v -16 q -11 -10 -22 0 z" fill="url(#brick${id})" stroke="${S}"/>`;
      // corner bastions
      [[90, 330], [1110, 330]].forEach(([x, y]) => {
        s += `<rect x="${x - 45}" y="${y}" width="90" height="230" fill="url(#brick${id})" stroke="${S}" stroke-width="2"/>`;
        s += `<rect x="${x - 45}" y="${y}" width="90" height="230" fill="url(#brickpat${id})"/>`;
        s += chhatri(x, y, 50, "#B87A4F", "#EFE6D6");
      });
      // gate towers
      [[480, 230], [720, 230]].forEach(([x, y]) => {
        s += `<polygon points="${x - 60},560 ${x + 60},560 ${x + 60},${y + 20} ${x + 40},${y} ${x - 40},${y} ${x - 60},${y + 20}" fill="url(#brick${id})" stroke="${S}" stroke-width="2"/>`;
        s += `<polygon points="${x - 60},560 ${x + 60},560 ${x + 60},${y + 20} ${x + 40},${y} ${x - 40},${y} ${x - 60},${y + 20}" fill="url(#brickpat${id})"/>`;
        for (let k = 0; k < 3; k++) s += `<rect x="${x - 50}" y="${y + 60 + k * 90}" width="100" height="10" fill="#D6A84F" opacity=".55"/>`;
        s += arch(x, y + 140, 40, 60, "#2a120a", "#D6A84F", 1.5);
        s += chhatri(x, y, 70, "#B87A4F", "#EFE6D6");
      });
      // gate body + arch
      s += `<rect x="540" y="300" width="120" height="260" fill="url(#brick${id})" stroke="${S}" stroke-width="2"/>`;
      s += arch(600, 560, 96, 200, "#EFE6D6", S, 2);
      s += arch(600, 560, 76, 182, "#1E0B05", "#D6A84F", 2);
      s += `<path d="M 562 560 V 450 M 638 560 V 450" stroke="#D6A84F" stroke-opacity=".5" stroke-width="2"/>`;
      // ramp
      s += `<path d="M 470 700 L 560 560 L 640 560 L 730 700 Z" fill="#6B3620" opacity=".75"/>`;
      return wrap(id, s, "Illustration of the Lahore Fort's Alamgiri Gate");
    },

    minar(id) {
      let s = sky(id, "dawn");
      s += `<rect x="0" y="590" width="${W}" height="110" fill="url(#ground${id})"/>`;
      s += trees([[110, 1.2], [210, 0.9], [300, 1.1], [900, 1.1], [990, 0.9], [1090, 1.25]], 600);
      // star platform
      for (let i = 0; i < 4; i++) {
        const w = 520 - i * 90, y = 590 - i * 22;
        s += `<path d="M ${600 - w / 2} ${y} Q ${600 - w / 2 + 40} ${y - 26} ${600 - w / 4} ${y - 20} Q ${600} ${y - 34} ${600 + w / 4} ${y - 20} Q ${600 + w / 2 - 40} ${y - 26} ${600 + w / 2} ${y} Z"
          fill="${i % 2 ? "#E8DDCB" : "#D2C3A8"}" stroke="#8a7a60" stroke-width="1.5"/>`;
      }
      // tower
      s += `<polygon points="548,505 652,505 622,150 578,150" fill="url(#marble${id})" stroke="#8a7a60" stroke-width="2"/>`;
      for (let i = -2; i <= 2; i++) s += `<line x1="${600 + i * 18}" y1="505" x2="${600 + i * 8}" y2="150" stroke="#8a7a60" stroke-opacity=".45"/>`;
      [[430, 130], [320, 104], [220, 82]].forEach(([y, w]) => {
        s += `<rect x="${600 - w / 2}" y="${y}" width="${w}" height="12" rx="3" fill="#F6EEDF" stroke="#8a7a60"/>`;
        for (let k = 0; k < 8; k++) s += `<rect x="${600 - w / 2 + 4 + k * (w - 8) / 8}" y="${y - 14}" width="3" height="14" fill="#8a7a60" opacity=".7"/>`;
        s += `<rect x="${600 - w / 2}" y="${y - 18}" width="${w}" height="5" fill="#F6EEDF" stroke="#8a7a60"/>`;
      });
      s += `<rect x="572" y="135" width="56" height="18" fill="#F6EEDF" stroke="#8a7a60"/>`;
      s += onion(600, 135, 30, `url(#marble${id})`, "#8a7a60");
      s += `<g opacity=".9">${trees([[60, 1.5], [1150, 1.6]], 700, "#031A16")}</g>`;
      return wrap(id, s, "Illustration of Minar-e-Pakistan");
    },

    park(id) {
      let s = sky(id, "dawn");
      s += `<rect x="0" y="470" width="${W}" height="230" fill="#0E4A3B"/>`;
      // walkway perspective
      s += `<path d="M 520 470 L 680 470 L 980 700 L 220 700 Z" fill="#CDBB98" opacity=".85"/>`;
      s += `<path d="M 600 470 L 600 700" stroke="#A8936C" stroke-width="3" stroke-dasharray="14 12"/>`;
      // lawns
      s += `<path d="M 0 520 L 470 490 L 200 700 L 0 700 Z" fill="#1E6B45"/><path d="M 1200 520 L 730 490 L 1000 700 L 1200 700 Z" fill="#1E6B45"/>`;
      // background minar
      s += `<polygon points="584,460 616,460 607,230 593,230" fill="url(#marble${id})" stroke="#8a7a60"/>`;
      [[380, 50], [320, 42], [270, 34]].forEach(([y, w]) => (s += `<rect x="${600 - w / 2}" y="${y}" width="${w}" height="6" fill="#F6EEDF" stroke="#8a7a60"/>`));
      s += onion(600, 230, 12, `url(#marble${id})`, "#8a7a60");
      s += `<rect x="520" y="455" width="160" height="16" fill="#E2D6BF"/>`;
      s += trees([[80, 1.3], [200, 1], [330, 0.8], [440, 0.6], [760, 0.6], [870, 0.8], [1000, 1], [1120, 1.3]], 520);
      // fountains
      [[180, 640], [1020, 640]].forEach(([x, y]) => {
        s += `<ellipse cx="${x}" cy="${y}" rx="90" ry="22" fill="url(#water${id})" stroke="#D6A84F" stroke-width="3"/>`;
        for (let k = -2; k <= 2; k++) s += `<path d="M ${x + k * 18} ${y - 4} Q ${x + k * 30} ${y - 90} ${x + k * 44} ${y - 6}" fill="none" stroke="#DFF6F2" stroke-width="2.5" opacity=".8"/>`;
      });
      // lamps
      [[400, 600], [800, 600], [330, 660], [870, 660]].forEach(([x, y]) => (s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 80}" stroke="#0B0E0D" stroke-width="4"/><circle cx="${x}" cy="${y - 84}" r="8" fill="#F5C76A"/><circle cx="${x}" cy="${y - 84}" r="22" fill="#F5C76A" opacity=".18"/>`));
      return wrap(id, s, "Illustration of Greater Iqbal Park");
    },

    wazir(id) {
      const S = "#3A2614", T = `url(#tiles${id})`, T2 = `url(#tiles2${id})`;
      let s = sky(id);
      s += `<rect x="0" y="560" width="${W}" height="140" fill="url(#ground${id})"/>`;
      // dome behind
      s += onion(600, 300, 95, "#D9CDB8", "#8a7a60");
      // facade
      s += `<rect x="230" y="300" width="740" height="260" fill="#C9A77A" stroke="${S}" stroke-width="2"/>`;
      s += `<rect x="230" y="300" width="740" height="40" fill="${T}"/>`;
      s += `<rect x="230" y="520" width="740" height="40" fill="${T}"/>`;
      for (let i = 0; i < 6; i++) {
        const x = 285 + i * 126 + (i > 2 ? 0 : 0);
        if (i === 2 || i === 3) continue;
        s += `<rect x="${x - 40}" y="350" width="80" height="160" fill="${T2}" stroke="${S}"/>`;
        s += arch(x, 505, 46, 110, "#1A2C3A", "#F2C14E", 2);
      }
      // central portal
      s += `<rect x="490" y="250" width="220" height="310" fill="${T}" stroke="${S}" stroke-width="2"/>`;
      s += `<rect x="505" y="265" width="190" height="16" fill="#F2C14E"/>`;
      s += arch(600, 560, 150, 260, T2, S, 2);
      s += arch(600, 560, 116, 228, "#13202B", "#F2C14E", 3);
      s += `<text x="600" y="300" font-family="serif" font-size="22" fill="#13202B" text-anchor="middle" opacity=".7">✦ ✦ ✦</text>`;
      // minarets
      [160, 1040].forEach((x) => (s += minaret(x, 560, 150, 52, "#B88F5C", "#E9DCC2", S, { bands: 3, tiles: `tiles${id}` })));
      [470, 730].forEach((x) => (s += minaret(x, 300, 205, 22, "#B88F5C", "#E9DCC2", S, { bands: 1 })));
      return wrap(id, s, "Illustration of the Wazir Khan Mosque");
    },

    shalimar(id) {
      let s = sky(id, "dawn");
      s += `<rect x="0" y="380" width="${W}" height="320" fill="#174E37"/>`;
      // terraces
      [[380, "#1C5B40"], [470, "#22684A"], [575, "#277654"]].forEach(([y, c], i) => {
        s += `<rect x="0" y="${y}" width="${W}" height="${700 - y}" fill="${c}"/>`;
        s += `<rect x="0" y="${y}" width="${W}" height="8" fill="#D9CDB8"/>`;
        s += `<rect x="0" y="${y + 8}" width="${W}" height="6" fill="#000" opacity=".2"/>`;
      });
      // central channel (perspective)
      s += `<path d="M 570 380 L 630 380 L 720 700 L 480 700 Z" fill="url(#water${id})" stroke="#D9CDB8" stroke-width="4"/>`;
      // cross channels
      s += `<path d="M 120 520 L 1080 520 L 1100 540 L 100 540 Z" fill="url(#water${id})" stroke="#D9CDB8" stroke-width="3"/>`;
      // beds
      [[140, 600, 300], [760, 600, 300], [200, 420, 330], [670, 420, 330]].forEach(([x, y, w]) => (s += `<rect x="${x}" y="${y}" width="${w}" height="${y > 500 ? 60 : 36}" rx="6" fill="#2F8A5E" stroke="#D9CDB8" stroke-width="2"/>`));
      // fountains
      for (let i = 0; i < 9; i++) {
        const t = i / 8, y = 395 + t * 290, x = 600, spread = 6 + t * 18;
        s += `<path d="M ${x - spread} ${y} Q ${x} ${y - 20 - t * 30} ${x + spread} ${y}" fill="none" stroke="#E6FBF7" stroke-width="${1.5 + t * 2}" opacity=".9"/>`;
      }
      for (let i = 0; i < 12; i++) {
        const x = 150 + i * 82;
        s += `<path d="M ${x - 6} 530 Q ${x} 495 ${x + 6} 530" fill="none" stroke="#E6FBF7" stroke-width="2" opacity=".85"/>`;
      }
      // baradari pavilion
      s += `<rect x="470" y="290" width="260" height="92" fill="url(#marble${id})" stroke="#9e8f74" stroke-width="2"/>`;
      for (let i = 0; i < 5; i++) s += arch(500 + i * 50, 380, 30, 66, "#2C2A22", "#D6A84F", 1.5);
      s += `<path d="M 460 292 Q 600 240 740 292 Z" fill="#EFE6D6" stroke="#9e8f74" stroke-width="2"/>`;
      s += chhatri(480, 292, 30, "#EFE6D6", "#9e8f74") + chhatri(720, 292, 30, "#EFE6D6", "#9e8f74");
      s += cypress([[90, 1.3], [230, 1], [360, 0.8], [840, 0.8], [970, 1], [1110, 1.3]], 470);
      s += `<rect x="0" y="372" width="${W}" height="14" fill="#B5543A" opacity=".9"/>`;
      for (let x = 0; x < W; x += 30) s += `<rect x="${x}" y="362" width="16" height="10" fill="#B5543A"/>`;
      return wrap(id, s, "Illustration of the Shalimar Gardens");
    },
  };

  /* Full Lahore skyline silhouette for the intro & hero */
  function skyline(stroke = "#D6A84F") {
    const f = "#020D0B";
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="${f}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">`;
    // fort walls left
    s += `<path d="M0 360 V250 h30 v-12 h14 v12 h20 v-12 h14 v12 h20 v-12 h14 v12 h20 v-12 h14 v12 h30 V200 h60 v50 h40 v-30 l30 -20 l30 20 v30 h40 V360 Z"/>`;
    // badshahi
    s += `<path d="M420 360 V250 h40 v-140 l8 -18 l8 18 v140 h30 V200 h40 v-10 c0 -30 30 -40 40 -70 c10 30 40 40 40 70 v10 h50 v-40 c0 -40 50 -60 60 -100 c10 40 60 60 60 100 v40 h50 v-10 c0 -30 30 -40 40 -70 c10 30 40 40 40 70 v10 h40 v50 h30 V110 l8 -18 l8 18 v140 h40 V360 Z"/>`;
    // minar
    s += `<path d="M1040 360 l40 -30 h20 l14 -230 h-6 v-10 h30 v10 h-6 l14 230 h20 l40 30 Z"/><path d="M1124 92 c0 -16 14 -20 18 -36 c4 16 18 20 18 36 Z"/>`;
    // wazir-style minarets and dome right
    s += `<path d="M1260 360 V230 h20 V140 l10 -16 l10 16 v90 h40 v-20 c0 -30 40 -45 50 -80 c10 35 50 50 50 80 v20 h40 v-90 l10 -16 l10 16 v90 h20 V360 Z"/>`;
    s += `<path d="M1500 360 V270 h100 V360 Z"/>`;
    s += `</g></svg>`;
    return s;
  }

  function get(name) {
    uid += 1;
    const fn = scenes[name] || scenes.badshahi;
    return fn(uid);
  }

  function dataURI(name) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(get(name)).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
  }

  return { get, dataURI, skyline, names: Object.keys(scenes) };
})();
