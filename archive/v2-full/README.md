# Lahore Legacy

> **Version 2 — museum edition.** Real Wikimedia Commons photography with live credits, a refined ivory/sandstone/gold/navy/burgundy design, a photographic site viewer, upgraded games (levels, ranks, scoring, records), expeditions, discovery collection and an ambient soundscape. All v1 features and saved progress are preserved.

A cinematic, gamified heritage adventure through Lahore — built with plain **HTML5, CSS3 and vanilla JavaScript (ES6+)**. No framework, no build step.

> Explore the Past. Play the Games. Discover the Heritage.

## Run it

Open the folder in VS Code and start **Live Server** on `index.html`, or:

```bash
cd lahore-legacy
python3 -m http.server 8000      # then open http://localhost:8000
```

Opening `index.html` directly (double-click) also works, but a local server is recommended.

## What's inside

| Area | Features |
|---|---|
| **Cinematic intro** | Canvas golden-dust particles, emerald glow, animated light trails, self-drawing SVG skyline and emblem, shimmering logo, *Begin Your Adventure* + *Skip Intro*. Shown once per browser session (footer → *Replay intro*). |
| **Home** | Parallax hero, floating Mughal ornaments, mouse-following glow, 3D-tilt feature cards, Daily Challenge, Quest Tracker, Heritage Trail. |
| **Explore Lahore** | 6 sites (Badshahi Mosque, Lahore Fort, Minar-e-Pakistan, Greater Iqbal Park, Wazir Khan Mosque, Shalimar Gardens). Each dossier has overview, location details, tap-to-reveal facts, 5 missions, a stamp test, related games and a panorama link. Filters. |
| **Panorama Explorer** | Drag with inertia, wheel / pinch zoom, keyboard (← → + − 0), buttons, fullscreen, numbered hotspots + info panel, location switcher with transitions. True 360° images use **Marzipano** (loaded on demand from CDN). Every view is labelled honestly: *360° Spherical*, *Partial Panorama*, *Photograph · not 360°* or *Illustrated Scene · not a 360° capture*. |
| **Games Center** | 6 playable games (below). |
| **Passport** | XP ring, 6 ranks, 6 heritage stamps, 6 achievements, rank ladder, local leaderboard, game records, activity log, multiple player profiles, avatar picker, reset. |

### The six games

1. **The Lost Lahore** — branching story (fictional), hidden clue words in the text, 5 journal pages, locked choices, two endings.
2. **Heritage Detective** — fictional case files, torch-light evidence board, hidden evidence, riddles, accusations, reputation stars.
3. **Mystery Chamber** — escape room: searchable objects, clue log, number-dial lock (1673), symbol-order lock (by monument age), spoken riddle; countdown, three difficulty levels, hints cost time, success / failure + replay.
4. **Rebuild Lahore** — drag-and-drop tile puzzle of 6 monuments, 3×3 / 4×4 / 5×5, timer, ghost image, progress bar. Works with mouse, touch, and tap-to-place / keyboard.
5. **Heritage Quest** — clue cards on a stylised map, animated travel, lanterns (lives), hidden-object search at each site, reward coins, treasure ending.
6. **History Rush** — timed trivia, 3 difficulties, streak multiplier (up to ×5), +3 s streak bonus, instant feedback, local scoreboard, keyboard 1–4.

Every game story is labelled **Fictional story**; every fact the player learns or is tested on is real history (see `js/data/history.js`).

### Gamification

- **XP** for exploring sites, revealing facts, panoramas, hotspots, stamps, hidden clues, games and the daily challenge.
- **Ranks**: Explorer → Apprentice (150) → Heritage Seeker (400) → Detective (800) → Guardian (1400) → Lahore Legend (2200).
- **Achievements**: First Discovery, Mystery Solver, Monument Master, Heritage Explorer, Puzzle Champion, Lahore Legend.
- **Daily challenge** + **streaks** (consecutive days; streak bonus up to +35 XP).
- Popups, confetti bursts, toasts, progress bars, synthesised sound effects (off by default — speaker icon in the header).

### ⚠️ About the leaderboard and accounts

