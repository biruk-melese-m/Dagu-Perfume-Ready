// Custom cursor logic removed.

// ── TELEGRAM BOT CONFIGURATION ──────────────────────────────
// Bot token and chat ID used to send new order notifications to Telegram.
// Set enabled: false to disable order alerts without breaking anything.
const TELEGRAM_CONFIG = {
  token: '8761766941:AAFi_564K2Fdd9ShCUkDGF1BzfnvVubdQnw',
  chatIds: ['8559533318', '386951891', '1378997306'], // Array of chat IDs to Send orders to...
  enabled: true
};

// Popular product IDs for featured sections
const POPULAR_IDS = {
  "sec-latest": [3, 11, 13, 16, 55, 745, 740, 741, 742, 6, 7, 51, 29, 752, 768, 128, 12, 10, 9, 5, 2, 21, 1, 8, 4, 15, 14, 17, 30, 769, 756, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 52, 53, 54, 56, 57, 58, 59, 60, 61],
  "sec-favorites": [172, 189, 182, 207, 174, 212, 58, 72, 233, 396, 68, 32, 117, 128, 102, 215, 56, 187, 62, 374, 116, 98, 145, 137, 106, 3, 162, 68, 59, 95, 67, 98, 3, 85, 183, 29, 71, 140, 88, 95],
  "sec-kings": [172, 189, 174, 212, 58, 72, 233, 396, 117, 102, 99, 135, 3, 81, 100, 171, 266, 297, 333, 138, 195, 55, 105, 61],
  "sec-queens": [215, 56, 187, 62, 374, 116, 145, 137, 106, 3, 162, 59, 95, 7, 97, 104, 5, 71, 127, 70, 32, 46, 91, 48, 20, 130, 167, 223, 401, 267, 82, 123, 13, 113, 165],
  "sec-unisex": [3, 85, 183, 29, 140, 88, 50, 81, 167],
  "sec-oud": [15, 25, 26, 33],
  "sec-fresh": [40, 16, 19, 9],
  "sec-sweet": [6, 27, 323, 161, 4, 2],
  "sec-designer": [43, 51, 42],
  "sec-sets": [41],
  "sec-doj": [15, 73, 235],
  "sec-shaik": [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600]
};

// Addis Ababa neighborhoods list & delivery times map
const ADDIS_SEFERS = [
  "Bole", "Bole Atlas", "Bole Medhanialem", "Bole Japan", "Bole Brass", "Bole Bulbola", "Bole Ruanda", "Bole Michael", 
  "Kazanchis", "Piazza", "4 Kilo", "6 Kilo", "22 Mazoria", "CMC", "Ayat", "Sarbet", "Bisrate Gabriel", "Mexico",
  "Gotera", "Lebu", "Jemo", "Megenagna", "Gerji", "Imperial", "Hayat", "Kality", "Akaki", "Old Airport", "Tor Hailoch",
  "Nifas Silk", "Cherkos", "Stadium", "Bambis", "Meshualekia", "Summit", "Yeka Abado", "Signal", "Shiro Meda", "Gullele"
];

const SEFER_DELIVERY_TIMES = {
  "Bole": "⚡ Fast Delivery (30–60 mins)",
  "Bole Atlas": "⚡ Fast Delivery (30–60 mins)",
  "Bole Medhanialem": "⚡ Fast Delivery (30–60 mins)",
  "Bole Japan": "⚡ Fast Delivery (30–60 mins)",
  "Bole Brass": "⚡ Fast Delivery (30–60 mins)",
  "Bole Bulbola": "⚡ Fast Delivery (30–60 mins)",
  "Bole Ruanda": "⚡ Fast Delivery (30–60 mins)",
  "Bole Michael": "⚡ Fast Delivery (30–60 mins)",
  "Kazanchis": "🚀 Express Delivery (1–2 hrs)",
  "22 Mazoria": "🚀 Express Delivery (1–2 hrs)",
  "Megenagna": "🚀 Express Delivery (1–2 hrs)",
  "Gerji": "🚀 Express Delivery (1–2 hrs)",
  "Imperial": "🚀 Express Delivery (1–2 hrs)",
  "Old Airport": "🚀 Express Delivery (1–2 hrs)",
  "Sarbet": "🚀 Express Delivery (1–2 hrs)",
  "Bisrate Gabriel": "🚀 Express Delivery (1–2 hrs)",
  "Mexico": "🚀 Express Delivery (1–2 hrs)",
  "Gotera": "🚀 Express Delivery (1–2 hrs)",
  "Piazza": "🚚 Same-Day Delivery (2–4 hrs)",
  "4 Kilo": "🚚 Same-Day Delivery (2–4 hrs)",
  "6 Kilo": "🚚 Same-Day Delivery (2–4 hrs)",
  "CMC": "🚚 Same-Day Delivery (2–4 hrs)",
  "Ayat": "🚚 Same-Day Delivery (2–4 hrs)",
  "Lebu": "🚚 Same-Day Delivery (2–4 hrs)",
  "Jemo": "🚚 Same-Day Delivery (2–4 hrs)",
  "Summit": "🚚 Same-Day Delivery (2–4 hrs)",
  "Yeka Abado": "🚚 Same-Day Delivery (2–4 hrs)",
  "Signal": "🚚 Same-Day Delivery (2–4 hrs)",
  "Shiro Meda": "🚚 Same-Day Delivery (2–4 hrs)",
  "Gullele": "🚚 Same-Day Delivery (2–4 hrs)",
  "Kality": "🚚 Same-Day Delivery (2–4 hrs)",
  "Akaki": "🚚 Same-Day Delivery (2–4 hrs)",
  "Tor Hailoch": "🚚 Same-Day Delivery (2–4 hrs)",
  "Cherkos": "🚀 Express Delivery (1–2 hrs)",
  "Stadium": "🚀 Express Delivery (1–2 hrs)",
  "Bambis": "🚀 Express Delivery (1–2 hrs)",
  "Meshualekia": "🚀 Express Delivery (1–2 hrs)"
};

// ── PRELOADER ─────────────────────────────────────────
// Hides the loading screen in stages: 'ready' fades it, 'out' slides it away.
// The final step removes it from DOM entirely after the animation completes.
setTimeout(() => { document.getElementById('preloader').classList.add('ready'); }, 200);
setTimeout(() => { document.getElementById('preloader').classList.add('out'); }, 2000);
setTimeout(() => { document.getElementById('preloader').style.display = 'none'; }, 3200);

// Header scroll logic removed - header is now fixed.

// ── SMOOTH SCROLL TO DISCOVERY SECTION ────────────────────
// Called by the hero 'Discover' button to scroll past the hero section.
// Offsets by the fixed header height so the section isn't hidden behind it.
function scrollToDiscovery() {
  const el = document.getElementById('categorySelectors');
  if (el) {
    const headH = document.getElementById('mainHeader').offsetHeight || 72;
    window.scrollTo({ top: el.offsetTop - headH - 20, behavior: 'smooth' });
  }
}

// ── HERO CANVAS ANIMATION ───────────────────────────────
// Draws floating golden perfume bottle outlines and particle effects on the hero canvas.
// Runs continuously in a requestAnimationFrame loop for a premium animated background.
(function () {
  const cv = document.getElementById('heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const wrap = cv.parentElement;
  let W, H;
  const resize = () => {
    W = cv.width = wrap.clientWidth;
    H = cv.height = wrap.clientHeight;
  };
  resize(); window.addEventListener('resize', resize);

  // Initialize Reveal Logic for the "Advanced" look
  const initReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };
  window.addEventListener('DOMContentLoaded', initReveal);

  let mouseX = W / 2, mouseY = H / 2;
  window.addEventListener('mousemove', e => {
    const rect = cv.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random() * 1.2, vy: -(Math.random() * .5 + .2),
    vx: (Math.random() - .5) * .15, r: Math.random() * 2 + .3,
    life: Math.random(), gold: Math.random() < .25
  }));
  let t = 0;
  const drawBottle = (cx, cy, s, a) => {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy);

    // Silhouette base setup
    ctx.shadowBlur = 25;
    ctx.shadowColor = `rgba(200, 160, 80, ${a})`; // Gold glow
    ctx.strokeStyle = `rgba(200, 160, 80, ${a})`;
    ctx.lineWidth = 2;

    // Main bottle body (Sleek heavy glass block)
    ctx.beginPath();
    ctx.rect(-s * 0.35, -s * 0.4, s * 0.7, s * 0.9);
    ctx.stroke();

    // Internal base thickness (heavy glass bottom)
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.4);
    ctx.lineTo(s * 0.3, s * 0.4);
    ctx.strokeStyle = `rgba(110, 19, 36, ${a})`; // Brand red glow base
    ctx.stroke();

    // Center luxury label plate
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.rect(-s * 0.18, -s * 0.1, s * 0.36, s * 0.36);
    ctx.stroke();

    // Minimalist lines inside label
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, 0); ctx.lineTo(s * 0.08, 0);
    ctx.moveTo(-s * 0.04, s * 0.1); ctx.lineTo(s * 0.04, s * 0.1);
    ctx.stroke();

    // Neck ring
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(200, 160, 80, ${a})`;
    ctx.shadowColor = `rgba(200, 160, 80, ${a})`;
    ctx.beginPath();
    ctx.rect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.08);
    ctx.stroke();

    // Heavy Cap (T-shaped or block)
    ctx.beginPath();
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgba(110, 19, 36, ${a})`;
    ctx.strokeStyle = `rgba(110, 19, 36, ${a})`;
    ctx.rect(-s * 0.2, -s * 0.78, s * 0.4, s * 0.3);
    ctx.stroke();

    ctx.restore();
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .4, W * .7);
    bg.addColorStop(0, 'rgba(110,19,36,.08)'); bg.addColorStop(1, 'rgba(14,6,8,0)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx * .001; p.y += p.vy * .001; p.life += .003;
      if (p.y < -.1) { p.y = 1.1; p.x = Math.random(); }
      const alpha = p.life % 1; const fade = alpha < .1 ? alpha * 10 : alpha > .8 ? (1 - alpha) * 5 : 1;
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? `rgba(200,160,80,${fade * .5})` : `rgba(110,19,36,${fade * .4})`;
      ctx.fill();
    });
    // Smooth hovering and pulsating scale (no touch interaction)
    const hoverOffset = Math.sin(t * 0.04) * 15;
    const pulseScale = 1 + Math.sin(t * 0.03) * 0.03;

    // Constant Center logic
    const cx = W * 0.5;
    const cy = H * 0.45 + hoverOffset;

    // Constant Scale logic
    const baseSize = Math.min(W, H) * (W < 500 ? 0.38 : 0.42);
    const drawSize = baseSize * pulseScale;

    // Draw the bottle
    drawBottle(cx, cy, drawSize, 0.95);

    t += 1;
    requestAnimationFrame(draw);
  };
  draw();
})();

