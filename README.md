# Lahore Legacy — lean edition

**Lahore in five minutes.** Urdu is the default language (easy-to-read Naskh font); English is one tap away. Six historic places, one minute each: the story, three facts, what to look for when you visit, then & now, photos, visitor info and a 3-question stamp check. There is also a 60-second quiz with a shareable score card, a half-day walking route, and the whole site works in English and Urdu.

Plain HTML, CSS and vanilla JS. No build step.

## Run
Open the folder in VS Code → Live Server on `index.html`, or `python3 -m http.server 8000`.
Photos load from Wikimedia Commons, so an internet connection is needed (see "Your own photos" below).

## Pages
| Route | What it is |
|---|---|
| `#/` | Home: hero photo, six site cards, walk + quiz, certificate when all 6 stamps are collected |
| `#/site/<id>` | One place: story → facts → look-for checklist → then & now → photos → before you go → stamp check → next place |
| `#/quiz` | 60-second quiz → share card (Web Share or PNG download) |
| `#/walk` | Delhi Gate → Wazir Khan → Fort → Badshahi → Food Street → Minar-e-Pakistan |

## Files
```
index.html
css/style.css            all styles (responsive, RTL for Urdu)
js/config/assets.js      ★ every photo (Commons files, your own photos, historic "then" photos)
js/data/sites.js         ★ all content in English + Urdu, visit info, walk route, quiz bank, sources
js/i18n.js               interface text (Urdu default, English via switch)
js/commons.js            loads photos, skips broken ones, live credits from the Commons API
js/ui.js                 photos, lightbox, toast, progress (localStorage)
js/share.js              quiz score card + certificate (canvas)
js/app.js                router and pages
js/illustrations.js      placeholder artwork if no photo loads (clearly labelled)
archive/v2-full/         the previous full version (6 games, passport, etc.) — still runs on its own
```

## Your own photos (the biggest upgrade you can make)
Put a photo in `assets/images/` and set it for that site in `js/config/assets.js`:
```js
photo: { src: "assets/images/badshahi.jpg", by: "Shoaib Mushtaq" },
```
It is used first everywhere and credited with your name. Compress to WebP/JPG ~1600–2400 px wide, under ~400 KB.

## Then & now
Each site has an `old` list of historic Commons photos. If none loads, the section is hidden. Add more public-domain photos (19th-century photographs on Commons) to fill it in for every site.

