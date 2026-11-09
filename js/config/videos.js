/* =========================================================================
   LAHORE LEGACY — BACKGROUND VIDEOS
   Real footage of Lahore from Pexels (free to use under the Pexels
   licence; we credit every creator anyway). Each clip:
     src    verified file on videos.pexels.com
     id     Pexels video id (used to try lighter 720p / 540p files first)
     fps    frame rate in the file name
     tall   true for vertical (9:16) clips — used on phones
     from   seconds into the clip to start the loop
   To use your own iPhone clips: put an MP4 in assets/videos/ and set
     local: "assets/videos/badshahi.mp4"   (tools/fetch-videos.mjs can
   download and compress all clips below for you).
   Videos never play on slow connections, with Data Saver on, or when the
   phone asks for reduced motion — a real photo is shown instead.
   ========================================================================= */

window.LL = window.LL || {};

LL.VIDEOS = {
  clips: {
    "badshahi-aerial": { site: "badshahi-mosque", label: "Badshahi Mosque from the air", by: "Shahbaz Ali", page: "https://www.pexels.com/video/drone-footage-of-lahore-9004010/", src: "https://videos.pexels.com/video-files/9004010/9004010-hd_1920_1080_25fps.mp4", id: 9004010, fps: 25, from: 2 },
    "badshahi-pan": { site: "badshahi-mosque", label: "Badshahi Mosque", by: "Shahbaz Ali", page: "https://www.pexels.com/video/panning-shot-of-a-mosque-9003971/", src: "https://videos.pexels.com/video-files/9003971/9003971-hd_1920_1080_25fps.mp4", id: 9003971, fps: 25, from: 0 },
    "badshahi-drone": { site: "badshahi-mosque", label: "Badshahi Mosque", by: "Ayesha Khan", page: "https://www.pexels.com/video/drone-footage-of-the-badshahi-mosque-4417581/", src: "https://videos.pexels.com/video-files/4417581/4417581-hd_1920_1080_30fps.mp4", id: 4417581, fps: 30, from: 0 },
    "badshahi-tall": { site: "badshahi-mosque", label: "Badshahi Mosque", by: "Altaf Shah", page: "https://www.pexels.com/video/drone-footage-of-palace-12080201/", src: "https://videos.pexels.com/video-files/12080201/12080201-hd_1080_1920_60fps.mp4", id: 12080201, fps: 60, tall: true, from: 4 },
    "fort-courtyard": { site: "lahore-fort", label: "Lahore Fort courtyard", by: "Ali Jafar", page: "https://www.pexels.com/video/vibrant-scene-at-historic-lahore-fort-courtyard-36965856/", src: "https://videos.pexels.com/video-files/36965856/15661012_1080_1920_60fps.mp4", tall: true, from: 0 },
    "delhi-gate": { site: "delhi-gate", label: "Delhi Gate bazaar", by: "Ayesha Khan", page: "https://www.pexels.com/video/walking-through-an-old-market-place-4404589/", src: "https://videos.pexels.com/video-files/4404589/4404589-hd_1920_1080_30fps.mp4", id: 4404589, fps: 30, from: 1 },
    "minar-aerial": { site: "minar-e-pakistan", label: "Minar-e-Pakistan from the air", by: "Ayesha Khan", page: "https://www.pexels.com/video/drone-footage-of-the-minar-e-pakistan-4417681/", src: "https://videos.pexels.com/video-files/4417681/4417681-hd_1920_1080_30fps.mp4", id: 4417681, fps: 30, from: 0 },
    "minar-tall": { site: "minar-e-pakistan", label: "Minar-e-Pakistan", by: "Altaf Shah", page: "https://www.pexels.com/video/monument-in-park-with-pond-12152849/", src: "https://videos.pexels.com/video-files/12152849/12152849-hd_1080_1920_60fps.mp4", id: 12152849, fps: 60, tall: true, from: 2 },
  },
  /* the home page plays these in turn (wide screens / phones) */
  home: { wide: ["badshahi-aerial", "delhi-gate", "minar-aerial", "badshahi-pan"], tall: ["badshahi-tall", "fort-courtyard", "minar-tall", "badshahi-aerial"] },
  /* place pages with a background video */
  sites: {
    "badshahi-mosque": { wide: "badshahi-drone", tall: "badshahi-tall" },
    "lahore-fort": { wide: "fort-courtyard", tall: "fort-courtyard" },
    "delhi-gate": { wide: "delhi-gate", tall: "delhi-gate" },
    "minar-e-pakistan": { wide: "minar-aerial", tall: "minar-tall" },
    "iqbal-park": { wide: "minar-aerial", tall: "minar-tall" },
  },
  clipSeconds: 7,
};
