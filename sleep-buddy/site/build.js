'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const shared = require('./header-footer.js');
const { C } = require('./content.js');

let ASSET_V = 'v1';

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(ROOT, 'assets');

const CDN = 'https://cdn.sleep-buddy.com/home/images';
const LOGO_URL = CDN + '/logo.webp';
const OG_IMAGE = 'https://cdn.sleep-buddy.com/home/og-cover.jpg';
const SITE_URL = 'https://sleep-buddy.com';

const APP_NAME = { en: 'SleepBuddy', 'zh-CN': '睡了么', 'zh-TW': '睡了麼' };
const SITE_NAME = 'SleepBuddy';
const GA_ID = 'G-9Q51E91RER';

const LANGS = [
  { code: 'en', hreflang: 'en', htmlLang: 'en', dir: '' },
  { code: 'zh-CN', hreflang: 'zh-CN', htmlLang: 'zh-Hans', dir: 'zh-cn' },
  { code: 'zh-TW', hreflang: 'zh-TW', htmlLang: 'zh-Hant', dir: 'zh-tw' },
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pagePath(page, lang) {
  const d = lang.dir ? '/' + lang.dir : '';
  if (page === 'home') return lang.dir ? `/${lang.dir}/` : '/';
  return `/${page}${d}/`;
}

function head({ page, lang, title, description, jsonLd }) {
  const canonical = SITE_URL + pagePath(page, lang);
  const alts = LANGS.map((k) => `<link rel="alternate" hreflang="${k.hreflang}" href="${SITE_URL}${pagePath(page, k)}">`).join('\n');
  const xDefault = SITE_URL + (page === 'home' ? '/' : `/${page}/`);
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" type="image/webp" href="${LOGO_URL}">
<link rel="apple-touch-icon" href="${LOGO_URL}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css?v=${ASSET_V}">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${jsonLd}`;
}

function homeJsonLd(lang) {
  const h = C[lang.code].home;
  const appName = APP_NAME[lang.code];
  return `<script type="application/ld+json">${JSON.stringify([
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME,
      url: SITE_URL + '/', logo: { '@type': 'ImageObject', url: LOGO_URL },
      sameAs: [shared.LINK.facebook, shared.LINK.appStore],
      contactPoint: { '@type': 'ContactPoint', email: 'support@sleep-buddy.com', contactType: 'customer support' },
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/', inLanguage: lang.hreflang },
    {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: appName,
      applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
      url: SITE_URL + '/', applicationSubCategory: 'Sleep & Health',
      description: h.heroDesc,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free download; free friend pairing and sleep reports — the Bedtime Lock Screen requires a subscription' },
      brand: { '@type': 'Brand', name: SITE_NAME, logo: LOGO_URL },
      featureList: h.features.map((f) => f.title),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: h.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripMdLinks(f.a) } })),
    },
  ])}</script>`;
}

function featuresJsonLd(lang) {
  const fp = C[lang.code].featuresPage;
  const items = fp.features.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.title, description: f.desc }));
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebPage', name: fp.title, inLanguage: lang.hreflang,
    mainEntity: { '@type': 'ItemList', itemListElement: items },
  })}</script>`;
}

