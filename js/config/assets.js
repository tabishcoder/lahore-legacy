/* =========================================================================
   LAHORE LEGACY — PHOTOS (single place to change any image)
   -------------------------------------------------------------------------
   Per site:
     photo   → YOUR OWN photo (tried first). e.g.
               { src: "assets/images/badshahi.jpg", by: "Shoaib Mushtaq" }
     gallery → Wikimedia Commons files (tried in order; broken ones skipped)
     old     → historic public-domain photos for the "Then & Now" slider.
               If none loads, the slider is simply hidden.
     pano    → YOUR panorama (e.g. iPhone "Pano" photo) for the virtual tour.
               Put the file in assets/panoramas/ and set src. Wide images are
               labelled "Panorama" automatically; normal photos "Photo".
   Credits (author, licence, date) are read live from the Commons API.
   ========================================================================= */

window.LL = window.LL || {};

LL.ASSETS = {
  /* Wikimedia serves a fixed set of thumbnail widths fastest; snap to them. */
  STEPS: [330, 500, 960, 1280, 1920],
  snap(width) { return this.STEPS.find((x) => x >= width) || 1920; },
  /** Direct thumbnail on upload.wikimedia.org (no redirect). */
  commons(file, width = 1280) {
    const name = file.replace(/ /g, "_");
    const h = LL.md5(name);
    const enc = encodeURIComponent(name);
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${this.snap(width)}px-${enc}`;
  },
  /** Fallback via Special:FilePath (also works when the original is smaller than the width). */
  commonsRedirect(file, width = 1280) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, "_"))}?width=${this.snap(width)}`;
  },
  commonsPage(file) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
  },

  locations: {
    "badshahi-mosque": {
      name: "Badshahi Mosque",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Badshahi Mosque (Front View).jpg", caption: "The prayer hall from the main axis", ur: "سامنے سے نماز ہال" },
        { file: "Wide angle view of Badshahi Mosque.jpg", caption: "Across the courtyard", ur: "صحن کے پار سے" },
        { file: "Badshahi Mosque courtyard - 01.jpg", caption: "The great courtyard", ur: "بڑا صحن" },
        { file: "Badshahi Mosque Main Hall.jpg", caption: "Prayer hall facade", ur: "نماز ہال کا سامنے والا حصہ" },
        { file: "Night view of Badshahi Mosque, Lahore.jpg", caption: "At night", ur: "رات کے وقت" },
        { file: "Badshahi Mosque, Lahore in the evening.jpg", caption: "Evening light", ur: "شام کی روشنی میں" },
      ],
      old: [
        { file: "Photograph of Maharaja Ranjit Singh's cremation grounds in Lahore. The Badshahi Mosque is visible in this image.jpg", caption: "Historic photograph", ur: "پرانی تصویر" },
      ],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/badshahi.jpg"
    },
    "lahore-fort": {
      name: "Lahore Fort",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Alamgiri Gate - Lahore Fort.jpg", caption: "Alamgiri Gate (1674)", ur: "عالمگیری دروازہ (1674)" },
        { file: "Front Elevation, Alamgiri Gate, Lahore Fort.jpg", caption: "Alamgiri Gate, front", ur: "عالمگیری دروازہ، سامنے سے" },
        { file: "Sheesh Mahal at Lahore Fort.jpg", caption: "Sheesh Mahal", ur: "شیش محل" },
        { file: "Sheesh Mahal (Lahore Fort) interior.jpg", caption: "Mirror work inside the Sheesh Mahal", ur: "شیش محل کے اندر آئینوں کا کام" },
        { file: "Diwan-e-Aam Lahore Fort.jpg", caption: "Diwan-e-Aam", ur: "دیوانِ عام" },
        { file: "Lahore Fort Pakistan.jpg", caption: "Lahore Fort", ur: "شاہی قلعہ" },
      ],
      old: [
        { file: "The fort lahore bourne 1860.jpg", caption: "Samuel Bourne, c. 1860s", ur: "سیموئل بورن، تقریباً 1860 کی دہائی" },
      ],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/fort.jpg"
    },
    "minar-e-pakistan": {
      name: "Minar-e-Pakistan",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Minar-e-Pakistan - Pic-1.jpg", caption: "Minar-e-Pakistan", ur: "مینارِ پاکستان" },
        { file: "The Minar-e-Pakistan.jpg", caption: "The tower and platform", ur: "مینار اور اس کا چبوترا" },
        { file: "Minar-e-Pakistan 15.jpg", caption: "Detail", ur: "قریب سے" },
        { file: "Aerial view of Minar e Pakistan.jpg", caption: "From above", ur: "اوپر سے" },
      ],
      old: [],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/minar.jpg"
    },
    "iqbal-park": {
      name: "Greater Iqbal Park",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Front View of Minar-e-Pakistan Iqbal Park Lahore.JPG", caption: "Iqbal Park and the Minar", ur: "اقبال پارک اور مینار" },
        { file: "Greater Iqbal park.jpg", caption: "Greater Iqbal Park", ur: "گریٹر اقبال پارک" },
        { file: "Long shot of Badshahi Mosque from adjacent Iqbal Park (Lahore).jpg", caption: "Badshahi Mosque from the park", ur: "پارک سے بادشاہی مسجد" },
        { file: "Badshahi Mosque with Minar e Pakistan in the background. Lahore.jpg", caption: "Mosque and minar in one view", ur: "ایک ہی منظر میں مسجد اور مینار" },
      ],
      old: [],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/park.jpg"
    },
    "wazir-khan-mosque": {
      name: "Wazir Khan Mosque",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Wazir Khan Mosque, Lahore 4 (asad aman).jpg", caption: "Wazir Khan Mosque", ur: "مسجد وزیر خان" },
        { file: "Wazir Khan Mosque 1.jpg", caption: "Tiled facade and minarets", ur: "ٹائلوں والی دیواریں اور مینار" },
        { file: "Wazir khan mosque, tile art1.jpg", caption: "Kashi kari tile work", ur: "کاشی کاری" },
        { file: "Masjid Wazir Khan 28.jpg", caption: "Decorative detail", ur: "سجاوٹ قریب سے" },
        { file: "Wazir Khan Mosque, looking outside.jpg", caption: "Looking out", ur: "مسجد کے اندر سے باہر کا منظر" },
      ],
      old: [],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/wazir.jpg"
    },
    "shalimar-gardens": {
      name: "Shalimar Gardens",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Shalimar Gardens (Lahore).jpg", caption: "Water channel and pavilion", ur: "نہر اور بارہ دری" },
        { file: "Shalimar Gardens (Lahore) 1.jpg", caption: "The terraced garden", ur: "باغ کے حصے" },
        { file: "Shalimar garden lahore.jpg", caption: "Fountains", ur: "فوارے" },
        { file: "Shalamar Gardens, Lahore 16.jpg", caption: "Shalimar Gardens", ur: "شالامار باغ" },
      ],
      old: [
        { file: "Shalimar Gardens Lahore 1895.jpg", caption: "1895", ur: "1895" },
      ],
      pano: { src: "" },      // your panorama, e.g. "assets/panoramas/shalimar.jpg"
    },

    /* ---- more heritage places ---- */
    "delhi-gate": {
      name: "Delhi Gate",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Delhi Gate Lahore Walled City.jpg", caption: "Delhi Gate", ur: "دہلی دروازہ" },
        { file: "Delhi Gate, Lahore.jpg", caption: "Delhi Gate from the street", ur: "گلی سے دہلی دروازہ" },
      ],
      old: [],
      pano: { src: "" },
    },
    "shahi-hammam": {
      name: "Shahi Hammam",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Central dome and fresco painting of Wazir Khan Hammam.jpg", caption: "Frescoes in the central dome", ur: "بیچ والے گنبد کی تصویریں" },
        { file: "@Shahi Hamma Lahore (51).jpg", caption: "Inside the hammam", ur: "حمام کے اندر" },
        { file: "Hypocaust system discovered inside Wazir Khan Hammam.jpg", caption: "The old underfloor heating", ur: "فرش کے نیچے گرم کرنے کا نظام" },
        { file: "Samrup Rachna Art Work at Shahi Hammam Walled City Lahore.jpg", caption: "Painted walls", ur: "رنگین دیواریں" },
      ],
      old: [],
      pano: { src: "" },
    },
    "sunehri-masjid": {
      name: "Sunehri Masjid",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Sunehri Masjid (The Golden Mosque).jpg", caption: "The Golden Mosque", ur: "سنہری مسجد" },
        { file: "Inside the Golden Mosque.jpg", caption: "Inside the prayer hall", ur: "نماز ہال کے اندر" },
      ],
      old: [],
      pano: { src: "" },
    },
    "nau-nihal-haveli": {
      name: "Haveli of Nau Nihal Singh",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Haveli of Nau Nihal Singh 9 (WCLA).jpg", caption: "The painted front", ur: "رنگین سامنے کا حصہ" },
        { file: "Nau Nihal Singh Haveli, Lahore.jpg", caption: "Haveli of Nau Nihal Singh", ur: "حویلی نونہال سنگھ" },
        { file: "Nau Nihal Singh's haveli, now Victoria Girls High School, Lahore.jpg", caption: "Now Victoria Girls' High School", ur: "اب وکٹوریہ گرلز ہائی اسکول" },
        { file: "Haveli of Nau Nihal Singh now known as Victoria Girls High School.jpg", caption: "The haveli today", ur: "حویلی آج" },
      ],
      old: [],
      pano: { src: "" },
    },
    "data-darbar": {
      name: "Data Darbar",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Data Darbar Lahore.jpg", caption: "Data Darbar", ur: "داتا دربار" },
        { file: "Beautiful Scene of Data Darbar Lahore.jpg", caption: "The shrine complex", ur: "مزار کا احاطہ" },
        { file: "Data darbar complex, lahore, pakistan (10).jpg", caption: "Courtyard", ur: "صحن" },
        { file: "Data darbar complex, lahore, pakistan (3).jpg", caption: "The mosque", ur: "مسجد" },
      ],
      old: [],
      pano: { src: "" },
    },
    "hazuri-bagh": {
      name: "Hazuri Bagh",
      photo: { src: "", by: "" },
      gallery: [
        { file: "The Hazuri Bagh - Baradari 01.jpg", caption: "The marble baradari", ur: "سنگِ مرمر کی بارہ دری" },
        { file: "Hazuri Bagh Baradari & Ground.JPG", caption: "Baradari and garden", ur: "بارہ دری اور باغ" },
      ],
      old: [{ file: "Hazuri Bagh Lahore 1847.jpg", caption: "1847", ur: "1847" }],
      pano: { src: "" },
    },
    "iqbal-tomb": {
      name: "Tomb of Allama Iqbal",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Allama Iqbal's Tomb.jpg", caption: "Tomb of Allama Iqbal", ur: "مزارِ اقبال" },
        { file: "Tomb of Allama Iqbal next to Badshahi Mosque main entrance.jpg", caption: "Beside the mosque gate", ur: "مسجد کے دروازے کے ساتھ" },
        { file: "An evening view of Mazar-e-Iqbal.jpg", caption: "In the evening", ur: "شام کے وقت" },
        { file: "AllamaIqbal Tomb Night.jpg", caption: "At night", ur: "رات کو" },
      ],
      old: [],
      pano: { src: "" },
    },
    "ranjit-samadhi": {
      name: "Samadhi of Ranjit Singh",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Samadhi of Ranjit Singh (Lahore).jpg", caption: "Samadhi of Ranjit Singh", ur: "سمادھی رنجیت سنگھ" },
        { file: "The Samadhi of Emperor Ranjit Singh in Lahore, Pakistan..JPG", caption: "The gilded domes", ur: "سنہری گنبد" },
        { file: "Samadhi of Ranjit Singh, Badshahi Mosque, Gurdwara Dera Sabid, located in Iqbal Park, Lahore by Damn Cruze.jpg", caption: "With the mosque and gurdwara", ur: "مسجد اور گوردوارے کے ساتھ" },
        { file: "Gurdwara Dera Sahib - Lahore.jpg", caption: "Gurdwara Dera Sahib next door", ur: "ساتھ والا گوردوارہ ڈیرہ صاحب" },
      ],
      old: [{ file: "Photograph of the Samadhi of Maharaja Ranjit Singh in Lahore, by Francis Frith, circa 1850's–1870's.jpg", caption: "Francis Frith, c. 1850s–70s", ur: "فرانسس فرتھ، تقریباً 1850 تا 1870" }],
      pano: { src: "" },
    },
    "jahangir-tomb": {
      name: "Tomb of Jahangir",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Tomb of Jahangir.JPG", caption: "Tomb of Jahangir", ur: "مقبرہ جہانگیر" },
        { file: "Tomb of Jahangir Lahore Pakistan.jpg", caption: "The four minarets", ur: "چار مینار" },
        { file: "Jahangir's tomb-4.JPG", caption: "Inlaid facade", ur: "جڑاؤ کام والی دیوار" },
        { file: "Tomb of Salim Nuruddin Jahangir Khan Lahore Pakistan.jpg", caption: "The tomb in its garden", ur: "باغ میں مقبرہ" },
        { file: "Inside the tower @ Tomb of Jahangir @ Shahdara (15692938722).jpg", caption: "Inside a minaret", ur: "مینار کے اندر" },
      ],
      old: [],
      pano: { src: "" },
    },
    "asif-khan-tomb": {
      name: "Tomb of Asif Khan",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Tomb of Asif Khan 01.jpg", caption: "Tomb of Asif Khan", ur: "مقبرہ آصف خان" },
        { file: "Asif Khan's Tomb.jpg", caption: "The octagonal tomb", ur: "آٹھ کونوں والا مقبرہ" },
        { file: "Gate to Tomb of Asif Khan @ Tomb of Jahangir @ Shahdara (15508004620).jpg", caption: "The gateway", ur: "داخلی دروازہ" },
      ],
      old: [],
      pano: { src: "" },
    },
    "nur-jahan-tomb": {
      name: "Tomb of Nur Jahan",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Tomb of Noor Jahan at Shahdara.jpg", caption: "Tomb of Nur Jahan", ur: "مقبرہ نور جہاں" },
      ],
      old: [],
      pano: { src: "" },
    },
    "anarkali-tomb": {
      name: "Tomb of Anarkali",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Tomb of Anarkali Civil Secretariat Lahore.jpg", caption: "Tomb of Anarkali", ur: "مقبرہ انارکلی" },
        { file: "Tomb of Anar Kali Lahore.jpg", caption: "The octagonal tomb", ur: "آٹھ کونوں والا مقبرہ" },
        { file: "Anarkali Tomb 2.jpg", caption: "Inside", ur: "اندر سے" },
        { file: "Anarkali tomb sarcophagus, November 2008.jpg", caption: "The marble cenotaph", ur: "سنگِ مرمر کی قبر" },
      ],
      old: [],
      pano: { src: "" },
    },
    "lahore-museum": {
      name: "Lahore Museum",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Lahore Museum, Lahore.jpg", caption: "Lahore Museum", ur: "لاہور عجائب گھر" },
        { file: "Lahore museum.jpg", caption: "The museum on The Mall", ur: "مال روڈ پر عجائب گھر" },
        { file: "Zamzama Gun 8.jpg", caption: "The Zamzama gun", ur: "زمزمہ توپ" },
        { file: "Zamzam gun - panoramio.jpg", caption: "Zamzama in front of the museum", ur: "عجائب گھر کے سامنے زمزمہ" },
      ],
      old: [{ file: "Zam Zammeh 1921.JPG", caption: "Zamzama, 1921", ur: "زمزمہ، 1921" }],
      pano: { src: "" },
    },
    "gcu": {
      name: "Government College University",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Government College University, Lahore - Clock tower and main building.jpg", caption: "Clock tower and main building", ur: "گھنٹہ گھر اور مرکزی عمارت" },
        { file: "Government College University, Lahore - Tower1.jpg", caption: "The clock tower", ur: "گھنٹہ گھر" },
      ],
      old: [],
      pano: { src: "" },
    },
    "quaid-library": {
      name: "Quaid-e-Azam Library",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Quaid-e-Azam Library in Jinnah Garden.jpg", caption: "In Bagh-e-Jinnah", ur: "باغِ جناح میں" },
        { file: "QUAID E AZAM LIBRARY LAHORE.jpg", caption: "Quaid-e-Azam Library", ur: "قائداعظم لائبریری" },
        { file: "Quaid e azam library Lahore by saad muzaffar.jpg", caption: "The front", ur: "سامنے سے" },
      ],
      old: [],
      pano: { src: "" },
    },
    "railway-station": {
      name: "Lahore Railway Station",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Lahore Junction railway station 1.jpg", caption: "Lahore Railway Station", ur: "لاہور ریلوے اسٹیشن" },
        { file: "Lahore Railway Station 01.jpg", caption: "The fort-like front", ur: "قلعے جیسا سامنے کا حصہ" },
        { file: "Lahore-railway-station.jpg", caption: "Towers and turrets", ur: "برج" },
        { file: "Lahore Railway Station Lahore.jpg", caption: "The station today", ur: "اسٹیشن آج" },
      ],
      old: [],
      pano: { src: "" },
    },
    "gulabi-bagh": {
      name: "Gulabi Bagh Gateway",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Gulabi Bagh (view from the Front).JPG", caption: "Gulabi Bagh Gateway", ur: "گلابی باغ دروازہ" },
        { file: "Behind view of the Gulabi Bagh (Dai Anga's Tomb).JPG", caption: "Dai Anga's tomb behind the gate", ur: "دروازے کے پیچھے دائی انگہ کا مقبرہ" },
      ],
      old: [],
      pano: { src: "" },
    },
    "chauburji": {
      name: "Chauburji",
      photo: { src: "", by: "" },
      gallery: [
        { file: "Chauburji-Lahore.jpg", caption: "Chauburji", ur: "چوبرجی" },
        { file: "Front Elevation, Chauburji, Lahore.jpg", caption: "The front", ur: "سامنے سے" },
        { file: "Arch view of the Chauburji, Lahore.JPG", caption: "The tiled arch", ur: "ٹائلوں والی محراب" },
        { file: "Chauburji in its Final Phase of Restoration 4 - 2019.jpg", caption: "During restoration, 2019", ur: "مرمت کے دوران، 2019" },
      ],
      old: [{ file: "Chauburji from British Library.jpg", caption: "Historic view", ur: "پرانی تصویر" }],
      pano: { src: "" },
    },
  },

  /* Walled City photos (walk page + homepage). */
  extras: {
    /* the home slideshow (day) and after sunset in Lahore (night) */
    "day": {
      name: "Lahore",
      gallery: [
        { file: "Badshahi Mosque (Front View).jpg", caption: "Badshahi Mosque", ur: "بادشاہی مسجد" },
        { file: "Alamgiri Gate - Lahore Fort.jpg", caption: "Lahore Fort, Alamgiri Gate", ur: "شاہی قلعہ، عالمگیری دروازہ" },
        { file: "Wazir Khan Mosque 1.jpg", caption: "Wazir Khan Mosque", ur: "مسجد وزیر خان" },
        { file: "Shalimar Gardens (Lahore).jpg", caption: "Shalimar Gardens", ur: "شالامار باغ" },
        { file: "Tomb of Jahangir.JPG", caption: "Tomb of Jahangir", ur: "مقبرہ جہانگیر" },
        { file: "Minar-e-Pakistan - Pic-1.jpg", caption: "Minar-e-Pakistan", ur: "مینارِ پاکستان" },
      ],
    },
    "night": {
      name: "Lahore at night",
      gallery: [
        { file: "A Very Beautiful Night View of Badshahi Masjid, Lahore.jpg", caption: "Badshahi Mosque at night", ur: "رات کو بادشاہی مسجد" },
        { file: "Night View of Badshahi Mosque from Lahore Fort Food Street.jpg", caption: "From Food Street at night", ur: "رات کو فوڈ اسٹریٹ سے" },
        { file: "Badshahi mosque lahore Night view.jpg", caption: "Badshahi Mosque at night", ur: "رات کو بادشاہی مسجد" },
        { file: "AllamaIqbal Tomb Night.jpg", caption: "Tomb of Allama Iqbal at night", ur: "رات کو مزارِ اقبال" },
        { file: "Night View of Lahore Fort Food Street.JPG", caption: "Fort Road Food Street", ur: "فورٹ روڈ فوڈ اسٹریٹ" },
      ],
    },
    "food": {
      name: "Fort Road Food Street",
      gallery: [
        { file: "Night View of Badshahi Mosque from Lahore Fort Food Street.jpg", caption: "The mosque from Food Street at night", ur: "رات کو فوڈ اسٹریٹ سے مسجد" },
        { file: "Badshahi Mosque from New Food Street, Fort Road, Lahore.jpg", caption: "Badshahi Mosque from Food Street", ur: "فوڈ اسٹریٹ سے بادشاہی مسجد" },
        { file: "Night View of Lahore Fort Food Street.JPG", caption: "Food Street at night", ur: "رات کو فوڈ اسٹریٹ" },
      ],
    },
    "walled-city": {
      name: "Walled City of Lahore",
      gallery: [
        { file: "Delhi Gate Lahore Walled City.jpg", caption: "Delhi Gate", ur: "دہلی دروازہ" },
        { file: "Delhi Gate, Lahore.jpg", caption: "Delhi Gate", ur: "دہلی دروازہ" },
        { file: "Walled city lahore and its colors.jpg", caption: "Inside the Walled City", ur: "اندرونِ شہر" },
      ],
    },
  },
};