// ── DATA ────────────────────────────────────────────────────────
// ── EMOJI & COLOUR HELPERS ──────────────────────────────
// Maps product tags and gender codes to emojis and section accent colours.
// Used on product cards when no photo is available, and for section highlighting.
const EMOJI_MAP = {
  fresh: '🌊', floral: '🌸', woody: '🪵', oud: '🕌', sweet: '🍯',
  spicy: '🌶️', oriental: '🌙', leather: '🧥', fruity: '🍑', gourmand: '🍫', aquatic: '🌊', misc: '🎁'
};
function getEmoji(tags, gender) {
  if (tags.includes('oud')) return '🕌';
  if (tags.includes('floral') && gender === 'w') return '🌸';
  if (tags.includes('gourmand')) return '🍫';
  if (tags.includes('fresh') && tags.includes('aquatic')) return '🌊';
  if (tags.includes('woody')) return '🪵';
  if (tags.includes('sweet')) return '🍯';
  if (tags.includes('fruity')) return '🍑';
  if (tags.includes('spicy')) return '🌶️';
  if (gender === 'm') return '🏺';
  if (gender === 'w') return '🌺';
  if (tags.includes('stick') || tags.includes('cream')) return '🧴';
  return '🫧';
}
const SEC_COLORS = {
  'sec-kings': 'rgba(74,100,160,.25)',
  'sec-queens': 'rgba(160,60,100,.25)',
  'sec-oud': 'rgba(160,120,40,.25)',
  'sec-fresh': 'rgba(40,140,160,.25)',
  'sec-woody': 'rgba(120,80,40,.25)',
  'sec-sweet': 'rgba(160,100,40,.25)',
  'sec-unisex': 'rgba(60,140,80,.25)',
  'sec-designer': 'rgba(160,140,60,.25)',
  'sec-sets': 'rgba(100,60,140,.25)',
  'sec-doj': 'rgba(200,160,80,.25)',
  'sec-shaik': 'rgba(110,19,36,.25)',
  'sec-other': 'rgba(60,140,160,.25)',
};

const SECTIONS = [
  { id: 'sec-unisex', emoji: '⚖️', tag: 'Iconic Unisex', title: 'Iconic Unisex', sub: 'Timeless signatures that transcend gender — worn by everyone, remembered by all.' },
  { id: 'sec-kings', emoji: '👑', tag: "Men's Collection", title: 'For Kings', sub: 'Bold, commanding and unforgettable — the finest men\'s fragrances from beast-mode Lattafas to iconic designer originals.' },
  { id: 'sec-queens', emoji: '🌹', tag: "Women's Collection", title: 'For Queens', sub: 'From dreamy florals to addictive gourmands — every statement of elegance and confidence.' },
  { id: 'sec-oud', emoji: '🕌', tag: 'Oud & Arabian', title: 'Oud & Arabian Treasures', sub: 'Deep resins, smoky amber, and centuries of Middle Eastern perfumery tradition.' },
  { id: 'sec-doj', emoji: '💎', tag: 'Exclusive Collection', title: 'Doj Exclusives', sub: 'The crown jewels—high-concentration extracts and rare formulations by Doj.' },
  { id: 'sec-shaik', emoji: '🌪️', tag: 'Viral Variant Collection', title: 'Shaik Master Variants', sub: 'Expertly crafted variants that capture the soul of the world\'s most famous fragrances in one unified go.' },
  { id: 'sec-fresh', emoji: '🌊', tag: 'Fresh & Aquatic', title: 'Fresh & Aquatic', sub: 'Clean, crisp, and alive — perfect for daily wear, warm days, and effortless confidence.' },
  { id: 'sec-latest', emoji: '🔥', tag: 'Latest & Popular', title: 'The Latest Arrivals', sub: 'The newest releases and viral world-famous scents trending globe-wide right now.' },
  { id: 'sec-favorites', emoji: '💎', tag: 'Top Sellers', title: "Most People's Favorites", sub: 'The absolute crowd-favorites. Modern classics that every fragrance lover must own.' },
  { id: 'sec-sweet', emoji: '🍯', tag: 'Sweet & Gourmand', title: 'Sweet & Gourmand', sub: 'Vanilla, caramel, cocoa and sugar rush — the most addictive and crowd-pleasing profiles.' },
  { id: 'sec-designer', emoji: '💎', tag: 'Designer Originals & Testers', title: 'Designer Originals', sub: 'Authentic originals and testers from Chanel, Dior, Tom Ford, YSL and more — the real deal.' },
  { id: 'sec-sets', emoji: '🎁', tag: 'Sets, Splashes & More', title: 'Sets, Splashes & Extras', sub: 'Gift sets, body splashes, mini vials, kids perfumes and budget daily-wear picks.' },
  { id: 'sec-other', emoji: '🧴', tag: 'Other Essentials', title: 'Other Essentials', sub: 'High-quality shampoos, soaps, lotions and more for your daily care.' },
  { id: 'sec-misc', emoji: '✨', tag: 'All Fragrances', title: 'More Fragrances', sub: 'Every scent in our collection — explore the full range.' },
];

