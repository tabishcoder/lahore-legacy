/* =========================================================================
   LAHORE LEGACY — HISTORICAL CONTENT
   -------------------------------------------------------------------------
   REAL HISTORY ONLY in this file. Dates and claims use widely documented
   figures (UNESCO, Pakistan Department of Archaeology, Walled City of Lahore
   Authority, standard histories). Where sources differ, wording says "about"
   or gives a range. Fictional game stories live in js/games/* and are
   always labelled "Fictional story" in the interface.
   ========================================================================= */

window.LL = window.LL || {};

LL.LOCATIONS = [
  {
    id: "badshahi-mosque",
    name: "Badshahi Mosque",
    urdu: "بادشاہی مسجد",
    era: "Mughal · 1671–1673",
    tagline: "The Emperor's Mosque",
    area: "Walled City, opposite the Lahore Fort",
    coords: "31.5879° N, 74.3098° E",
    overview:
      "Commissioned by the Mughal emperor Aurangzeb (Alamgir) and completed in 1673, the Badshahi Mosque faces the Lahore Fort across the Hazuri Bagh. Built of red sandstone with white marble domes and inlay, it was the largest mosque in the world when it was completed — a distinction it held for more than three centuries.",
    facts: [
      "Construction ran from 1671 to 1673 under the supervision of Fidai Khan Koka, Aurangzeb's foster brother and governor of Lahore.",
      "Its courtyard can hold around 100,000 worshippers.",
      "It remained the world's largest mosque until the Faisal Mosque in Islamabad was completed in 1986.",
      "During Sikh rule the mosque was used as a military garrison; major restoration followed in the 20th century, notably from 1939 to 1960.",
      "Each of its four corner minarets rises roughly 54 metres (about 176 ft).",
      "The tomb of the poet-philosopher Allama Muhammad Iqbal stands beside the steps leading to the mosque.",
    ],
    hotspots: [
      { x: 50, y: 40, title: "Central Prayer Hall", text: "Three marble domes crown the prayer hall; the central dome is the largest." },
      { x: 14, y: 30, title: "Corner Minaret", text: "Four octagonal minarets stand at the corners of the courtyard, each about 54 m tall." },
      { x: 50, y: 78, title: "The Courtyard", text: "The vast courtyard is paved for congregational prayer and can hold around 100,000 people." },
      { x: 86, y: 30, title: "Red Sandstone", text: "The walls are clad in red sandstone, set off by white marble inlay and domes." },
    ],
    games: ["history-rush", "heritage-detective"],
    stampColor: "#B5543A",
  },
  {
    id: "lahore-fort",
    name: "Lahore Fort (Shahi Qila)",
    urdu: "شاہی قلعہ",
    era: "Mughal · rebuilt from 1566",
    tagline: "Citadel of Emperors",
    area: "Northern edge of the Walled City",
    coords: "31.5880° N, 74.3150° E",
    overview:
      "A citadel has stood on this site for centuries, but the fort we see today was largely rebuilt in brick by Emperor Akbar from 1566 and expanded by Jahangir, Shah Jahan and Aurangzeb. Its palaces, halls and gardens trace the full arc of Mughal architecture. Together with the Shalimar Gardens it was inscribed as a UNESCO World Heritage Site in 1981.",
    facts: [
      "Emperor Akbar began rebuilding the fort in brick in 1566.",
      "The Sheesh Mahal (Palace of Mirrors), built under Shah Jahan in 1631–32, is decorated with thousands of small mirror pieces set in white marble.",
      "The monumental Alamgiri Gate was built under Aurangzeb in 1674 and faces the Badshahi Mosque.",
      "The Picture Wall is covered in glazed tile mosaics and frescoes from the reigns of Jahangir and Shah Jahan.",
      "The marble Naulakha Pavilion is popularly said to be named for its cost — nine lakh rupees.",
      "UNESCO inscribed the fort and the Shalimar Gardens together as a World Heritage Site in 1981.",
    ],
    hotspots: [
      { x: 50, y: 52, title: "Alamgiri Gate", text: "Built under Aurangzeb in 1674, flanked by semi-octagonal towers." },
      { x: 20, y: 45, title: "Fortification Walls", text: "Massive brick ramparts enclose palaces, halls and gardens." },
      { x: 80, y: 32, title: "Sheesh Mahal", text: "The Palace of Mirrors, built under Shah Jahan, glitters with mirror mosaic work." },
      { x: 50, y: 18, title: "Pavilions", text: "Domed chhatris and pavilions crown the walls and inner palaces." },
    ],
    games: ["mystery-chamber", "rebuild-lahore"],
    stampColor: "#8E4B2E",
  },
  {
    id: "minar-e-pakistan",
    name: "Minar-e-Pakistan",
    urdu: "مینارِ پاکستان",
    era: "Modern · 1960–1968",
    tagline: "Tower of Resolution",
    area: "Greater Iqbal Park",
    coords: "31.5925° N, 74.3095° E",
    overview:
      "Minar-e-Pakistan marks the place where the All-India Muslim League presented the Lahore Resolution on 23 March 1940 — the resolution that called for independent states for the Muslims of the subcontinent. Designed by Nasreddin Murat-Khan, the tower was built between 1960 and 1968 and blends Mughal, Islamic and modern forms.",
    facts: [
      "The Lahore Resolution was presented at this site on 23 March 1940; 23 March is now observed as Pakistan Day.",
      "The tower was designed by the architect and engineer Nasreddin Murat-Khan.",
      "Construction began in 1960 and was completed in 1968.",
      "The minar rises to about 62 metres.",
      "Plaques around its base carry texts including the Lahore Resolution and Pakistan's national anthem.",
      "Its base is raised on a star-shaped, flower-like platform.",
    ],
    hotspots: [
      { x: 50, y: 20, title: "The Dome Crown", text: "A small dome and finial crown the tapering tower, about 62 m above the ground." },
      { x: 50, y: 58, title: "Tower Shaft", text: "The shaft narrows as it rises, combining modern engineering with Islamic forms." },
      { x: 50, y: 84, title: "Star-shaped Platform", text: "The base platforms open out like petals; plaques carry historic texts." },
    ],
    games: ["history-rush", "heritage-quest"],
    stampColor: "#2F7D6B",
  },
  {
    id: "iqbal-park",
    name: "Greater Iqbal Park",
    urdu: "گریٹر اقبال پارک",
    era: "Modern · British-era park, redeveloped 2010s",
    tagline: "Where a Nation Was Imagined",
    area: "Between the Walled City and Circular Road",
    coords: "31.5925° N, 74.3095° E",
    overview:
      "Known in the British era as Minto Park, this open ground hosted the 1940 session of the All-India Muslim League. It was later renamed Iqbal Park in honour of Allama Muhammad Iqbal and, in the 2010s, was expanded and redeveloped as Greater Iqbal Park, with Minar-e-Pakistan at its heart.",
    facts: [
      "During British rule the park was called Minto Park.",
      "It was the venue of the All-India Muslim League session of March 1940.",
      "It was renamed Iqbal Park after the poet-philosopher Allama Muhammad Iqbal.",
      "It was expanded and redeveloped as Greater Iqbal Park in the 2010s.",
      "The park lies within walking distance of the Badshahi Mosque and the Lahore Fort.",
    ],
    hotspots: [
      { x: 50, y: 30, title: "Minar-e-Pakistan", text: "The national monument stands at the centre of the park." },
      { x: 20, y: 68, title: "Gardens & Lawns", text: "Wide lawns and tree-lined walkways make it one of Lahore's busiest public spaces." },
      { x: 78, y: 70, title: "Fountains", text: "Water features are part of the redeveloped Greater Iqbal Park." },
    ],
    games: ["heritage-quest", "lost-lahore"],
    stampColor: "#4C8A3A",
  },
  {
    id: "wazir-khan-mosque",
    name: "Wazir Khan Mosque",
    urdu: "مسجد وزیر خان",
    era: "Mughal · c. 1634–1641",
    tagline: "A Mosque Painted in Tiles",
    area: "Walled City, near Delhi Gate",
    coords: "31.5830° N, 74.3234° E",
    overview:
      "Built during the reign of Shah Jahan and completed around 1641, the Wazir Khan Mosque was commissioned by Hakim Ilm-ud-din Ansari, the royal physician who became governor of Lahore and was known as Wazir Khan. It is celebrated as one of the most richly decorated Mughal mosques, famed for its kashi kari (glazed tile) work and frescoes.",
    facts: [
      "It was commissioned by Hakim Ilm-ud-din Ansari, known as Wazir Khan, governor of Lahore under Shah Jahan.",
      "Construction began around 1634 and was completed around 1641.",
      "Its walls are covered in kashi kari — intricate glazed, coloured tile mosaic.",
      "The interior is decorated with fresco paintings in floral and geometric patterns.",
      "Shops built into the complex were intended to help fund its upkeep.",
      "It has been conserved in recent years by the Aga Khan Trust for Culture with the Walled City of Lahore Authority.",
    ],
    hotspots: [
      { x: 50, y: 34, title: "Prayer Hall Dome", text: "The domed prayer hall is richly painted with frescoes inside." },
      { x: 13, y: 30, title: "Tiled Minaret", text: "Octagonal minarets are wrapped in bands of colourful kashi kari tiles." },
      { x: 50, y: 66, title: "Kashi Kari Panels", text: "Glazed tile mosaics in cobalt, turquoise, yellow and green cover the facade." },
    ],
    games: ["heritage-detective", "lost-lahore"],
    stampColor: "#2B6CA3",
  },
  {
    id: "shalimar-gardens",
    name: "Shalimar Gardens",
    urdu: "شالامار باغ",
    era: "Mughal · 1641–1642",
    tagline: "Garden of Paradise",
    area: "Baghbanpura, east of the Walled City",
    coords: "31.5860° N, 74.3820° E",
    overview:
      "Laid out for Emperor Shah Jahan in 1641–1642, the Shalimar Gardens follow the Persian charbagh tradition, with three descending terraces, long water channels, cascades and pavilions. Water was brought by canal to feed hundreds of fountains. The gardens were inscribed with the Lahore Fort as a UNESCO World Heritage Site in 1981.",
    facts: [
      "The gardens were built for Shah Jahan between 1641 and 1642.",
      "They are laid out as three terraces descending in levels.",
      "The terraces are traditionally named Farah Bakhsh, Faiz Bakhsh and Hayat Bakhsh.",
      "The gardens are commonly described as having 410 fountains.",
      "They follow the charbagh plan — a garden divided into four parts by walkways and water channels.",
      "UNESCO inscribed them together with the Lahore Fort in 1981.",
    ],
    hotspots: [
      { x: 50, y: 36, title: "Pavilion", text: "Marble pavilions overlook the water tanks and cascades." },
      { x: 25, y: 70, title: "Fountains", text: "Rows of fountains line the channels — 410 is the figure most often cited." },
      { x: 76, y: 60, title: "Terraces", text: "Three terraces step down the site, linked by cascades of water." },
    ],
    games: ["rebuild-lahore", "heritage-quest"],
    stampColor: "#3E8E6E",
  },
];

