/* =========================================================================
   LAHORE LEGACY — CENTRAL ASSET CONFIGURATION
   -------------------------------------------------------------------------
   Every photograph and panorama used on the site is declared HERE, once.

   PHOTOGRAPHS — WIKIMEDIA COMMONS
   Each location has a `gallery` of real photographs hosted on Wikimedia
   Commons (all Commons files are freely licensed). Images are loaded from
   Commons' official Special:FilePath endpoint at the width the layout needs.
   Photographer + licence are fetched LIVE from the Commons API in the
   visitor's browser (js/commons.js), so credits always match the file page.

   RESOLUTION ORDER (per image slot)
     1. photo.src           → your own local photograph, if you set one
     2. gallery[0..n]       → Commons photos, tried in order; any file that
                              fails to load or is too small is skipped
     3. illustration        → clearly-labelled placeholder artwork

   PANORAMA TYPES  (be honest — never label a flat photo as 360°)
     "equirect"     → full 360°×180° spherical image (2:1). Viewed with Marzipano.
     "partial"      → wide horizontal panorama (set `fov`). Drag-to-pan only.
     "photo"        → ordinary photographs (pan + zoom, labelled "not 360°").
     "illustration" → built-in SVG scene.
   `tour360` links to an EXTERNAL real 360° capture (opens in a new tab).
   ========================================================================= */

window.LL = window.LL || {};

LL.ASSETS = {
  /* Build a Commons image URL at a given width. */
  commons(file, width = 1600) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, "_"))}?width=${width}`;
  },
  commonsPage(file) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
  },

  locations: {
    "badshahi-mosque": {
      name: "Badshahi Mosque",
      photo: { src: "", alt: "" }, // optional local override, e.g. "assets/images/badshahi-mosque.jpg"
      gallery: [
        { file: "Badshahi Mosque (Front View).jpg", caption: "The prayer hall and courtyard from the main axis" },
        { file: "Wide angle view of Badshahi Mosque.jpg", caption: "Wide view across the courtyard" },
        { file: "Badshahi Mosque courtyard - 01.jpg", caption: "The great courtyard" },
        { file: "Badshahi Mosque Main Hall.jpg", caption: "Prayer hall facade" },
        { file: "Night view of Badshahi Mosque, Lahore.jpg", caption: "The mosque illuminated at night" },
        { file: "Badshahi Mosque, Lahore in the evening.jpg", caption: "Evening light on red sandstone" },
      ],
      illustration: "badshahi",
      panorama: { type: "photo", tour360: "https://www.360cities.net/image/badshahi-mosque", tour360Label: "Badshahi Mosque — 360Cities" },
    },
    "lahore-fort": {
      name: "Lahore Fort (Shahi Qila)",
      photo: { src: "", alt: "" },
      gallery: [
        { file: "Alamgiri Gate - Lahore Fort.jpg", caption: "The Alamgiri Gate, built under Aurangzeb in 1674" },
        { file: "Front Elevation, Alamgiri Gate, Lahore Fort.jpg", caption: "Front elevation of the Alamgiri Gate" },
        { file: "Sheesh Mahal at Lahore Fort.jpg", caption: "The Sheesh Mahal (Palace of Mirrors)" },
        { file: "Sheesh Mahal (Lahore Fort) interior.jpg", caption: "Mirror mosaic inside the Sheesh Mahal" },
        { file: "Diwan-e-Aam Lahore Fort.jpg", caption: "The Diwan-e-Aam, hall of public audience" },
      ],
      illustration: "fort",
      panorama: { type: "photo", tour360: "https://www.360cities.net/image/sheesh-mahal-palace-of-mirrors-lahore-fort", tour360Label: "Sheesh Mahal — 360Cities" },
    },
    "minar-e-pakistan": {
      name: "Minar-e-Pakistan",
      photo: { src: "", alt: "" },
      gallery: [
        { file: "Minar-e-Pakistan - Pic-1.jpg", caption: "Minar-e-Pakistan" },
        { file: "The Minar-e-Pakistan.jpg", caption: "The tower and its platform" },
        { file: "Minar-e-Pakistan 15.jpg", caption: "Detail of the minar" },
        { file: "Aerial view of Minar e Pakistan.jpg", caption: "Aerial view of the minar in Greater Iqbal Park" },
      ],
      illustration: "minar",
      panorama: { type: "photo", tour360: "https://review.360cities.net/image/minar-e-pakistan-urdu-lahore-pakistan", tour360Label: "Minar-e-Pakistan — 360Cities" },
    },
    "iqbal-park": {
      name: "Greater Iqbal Park",
      photo: { src: "", alt: "" },
      gallery: [
        { file: "Front View of Minar-e-Pakistan Iqbal Park Lahore.JPG", caption: "Iqbal Park with Minar-e-Pakistan" },
        { file: "Greater Iqbal park.jpg", caption: "Greater Iqbal Park" },
        { file: "Long shot of Badshahi Mosque from adjacent Iqbal Park (Lahore).jpg", caption: "The Badshahi Mosque seen from the park" },
        { file: "Badshahi Mosque with Minar e Pakistan in the background. Lahore.jpg", caption: "Mosque and minar — neighbours across the park" },
      ],
      illustration: "park",
      panorama: { type: "photo" },
    },
    "wazir-khan-mosque": {
      name: "Wazir Khan Mosque",
      photo: { src: "", alt: "" },
      gallery: [
        { file: "Wazir Khan Mosque, Lahore 4 (asad aman).jpg", caption: "The Wazir Khan Mosque" },
        { file: "Wazir Khan Mosque 1.jpg", caption: "Tiled facade and minarets" },
        { file: "Wazir khan mosque, tile art1.jpg", caption: "Kashi kari — glazed tile mosaic" },
        { file: "Masjid Wazir Khan 28.jpg", caption: "Decorative detail" },
        { file: "Wazir Khan Mosque, looking outside.jpg", caption: "Looking out from the mosque" },
      ],
      illustration: "wazir",
      panorama: { type: "photo" },
    },
    "shalimar-gardens": {
      name: "Shalimar Gardens",
      photo: { src: "", alt: "" },
      gallery: [
        { file: "Shalimar Gardens (Lahore).jpg", caption: "Water channel and pavilion" },
        { file: "Shalimar Gardens (Lahore) 1.jpg", caption: "The terraced garden" },
        { file: "Shalimar garden lahore.jpg", caption: "Fountains of the Shalimar Gardens" },
        { file: "Moorcroft Pavilion, Shalimar Gardens, Lahore.jpg", caption: "A pavilion in the gardens" },
      ],
      illustration: "shalimar",
      panorama: { type: "photo" },
    },
  },

  /* Walled City, Delhi Gate and street scenes — used on the homepage and in games. */
  extras: {
    "walled-city": {
      name: "Walled City of Lahore",
      gallery: [
        { file: "Delhi Gate Lahore Walled City.jpg", caption: "Delhi Gate, Walled City of Lahore" },
        { file: "Delhi Gate, Lahore.jpg", caption: "Delhi Gate" },
        { file: "Walled city lahore and its colors.jpg", caption: "Colours of the Walled City" },
        { file: "Haveli Dina Nath (WCLA).jpg", caption: "Haveli Dina Nath, Walled City" },
        { file: "Lal Haveli 6 (WCLA).jpg", caption: "Lal Haveli, Walled City" },
      ],
      illustration: "wazir",
    },
  },

  /* Optional third-party library for true 360° images (loaded only when needed). */
  marzipanoCDN: "https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.js",
};