function mdLinks(s) {
  return String(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
function stripMdLinks(s) {
  return String(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

function faqHtml(faqs) {
  return faqs.map((f, i) => `<div class="faq-item" id="faq-${i + 1}"><button class="faq-question${i === 0 ? ' open' : ''}">${esc(f.q)}</button><div class="faq-answer"><p>${mdLinks(esc(f.a))}</p></div></div>`).join('\n        ');
}

function renderHome(lang) {
  const h = C[lang.code].home;
  const dir = lang.dir ? '/' + lang.dir : '';
  const slides = h.features.map((f, i) => `
      <div class="carousel-slide${i === 0 ? ' active' : ''}" data-index="${i}">
        <img src="${CDN}/slices/${f.img}" alt="${esc(f.title)}" loading="lazy">
      </div>`).join('\n');
  const dots = h.features.map((f, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}" data-dot="${i}"></span>`).join('');
  const summary = h.features.map((f, i) => `
      <div class="features-summary-item${i === 0 ? ' active' : ''}" data-index="${i}">
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.short || f.desc)}</p>
      </div>`).join('\n');
  const faqs = faqHtml(h.faqs);
  return `<section class="banner" id="home">
  <picture>
    <source media="(max-width: 768px)" srcset="${CDN}/banner-m.webp?v=2">
    <img class="banner-bg" src="${CDN}/banner.webp" alt="">
  </picture>
  <div class="banner-content">
    <div class="banner-text">
      <h1>${esc(h.heroTitle)}</h1>
      <p>${esc(h.heroDesc)}</p>
      <div class="banner-qr"><img src="${CDN}/qr_download.png" alt="${esc(h.qrLabel)}"></div>
    </div>
  </div>
  <div class="banner-buttons">
    <a href="${shared.LINK.appStore}" target="_blank" rel="noopener"><img src="${CDN}/app-store.webp" alt="${esc(h.appStore)}"></a>
    <a href="${shared.LINK.googlePlay}" target="_blank" rel="noopener"><img src="${CDN}/google-play.webp" alt="${esc(h.googlePlay)}"></a>
  </div>
</section>

<section class="section-features" id="features">
  <div class="features-title-bar">
    <h2>${esc(h.featuresTitle)}</h2>
    <div class="features-divider" id="dividerTop"></div>
  </div>
  <div class="features-main">
    <div class="carousel-wrap" id="carouselWrap">
      <div class="carousel-track">
        ${slides}
      </div>
      <button class="carousel-arrow prev" id="carouselPrev" aria-label="Previous slide"><img src="${CDN}/arrow-prev.webp" alt=""></button>
      <button class="carousel-arrow next" id="carouselNext" aria-label="Next slide"><img src="${CDN}/arrow-next.webp" alt=""></button>
      <div class="carousel-dots" id="carouselDots">
        ${dots}
      </div>
    </div>
  </div>
  <div class="features-summary">
    ${summary}
  </div>
  <div class="features-more"><a href="/features${dir}/">${esc(h.featuresLink)} →</a></div>
</section>

<section class="faq-section" id="faq">
  <div class="faq-inner">
    <h2>${esc(h.faqTitle)}</h2>
    <div class="faq-list">
      ${faqs}
    </div>
  </div>
</section>`;
}

function renderFeatures(lang) {
  const fp = C[lang.code].featuresPage;
  const cards = fp.features.map((f) => `
      <div class="feature-card feature-card-plain">
        <div class="feature-card-body">
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.desc)}</p>
        </div>
      </div>`).join('\n');
  const full = fp.full.map((f) => {
    const quote = f.quote
      ? `<blockquote class="full-feature-quote"><a href="${esc(f.src)}" target="_blank" rel="noopener"><span class="quote-en">“${esc(f.quote)}”</span>${f.quoteZh ? ` <span class="quote-zh">（${esc(f.quoteZh)}）</span>` : ''}${f.tag ? ` <span class="quote-src">— ${esc(f.tag)}</span>` : ''}</a></blockquote>`
      : '';
    return `<li class="full-feature">
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
        ${quote}
      </li>`;
  }).join('\n      ');
  return `<section class="page-hero">
  <h1>${esc(fp.title)}</h1>
  <p>${esc(fp.desc)}</p>
</section>
<section class="page-section">
  <div class="page-inner">
    <p class="page-subtitle">${esc(fp.intro)}</p>
    <div class="feature-cards">${cards}</div>
    <h2 class="page-h2">${esc(fp.fullTitle)}</h2>
    <p class="page-subtitle">${esc(fp.fullDesc)}</p>
    <ul class="full-feature-list">${full}</ul>
    <div class="features-more">
      <a class="cta-btn" href="${shared.LINK.appStore}" target="_blank" rel="noopener">${esc(fp.cta)}</a>
    </div>
    ${fp.pricingNote ? `<p class="pricing-note">${esc(fp.pricingNote)}</p>` : ''}
  </div>
</section>`;
}

const RENDER = { home: renderHome, features: renderFeatures };
const JSONLD = { home: homeJsonLd, features: featuresJsonLd };

function pageTitle(page, lang) {
  if (page === 'features') return C[lang.code].featuresPage.title;
  return C[lang.code].home.heroTitle;
}
function pageDesc(page, lang) {
  if (page === 'features') return C[lang.code].featuresPage.desc;
  return C[lang.code].home.heroDesc;
}

function buildPages() {
  for (const page of ['home', 'features']) {
    for (const lang of LANGS) {
      const html = `<!DOCTYPE html>
<html lang="${lang.htmlLang}">
<head>
${head({ page, lang, title: pageTitle(page, lang), description: pageDesc(page, lang), jsonLd: JSONLD[page](lang) })}
</head>
<body>
${shared.header({ lang: lang.code, active: page === 'features' ? 'features' : '', langHref: (code) => pagePath(page, LANGS.find((k) => k.code === code)) })}
${RENDER[page](lang)}
${shared.footer({ lang: lang.code })}
<script src="/main.js?v=${ASSET_V}"></script>
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
  for (const page of ['home', 'features']) {
    for (const lang of LANGS) {
      const alts = LANGS.map((k) => `<xhtml:link rel="alternate" hreflang="${k.hreflang}" href="${SITE_URL}${pagePath(page, k)}"/>`).join('\n      ');
      urls.push(`  <url>\n    <loc>${SITE_URL}${pagePath(page, lang)}</loc>\n    ${alts}\n  </url>`);
    }
  }
  for (const u of ['/activity/sleep-holy-temple', '/activity/sleep-daily-encourage']) {
    urls.push(`  <url>\n    <loc>${SITE_URL}${u}</loc>\n  </url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
}

function buildLlmsTxt() {
  const lines = [
    '# SleepBuddy',
    '',
    '> Bedtime lock screen & social accountability app for healthier sleep — follow friends, lock your phone at bedtime, and fall asleep early together. Available in English, 简体中文 (zh-CN), and 繁體中文 (zh-TW).',
    '',
    '## Primary URLs',
    '',
    '- [Home (English)](' + SITE_URL + '/)',
    '- [Home (简体中文)](' + SITE_URL + '/zh-cn/)',
    '- [Home (繁體中文)](' + SITE_URL + '/zh-tw/)',
    '- [Features](' + SITE_URL + '/features/)',
    '- [Articles](' + SITE_URL + '/blog/)',
    '',
  ];
  try {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, '..', 'blog', 'build', 'articles.json'), 'utf8'));
    const arts = data.articles || [];
    const cats = data.categories || {};
    if (arts.length) {
      lines.push('## Articles');
      lines.push('');
      for (const a of arts) {
        const catLabel = cats[a.category] ? cats[a.category].labelEn : '';
        lines.push('- [' + a.titleEn + '](' + SITE_URL + '/blog/' + a.slug + '/) — ' + catLabel +
          ' · [简体](' + SITE_URL + '/blog/' + a.slug + '/zh-cn/)' +
          ' · [繁體](' + SITE_URL + '/blog/' + a.slug + '/zh-tw/)');
      }
      lines.push('');
    }
  } catch (e) {
    console.warn('llms.txt: sleepbuddy articles.json 读取失败，跳过文章列表：', e.message);
  }
  fs.writeFileSync(path.join(DIST, 'llms.txt'), lines.join('\n'));
}

function copyAssets() {
  const contentCss = fs.readFileSync(path.join(ASSETS_DIR, 'style.css'), 'utf8');
  const builtCss = shared.HEADER_CSS + '\n' + contentCss;
  fs.writeFileSync(path.join(DIST, 'style.css'), builtCss);
  const contentJs = fs.readFileSync(path.join(ASSETS_DIR, 'main.js'), 'utf8');
  const builtJs = shared.HEADER_JS + '\n' + contentJs;
  fs.writeFileSync(path.join(DIST, 'main.js'), builtJs);
  const hash = crypto.createHash('md5').update(builtCss + builtJs).digest('hex').slice(0, 8);
  ASSET_V = hash;
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyAssets();
  buildPages();
  buildSitemap();
  buildLlmsTxt();
  console.log('SleepBuddy site build complete →', DIST);
}

main();
