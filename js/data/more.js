/* =========================================================================
   LAHORE LEGACY — MORE HERITAGE PLACES (18 more, 24 in total)
   Same shape as sites.js. History checked against the sources listed at
   the bottom (Wikipedia, Archnet, Walled City of Lahore Authority, Auqaf).
   Visit details change — they are kept general on purpose.
   ========================================================================= */

window.LL = window.LL || {};

/* Areas used to group places on the home page and in the tour. */
LL.AREAS = [
  { id: "fort", name: { en: "Fort & Iqbal Park", ur: "شاہی قلعہ اور اقبال پارک" }, line: { en: "All within a short walk", ur: "سب پیدل فاصلے پر" } },
  { id: "walled", name: { en: "Walled City", ur: "اندرونِ شہر" }, line: { en: "Old Lahore inside the gates", ur: "دروازوں کے اندر پرانا لاہور" } },
  { id: "shahdara", name: { en: "Shahdara", ur: "شاہدرہ" }, line: { en: "Mughal tombs across the Ravi", ur: "راوی پار مغل مقبرے" } },
  { id: "british", name: { en: "British-era Lahore", ur: "انگریز دور کا لاہور" }, line: { en: "The Mall and around", ur: "مال روڈ اور آس پاس" } },
  { id: "gardens", name: { en: "Gardens & gateways", ur: "باغ اور دروازے" }, line: { en: "Mughal gardens across the city", ur: "شہر بھر میں مغل باغ" } },
];

