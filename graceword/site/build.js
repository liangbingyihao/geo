'use strict';

const fs = require('fs');
const path = require('path');
const shared = require('./header-footer.js');
const { C } = require('./content.js');
const PRICING = require('./pricing.json');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(ROOT, 'assets');

const CDN = 'https://cdn.grace-word.com';
const LOGO_URL = CDN + '/home/logo.webp';

const LANGS = [
  { code: 'en', hreflang: 'en', htmlLang: 'en', dir: '' },
  { code: 'zh-CN', hreflang: 'zh-CN', htmlLang: 'zh-Hans', dir: 'zh-cn' },
  { code: 'zh-TW', hreflang: 'zh-TW', htmlLang: 'zh-Hant', dir: 'zh-tw' },
];

const A = {
  logo: LOGO_URL,
  believerBg: CDN + '/home/believer-bg.webp',
  believerBgMobile: CDN + '/home/believer-bg-mobile.webp',
  appStore: CDN + '/home/app-store.webp',
  googlePlay: CDN + '/home/google-play.webp',
  qr: CDN + '/assets/qr/sharedaily.png',
  prev: CDN + '/home/prev.webp',
  next: CDN + '/home/next.webp',
  feature1: CDN + '/home/feature-1.webp',
  feature2: CDN + '/home/feature-2.webp',
  feature3: CDN + '/home/feature-3.webp',
  feature4: CDN + '/home/feature-4.webp',
  iconPen: CDN + '/home/icon-pen.webp',
  iconMusic: CDN + '/home/icon-music.webp',
  iconStars: CDN + '/home/icon-stars.webp',
  iconArticle: CDN + '/home/icon-article.webp',
  iconAsk: CDN + '/home/icon-stars.webp',
  testimonial1: CDN + '/home/testimonial-1.webp',
  testimonial2: CDN + '/home/testimonial-2.webp',
  testimonial3: CDN + '/home/testimonial-3.webp',
  contactBg: CDN + '/home/contact-bg.webp',
  iconInstagram: CDN + '/home/icon-instagram.webp',
  iconFacebook: CDN + '/home/icon-facebook.webp',
  iconYoutube: CDN + '/home/icon-youtube.webp',
  // characters
  enoch: CDN + '/home/characters/enoch.webp',
  shalom: CDN + '/home/characters/shalom.webp',
  moses: CDN + '/home/characters/moses.webp',
  joshua: CDN + '/home/characters/joshua.webp',
  elijah: CDN + '/home/characters/elijah.webp',
  peter: CDN + '/home/characters/peter.webp',
  paul: CDN + '/home/characters/paul.webp',
  job: CDN + '/home/characters/job.webp',
  abigail: CDN + '/home/characters/abigail.webp',
  elizabeth: CDN + '/home/characters/elizabeth.webp',
  amos: CDN + '/home/characters/amos.webp',
  azariah: CDN + '/home/characters/azariah.webp',
  huldah: CDN + '/home/characters/huldah.webp',
  johnBaptist: CDN + '/home/characters/john-baptist.webp',
  samaritanWoman: CDN + '/home/characters/samaritan-woman.webp',
  thomas: CDN + '/home/characters/thomas.webp',
};

const BANNERS = {
  en: [1, 2, 3].map((n) => `${CDN}/home/banners/banner-en-${n}.webp`),
  'zh-CN': [1, 2, 3].map((n) => `${CDN}/home/banners/banner-zh-CN-${n}.webp`),
  'zh-TW': [1, 2, 3].map((n) => `${CDN}/home/banners/banner-zh-TW-${n}.webp`),
};

const QUIZ_ASSETS = ['enoch', 'shalom', 'moses', 'joshua', 'elijah', 'peter', 'paul', 'job', 'abigail', 'elizabeth', 'amos', 'azariah', 'huldah', 'johnBaptist', 'samaritanWoman', 'thomas'];

