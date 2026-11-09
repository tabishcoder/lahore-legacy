/* =========================================================================
   LAHORE LEGACY — DOWNLOAD + COMPRESS BACKGROUND VIDEOS (optional)
   Downloads the Pexels clips listed in js/config/videos.js, trims each to
   10 seconds, makes a silent 720p MP4 (~1–3 MB) in assets/videos/, and
   sets `local` for each clip so the site serves them itself.

     cd lahore-legacy
     node tools/fetch-videos.mjs        (needs Node 18+ and ffmpeg)
   ========================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "assets/videos");
const CONF = path.join(ROOT, "js/config/videos.js");
const ctx = { window: {} };
ctx.LL = ctx.window.LL = {};
vm.createContext(ctx);
let code = await fs.readFile(CONF, "utf8");
vm.runInContext(code, ctx);
const clips = ctx.LL.VIDEOS.clips;
await fs.mkdir(OUT, { recursive: true });

for (const [key, c] of Object.entries(clips)) {
  const raw = path.join(OUT, key + ".src.mp4"), out = path.join(OUT, key + ".mp4");
  try {
    const res = await fetch(c.src);
    if (!res.ok) throw new Error("HTTP " + res.status);
    await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
    const scale = c.tall ? "scale=720:-2" : "scale=-2:720";
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(c.from || 0), "-t", "10", "-i", raw, "-an", "-vf", `${scale},fps=30`, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);
    await fs.rm(raw);
    const kb = Math.round((await fs.stat(out)).size / 1024);
    // point the clip at the local file and start it at 0 (already trimmed)
    code = code.replace(new RegExp(`("${key}": \\{)`), `$1 local: "assets/videos/${key}.mp4", localFrom: 0,`);
    console.log("✓", key, kb + " KB");
  } catch (e) {
    console.warn("✗", key, e.message);
  }
}
await fs.writeFile(CONF, code);
console.log("Done. js/config/videos.js now uses the local files.");
