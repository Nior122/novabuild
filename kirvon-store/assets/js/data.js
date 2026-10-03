/* =====================================================================
   KIRVON — store configuration & product catalogue
   Edit this file to change the store name, currency, delivery rules,
   coupon codes and products. No build step needed.
   ===================================================================== */

window.STORE = {
  name: 'KIRVON',
  tagline: 'Premium gadgets',
  currency: '₦',
  locale: 'en-NG',            // used to format numbers and dates (e.g. 'en-US', 'en-GB', 'en-GH')

  /* Shows a "demo store" notice at checkout. Set to false when you wire up real payments. */
  demoMode: true,

  /* Contact details (placeholders — replace with your own) */
  email: 'hello@kirvon.store',
  phone: '+234 800 000 0000',
  whatsapp: '2348000000000',           // digits only, with country code
  address: 'Port Harcourt, Rivers State, Nigeria',
  hours: 'Mon – Sat, 9am – 6pm (WAT)',

  /* Footer social links (placeholders: point these at your own profiles; delete a line to hide that icon) */
  social: { instagram: 'https://instagram.com/', x: 'https://x.com/', youtube: 'https://youtube.com/' },

  /* Bank details shown after a "bank transfer" order (placeholders) */
  bank: { name: 'Example Bank', account: '0123456789', holder: 'Kirvon Technologies Ltd' },

  categories: [
    { id: 'audio',      name: 'Audio',        blurb: 'Headphones, earbuds & speakers', icon: 'headphones', image: 'assets/img/products/orbit-speaker.jpg' },
    { id: 'wearables',  name: 'Wearables',    blurb: 'Watches, bands & smart rings',   icon: 'watch',      image: 'assets/img/products/nova-smartwatch.jpg' },
    { id: 'power-desk', name: 'Power & Desk', blurb: 'Chargers, power banks & desk gear', icon: 'zap',     image: 'assets/img/products/core-power-bank.jpg' }
  ],

  shipping: {
    freeOver: 100000,        // free standard delivery above this subtotal
    methods: [
      { id: 'standard', label: 'Standard delivery', eta: '2–5 business days',         price: 3500 },
      { id: 'express',  label: 'Express delivery',  eta: 'Next business day',          price: 7500 },
      { id: 'pickup',   label: 'Store pickup',      eta: 'Port Harcourt · ready in 2 hours', price: 0 }
    ]
  },

  /* Pay-on-delivery is only offered for these states */
  codStates: ['Rivers', 'Lagos', 'FCT (Abuja)'],

  coupons: {
    KIRVON10:  { type: 'percent', value: 10,   label: '10% off' },
    WELCOME5K:{ type: 'fixed',   value: 5000, label: '₦5,000 off' }
  },

  states: ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']
};

/* ---------------------------------------------------------------------
   Products
   price / compareAt are in Naira. Set stock: 0 for "sold out".
   badge is optional text shown on the card ("New", "Best seller" …).
   --------------------------------------------------------------------- */