// ── POPULARITY SORTING ─────────────────────────────────
// Sorts a section's products so that IDs in POPULAR_IDS appear first.
// Products not in the priority list get pushed to the bottom.
function sortByPopularity(items, secId) {
  const priority = POPULAR_IDS[secId] || [];
  if (!priority.length) return items;
  return [...items].sort((a, b) => {
    const ai = priority.indexOf(a.no);
    const bi = priority.indexOf(b.no);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function getCleanName(p) { return p.name || 'Perfume'; }
function getCleanBrand(p) { return p.brand || 'Exclusive'; }

// ALL data loaded from Supabase
let ALL = [];

// ── WEBSITE GLOBAL STATE ───────────────────────────────
// All shared state for the website: filters, search, wishlist, cart, and quiz.
// Cart is intentionally cleared on every session for the instant-buy flow.
let currentFilters = {
  category: [],
  type: [],
  scent: [],
  price: []
};
let searchQ = '';
let quizResults = null;
let currentQuizFilter = null;
let quizSliderIndex = 0;
let quizSliderItems = [];
let wishlist = JSON.parse(localStorage.getItem('dagu_wishlist')) || [];
let cart = []; // Forces clean state on every session as requested
localStorage.removeItem('dagu_cart');
let userCoords = null;
let userSeferDetected = false;

// ── IMAGE ERROR FALLBACK ──────────────────────────────
// Tries an alternate image folder path when a product photo fails to load.
// If both paths fail, the entire product card is hidden to keep the UI clean.
function handleImgErr(img) {
  if (img.dataset.triedFallback) {
    // If already tried both, hide the whole card to respect user's request
    const card = img.closest('.pcard');
    if (card) card.style.display = 'none';
    return;
  }
  img.dataset.triedFallback = "true";
  const current = img.src;
  if (current.includes('Perfume%20Photos%201')) {
    img.src = current.replace('Perfume%20Photos%201', 'Perfume%20Photos');
  } else if (current.includes('Perfume%20Photos')) {
    img.src = current.replace('Perfume%20Photos', 'Perfume%20Photos%201');
  }
}

function gBadge(g) {
  if (g === 'm') return '<span class="badge badge-m">Men</span>';
  if (g === 'w') return '<span class="badge badge-w">Women</span>';
  return '<span class="badge badge-u">Unisex</span>';
}

function getBottleEmoji(p) {
  const t = p.tags, g = p.g;
  if (t.includes('oud')) return '🕌';
  if (t.includes('gourmand')) return '🍫';
  if (t.includes('floral') && g === 'w') return '🌸';
  if (t.includes('aquatic')) return '🌊';
  if (t.includes('leather')) return '🪶';
  if (t.includes('woody')) return '🪵';
  if (t.includes('sweet')) return '🍯';
  if (t.includes('fruity')) return '🍑';
  if (t.includes('spicy')) return '🌶️';
  if (g === 'm') return '🏺';
  if (g === 'w') return '🌺';
  return '🫧';
}

// ── PRODUCT CARD BUILDER ──────────────────────────────
// Builds the HTML string for a single product card including image, badges, price, and wishlist.
// Search terms are highlighted inline if a search query is active.
function buildCard(p, delay, secId) {
  const isFav = wishlist.includes(p.no);
  const emoji = getBottleEmoji(p);
  const primarySec = (p.sections && p.sections[0]) || p.sec;
  const secColor = SEC_COLORS[primarySec] || 'rgba(110,19,36,.15)';

  // Use clean English name/brand
  const cleanName = getCleanName(p);
  const cleanBrand = getCleanBrand(p);

  let nameHtml = cleanName;
  if (searchQ) {
    const reg = new RegExp(`(${searchQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    nameHtml = cleanName.replace(reg, '<span class="shigh">$1</span>');
  }

  const showImage = p.image && p.image !== '';

  // Build 3 badge cells for the grid
  const cell1 = (secId === 'sec-boutique' || secId === 'sec-shaik' || secId === 'sec-doj')
    ? `<span class="badge badge-size">${p.size}</span>`
    : gBadge(p.g);
  const cell2 = (secId === 'sec-boutique' || secId === 'sec-shaik' || secId === 'sec-doj')
    ? `<span class="badge badge-type">${p.tags.filter(t => t !== 'misc')[0] ? p.tags.filter(t => t !== 'misc')[0].charAt(0).toUpperCase() + p.tags.filter(t => t !== 'misc')[0].slice(1) : p.size}</span>`
    : `<span class="badge badge-size">${p.size}</span>`;
  const cell3 = p.orig
    ? '<span class="badge badge-orig">Original</span>'
    : (p.tags.filter(t => t !== 'misc')[0]
        ? `<span class="badge badge-type">${p.tags.filter(t => t !== 'misc')[0].charAt(0).toUpperCase() + p.tags.filter(t => t !== 'misc')[0].slice(1)}</span>`
        : '<span class="badge badge-type">—</span>');

  return `
    <div class="pcard reveal" style="animation-delay:${delay}ms" onclick="openPanel(${p.no})">
      <div class="pcard-img" style="background:var(--dark)">
        ${showImage ? `<img src="${p.image}" alt="${cleanName}" loading="lazy" class="pcard-main-img" onerror="handleImgErr(this)">` : `<div class="pcard-bottle">${emoji}</div>`}
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist(${p.no}, event)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div class="pcard-hover-hint">View Details →</div>
      </div>
      <div class="pcard-info">
        <div class="pcard-id">ID · ${String(p.no).padStart(3, '0')}</div>
        <div class="pcard-brand">${cleanBrand}</div>
        <div class="pcard-name">${nameHtml}</div>
        <div class="pcard-badges">
          ${cell1}${cell2}${cell3}
        </div>
        ${p.price === 'N/A' ? '<div class="pcard-price-na">Price on request</div>' : `<div class="pcard-price">${p.price} Br</div>`}
      </div>
    </div>
  `;
}

// ── WISHLIST (FAVOURITES) ──────────────────────────────
// Adds or removes a product from the wishlist saved in localStorage.
// Re-renders the grid to update heart icon states immediately.
function toggleWishlist(no, event) {
  event.stopPropagation();
  const idx = wishlist.indexOf(no);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(no);
  }
  localStorage.setItem('dagu_wishlist', JSON.stringify(wishlist));
  render();
}

// ── CATALOGUE FILTERS ─────────────────────────────────
// Toggles gender category filters (Men/Women/Unisex) and re-renders the catalogue.
// Multiple categories can be active at once; clicking again deactivates.
function toggleCategory(cat, el) {
  if (currentFilters.category.includes(cat)) {
    currentFilters.category = currentFilters.category.filter(c => c !== cat);
    el.classList.remove('active');
  } else {
    currentFilters.category.push(cat);
    el.classList.add('active');
  }
  updateResetBtn();
  render();
}

// Toggles scent/collection filter buttons (Oud, Fresh, Latest, Exclusives, etc).
// The special 'exclusive' key activates both Doj and Shaik collections together.
function toggleScent(scnt, el) {
  if (scnt === 'exclusive') {
    const isAct = currentFilters.scent.includes('shaik') || currentFilters.scent.includes('doj');
    if (isAct) {
      currentFilters.scent = currentFilters.scent.filter(s => s !== 'shaik' && s !== 'doj');
    } else {
      currentFilters.scent.push('shaik', 'doj');
    }
  } else if (currentFilters.scent.includes(scnt)) {
    currentFilters.scent = currentFilters.scent.filter(s => s !== scnt);
  } else {
    currentFilters.scent.push(scnt);
  }
  updateFilterUIState();
  updateResetBtn();
  render();
}

// Resets all active filters in one tap and re-renders the full catalogue.
function resetCategories() {
  currentFilters = { category: [], type: [], scent: [], price: [] };
  document.querySelectorAll('.sel-btn').forEach(btn => btn.classList.remove('active'));
  updateResetBtn();
  render();
}

function updateResetBtn() {
  const isAnyActive = currentFilters.category.length > 0 || currentFilters.scent.length > 0;
  document.getElementById('secResetBtn').classList.toggle('show', isAnyActive);
}

const SECTION_SHUFFLES = {};

// Randomly shuffles the product order within a specific section and smooth-scrolls back to it.
// Useful for discovering different products on each visit.
function shuffleSection(secId) {
  SECTION_SHUFFLES[secId] = true;
  render();
  setTimeout(() => {
    // Scroll back to the section if it moved
    const el = document.getElementById(secId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── MAIN CATALOGUE RENDER ───────────────────────────────
// The core render loop. Iterates every section, applies all active filters,
// and injects the built HTML cards into the page. Called after every state change.
function render() {
  const c = document.getElementById('content');
  c.innerHTML = '';

  const category = searchQ ? [] : currentFilters.category;
  const type = searchQ ? [] : currentFilters.type;
  const scent = searchQ ? [] : currentFilters.scent;
  const price = searchQ ? [] : currentFilters.price;
  const activeQuizFilter = searchQ ? null : currentQuizFilter;

  const isSelectorActive = category.length > 0 || scent.length > 0;

  SECTIONS.forEach(sec => {
    // If selector is active, ONLY show sections that user specifically requested
    if (isSelectorActive) {
      const isGenderSec = ['sec-kings', 'sec-queens', 'sec-unisex'].includes(sec.id);
      const isScentSec = ['sec-oud', 'sec-fresh', 'sec-sweet', 'sec-latest', 'sec-favorites', 'sec-doj', 'sec-shaik', 'sec-other'].includes(sec.id);

      let shouldShow = false;
      if (isGenderSec) {
        if (category.includes('men') && sec.id === 'sec-kings') shouldShow = true;
        if (category.includes('women') && sec.id === 'sec-queens') shouldShow = true;
        if (category.includes('unisex') && sec.id === 'sec-unisex') shouldShow = true;
      }
      if (isScentSec) {
        if (scent.includes('oud') && sec.id === 'sec-oud') shouldShow = true;
        if (scent.includes('fresh') && sec.id === 'sec-fresh') shouldShow = true;
        if (scent.includes('sweet') && sec.id === 'sec-sweet') shouldShow = true;
        if (scent.includes('latest') && sec.id === 'sec-latest') shouldShow = true;
        if (scent.includes('favorites') && sec.id === 'sec-favorites') shouldShow = true;
        if (scent.includes('other') && sec.id === 'sec-other') shouldShow = true;
        if (scent.includes('doj') && sec.id === 'sec-doj') shouldShow = true;
        if (scent.includes('shaik') && sec.id === 'sec-shaik') shouldShow = true;
      }

      if (sec.id === 'sec-doj' || sec.id === 'sec-shaik') {
        shouldShow = true;
      }
      if (!shouldShow) return; // Skip this section entirely
    }

    let items = [];
    if (sec.id === 'sec-latest') {
      items = ALL.filter(p => POPULAR_IDS['sec-latest'].includes(p.no));
      items = sortByPopularity(items, 'sec-latest');
    } else if (sec.id === 'sec-favorites') {
      items = ALL.filter(p => POPULAR_IDS['sec-favorites'].includes(p.no));
      items = sortByPopularity(items, 'sec-favorites');
    } else if (sec.id === 'sec-doj') {
      const dojIds = POPULAR_IDS['sec-doj'] || [];
      items = ALL.filter(p => dojIds.includes(p.no));
      items = sortByPopularity(items, 'sec-doj');
    } else if (sec.id === 'sec-shaik') {
      const shaikIds = POPULAR_IDS['sec-shaik'] || [];
      items = ALL.filter(p => shaikIds.includes(p.no));
      items = sortByPopularity(items, 'sec-shaik');
    // For sec-misc: show products that don't belong to any other section
    } else if (sec.id === 'sec-misc') {
      const allKnownIds = new Set();
      ALL.forEach(p => {
        const pSecs = p.sections || [p.sec || ''];
        const knownSections = SECTIONS.filter(s => s.id !== 'sec-misc').map(s => s.id);
        const belongsToKnown = pSecs.some(s => knownSections.includes(s));
        if (!belongsToKnown) allKnownIds.add(p.no);
      });
      items = ALL.filter(p => allKnownIds.has(p.no));
    } else {
      const dojIds = POPULAR_IDS['sec-doj'] || [];
      const shaikIds = POPULAR_IDS['sec-shaik'] || [];
      items = ALL.filter(p => (p.sections || [p.sec]).includes(sec.id));
      // Remove Boutique items from general gender sections (Kings, Queens, Unisex etc)
      items = items.filter(p => !dojIds.includes(p.no) && !shaikIds.includes(p.no));
      items = sortByPopularity(items, sec.id);
    }

    // If we have a quiz/filter result in the sidebar, we prioritize that when user clicks "View All"
    if (activeQuizFilter && !searchQ && !category.length && !type.length && !scent.length && !price.length) {
      items = items.filter(p => activeQuizFilter.includes(p.no));
    }

    if (searchQ) items = items.filter(p =>
      p.name.toLowerCase().includes(searchQ) ||
      p.brand.toLowerCase().includes(searchQ) ||
      getCleanName(p).toLowerCase().includes(searchQ) ||
      getCleanBrand(p).toLowerCase().includes(searchQ) ||
      p.vibe.toLowerCase().includes(searchQ) ||
      p.tags.join(' ').includes(searchQ)
    );

    if (category.length && !['sec-doj', 'sec-shaik'].includes(sec.id)) {
      items = items.filter(p => {
        if (category.includes('men') && p.g === 'm') return true;
        if (category.includes('women') && p.g === 'w') return true;
        if (category.includes('unisex') && p.g === 'u') return true;
        return false;
      });
    }

    if (type.length) {
      items = items.filter(p => {
        if (type.includes('designer') && p.orig) return true;
        if (type.includes('clone') && !p.orig) return true;
        return false;
      });
    }

    if (scent.length) {
      items = items.filter(p => {
        const pSecs = p.sections || [p.sec];
        return scent.some(s => {
          if (s === 'sweet') return pSecs.includes('sec-sweet') || p.tags.includes('sweet') || p.tags.includes('gourmand');
          if (s === 'oud') return pSecs.includes('sec-oud') || p.tags.includes('oud');
          if (s === 'other') return pSecs.includes('sec-other');
          return pSecs.includes(`sec-${s}`) || p.tags.includes(s);
        });
      });
    }

    if (price.length) {
      items = items.filter(p => {
        const n = parseFloat(p.price.replace(/[^0-9]/g, ''));
        if (isNaN(n)) return false;
        return price.some(pr => {
          if (pr === 'around5k') return n < 10000;
          if (pr === 'above10k') return n >= 10000;
          return false;
        });
      });
    }
    if (!items.length) return;

    if (SECTION_SHUFFLES[sec.id]) {
      items = items.sort(() => Math.random() - 0.5);
      delete SECTION_SHUFFLES[sec.id];
    }

    const el = document.createElement('div');
    el.className = 'cat-sec';
    el.id = sec.id;
    el.innerHTML = `
      <div class="sec-head" data-emoji="${sec.emoji}">
        <div class="sh-left">
          <div class="sh-tag">${sec.tag}</div>
          <div class="sh-title">${sec.emoji} ${sec.title}</div>
          <div class="sh-sub">${sec.sub}</div>
        </div>
        <div class="sh-right">
          <button class="sh-shuffle-btn" onclick="shuffleSection('${sec.id}')">
            <span>⇄</span> Shuffle
          </button>
          <div class="sh-count">${items.length}</div>
          <div class="sh-count-l">Fragrances</div>
        </div>
      </div>
      <div class="p-grid">${items.map((p, i) => buildCard(p, i * 20, sec.id)).join('')}</div>`;
    c.appendChild(el);
  });

  updateSidebarCounts();

  // ── RESULT BACKFILLING ──
  const totalItems = document.querySelectorAll('.pcard').length;
  if (totalItems > 0 && totalItems < 20) {
    const shownIds = Array.from(document.querySelectorAll('.pcard')).map(pc => {
      const oc = pc.getAttribute('onclick') || '';
      return parseInt(oc.match(/\d+/)[0]);
    });

    // Find "related" items NOT already shown
    let others = ALL.filter(p => !shownIds.includes(p.no));

    // Simple relevance: match gender if one is selected, otherwise just popular ones
    if (currentFilters.category.length) {
      const g = currentFilters.category[0] === 'men' ? 'm' : (currentFilters.category[0] === 'women' ? 'w' : 'u');
      others = others.sort((a, b) => (a.g === g ? -1 : 1));
    }

    const backfillCount = 20 - totalItems;
    const backfillItems = others.slice(0, backfillCount);

    if (backfillItems.length) {
      const el = document.createElement('div');
      el.className = 'cat-sec';
      el.innerHTML = `
        <div class="sec-head" data-emoji="✨">
          <div class="sh-left">
            <div class="sh-tag">More Recommendations</div>
            <div class="sh-title">✨ Recommended for You</div>
            <div class="sh-sub">We noticed you have a refined taste. Since we have a massive collection, here are some other incredible scents you might love.</div>
          </div>
        </div>
        <div class="p-grid">${backfillItems.map((p, i) => buildCard(p, i * 20)).join('')}</div>`;
      c.appendChild(el);
    }
  }

  revealObserver();
}

// Updates the total product count in the sidebar stats badge.
function updateSidebarCounts() {
  const statN = document.querySelector('.stat-n');
  if (statN) statN.textContent = ALL.length;
}

// ── PRODUCT DETAIL PANEL ───────────────────────────────
// Opens the full-screen product detail page.
// Populates bottle showcase, topbar title, grid content fields, and horizontal medium suggestion cards.
function openPanel(no) {
  const p = ALL.find(x => x.no === no); if (!p) return;
  currentPanelProduct = p;
  const emoji = getBottleEmoji(p);
  const primarySec = (p.sections && p.sections[0]) || p.sec;
  const secColor = SEC_COLORS[primarySec] || 'rgba(110,19,36,.25)';
  const showImage = p.image && p.image !== '';
  const dName = getCleanName(p);
  const dBrand = getCleanBrand(p);

  // Topbar
  const topbarTitle = document.getElementById('dpTopbarTitle');
  if (topbarTitle) topbarTitle.textContent = `${dBrand} — ${dName}`;

  // Bottle Showcase Image Area
  const bgEl = document.getElementById('dpImgBg');
  const bottleEl = document.getElementById('dpBottle');

  if (showImage) {
    if (bgEl) bgEl.style.backgroundImage = `url('${p.image}')`;
    if (bottleEl) {
      bottleEl.style.backgroundImage = `url('${p.image}')`;
      bottleEl.style.display = 'block';
      bottleEl.textContent = '';
      bottleEl.className = 'dp-bottle-frame';
    }
  } else {
    if (bgEl) bgEl.style.backgroundImage = 'none';
    if (bottleEl) {
      bottleEl.style.backgroundImage = 'none';
      bottleEl.style.display = 'flex';
      bottleEl.style.alignItems = 'center';
      bottleEl.style.justifyContent = 'center';
      bottleEl.textContent = emoji;
      bottleEl.className = 'dp-hero-emoji-static';
    }
  }

  // Content
  document.getElementById('dpNo').textContent = `#${String(p.no).padStart(3, '0')}`;
  document.getElementById('dpBrand').textContent = dBrand;
  document.getElementById('dpName').textContent = dName;

  const vibeText = p.vibe || '';
  const englishVibe = vibeText.replace(/[\u1200-\u137f\u1380-\u139f\u2D80-\u2DDF\uAB01-\uAB2E\ud800-\udbff\udc00-\udfff]/g, '').replace(/\s+/g, ' ').trim();
  document.getElementById('dpVibe').textContent = englishVibe || dName;

  const priceValBox = document.getElementById('dpPrice');
  if (p.price === 'N/A') {
    priceValBox.textContent = '—';
    priceValBox.style.fontSize = '14px';
    priceValBox.style.fontStyle = 'italic';
    priceValBox.style.color = 'rgba(200, 160, 80, 0.4)';
  } else {
    priceValBox.textContent = p.price + ' Br';
    priceValBox.style.fontSize = '22px';
    priceValBox.style.fontStyle = 'normal';
    priceValBox.style.color = 'var(--gold2)';
  }

  document.getElementById('dpBadges').innerHTML =
    gBadge(p.g) +
    (p.orig ? '<span class="badge badge-orig" style="font-size:8px;padding:3px 8px">Original</span>' : '') +
    p.tags.filter(t => t !== 'misc').slice(0, 4).map(t => `<span class="badge" style="font-size:7px;padding:2px 7px;background:rgba(110,19,36,.15);border:1px solid rgba(110,19,36,.3);color:rgba(245,237,224,.5)">${t}</span>`).join('');

  // Suggestions: horizontal scrollable medium cards
  const suggEl = document.getElementById('dpSuggestions');
  if (suggEl) {
    const pSecs = p.sections || [p.sec || ''];
    let suggestions = ALL.filter(s => {
      if (s.no === p.no) return false;
      const sSecs = s.sections || [s.sec || ''];
      return sSecs.some(sc => pSecs.includes(sc)) || s.g === p.g;
    });
    // Shuffle and take 10 items for smooth horizontal scroll
    suggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 10);
    suggEl.innerHTML = suggestions.map(s => {
      const sEmoji = getBottleEmoji(s);
      const sPrice = s.price === 'N/A' ? 'On Request' : s.price + ' Br';
      return `<div class="dp-sugg-card-med" onclick="openPanel(${s.no})">
        <div class="sugg-img-wrap">${s.image ? `<img src="${s.image}" alt="${s.name}" loading="lazy">` : `<span class="sugg-emoji">${sEmoji}</span>`}</div>
        <div class="sugg-info">
          <div class="sugg-brand">${s.brand}</div>
          <div class="sugg-name">${s.name}</div>
          <div class="sugg-price">${sPrice}</div>
        </div>
      </div>`;
    }).join('');
  }

  // Open panel + lock scroll & reset page position
  const panel = document.getElementById('detailPanel');
  panel.classList.add('open');
  const pageScroll = document.querySelector('.dp-page-scroll');
  if (pageScroll) pageScroll.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

// Closes the full-screen detail page and restores scroll.
function closePanel() {
  document.getElementById('detailPanel').classList.remove('open');
  document.body.style.overflow = '';
}

// ── ADVANCED FILTER PANEL ────────────────────────────
// Opens the slide-in filter panel (gender, scent, type, price checkboxes).
// Syncs the checkbox state to whatever filters are currently active.
function openFilterPanel() {
  document.getElementById('filterPanel').classList.add('open');
  document.getElementById('filterBackdrop').classList.add('open');
  // Sync checkboxes with current state
  const inputs = document.querySelectorAll('#filterPanel input[type="checkbox"]');
  inputs.forEach(input => {
    const group = input.dataset.group;
    input.checked = currentFilters[group] ? currentFilters[group].includes(input.value) : false;
  });
}

function closeFilterPanel() {
  document.getElementById('filterPanel').classList.remove('open');
  document.getElementById('filterBackdrop').classList.remove('open');
}

function toggleOrClearFilter() {
  let count = Object.values(currentFilters).flat().length;
  if(count > 0 || currentQuizFilter) {
    clearAllFilters();
  } else {
    openFilterPanel();
  }
}

// Reads all checked checkboxes from the filter panel and applies them to currentFilters.
// Called when 'Apply Filters' is tapped; results open in the quiz result slider.
function syncFilters() {
  const inputs = document.querySelectorAll('#filterPanel input[type="checkbox"]');
  const newFilters = { category: [], type: [], scent: [], price: [] };
  inputs.forEach(input => {
    if (input.checked) {
      newFilters[input.dataset.group].push(input.value);
    }
  });
  currentFilters = newFilters;
  updateFilterUIState();
}

// Returns a filtered array of ALL products matching the current filter panel state.
// Used by applyFilters() to populate the result slider with matched items.
function getFilteredItems() {
  const { category, type, scent, price } = currentFilters;
  let items = [...ALL];

  if (category.length) {
    items = items.filter(p => {
      if (category.includes('men') && p.g === 'm') return true;
      if (category.includes('women') && p.g === 'w') return true;
      if (category.includes('unisex') && p.g === 'u') return true;
      return false;
    });
  }

  if (type.length) {
    items = items.filter(p => {
      const isDesigner = (p.sections || [p.sec]).includes('sec-designer') || p.orig;
      if (type.includes('designer') && isDesigner) return true;
      if (type.includes('clone') && !isDesigner) return true;
      return false;
    });
  }

  if (scent.length) {
    items = items.filter(p => scent.some(s => {
      if (s === 'sweet') return p.tags.includes('sweet') || p.tags.includes('gourmand');
      if (s === 'oud') return p.tags.includes('oud');
      return p.tags.includes(s);
    }));
  }

  if (price.length) {
    items = items.filter(p => {
      const n = parseFloat(p.price.replace(/[^0-9]/g, ''));
      if (isNaN(n)) return false;
      return price.some(pr => {
        if (pr === 'around5k') return n < 10000;
        if (pr === 'above10k') return n >= 10000;
        return false;
      });
    });
  }

  return items;
}
function applyFilters() {
  closeFilterPanel();
  const matches = getFilteredItems();

  if (matches.length > 0) {
    const finalItems = matches.slice(0, 30); // Show up to 30 in the slider
    currentQuizFilter = finalItems.map(m => m.no);
    quizSliderItems = finalItems;
    quizSliderIndex = 0;

    // Update Slider Title
    const titleEl = document.querySelector('.qrp-title');
    if (titleEl) titleEl.textContent = 'Filtered Results';

    openQuizResultPanel();
    updateFilterUIState();
  } else {
    alert("No perfumes found matching these filters. Try adjusting your selection!");
  }
}

// Clears all filter state (including quiz results) and re-renders the full catalogue.
function clearAllFilters() {
  currentFilters = { category: [], type: [], scent: [], price: [] };
  currentQuizFilter = null; // Clear quiz
  const inputs = document.querySelectorAll('#filterPanel input[type="checkbox"]');
  inputs.forEach(input => input.checked = false);
  updateFilterUIState();
  render();
}

// Syncs the filter button badge count and selector grid highlights to current filter state.
// Called after any filter change to keep the UI accurately reflecting what's active.
function updateFilterUIState() {
  // Update badges on "Filter" button
  let count = Object.values(currentFilters).flat().length;
  const badge = document.getElementById('filterActiveCount');
  const fabFilter = document.querySelector('.fab-filter');
  
  if (fabFilter) {
    if (count > 0 || currentQuizFilter) {
      fabFilter.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      fabFilter.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>';
    }
  }

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  // Update Selector Grid Highlights
  document.querySelectorAll('.sel-btn').forEach(btn => {
    const val = btn.id.replace('btn-', '');
    let isAct = false;
    if (['men', 'women', 'unisex'].includes(val)) {
      isAct = currentFilters.category.includes(val);
    } else if (val === 'exclusive') {
      isAct = currentFilters.scent.includes('doj') || currentFilters.scent.includes('shaik');
    } else {
      isAct = currentFilters.scent.includes(val);
    }
    btn.classList.toggle('active', isAct);
  });
}

// ── QUICK FILTER SHORTCUTS ────────────────────────────
// One-tap filter shortcuts for the selector grid buttons (Men, Women, Doj, Shaik, etc).
// Instantly filters and scrolls to the first matching section.
function setQuickFilter(f, btn) {
  currentQuizFilter = null; // Typing/Selecting a quick filter clears quiz results
  if (f === 'all') {
    currentFilters = { category: [], type: [], scent: [], price: [] };
  } else if (['men', 'women', 'unisex'].includes(f)) {
    currentFilters.category = [f];
  } else if (f === 'designer') {
    currentFilters.type = ['designer'];
  } else if (f === 'clone') {
    currentFilters.type = ['clone'];
  } else if (f === 'doj') {
    currentFilters = { category: [], type: [], scent: ['doj'], price: [] };
    currentQuizFilter = null;
  } else if (f === 'shaik') {
    currentFilters = { category: [], type: [], scent: ['shaik'], price: [] };
    currentQuizFilter = null;
  }
  updateFilterUIState();
  render();

  // Auto-scroll to the first rendered section
  setTimeout(() => {
    const firstSec = document.querySelector('.cat-sec');
    if (firstSec) {
      const headerH = document.getElementById('mainHeader')?.offsetHeight || 72;
      const top = firstSec.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 60);
}

function setFilter(f, btn) {
  // Legacy support or fallback
  setQuickFilter(f, btn);
}

// ── SCENT QUIZ ──────────────────────────────────────
// Multi-step quiz that scores answers across gender, scent, type, and occasion.
// Results are shown in a swipeable slider panel with personalised recommendations.
const QUIZ_DATA = [
  {
    q: "Who are we finding a scent for?",
    options: [
      { label: "👑 For Kings", emoji: "👑", score: { category: ['men', 'unisex'] } },
      { label: "🌹 For Queens", emoji: "🌹", score: { category: ['women', 'unisex'] } }
    ]
  },
  {
    q: "How would you describe your perfect vibe?",
    options: [
      { label: "Fresh & Energetic", emoji: "🌊", score: { scent: ['fresh', 'aquatic'] } },
      { label: "Bold & Commanding", emoji: "👑", score: { category: ['men'], scent: ['oud', 'woody'] } },
      { label: "Sweet & Addictive", emoji: "🍯", score: { scent: ['sweet', 'gourmand'] } },
      { label: "Elegant & Sophisticated", emoji: "🌹", score: { category: ['women'], scent: ['floral'] } }
    ]
  },
  {
    q: "What's the occasion for this scent?",
    options: [
      { label: "Daily Office / Casual", emoji: "💼", score: { scent: ['fresh'] } },
      { label: "Special Night Out", emoji: "🌙", score: { scent: ['sweet', 'oud', 'woody'] } },
      { label: "Gym / Outdoor", emoji: "🏃", score: { scent: ['fresh', 'aquatic'] } },
      { label: "Romantic Date", emoji: "🕯️", score: { scent: ['floral', 'sweet'] } }
    ]
  },
  {
    q: "Preferred intensity level?",
    options: [
      { label: "Light & Airy", emoji: "🌬️", score: { price: ['budget'] } },
      { label: "Powerful Beast Mode", emoji: "🔥", score: { type: ['designer'] } },
      { label: "Middle Eastern Richness", emoji: "🕌", score: { scent: ['oud'] } },
      { label: "Balanced & Smooth", emoji: "⚖️", score: {} }
    ]
  }
];

let quizStep = 0;
let quizAnswers = [];

function openQuiz() {
  quizStep = 0;
  quizAnswers = [];
  document.getElementById('quizModal').classList.add('open');
  document.getElementById('quizBackdrop').classList.add('open');
  document.getElementById('quizNextBtn').onclick = nextQuizStep;

  // Set Title
  const titleEl = document.querySelector('.qrp-title');
  if (titleEl) titleEl.textContent = 'Curated for You';

  renderQuizStep();
}

function closeQuiz() {
  document.getElementById('quizModal').classList.remove('open');
  document.getElementById('quizBackdrop').classList.remove('open');
}

function renderQuizStep() {
  const body = document.getElementById('quizBody');
  const step = QUIZ_DATA[quizStep];
  const progress = ((quizStep) / QUIZ_DATA.length) * 100;
  document.getElementById('quizProgress').style.width = progress + '%';
  document.getElementById('quizBackBtn').style.display = quizStep > 0 ? 'block' : 'none';
  document.getElementById('quizNextBtn').textContent = quizStep === QUIZ_DATA.length - 1 ? 'See Results' : 'Next Question';
  document.getElementById('quizNextBtn').disabled = !quizAnswers[quizStep];

  body.innerHTML = `
    <div class="quiz-step">
      <div class="qs-question">${step.q}</div>
      <div class="qs-options">
        ${step.options.map((opt, i) => `
          <label class="qs-opt">
            <input type="radio" name="quiz_opt" value="${i}" ${quizAnswers[quizStep] == i ? 'checked' : ''} onchange="selectQuizOpt(${i})">
            <span>
              <div class="qs-opt-icon">${opt.emoji}</div>
              <div class="qs-opt-label">${opt.label}</div>
            </span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function selectQuizOpt(idx) {
  quizAnswers[quizStep] = idx;
  document.getElementById('quizNextBtn').disabled = false;
}

function nextQuizStep() {
  if (quizStep < QUIZ_DATA.length - 1) {
    quizStep++;
    renderQuizStep();
  } else {
    showQuizResults();
  }
}

function prevQuizStep() {
  if (quizStep > 0) {
    quizStep--;
    renderQuizStep();
  }
}

function showQuizResults() {
  document.getElementById('quizProgress').style.width = '100%';
  const body = document.getElementById('quizBody');
  const footer = document.getElementById('quizFooter');

  // Scoring
  const finalScore = { category: [], type: [], scent: [], price: [] };
  quizAnswers.forEach((ansIdx, stepIdx) => {
    const scores = QUIZ_DATA[stepIdx].options[ansIdx].score;
    for (let key in scores) {
      finalScore[key] = [...new Set([...finalScore[key], ...scores[key]])];
    }
  });

  // Find matches
  let matches = ALL.filter(p => {
    let matchCount = 0;
    if (finalScore.category.length && finalScore.category.includes('men') && p.g === 'm') matchCount++;
    if (finalScore.category.length && finalScore.category.includes('women') && p.g === 'w') matchCount++;
    if (finalScore.category.length && finalScore.category.includes('unisex') && p.g === 'u') matchCount++;
    if (finalScore.scent.length && finalScore.scent.some(s => p.tags.includes(s))) matchCount++;
    if (finalScore.type.length && finalScore.type.includes('designer') && p.orig) matchCount++;
    if (finalScore.type.length && finalScore.type.includes('clone') && !p.orig) matchCount++;
    return matchCount > 0;
  });

  // Sort by match quality (simple heuristic)
  matches.sort((a, b) => {
    let sa = 0, sb = 0;
    if (finalScore.scent.some(s => a.tags.includes(s))) sa++;
    if (finalScore.scent.some(s => b.tags.includes(s))) sb++;
    return sb - sa;
  });

  // Bridge if < 15
  if (matches.length < 15) {
    const matchedIds = matches.map(m => m.no);
    const others = ALL.filter(p => !matchedIds.includes(p.no));
    // Sort others by gender match
    const g = finalScore.category[0] === 'men' ? 'm' : (finalScore.category[0] === 'women' ? 'w' : 'u');
    others.sort((a, b) => (a.g === g ? -1 : 1));
    matches = [...matches, ...others.slice(0, 15 - matches.length)];
  }

  const finalItems = matches.slice(0, 20); // Show up to 20
  currentQuizFilter = finalItems.map(m => m.no);
  quizSliderItems = finalItems;
  quizSliderIndex = 0;

  closeQuiz();
  openQuizResultPanel();
}

function openQuizResultPanel() {
  document.getElementById('quizResultPanel').classList.add('open');
  document.getElementById('qrpBackdrop').style.opacity = '1';
  document.getElementById('qrpBackdrop').style.pointerEvents = 'all';
  renderQuizSlider();
}

function closeQuizResultPanel() {
  document.getElementById('quizResultPanel').classList.remove('open');
  document.getElementById('qrpBackdrop').style.opacity = '0';
  document.getElementById('qrpBackdrop').style.pointerEvents = 'none';
}

function renderQuizSlider() {
  const slider = document.getElementById('qrpSlider');
  const nextBtn = document.getElementById('qrpNext');
  const prevBtn = document.getElementById('qrpPrev');
  const applyBtn = document.getElementById('qrpApplyBtn');

  slider.innerHTML = quizSliderItems.map(p => `
    <div class="qrp-slide">
      <div class="qrp-img">${p.image ? `<img src="${p.image}" alt="${p.name}">` : getBottleEmoji(p)}</div>
      <div class="qrp-brand">${p.brand}</div>
      <div class="qrp-name">${p.name}</div>
      <div class="qrp-desc">${p.vibe}</div>
      <div class="qrp-price">${p.price} Br</div>
    </div>
  `).join('');

  updateSliderPos();

  applyBtn.textContent = `Explore All ${quizSliderItems.length} Recommendations →`;
  applyBtn.onclick = () => {
    if (!currentQuizFilter) {
      render(); // If current filters not applied yet, render
    }
    closeQuizResultPanel();
    setTimeout(() => {
      const firstSec = document.querySelector('.cat-sec');
      if (firstSec) {
        const headerH = document.getElementById('mainHeader')?.offsetHeight || 72;
        const top = firstSec.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        const filterEl = document.getElementById('categorySelectors');
        if (filterEl) filterEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
    updateFilterUIState();
  };
}

function moveQuizSlider(dir) {
  quizSliderIndex += dir;
  if (quizSliderIndex < 0) quizSliderIndex = 0;
  if (quizSliderIndex >= quizSliderItems.length) quizSliderIndex = quizSliderItems.length - 1;
  updateSliderPos();
}

function updateSliderPos() {
  const slider = document.getElementById('qrpSlider');
  const nextBtn = document.getElementById('qrpNext');
  const prevBtn = document.getElementById('qrpPrev');
  const detailBtn = document.getElementById('qrpViewDetailBtn');

  slider.style.transform = `translateX(-${quizSliderIndex * 100}%)`;

  prevBtn.disabled = quizSliderIndex === 0;
  nextBtn.disabled = quizSliderIndex === quizSliderItems.length - 1;
  
  if (detailBtn && quizSliderItems.length > 0) {
    const p = quizSliderItems[quizSliderIndex];
    detailBtn.onclick = () => {
      closeQuizResultPanel();
      openPanel(p.no);
    };
  }
}
// ── GLOBAL SEARCH ───────────────────────────────────
// Reads the search box value and re-renders the catalogue with results highlighted.
// Also clears any active quiz filter so the search runs against the full catalogue.
function doSearch() {
  currentQuizFilter = null; // Typing search clears quiz
  searchQ = document.getElementById('searchInput').value.toLowerCase().trim();
  render();
}
function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Removed sidebar functions

// ── SCROLL REVEAL ────────────────────────────────────
// IntersectionObserver that adds 'vis' class to elements as they enter the viewport.
// Used for fade-in animations on product cards and section headers.
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: .1 });
function revealObserver() {
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
}
revealObserver();

// ── SCROLL SPY (SECTION NAV HIGHLIGHT) ───────────────────
// Tracks which section is currently visible and highlights its nav link.
// Uses a second IntersectionObserver with a top margin to account for the fixed header.
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.snav-item').forEach(it => {
        const oc = it.getAttribute('onclick') || '';
        it.classList.toggle('active', oc.includes(`'${id}'`));
      });
    }
  });
}, { threshold: .2, rootMargin: '-80px 0px 0px 0px' });

// ── SUPABASE PRODUCT SYNC ─────────────────────────────
// Fetches all products from Supabase and filters out deleted ones.
// Merges duplicate entries, then triggers the first render.
async function initStore() {
  // Load all products from Supabase
  if (typeof window.supabase !== 'undefined' && window.supabase) {
    try {
      const { data: prodData, error } = await window.supabase.from('products').select('*');
      if (error) throw error;
      
      // Filter out deleted products and load the rest
      ALL = (prodData || []).filter(p => !p.deleted);
      
    } catch (e) {
      console.warn("Could not load products from Supabase", e);
      ALL = [];
    }
  } else {
    console.error("Supabase client not available");
    ALL = [];
  }

  // ── MERGE DUPLICATES ──
  const mergedMap = new Map();
  const cleaned = [];

  ALL.forEach(p => {
    // Unique key: Brand + Name (lowercase, trimmed)
    const key = `${p.brand.trim()}|${p.name.trim()}`.toLowerCase();

    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);
      // Collect images
      if (!existing.images) {
        existing.images = [existing.image];
      }
      if (p.image && !existing.images.includes(p.image)) {
        existing.images.push(p.image);
      }
    } else {
      // First time seeing this product
      // Store reference to keep original order if possible
      mergedMap.set(key, p);
      cleaned.push(p);
    }
  });

  // Overwrite ALL with the cleaned/merged version
  ALL.length = 0;
  ALL.push(...cleaned);

  render();
  updateCartCount();
  setTimeout(() => {
    document.querySelectorAll('.cat-sec').forEach(s => secObs.observe(s));
  }, 200);
}