const APP_NAME = { en: 'GraceWord', 'zh-CN': '恩语', 'zh-TW': '恩語' };
const SITE_NAME = 'GraceWord';
const GA_ID = 'G-7CEHJHLWK1';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function bg(url) { return `background-image:url('${url}')`; }

function pagePath(page, lang) {
  const d = lang.dir ? '/' + lang.dir : '';
  if (page === 'home') return lang.dir ? `/${lang.dir}/` : '/';
  return `/${page}${d}/`;
}

function head({ page, lang, title, description, jsonLd, noindex }) {
  const canonical = 'https://grace-word.com' + pagePath(page, lang);
  const alts = LANGS.map((k) => `<link rel="alternate" hreflang="${k.hreflang}" href="https://grace-word.com${pagePath(page, k)}">`).join('\n');
  const xDefault = page === 'home' ? 'https://grace-word.com/' : `https://grace-word.com/${page}/`;
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${noindex ? '<meta name="robots" content="noindex,nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${alts}
<link rel="alternate" hreflang="x-default" href="${xDefault}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${CDN}/home/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${CDN}/home/og-cover.jpg">
<link rel="icon" type="image/webp" href="${LOGO_URL}">
<link rel="apple-touch-icon" href="${LOGO_URL}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${jsonLd}`;
}

function headerHtml(page, lang) {
  const langs = LANGS.map((k) => ({ code: k.code, label: shared.LANGS.find((l) => l.code === k.code).label, hreflang: k.hreflang }));
  return shared.header({ lang: lang.code, active: page === 'home' ? '' : page, langHref: (code) => pagePath(page, LANGS.find((k) => k.code === code)), langs });
}

function homeJsonLd(lang) {
  const appName = APP_NAME[lang.code];
  const reviews = (C[lang.code].home.testimonials || []).map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: 'GraceWord User' },
    reviewBody: t.text,
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  }));
  return `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: 'https://grace-word.com/', logo: { '@type': 'ImageObject', url: LOGO_URL } },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: 'https://grace-word.com/', inLanguage: lang.hreflang },
    { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: appName, applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android', url: 'https://grace-word.com/', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, brand: { '@type': 'Brand', name: SITE_NAME, logo: LOGO_URL }, review: reviews },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C[lang.code].home.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ])}</script>`;
}
function featuresJsonLd(lang) {
  const fp = C[lang.code].featuresPage;
  const list = fp.full && fp.full.length ? fp.full : fp.features;
  const items = list.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.title, description: f.desc }));
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: fp.title, inLanguage: lang.hreflang, mainEntity: { '@type': 'ItemList', itemListElement: items } })}</script>`;
}
function pricingJsonLd(lang) {
  const h = C[lang.code].pricingPage;
  const offers = [];
  for (const r of PRICING.regions) {
    offers.push({ '@type': 'Offer', name: `${h.premiumName} (${h.monthlyLabel})`, price: String(r.monthly), priceCurrency: r.currency, eligibleRegion: r.cc, url: shared.LINK.appStore });
    offers.push({ '@type': 'Offer', name: `${h.premiumName} (${h.yearlyLabel})`, price: String(r.yearly), priceCurrency: r.currency, eligibleRegion: r.cc, url: shared.LINK.appStore });
  }
  return `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: APP_NAME[lang.code], applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android', url: 'https://grace-word.com/', offers },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: h.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ])}</script>`;
}
function promoJsonLd(lang) {
  const h = C[lang.code].promoPage;
  const start = shared.PROMO.start;
  const end = shared.PROMO.end;
  return `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Offer',
      name: h.title,
      description: h.desc,
      price: '0',
      priceCurrency: 'USD',
      eligibleRegion: 'Worldwide',
      validFrom: start,
      validThrough: end,
      availability: 'https://schema.org/InStock',
      url: 'https://grace-word.com' + pagePath('promo', lang),
      offeredBy: { '@type': 'Organization', name: SITE_NAME, url: 'https://grace-word.com/' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: h.faqs.map((f) => ({ '@type': 'Question', name: f.q.replace(/\{start\}/g, start).replace(/\{end\}/g, end), acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\{start\}/g, start).replace(/\{end\}/g, end) } })) },
  ])}</script>`;
}
function aboutJsonLd(lang) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'AboutPage', name: C[lang.code].aboutPage.title, inLanguage: lang.hreflang, about: { '@type': 'Organization', name: SITE_NAME, founder: { '@type': 'Person', name: APP_NAME[lang.code] } } })}</script>`;
}

function featureCard(f, imageKey) {
  const cls = imageKey ? 'feature-card' : 'feature-card feature-card-plain';
  return `<div class="${cls}"${imageKey ? ` style="${bg(A[imageKey])}"` : ''}>
      <div class="feature-card-body">
        <img src="${A[f.icon]}" alt="">
        <div class="feature-card-text"><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
      </div>
    </div>`;
}

function renderHome(lang) {
  const h = C[lang.code].home;
  const banners = BANNERS[lang.code].map((src, i) => `<div class="banner-slide"><img class="banner-img" data-index="${i + 1}" src="${src}" alt=""></div>`).join('\n          ');
  const gridItems = h.features.map((f, i) => featureCard(f, 'feature' + (i + 1))).join('\n      ');
  const quizCards = h.quizChars.map((c, i) => `<div class="quiz-card"><div class="quiz-img-wrap"><img src="${A[QUIZ_ASSETS[i]]}" alt="${esc(c.name)}"><div class="quiz-img-mask"><h4>${esc(c.name)}</h4></div></div><div class="quiz-tag">${esc(c.tag)}</div></div>`).join('\n            ');
  const testimonials = h.testimonials.map((t, i) => `<div class="testimonial-card${i === 0 ? ' active' : ''}" style="${bg(A['testimonial' + (i + 1)])}"><div class="testimonial-card-content"><p>${esc(t.text)}</p></div></div>`).join('\n        ');
  const faqs = h.faqs.map((f, i) => `<div class="faq-item"><button class="faq-question${i === 0 ? ' open' : ''}">${esc(f.q)}</button><div class="faq-answer"><p>${esc(f.a)}</p></div></div>`).join('\n        ');

  return `<section class="believer" id="home">
  <picture>
    <source media="(max-width: 768px)" srcset="${A.believerBgMobile}">
    <img class="believer-bg" src="${A.believerBg}" alt="">
  </picture>
  <div class="believer-content">
    <div class="believer-text">
      <h1>${esc(h.heroTitle)}</h1>
      <p>${esc(h.heroDesc)}</p>
      <div class="believer-qr-wrap"><div class="believer-qr"><img src="${A.qr}" alt="QR"></div><span class="believer-qr-label">${esc(h.qrLabel)}</span></div>
    </div>
  </div>
  <div class="believer-buttons">
    <a href="${shared.LINK.appStore}" class="believer-btn" target="_blank" rel="noopener"><img src="${A.appStore}" alt="${esc(h.appStore)}"></a>
    <a href="${shared.LINK.googlePlay}" class="believer-btn" target="_blank" rel="noopener"><img src="${A.googlePlay}" alt="${esc(h.googlePlay)}"></a>
  </div>