/* Trivia question bank — used by History Rush, the Daily Challenge and others.
   difficulty: 1 easy · 2 medium · 3 hard                                       */
LL.TRIVIA = [
  { d: 1, loc: "badshahi-mosque", q: "Which Mughal emperor commissioned the Badshahi Mosque?", a: ["Aurangzeb", "Akbar", "Babur", "Humayun"], c: 0 },
  { d: 1, loc: "minar-e-pakistan", q: "Minar-e-Pakistan commemorates which historic event?", a: ["The Lahore Resolution of 1940", "The founding of Lahore", "The opening of the Grand Trunk Road", "The 1947 Partition Boundary Award"], c: 0 },
  { d: 1, loc: "shalimar-gardens", q: "How many terraces do the Shalimar Gardens have?", a: ["Three", "Two", "Five", "Seven"], c: 0 },
  { d: 1, loc: "wazir-khan-mosque", q: "The Wazir Khan Mosque is especially famous for its…", a: ["Glazed tile work (kashi kari)", "Wooden domes", "Glass skyscraper facade", "Stone bridges"], c: 0 },
  { d: 1, loc: "lahore-fort", q: "What is the Lahore Fort also known as?", a: ["Shahi Qila", "Lal Qila", "Rohtas Qila", "Derawar Qila"], c: 0 },
  { d: 1, loc: "iqbal-park", q: "Greater Iqbal Park is named after which poet-philosopher?", a: ["Allama Muhammad Iqbal", "Faiz Ahmed Faiz", "Mirza Ghalib", "Bulleh Shah"], c: 0 },
  { d: 1, loc: "badshahi-mosque", q: "What is the main building material of the Badshahi Mosque?", a: ["Red sandstone", "Blue limestone", "Timber", "Concrete"], c: 0 },
  { d: 1, loc: "lahore-fort", q: "The Sheesh Mahal in the Lahore Fort is decorated mainly with…", a: ["Mirror mosaic", "Gold leaf ceilings", "Painted wood", "Stained glass windows"], c: 0 },
  { d: 2, loc: "badshahi-mosque", q: "In which year was the Badshahi Mosque completed?", a: ["1673", "1566", "1641", "1739"], c: 0 },
  { d: 2, loc: "minar-e-pakistan", q: "On what date was the Lahore Resolution presented?", a: ["23 March 1940", "14 August 1947", "25 December 1940", "11 September 1948"], c: 0 },
  { d: 2, loc: "lahore-fort", q: "Which emperor began rebuilding the Lahore Fort in brick in 1566?", a: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"], c: 0 },
  { d: 2, loc: "shalimar-gardens", q: "Which emperor built the Shalimar Gardens of Lahore?", a: ["Shah Jahan", "Akbar", "Aurangzeb", "Jahangir"], c: 0 },
  { d: 2, loc: "iqbal-park", q: "What was Greater Iqbal Park called during the British era?", a: ["Minto Park", "Lawrence Garden", "Victoria Park", "Company Bagh"], c: 0 },
  { d: 2, loc: "lahore-fort", q: "In which year were the Lahore Fort and Shalimar Gardens inscribed by UNESCO?", a: ["1981", "1947", "2001", "1965"], c: 0 },
  { d: 2, loc: "wazir-khan-mosque", q: "Who was 'Wazir Khan', the patron of the Wazir Khan Mosque?", a: ["Hakim Ilm-ud-din Ansari, governor of Lahore", "A Sikh general", "A British engineer", "A Mughal princess"], c: 0 },
  { d: 2, loc: "badshahi-mosque", q: "Whose tomb stands beside the steps of the Badshahi Mosque?", a: ["Allama Muhammad Iqbal", "Emperor Jahangir", "Data Ganj Bakhsh", "Ranjit Singh"], c: 0 },
  { d: 2, loc: "lahore-fort", q: "Which gate of the Lahore Fort faces the Badshahi Mosque?", a: ["Alamgiri Gate", "Bhati Gate", "Delhi Gate", "Lohari Gate"], c: 0 },
  { d: 2, loc: "wazir-khan-mosque", q: "The Wazir Khan Mosque stands near which gate of the Walled City?", a: ["Delhi Gate", "Taxali Gate", "Kashmiri Gate", "Mori Gate"], c: 0 },
  { d: 3, loc: "minar-e-pakistan", q: "Who designed Minar-e-Pakistan?", a: ["Nasreddin Murat-Khan", "Vedat Dalokay", "Ustad Ahmad Lahori", "Muzharul Islam"], c: 0 },
  { d: 3, loc: "minar-e-pakistan", q: "Minar-e-Pakistan was built between…", a: ["1960 and 1968", "1940 and 1947", "1950 and 1953", "1971 and 1979"], c: 0 },
  { d: 3, loc: "badshahi-mosque", q: "Until which year did the Badshahi Mosque remain the world's largest mosque?", a: ["1986", "1947", "1700", "2000"], c: 0 },
  { d: 3, loc: "shalimar-gardens", q: "Which is the traditional name of a Shalimar Gardens terrace?", a: ["Farah Bakhsh", "Diwan-e-Khas", "Hazuri Bagh", "Naulakha"], c: 0 },
  { d: 3, loc: "shalimar-gardens", q: "How many fountains are the Shalimar Gardens commonly said to have?", a: ["410", "99", "1,000", "52"], c: 0 },
  { d: 3, loc: "lahore-fort", q: "The Alamgiri Gate was built in which year?", a: ["1674", "1566", "1631", "1846"], c: 0 },
  { d: 3, loc: "lahore-fort", q: "The Sheesh Mahal was built under which emperor?", a: ["Shah Jahan", "Akbar", "Babur", "Bahadur Shah Zafar"], c: 0 },
  { d: 3, loc: "badshahi-mosque", q: "Who supervised construction of the Badshahi Mosque?", a: ["Fidai Khan Koka", "Asif Khan", "Ali Mardan Khan", "Wazir Khan"], c: 0 },
  { d: 3, loc: "wazir-khan-mosque", q: "Around which year was the Wazir Khan Mosque completed?", a: ["1641", "1566", "1673", "1712"], c: 0 },
  { d: 3, loc: "minar-e-pakistan", q: "Approximately how tall is Minar-e-Pakistan?", a: ["About 62 m", "About 20 m", "About 150 m", "About 300 m"], c: 0 },
];

LL.LEVELS = [
  { name: "Explorer", xp: 0 },
  { name: "Apprentice", xp: 150 },
  { name: "Heritage Seeker", xp: 400 },
  { name: "Detective", xp: 800 },
  { name: "Guardian", xp: 1400 },
  { name: "Lahore Legend", xp: 2200 },
];

LL.ACHIEVEMENTS = [
  { id: "first-discovery", name: "First Discovery", icon: "compass", desc: "Explore your first heritage location." },
  { id: "mystery-solver", name: "Mystery Solver", icon: "search", desc: "Close a Heritage Detective case or escape the Mystery Chamber." },
  { id: "monument-master", name: "Monument Master", icon: "dome", desc: "Rebuild a monument in Rebuild Lahore." },
  { id: "heritage-explorer", name: "Heritage Explorer", icon: "stamp", desc: "Collect all six passport stamps." },
  { id: "puzzle-champion", name: "Puzzle Champion", icon: "puzzle", desc: "Complete four different games." },
  { id: "lahore-legend", name: "Lahore Legend", icon: "crown", desc: "Reach the Lahore Legend rank." },
];

LL.GAMES = [
  { id: "lost-lahore", name: "The Lost Lahore", genre: "Story Adventure", icon: "scroll", time: "10 min", xp: 200, desc: "A fictional night in the Walled City. Read each scene for hidden clues, pass the guide's history checks and recover a tile-maker's journal before your lamp runs dry." },
  { id: "heritage-detective", name: "Heritage Detective", genre: "Mystery Investigation", icon: "search", time: "8 min", xp: 170, desc: "Search evidence tables by torchlight, read the riddle and name the monument — three ranks, from Constable to Chief Inspector, with the clock running." },
  { id: "mystery-chamber", name: "Mystery Chamber", genre: "Escape Room", icon: "key", time: "6 min", xp: 220, desc: "Three doors, one countdown. Search the chamber, study archive photographs and decode history-based locks. Every hint costs time." },
  { id: "rebuild-lahore", name: "Rebuild Lahore", genre: "Architectural Puzzle", icon: "puzzle", time: "3–8 min", xp: 210, desc: "Restore a photograph of a monument tile by tile. Unlock Craftsman and Master levels, earn stars and keep records for every site." },
  { id: "heritage-quest", name: "Heritage Quest", genre: "Treasure Hunt", icon: "map", time: "8 min", xp: 200, desc: "Follow clue cards across a map of Lahore, then search real photographs for hidden sigils. Expert mode removes every label from the map." },
  { id: "history-rush", name: "History Rush", genre: "Timed Trivia", icon: "bolt", time: "2 min", xp: 0, desc: "Documented-history questions against the clock, with streak multipliers, a 50:50 lifeline, explanations after every answer and a sudden-death mode." },
];

/* =========================================================================
   ENRICHED SITE DOSSIERS (v2) — significance, architecture, verified dates,
   reference sources. Merged into LL.LOCATIONS below.
   ========================================================================= */
LL.DOSSIERS = {
  "badshahi-mosque": {
    significance: "The Badshahi Mosque is the last of the great imperial Mughal mosques and the most monumental expression of Aurangzeb's reign. Set axially opposite the Alamgiri Gate of the Lahore Fort, it forms with the fort, the Hazuri Bagh and Allama Iqbal's tomb one of the most important historic ensembles in South Asia, and remains one of Lahore's principal places of congregational prayer.",
    architecture: "A vast square courtyard is entered through a monumental gateway reached by a flight of steps. The prayer hall on the west is faced in red sandstone with white marble inlay, fronted by a tall central arched portal (pishtaq) flanked by smaller arches, and crowned by three white marble domes. Four octagonal minarets mark the corners of the courtyard, with smaller minarets at the corners of the prayer hall.",
    timeline: [
      ["1671", "Construction begins under Emperor Aurangzeb, supervised by Fidai Khan Koka."],
      ["1673", "The mosque is completed."],
      ["1799–1849", "During Sikh rule in Lahore the mosque is used as a military garrison."],
      ["1939–1960", "Major restoration of the mosque."],
      ["1986", "The Faisal Mosque in Islamabad overtakes it as the world's largest mosque."],
    ],
    sources: [
      ["Wikipedia — Badshahi Mosque", "https://en.wikipedia.org/wiki/Badshahi_Mosque"],
      ["Walled City of Lahore Authority", "https://walledcitylahore.gop.pk/"],
    ],
  },
  "lahore-fort": {
    significance: "The Lahore Fort records almost every phase of Mughal architecture, from Akbar's robust brick construction to the refined marble pavilions of Shah Jahan. It served as a royal residence for the Mughals and later for the Sikh rulers of Punjab. UNESCO describes the fort and the Shalimar Gardens together as outstanding examples of the Mughal artistic expression at its height.",
    architecture: "Within massive brick ramparts lie public and private quarters arranged around courtyards: the Diwan-e-Aam (hall of public audience), the Diwan-e-Khas, Jahangir's Quadrangle and the Shah Burj complex containing the Sheesh Mahal with its mirror mosaic. The outer face of the north and west walls carries the Picture Wall, a long expanse of tile mosaic and fresco. The Alamgiri Gate, flanked by semi-octagonal towers, opens onto the Hazuri Bagh.",
    timeline: [
      ["1566", "Emperor Akbar begins rebuilding the fort in brick."],
      ["1631–32", "The Sheesh Mahal is built under Shah Jahan."],
      ["1674", "The Alamgiri Gate is built under Aurangzeb."],
      ["1799–1849", "The fort is a seat of Sikh rule in Lahore."],
      ["1981", "Inscribed with the Shalimar Gardens as a UNESCO World Heritage Site."],
      ["2000–2012", "The property is on UNESCO's List of World Heritage in Danger."],
    ],
    sources: [
      ["UNESCO — Fort and Shalamar Gardens in Lahore", "https://whc.unesco.org/en/list/171"],
      ["Archnet — Lahore Fort", "https://archnet.org/sites/2739"],
      ["Walled City of Lahore Authority", "https://walledcitylahore.gop.pk/"],
    ],
  },
  "minar-e-pakistan": {
    significance: "Minar-e-Pakistan is Pakistan's national monument. It stands where the All-India Muslim League presented the Lahore Resolution in March 1940, the resolution that called for independent states for Muslims in the north-western and eastern regions of British India. Pakistan Day, 23 March, commemorates that moment.",
    architecture: "Designed by Nasreddin Murat-Khan, the tower rises from a raised, flower-like platform whose petal forms open outward. The shaft tapers as it rises through a series of galleries to a small dome at the top, about 62 metres above the ground. Plaques around the base carry texts including the Lahore Resolution and the national anthem.",
    timeline: [
      ["23 March 1940", "The Lahore Resolution is presented at the Muslim League session on this ground."],
      ["1960", "Construction of the minar begins."],
      ["1968", "The minar is completed."],
    ],
    sources: [
      ["Wikipedia — Minar-e-Pakistan", "https://en.wikipedia.org/wiki/Minar-e-Pakistan"],
      ["Wikipedia — Lahore Resolution", "https://en.wikipedia.org/wiki/Lahore_Resolution"],
    ],
  },
  "iqbal-park": {
    significance: "Greater Iqbal Park is one of Lahore's largest public spaces and the setting of Minar-e-Pakistan. As the ground of the March 1940 Muslim League session, it is woven into the history of Pakistan's creation. Its position between the Walled City, the Lahore Fort and the Badshahi Mosque makes it a gateway to old Lahore.",
    architecture: "A designed civic landscape of lawns, walkways, water features and open assembly grounds, laid out around the platform of Minar-e-Pakistan. The redevelopment of the 2010s enlarged the park and reorganised its approaches.",
    timeline: [
      ["British era", "The ground is known as Minto Park."],
      ["March 1940", "Venue of the All-India Muslim League session that adopted the Lahore Resolution."],
      ["2010s", "Expanded and redeveloped as Greater Iqbal Park."],
    ],
    sources: [
      ["Wikipedia — Greater Iqbal Park", "https://en.wikipedia.org/wiki/Greater_Iqbal_Park"],
    ],
  },
  "wazir-khan-mosque": {
    significance: "Often described as the most richly ornamented Mughal mosque, the Wazir Khan Mosque sits on the old royal route (Shahi Guzargah) inside Delhi Gate. It is a masterpiece of Lahore's tile-making and fresco traditions and an anchor of the Walled City's historic fabric. Its recent conservation is regarded as a model for heritage work in Pakistan.",
    architecture: "The mosque is entered through a tall gateway from a small square. A courtyard surrounded by cells leads to a five-bay prayer hall with domes. Octagonal minarets stand at the corners of the courtyard. Nearly every surface is decorated: kashi kari tile mosaic outside, and buon fresco paintings of floral and geometric designs inside. A row of shops was built into the complex as an endowment.",
    timeline: [
      ["c. 1634", "Construction begins during the reign of Shah Jahan."],
      ["c. 1641", "The mosque is completed."],
      ["2010s", "Conservation by the Aga Khan Trust for Culture with the Walled City of Lahore Authority."],
    ],
    sources: [
      ["Wikipedia — Wazir Khan Mosque", "https://en.wikipedia.org/wiki/Wazir_Khan_Mosque"],
      ["Walled City of Lahore Authority", "https://walledcitylahore.gop.pk/"],
    ],
  },
  "shalimar-gardens": {
    significance: "The Shalimar Gardens are among the finest surviving Mughal gardens. Built for Shah Jahan, they translate the Persian idea of paradise as an enclosed, watered garden into an engineered landscape of terraces, cascades and fountains. They share UNESCO World Heritage status with the Lahore Fort.",
    architecture: "A walled garden descends in three terraces, each organised around water channels, tanks and rows of fountains. Marble pavilions and baradaris overlook the water, and cascades carry water from one level to the next. The plan follows the charbagh principle of a garden divided into quarters by walkways and channels.",
    timeline: [
      ["1641", "Construction begins for Emperor Shah Jahan."],
      ["1642", "The gardens are completed."],
      ["1981", "Inscribed with the Lahore Fort as a UNESCO World Heritage Site."],
      ["2000–2012", "On UNESCO's List of World Heritage in Danger after damage to historic hydraulic works."],
    ],
    sources: [
      ["UNESCO — Fort and Shalamar Gardens in Lahore", "https://whc.unesco.org/en/list/171"],
      ["Archnet — Shalimar Gardens", "https://archnet.org/sites/2748"],
    ],
  },
};
LL.LOCATIONS.forEach((l) => Object.assign(l, LL.DOSSIERS[l.id] || {}));

/* Explanations for existing questions (shown after answering) + new questions. */
LL.TRIVIA.forEach((t) => { if (!t.x) { const loc = LL.LOCATIONS.find((l) => l.id === t.loc); t.x = loc ? loc.facts.find((f) => f.toLowerCase().includes(String(t.a[t.c]).toLowerCase().split(" ")[0])) || "" : ""; } });
LL.TRIVIA.push(
  { d: 1, loc: "lahore-fort", q: "What does 'Sheesh Mahal' mean?", a: ["Palace of Mirrors", "Hall of Lamps", "Garden Palace", "Gate of Glass"], c: 0, x: "Sheesh Mahal means Palace of Mirrors — its walls and ceilings are set with mirror mosaic." },
  { d: 1, loc: "minar-e-pakistan", q: "Pakistan Day, commemorating the Lahore Resolution, is observed on…", a: ["23 March", "14 August", "25 December", "6 September"], c: 0, x: "The Lahore Resolution was presented on 23 March 1940; the date is observed as Pakistan Day." },
  { d: 1, loc: "minar-e-pakistan", q: "In which park does Minar-e-Pakistan stand?", a: ["Greater Iqbal Park", "Lawrence Garden", "Jilani Park", "Model Town Park"], c: 0, x: "The minar stands at the heart of Greater Iqbal Park." },
  { d: 2, loc: "badshahi-mosque", q: "The Badshahi Mosque faces the Lahore Fort across which garden?", a: ["Hazuri Bagh", "Shalimar Bagh", "Lawrence Garden", "Bagh-e-Jinnah"], c: 0, x: "The Hazuri Bagh lies between the mosque's gateway and the fort's Alamgiri Gate." },
  { d: 2, loc: "lahore-fort", q: "Which hall of the Lahore Fort was used for public audiences?", a: ["Diwan-e-Aam", "Diwan-e-Khas", "Sheesh Mahal", "Naulakha"], c: 0, x: "Diwan-e-Aam means hall of public audience; the Diwan-e-Khas was for private audiences." },
  { d: 2, loc: "shalimar-gardens", q: "A 'charbagh' is a garden divided into…", a: ["Four parts", "Seven terraces", "Two halves", "A single lawn"], c: 0, x: "Char means four: a charbagh is divided into quarters by walkways and water channels." },
  { d: 2, loc: "wazir-khan-mosque", q: "The Wazir Khan Mosque stands on which historic route?", a: ["The Shahi Guzargah (Royal Trail)", "The Grand Trunk Road", "The Mall", "Ferozepur Road"], c: 0, x: "The mosque lies on the Shahi Guzargah, the royal route from Delhi Gate to the Lahore Fort." },
  { d: 2, loc: "badshahi-mosque", q: "How was the Badshahi Mosque used during Sikh rule?", a: ["As a military garrison", "As a royal library", "As a market", "As a school"], c: 0, x: "During Sikh rule the mosque was used as a military garrison." },
  { d: 3, loc: "minar-e-pakistan", q: "Who moved the Lahore Resolution at the 1940 session?", a: ["A. K. Fazlul Huq", "Liaquat Ali Khan", "Allama Iqbal", "Sir Sikandar Hayat"], c: 0, x: "The resolution was moved by A. K. Fazlul Huq, then Premier of Bengal." },
  { d: 3, loc: "lahore-fort", q: "Between which years were the Lahore Fort and Shalimar Gardens on UNESCO's 'in Danger' list?", a: ["2000–2012", "1981–1990", "1947–1971", "2015–2020"], c: 0, x: "The property was on the List of World Heritage in Danger from 2000 to 2012." },
  { d: 3, loc: "wazir-khan-mosque", q: "The painting technique on wet lime plaster used inside the Wazir Khan Mosque is called…", a: ["Buon fresco", "Tempera", "Encaustic", "Lacquer"], c: 0, x: "The interior paintings are buon fresco — pigment applied to wet lime plaster." },
  { d: 3, loc: "shalimar-gardens", q: "In which Lahore neighbourhood are the Shalimar Gardens?", a: ["Baghbanpura", "Anarkali", "Gulberg", "Model Town"], c: 0, x: "The gardens lie in Baghbanpura, east of the Walled City." },
  { d: 3, loc: "lahore-fort", q: "The Picture Wall's tile mosaics date mainly from the reigns of…", a: ["Jahangir and Shah Jahan", "Babur and Humayun", "Ranjit Singh", "The British Raj"], c: 0, x: "The Picture Wall was decorated under Jahangir and Shah Jahan." },
  { d: 1, loc: "wazir-khan-mosque", q: "Near which gate of the Walled City does the royal route begin at the Wazir Khan Mosque?", a: ["Delhi Gate", "Bhati Gate", "Lahori Gate", "Roshnai Gate"], c: 0, x: "The mosque stands just inside Delhi Gate." }
);

/* Additional achievements (the original six are kept unchanged). */
LL.ACHIEVEMENTS.push(
  { id: "scholar", name: "Scholar", icon: "book", desc: "Reveal every fact at all six sites." },
  { id: "archivist", name: "Archivist", icon: "camera", desc: "Collect 25 discovery cards." },
  { id: "cartographer", name: "Cartographer", icon: "map", desc: "Finish Heritage Quest on Expert (no map labels)." },
  { id: "restorer", name: "Master Restorer", icon: "puzzle", desc: "Rebuild any monument on Hard." },
  { id: "devotee", name: "Devotee", icon: "flame", desc: "Keep a 7-day daily streak." },
  { id: "polymath", name: "Polymath", icon: "bolt", desc: "Score 2,500+ in History Rush." }
);

/* Expeditions — larger missions unlocked as the player rises in rank. */
LL.EXPEDITIONS = [
  { id: "exp-mughal", name: "The Mughal Trilogy", rank: 1, xp: 150, icon: "dome", desc: "Earn passport stamps at the Lahore Fort, the Badshahi Mosque and the Shalimar Gardens.", check: (p) => ["lahore-fort", "badshahi-mosque", "shalimar-gardens"].every((s) => p.stamps[s]) },
  { id: "exp-walled", name: "Inside the Walls", rank: 2, xp: 150, icon: "gate", desc: "Stamp the Wazir Khan Mosque and restore the journal in The Lost Lahore.", check: (p) => p.stamps["wazir-khan-mosque"] && p.games["lost-lahore"] && p.games["lost-lahore"].completed },
  { id: "exp-nation", name: "Birth of a Nation", rank: 3, xp: 200, icon: "tower", desc: "Stamp Minar-e-Pakistan and Greater Iqbal Park, and score 1,500+ in History Rush.", check: (p) => p.stamps["minar-e-pakistan"] && p.stamps["iqbal-park"] && ((p.games["history-rush"] || {}).best || 0) >= 1500 },
  { id: "exp-keeper", name: "Keeper of the Archive", rank: 4, xp: 250, icon: "book", desc: "Collect 30 discovery cards and close every Heritage Detective case on Expert.", check: (p) => LL.Game.discoveryCount(p) >= 30 && p.flags && p.flags.detectiveExpert },
];