// Wait for DOM and Supabase to be ready before loading products
window.addEventListener('DOMContentLoaded', function() {
  // Give Supabase config a moment to initialize
  setTimeout(function() {
    if (typeof window.supabase !== 'undefined' && window.supabase) {
      initStore();
    } else {
      console.error("Supabase not initialized after DOMContentLoaded");
      // Try one more time after a longer delay
      setTimeout(initStore, 500);
    }
  }, 100);
});

// ── INSTANT BUY / CART ENGINE ───────────────────────────
// Manages the single-item instant-buy cart. Cart is cleared on every session.
// Opening checkout from the product panel goes directly to the order form.
let currentPanelProduct = null;

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartBackdrop').classList.add('open');
  renderCart();
}
function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartBackdrop').classList.remove('open');
}

function addToCartFromPanel() {
  if (!currentPanelProduct) return;
  const p = currentPanelProduct;
  if (p.price === 'N/A') { alert('Price not available. Please call us to order.'); return; }

  // Instant Checkout: Clear cart and add only this item
  cart = [];
  const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
  cart.push({ no: p.no, brand: p.brand, name: p.name, price: priceNum, priceStr: p.price, size: p.size, emoji: getBottleEmoji(p), qty: 1 });

  localStorage.removeItem('dagu_cart'); // No need to save cart session
  updateCartCount();
  closePanel(); // Close detail panel to show checkout modal
  openCheckout();
}

