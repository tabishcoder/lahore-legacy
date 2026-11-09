/* =========================================================================
   LAHORE LEGACY — PHOTOGRAPHS & LIVE CREDITS (Wikimedia Commons)
   -------------------------------------------------------------------------
   LL.Photos   resolves the best working photograph for a location:
               tries the local override, then each Commons file in order,
               skipping any that fail to load or are below a minimum width.
   LL.Credits  fetches photographer + licence for every Commons file from the
               public Commons API (CORS-enabled via origin=*), caches them for
               14 days, and exposes them to captions and the credits table.
   ========================================================================= */

window.LL = window.LL || {};

LL.Credits = (function () {
  const KEY = "lahoreLegacy.credits.v1";
  const TTL = 14 * 86400000;
  let cache = {};
  try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && Date.now() - raw.t < TTL) cache = raw.d || {}; } catch (e) {}
  let pending = null;

  const strip = (html) => { const d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };

  function allFiles() {
    const files = [];
    const add = (g) => (g || []).forEach((x) => files.push(x.file));
    Object.values(LL.ASSETS.locations).forEach((l) => { add(l.gallery); add(l.old); });
    Object.values(LL.ASSETS.extras).forEach((l) => add(l.gallery));
    return [...new Set(files)];
  }

  /** Fetch credits for all configured files (batched, 40 titles per request). */
  function load() {
    if (pending) return pending;
    const todo = allFiles().filter((f) => !cache[f]);
    if (!todo.length) return (pending = Promise.resolve(cache));
    const batches = [];
    for (let i = 0; i < todo.length; i += 40) batches.push(todo.slice(i, i + 40));
    pending = Promise.all(batches.map((b) => {
      const titles = b.map((f) => "File:" + f).join("|");
      const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata%7Csize&iiextmetadatafilter=Artist%7CLicenseShortName%7CLicenseUrl%7CDateTimeOriginal&titles=" + encodeURIComponent(titles);
      return fetch(url).then((r) => r.json()).then((j) => {
        const norm = {};
        ((j.query && j.query.normalized) || []).forEach((n) => (norm[n.to] = n.from));
        Object.values((j.query && j.query.pages) || {}).forEach((pg) => {
          const title = norm[pg.title] || pg.title;
          const file = title.replace(/^File:/, "");
          const match = b.find((x) => x === file || x.replace(/_/g, " ") === file.replace(/_/g, " ")) || file;
          if (pg.missing !== undefined || !pg.imageinfo) { cache[match] = { missing: true }; return; }
          const m = pg.imageinfo[0].extmetadata || {};
          cache[match] = {
            artist: strip(m.Artist && m.Artist.value) || "Unknown author",
            license: strip(m.LicenseShortName && m.LicenseShortName.value) || "See file page",
            licenseUrl: (m.LicenseUrl && m.LicenseUrl.value) || "",
            date: strip(m.DateTimeOriginal && m.DateTimeOriginal.value).slice(0, 40),
            width: pg.imageinfo[0].width, height: pg.imageinfo[0].height,
          };
        });
      });
    })).then(() => {
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: cache })); } catch (e) {}
      document.dispatchEvent(new CustomEvent("ll:credits"));
      return cache;
    }).catch((err) => { console.warn("[Credits] Commons API unavailable:", err.message || err); pending = null; return cache; });
    return pending;
  }

  function get(file) { return cache[file] || null; }

  /** Short attribution line: "Photo: Author · CC BY-SA 4.0 · Wikimedia Commons" */
  function line(file) {
    const c = get(file);
    const page = LL.ASSETS.commonsPage(file);
    if (!c || c.missing) return `Photo: <a href="${page}" target="_blank" rel="noopener">Wikimedia Commons</a> (author & licence on file page)`;
    const lic = c.licenseUrl ? `<a href="${c.licenseUrl}" target="_blank" rel="noopener">${LL.UI.esc(c.license)}</a>` : LL.UI.esc(c.license);
    return `Photo: ${LL.UI.esc(c.artist)} · ${lic} · <a href="${page}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
  }

  return { load, get, line, allFiles };
})();

LL.Photos = (function () {
  const status = {};          // url -> true | false
  const chosen = {};          // key -> resolved item

  function source(key) { return LL.ASSETS.locations[key] || LL.ASSETS.extras[key]; }

  function candidates(key, width) {
    const s = source(key);
    if (!s) return [];
    const list = [];
    if (s.photo && s.photo.src) list.push({ url: s.photo.src, local: true, by: s.photo.by, caption: s.name });
    // photos downloaded and converted to WebP by tools/fetch-photos.mjs
    const local = (LL.LOCAL_PHOTOS || {})[key] || [];
    local.forEach((g) => list.push({ url: width <= 500 && g.small ? g.small : g.src, local: true, caption: g.caption, ur: g.ur, file: g.file, w: g.w, h: g.h }));
    if (!local.length) (s.gallery || []).forEach((g, i) => list.push({ url: LL.ASSETS.commons(g.file, width), alt: LL.ASSETS.commonsRedirect(g.file, width), file: g.file, caption: g.caption, ur: g.ur, index: i }));
    return list;
  }

  function probe(url) {
    if (status[url] !== undefined) return Promise.resolve(status[url]);
    if (status["~" + url]) return status["~" + url];
    return (status["~" + url] = new Promise((res) => {
      const im = new Image();
      im.decoding = "async";
      const done = (v) => { clearTimeout(t); status[url] = v; res(v); };
      const t = setTimeout(() => done(false), 9000);
      im.onload = () => done(im.naturalWidth >= 200 ? { w: im.naturalWidth, h: im.naturalHeight } : false);
      im.onerror = () => done(false);
      im.src = url;
    }));
  }

  /* try the direct thumbnail, then the redirect URL */
  async function tryItem(c) {
    let ok = await probe(c.url);
    if (!ok && c.alt) { ok = await probe(c.alt); if (ok) c = { ...c, url: c.alt }; }
    return ok ? { ...c, w: ok.w, h: ok.h } : null;
  }

  /** Resolve the first working photo (optionally starting at a gallery index). */
  async function resolve(key, width = 1280, start = 0) {
    const ck = `${key}|${LL.ASSETS.snap(width)}|${start}`;
    if (chosen[ck]) return chosen[ck];
    const list = candidates(key, width);
    const ordered = start ? list.slice(start).concat(list.slice(0, start)) : list;
    for (const c of ordered) {
      const got = await tryItem(c);
      if (got) return (chosen[ck] = got);
    }
    return (chosen[ck] = null);
  }

  /** All working gallery photos for a location (for galleries / panoramas). */
  async function gallery(key, width = 1280) {
    const res = await Promise.all(candidates(key, width).map(tryItem));
    return res.filter(Boolean);
  }


  /* No photo could load: show the place name, never a drawing. */
  function placeholder(key, el) {
    const s = source(key);
    const site = (LL.SITES || []).find((x) => x.id === key);
    el.classList.add("is-placeholder");
    el.innerHTML = `<div class="noimg"><b>${LL.UI.esc(site ? site.name.en : (s && s.name) || "")}</b>${site ? `<span lang="ur">${LL.UI.esc(site.name.ur)}</span>` : ""}<small>Photo unavailable right now</small></div>`;
  }

  /** First historic photo that loads, or null (Then & Now slider). */
  async function old(key, width = 1600) {
    const s = source(key);
    for (const o of (s && s.old) || []) {
      const got = await tryItem({ url: LL.ASSETS.commons(o.file, width), alt: LL.ASSETS.commonsRedirect(o.file, width), file: o.file, caption: o.caption, ur: o.ur });
      if (got) return got;
    }
    return null;
  }

  /** Any photo of this place already loaded (largest first), for an instant first frame. */
  function peek(key, start = 0) {
    let best = null;
    Object.keys(chosen).forEach((k) => {
      const [kk, w, st] = k.split("|");
      if (kk === key && +st === start && chosen[k] && (!best || +w > best.w0)) best = { ...chosen[k], w0: +w };
    });
    return best;
  }

  return { resolve, gallery, candidates, placeholder, probe, source, old, peek };
})();