</section>

<section class="section reveal" id="features">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.featuresTitle)}</h2>
    <div class="carousel-container">
      <button class="carousel-btn banner-prev" aria-label="Prev"><img src="${A.prev}" alt=""></button>
      <div class="carousel-track-wrap">
        <div class="banner-track">
          ${banners}
        </div>
      </div>
      <button class="carousel-btn banner-next" aria-label="Next"><img src="${A.next}" alt=""></button>
    </div>
    <div class="feature-grid-items">
      ${gridItems}
    </div>
    <div class="features-more"><a class="quiz-take-btn" href="/features${lang.dir ? '/' + lang.dir : ''}/">${esc(h.featuresLink)} →</a></div>
  </div>
</section>

<section class="section quiz-section reveal" id="quiz">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.quizTitle)}</h2>
    <p class="section-subtitle">${esc(h.quizDesc)}</p>
    <div class="quiz-carousel">
      <button class="quiz-nav quiz-prev" aria-label="Prev"><img src="${A.prev}" alt=""></button>
      <div class="quiz-track-wrap">
        <div class="quiz-track">
            ${quizCards}
        </div>
      </div>
      <button class="quiz-nav quiz-next" aria-label="Next"><img src="${A.next}" alt=""></button>
    </div>
    <a class="quiz-take-btn" href="/bibleti" target="_blank" rel="noopener">${esc(h.quizTake)}</a>
  </div>