function quickAddToCart(no, event) {
  event.stopPropagation();
  const p = ALL.find(x => x.no === no);
  if (!p || p.price === 'N/A') return;

  // Instant Checkout: Clear cart and add only this item
  cart = [];
  const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
  cart.push({ no: p.no, brand: p.brand, name: p.name, price: priceNum, priceStr: p.price, size: p.size, emoji: getBottleEmoji(p), qty: 1 });

  updateCartCount();
  openCheckout();
}

function showAddedState() {
  const btn = document.getElementById('dpAddCartBtn');
  btn.classList.add('added');
  btn.innerHTML = '✓ Added to Cart';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
  }, 1800);
}

function flashCartBtn() {
  const cnt = document.getElementById('cartCount');
  cnt.classList.add('bump');
  setTimeout(() => cnt.classList.remove('bump'), 300);
}

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;

  // Also check for favCount if it exists
  const fEl = document.getElementById('favCount');
  if (fEl) fEl.textContent = wishlist.length;
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function formatPrice(n) {
  return n.toLocaleString('en-ET') + ' Br';
}

// ── FAVOURITES PANEL ─────────────────────────────────
// Manages the wishlist slide-in panel showing all hearted/saved products.
// Tapping a favourite closes the panel and opens that product's detail panel.
function toggleWishlist(no, event) {
  if (event) event.stopPropagation();
  const idx = wishlist.indexOf(no);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(no);
  }
  localStorage.setItem('dagu_wishlist', JSON.stringify(wishlist));

  if (event && event.currentTarget) {
    event.currentTarget.classList.toggle('active', wishlist.includes(no));
    const svg = event.currentTarget.querySelector('svg');
    if (svg) svg.setAttribute('fill', wishlist.includes(no) ? 'currentColor' : 'none');
  }
  updateFavCount();
  renderFavs();
}