(function () {
  const S = (o) => o; // readability helper

  const MORE = [
    /* ---------------- Walled City ---------------- */
    S({
      id: "delhi-gate", area: "walled",
      name: { en: "Delhi Gate", ur: "دہلی دروازہ" },
      era: { en: "Mughal origin · rebuilt 19th c.", ur: "مغل دور · انیسویں صدی میں دوبارہ بنا" },
      line: { en: "The east gate where the old royal road into Lahore begins.", ur: "مشرقی دروازہ، جہاں سے پرانا شاہی راستہ شروع ہوتا ہے۔" },
      story: {
        en: "Delhi Gate faces east, towards the road to Delhi — that is how it got its name. The first gate here was Mughal. After 1857 the British pulled down most of the city wall, and the gate you see was rebuilt in the 19th century. From here the Shahi Guzargah, the old royal road, runs west through the bazaars to the Fort.",
        ur: "یہ دروازہ مشرق کی طرف، دہلی جانے والے راستے کی طرف کھلتا ہے — اسی لیے اس کا نام دہلی دروازہ ہے۔ یہاں پہلا دروازہ مغلوں نے بنایا تھا۔ 1857 کے بعد انگریزوں نے شہر کی دیوار زیادہ تر گرا دی، اور آج کا دروازہ انیسویں صدی میں دوبارہ بنا۔ یہیں سے شاہی گزرگاہ شروع ہوتی ہے جو بازاروں سے ہوتی ہوئی قلعے تک جاتی ہے۔",
      },
      facts: {
        en: ["Old Lahore had 13 gates. Several are gone; Delhi Gate still stands.", "Rudyard Kipling mentions it in his 1891 story “The City of Dreadful Night”.", "The gate and the nearby Shahi Hammam were restored around 2015."],
        ur: ["پرانے لاہور کے 13 دروازے تھے۔ کئی ختم ہو گئے، دہلی دروازہ آج بھی کھڑا ہے۔", "مشہور انگریز ادیب کپلنگ نے 1891 کی ایک کہانی میں اس کا ذکر کیا۔", "دروازے اور ساتھ والے شاہی حمام کی مرمت تقریباً 2015 میں ہوئی۔"],
      },
      look: {
        en: ["The rooms built into the gate above the arch.", "Step through and look left: the Shahi Hammam is right beside the gate."],
        ur: ["دروازے کے اوپر بنے ہوئے کمرے۔", "اندر جا کر بائیں دیکھیں: شاہی حمام دروازے کے بالکل ساتھ ہے۔"],
      },
      visit: {
        en: [["Entry", "Free — it is a public street."], ["Getting there", "Rickshaw or ride-hailing to Delhi Gate, Circular Road."], ["Best time", "Morning, before the bazaar traffic."]],
        ur: [["داخلہ", "مفت — یہ عام راستہ ہے۔"], ["کیسے جائیں", "رکشہ یا آن لائن ٹیکسی سے سرکلر روڈ، دہلی دروازہ۔"], ["کب جائیں", "صبح، بازار کے رش سے پہلے۔"]],
      },
    }),
    S({
      id: "shahi-hammam", area: "walled",
      name: { en: "Shahi Hammam", ur: "شاہی حمام" },
      era: { en: "Mughal · 1635", ur: "مغل دور · 1635" },
      line: { en: "A Mughal bath house with painted domes, just inside Delhi Gate.", ur: "رنگین گنبدوں والا مغل حمام، دہلی دروازے کے بالکل اندر۔" },
      story: {
        en: "Built in 1635 by Wazir Khan — the same governor who built the famous mosque — this was a public bath: changing halls, warm rooms and hot rooms under painted domes. Its income paid for the upkeep of the Wazir Khan Mosque. A careful restoration from 2013 to 2015 brought the frescoes back to life.",
        ur: "یہ حمام 1635 میں وزیر خان نے بنوایا — وہی جنہوں نے مشہور مسجد بنوائی۔ یہ عوامی غسل خانہ تھا: کپڑے بدلنے کا ہال، نیم گرم اور گرم کمرے، اوپر رنگین گنبد۔ اس کی آمدنی سے مسجد وزیر خان کا خرچ چلتا تھا۔ 2013 سے 2015 تک اس کی مرمت ہوئی اور پرانی تصویریں پھر سے نکھر آئیں۔",
      },
      facts: {
        en: ["Digging during the restoration uncovered the old underfloor heating channels.", "The restoration won a UNESCO Award of Merit in 2016.", "It was built as a waqf — an endowment for the Wazir Khan Mosque."],
        ur: ["مرمت کے دوران فرش کے نیچے پانی اور کمرے گرم کرنے کا پرانا نظام ملا۔", "اس مرمت کو 2016 میں یونیسکو کا ایوارڈ ملا۔", "یہ وقف تھا — اس کی آمدنی مسجد وزیر خان کے لیے تھی۔"],
      },
      look: {
        en: ["The frescoes in the central dome.", "The uncovered floor showing the old heating system."],
        ur: ["بیچ والے گنبد کی رنگین تصویریں۔", "کھلا ہوا فرش، جس میں گرم کرنے کا پرانا نظام نظر آتا ہے۔"],
      },
      visit: {
        en: [["Entry", "Ticketed. Prices change — check at the door."], ["Time", "30–45 minutes."], ["Nearby", "Delhi Gate and Wazir Khan Mosque, a few minutes' walk."]],
        ur: [["داخلہ", "ٹکٹ لگتا ہے۔ قیمت بدلتی رہتی ہے — دروازے پر پوچھ لیں۔"], ["وقت", "30 سے 45 منٹ۔"], ["قریب", "دہلی دروازہ اور مسجد وزیر خان، چند منٹ پیدل۔"]],
      },
    }),
    S({
      id: "sunehri-masjid", area: "walled",
      name: { en: "Sunehri Masjid", ur: "سنہری مسجد" },
      era: { en: "Late Mughal · 1753", ur: "آخری مغل دور · 1753" },
      line: { en: "The “Golden Mosque”, raised above a busy bazaar.", ur: "سنہرے گنبدوں والی مسجد، مصروف بازار کے اوپر۔" },
      story: {
        en: "Nawab Syed Bhikari Khan, deputy governor of Lahore, built this mosque in 1753, when Mughal power was fading. It sits on a raised platform in Kashmiri Bazaar — shops at street level, mosque above — and its gilded domes gave it its name. The domes were gilded again in a restoration that began in 2011.",
        ur: "یہ مسجد 1753 میں لاہور کے نائب گورنر نواب سید بھکاری خان نے بنوائی، جب مغل حکومت کمزور ہو رہی تھی۔ یہ کشمیری بازار میں اونچے چبوترے پر ہے — نیچے دکانیں، اوپر مسجد۔ اس کے سنہرے گنبدوں کی وجہ سے اسے سنہری مسجد کہتے ہیں۔ 2011 میں شروع ہونے والی مرمت میں گنبدوں پر پھر سے سونے کا کام ہوا۔",
      },
      facts: {
        en: ["The shops underneath help pay for the mosque.", "In the Sikh period it was taken over; Ranjit Singh returned it to Muslims in the late 1820s.", "Inside are Mughal-era frescoes."],
        ur: ["نیچے کی دکانوں کی آمدنی مسجد پر لگتی ہے۔", "سکھ دور میں اس پر قبضہ ہوا، پھر 1820 کی دہائی کے آخر میں رنجیت سنگھ نے اسے مسلمانوں کو واپس کر دیا۔", "اندر مغل دور کی رنگین تصویریں ہیں۔"],
      },
      look: {
        en: ["The gilded domes, best seen from the bazaar below.", "The painted walls inside the prayer hall."],
        ur: ["سنہرے گنبد — نیچے بازار سے سب سے اچھے نظر آتے ہیں۔", "نماز ہال کی رنگین دیواریں۔"],
      },
      visit: {
        en: [["Entry", "Free."], ["Shoes & dress", "Shoes off at the door; dress modestly, and women may want a scarf."], ["Best time", "Morning. Avoid prayer times."]],
        ur: [["داخلہ", "مفت۔"], ["جوتے اور لباس", "اندر جاتے وقت جوتے اتاریں، سادہ لباس پہنیں؛ خواتین چاہیں تو دوپٹہ ساتھ رکھ سکتی ہیں۔"], ["کب جائیں", "صبح۔ نماز کے وقت نہ جائیں۔"]],
      },
    }),
    S({
      id: "nau-nihal-haveli", area: "walled",
      name: { en: "Haveli of Nau Nihal Singh", ur: "حویلی نونہال سنگھ" },
      era: { en: "Sikh · 1830s", ur: "سکھ دور · 1830 کی دہائی" },
      line: { en: "A painted Sikh-era mansion that is still a girls' school.", ur: "سکھ دور کی رنگین حویلی، جو آج بھی لڑکیوں کا اسکول ہے۔" },
      story: {
        en: "Maharaja Ranjit Singh had this four-storey haveli built in the 1830s for his grandson, Prince Nau Nihal Singh. Its front is covered in bright frescoes and carved wooden balconies, and the top floor has a mirrored room. For more than a hundred years it has been the Government Victoria Girls' High School.",
        ur: "مہاراجہ رنجیت سنگھ نے یہ چار منزلہ حویلی 1830 کی دہائی میں اپنے پوتے نونہال سنگھ کے لیے بنوائی۔ اس کا سامنے والا حصہ رنگین تصویروں اور لکڑی کی نقش دار بالکونیوں سے بھرا ہے، اور سب سے اوپر آئینوں والا کمرہ ہے۔ سو سال سے زیادہ سے یہاں گورنمنٹ وکٹوریہ گرلز ہائی اسکول ہے۔",
      },
      facts: {
        en: ["Four storeys plus a basement — rare for the Walled City.", "The big balcony over the door has carvings of winged figures, parrots and fish.", "It is a protected monument under the Antiquities Act 1975."],
        ur: ["چار منزلیں اور ایک تہہ خانہ — اندرونِ شہر میں ایسا کم ہی ہے۔", "دروازے کے اوپر بڑی بالکونی پر پروں والی شکلیں، طوطے اور مچھلیاں بنی ہیں۔", "یہ 1975 کے قانون کے تحت محفوظ عمارت ہے۔"],
      },
      look: {
        en: ["The frescoed front wall.", "The large carved balcony (jharoka) above the entrance."],
        ur: ["سامنے کی رنگین دیوار۔", "دروازے کے اوپر بڑا نقش دار جھروکا۔"],
      },
      visit: {
        en: [["Entry", "It is a working school — see the front from the street."], ["Inside", "Only on organised heritage tours or with permission."], ["Finding it", "Inside the Walled City; ask for “Victoria School”."]],
        ur: [["داخلہ", "یہ چلتا ہوا اسکول ہے — سامنے کا حصہ گلی سے دیکھیں۔"], ["اندر", "صرف منظم ٹور یا اجازت سے۔"], ["کیسے ڈھونڈیں", "اندرونِ شہر میں — “وکٹوریہ اسکول” پوچھیں۔"]],
      },
    }),
    S({
      id: "data-darbar", area: "walled",
      name: { en: "Data Darbar", ur: "داتا دربار" },
      era: { en: "11th century · shrine", ur: "گیارھویں صدی · مزار" },
      line: { en: "Shrine of Data Ganj Bakhsh, Lahore's best-loved Sufi saint.", ur: "داتا گنج بخشؒ کا مزار — لاہور کے سب سے پیارے بزرگ۔" },
      story: {
        en: "Ali Hujwiri came to Lahore from Ghazni in the 11th century and died here around 1072–77. Lahore knows him as Data Ganj Bakhsh. His book Kashf al-Mahjub is the earliest known book on Sufism in Persian. His shrine near Bhati Gate is now a large complex with a mosque, open day and night.",
        ur: "حضرت علی ہجویریؒ گیارھویں صدی میں غزنی سے لاہور آئے اور تقریباً 1072 سے 1077 کے درمیان یہیں وفات پائی۔ لاہور انہیں داتا گنج بخش کے نام سے جانتا ہے۔ ان کی کتاب کشف المحجوب تصوف پر فارسی کی سب سے پرانی معلوم کتاب ہے۔ بھاٹی دروازے کے قریب ان کا مزار اب ایک بڑا احاطہ ہے، ساتھ مسجد ہے، اور یہ دن رات کھلا رہتا ہے۔",
      },
      facts: {
        en: ["Kashf al-Mahjub is his only book that survives.", "The shrine has been run by the Punjab Auqaf Department since 1960.", "Free food (langar) is served here every day."],
        ur: ["کشف المحجوب ان کی واحد کتاب ہے جو آج تک موجود ہے۔", "1960 سے مزار کا انتظام پنجاب محکمہ اوقاف کے پاس ہے۔", "یہاں روزانہ لنگر تقسیم ہوتا ہے۔"],
      },
      look: {
        en: ["The marble courtyard full of visitors at any hour.", "The langar being served to anyone who comes."],
        ur: ["سنگِ مرمر کا صحن، جہاں ہر وقت لوگ ہوتے ہیں۔", "لنگر، جو ہر آنے والے کو ملتا ہے۔"],
      },
      visit: {
        en: [["Entry", "Free. Open day and night."], ["Security", "Body check at the gate; avoid large bags."], ["Dress", "Modest clothes, shoes off; women may want a scarf, and there's a separate entrance for women."]],
        ur: [["داخلہ", "مفت۔ دن رات کھلا ہے۔"], ["سیکیورٹی", "دروازے پر تلاشی ہوتی ہے، بڑے بیگ نہ لے جائیں۔"], ["لباس", "سادہ لباس، جوتے اتاریں؛ خواتین چاہیں تو دوپٹہ ساتھ رکھ سکتی ہیں، اور خواتین کے لیے الگ دروازہ ہے۔"]],
      },
    }),

    /* ---------------- Fort & Iqbal Park ---------------- */
    S({
      id: "hazuri-bagh", area: "fort",
      name: { en: "Hazuri Bagh", ur: "حضوری باغ" },
      era: { en: "Sikh · 1818", ur: "سکھ دور · 1818" },
      line: { en: "The garden between the Fort and the mosque, with a marble pavilion.", ur: "قلعے اور مسجد کے بیچ باغ، جس میں سنگِ مرمر کی بارہ دری ہے۔" },
      story: {
        en: "Maharaja Ranjit Singh laid out this garden between the Fort and the Badshahi Mosque. At its centre is a marble baradari, built in 1818 to celebrate his capture of the Koh-i-Noor diamond in 1813. Much of the marble was taken from older Lahore tombs. The pavilion's top storey fell on 19 July 1932 and was never rebuilt.",
        ur: "مہاراجہ رنجیت سنگھ نے یہ باغ قلعے اور بادشاہی مسجد کے بیچ بنوایا۔ بیچ میں سنگِ مرمر کی بارہ دری ہے، جو 1818 میں بنی — 1813 میں کوہِ نور ہیرا ملنے کی خوشی میں۔ اس کا زیادہ تر سنگِ مرمر لاہور کے پرانے مقبروں سے اتارا گیا۔ بارہ دری کی اوپر والی منزل 19 جولائی 1932 کو گر گئی اور دوبارہ نہیں بنی۔",
      },
      facts: {
        en: ["The baradari celebrated the Koh-i-Noor, captured in 1813.", "Its upper storey collapsed in 1932.", "Roshnai Gate, one of the Walled City's gates, is on the garden's south side."],
        ur: ["بارہ دری کوہِ نور ہیرا ملنے کی یاد میں بنی۔", "اس کی اوپر والی منزل 1932 میں گر گئی۔", "اندرونِ شہر کا روشنائی دروازہ باغ کے جنوب میں ہے۔"],
      },
      look: {
        en: ["The carved marble pillars of the baradari.", "Stand inside it: the Fort's Alamgiri Gate on one side, the mosque's gate on the other."],
        ur: ["بارہ دری کے نقش دار ستون۔", "بارہ دری میں کھڑے ہوں: ایک طرف قلعے کا عالمگیری دروازہ، دوسری طرف مسجد کا دروازہ۔"],
      },
      visit: {
        en: [["Entry", "Between the Fort and the mosque — no separate ticket."], ["Time", "15–20 minutes."], ["Combine with", "Lahore Fort and Badshahi Mosque."]],
        ur: [["داخلہ", "قلعے اور مسجد کے بیچ — الگ ٹکٹ نہیں۔"], ["وقت", "15 سے 20 منٹ۔"], ["ساتھ دیکھیں", "شاہی قلعہ اور بادشاہی مسجد۔"]],
      },
    }),
    S({
      id: "iqbal-tomb", area: "fort",
      name: { en: "Tomb of Allama Iqbal", ur: "مزارِ اقبال" },
      era: { en: "Modern · built after 1938", ur: "جدید دور · 1938 کے بعد" },
      line: { en: "Resting place of the poet of the East, by the Badshahi Mosque steps.", ur: "شاعرِ مشرق کا مزار، بادشاہی مسجد کی سیڑھیوں کے ساتھ۔" },
      story: {
        en: "Muhammad Iqbal — poet, philosopher and the thinker behind the idea of a separate homeland for Muslims — died in Lahore in 1938. His tomb, beside the steps of the Badshahi Mosque, was designed by Nawab Zain Yar Jang of Hyderabad Deccan, using red sandstone from Jaipur and marble from Makrana. It took about 13 years to complete.",
        ur: "علامہ محمد اقبال — شاعر، فلسفی، اور مسلمانوں کے الگ وطن کے خیال کے بانی — 1938 میں لاہور میں فوت ہوئے۔ ان کا مزار بادشاہی مسجد کی سیڑھیوں کے ساتھ ہے۔ اس کا نقشہ حیدرآباد دکن کے نواب زین یار جنگ نے بنایا۔ اس میں جے پور کا سرخ پتھر اور مکرانہ کا سنگِ مرمر لگا ہے۔ اسے مکمل ہونے میں تقریباً 13 سال لگے۔",
      },
      facts: {
        en: ["Iqbal died on 21 April 1938.", "The lapis lazuli tombstone is said to be a gift from the people of Afghanistan.", "A guard of honour stands at the tomb."],
        ur: ["علامہ اقبال 21 اپریل 1938 کو فوت ہوئے۔", "کہا جاتا ہے کہ لاجورد پتھر کی قبر کا تعویذ افغانستان کے لوگوں کا تحفہ ہے۔", "مزار پر اعزازی گارڈ کھڑا ہوتا ہے۔"],
      },
      look: {
        en: ["The guard of honour at the door.", "Iqbal's verses carved on the walls inside."],
        ur: ["دروازے پر اعزازی گارڈ۔", "اندر دیواروں پر لکھے اقبال کے اشعار۔"],
      },
      visit: {
        en: [["Entry", "Free."], ["Time", "10–15 minutes."], ["Where", "At the foot of the Badshahi Mosque steps."]],
        ur: [["داخلہ", "مفت۔"], ["وقت", "10 سے 15 منٹ۔"], ["کہاں", "بادشاہی مسجد کی سیڑھیوں کے پاس۔"]],
      },
    }),
    S({
      id: "ranjit-samadhi", area: "fort",
      name: { en: "Samadhi of Ranjit Singh", ur: "سمادھی رنجیت سنگھ" },
      era: { en: "Sikh · 1839–1848", ur: "سکھ دور · 1839 تا 1848" },
      line: { en: "Memorial of the Sikh ruler of Punjab, beside the Badshahi Mosque.", ur: "پنجاب کے سکھ حکمران کی یادگار، بادشاہی مسجد کے ساتھ۔" },
      story: {
        en: "Maharaja Ranjit Singh ruled Punjab from Lahore and died in 1839. His son Kharak Singh began this memorial on the spot where he was cremated; his youngest son, Duleep Singh, finished it in 1848. It mixes Sikh, Hindu and Islamic styles, and his ashes rest in a lotus-shaped marble urn.",
        ur: "مہاراجہ رنجیت سنگھ نے لاہور سے پنجاب پر حکومت کی اور 1839 میں فوت ہوئے۔ ان کے بیٹے کھڑک سنگھ نے اسی جگہ یہ یادگار بنوانا شروع کی جہاں ان کی آخری رسومات ہوئیں۔ سب سے چھوٹے بیٹے دلیپ سنگھ نے 1848 میں اسے مکمل کیا۔ اس میں سکھ، ہندو اور اسلامی طرز ملے ہوئے ہیں، اور ان کی راکھ کنول کی شکل کے سنگِ مرمر کے برتن میں ہے۔",
      },
      facts: {
        en: ["Ranjit Singh died on 27 June 1839.", "Next door is Gurdwara Dera Sahib, where Guru Arjan was martyred.", "The British annexed Punjab a year after it was finished, in 1849."],
        ur: ["رنجیت سنگھ 27 جون 1839 کو فوت ہوئے۔", "ساتھ ہی گوردوارہ ڈیرہ صاحب ہے، جہاں گرو ارجن کی شہادت ہوئی۔", "اس کے مکمل ہونے کے ایک سال بعد، 1849 میں، انگریزوں نے پنجاب پر قبضہ کر لیا۔"],
      },
      look: {
        en: ["The gilded, fluted domes — easy to see from Hazuri Bagh.", "How close it stands to the Badshahi Mosque and the Fort."],
        ur: ["سنہری دھاری دار گنبد — حضوری باغ سے صاف نظر آتے ہیں۔", "یہ بادشاہی مسجد اور قلعے کے کتنا قریب ہے۔"],
      },
      visit: {
        en: [["Entry", "Open to Sikh pilgrims. Others need permission from the Evacuee Trust Property Board."], ["See it from", "Hazuri Bagh and the Fort."], ["Time", "10 minutes from outside."]],
        ur: [["داخلہ", "سکھ یاتریوں کے لیے کھلا ہے۔ باقی لوگوں کو متروکہ وقف املاک بورڈ کی اجازت چاہیے۔"], ["کہاں سے دیکھیں", "حضوری باغ اور قلعے سے۔"], ["وقت", "باہر سے 10 منٹ۔"]],
      },
    }),

    /* ---------------- Shahdara ---------------- */
    S({
      id: "jahangir-tomb", area: "shahdara",
      name: { en: "Tomb of Jahangir", ur: "مقبرہ جہانگیر" },
      era: { en: "Mughal · 1627–1637", ur: "مغل دور · 1627 تا 1637" },
      line: { en: "An emperor's tomb across the Ravi — four tall minarets, no dome.", ur: "راوی پار بادشاہ کا مقبرہ — چار اونچے مینار، کوئی گنبد نہیں۔" },
      story: {
        en: "Emperor Jahangir loved Lahore and died in 1627. His son Shah Jahan built this tomb for him in a walled garden at Shahdara, across the River Ravi. It took about ten years. There is no dome — Jahangir is said to have wanted none. Four octagonal minarets rise about 30 metres, and the marble cenotaph is inlaid with coloured stone.",
        ur: "مغل بادشاہ جہانگیر کو لاہور بہت پسند تھا۔ وہ 1627 میں فوت ہوئے۔ ان کے بیٹے شاہجہان نے راوی کے پار شاہدرہ میں ایک باغ کے اندر یہ مقبرہ بنوایا، جس میں تقریباً دس سال لگے۔ اس پر گنبد نہیں — کہا جاتا ہے کہ جہانگیر گنبد نہیں چاہتے تھے۔ چار آٹھ کونوں والے مینار تقریباً 30 میٹر اونچے ہیں، اور سنگِ مرمر کی قبر پر رنگین پتھروں کا کام ہے۔",
      },
      facts: {
        en: ["You enter through the Akbari Sarai, a caravanserai built in 1637.", "Ranjit Singh's army took stone from here; some went to the Golden Temple in Amritsar.", "Since 1993 it has been on UNESCO's tentative World Heritage list."],
        ur: ["اندر جانے کا راستہ اکبری سرائے سے ہے، جو 1637 میں بنی۔", "رنجیت سنگھ کی فوج یہاں سے پتھر لے گئی، کچھ امرتسر کے گولڈن ٹیمپل میں لگا۔", "1993 سے یہ یونیسکو کی عالمی ورثے کی ابتدائی فہرست میں ہے۔"],
      },
      look: {
        en: ["The inlaid flowers on the red sandstone walls.", "The 99 names of Allah carved on the marble cenotaph."],
        ur: ["سرخ پتھر کی دیواروں پر جڑے ہوئے پھول۔", "سنگِ مرمر کی قبر پر کندہ اللہ کے 99 نام۔"],
      },
      visit: {
        en: [["Entry", "Ticketed. Check prices at the gate."], ["Getting there", "Shahdara, across the Ravi — about 20–30 minutes by car from the Walled City."], ["Combine with", "Asif Khan's and Nur Jahan's tombs next door."]],
        ur: [["داخلہ", "ٹکٹ لگتا ہے۔ قیمت دروازے پر پوچھیں۔"], ["کیسے جائیں", "راوی پار شاہدرہ — اندرونِ شہر سے گاڑی میں 20 سے 30 منٹ۔"], ["ساتھ دیکھیں", "ساتھ ہی آصف خان اور نور جہاں کے مقبرے۔"]],
      },
    }),
    S({
      id: "asif-khan-tomb", area: "shahdara",
      name: { en: "Tomb of Asif Khan", ur: "مقبرہ آصف خان" },
      era: { en: "Mughal · 1641–1645", ur: "مغل دور · 1641 تا 1645" },
      line: { en: "The tomb of the man whose daughter inspired the Taj Mahal.", ur: "اس شخص کا مقبرہ جس کی بیٹی کے لیے تاج محل بنا۔" },
      story: {
        en: "Asif Khan was Nur Jahan's brother and the father of Mumtaz Mahal — the empress for whom the Taj Mahal was built. When he died in 1641, Shah Jahan built him this octagonal tomb, finished in 1645, just west of Jahangir's. Its walls were once covered in glazed tiles and marble; most were stripped in the Sikh period.",
        ur: "آصف خان نور جہاں کے بھائی اور ممتاز محل کے والد تھے — وہی ملکہ جن کے لیے تاج محل بنا۔ 1641 میں ان کی وفات پر شاہجہان نے یہ آٹھ کونوں والا مقبرہ بنوایا، جو 1645 میں مکمل ہوا۔ یہ جہانگیر کے مقبرے کے بالکل مغرب میں ہے۔ اس کی دیواروں پر کبھی رنگین ٹائلیں اور سنگِ مرمر تھا، جو زیادہ تر سکھ دور میں اتار لیا گیا۔",
      },
      facts: {
        en: ["The tomb is an octagon with a large bulbous dome.", "It shares the UNESCO tentative listing with Jahangir's tomb.", "You reach it through the Akbari Sarai."],
        ur: ["مقبرہ آٹھ کونوں والا ہے، اوپر بڑا گول گنبد ہے۔", "یہ بھی جہانگیر کے مقبرے کے ساتھ یونیسکو کی فہرست میں ہے۔", "یہاں اکبری سرائے سے ہو کر جاتے ہیں۔"],
      },
      look: {
        en: ["Patches of surviving tile work on the outer walls.", "Look back east: Jahangir's minarets over the trees."],
        ur: ["باہر کی دیواروں پر بچی ہوئی ٹائلیں۔", "مشرق کی طرف دیکھیں: درختوں کے اوپر جہانگیر کے مینار۔"],
      },
      visit: {
        en: [["Entry", "Same complex as Jahangir's tomb."], ["Time", "20–30 minutes."], ["Tip", "Go in the morning; there is little shade."]],
        ur: [["داخلہ", "جہانگیر کے مقبرے والا ہی احاطہ۔"], ["وقت", "20 سے 30 منٹ۔"], ["مشورہ", "صبح جائیں، سایہ کم ہے۔"]],
      },
    }),
    S({
      id: "nur-jahan-tomb", area: "shahdara",
      name: { en: "Tomb of Nur Jahan", ur: "مقبرہ نور جہاں" },
      era: { en: "Mughal · 17th century", ur: "مغل دور · سترھویں صدی" },
      line: { en: "A powerful empress, buried near the husband she outlived.", ur: "طاقتور ملکہ، جو شوہر کے بعد بھی زندہ رہیں اور ان کے قریب دفن ہوئیں۔" },
      story: {
        en: "Nur Jahan was Jahangir's empress and one of the most powerful women of the Mughal age — coins were even struck in her name. She outlived him by 18 years and was buried near him at Shahdara. Her epitaph asks for no lamp and no rose on her grave. In the Sikh period the marble was stripped, and a British-era railway line now separates her tomb from her brother Asif Khan's.",
        ur: "نور جہاں جہانگیر کی ملکہ اور مغل دور کی سب سے طاقتور عورتوں میں سے تھیں — ان کے نام کے سکے بھی بنے۔ وہ جہانگیر کے بعد 18 سال زندہ رہیں اور شاہدرہ میں ان کے قریب دفن ہوئیں۔ ان کی قبر پر لکھا ہے کہ یہاں نہ چراغ جلے نہ پھول رکھا جائے۔ سکھ دور میں اس کا سنگِ مرمر اتار لیا گیا، اور انگریز دور کی ریلوے لائن آج اسے بھائی آصف خان کے مقبرے سے الگ کرتی ہے۔",
      },
      facts: {
        en: ["Coins were struck in Nur Jahan's name — rare for a Mughal empress.", "The tomb took four years to build.", "Her marble sarcophagus was replaced in 1912."],
        ur: ["نور جہاں کے نام کے سکے بنے — مغل ملکہ کے لیے یہ بہت کم ہوا۔", "مقبرہ چار سال میں بنا۔", "ان کی سنگِ مرمر کی قبر 1912 میں دوبارہ بنائی گئی۔"],
      },
      look: {
        en: ["The railway line between her tomb and Asif Khan's.", "The plain brick where marble once was."],
        ur: ["ان کے مقبرے اور آصف خان کے مقبرے کے بیچ ریلوے لائن۔", "سادہ اینٹیں، جہاں کبھی سنگِ مرمر تھا۔"],
      },
      visit: {
        en: [["Entry", "Small separate site, a short walk from Jahangir's tomb."], ["Time", "15–20 minutes."], ["Tip", "Ask locally for the path across the railway."]],
        ur: [["داخلہ", "الگ چھوٹی جگہ، جہانگیر کے مقبرے سے تھوڑا پیدل۔"], ["وقت", "15 سے 20 منٹ۔"], ["مشورہ", "ریلوے لائن پار کرنے کا راستہ مقامی لوگوں سے پوچھ لیں۔"]],
      },
    }),

    /* ---------------- British-era Lahore ---------------- */
    S({
      id: "anarkali-tomb", area: "british",
      name: { en: "Tomb of Anarkali", ur: "مقبرہ انارکلی" },
      era: { en: "Mughal · c. 1599–1615", ur: "مغل دور · تقریباً 1599 تا 1615" },
      line: { en: "A Mughal tomb wrapped in Lahore's most famous love legend.", ur: "لاہور کی سب سے مشہور محبت کی داستان والا مغل مقبرہ۔" },
      story: {
        en: "Legend says Anarkali was a court dancer whom Emperor Akbar had walled up alive for loving Prince Salim, the future Jahangir. Historians aren't sure she existed. What is certain is this octagonal Mughal tomb, dated to 1599 or 1615. The British used it as offices, then as a church from 1851; since 1891 it has held records, and today it is the Punjab Archives.",
        ur: "کہانی ہے کہ انارکلی دربار کی رقاصہ تھی، جسے شہنشاہ اکبر نے شہزادہ سلیم (بعد میں جہانگیر) سے محبت کی سزا میں دیوار میں چنوا دیا۔ مؤرخین کو یقین نہیں کہ وہ واقعی تھی۔ لیکن یہ آٹھ کونوں والا مغل مقبرہ ضرور ہے، جو 1599 یا 1615 کا ہے۔ انگریزوں نے اسے دفتر بنایا، پھر 1851 سے گرجا گھر۔ 1891 سے یہاں سرکاری ریکارڈ رکھا جاتا ہے، اور آج یہ پنجاب آرکائیوز ہے۔",
      },
      facts: {
        en: ["Anarkali Bazaar takes its name from this tomb.", "From 1851 it was St James' Church.", "It stands inside the Punjab Civil Secretariat."],
        ur: ["انارکلی بازار کا نام اسی مقبرے سے ہے۔", "1851 سے یہ سینٹ جیمز چرچ رہا۔", "یہ پنجاب سول سیکریٹریٹ کے اندر ہے۔"],
      },
      look: {
        en: ["The octagonal shape with corner towers.", "The marble cenotaph, moved to where the church altar once stood."],
        ur: ["آٹھ کونے، اور کونوں پر برج۔", "سنگِ مرمر کی قبر، جو گرجا گھر کی قربان گاہ والی جگہ پر رکھی گئی۔"],
      },
      visit: {
        en: [["Entry", "Inside a government office — access is limited."], ["Tip", "Carry ID and ask at the Civil Secretariat gate."], ["Nearby", "Anarkali Bazaar and the Lahore Museum."]],
        ur: [["داخلہ", "سرکاری دفتر کے اندر ہے — جانا محدود ہے۔"], ["مشورہ", "شناختی کارڈ ساتھ رکھیں، سیکریٹریٹ کے دروازے پر پوچھیں۔"], ["قریب", "انارکلی بازار اور لاہور عجائب گھر۔"]],
      },
    }),
    S({
      id: "lahore-museum", area: "british",
      name: { en: "Lahore Museum & Zamzama", ur: "لاہور عجائب گھر اور زمزمہ توپ" },
      era: { en: "British era · 1894", ur: "انگریز دور · 1894" },
      line: { en: "The Fasting Buddha inside, Kipling's famous cannon outside.", ur: "اندر روزہ دار بدھا، باہر کپلنگ والی مشہور توپ۔" },
      story: {
        en: "Founded in 1865, the museum moved into this red-brick building on The Mall in 1894. It was designed by Bhai Ram Singh with John Lockwood Kipling, one of its first curators and the father of the writer Rudyard Kipling. Its best-known treasure is the Fasting Buddha from Gandhara. Outside stands the Zamzama gun — the cannon on which Kipling's novel Kim opens.",
        ur: "یہ عجائب گھر 1865 میں بنا اور 1894 میں مال روڈ پر اس سرخ اینٹوں والی عمارت میں آیا۔ اس کا نقشہ بھائی رام سنگھ اور جان لاک وڈ کپلنگ نے بنایا — کپلنگ اس کے پہلے نگرانوں میں تھے اور مشہور ادیب رڈیارڈ کپلنگ کے والد تھے۔ یہاں کا سب سے مشہور خزانہ گندھارا دور کا روزہ دار بدھا ہے۔ باہر زمزمہ توپ کھڑی ہے، جس سے کپلنگ کا ناول “کِم” شروع ہوتا ہے۔",
      },
      facts: {
        en: ["The foundation stone was laid in 1890.", "Construction was overseen by Ganga Ram, who also built much of colonial Lahore.", "Zamzama was cast in Lahore in 1757."],
        ur: ["سنگِ بنیاد 1890 میں رکھا گیا۔", "تعمیر کی نگرانی گنگا رام نے کی، جنہوں نے لاہور کی بہت سی عمارتیں بنائیں۔", "زمزمہ توپ 1757 میں لاہور میں ڈھالی گئی۔"],
      },
      look: {
        en: ["The Fasting Buddha in the Gandhara gallery.", "Zamzama on its platform in front of the museum."],
        ur: ["گندھارا گیلری میں روزہ دار بدھا۔", "عجائب گھر کے سامنے چبوترے پر زمزمہ توپ۔"],
      },
      visit: {
        en: [["Entry", "Ticketed; foreign visitors pay more. Check current prices."], ["Time", "1.5–2 hours."], ["Tip", "Check opening days before you go — hours change."]],
        ur: [["داخلہ", "ٹکٹ لگتا ہے، غیر ملکیوں کا زیادہ۔ موجودہ قیمت دیکھ لیں۔"], ["وقت", "ڈیڑھ سے دو گھنٹے۔"], ["مشورہ", "جانے سے پہلے کھلنے کے دن دیکھ لیں — اوقات بدلتے ہیں۔"]],
      },
    }),
    S({
      id: "gcu", area: "british",
      name: { en: "Government College University", ur: "گورنمنٹ کالج یونیورسٹی" },
      era: { en: "British era · 1877", ur: "انگریز دور · 1877" },
      line: { en: "A Gothic clock tower where Iqbal and two Nobel winners studied.", ur: "گوتھک گھنٹہ گھر، جہاں اقبال اور دو نوبل انعام یافتہ پڑھے۔" },
      story: {
        en: "Government College was founded in 1864 and moved into this neo-Gothic building, with its tall clock tower, in 1877. Allama Iqbal studied and taught here, and Faiz Ahmad Faiz studied here. Two Nobel laureates are alumni: Abdus Salam (Physics, 1979) and Har Gobind Khorana (Medicine, 1968). It became a university in 2002.",
        ur: "گورنمنٹ کالج 1864 میں بنا اور 1877 میں اونچے گھنٹہ گھر والی اس گوتھک عمارت میں آیا۔ علامہ اقبال یہاں پڑھے بھی اور پڑھایا بھی، اور فیض احمد فیض بھی یہیں پڑھے۔ دو نوبل انعام یافتہ یہاں کے طالب علم تھے: ڈاکٹر عبدالسلام (فزکس، 1979) اور ہرگوبند کھورانہ (طب، 1968)۔ 2002 میں یہ یونیورسٹی بنا۔",
      },
      facts: {
        en: ["The clock tower is about 176 feet (54 m) tall.", "The main building was designed by W. Purdon.", "Several prime ministers of Pakistan studied here."],
        ur: ["گھنٹہ گھر تقریباً 176 فٹ اونچا ہے۔", "مرکزی عمارت کا نقشہ ڈبلیو پرڈن نے بنایا۔", "پاکستان کے کئی وزرائے اعظم یہاں پڑھے۔"],
      },
      look: {
        en: ["The clock tower from the main gate.", "The pointed Gothic arches along the verandahs."],
        ur: ["مین گیٹ سے گھنٹہ گھر۔", "برآمدوں میں نوکیلی گوتھک محرابیں۔"],
      },
      visit: {
        en: [["Entry", "A working campus — see it from the gate; inside with permission."], ["Where", "Lower Mall, near Anarkali."], ["Time", "10–15 minutes from outside."]],
        ur: [["داخلہ", "چلتی ہوئی یونیورسٹی — گیٹ سے دیکھیں، اندر اجازت سے۔"], ["کہاں", "لوئر مال، انارکلی کے قریب۔"], ["وقت", "باہر سے 10 سے 15 منٹ۔"]],
      },
    }),
    S({
      id: "quaid-library", area: "british",
      name: { en: "Quaid-e-Azam Library", ur: "قائداعظم لائبریری" },
      era: { en: "British era · 1866", ur: "انگریز دور · 1866" },
      line: { en: "A Victorian club turned public library, in Bagh-e-Jinnah.", ur: "انگریز دور کا کلب، جو اب باغِ جناح میں عوامی لائبریری ہے۔" },
      story: {
        en: "In the middle of Bagh-e-Jinnah — once Lawrence Gardens — stand two halls finished in 1866: Lawrence Hall and Montgomery Hall. For about a century they were a club, from 1906 the Lahore Gymkhana. In 1984 they reopened as the Quaid-e-Azam Library, one of Lahore's best-loved reading rooms.",
        ur: "باغِ جناح کے بیچ — جو کبھی لارنس گارڈن کہلاتا تھا — دو ہال ہیں جو 1866 میں بنے: لارنس ہال اور منٹگمری ہال۔ تقریباً سو سال یہ ایک کلب رہا، 1906 سے لاہور جمخانہ۔ 1984 میں یہ قائداعظم لائبریری بنی، جو لاہور کی سب سے پسندیدہ لائبریریوں میں سے ہے۔",
      },
      facts: {
        en: ["The library opened on 25 December 1984.", "It holds well over 100,000 books.", "Bagh-e-Jinnah was laid out as Lawrence Gardens in the 1860s."],
        ur: ["لائبریری 25 دسمبر 1984 کو کھلی۔", "یہاں ایک لاکھ سے زیادہ کتابیں ہیں۔", "باغِ جناح 1860 کی دہائی میں لارنس گارڈن کے نام سے بنا۔"],
      },
      look: {
        en: ["The white columned front facing the garden.", "Old trees around it — some planted when the garden was laid out."],
        ur: ["باغ کی طرف سفید ستونوں والا سامنے کا حصہ۔", "آس پاس کے پرانے درخت — کچھ باغ بننے کے وقت لگے۔"],
      },
      visit: {
        en: [["Entry", "The garden is free. Using the library needs membership."], ["Where", "Bagh-e-Jinnah, off The Mall."], ["Best time", "Morning or late afternoon walk."]],
        ur: [["داخلہ", "باغ مفت ہے۔ لائبریری استعمال کرنے کے لیے رکنیت چاہیے۔"], ["کہاں", "باغِ جناح، مال روڈ کے پاس۔"], ["کب جائیں", "صبح یا شام کی سیر کے وقت۔"]],
      },
    }),
    S({
      id: "railway-station", area: "british",
      name: { en: "Lahore Railway Station", ur: "لاہور ریلوے اسٹیشن" },
      era: { en: "British era · 1859–1860", ur: "انگریز دور · 1859 تا 1860" },
      line: { en: "A railway station built to double as a fort.", ur: "ریلوے اسٹیشن، جو قلعے کے طور پر بھی بنایا گیا۔" },
      story: {
        en: "Lahore's main station was built in 1859–60, just after the uprising of 1857. The British designed it to double as a fort: thick walls, turrets, and slits for guns and cannon, so troops and civilians could shelter here if fighting broke out again. More than 160 years later it is still the city's main station.",
        ur: "لاہور کا مرکزی اسٹیشن 1859 سے 1860 میں بنا، 1857 کی جنگِ آزادی کے فوراً بعد۔ انگریزوں نے اسے قلعے کی طرح بنایا: موٹی دیواریں، برج، اور بندوقوں اور توپوں کے لیے سوراخ — تاکہ لڑائی ہو تو فوجی اور شہری یہاں پناہ لے سکیں۔ 160 سال سے زیادہ گزرنے کے بعد بھی یہ شہر کا مرکزی اسٹیشن ہے۔",
      },
      facts: {
        en: ["Its builder is credited as Mian Mohammad Sultan.", "In 1928 Lala Lajpat Rai was beaten by police near here during a protest; he died weeks later.", "In 1947 it saw terrible violence during Partition."],
        ur: ["اس کی تعمیر کا سہرا میاں محمد سلطان کو دیا جاتا ہے۔", "1928 میں یہاں قریب ایک احتجاج میں پولیس نے لالہ لاجپت رائے کو مارا، اور چند ہفتے بعد وہ فوت ہو گئے۔", "1947 میں تقسیم کے وقت یہاں بہت خون خرابہ ہوا۔"],
      },
      look: {
        en: ["The castle-like towers on the front.", "The narrow slits in the walls, made for guns."],
        ur: ["سامنے قلعے جیسے برج۔", "دیواروں میں تنگ سوراخ، جو بندوقوں کے لیے بنے۔"],
      },
      visit: {
        en: [["Entry", "Free to see from outside; a platform ticket lets you in."], ["Time", "15–20 minutes."], ["Tip", "Busy at all hours — keep your bag close."]],
        ur: [["داخلہ", "باہر سے دیکھنا مفت ہے؛ پلیٹ فارم ٹکٹ لے کر اندر جا سکتے ہیں۔"], ["وقت", "15 سے 20 منٹ۔"], ["مشورہ", "ہر وقت رش ہوتا ہے — بیگ کا خیال رکھیں۔"]],
      },
    }),

    /* ---------------- Gardens & gateways ---------------- */
    S({
      id: "gulabi-bagh", area: "gardens",
      name: { en: "Gulabi Bagh Gateway", ur: "گلابی باغ دروازہ" },
      era: { en: "Mughal · 1655", ur: "مغل دور · 1655" },
      line: { en: "A tiled Mughal gateway near Shalimar, with a royal nurse's tomb behind.", ur: "شالامار کے قریب ٹائلوں والا مغل دروازہ، پیچھے شاہی دائی کا مقبرہ۔" },
      story: {
        en: "Gulabi Bagh means “rose garden”. A Persian noble, Mirza Sultan Baig, built this tiled gateway in 1655 for his pleasure garden. In 1671 the garden became the resting place of Dai Anga, Emperor Shah Jahan's wet nurse, and her tomb still stands behind the gate. Patches of the original kashi kari tile work survive.",
        ur: "گلابی باغ کا مطلب ہے “گلاب کا باغ”۔ ایرانی امیر مرزا سلطان بیگ نے 1655 میں اپنے باغ کے لیے یہ ٹائلوں والا دروازہ بنوایا۔ 1671 میں یہ باغ شاہجہان کی دائی، دائی انگہ کی آخری آرام گاہ بنا، اور ان کا مقبرہ آج بھی دروازے کے پیچھے ہے۔ اصل کاشی کاری کے کچھ حصے ابھی بھی باقی ہیں۔",
      },
      facts: {
        en: ["Dai Anga was the wet nurse of Emperor Shah Jahan.", "Her tomb was completed in 1671.", "In 2016 the Lahore High Court stopped metro work within 200 feet of it and other heritage sites."],
        ur: ["دائی انگہ شاہجہان کی دائی تھیں۔", "ان کا مقبرہ 1671 میں مکمل ہوا۔", "2016 میں لاہور ہائی کورٹ نے اس اور دوسری تاریخی جگہوں کے 200 فٹ کے اندر میٹرو کا کام روک دیا۔"],
      },
      look: {
        en: ["The surviving tile work on the gate's corner towers.", "Dai Anga's tomb through the arch."],
        ur: ["دروازے کے کونوں والے برجوں پر بچی ہوئی ٹائلیں۔", "محراب میں سے دائی انگہ کا مقبرہ۔"],
      },
      visit: {
        en: [["Entry", "Free."], ["Where", "GT Road, Baghbanpura — close to Shalimar Gardens."], ["Combine with", "Shalimar Gardens, a few minutes away."]],
        ur: [["داخلہ", "مفت۔"], ["کہاں", "جی ٹی روڈ، باغبانپورہ — شالامار باغ کے قریب۔"], ["ساتھ دیکھیں", "شالامار باغ، چند منٹ کے فاصلے پر۔"]],
      },
    }),
    S({
      id: "chauburji", area: "gardens",
      name: { en: "Chauburji", ur: "چوبرجی" },
      era: { en: "Mughal · 1646", ur: "مغل دور · 1646" },
      line: { en: "A four-towered Mughal gateway to a garden that disappeared.", ur: "چار برجوں والا مغل دروازہ، جس کا باغ ختم ہو گیا۔" },
      story: {
        en: "Chauburji means “four towers”. This tiled gateway, dated 1646, once led into a large Mughal garden. Its inscription names “Sahib-e-Zebinda Begam-e-Dauran” — often read as Princess Zeb-un-Nisa, though she was only about eight then, so it may mean her aunt Jahanara. The garden is long gone, and one minaret fell in an earthquake in 1846.",
        ur: "چوبرجی کا مطلب ہے “چار برج”۔ یہ ٹائلوں والا دروازہ 1646 کا ہے اور کبھی ایک بڑے مغل باغ میں کھلتا تھا۔ اس پر لکھا ہے “صاحبِ زیبندہ بیگمِ دوراں” — عام طور پر اسے شہزادی زیب النساء سمجھا جاتا ہے، لیکن وہ اس وقت صرف آٹھ سال کی تھیں، اس لیے شاید اس سے مراد ان کی پھوپھی جہاں آرا ہوں۔ باغ کب کا ختم ہو چکا، اور ایک مینار 1846 کے زلزلے میں گر گیا۔",
      },
      facts: {
        en: ["The garden was probably destroyed by Ravi floods.", "Its north-western minaret collapsed in the 1846 earthquake.", "It was restored in the late 1960s and again around 2019."],
        ur: ["باغ شاید راوی کے سیلاب میں ختم ہوا۔", "شمال مغربی مینار 1846 کے زلزلے میں گرا۔", "1960 کی دہائی کے آخر میں اور پھر تقریباً 2019 میں اس کی مرمت ہوئی۔"],
      },
      look: {
        en: ["The blue and green tile work on the arch.", "The calligraphy band over the arch."],
        ur: ["محراب پر نیلی اور سبز ٹائلیں۔", "محراب کے اوپر خطاطی کی پٹی۔"],
      },
      visit: {
        en: [["Entry", "Free — it stands on a roundabout."], ["Where", "Chauburji Chowk, Multan Road."], ["Time", "10 minutes."]],
        ur: [["داخلہ", "مفت — یہ چوک کے بیچ ہے۔"], ["کہاں", "چوبرجی چوک، ملتان روڈ۔"], ["وقت", "10 منٹ۔"]],
      },
    }),
  ];

  /* Area of the original six. */
  const AREA = { "badshahi-mosque": "fort", "lahore-fort": "fort", "minar-e-pakistan": "fort", "iqbal-park": "fort", "wazir-khan-mosque": "walled", "shalimar-gardens": "gardens" };
  LL.SITES.forEach((s) => { s.area = AREA[s.id]; s.top = true; });
  MORE.forEach((s) => LL.SITES.push(s));

  /* A sensible order (also the order of the virtual tour). */
  const ORDER = [
    "lahore-fort", "hazuri-bagh", "badshahi-mosque", "iqbal-tomb", "ranjit-samadhi", "iqbal-park", "minar-e-pakistan",
    "delhi-gate", "shahi-hammam", "wazir-khan-mosque", "sunehri-masjid", "nau-nihal-haveli", "data-darbar",
    "jahangir-tomb", "asif-khan-tomb", "nur-jahan-tomb",
    "anarkali-tomb", "lahore-museum", "gcu", "quaid-library", "railway-station",
    "shalimar-gardens", "gulabi-bagh", "chauburji",
  ];
  LL.SITES.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  /* Quick facts. */
  const q = (time, entry, best) => [["time", time], ["entry", entry], ["best", best]];
  Object.assign(LL.QUICK || (LL.QUICK = {}), {
    "delhi-gate": q({ en: "15 min", ur: "15 منٹ" }, { en: "Free", ur: "مفت" }, { en: "Morning", ur: "صبح" }),
    "shahi-hammam": q({ en: "30–45 min", ur: "30 سے 45 منٹ" }, { en: "Ticketed", ur: "ٹکٹ" }, { en: "Morning", ur: "صبح" }),
    "sunehri-masjid": q({ en: "20 min", ur: "20 منٹ" }, { en: "Free", ur: "مفت" }, { en: "Morning, not at prayer time", ur: "صبح، نماز کے وقت نہیں" }),
    "nau-nihal-haveli": q({ en: "10 min (outside)", ur: "10 منٹ (باہر سے)" }, { en: "Outside only", ur: "صرف باہر سے" }, { en: "Weekend, when school is closed", ur: "چھٹی کے دن" }),
    "data-darbar": q({ en: "30–45 min", ur: "30 سے 45 منٹ" }, { en: "Free · open 24 h", ur: "مفت · ہر وقت کھلا" }, { en: "Morning is calmer", ur: "صبح رش کم ہوتا ہے" }),
    "hazuri-bagh": q({ en: "15–20 min", ur: "15 سے 20 منٹ" }, { en: "Free", ur: "مفت" }, { en: "With the Fort visit", ur: "قلعے کے ساتھ" }),
    "iqbal-tomb": q({ en: "10–15 min", ur: "10 سے 15 منٹ" }, { en: "Free", ur: "مفت" }, { en: "With Badshahi Mosque", ur: "بادشاہی مسجد کے ساتھ" }),
    "ranjit-samadhi": q({ en: "10 min (outside)", ur: "10 منٹ (باہر سے)" }, { en: "Permission needed", ur: "اجازت چاہیے" }, { en: "View from Hazuri Bagh", ur: "حضوری باغ سے دیکھیں" }),
    "jahangir-tomb": q({ en: "1–1.5 hours", ur: "ایک سے ڈیڑھ گھنٹہ" }, { en: "Ticketed", ur: "ٹکٹ" }, { en: "Morning", ur: "صبح" }),
    "asif-khan-tomb": q({ en: "20–30 min", ur: "20 سے 30 منٹ" }, { en: "With Jahangir's tomb", ur: "جہانگیر کے مقبرے کے ساتھ" }, { en: "Morning", ur: "صبح" }),
    "nur-jahan-tomb": q({ en: "15–20 min", ur: "15 سے 20 منٹ" }, { en: "Small site", ur: "چھوٹی جگہ" }, { en: "Morning", ur: "صبح" }),
    "anarkali-tomb": q({ en: "15 min", ur: "15 منٹ" }, { en: "Limited access", ur: "محدود داخلہ" }, { en: "Weekday office hours", ur: "دفتری اوقات" }),
    "lahore-museum": q({ en: "1.5–2 hours", ur: "ڈیڑھ سے دو گھنٹے" }, { en: "Ticketed", ur: "ٹکٹ" }, { en: "Late morning", ur: "دن چڑھے" }),
    "gcu": q({ en: "10–15 min", ur: "10 سے 15 منٹ" }, { en: "Outside only", ur: "صرف باہر سے" }, { en: "Any time", ur: "کسی بھی وقت" }),
    "quaid-library": q({ en: "30 min", ur: "30 منٹ" }, { en: "Garden free", ur: "باغ مفت" }, { en: "Morning or evening walk", ur: "صبح یا شام کی سیر" }),
    "railway-station": q({ en: "15–20 min", ur: "15 سے 20 منٹ" }, { en: "Free outside", ur: "باہر سے مفت" }, { en: "Daytime", ur: "دن میں" }),
    "gulabi-bagh": q({ en: "15 min", ur: "15 منٹ" }, { en: "Free", ur: "مفت" }, { en: "With Shalimar", ur: "شالامار کے ساتھ" }),
    "chauburji": q({ en: "10 min", ur: "10 منٹ" }, { en: "Free", ur: "مفت" }, { en: "Morning, less traffic", ur: "صبح، ٹریفک کم" }),
  });

  /* Quiz: three questions per place (the place-page check uses them). */
  const Q = (s, en, ur, aEn, aUr, c = 0) => ({ s, q: { en, ur }, a: { en: aEn, ur: aUr }, c });
  LL.QUIZ.push(
    Q("delhi-gate", "Why is it called Delhi Gate?", "اسے دہلی دروازہ کیوں کہتے ہیں؟", ["It faces the road to Delhi", "A Delhi king built it", "It was moved from Delhi", "It opened in Delhi's honour"], ["یہ دہلی کے راستے کی طرف ہے", "دہلی کے بادشاہ نے بنایا", "یہ دہلی سے لایا گیا", "دہلی کے اعزاز میں کھولا گیا"]),
    Q("delhi-gate", "Which old road starts at Delhi Gate?", "دہلی دروازے سے کون سا پرانا راستہ شروع ہوتا ہے؟", ["The Shahi Guzargah (royal road)", "The Mall", "Canal Road", "Multan Road"], ["شاہی گزرگاہ", "مال روڈ", "کینال روڈ", "ملتان روڈ"]),
    Q("delhi-gate", "How many gates did old Lahore have?", "پرانے لاہور کے کتنے دروازے تھے؟", ["13", "4", "7", "21"], ["13", "4", "7", "21"]),
    Q("shahi-hammam", "When was the Shahi Hammam built?", "شاہی حمام کب بنا؟", ["1635", "1673", "1566", "1753"], ["1635", "1673", "1566", "1753"]),
    Q("shahi-hammam", "Who built the Shahi Hammam?", "شاہی حمام کس نے بنوایا؟", ["Wazir Khan", "Aurangzeb", "Ranjit Singh", "Akbar"], ["وزیر خان", "اورنگزیب", "رنجیت سنگھ", "اکبر"]),
    Q("shahi-hammam", "What did the hammam's income pay for?", "حمام کی آمدنی کس کام آتی تھی؟", ["The Wazir Khan Mosque", "The Fort's army", "The emperor's palace", "A school"], ["مسجد وزیر خان", "قلعے کی فوج", "بادشاہ کا محل", "ایک اسکول"]),
    Q("sunehri-masjid", "Why is it called the Sunehri (Golden) Masjid?", "اسے سنہری مسجد کیوں کہتے ہیں؟", ["Its gilded domes", "Gold coins under the floor", "It was built by a goldsmith", "Its golden carpets"], ["اس کے سنہرے گنبد", "فرش کے نیچے سونے کے سکے", "سنار نے بنوائی", "سنہری قالین"]),
    Q("sunehri-masjid", "When was Sunehri Masjid built?", "سنہری مسجد کب بنی؟", ["1753", "1635", "1673", "1877"], ["1753", "1635", "1673", "1877"]),
    Q("sunehri-masjid", "What is under the mosque?", "مسجد کے نیچے کیا ہے؟", ["Shops", "A river", "A tomb", "A bath house"], ["دکانیں", "دریا", "مقبرہ", "حمام"]),
    Q("nau-nihal-haveli", "Who was the haveli built for?", "یہ حویلی کس کے لیے بنی؟", ["Ranjit Singh's grandson", "A Mughal princess", "A British governor", "A rich merchant"], ["رنجیت سنگھ کے پوتے", "ایک مغل شہزادی", "انگریز گورنر", "ایک امیر سوداگر"]),
    Q("nau-nihal-haveli", "What is the haveli used as today?", "آج یہ حویلی کس کام آتی ہے؟", ["A girls' school", "A hotel", "A museum café", "A police station"], ["لڑکیوں کا اسکول", "ہوٹل", "کیفے", "تھانہ"]),
    Q("nau-nihal-haveli", "How many storeys does the haveli have?", "حویلی کی کتنی منزلیں ہیں؟", ["Four", "Two", "Seven", "One"], ["چار", "دو", "سات", "ایک"]),
    Q("data-darbar", "What is Data Ganj Bakhsh's real name?", "داتا گنج بخشؒ کا اصل نام کیا ہے؟", ["Ali Hujwiri", "Baba Farid", "Mian Mir", "Shah Jamal"], ["علی ہجویری", "بابا فرید", "میاں میر", "شاہ جمال"]),
    Q("data-darbar", "Which famous book did he write?", "انہوں نے کون سی مشہور کتاب لکھی؟", ["Kashf al-Mahjub", "Bang-e-Dra", "Heer Ranjha", "Tuzk-e-Jahangiri"], ["کشف المحجوب", "بانگِ درا", "ہیر رانجھا", "تزکِ جہانگیری"]),
    Q("data-darbar", "Where did he come to Lahore from?", "وہ لاہور کہاں سے آئے؟", ["Ghazni", "Delhi", "Baghdad", "Multan"], ["غزنی", "دہلی", "بغداد", "ملتان"]),
    Q("hazuri-bagh", "What did the Hazuri Bagh baradari celebrate?", "حضوری باغ کی بارہ دری کس خوشی میں بنی؟", ["Capturing the Koh-i-Noor", "A royal wedding", "A war victory over the British", "A new canal"], ["کوہِ نور ملنے کی", "شاہی شادی کی", "انگریزوں پر فتح کی", "نئی نہر کی"]),
    Q("hazuri-bagh", "When did the baradari's top storey collapse?", "بارہ دری کی اوپر والی منزل کب گری؟", ["1932", "1818", "1947", "1857"], ["1932", "1818", "1947", "1857"]),
    Q("hazuri-bagh", "Who laid out the Hazuri Bagh?", "حضوری باغ کس نے بنوایا؟", ["Ranjit Singh", "Shah Jahan", "Akbar", "The British"], ["رنجیت سنگھ", "شاہجہان", "اکبر", "انگریزوں نے"]),
    Q("iqbal-tomb", "In which year did Allama Iqbal die?", "علامہ اقبال کس سال فوت ہوئے؟", ["1938", "1947", "1930", "1951"], ["1938", "1947", "1930", "1951"]),
    Q("iqbal-tomb", "Where did the tomb's architect come from?", "مزار کا نقشہ بنانے والے کہاں سے تھے؟", ["Hyderabad Deccan", "Kabul", "London", "Tehran"], ["حیدرآباد دکن", "کابل", "لندن", "تہران"]),
    Q("iqbal-tomb", "Iqbal's tomb stands beside which building?", "مزارِ اقبال کس عمارت کے ساتھ ہے؟", ["Badshahi Mosque", "Wazir Khan Mosque", "Minar-e-Pakistan", "Lahore Museum"], ["بادشاہی مسجد", "مسجد وزیر خان", "مینارِ پاکستان", "لاہور عجائب گھر"]),
    Q("ranjit-samadhi", "Who finished the Samadhi in 1848?", "سمادھی 1848 میں کس نے مکمل کی؟", ["Duleep Singh", "Kharak Singh", "Nau Nihal Singh", "The British"], ["دلیپ سنگھ", "کھڑک سنگھ", "نونہال سنگھ", "انگریزوں نے"]),
    Q("ranjit-samadhi", "In which year did Ranjit Singh die?", "رنجیت سنگھ کس سال فوت ہوئے؟", ["1839", "1799", "1849", "1857"], ["1839", "1799", "1849", "1857"]),
    Q("ranjit-samadhi", "Which gurdwara is right next to the Samadhi?", "سمادھی کے ساتھ کون سا گوردوارہ ہے؟", ["Gurdwara Dera Sahib", "Nankana Sahib", "Panja Sahib", "Kartarpur"], ["گوردوارہ ڈیرہ صاحب", "ننکانہ صاحب", "پنجہ صاحب", "کرتارپور"]),
    Q("jahangir-tomb", "Who built Jahangir's tomb?", "جہانگیر کا مقبرہ کس نے بنوایا؟", ["Shah Jahan", "Akbar", "Aurangzeb", "Nur Jahan alone"], ["شاہجہان", "اکبر", "اورنگزیب", "اکیلے نور جہاں"]),
    Q("jahangir-tomb", "What does Jahangir's tomb NOT have?", "جہانگیر کے مقبرے میں کیا نہیں ہے؟", ["A central dome", "Minarets", "A garden", "A cenotaph"], ["بیچ میں گنبد", "مینار", "باغ", "قبر کا تعویذ"]),
    Q("jahangir-tomb", "Which river do you cross to reach it?", "وہاں جانے کے لیے کون سا دریا پار کرتے ہیں؟", ["Ravi", "Chenab", "Jhelum", "Sutlej"], ["راوی", "چناب", "جہلم", "ستلج"]),
    Q("asif-khan-tomb", "Who was Asif Khan's daughter?", "آصف خان کی بیٹی کون تھیں؟", ["Mumtaz Mahal", "Nur Jahan", "Jahanara", "Anarkali"], ["ممتاز محل", "نور جہاں", "جہاں آرا", "انارکلی"]),
    Q("asif-khan-tomb", "What shape is Asif Khan's tomb?", "آصف خان کا مقبرہ کس شکل کا ہے؟", ["Octagon", "Square", "Circle", "Triangle"], ["آٹھ کونوں والا", "چوکور", "گول", "تکون"]),
    Q("asif-khan-tomb", "Asif Khan was the brother of…", "آصف خان کس کے بھائی تھے؟", ["Nur Jahan", "Shah Jahan", "Akbar", "Dai Anga"], ["نور جہاں", "شاہجہان", "اکبر", "دائی انگہ"]),
    Q("nur-jahan-tomb", "Nur Jahan was the empress of…", "نور جہاں کس کی ملکہ تھیں؟", ["Jahangir", "Akbar", "Shah Jahan", "Aurangzeb"], ["جہانگیر", "اکبر", "شاہجہان", "اورنگزیب"]),
    Q("nur-jahan-tomb", "What separates her tomb from Asif Khan's?", "ان کے مقبرے کو آصف خان کے مقبرے سے کیا الگ کرتا ہے؟", ["A railway line", "The river", "A canal", "A motorway"], ["ریلوے لائن", "دریا", "نہر", "موٹر وے"]),
    Q("nur-jahan-tomb", "Her epitaph asks for no lamp and no…", "ان کی قبر پر لکھا ہے: نہ چراغ، نہ…", ["Rose", "Prayer", "Visitor", "Name"], ["پھول", "دعا", "مہمان", "نام"]),
    Q("anarkali-tomb", "In the legend, Anarkali loved which prince?", "کہانی میں انارکلی کو کس شہزادے سے محبت تھی؟", ["Prince Salim", "Prince Khurram", "Prince Dara", "Prince Murad"], ["شہزادہ سلیم", "شہزادہ خرم", "شہزادہ دارا", "شہزادہ مراد"]),
    Q("anarkali-tomb", "What is the tomb used as today?", "آج یہ مقبرہ کس کام آتا ہے؟", ["Punjab Archives", "A mosque", "A restaurant", "A school"], ["پنجاب آرکائیوز", "مسجد", "ریسٹورنٹ", "اسکول"]),
    Q("anarkali-tomb", "From 1851 the British used it as a…", "1851 سے انگریزوں نے اسے کیا بنایا؟", ["Church", "Jail", "Stable", "Bank"], ["گرجا گھر", "جیل", "اصطبل", "بینک"]),
    Q("lahore-museum", "Which famous sculpture is in the Lahore Museum?", "لاہور عجائب گھر کا سب سے مشہور مجسمہ کون سا ہے؟", ["The Fasting Buddha", "The Dancing Girl", "The Priest-King", "The Thinker"], ["روزہ دار بدھا", "رقاصہ", "پجاری بادشاہ", "سوچنے والا"]),
    Q("lahore-museum", "What is the cannon outside called?", "باہر والی توپ کا نام کیا ہے؟", ["Zamzama", "Malik-e-Maidan", "Dal Bhanjan", "Jaivana"], ["زمزمہ", "ملکِ میدان", "دل بھنجن", "جیوانہ"]),
    Q("lahore-museum", "Which novel opens beside that cannon?", "کون سا ناول اس توپ سے شروع ہوتا ہے؟", ["Kim", "Gulliver's Travels", "Jungle Book", "Train to Pakistan"], ["کِم", "گلیور کا سفر", "جنگل بک", "ٹرین ٹو پاکستان"]),
    Q("gcu", "When was Government College founded?", "گورنمنٹ کالج کب بنا؟", ["1864", "1947", "1912", "1820"], ["1864", "1947", "1912", "1820"]),
    Q("gcu", "Which Nobel physicist studied at GC Lahore?", "کون سے نوبل انعام یافتہ سائنسدان یہاں پڑھے؟", ["Abdus Salam", "Albert Einstein", "C. V. Raman", "Pervez Hoodbhoy"], ["ڈاکٹر عبدالسلام", "آئن سٹائن", "سی وی رمن", "پرویز ہود بھائی"]),
    Q("gcu", "What style is the main building?", "مرکزی عمارت کس طرز کی ہے؟", ["Neo-Gothic", "Mughal", "Modern glass", "Greek temple"], ["گوتھک", "مغل", "جدید شیشے والی", "یونانی مندر"]),
    Q("quaid-library", "What was Bagh-e-Jinnah called before?", "باغِ جناح کا پرانا نام کیا تھا؟", ["Lawrence Gardens", "Hazuri Bagh", "Shalimar", "Racecourse Park"], ["لارنس گارڈن", "حضوری باغ", "شالامار", "ریس کورس پارک"]),
    Q("quaid-library", "When did the Quaid-e-Azam Library open?", "قائداعظم لائبریری کب کھلی؟", ["1984", "1866", "1947", "2001"], ["1984", "1866", "1947", "2001"]),
    Q("quaid-library", "Before it was a library, the building was a…", "لائبریری سے پہلے یہ عمارت کیا تھی؟", ["Club", "Prison", "Church", "Railway office"], ["کلب", "جیل", "گرجا گھر", "ریلوے دفتر"]),
    Q("railway-station", "Why does Lahore station look like a fort?", "لاہور اسٹیشن قلعے جیسا کیوں ہے؟", ["It was built for defence after 1857", "A Mughal fort stood there", "To match the Lahore Fort", "It is a museum"], ["1857 کے بعد حفاظت کے لیے بنا", "وہاں مغل قلعہ تھا", "شاہی قلعے سے ملانے کے لیے", "یہ عجائب گھر ہے"]),
    Q("railway-station", "When was the station built?", "اسٹیشن کب بنا؟", ["1859–60", "1947", "1905", "1820"], ["1859–60", "1947", "1905", "1820"]),
    Q("railway-station", "What are the narrow slits in its walls for?", "دیواروں میں تنگ سوراخ کس لیے ہیں؟", ["Guns", "Air conditioning", "Ticket windows", "Lights"], ["بندوقوں کے لیے", "ہوا کے لیے", "ٹکٹ کے لیے", "روشنی کے لیے"]),
    Q("gulabi-bagh", "What does Gulabi Bagh mean?", "گلابی باغ کا مطلب کیا ہے؟", ["Rose garden", "Pink fort", "Royal gate", "Water garden"], ["گلاب کا باغ", "گلابی قلعہ", "شاہی دروازہ", "پانی کا باغ"]),
    Q("gulabi-bagh", "Who was Dai Anga?", "دائی انگہ کون تھیں؟", ["Shah Jahan's wet nurse", "Akbar's queen", "A Sufi saint", "A dancer"], ["شاہجہان کی دائی", "اکبر کی ملکہ", "صوفی بزرگ", "رقاصہ"]),
    Q("gulabi-bagh", "When was the gateway built?", "دروازہ کب بنا؟", ["1655", "1855", "1555", "1755"], ["1655", "1855", "1555", "1755"]),
    Q("chauburji", "What does Chauburji mean?", "چوبرجی کا مطلب کیا ہے؟", ["Four towers", "Four gates", "Four gardens", "Four domes"], ["چار برج", "چار دروازے", "چار باغ", "چار گنبد"]),
    Q("chauburji", "Chauburji was the gateway to a…", "چوبرجی کس چیز کا دروازہ تھا؟", ["Garden", "Fort", "Mosque", "City"], ["باغ", "قلعہ", "مسجد", "شہر"]),
    Q("chauburji", "What knocked down one of its minarets in 1846?", "1846 میں اس کا ایک مینار کس وجہ سے گرا؟", ["An earthquake", "A war", "A flood", "Lightning"], ["زلزلہ", "جنگ", "سیلاب", "بجلی"]),
  );

  /* Walk stops that now have their own page. */
  LL.WALK.forEach((w) => { if (LL.SITES.some((s) => s.id === w.id)) w.site = true; });

  /* A second day: Mughal tombs across the Ravi, then British-era Lahore. */
  LL.PLANS.push({
    id: "day2",
    label: "Second day",
    title: { en: "Mughal tombs and the Mall", ur: "مغل مقبرے اور مال روڈ" },
    intro: {
      en: "Already seen the Fort and the Walled City? Spend the morning at the Shahdara tombs across the Ravi, and the afternoon on The Mall.",
      ur: "قلعہ اور اندرونِ شہر دیکھ چکے ہیں؟ صبح راوی پار شاہدرہ کے مقبرے دیکھیں، اور دوپہر کے بعد مال روڈ۔",
    },
    stops: [
      { site: "jahangir-tomb", time: "9:00", note: { en: "Go early — there is little shade. Enter through the Akbari Sarai.", ur: "جلدی جائیں، سایہ کم ہے۔ اکبری سرائے سے داخل ہوں۔" } },
      { site: "asif-khan-tomb", time: "10:15", note: { en: "Next door, through the same sarai.", ur: "ساتھ ہی، اسی سرائے سے۔" } },
      { site: "nur-jahan-tomb", time: "10:45", note: { en: "A short walk across the railway line.", ur: "ریلوے لائن کے پار تھوڑا پیدل۔" } },
      { site: "lahore-museum", time: "12:30", note: { en: "Back across the Ravi. Zamzama is outside; lunch in Anarkali nearby.", ur: "راوی واپس پار کریں۔ باہر زمزمہ توپ ہے؛ دوپہر کا کھانا قریب انارکلی میں۔" } },
      { site: "gcu", time: "15:00", note: { en: "A short ride away — see the clock tower from the gate.", ur: "تھوڑا فاصلہ — گیٹ سے گھنٹہ گھر دیکھیں۔" } },
      { site: "quaid-library", time: "16:30", note: { en: "End with a walk in Bagh-e-Jinnah.", ur: "آخر میں باغِ جناح میں سیر۔" } },
    ],
  });

  LL.HISTORY_SOURCES.push(
    ["Wikipedia — Delhi Gate, Lahore", "https://en.wikipedia.org/wiki/Delhi_Gate,_Lahore"],
    ["Wikipedia — Shahi Hammam", "https://en.wikipedia.org/wiki/Shahi_Hammam"],
    ["Wikipedia — Sunehri Masjid, Lahore", "https://en.wikipedia.org/wiki/Sunehri_Masjid,_Lahore"],
    ["Wikipedia — Haveli of Nau Nihal Singh", "https://en.wikipedia.org/wiki/Haveli_of_Nau_Nihal_Singh"],
    ["Punjab Auqaf — Data Darbar", "https://auqaf.punjab.gov.pk/data-darbar"],
    ["Wikipedia — Hazuri Bagh", "https://en.wikipedia.org/wiki/Hazuri_Bagh"],
    ["Wikipedia — Tomb of Allama Iqbal", "https://en.wikipedia.org/wiki/Tomb_of_Allama_Iqbal"],
    ["Wikipedia — Samadhi of Ranjit Singh", "https://en.wikipedia.org/wiki/Samadhi_of_Ranjit_Singh"],
    ["Wikipedia — Tomb of Jahangir", "https://en.wikipedia.org/wiki/Tomb_of_Jahangir"],
    ["Wikipedia — Tomb of Nur Jahan", "https://en.wikipedia.org/wiki/Tomb_of_Nur_Jahan"],
    ["Wikipedia — Tomb of Anarkali", "https://en.wikipedia.org/wiki/Tomb_of_Anarkali"],
    ["Wikipedia — Lahore Museum", "https://en.wikipedia.org/wiki/Lahore_Museum"],
    ["Wikipedia — Government College University, Lahore", "https://en.wikipedia.org/wiki/Government_College_University,_Lahore"],
    ["Wikipedia — Quaid-e-Azam Library", "https://en.wikipedia.org/wiki/Quaid-e-Azam_Library"],
    ["Wikipedia — Lahore Railway Station", "https://en.wikipedia.org/wiki/Lahore_Railway_Station"],
    ["Wikipedia — Tomb of Dai Anga (Gulabi Bagh)", "https://en.wikipedia.org/wiki/Tomb_of_Dai_Anga"],
    ["Wikipedia — Chauburji", "https://en.wikipedia.org/wiki/Chauburji"],
  );
})();
