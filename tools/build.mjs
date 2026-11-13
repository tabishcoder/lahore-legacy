/* Lahore Legacy build: bundle + minify JS and CSS into dist/
   Run before deploying: node tools/build.mjs
   The repo keeps the original source files; dist/ holds the production bundle.
   index.html is written to use the bundles.
   Run `node tools/build.mjs --dev` to switch back to the un-bundled source
   for local editing. */

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { minify } = require("terser");
const crypto = await import("node:crypto");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dev = process.argv.includes("--dev");

const SCRIPTS = [
  "js/analytics.js", "js/md5.js",
  "js/config/assets.js", "js/config/local-photos.js", "js/config/official-photos.js", "js/config/videos.js", "js/config/keys.js",
  "js/data/sites.js", "js/data/guide.js", "js/data/more.js", "js/data/geo.js", "js/data/trail360.js", "js/data/official.js",
  "js/i18n.js", "js/ui.js", "js/commons.js", "js/share.js", "js/viewer.js", "js/game.js", "js/lahoremap.js", "js/motion.js", "js/fx.js",
  "js/trail360.js", "js/ease.js", "js/delight.js", "js/app.js",
];

const SCRIPT_START = "<!-- scripts:begin -->";
const SCRIPT_END = "<!-- scripts:end -->";
const CSS_START = "<!-- css:begin -->";
const CSS_END = "<!-- css:end -->";

async function read(f) { return fs.readFile(path.join(ROOT, f), "utf8"); }
async function write(f, s) { await fs.mkdir(path.dirname(path.join(ROOT, f)), { recursive: true }); await fs.writeFile(path.join(ROOT, f), s); }
function hash(s) { return crypto.createHash("sha1").update(s).digest("hex").slice(0, 8); }

async function minifyCss(src) {
  let s = src;
  s = s.replace(/\/\*[\s\S]*?\*\//g, "");                     // strip comments
  s = s.replace(/\s+/g, " ");                                 // collapse whitespace
  s = s.replace(/\s*([{}:;,>+~])\s*/g, "$1");                 // trim around separators
  s = s.replace(/;}/g, "}");                                   // drop last ;
  s = s.replace(/:0(px|em|rem|%|vh|vw)/g, ":0");               // 0px -> 0
  return s.trim();
}

const htmlPath = path.join(ROOT, "index.html");
let html = await fs.readFile(htmlPath, "utf8");

if (dev) {
  // restore the dev script/css lines
  const devScripts = SCRIPTS.map(s => `  <script src="${s}"></script>`).join("\n");
  const devCss = `  <link rel="stylesheet" href="css/style.css" />`;
  html = html.replace(new RegExp(`${SCRIPT_START}[\\s\\S]*?${SCRIPT_END}`), `${SCRIPT_START}\n${devScripts}\n  ${SCRIPT_END}`);
  html = html.replace(new RegExp(`${CSS_START}[\\s\\S]*?${CSS_END}`), `${CSS_START}\n${devCss}\n  ${CSS_END}`);
  await fs.writeFile(htmlPath, html);
  console.log("index.html → dev mode (uses original src)");
  process.exit(0);
}

// --- clean old bundles so the dist/ folder doesn't grow forever ---
try {
  for (const f of await fs.readdir(path.join(ROOT, "dist"))) {
    if (f.startsWith("bundle.") && (f.endsWith(".js") || f.endsWith(".css"))) await fs.unlink(path.join(ROOT, "dist", f));
  }
} catch (e) {}

// --- JS bundle ---
let jsSrc = "";
for (const f of SCRIPTS) jsSrc += `/*! ${f} */\n` + await read(f) + "\n;\n";
const jsMin = await minify(jsSrc, {
  compress: { passes: 2, drop_console: false, pure_funcs: [] },
  mangle: { reserved: ["LL"] },        // keep global namespace
  format: { comments: false },
});
if (jsMin.error) { console.error(jsMin.error); process.exit(1); }
const jsHash = hash(jsMin.code);
const jsName = `dist/bundle.${jsHash}.js`;
await write(jsName, jsMin.code);

// --- CSS bundle ---
const cssSrc = await read("css/style.css");
const cssMin = await minifyCss(cssSrc);
const cssHash = hash(cssMin);
const cssName = `dist/bundle.${cssHash}.css`;
await write(cssName, cssMin);

// --- Patch index.html ---
const scriptTag = `  <script src="${jsName}" defer></script>`;
const cssTag = `  <link rel="stylesheet" href="${cssName}" />\n  <link rel="preload" href="${jsName}" as="script" />`;
html = html.replace(new RegExp(`${SCRIPT_START}[\\s\\S]*?${SCRIPT_END}`), `${SCRIPT_START}\n${scriptTag}\n  ${SCRIPT_END}`);
html = html.replace(new RegExp(`${CSS_START}[\\s\\S]*?${CSS_END}`), `${CSS_START}\n${cssTag}\n  ${CSS_END}`);
await fs.writeFile(htmlPath, html);

// --- Report ---
console.log("--- Lahore Legacy build ---");
console.log(`JS:  ${SCRIPTS.length} files → ${jsName}  (${(jsMin.code.length/1024).toFixed(1)} KB, was ${(jsSrc.length/1024).toFixed(1)} KB)`);
console.log(`CSS: 1 file  → ${cssName}  (${(cssMin.length/1024).toFixed(1)} KB, was ${(cssSrc.length/1024).toFixed(1)} KB)`);
console.log(`Requests: 27 → 2`);
console.log("Done. index.html now uses the bundled files.");
console.log("To go back for editing: node tools/build.mjs --dev");