</section>

<section class="section testimonials reveal">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.testimonialsTitle)}</h2>
    <div class="testimonial-cards">
        ${testimonials}
    </div>
  </div>
</section>

<section class="section faq-section reveal">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.faqTitle)}</h2>
    <div class="faq-list">
        ${faqs}
    </div>
  </div>
</section>`;
}

function renderFeatures(lang) {
  const h = C[lang.code].featuresPage;
  const cards = h.features.map((f, i) => featureCard(f, i < 4 ? 'feature' + (i + 1) : null)).join('\n      ');
  const full = (h.full || []).map((f) => `<li class="full-feature">
        <h3>${esc(f.title)}${f.tag ? ` <span class="feature-tag">${esc(f.tag)}</span>` : ''}</h3>
        <p>${esc(f.desc)}</p>
      </li>`).join('\n      ');
  return `<section class="page-hero">
  <h1>${esc(h.title)}</h1>
  <p>${esc(h.desc)}</p>
</section>
<section class="page-section">
  <div class="section-inner">
    <p class="section-subtitle">${esc(h.intro)}</p>
    <div class="feature-grid-items">${cards}</div>
    ${full ? `<h2 class="pricing-h2">${esc(h.fullTitle)}</h2>
    <p class="section-subtitle">${esc(h.fullDesc)}</p>
    <ul class="full-feature-list">${full}</ul>` : ''}
    <div class="features-more">
      <a class="quiz-take-btn" href="${shared.LINK.appStore}" target="_blank" rel="noopener">${esc(h.cta)}</a>
      <a class="quiz-take-btn secondary" href="${pagePath('pricing', lang)}">${esc(h.pricingLink)}</a>
    </div>
  </div>
</section>`;
}

function formatPrice(symbol, amount) {
  const n = Number(amount);
  const s = Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2);
  return `${symbol}${s}`;
}

function renderPricing(lang) {
  const h = C[lang.code].pricingPage;
  const diffRows = h.diff.map((d) => `<tr><td>${esc(d.name)}</td><td>${esc(d.free)}</td><td>${esc(d.premium)}</td></tr>`).join('\n        ');
  const chips = h.freeFeatures.map((f) => `<span class="free-chip">${esc(f)}</span>`).join('');
  const cards = PRICING.regions.map((r) => `<div class="price-card" data-region="${r.cc}">
        <h3>${esc(h.regionNames[r.cc] || r.cc)} <span class="price-cc">${r.cc}</span></h3>
        <div class="price-row"><span>${esc(h.monthlyLabel)}</span><strong>${formatPrice(r.symbol, r.monthly)}</strong></div>
        <div class="price-row"><span>${esc(h.yearlyLabel)}</span><strong>${formatPrice(r.symbol, r.yearly)}</strong></div>
        <div class="price-cur">${r.currency}</div>
      </div>`).join('\n      ');
  const faqs = h.faqs.map((f, i) => `<div class="faq-item"><button class="faq-question${i === 0 ? ' open' : ''}">${esc(f.q)}</button><div class="faq-answer"><p>${esc(f.a)}</p></div></div>`).join('\n        ');
  return `<section class="page-hero">
  <h1>${esc(h.title)}</h1>
  <p>${esc(h.intro)}</p>