function updateFavCount() {
  const cnt = document.getElementById('favCount');
  if (cnt) cnt.textContent = wishlist.length;
  const fDisplay = document.getElementById('favCountDisplay');
  if (fDisplay) fDisplay.textContent = `(${wishlist.length})`;
}

function openFavs() {
  renderFavs();
  document.getElementById('favBackdrop').classList.add('open');
  document.getElementById('favPanel').classList.add('open');
}

function closeFavs() {
  document.getElementById('favBackdrop').classList.remove('open');
  document.getElementById('favPanel').classList.remove('open');
}

function renderFavs() {
  const el = document.getElementById('favBody');
  if (!el) return;
  if (wishlist.length === 0) {
    el.innerHTML = '<div class="cart-empty">No favorites yet. Tap the heart on products you love!</div>';
    return;
  }

  const favItems = wishlist.map(no => ALL.find(p => p.no === no)).filter(Boolean);

  el.innerHTML = favItems.map(item => `
    <div class="cart-item" style="cursor: pointer" onclick="closeFavs(); openPanel(${item.no})">
      <div class="cart-item-emoji">${item.image ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">` : getBottleEmoji(item)}</div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price > 0 ? formatPrice(item.price) : 'Price on request'}</div>
      </div>
      <div class="cart-item-right">
        <button class="cart-item-remove" onclick="toggleWishlist(${item.no}, event)" style="color:var(--brand); border:1px solid rgba(110,19,36,0.3); padding:4px 8px; border-radius:4px; font-size:12px;">Remove</button>
      </div>
    </div>`).join('');
}

window.addEventListener('load', updateFavCount);


// ── CART PANEL ──────────────────────────────────────
// Renders the cart slide-in panel with all items, quantities, prices, and total.
// changeQty handles +/- buttons and auto-removes items when quantity reaches zero.
function renderCart() {
  const el = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  const headerCount = document.getElementById('cartHeaderCount');

  const total = cart.reduce((s, i) => s + i.qty, 0);
  headerCount.textContent = total > 0 ? `(${total})` : '';

  if (cart.length === 0) {
    el.innerHTML = '';
    empty.style.display = 'flex';
    el.style.display = 'none';
    footer.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  el.style.display = 'block';
  footer.style.display = 'block';

  el.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.no}">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price > 0 ? formatPrice(item.price) : 'Price on request'}</div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-qty">
          <button class="cart-qty-btn" onclick="changeQty(${item.no},-1)">−</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button class="cart-qty-btn" onclick="changeQty(${item.no},1)">+</button>
        </div>
        <button class="cart-item-remove" title="Remove Item" onclick="removeFromCart(${item.no})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>`).join('');

  document.getElementById('cartTotal').textContent = formatPrice(cartTotal());
}

