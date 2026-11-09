/* =========================================================================
   LAHORE LEGACY — TOURIST GUIDE CONTENT (English + Urdu)
   Ready-made day plans, quick facts per place and "good to know" tips.
   Visit facts were checked in November 2026 — update when they change.
   ========================================================================= */

window.LL = window.LL || {};

/* Quick facts shown at the top of each place page. */
LL.QUICK = {
  "badshahi-mosque": [
    ["time", { en: "45 min", ur: "45 منٹ" }],
    ["entry", { en: "Free for Pakistanis", ur: "پاکستانیوں کے لیے مفت" }],
    ["best", { en: "Early morning", ur: "صبح سویرے" }],
  ],
  "lahore-fort": [
    ["time", { en: "2–3 hours", ur: "2 سے 3 گھنٹے" }],
    ["entry", { en: "Rs 100 day · Rs 1,000 night tour", ur: "دن میں 100 روپے · رات کا ٹور 1000 روپے" }],
    ["best", { en: "Morning, or the 7–11 pm night tour", ur: "صبح، یا شام 7 سے 11 بجے کا رات والا ٹور" }],
  ],
  "wazir-khan-mosque": [
    ["time", { en: "45 min", ur: "45 منٹ" }],
    ["entry", { en: "Free", ur: "مفت" }],
    ["best", { en: "Morning, before the bazaar gets busy", ur: "صبح، بازار میں رش ہونے سے پہلے" }],
  ],
  "shalimar-gardens": [
    ["time", { en: "1–1.5 hours", ur: "ایک سے ڈیڑھ گھنٹہ" }],
    ["entry", { en: "Night tour Rs 1,000", ur: "رات کا ٹور 1000 روپے" }],
    ["best", { en: "Evening, when it is lit up", ur: "شام کو، جب روشنیاں جلتی ہیں" }],
  ],
  "minar-e-pakistan": [
    ["time", { en: "30–45 min", ur: "30 سے 45 منٹ" }],
    ["entry", { en: "Inside Greater Iqbal Park", ur: "گریٹر اقبال پارک کے اندر" }],
    ["best", { en: "Evening", ur: "شام کو" }],
  ],
  "iqbal-park": [
    ["time", { en: "About 1 hour", ur: "تقریباً ایک گھنٹہ" }],
    ["entry", { en: "Open roughly 6 am–8 pm", ur: "تقریباً صبح 6 سے رات 8 بجے تک" }],
    ["best", { en: "Evening, for the fountains", ur: "شام کو، فواروں کے لیے" }],
  ],
};

