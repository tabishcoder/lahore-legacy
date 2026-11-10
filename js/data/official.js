/* =========================================================================
   LAHORE LEGACY — CONTENT FROM OFFICIAL HERITAGE BODIES
   Facts below come from the Walled City of Lahore Authority (WCLA) and the
   Lahore Museum websites, rewritten short, and are linked back to them.
   Photos for these sections are in js/config/official-photos.js.
   ========================================================================= */

window.LL = window.LL || {};

LL.OFFICIAL = {
  /* Organisations credited in the site's Credits dialog */
  sources: [
    { name: "Walled City of Lahore Authority (WCLA)", url: "https://walledcitylahore.gop.pk/",
      used: "360° Royal Trail photography, photos of the Walled City and Jahangir's Tomb, guided tour listings" },
    { name: "WCLA · Lahore Fort", url: "https://lahorefortwcla.com/",
      used: "Photos of Lahore Fort and Badshahi Mosque, the fort's layout and accessibility information" },
    { name: "WCLA · Shahi Hammam", url: "https://shahihamam.com/",
      used: "Photos of the Shahi Hammam and its restoration, the history and restoration story" },
    { name: "WCLA · Shalimar Gardens", url: "https://shalimargardans.com/",
      used: "Photos of Shalimar Gardens, conservation and evening events" },
    { name: "WCLA Virtual Tour", url: "https://virtual-tour.walledcitylahore.gop.pk/",
      used: "Fifteen 360° panoramas of the Royal Trail, Delhi Gate to Chowk Wazir Khan" },
    { name: "Lahore Museum", url: "https://lahoremuseum.punjab.gov.pk/",
      used: "Photos of the museum and fourteen collection highlights, with their descriptions" },
    { name: "Department of Archaeology and Museums, Pakistan", url: "https://doam.gov.pk/",
      used: "Photos of Lahore Fort and Badshahi Mosque" },
    { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/171",
      used: "World Heritage listing of Lahore Fort and Shalimar Gardens (1981)" },
    { name: "UNESCO Islamabad", url: "https://www.unesco.org/en/fieldoffice/islamabad", used: "Further reading on heritage work in Pakistan" },
    { name: "Directorate General of Archaeology Punjab", url: "https://archaeology.punjab.gov.pk/", used: "Further reading" },
    { name: "Tourism Development Corporation of Punjab", url: "https://tdcp.gop.pk/attractions/historical-and-archaeological", used: "Further reading" },
    { name: "Google Arts & Culture · WCLA collection", url: "https://artsandculture.google.com/partner/walled-city-of-lahore-authority-wcla", used: "Further exploring: WCLA's own online exhibits" },
  ],

  /* ---------- Shahi Hammam: how it was saved ---------- */
  hammam: {
    title: { en: "How the Hammam was saved", ur: "حمام کو کیسے بچایا گیا" },
    lead: { en: "For three hundred years the bath house was used for almost everything except bathing. This is how it came back.",
            ur: "تین سو سال تک یہ حمام نہانے کے سوا تقریباً ہر کام کے لیے استعمال ہوتا رہا۔ یہ اس کی واپسی کی کہانی ہے۔" },
    steps: [
      { year: "1634", en: "Hakim Ilmuddin Ansari, known as Wazir Khan and Governor of Lahore under Shah Jahan, builds a public bath for travellers and townspeople: 21 connected rooms over more than 1,000 m², with hot, warm and cool rooms and a prayer room facing Mecca.",
        ur: "شاہ جہاں کے دور میں لاہور کے گورنر حکیم علم الدین انصاری، یعنی وزیر خان، مسافروں اور شہریوں کے لیے عوامی حمام بنواتے ہیں: ایک ہزار مربع میٹر سے زیادہ پر 21 جڑے ہوئے کمرے، گرم، نیم گرم اور ٹھنڈے کمرے، اور قبلہ رخ نماز کا کمرہ۔" },
      { year: "Sikh era", en: "The heating system is wrecked and ornaments are pulled out of the ceilings and walls.",
        ur: "حرارتی نظام تباہ ہو جاتا ہے اور چھتوں اور دیواروں سے آرائش اکھاڑ لی جاتی ہے۔" },
      { year: "British era", en: "The Hammam becomes offices and living quarters for police and soldiers.",
        ur: "حمام پولیس اور فوجیوں کے دفاتر اور رہائش بن جاتا ہے۔" },
      { year: "After 1947", en: "It serves as a boys' primary school, a girls' vocational school, a dispensary and government offices. The frescoes are lime-washed, the heated floors covered in marble and cement, and shops are built against the outer walls.",
        ur: "یہاں لڑکوں کا پرائمری اسکول، لڑکیوں کا ووکیشنل اسکول، ڈسپنسری اور سرکاری دفاتر رہے۔ فریسکو پر چونا پھیر دیا گیا، گرم فرش سنگِ مرمر اور سیمنٹ سے ڈھک دیے گئے، اور باہر کی دیواروں سے دکانیں جوڑ دی گئیں۔" },
      { year: "2006–2012", en: "The World Bank and the Government of Punjab start a project to save the Walled City. The Aga Khan Trust for Culture joins in 2007, and the Walled City of Lahore Authority is set up in 2012.",
        ur: "ورلڈ بینک اور حکومتِ پنجاب اندرون شہر کو بچانے کا منصوبہ شروع کرتے ہیں۔ 2007 میں آغا خان ٹرسٹ فار کلچر شامل ہوتا ہے، اور 2012 میں والڈ سٹی آف لاہور اتھارٹی بنتی ہے۔" },
      { year: "Restored", en: "Shops and later additions come off the walls, the later floors are lifted to reveal the original hypocaust heating (now shown under glass), and the frescoes come back from under the lime wash.",
        ur: "دیواروں سے دکانیں اور بعد کی تعمیرات ہٹائی جاتی ہیں، بعد کے فرش اٹھا کر اصل زیرِ زمین حرارتی نظام نکالا جاتا ہے (جو اب شیشے کے نیچے نظر آتا ہے)، اور چونے کے نیچے سے فریسکو واپس آتے ہیں۔" },
      { year: "2016", en: "The conservation wins a UNESCO Asia-Pacific Award of Merit for Cultural Heritage Conservation.",
        ur: "اس بحالی کو یونیسکو ایشیا پیسیفک ایوارڈ آف میرٹ برائے ثقافتی ورثہ ملتا ہے۔" },
    ],
    source: { name: "shahihamam.com (WCLA)", url: "https://shahihamam.com/" },
  },

  /* ---------- Lahore Fort: from WCLA ---------- */
  fort: {
    title: { en: "From the Walled City Authority", ur: "والڈ سٹی اتھارٹی کی طرف سے" },
    facts: [
      { en: "The Mughal buildings are grouped into four large quadrangles, with 21 separate structures in all.", ur: "مغل عمارتیں چار بڑے احاطوں میں ہیں، کل 21 الگ عمارتیں۔" },
      { en: "UNESCO added the fort to the World Heritage List in 1981, together with Shalimar Gardens.", ur: "یونیسکو نے 1981 میں شالامار باغ کے ساتھ قلعے کو عالمی ورثے کی فہرست میں شامل کیا۔" },
    ],
    access: {
      title: { en: "Visiting with a disability", ur: "معذوری کے ساتھ دورہ" },
      items: [
        { en: "Discounted tickets for visitors with disabilities.", ur: "معذور افراد کے لیے رعایتی ٹکٹ۔" },
        { en: "Step-free access can be arranged in advance: call +92 300 3443557. The standard route may not be step-free.", ur: "سیڑھیوں کے بغیر راستہ پہلے سے طے کیا جا سکتا ہے: ⁦+92 300 3443557⁩ پر فون کریں۔ عام راستے پر سیڑھیاں ہو سکتی ہیں۔" },
        { en: "Accessible toilets and seating around the fort.", ur: "قلعے میں قابلِ رسائی بیت الخلا اور بیٹھنے کی جگہیں۔" },
        { en: "A multimedia guide with Urdu Sign Language and subtitles, and an audio guide for blind and partially sighted visitors.", ur: "اردو اشاروں کی زبان اور سب ٹائٹلز والا ملٹی میڈیا گائیڈ، اور نابینا افراد کے لیے آڈیو گائیڈ۔" },
      ],
    },
    source: { name: "lahorefortwcla.com (WCLA)", url: "https://lahorefortwcla.com/" },
  },

  /* ---------- Shalimar Gardens ---------- */
  shalimar: {
    title: { en: "From the Walled City Authority", ur: "والڈ سٹی اتھارٹی کی طرف سے" },
    facts: [
      { en: "WCLA's conservation work has repaired stonework and brought the water channels and planting back to life.", ur: "والڈ سٹی اتھارٹی نے پتھر کا کام مرمت کیا اور نہروں اور پودوں کو دوبارہ زندہ کیا۔" },
      { en: "On some evenings the garden hosts candle-lit heritage nights with sitar, classical dance and storytelling. Dates are announced on the garden's website.", ur: "کچھ شاموں کو باغ میں موم بتیوں والی ثقافتی راتیں ہوتی ہیں: ستار، کلاسیکی رقص اور داستان گوئی۔ تاریخیں باغ کی ویب سائٹ پر آتی ہیں۔" },
    ],
    source: { name: "shalimargardans.com (WCLA)", url: "https://shalimargardans.com/" },
  },

  /* ---------- Lahore Museum ---------- */
  museum: {
    title: { en: "From the collection", ur: "مجموعے سے" },
    lead: { en: "The museum calls itself the oldest and largest in Pakistan. A few of the pieces to look for:", ur: "عجائب گھر خود کو پاکستان کا سب سے پرانا اور بڑا عجائب گھر کہتا ہے۔ یہ چند چیزیں ضرور دیکھیں:" },
    vr: { label: { en: "Take the museum's own virtual tour", ur: "عجائب گھر کا اپنا ورچوئل ٹور" }, url: "https://www.mapalytics.org/vr_tour/UNESCO/Lahore_Museum_VR.html" },
    source: { name: "lahoremuseum.punjab.gov.pk", url: "https://lahoremuseum.punjab.gov.pk/" },
  },

  /* ---------- guided walks run by WCLA ---------- */
  tours: {
    title: { en: "Guided tours by the Walled City Authority", ur: "والڈ سٹی اتھارٹی کے گائیڈڈ ٹور" },
    lead: { en: "Want a local guide? WCLA runs these walks. Prices and dates are on their booking pages.", ur: "مقامی گائیڈ چاہیے؟ والڈ سٹی اتھارٹی یہ سیر کرواتی ہے۔ قیمتیں اور تاریخیں ان کے صفحات پر ہیں۔" },
    list: [
      ["Hidden places of Lahore Fort", "hidden-places-lahore-fort"],
      ["Lahore Fort during the Sikh Empire", "lahore-fort-during-sikh-empire"],
      ["Fort Freight", "fort-freight-lahore-fort"],
      ["History by Night", "history-by-night"],
      ["Chandni Raatain", "chandni-raatain"],
      ["Havelis of Lahore", "havelis-of-lahore"],
      ["Roshan Galliyan", "roshan-galliyan"],
      ["Explore the Lohari Gate", "explore-the-lohari-gate"],
      ["Bhatti, the Chelsea of Lahore", "bhatti-the-chelsea-of-lahore"],
      ["The Tales of Taxali", "the-tales-of-taxali"],
      ["Wekh Androon Lahore", "wekh-androon-lahore"],
      ["Museum Mystery", "museum-mystery"],
      ["Yatra", "yatra"],
    ],
    base: "https://walledcitylahore.gop.pk/book-tours/",
  },
};