function changeQty(no, delta) {
  const item = cart.find(i => i.no === no);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { cart = cart.filter(i => i.no !== no); }
  localStorage.setItem('dagu_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function removeFromCart(no) {
  cart = cart.filter(i => i.no != no);
  localStorage.setItem('dagu_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function clearCart() {
  if (!confirm("Clear all items from your cart?")) return;
  cart = [];
  localStorage.setItem('dagu_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ════════════════════════════════════════════
//  CHECKOUT FLOW
//  Two-step checkout: Step 1 = customer details + payment selection.
//  Step 2 = upload payment screenshot + confirm. Ends with Telegram notification.
// ════════════════════════════════════════════
const PAYMENT_ACCOUNTS = {
  Telebirr: '0993 33 7235',
  CBE: '1000123456789',
  Cash: 'Pay on arrival'
};

let selectedPayment = '';

function openCheckout() {
  if (cart.length === 0) return;

  const summaryEl = document.getElementById('coSummary');
  summaryEl.innerHTML = cart.map(i => `
    <div class="co-sum-item">
      <span class="co-sum-item-name">${i.emoji} ${i.brand} ${i.name}</span>
      <span class="co-sum-item-qty">×${i.qty}</span>
      <span class="co-sum-item-price">${i.price > 0 ? formatPrice(i.price * i.qty) : '—'}</span>
    </div>`).join('');

  document.getElementById('coTotal').innerHTML = `
    <span class="co-total-lbl">Order Total</span>
    <span class="co-total-val">${formatPrice(cartTotal())}</span>`;

  document.getElementById('coName').value = '';
  document.getElementById('coPhone').value = '';
  document.querySelectorAll('input[name="payMethod"]').forEach(r => r.checked = false);
  document.getElementById('coAccountInfo').style.display = 'none';
  document.getElementById('coErr1').textContent = '';
  document.getElementById('coErr2').textContent = '';
  document.getElementById('coTxId').value = '';
  selectedPayment = '';

  const step0 = document.getElementById('coStep0');
  const step1 = document.getElementById('coStep1');
  const step2 = document.getElementById('coStep2');
  if (step0) step0.style.display = 'block';
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'none';

  document.getElementById('coSefer').value = '';
  document.getElementById('coLocationStatus').textContent = '';
  document.getElementById('coLocationStatus').classList.remove('active', 'error');
  userCoords = null;
  populateSeferList();

  document.getElementById('checkoutBackdrop').classList.add('open');
  document.getElementById('checkoutModal').classList.add('open');
}

function startOrderProcess() {
  document.getElementById('coStep0').style.display = 'none';
  document.getElementById('coStep1').style.display = 'block';
}

function closeCheckout() {
  document.getElementById('checkoutBackdrop').classList.remove('open');
  document.getElementById('checkoutModal').classList.remove('open');
}

function selectPayment(method) {
  selectedPayment = method;
  const info = document.getElementById('coAccountInfo');
  const num = document.getElementById('coAccountNum');
  num.textContent = PAYMENT_ACCOUNTS[method] || '';
  info.style.display = method === 'Cash' ? 'none' : 'block';
  
  const txField = document.getElementById('txIdField');
  if(txField) {
    txField.style.display = method === 'Cash' ? 'none' : 'block';
  }
}

function goToStep2() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const sefer = document.getElementById('coSefer').value.trim();
  const err = document.getElementById('coErr1');

  if (!name) { err.textContent = '⚠ Please enter your full name.'; return; }
  if (!phone || phone.replace(/\D/g, '').length < 9) { err.textContent = '⚠ Please enter a valid phone number.'; return; }
  if (!sefer) { err.textContent = '⚠ Please specify your neighborhood (Sefer).'; return; }
  if (!selectedPayment) { err.textContent = '⚠ Please select a payment method.'; return; }
  err.textContent = '';

  const recapHtml = `
    <div style="display:grid; grid-template-columns:auto 1fr; gap:6px 12px; align-items:center; font-size:13px;">
      <span style="color:rgba(200,160,80,.6); font-size:10px; text-transform:uppercase; text-align:right;">Name:</span>
      <strong>${name}</strong>
      <span style="color:rgba(200,160,80,.6); font-size:10px; text-transform:uppercase; text-align:right;">Tell:</span>
      <span>${phone}</span>
      <span style="color:rgba(200,160,80,.6); font-size:10px; text-transform:uppercase; text-align:right;">Sefer:</span>
      <span>${sefer} ${SEFER_DELIVERY_TIMES[sefer] ? `<br><small style="color:rgba(245,237,224,.4);">${SEFER_DELIVERY_TIMES[sefer]}</small>` : ''}</span>
    </div>
  `;

  if (selectedPayment === 'Cash') {
    document.getElementById('coRecap').innerHTML = `
      ${recapHtml}
      <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(110,19,36,.2);">
        💎 <strong>Cash on Delivery selected.</strong><br>
        <span style="color:rgba(245,237,224,.5); font-size:11px;">You will pay <strong style="color:var(--gold2);">${formatPrice(cartTotal())}</strong> upon receiving your items. No transaction ID needed below.</span>
      </div>`;
  } else {
    document.getElementById('coRecap').innerHTML = `
      ${recapHtml}
      <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(110,19,36,.2);">
        💳 <strong>${selectedPayment}</strong> → <strong style="color:var(--white);">${PAYMENT_ACCOUNTS[selectedPayment]}</strong><br>
        <span style="color:rgba(245,237,224,.5); font-size:11px;">Send <strong style="color:var(--gold2);">${formatPrice(cartTotal())}</strong> to the account above, then paste the transaction ID below.</span>
      </div>`;
  }

  document.getElementById('coStep1').style.display = 'none';
  document.getElementById('coStep2').style.display = 'block';
}

function goToStep1() {
  document.getElementById('coStep1').style.display = 'block';
  document.getElementById('coStep2').style.display = 'none';
}

function populateSeferList() {
  const dl = document.getElementById('seferList');
  if (!dl) return;
  dl.innerHTML = ADDIS_SEFERS.map(s => `<option value="${s}">`).join('');
}

function updateSeferMatch() {
  const val = document.getElementById('coSefer').value.trim();
  const box = document.getElementById('coDeliveryTimeBox');
  const dVal = document.getElementById('coDeliveryTimeVal');

  if (!val) {
    box.style.display = 'none';
    return;
  }

  // 1. Check exact match (case insensitive)
  const exactMatch = Object.keys(SEFER_DELIVERY_TIMES).find(s => s.toLowerCase() === val.toLowerCase());

  if (exactMatch) {
    dVal.textContent = SEFER_DELIVERY_TIMES[exactMatch];
    box.style.display = 'flex';
  } else {
    // 2. Check if the input is one of our sefers (contained within)
    const partialMatch = ADDIS_SEFERS.find(s => val.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(val.toLowerCase()));

    if (partialMatch && SEFER_DELIVERY_TIMES[partialMatch]) {
      dVal.textContent = SEFER_DELIVERY_TIMES[partialMatch];
      box.style.display = 'flex';
    } else {
      box.style.display = 'none';
    }
  }
}

function toggleSupportMenu() {
  document.getElementById('supportMenu').classList.toggle('open');
}

// Close support menu if clicking elsewhere
window.addEventListener('click', (e) => {
  const menu = document.getElementById('supportMenu');
  const btn = document.querySelector('.fab-support');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
    }
  }
});

async function shareLocation() {
  const btn = document.querySelector('.co-loc-btn');
  const statusEl = document.getElementById('coLocationStatus');
  const seferInput = document.getElementById('coSefer');

  if (!navigator.geolocation) {
    statusEl.textContent = "Geolocation is not supported by your browser.";
    statusEl.classList.add('error');
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');
  statusEl.textContent = "📍 Pinpointing your location...";
  statusEl.classList.remove('error');
  statusEl.classList.add('active');

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    userCoords = { lat, lon };

    try {
      // Reverse geocoding via Nominatim (OpenStreetMap)
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await res.json();

      const addr = data.address || {};
      const neighborhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.village || addr.hamlet || '';
      const fullText = (data.display_name || '').toLowerCase();

      // Find the best match from our ADDIS_SEFERS list
      let bestMatch = "";

      // 1. Precise check: find which sefer from the list string-matches the neighborhood or is contained in the full address
      for (const s of ADDIS_SEFERS) {
        if (fullText.includes(s.toLowerCase())) {
          bestMatch = s;
          break;
        }
      }

      if (bestMatch) {
        seferInput.value = bestMatch;
        statusEl.textContent = `📍 Success: ${bestMatch} detected!`;
        statusEl.className = 'co-loc-status active success';
      } else if (neighborhood) {
        seferInput.value = neighborhood; // Fallback if not in list
        statusEl.textContent = `📍 Success: ${neighborhood} detected!`;
        statusEl.className = 'co-loc-status active success';
      } else {
        statusEl.textContent = "📍 Location shared, but neighborhood name was unclear. Please specify below.";
        statusEl.className = 'co-loc-status active warning';
      }

    } catch (err) {
      console.error(err);
      statusEl.textContent = "📍 Location shared (GPS valid), but couldn't auto-detect the name. Please type it.";
      statusEl.className = 'co-loc-status active warning';
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }

  }, (err) => {
    btn.disabled = false;
    btn.classList.remove('loading');
    statusEl.textContent = "⚠ Access to location denied. Please enter it manually.";
    statusEl.className = 'co-loc-status active error';
  }, { enableHighAccuracy: true });
}