## Visitor info
Checked in November 2026 (sources are listed in `js/data/sites.js` and in the site's Credits dialog). Timings and ticket prices change — update `visit` in `sites.js` when they do. The site tells visitors to confirm before going.

## Progress
Seen places, stamps, look-for ticks and the best quiz score are stored in this browser (localStorage). Stamps from the previous version are carried over automatically. There are no accounts and no online leaderboard.


## v5 — tourist guide + virtual tour

- **Two paths on the home page:** "Plan my visit" (for people in Lahore) and "Take the virtual tour" (for everyone else).
- **Plan** (`#/plan`): 2–3 hours / half day / full day routes, with times, notes, Google Maps directions and practical tips.
- **Virtual tour** (`#/tour`): full-screen look-around viewer for all six places (drag, pinch/zoom, phone tilt, fullscreen). It uses your panorama first, then the Commons photos. Wide images are labelled "Panorama", normal ones "Photo"; real 360° captures open as external links.
- **Language:** the default is English with Urdu for the story and key info (`Urdu + English`). The header button switches to **English only**. There is no all-Urdu mode on purpose.
- **Quick facts** on every place page: time needed, entry and best time, plus Directions / Virtual view buttons.
- **Adding your own panoramas:** see `assets/panoramas/README.txt`.


## v6 — 24 heritage places

- **18 more places**, grouped by area: Walled City (Delhi Gate, Shahi Hammam, Sunehri Masjid, Haveli of Nau Nihal Singh, Data Darbar), Fort & Iqbal Park (Hazuri Bagh, Tomb of Allama Iqbal, Samadhi of Ranjit Singh), Shahdara (tombs of Jahangir, Asif Khan and Nur Jahan), British-era Lahore (Tomb of Anarkali, Lahore Museum & Zamzama, GCU, Quaid-e-Azam Library, Railway Station) and Gardens & gateways (Gulabi Bagh, Chauburji). Content lives in `js/data/more.js`; photos in `js/config/assets.js`.
- **Home page:** "the big six" first, then every place by area with filter chips.
- **Plan:** a new "Second day" route (Shahdara tombs + The Mall). The walking route now links to Delhi Gate, Shahi Hammam and Sunehri Masjid pages.
- **Removed:** photo credit lines on pictures and the external 360° links. A small "Photo credits" link stays in the footer, because the Wikimedia Commons licences require attribution. Once a place uses your own photos, its Commons files can be deleted from `assets.js`.
- Stamps count out of 24; the certificate unlocks at 6 stamps.


## v7 — real photos only, explorer map, game, faster images

- **No drawn illustrations.** Every image is a real photograph. If a photo can't load, the place name is shown instead.
- **Faster photos:** direct Wikimedia thumbnail URLs (no redirect), right-sized per spot (330 px for pins and lists, 500 px for cards, 960/1920 px for big photos), a quick small preview that sharpens, and fast fallback.
- **Fastest: host the photos yourself, as WebP.** On your computer, once:
  ```
  cd lahore-legacy
  npm install sharp
  node tools/fetch-photos.mjs
  ```
  This downloads every photo, saves 1600 px and 480 px WebP copies in `assets/photos/`, and writes `js/config/local-photos.js`. The site then uses them automatically.
- **Map** (`#/map`, "My Lahore"): every place as a photo pin on a simple map drawn from real coordinates (`js/data/geo.js`). Pins show progress (not yet / seen / stamped / visited). Close pins group together; filter by area. Also: rank, points, area progress and 12 badges.
- **Check-in:** each place page asks "Have you been here?" — tap "I've been here", or "Check in here" to confirm with the phone's location (within 500 m) for bonus points.
- **Plan** is now a road map: photo stops along a road that fills in as you tick stops off, with the route drawn on the map beside it.
- Progress, points and badges are saved in this browser only. There is no online leaderboard.


## v8 — motion, background videos, reward moments

- **Background videos** (home + Badshahi, Fort, Delhi Gate, Minar/Iqbal Park pages): real Lahore footage from Pexels, listed with creators in `js/config/videos.js` and in the credits dialog. Phones get vertical clips. Lighter 720p/540p files are tried first. Videos are skipped on slow connections, with Data Saver, or with "reduce motion"; they pause off-screen and in background tabs; a pause button sits in the corner.
- **Faster / own videos:** `node tools/fetch-videos.mjs` (needs ffmpeg) downloads every clip, trims to 10 s, compresses to a silent 720p MP4 (~1–3 MB) in `assets/videos/`, and switches the site to the local files. Your own iPhone clips: put the MP4 in `assets/videos/` and set `local:` on a clip.
- **Home hero:** photo slideshow with slow Ken Burns zoom; after sunset in Lahore it shows night photos first.
- **Page morph:** a card's photo grows into the place page's hero (View Transitions; a simple fade elsewhere).
- **Scroll:** sections rise in, the hero moves slower than the text (parallax), years count up, a gold reading bar on place pages, 3D tilt and light sheen on cards (mouse only), blurred photo behind each area.
- **Rewards:** stamp slams onto the screen with gold confetti, "+points" float up, badges flip open with a shine, a rank-up banner drops in. Tap to skip.
- **Map:** pins drop in one by one, the route draws itself, and the next place to see pulses.
- With "reduce motion" on, all of this is switched off and photos stay still.


## v9 — easy to use (audit-driven)

Measured on a 390 px phone before → after:

| | before | after |
|---|---|---|
| Home length | 11.6 screens, 857 words | 5.5 screens (first place on screen 1), 484 words |
| Photos requested on opening Home | 35 | 4 (the rest load as you scroll) |
| Map | 62% of screen inside a long page; swiping on it trapped the page | full screen, list in a bottom sheet |
| Plan: first stop | 1,196 px down | 796 px down, one tap to start |
| Plan: buttons under 40 px | 32 | 6 (footer links) |
| Video still downloading after leaving Home | yes | fixed |
| Popup on first visit | yes | a small toast instead |

What changed:
- **Home:** search (English or Urdu), three big actions — **Near me**, **Plan a day**, **Virtual tour** — then swipe rows: "Good right now" (changes with the time of day in Lahore), "the big six", and one row per area.
- **Map** (`#/map`, `#/map/near`, `#/map/<place>`, `#/map/area-<area>`): real street map (OpenStreetMap data, CARTO tiles, no library), your location as a blue dot, pins with names, a bottom sheet listing places nearest first, Directions on every row. Falls back to a simple outline map when offline.
- **Plan** (`#/plan/<id>`): "How much time do you have?" → 3 big choices (second day under "more"). Each stop has a tick button and **Navigate**. **Start** opens a full-screen, one-stop-at-a-time mode ("I'm here · next stop"). **Whole route in Google Maps** sends every stop at once (walking or driving, chosen from the distances). **Share** sends the plan to WhatsApp or the phone's share sheet.
- **Me** (`#/me`): rank, points, area progress and badges moved here from the map.
- **Place page:** distance from you (once location is on) and a **Share** button.
- Minimum sizes: buttons 42–48 px, Urdu body text 17 px.


## Map key (required for street maps)

Since 25 September 2026 CARTO serves map tiles only with a key. It is free and takes a minute, no account needed: <https://carto.com/basemaps/apikey>. Put it in `js/config/keys.js`:

```js
LL.KEYS = { carto: "your-key-here" };
```

Free for non-commercial sites up to 5 million tile requests a month (1 million if commercial). In the CARTO dashboard, restrict the key to your domain so nobody else can use it. Keep the "© OpenStreetMap · © CARTO" credit visible. Without a key the map still works, but shows a simple outline instead of streets.
#   l a h o r e - l e g a c y  
 
## v10 — heritage look
The dark-and-gold theme is gone. The site now looks like an old travel notebook:
- **Paper and ink:** parchment background with a light grain, dark-brown ink text.
- **Colours from the city:** Lahori brick red, kashi blue (Wazir Khan's tiles), haldi yellow, garden green.
- **Type:** IM Fell English for headings (old printed books), EB Garamond for reading, Noto Naskh for Urdu. Labels are small caps instead of spaced-out capitals.
- **Shapes:** place photos sit in pointed Mughal arches (jharokhas), photo heroes end in a row of arches, the footer has a jali pattern, stamps are red ink.
- **Map** tiles are toned sepia, like a survey sheet. Share cards and the certificate are printed on paper too.
- All animations are unchanged. The palette lives at the top of `css/style.css`; the look itself is the "HERITAGE LAYER" at the end of it.

## v11 — official sources, 360° Royal Trail
Photos, 360° views and information from official heritage bodies, used with permission and credited on every photo and in **Credits & sources**.

- **Royal Trail in 360°** (`#/trail`): fifteen 360° panoramas from the Walled City of Lahore Authority's virtual tour, Delhi Gate to Chowk Wazir Khan. Drag to look around, tap the arrows to walk, phone tilt and full screen on mobile. Viewer: Pannellum (loaded from cdnjs only on that page). Data: `js/data/trail360.js`; images: `assets/pano360/<stop>/` (six 1536 px WebP cube faces each).
- **Official photos** (`js/config/official-photos.js`, `assets/official/`): 31 place photos from WCLA, the Lahore Fort, Shahi Hammam and Shalimar sites, the Department of Archaeology and Museums and the Lahore Museum, as WebP at 1600 px and 640 px. They are shown before Wikimedia photos.
- **New sections** (`js/data/official.js`): how the Shahi Hammam was saved (timeline + before/after boards + award), Lahore Museum collection highlights with a link to the museum's own VR tour, Lahore Fort accessibility information, Shalimar conservation, and WCLA's guided tours on the Plan page.
- heritage.pakistan.gov.pk and punjab.gov.pk did not respond, and whc.unesco.org blocks automated access, so nothing was taken from them directly.

## Analytics (Google Analytics 4 + Microsoft Clarity)
Open `js/analytics.js` and paste your IDs at the top:
```js
const GA4_ID = "G-XXXXXXXXXX";   // visitors, countries, pages, time on site
const CLARITY_ID = "xxxxxxxxxx"; // session recordings + heatmaps
```
Leave one empty to switch it off. Nothing loads on localhost. Every page change is sent as a page view, plus these events: `open_place`, `stamp_earned`, `quiz_complete`, `trail_stop`, `get_directions`, `share`, `outbound_click`, `language`.
