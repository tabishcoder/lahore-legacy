/* =========================================================================
   LAHORE LEGACY — LANGUAGE MODES
   "mix" (default): English interface; history and important visitor info
                    in easy-to-read Urdu.
   "en":            everything in English.
   Interface text is always English. Content objects { en, ur } are read
   with pick(), and Urdu blocks get lang/dir from attrs().
   ========================================================================= */

window.LL = window.LL || {};

LL.I18N = (function () {
  const STR = {
    places: "Places", tour: "Tour", plan: "Plan", quiz: "Quiz",
    toEnglish: "English only", toMix: "اردو + English",
    toEnglishTitle: "Show everything in English", toMixTitle: "Read history and visitor info in Urdu",
    heroEyebrow: "Lahore Lahore Aye!",
    heroTitle: "Apna Lahore, <em>made easy.</em>",
    inLahoreEyebrow: "Visiting Lahore?",
    inLahoreTitle: "Plan my visit",
    inLahoreText: "Tell us how much time you have. Get a ready-made route with directions and tips.",
    farEyebrow: "Far from Lahore?",
    farTitle: "Take the virtual tour",
    farText: "Look around Lahore's heritage from your screen — photos, panoramas and short stories.",
    sitesTitle: "If you only have one day",
    sitesLead: "The six places any Lahori will send you to first.",
    allTitle: "Every heritage place",
    allLead: "Grouped by area, so you can see what is close together.",
    allChip: "All",
    placesCount: (n) => `${n} places`,
    min: "1 min read",
    stamped: "Stamped",
    quizEyebrow: "60 seconds",
    quizTitle: "How well do you know Lahore?",
    quizLead: "One minute on the clock. Answer what you can, then send your score to that one friend who thinks they know everything.",
    quizCta: "Start the quiz",
    certTitle: "Six stamps collected",
    certLead: "You know the heart of Lahore now. Take your certificate, and keep going.",
    certCta: "Get my certificate",
    progressLine: (s, n, t) => `${s} of ${t} places seen · ${n} stamps`,
    directions: "Get directions", directionsNote: "Opens Google Maps in a new tab", seePhotos: "See photos",
    virtualView: "Walk through in 360°",
    quick: { time: "Time needed", entry: "Entry", best: "Best time" },
    facts: "Three things to know",
    look: "Look for these when you visit",
    lookHint: "Tick them off when you find them.",
    thenNow: "Then & now",
    thenNowHint: "Drag to compare",
    then: "Then", now: "Now",
    gallery: "Photos",
    visit: "Before you go",
    visitNote: "Checked November 2026. Timings and prices change — please confirm before visiting.",
    check: "Earn the stamp",
    checkLead: "Three quick questions.",
    stampEarned: "Stamp earned",
    stampAlready: "You already have this stamp.",
    tryAgain: "Try again",
    next: "Next place", prev: "Previous",
    back: "All places",
    correct: "Correct", wrong: "The answer is",
    qOf: (i, n) => `Question ${i} of ${n}`,
    score: "Your score",
    shareScore: "Share my score",
    playAgain: "Play again",
    best: "Best",
    resultLine: (r, t) => `${r} correct out of ${t}`,
    shareText: (r, t) => `I got ${r}/${t} on the Lahore Legacy quiz. How well do you know Lahore?`,
    tourEyebrow: (i, n) => `Virtual tour · ${i} of ${n}`,
    tourStart: "Start the tour",
    fullStory: "Full story, timings & tickets",
    didYouKnow: "Did you know?",
    dragHint: "Drag to look around",
    motion: "Look around by moving your phone",
    panoLabel: "Panorama",
    photoLabel: "Photo",
    tourDone: "You've finished the virtual tour",
    tourDoneText: "Now test what you remember in the 60-second quiz — or plan a real visit.",
    planEyebrow: "Tourist guide",
    planTitle: "Plan your visit",
    planLead: "How much time do you have?",
    recommended: "Recommended",
    tipsTitle: "Good to know",
    walkMin: (m) => `${m} min walk`,
    walkMapNote: "Simplified map · not to scale",
    open: "Open",
    certName: "Your name for the certificate",
    sources: "Sources",
    credits: "Photo & video credits",
    stampsOf: (n, t) => `${n}/${t} stamps`,
    footer: "Put together from documented history and public archives. Timings and tickets change, so check before you go.",
    oldArchive: "Previous version",
    placeholder: "Photo unavailable right now",
    map: "Map",
    away: "away", me: "Me", meEyebrow: "Your progress", openMap: "Open the map",
    heroLead: (n) => `${n} old places, from the Fort and the walled city to the tombs across the Ravi. See what's close by, plan a few hours, or wander from your phone.`,
    searchPh: (n) => (mode === "mix" ? `Search ${n} places, try “tomb” or “مسجد”` : `Search ${n} places, try “tomb” or “mosque”`), noResults: "Nothing found. Try another word.",
    actNear: "Near me", actNearSub: "What's close to you",
    actPlan: "Plan a day", actPlanSub: "2 hours to a full day",
    actTour: "Virtual tour", actTourSub: "From anywhere",
    now_morning: "Good this morning", nowLine_morning: "Cool and quiet: the best time for walking and the tombs.",
    now_afternoon: "Good this afternoon", nowLine_afternoon: "Hot outside? Go for indoor halls, museums and shade.",
    now_evening: "Good this evening", nowLine_evening: "Golden hour: gardens and big views.",
    now_night: "Good tonight", nowLine_night: "Lahore after dark: lit-up domes and late-night spots.",
    showList: "Show list", nearMe: "Near me", nearestFirst: (n) => `${n} places · nearest first`,
    noLocation2: "Location is off. Turn it on to sort places by distance.", farAway: "You seem to be outside Lahore, so distances are long.",
    planQ: "How much time do you have?", stopsN: (n) => `${n} stops`, onFoot: "on foot", byCar: "by car",
    moreDay2: "Already seen these? Try a second day", startWalk: "Start", continueWalk: "Continue",
    routeAll: "Whole route in Google Maps", sharePlan: "Share", showMap: "Map", navigate: "Navigate",
    stopOf: (a, b) => `Stop ${a} of ${b}`, hereNext: "I'm here · next stop", hereFinish: "I'm here · finish",
    nextStop: "Next stop", finishWalk: "Finish", prevStop: "Back", skip: "Skip", aboutPlace: "About this place",
    fromLast: "from the last stop", close: "Close", sharePlace: "Share",
    nearbyTitle: "Also nearby", trailCardTitle: "Walk here in 360°", trailCardText: "Part of the Royal Trail — look around before you go.", trailCardCta: "Start the 360° walk",
    videoBy: (n) => `Video: ${n} / Pexels`, seeBadges: "See your badges", nextUp: "Next",
    stNew: "Not yet", stSeen: "Seen", stVisited: "Visited", stVerified: "Verified visit",
    onMap: "On the map",
    beenQ: "Have you been here?",
    beenLead: (a, b) => `Check in to mark it on your map: +${a} points, and +${b} more if your phone confirms you are there.`,
    beenGps: "Check in here", beenSelf: "I've been here",
    beenDone: "You've been here", beenVerified: "Visit verified by location", beenVerify: "Verify with location",
    beenDate: (d) => `Marked on ${d}`, undo: "Undo", locating: "Finding you…",
    tooFar: (d) => `You are ${d} away. Come within 500 m to check in.`,
    noLocation: "Couldn't get your location. You can still tap “I've been here”.",
    mapEyebrow: "Explorer map", mapTitle: "My Lahore",
    mapLead: "Everything you have seen, stamped and visited, and what is still waiting for you.",
    ptsTo: (n, r) => `${n} points to ${r}`, maxRank: "Top rank reached",
    statSeen: "Seen", statStamps: "Stamps", statVisited: "Visited", statBadges: "Badges",
    areasTitle: "Area by area", badgesTitle: "Badges", badgeEarned: (d) => `Earned ${d}`,
    nextTitle: "Still to discover", pointsTitle: "How points work",
    legendNew: "Not yet", legendSeen: "Seen", legendStamp: "Stamped", legendVisited: "Visited",
    stopsDone: (a, b) => `${a} of ${b} stops done`, markDone: "Mark done", doneLbl: "Done",
    reset: "Start over", routeDone: "Route complete!", routeDoneText: "Every stop ticked off. Shabash!",
    routeMap: "The route", stop: (n) => `Stop ${n}`, finish: "Finish", start: "Start",
    badgeUnlocked: "Badge unlocked", rankUp: "New rank", allAreas: "All",
    cue: "Explore", glPlaces: "heritage places", glStops: "stops in the 360° walk", glPlans: "ready tour plans", glAreas: "parts of the city",
    langTitle: "Language", langHint: "Urdu + English shows the stories and visitor info in Urdu. English only shows everything in English.", langMix: "اردو + English", langEn: "English only", langChange: "change",
    fromSource: "Source:", officialTitle: "Official sources",
    trailTitle: "Walk the Royal Trail in 360°", trailShort: "Royal Trail 360°",
    trailLead: "Fifteen 360° stops from Delhi Gate to Wazir Khan's square. Drag to look around, tap the arrows to walk.",
    trailCta: "Start at Delhi Gate", trailEyebrow: (i, n) => `Royal Trail 360° · stop ${i} of ${n}`,
    trailHint: "Drag to look around · tap an arrow or “Walk on”", trailLoading: "Loading the view…",
    trailError: "The 360° view couldn't load. Check your connection and try again.", trailAria: "360 degree view. Drag or use arrow keys to look around.",
    trailNext: "Walk on", trailEndShort: "Wazir Khan Mosque", trailEnd: "Visit Wazir Khan Mosque", trailReadMore: "Read about this place",
    trailCredit: "360° photography by the", trailNew: "New",
    pointsRows: [["Open a place", 10], ["Earn its stamp", 25], ["Visit it in person", 40], ["Verified by location", 15], ["Each quiz point (best score)", 3]],
  };

  let mode = "mix";
  try { if (localStorage.getItem("lahoreLegacy.mode") === "en") mode = "en"; } catch (e) {}

  function apply() {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.documentElement.classList.toggle("mode-mix", mode === "mix");
  }
  function set(m) {
    mode = m === "en" ? "en" : "mix";
    try { localStorage.setItem("lahoreLegacy.mode", mode); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent("ll:lang"));
  }
  const t = (k, ...args) => { const v = STR[k]; return typeof v === "function" ? v(...args) : v; };
  /* Content: Urdu in mix mode (when available), English otherwise. */
  const pick = (obj) => (obj ? (mode === "mix" && obj.ur != null ? obj.ur : obj.en) : "");
  /* Attributes for a content block, so Urdu reads right-to-left in Naskh. */
  const attrs = () => (mode === "mix" ? 'lang="ur" dir="rtl"' : 'lang="en"');

  apply();
  return { t, pick, attrs, set, get mode() { return mode; }, get lang() { return mode === "mix" ? "ur" : "en"; } };
})();