/* Day plans. A stop is either a place page (site) or a named spot (place). */
LL.PLANS = [
  {
    id: "short",
    label: "2–3 hours",
    title: { en: "The essentials", ur: "سب سے ضروری" },
    intro: {
      en: "Lahore's two greatest monuments face each other across one garden. See both, then eat with a view.",
      ur: "لاہور کی دو سب سے بڑی یادگاریں ایک باغ کے آمنے سامنے ہیں۔ دونوں دیکھیں، پھر سامنے بیٹھ کر کھانا کھائیں۔",
    },
    stops: [
      { site: "lahore-fort", time: "1.5–2 h", note: { en: "Start at the Alamgiri Gate. Don't miss the Sheesh Mahal.", ur: "عالمگیری دروازے سے شروع کریں۔ شیش محل ضرور دیکھیں۔" } },
      { site: "badshahi-mosque", time: "45 min", note: { en: "Walk across the Hazuri Bagh. Allama Iqbal's tomb is by the steps.", ur: "حضوری باغ پار کریں۔ علامہ اقبال کا مزار سیڑھیوں کے ساتھ ہے۔" } },
      { place: { en: "Fort Road Food Street", ur: "فورٹ روڈ فوڈ اسٹریٹ" }, q: "Fort Road Food Street, Lahore", time: "1 h", note: { en: "Dinner facing the lit-up mosque.", ur: "روشن مسجد کے سامنے بیٹھ کر کھانا۔" } },
    ],
  },
  {
    id: "half",
    label: "Half day",
    recommended: true,
    title: { en: "The royal route, on foot", ur: "شاہی راستہ، پیدل" },
    intro: {
      en: "The old royal route through the Walled City: about 2–2.5 km and 4–5 hours with stops. Walking times are approximate.",
      ur: "اندرونِ شہر کا پرانا شاہی راستہ: تقریباً 2 سے ڈھائی کلومیٹر، رکتے رکتے 4 سے 5 گھنٹے۔ پیدل وقت اندازاً لکھا ہے۔",
    },
    walk: true,
  },
  {
    id: "full",
    label: "Full day",
    title: { en: "A full day in old Lahore", ur: "پرانے لاہور میں پورا دن" },
    intro: {
      en: "Morning in the Walled City, afternoon at Minar-e-Pakistan, and the lit-up Shalimar Gardens at night.",
      ur: "صبح اندرونِ شہر، دوپہر کے بعد مینارِ پاکستان، اور رات کو روشنیوں میں شالامار باغ۔",
    },
    stops: [
      { site: "delhi-gate", time: "9:00", note: { en: "Enter the Walled City here.", ur: "یہاں سے اندرونِ شہر میں داخل ہوں۔" } },
      { site: "shahi-hammam", time: "9:10", note: { en: "Right inside the gate — 30 minutes.", ur: "دروازے کے بالکل اندر — 30 منٹ۔" } },
      { site: "wazir-khan-mosque", time: "9:45", note: { en: "A few minutes' walk along the royal route.", ur: "شاہی راستے پر چند منٹ پیدل۔" } },
      { site: "lahore-fort", time: "10:30", note: { en: "Allow 2–3 hours inside.", ur: "اندر 2 سے 3 گھنٹے رکھیں۔" } },
      { site: "badshahi-mosque", time: "13:00", note: { en: "Right opposite the Fort.", ur: "قلعے کے بالکل سامنے۔" } },
      { site: "minar-e-pakistan", time: "15:30", note: { en: "Rest in Greater Iqbal Park.", ur: "گریٹر اقبال پارک میں آرام کریں۔" } },
      { site: "shalimar-gardens", time: "19:00", note: { en: "The night tour runs 7–11 pm. Take a rickshaw or ride-hailing car (about 5–6 km).", ur: "رات کا ٹور شام 7 سے 11 بجے تک۔ رکشہ یا آن لائن ٹیکسی لیں (تقریباً 5 سے 6 کلومیٹر)۔" } },
    ],
  },
];

/* Good to know. */
LL.TIPS = [
  { icon: "sun", title: "Best season", text: { en: "October to March has pleasant days. May to July is very hot — go early in the morning.", ur: "اکتوبر سے مارچ موسم خوشگوار ہوتا ہے۔ مئی سے جولائی بہت گرمی ہوتی ہے — صبح سویرے جائیں۔" } },
  { icon: "shirt", title: "What to wear", text: { en: "Modest clothes and shoes that slip off easily — you remove them at mosques. Women may want a scarf.", ur: "سادہ لباس اور آسانی سے اترنے والے جوتے — مسجدوں میں جوتے اتارنے ہوتے ہیں۔ خواتین دوپٹہ ساتھ رکھیں۔" } },
  { icon: "car", title: "Getting around", text: { en: "Rickshaws and ride-hailing apps are easy to find. Inside the Walled City, walk — the lanes are narrow.", ur: "رکشہ اور آن لائن ٹیکسی آسانی سے مل جاتی ہیں۔ اندرونِ شہر پیدل چلیں — گلیاں تنگ ہیں۔" } },
  { icon: "cash", title: "Carry cash", text: { en: "For tickets, shoe counters and food stalls.", ur: "ٹکٹ، جوتا گھر اور کھانے کے لیے نقد رقم ساتھ رکھیں۔" } },
  { icon: "moon", title: "Fridays", text: { en: "Friday midday prayers bring big crowds to the mosques — visit them at other times.", ur: "جمعہ کی نماز کے وقت مسجدوں میں بہت رش ہوتا ہے — مسجدیں کسی اور وقت دیکھیں۔" } },
  { icon: "star", title: "Night tours", text: { en: "Lahore Fort and Shalimar Gardens open 7–11 pm with lights (Nov 2026). Adults Rs 1,000.", ur: "شاہی قلعہ اور شالامار باغ شام 7 سے رات 11 بجے روشنیوں کے ساتھ کھلے ہیں (نومبر 2026)۔ بڑوں کا ٹکٹ 1000 روپے۔" } },
];