</section>
<section class="page-section">
  <div class="section-inner pricing-wrap">
    <p class="pricing-note">${esc(h.freeAllNote)}</p>
    ${shared.promoActive() ? `<p class="pricing-promo"><a href="${pagePath('promo', lang)}">${esc(h.promoBanner)} →</a></p>` : ''}
    <h2 class="pricing-h2">${esc(h.diffTitle)}</h2>
    <div class="pricing-table-wrap">
      <table class="pricing-table">
        <thead><tr><th>${esc(h.diffColFeature)}</th><th>${esc(h.diffColFree)}</th><th>${esc(h.diffColPremium)}</th></tr></thead>
        <tbody>
        ${diffRows}
        </tbody>
      </table>
    </div>
    <h2 class="pricing-h2">${esc(h.freeFeaturesTitle)}</h2>
    <div class="free-chips">${chips}</div>
    <h2 class="pricing-h2">${esc(h.priceTitle)}</h2>
    <p class="pricing-sub">${esc(h.priceSub)}</p>
    <div class="price-cards">
      ${cards}
    </div>
    <p class="pricing-updated">${esc(h.updatedLabel)}: ${esc(PRICING.lastVerified)}</p>
    <p class="pricing-disclaimer">${esc(h.disclaimer)}</p>
    <div class="pricing-cta"><a class="quiz-take-btn" href="${shared.LINK.appStore}" target="_blank" rel="noopener">${esc(h.cta)}</a></div>
    <p class="pricing-links"><a href="${pagePath('features', lang)}">${esc(h.viewFeatures)}</a></p>
  </div>
</section>
<section class="section faq-section">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.faqTitle)}</h2>
    <div class="faq-list">
        ${faqs}
    </div>
  </div>
</section>
<script type="application/json" id="pricingData">${JSON.stringify(PRICING.regions)}</script>`;
}

function renderPromo(lang) {
  const h = C[lang.code].promoPage;
  const active = shared.promoActive();
  const start = shared.PROMO.start;
  const end = shared.PROMO.end;
  const rep = (s) => String(s).replace(/\{start\}/g, start).replace(/\{end\}/g, end);
  const offerItems = h.offerItems.map((i) => `<li>${esc(i)}</li>`).join('\n            ');
  const terms = h.terms.map((i) => `<li>${esc(rep(i))}</li>`).join('\n            ');
  const steps = h.steps.map((s, i) => `<li><span class="promo-step-num">${i + 1}</span><span>${esc(rep(s))}</span></li>`).join('\n          ');
  const faqs = h.faqs.map((f, i) => `<div class="faq-item"><button class="faq-question${i === 0 ? ' open' : ''}">${esc(rep(f.q))}</button><div class="faq-answer"><p>${esc(rep(f.a))}</p></div></div>`).join('\n        ');
  const form = active
    ? `<form class="newsletter-form promo-form" id="promoForm" action="#" method="post" novalidate
        data-ok="${esc(h.formOk)}" data-err="${esc(h.formErr)}" data-invalid="${esc(h.formInvalid)}">
        <input class="newsletter-input" type="email" name="email" placeholder="${esc(h.formPlaceholder)}" required aria-label="${esc(h.formPlaceholder)}" autocomplete="email">
        <button class="newsletter-btn" type="submit">${esc(h.formBtn)}</button>
      </form>
      <p class="newsletter-msg promo-msg" role="status" aria-live="polite"></p>`
    : `<p class="promo-ended">${esc(h.ended)}</p>`;
  return `<section class="page-hero">
  <h1>${esc(h.title)}</h1>
  <p>${esc(h.heroDesc)}</p>
