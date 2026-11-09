/* =========================================================================
   LAHORE LEGACY — LOCATIONS
   Coordinates (lat, lon) from each place's Wikipedia article, November 2026.
   A few without a published coordinate (marked ≈) are placed from nearby
   documented points. The base map lines are simplified and approximate.
   ========================================================================= */

window.LL = window.LL || {};

LL.GEO = {
  "lahore-fort": [31.58778, 74.315],
  "badshahi-mosque": [31.58806, 74.30944],
  "hazuri-bagh": [31.58833, 74.31167],
  "iqbal-tomb": [31.5876, 74.3108],          // ≈ beside the mosque steps
  "ranjit-samadhi": [31.5893, 74.3107],      // ≈ north of Hazuri Bagh
  "minar-e-pakistan": [31.5925, 74.3095],
  "iqbal-park": [31.5928, 74.3126],
  "delhi-gate": [31.5822, 74.3264],
  "shahi-hammam": [31.582096, 74.325974],
  "wazir-khan-mosque": [31.58306, 74.32333],
  "sunehri-masjid": [31.583083, 74.319616],
  "nau-nihal-haveli": [31.5795161, 74.3109558],
  "data-darbar": [31.57898, 74.30474],
  "jahangir-tomb": [31.6225, 74.3032],
  "asif-khan-tomb": [31.6225, 74.2975],
  "nur-jahan-tomb": [31.6209, 74.2947],
  "anarkali-tomb": [31.5675, 74.30056],
  "lahore-museum": [31.568226, 74.308174],
  "gcu": [31.5733, 74.3079],                 // ≈ Lower Mall
  "quaid-library": [31.5537, 74.3313],       // Bagh-e-Jinnah
  "railway-station": [31.5772, 74.3363],
  "shalimar-gardens": [31.58583, 74.38194],
  "gulabi-bagh": [31.57861, 74.36389],
  "chauburji": [31.554, 74.3048],
};

/* Stops in the plans that are not place pages. */
LL.GEO_EXTRA = {
  food: [31.5866, 74.3087],
  "Fort Road Food Street, Lahore": [31.5866, 74.3087],
};

/* Simplified base map: river, Walled City outline, a few main roads. */
LL.BASEMAP = {
  ravi: [[31.652, 74.352], [31.638, 74.333], [31.626, 74.32], [31.615, 74.311], [31.606, 74.302], [31.598, 74.292], [31.587, 74.283], [31.572, 74.276], [31.555, 74.27]],
  walled: [[31.5905, 74.3115], [31.5888, 74.3195], [31.5872, 74.3255], [31.5822, 74.3272], [31.5785, 74.3238], [31.5762, 74.316], [31.5772, 74.308], [31.5818, 74.3058], [31.5872, 74.3074]],
  roads: [
    { name: "The Mall", pts: [[31.5745, 74.3052], [31.5683, 74.3088], [31.5622, 74.3185], [31.5555, 74.3292], [31.5482, 74.3405]] },
    { name: "Circular Road", pts: [[31.5904, 74.3112], [31.5888, 74.3205], [31.5873, 74.3268], [31.5815, 74.3285], [31.5768, 74.3245], [31.5745, 74.3155], [31.5762, 74.3065]] },
    { name: "GT Road", pts: [[31.5815, 74.3285], [31.5795, 74.342], [31.5786, 74.356], [31.5795, 74.368], [31.5845, 74.3805], [31.587, 74.392]] },
    { name: "Ravi Bridge", pts: [[31.5935, 74.3045], [31.6035, 74.3035], [31.613, 74.3025], [31.6195, 74.3015]] },
  ],
};