Progress is stored with **localStorage**, so it lives only in this browser on this device. The leaderboard compares the player profiles on that device. A **real shared leaderboard and secure user accounts require a backend and database** (for example Supabase or Firebase with authentication, storing XP / scores server-side and validating them so they can't be edited in the browser). `js/gamification.js` is the single place to connect one.

## Project structure

```
lahore-legacy/
├── index.html
├── css/
│   ├── style.css          design system, layout, components
│   ├── animations.css     intro, reveals, keyframes, reduced-motion
│   ├── games.css          game stage + all six games
│   └── responsive.css     1180 / 980 / 720 / 460 px breakpoints
├── js/
│   ├── config/assets.js   ★ central image & panorama register (paths, credits, licences)
│   ├── data/history.js    ★ locations, facts, hotspots, trivia, ranks, achievements, games
│   ├── illustrations.js   original SVG artwork of each monument + skyline
│   ├── audio.js           Web Audio sound effects (user-controlled)
│   ├── gamification.js    XP, ranks, achievements, stamps, missions, daily, streaks, profiles
│   ├── animations.js      particles, confetti, scroll reveals, glow, tilt, parallax
│   ├── ui.js              media loader, modal, toasts, celebrations, credits
│   ├── navigation.js      hash router + mobile menu
│   ├── explore.js         location cards + dossiers
│   ├── panorama.js        flat pan/zoom engine + Marzipano 360° engine
│   ├── passport.js        passport, HUD, daily challenge, quest tracker
│   ├── main.js            boot
│   └── games/
│       ├── registry.js    Games Center + game stage
│       ├── lost-lahore.js
│       ├── heritage-detective.js
│       ├── mystery-chamber.js
│       ├── rebuild-lahore.js
│       ├── heritage-quest.js
│       └── history-rush.js
└── assets/
    ├── images/      put photographs here
    ├── panoramas/   put panoramas here
    ├── icons/       favicon
    └── audio/       optional recorded sounds
```

## What changed in v2

- **Real photographs.** Every site, the homepage, the intro, galleries, the site viewer and the games use photographs from Wikimedia Commons (listed in `js/config/assets.js`). Each slot tries the files in order and skips any that fail or are too small; if none load, a placeholder illustration appears with a clear *Placeholder illustration — photo unavailable* label.
- **Live credits.** `js/commons.js` asks the public Commons API (from the visitor's browser) for each file's author and licence, caches them for 14 days, and shows them under images and in *Image credits & licences*.
- **Design.** New palette (Warm Ivory, Sandstone, Antique Gold, Deep Charcoal, Midnight Navy, Muted Burgundy, Warm White), Cormorant Garamond + Manrope typography, photo-first cards, restrained motion. Particles, cursor glow, card tilt, confetti and emoji icons were removed; milestones use a quiet notice card and XP toasts are merged.
- **Explore.** Dossiers now have tabs: Overview, History & architecture, Timeline (dated), Gallery (with lightbox), Missions and Sources.
- **Site viewer.** Pan/zoom through each site's real photographs (labelled *Photograph · not a 360° view*), or switch to the annotated plan with hotspots. Points of interest are listed beside the viewer. Where a real 360° capture exists online, an *Open real 360° tour* link opens it on 360Cities (external).
- **Games.** Lost Lahore: 3 difficulties, lamp-oil budget, history checks, titles. Heritage Detective: Constable → Chief Inspector ranks, timers, 5 cases, photo reveals. Mystery Chamber: archive photo plates, penalties, star ratings. Rebuild Lahore: real-photo puzzles, Apprentice → Master (6×6) unlocks, peek & hint. Heritage Quest: real-photo sigil hunts, Expert mode with no map labels, postcards. History Rush: explanations, 50:50 lifeline, sudden death.
- **Gamification.** 12 honours (6 new), 4 rank-locked expeditions, a discovery collection (facts + points of interest), per-game statistics and per-level records, monogram player crests. Existing v1 progress in localStorage is kept.
- **Sound.** Separate effects and ambient soundscape (synthesised drone, breeze, distant bells), each with its own volume, plus *Mute all*. Nothing plays until the visitor turns it on.

## Adding your photographs & panoramas

Photographs load from Wikimedia Commons by default (an internet connection is required). To change them:

- **Swap a Commons photo:** edit the `gallery` list for that location in `js/config/assets.js` — just the Commons file name and a caption. Credits update automatically.
- **Use your own photo:** put it in `assets/images/` and set `photo.src` for that location (e.g. `"assets/images/badshahi-mosque.jpg"`). Local photos are tried first.
- **Offline / self-hosting:** download the Commons files you want into `assets/images/` and point `photo.src` at them; keep their author and licence in your credits.

Please glance at each photograph once on a connected browser to confirm it shows what its caption says, and replace any you would rather not use.

For panoramas, set `panorama.type` and `panorama.src`:

| type | Use for | Viewer |
|---|---|---|
| `equirect` | a full 360°×180° spherical image (2:1 ratio) | Marzipano |
| `partial` | a wide horizontal panorama (set `fov`, e.g. `180`) | flat pan/zoom |
| `photo` | ordinary photographs (default — uses the location's gallery) | flat pan/zoom |
| `illustration` | the built-in SVG scene (default) | flat pan/zoom |

**Never set `equirect` for a flat photo.** Hotspot positions (`x`, `y` in %) are in `js/data/history.js`; adjust them to match your image.

**Wikimedia Commons:** open the file page, check the licence (CC BY / CC BY-SA / public domain), and copy the author and licence exactly into `assets.js`. CC BY-SA images require attribution — the footer's *Image credits & licences* table shows it.

## Historical accuracy

Facts in `js/data/history.js` use widely documented dates and figures (UNESCO, Walled City of Lahore Authority, standard histories). Where sources vary, the wording says "about" or "commonly cited". Please verify before publishing and edit freely — all games read from this one file.

## Accessibility & performance

- `prefers-reduced-motion` disables particles, parallax and heavy animation.
- Keyboard navigation, focus styles, ARIA labels, skip link, Escape closes dialogs.
- No images to download by default (SVG artwork), fonts from Google Fonts, Marzipano loaded only for 360° images.

## Credits

- Fonts: Cinzel, Cormorant Garamond, Manrope, Noto Nastaliq Urdu — Google Fonts (SIL OFL).
- 360° viewer: Marzipano (Apache-2.0), loaded from jsDelivr only when needed.
- Illustrations, code and game content: original to this project.