function takeSuccessScreenshot() {
  const btn = document.getElementById('saveReceiptBtn');
  if (btn) btn.textContent = "⏳ Saving...";
  const modal = document.getElementById('successModal');
  if (typeof html2canvas !== 'undefined') {
    html2canvas(modal, { backgroundColor: '#1C0C10', scale: 1.5, logging: false }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'Dagu_Perfume_Receipt.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.85);
      link.click();
      if (btn) {
        btn.style.background = '#1b5e20';
        btn.style.color = '#fff';
        btn.style.borderColor = '#1b5e20';
        btn.innerHTML = "✔ Saved!";
        setTimeout(() => {
          btn.style.background = 'rgba(200,160,80,.15)';
          btn.style.color = 'var(--gold)';
          btn.style.borderColor = 'rgba(200,160,80,.3)';
          btn.innerHTML = "📸 Save Receipt";
        }, 2000);
      }
    }).catch(e => {
      console.error(e);
      if (btn) btn.innerHTML = "📸 Save Receipt";
      alert("Please use your device screenshot feature to save the receipt.");
    });
  } else {
    if (btn) btn.innerHTML = "📸 Save Receipt";
    alert("Please use your device screenshot feature to save the receipt.");
  }
}

// ── ORDER SUBMISSION ───────────────────────────────────
// Validates checkout form, saves the order to Firestore, then triggers the Telegram alert.
// After success, clears the cart and shows the order confirmation modal with a reference ID.
async function submitOrder() {
  const txId = document.getElementById('coTxId').value.trim();
  const err = document.getElementById('coErr2');
  const btn = document.getElementById('coSubmitBtn');

  if (!txId && selectedPayment !== 'Cash') {
    err.textContent = '⚠ Please enter your transaction ID.';
    return;
  }
  if (selectedPayment !== 'Cash' && txId.length < 4) {
    err.textContent = '⚠ Transaction ID looks too short. Please check.';
    return;
  }
  err.textContent = '';

  btn.disabled = true;
  btn.textContent = 'Placing order…';

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const sefer = document.getElementById('coSefer').value.trim();
  const notes = document.getElementById('coNotes').value.trim();
  const total = cartTotal();
  const orderData = {
    customerName: name,
    customerPhone: phone,
    customerSefer: sefer,
    customerCoords: userCoords, // {lat, lon}
    paymentMethod: selectedPayment,
    transactionId: txId,
    deliveryNotes: notes,
    totalAmount: total,
    status: 'Pending',
    items: cart.map(i => ({ no: i.no, name: i.name, brand: i.brand, qty: i.qty, price: i.price, size: i.size }))
  };

  const dbData = {
    customer_name: name,
    customer_phone: phone,
    customer_sefer: sefer,
    customer_coords: userCoords,
    payment_method: selectedPayment,
    transaction_id: txId,
    delivery_notes: notes,
    total_amount: total,
    status: 'Pending',
    items: orderData.items
  };

  try {
    if (!supabase) {
      throw new Error("Supabase database not initialized. Please check credentials.");
    }

    // Insert order into Supabase
    const { data: insertedData, error } = await supabase
      .from('orders')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;

    closeCheckout();
    const ref = 'DGU-' + insertedData.id.slice(-6).toUpperCase();

    // Get screenshot file if any
    const fileInput = document.getElementById('coProof');
    const photo = fileInput && fileInput.files[0] ? fileInput.files[0] : null;

    // Send to Telegram
    sendOrderToTelegram(orderData, ref, photo);

    showSuccess(ref, name);
    cart = [];
    updateCartCount();

    // Reset button
    btn.disabled = false;
    btn.textContent = 'Place Order 🎉';
  } catch (error) {
    console.error("Error adding order document: ", error);
    err.textContent = '⚠ Error placing order. Please make sure Supabase is properly configured.';

    // Reset button
    btn.disabled = false;
    btn.textContent = 'Place Order 🎉';
  }
}

// ── TELEGRAM ORDER NOTIFICATION ────────────────────────
// Sends a beautifully formatted HTML message to the admin's Telegram channel.
// If a payment screenshot was uploaded, it's attached as a photo with the message as caption.
async function sendOrderToTelegram(order, ref, photoFile) {
  if (!TELEGRAM_CONFIG.enabled || TELEGRAM_CONFIG.token.includes('YOUR_BOT_TOKEN')) return;

  const clean = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const itemsList = order.items.map(i => {
    // Attempt to find the product in ALL to get the image URL if not in order data
    const prod = ALL.find(x => x.no === i.no);
    const imgUrl = prod ? prod.image : '';
    return `\n✨ <b>${clean(i.brand).toUpperCase()}</b>\n   └ <code>${clean(i.name)}</code>\n   └ <i>${clean(i.size)} | Qty: ${i.qty}</i>${imgUrl ? `\n   └ <a href="${imgUrl}">🖼️ View Product Photo</a>` : ''}`;
  }).join('\n');

  const message = `
<b>🌟 NEW EXCLUSIVE ORDER 🌟</b>
━━━━━━━━━━━━━━━━━━━━
<b>📄 REFERENCE:</b> <code>${ref}</code>
━━━━━━━━━━━━━━━━━━━━

<b>👤 CUSTOMER DETAILS</b>
• <b>NAME:</b> <b>${clean(order.customerName)}</b>
• <b>PHONE:</b> <code>${clean(order.customerPhone)}</code>

<b>💰 PAYMENT INFO</b>
• <b>METHOD:</b> ${clean(order.paymentMethod)}
• <b>TX ID:</b> <code>${clean(order.transactionId)}</code>
• <b>TOTAL:</b> <b><code>${formatPrice(order.totalAmount)}</code></b>

<b>📍 LOCATION</b>
• <b>SEFER:</b> <b>${clean(order.customerSefer)}</b>
• <b>DELIVERY:</b> <b>${SEFER_DELIVERY_TIMES[order.customerSefer] || 'To be confirmed'}</b>
${order.customerCoords ? `• <b>GPS:</b> <a href="https://www.google.com/maps?q=${order.customerCoords.lat},${order.customerCoords.lon}">View Pin on Map</a>` : '• <i>No GPS coordinates shared</i>'}

<b>📝 DELIVERY NOTES</b>
<i>${clean(order.deliveryNotes) || 'No specific instructions.'}</i>

<b>🛒 ORDERED ITEMS</b>
${itemsList}

━━━━━━━━━━━━━━━━━━━━
📌 <i>Received via Dagu Perfume Shop</i>
  `.trim();

  // If we have a photo file (screenshot), send that. Otherwise, try to send the first product photo as preview
  let mode = photoFile ? 'sendPhoto' : 'sendMessage';
  let content = photoFile ? photoFile : message;

  // If no screenshot but we have a product, we could send the first product's image as the main photo
  if (!photoFile && order.items.length > 0) {
    const firstProd = ALL.find(x => x.no === order.items[0].no);
    if (firstProd && firstProd.image) {
      mode = 'sendPhoto';
      content = firstProd.image; // Send URL as photo
    }
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/${mode}`;

  // Send to all configured chat IDs
  const chatIds = TELEGRAM_CONFIG.chatIds || (TELEGRAM_CONFIG.chatId ? [TELEGRAM_CONFIG.chatId] : []);

  for (const chatId of chatIds) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('parse_mode', 'HTML');

    if (mode === 'sendPhoto') {
      formData.append('photo', content);
      formData.append('caption', message);
    } else {
      formData.append('text', message);
    }

    try {
      await fetch(url, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.error(`Failed to send telegram notification to ${chatId}:`, err);
    }
  }
}

// ── ORDER SUCCESS MODAL ─────────────────────────────
// Shows the thank-you overlay with the order reference after a successful submission.
function showSuccess(ref, name) {
  document.getElementById('succMsg').textContent =
    `Thank you, ${name}! Your order has been received. We'll confirm once your payment is verified.`;
  document.getElementById('succRef').textContent = `Order Reference: ${ref}`;
  document.getElementById('successBackdrop').classList.add('open');
  document.getElementById('successModal').classList.add('open');
}

function closeSuccess() {
  document.getElementById('successBackdrop').classList.remove('open');
  document.getElementById('successModal').classList.remove('open');
}

// ── OPEN PANEL PATCH (IMAGE GALLERY + BUY BUTTON STATE) ─────────
// Wraps the original openPanel() to also reset the 'Buy Now' button and multi-image slider.
// Applied after page load to avoid breaking the base openPanel function definition.
const _origOpenPanel = openPanel;
let currentImgIndex = 0;

openPanel = function (no) {
  _origOpenPanel(no);
  currentPanelProduct = ALL.find(x => x.no === no) || null;
  const p = currentPanelProduct;
  if (!p) return;

  currentImgIndex = 0; // Reset index on open

  const btn = document.getElementById('dpAddCartBtn');
  if (btn) {
    btn.classList.remove('added');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Buy Now`;
    if (p && p.price === 'N/A') {
      btn.style.opacity = '0.4';
      btn.title = 'Price on request — please call us';
    } else {
      btn.style.opacity = '1';
      btn.title = '';
    }
  }

  // Update image slider in panel
  const bottleEl = document.getElementById('dpBottle');
  const imgWrap = document.getElementById('dpImg');

  // Remove any existing navigation buttons first
  const existingNavs = imgWrap.querySelectorAll('.dp-nav-btn');
  existingNavs.forEach(n => n.remove());

  const imgs = p.images || [p.image];
  if (imgs.length > 1) {
    // Add Next/Prev buttons
    imgWrap.insertAdjacentHTML('beforeend', `
       <button class="dp-nav-btn prev" onclick="changePanelImg(-1, event)">‹</button>
       <button class="dp-nav-btn next" onclick="changePanelImg(1, event)">›</button>
    `);
  }
};

function changePanelImg(delta, event) {
  if (event) event.stopPropagation();
  const p = currentPanelProduct;
  if (!p) return;
  const imgs = p.images || [p.image];
  if (imgs.length <= 1) return;

  currentImgIndex = (currentImgIndex + delta + imgs.length) % imgs.length;
  const bottleEl = document.getElementById('dpBottle');
  bottleEl.style.backgroundImage = `url('${imgs[currentImgIndex]}')`;
}