</section>
<section class="page-section">
  <div class="section-inner promo-wrap">
    <div class="promo-dates">${esc(h.datesLabel)}: ${esc(start)} – ${esc(end)}</div>
    <div class="promo-grid">
      <div class="promo-card">
        <h2 class="promo-h2">${esc(h.offerTitle)}</h2>
        <ul class="promo-list">${offerItems}</ul>
      </div>
      <div class="promo-card">
        <h2 class="promo-h2">${esc(h.termsTitle)}</h2>
        <ul class="promo-list">${terms}</ul>
      </div>
    </div>
    <h2 class="pricing-h2">${esc(h.stepsTitle)}</h2>
    <ol class="promo-steps">${steps}</ol>
    <div class="promo-form-box">
      <h2 class="pricing-h2">${esc(h.formTitle)}</h2>
      <p class="pricing-sub">${esc(h.formSub)}</p>
      ${form}
      <p class="promo-note">${esc(h.formNote)}</p>
    </div>
    <div class="pricing-cta"><a class="quiz-take-btn" href="${shared.LINK.appStore}" target="_blank" rel="noopener">${esc(h.cta)}</a></div>
    <p class="pricing-links"><a href="${pagePath('pricing', lang)}">${esc(h.backPricing)}</a></p>
  </div>
</section>
<section class="section faq-section">
  <div class="section-inner">
    <h2 class="section-title">${esc(h.faqTitle)}</h2>
    <div class="faq-list">
        ${faqs}
    </div>
  </div>
</section>
<script type="application/json" id="promoData">${JSON.stringify({ endpoint: shared.PROMO.endpoint })}</script>`;
}

function renderAbout(lang) {
  const h = C[lang.code].aboutPage;
  const paras = h.story.map((p) => `<p>${esc(p)}</p>`).join('\n');
  return `<section class="page-hero">
  <h1>${esc(h.title)}</h1>
  <p>${esc(h.desc)}</p>
</section>
<section class="page-section">
  <div class="about-prose">${paras}</div>
  <div class="about-video-wrap">
    <h2 class="about-video-title">${esc(h.videoTitle)}</h2>
    <video class="about-video" controls preload="metadata" playsinline poster="https://cdn.grace-word.com/assets/video/about-me-poster.jpg">
      <source src="https://cdn.grace-word.com/assets/video/about-me.mp4" type="video/mp4">
    </video>
  </div>
</section>`;
}

const RENDER = { home: renderHome, features: renderFeatures, about: renderAbout, pricing: renderPricing, promo: renderPromo };
const JSONLD = { home: homeJsonLd, features: featuresJsonLd, about: aboutJsonLd, pricing: pricingJsonLd, promo: promoJsonLd };

function pageTitle(page, lang) {
  const app = APP_NAME[lang.code];
  if (page === 'home') return `${app} — ${lang.code === 'en' ? 'Daily Devotion & Bible Quiz' : '每日靈修與聖經測驗'}`;
  if (page === 'features') return `${C[lang.code].featuresPage.title} — ${app}`;
  if (page === 'pricing') return `${C[lang.code].pricingPage.title} — ${app}`;
  if (page === 'promo') return `${C[lang.code].promoPage.title} — ${app}`;
  return `${C[lang.code].aboutPage.title} — ${app}`;
}
function pageDesc(page, lang) {
  if (page === 'home') return C[lang.code].home.heroDesc;
  if (page === 'features') return C[lang.code].featuresPage.desc;
  if (page === 'pricing') return C[lang.code].pricingPage.desc;
  if (page === 'promo') return C[lang.code].promoPage.desc;
  return C[lang.code].aboutPage.desc;
}

function buildPages() {
  for (const page of ['home', 'features', 'about', 'pricing', 'promo']) {
    for (const lang of LANGS) {
      const html = `<!DOCTYPE html>