window.PRODUCTS = [
  {
    id: 'aura-anc-headphones',
    name: 'Aura ANC Headphones',
    tagline: 'Silence, engineered.',
    category: 'audio',
    price: 129000, compareAt: 159000,
    rating: 4.8, reviews: 312,
    badge: 'Best seller', featured: true,
    added: '2026-06-12', stock: 24,
    image: 'assets/img/products/aura-anc-headphones.jpg',
    description: 'Hybrid active noise cancelling that turns the world down to a whisper. Plush leather cushions, a featherweight metal headband and 40 hours of battery make Aura the pair you reach for every day. Tune out the generator, the traffic and the noise of the day.',
    features: [
      'Hybrid ANC with a natural Transparency mode',
      '40-hour battery — a 10-minute charge gives 5 hours',
      'Bluetooth 5.3 multipoint: connect two devices at once',
      '40 mm drivers with hi-res LDAC support'
    ],
    specs: {
      'Drivers': '40 mm dynamic',
      'Noise cancelling': 'Hybrid ANC, up to 42 dB',
      'Battery life': '40 h (ANC on) · 55 h (ANC off)',
      'Charging': 'USB-C, 10 min = 5 h playback',
      'Connectivity': 'Bluetooth 5.3, 3.5 mm cable, multipoint',
      'Weight': '254 g',
      'In the box': 'Headphones, hard case, USB-C cable, 3.5 mm cable',
      'Warranty': '12 months'
    }
  },
  {
    id: 'pulse-earbuds',
    name: 'Pulse Earbuds',
    tagline: 'Small. Loud. All day.',
    category: 'audio',
    price: 64500, compareAt: null,
    rating: 4.6, reviews: 487,
    badge: null, featured: true,
    added: '2026-07-01', stock: 58,
    image: 'assets/img/products/pulse-earbuds.jpg',
    description: 'True wireless earbuds with adaptive noise cancelling, a punchy low end and a pocketable case that keeps the music going for 32 hours. Sweat-proof, secure-fit and tuned for everything from podcasts to the gym playlist.',
    features: [
      'Adaptive ANC plus ambient sound mode',
      '8 hours per charge, 32 hours with the case',
      'IPX5 sweat and splash resistance',
      'Low-latency game mode (60 ms)'
    ],
    specs: {
      'Drivers': '11 mm dynamic',
      'Noise cancelling': 'Adaptive ANC, up to 35 dB',
      'Battery life': '8 h earbuds + 24 h case',
      'Charging': 'USB-C and wireless',
      'Water resistance': 'IPX5',
      'Connectivity': 'Bluetooth 5.3',
      'Weight': '4.6 g per earbud',
      'Warranty': '12 months'
    }
  },
  {
    id: 'orbit-speaker',
    name: 'Orbit Speaker',
    tagline: '360° sound, built to roam.',
    category: 'audio',
    price: 78000, compareAt: 92000,
    rating: 4.7, reviews: 203,
    badge: null, featured: false,
    added: '2026-05-20', stock: 31,
    image: 'assets/img/products/orbit-speaker.jpg',
    description: 'A rugged, waterproof speaker with room-filling 360° sound, deep bass and 24 hours of playtime. Toss it in a bag and take it to the beach, the pool party or the rooftop hangout.',
    features: [
      '360° sound with dual passive bass radiators',
      'IP67 waterproof and dustproof',
      '24-hour playtime — doubles as a power bank',
      'Pair two Orbits for true stereo'
    ],
    specs: {
      'Output': '30 W RMS',
      'Playtime': 'Up to 24 hours',
      'Water & dust': 'IP67',
      'Connectivity': 'Bluetooth 5.3, USB-C, AUX',
      'Charging': 'USB-C (3 h)',
      'Weight': '780 g',
      'Dimensions': 'Ø 78 × 205 mm',
      'Warranty': '12 months'
    }
  },
  {
    id: 'nova-smartwatch',
    name: 'Nova Smartwatch',
    tagline: 'Your day, on your wrist.',
    category: 'wearables',
    price: 149000, compareAt: null,
    rating: 4.7, reviews: 268,
    badge: 'New', featured: true,
    added: '2026-09-02', stock: 17,
    image: 'assets/img/products/nova-smartwatch.jpg',
    description: 'A bright 1.43-inch AMOLED display, built-in GPS and a 10-day battery wrapped in a lightweight aluminium case. Track workouts, sleep and heart rate, and answer calls right from your wrist.',
    features: [
      '1.43" AMOLED, 1,000 nits — readable in full sun',
      'Built-in GPS with 100+ sport modes',
      '10-day battery, full charge in about an hour',
      'Heart rate, SpO2 and sleep tracking'
    ],
    specs: {
      'Display': '1.43" AMOLED, 466 × 466',
      'Battery': '10 days typical · 5 days always-on',
      'Positioning': 'GPS, GLONASS, Galileo',
      'Water resistance': '5 ATM',
      'Sensors': 'Optical HR, SpO2, accelerometer, gyro, barometer',
      'Compatibility': 'Android 8+ and iOS 14+',
      'Case': 'Aluminium, 45 mm, 38 g',
      'Warranty': '12 months'
    }
  },
  {
    id: 'flex-fitness-band',
    name: 'Flex Fitness Band',
    tagline: 'Light on the wrist. Heavy on data.',
    category: 'wearables',
    price: 38500, compareAt: 45000,
    rating: 4.5, reviews: 521,
    badge: null, featured: false,
    added: '2026-04-15', stock: 76,
    image: 'assets/img/products/flex-fitness-band.jpg',
    description: 'A slim 1.47-inch AMOLED band for the gym, the road and the office. Tracks steps, sleep and heart rate for two full weeks between charges, at a price that makes sense.',
    features: [
      '1.47" AMOLED touch display',
      '14-day battery life',
      '24/7 heart-rate and sleep tracking',
      '5 ATM water resistance — swim ready'
    ],
    specs: {
      'Display': '1.47" AMOLED',
      'Battery': 'Up to 14 days',
      'Water resistance': '5 ATM',
      'Sensors': 'Optical HR, SpO2, accelerometer',
      'Compatibility': 'Android & iOS',
      'Weight': '21 g (without strap)',
      'Warranty': '12 months'
    }
  },
  {
    id: 'halo-smart-ring',
    name: 'Halo Smart Ring',
    tagline: 'Health tracking you forget you\u2019re wearing.',
    category: 'wearables',
    price: 119000, compareAt: null,
    rating: 4.6, reviews: 94,
    badge: 'New', featured: false,
    added: '2026-09-18', stock: 4,
    image: 'assets/img/products/halo-smart-ring.jpg',
    description: 'A titanium ring that tracks sleep, readiness and heart rate with no screen and no distractions. Water resistant, 7 days of battery and light enough to wear 24/7. A sizing kit is included — we\u2019ll confirm your size on WhatsApp after you order.',
    features: [
      'Sleep, readiness and recovery scores',
      'Scratch-resistant titanium, just 3 g',
      '7-day battery with a portable charging case',
      'Water resistant to 100 m'
    ],
    specs: {
      'Material': 'Grade-5 titanium',
      'Battery': 'Up to 7 days',
      'Sensors': 'Infrared PPG, skin temperature, 3-axis accelerometer',
      'Water resistance': '100 m',
      'Sizes': '6 – 13 (sizing kit included)',
      'Weight': '3 – 5 g',
      'Warranty': '12 months'
    }
  },
  {
    id: 'core-power-bank',
    name: 'Core 20K Power Bank',
    tagline: 'Two phones. One laptop. Zero panic.',
    category: 'power-desk',
    price: 56000, compareAt: 65000,
    rating: 4.8, reviews: 389,
    badge: 'Best seller', featured: true,
    added: '2026-03-10', stock: 42,
    image: 'assets/img/products/core-power-bank.jpg',
    description: '20,000 mAh of high-density power with 65 W USB-C output — enough to charge a laptop, a phone and your earbuds at once. A smart display shows the exact percentage so you\u2019re never guessing. Built for long days, long flights and the evenings when the light goes off.',
    features: [
      '20,000 mAh with 65 W USB-C Power Delivery',
      'Charges a laptop, phone and earbuds together',
      'Smart display shows exact battery percentage',
      'Airline-friendly (72 Wh), braided cable included'
    ],
    specs: {
      'Capacity': '20,000 mAh / 72 Wh',
      'Output': '65 W max (USB-C) · 22.5 W (USB-A)',
      'Ports': '2 × USB-C, 1 × USB-A',
      'Recharge': '65 W USB-C input, about 2 hours',
      'Display': 'Digital percentage',
      'Weight': '412 g',
      'In the box': 'Power bank, braided USB-C cable, pouch',
      'Warranty': '12 months'
    }
  },
  {
    id: 'surge-gan-charger',
    name: 'Surge 65W GaN Charger',
    tagline: 'Small brick. Big power.',
    category: 'power-desk',
    price: 29500, compareAt: null,
    rating: 4.7, reviews: 612,
    badge: null, featured: false,
    added: '2026-02-28', stock: 120,
    image: 'assets/img/products/surge-gan-charger.jpg',
    description: 'A palm-sized 65 W charger with three ports that powers your laptop, phone and tablet at the same time. GaN technology keeps it cool, compact and travel-ready.',
    features: [
      '65 W total with intelligent power sharing',
      '2 × USB-C and 1 × USB-A ports',
      'Foldable plug, 40% smaller than standard chargers',
      '1.5 m braided USB-C cable included'
    ],
    specs: {
      'Output': '65 W total',
      'Ports': '2 × USB-C, 1 × USB-A',
      'Technology': 'GaN III',
      'Input': '100–240 V AC',
      'Protection': 'Over-voltage, over-current, over-temperature',
      'Weight': '112 g',
      'In the box': 'Charger, 1.5 m braided USB-C cable',
      'Warranty': '12 months'
    }
  },
  {
    id: 'dock-wireless-charger',
    name: 'Dock 3-in-1 Charger',
    tagline: 'One dock. Three devices. Zero clutter.',
    category: 'power-desk',
    price: 72000, compareAt: 85000,
    rating: 4.6, reviews: 156,
    badge: null, featured: false,
    added: '2026-08-05', stock: 19,
    image: 'assets/img/products/dock-wireless-charger.jpg',
    description: 'Charge your phone, smartwatch and earbuds from one elegant stand. Fast 15 W Qi2 charging, a soft nightstand glow and a foldable design that disappears into your bag. Works with Qi-enabled phones, earbuds and select smartwatches, including Nova.',
    features: [
      '15 W Qi2 fast charging for your phone',
      'Dedicated smartwatch and earbud pads',
      'Soft ambient light with a night mode',
      '30 W wall adapter included'
    ],
    specs: {
      'Output': '15 W phone · 5 W watch · 5 W earbuds',
      'Standard': 'Qi2 / Qi',
      'Input': 'USB-C 30 W (adapter included)',
      'Material': 'Aluminium and soft-touch finish',
      'Weight': '540 g',
      'In the box': 'Dock, 30 W adapter, USB-C cable',
      'Warranty': '12 months'
    }
  },
  {
    id: 'keystone-keyboard',
    name: 'Keystone 75 Keyboard',
    tagline: 'Type like you mean it.',
    category: 'power-desk',
    price: 98000, compareAt: null,
    rating: 4.9, reviews: 142,
    badge: 'New', featured: false,
    added: '2026-09-25', stock: 11,
    image: 'assets/img/products/keystone-keyboard.jpg',
    description: 'A compact 75% mechanical keyboard with a gasket-mounted aluminium frame, hot-swappable switches and tri-mode wireless: Bluetooth, 2.4 GHz and USB-C. A deep, satisfying sound, subtle lime underglow and all-day comfort.',
    features: [
      'Gasket-mount aluminium frame with sound-dampening foam',
      'Hot-swappable, pre-lubed linear switches',
      'Tri-mode: Bluetooth 5.1, 2.4 GHz and USB-C',
      '4,000 mAh battery — up to 200 hours (backlight off)'
    ],
    specs: {
      'Layout': '75% · 82 keys',
      'Switches': 'Hot-swappable, pre-lubed linear',
      'Keycaps': 'Double-shot PBT',
      'Connectivity': 'Bluetooth 5.1 · 2.4 GHz · USB-C',
      'Battery': '4,000 mAh',
      'Compatibility': 'Windows, macOS, Linux, Android',
      'Backlight': 'Per-key RGB (lime by default)',
      'Warranty': '12 months'
    }
  },
  {
    id: 'glide-mouse',
    name: 'Glide Wireless Mouse',
    tagline: 'Precision that disappears.',
    category: 'power-desk',
    price: 36500, compareAt: 42000,
    rating: 4.6, reviews: 208,
    badge: null, featured: false,
    added: '2026-05-18', stock: 38,
    image: 'assets/img/products/glide-mouse.jpg',
    description: 'A lightweight, sculpted wireless mouse with a 26,000 DPI optical sensor and silent-click switches. It is comfortable through a long workday, quiet in meetings, and switches between three devices at the press of a button.',
    features: [
      '26,000 DPI optical sensor that tracks on almost any surface',
      'Silent-click switches: quiet in meetings and late at night',
      'Connect up to three devices over Bluetooth or the 2.4 GHz dongle',
      'Up to 90 hours per charge. A 1-minute top-up gives 5 hours'
    ],
    specs: {
      'Sensor': '26,000 DPI optical',
      'Buttons': '6 programmable, silent-click',
      'Connectivity': 'Bluetooth 5.2 · 2.4 GHz dongle',
      'Battery': 'Up to 90 h · USB-C charging',
      'Weight': '68 g',
      'Compatibility': 'Windows, macOS, Linux, Android',
      'In the box': 'Mouse, USB-C cable, 2.4 GHz dongle',
      'Warranty': '12 months'
    }
  },
  {
    id: 'beam-desk-lamp',
    name: 'Beam LED Desk Lamp',
    tagline: 'Light that works as hard as you do.',
    category: 'power-desk',
    price: 42500, compareAt: null,
    rating: 4.7, reviews: 96,
    badge: 'New', featured: false,
    added: '2026-09-28', stock: 22,
    image: 'assets/img/products/beam-desk-lamp.jpg',
    description: 'A slim, fully articulated LED desk lamp with flicker-free light that is easy on the eyes. Dim it from a warm 2,700 K glow to crisp 6,500 K daylight, and fold the arm flat when you are done.',
    features: [
      'Flicker-free LED with CRI 95+ for natural, comfortable light',
      'Adjustable colour temperature from 2,700 K to 6,500 K',
      'Fully articulated aluminium arm: tilt, reach and rotate',
      'Touch dimming with memory and a 60-minute auto-off timer'
    ],
    specs: {
      'Light source': 'LED · CRI 95+',
      'Colour temperature': '2,700 K to 6,500 K',
      'Brightness': 'Up to 800 lm',
      'Power': 'USB-C, 12 W (adapter included)',
      'Arm': 'Aluminium, 3-joint articulated',
      'Weight': '1.1 kg',
      'In the box': 'Lamp, 12 W adapter, USB-C cable',
      'Warranty': '12 months'
    }
  }
];