<html lang="${lang.htmlLang}">
<head>
${head({ page, lang, title: pageTitle(page, lang), description: pageDesc(page, lang), jsonLd: JSONLD[page](lang), noindex: page === 'promo' && !shared.promoActive() })}
</head>
<body>
${headerHtml(page, lang)}
${RENDER[page](lang)}
${shared.footer({ lang: lang.code })}
<script src="/main.js"></script>
</body>
</html>`;
      const dir = path.join(DIST, page === 'home' ? '.' : page, lang.dir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }
}

function buildSitemap() {
  const urls = [];
  for (const page of ['home', 'features', 'about', 'pricing']) {
    for (const lang of LANGS) {
      const alts = LANGS.map((k) => `<xhtml:link rel="alternate" hreflang="${k.hreflang}" href="https://grace-word.com${pagePath(page, k)}"/>`).join('\n      ');
      urls.push(`  <url>\n    <loc>https://grace-word.com${pagePath(page, lang)}</loc>\n    ${alts}\n  </url>`);
    }
  }
  if (shared.promoActive()) {
    for (const lang of LANGS) {
      const alts = LANGS.map((k) => `<xhtml:link rel="alternate" hreflang="${k.hreflang}" href="https://grace-word.com${pagePath('promo', k)}"/>`).join('\n      ');
      urls.push(`  <url>\n    <loc>https://grace-word.com${pagePath('promo', lang)}</loc>\n    ${alts}\n  </url>`);
    }
  }
  urls.push(`  <url>\n    <loc>https://grace-word.com/bibleti</loc>\n  </url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
}

function buildLlmsTxt() {
  const domain = 'https://grace-word.com';
  let arts = [];
  let cats = {};
  try {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, '..', 'blog', 'build', 'articles.json'), 'utf8'));
    arts = data.articles || [];
    cats = data.categories || {};
  } catch (e) {
    console.warn('llms.txt: articles.json 读取失败，跳过文章列表：', e.message);
  }
  const lines = [
    '# GraceWord',
    '',
    '> Daily devotion & Bible study app for Christians — Bible quiz, gratitude journal, verse wallpapers, and worship music. Available in English, 简体中文 (zh-CN), and 繁體中文 (zh-TW).',
    '',
    '## Primary URLs',
    '',
    '- [Home (English)](' + domain + '/)',
    '- [Home (简体中文)](' + domain + '/zh-cn/)',
    '- [Home (繁體中文)](' + domain + '/zh-tw/)',
    '- [Features](' + domain + '/features/)',
    '- [About / Our Story](' + domain + '/about/)',
    '- [Pricing](' + domain + '/pricing/)',
    '- [Bible Quiz](' + domain + '/bibleti)',
    '- [Podcast](' + domain + '/podcast/)',
    '- [Blog](' + domain + '/blog/)',
    '',
  ];
  if (arts.length) {
    lines.push('## Blog Articles');
    lines.push('');
    for (const a of arts) {
      const catLabel = cats[a.category] ? cats[a.category].labelEn : '';
      lines.push('- [' + esc(a.titleEn) + '](' + domain + '/blog/' + a.slug + '/) — ' + catLabel +
        ' · [简体](' + domain + '/blog/' + a.slug + '/zh-cn/)' +
        ' · [繁體](' + domain + '/blog/' + a.slug + '/zh-tw/)');
    }
  }
  lines.push('');
  fs.writeFileSync(path.join(DIST, 'llms.txt'), lines.join('\n'));
}

function copyAssets() {
  const contentCss = fs.readFileSync(path.join(ASSETS_DIR, 'style.css'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'style.css'), shared.HEADER_CSS + '\n' + contentCss);
  const contentJs = fs.readFileSync(path.join(ASSETS_DIR, 'main.js'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'main.js'), shared.HEADER_JS + '\n' + contentJs);
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyAssets();
  buildPages();
  buildSitemap();
  buildLlmsTxt();
  console.log('Site build complete →', DIST);
}

main();