'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { marked } = require('marked');
const OpenCC = require('opencc-js');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, '20260702');
// 环境可配：SITE_URL 控制绝对 URL 基址，OUT_DIR 控制产物目录
const DIST = path.join(ROOT, process.env.OUT_DIR || 'dist');
const ASSETS = path.join(__dirname, 'assets');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const site = manifest.site;
const cats = manifest.categories;
const articles = manifest.articles;
const slugAliases = manifest.slugAliases || {};
const DOMAIN = (process.env.SITE_URL || site.domain).replace(/\/$/, '');
const NOINDEX = process.env.NOINDEX === '1';

// CDN-hosted assets & logo
const CDN = 'https://cdn.grace-word.com';
const LOGO_URL = CDN + '/home/logo.webp';
// Universal download entry (root-relative so it works on any host, incl. test)
const DOWNLOAD_URL = '/action/download';
const SOCIAL = {
  instagram: 'https://www.instagram.com/graceword_love_you/',
  facebook: 'https://www.facebook.com/profile.php?id=61584842382498',
  youtube: 'https://www.youtube.com/@GraceWord-Love-You',
};
const SOCIAL_ICONS = {
  instagram: CDN + '/home/icon-instagram.webp',
  facebook: CDN + '/home/icon-facebook.webp',
  youtube: CDN + '/home/icon-youtube.webp',
};
const GA_ID = 'G-7CEHJHLWK1';
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap';
const VERSION = site.version || '20260702';

function assetUrl(file) {
  const p = path.join(ASSETS, file);
  let hash = '';
  try {
    hash = crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
  } catch (e) {
    hash = VERSION;
  }
  return `${CDN}/blog/${file}?v=${hash}`;
}

const CSS_URL = assetUrl('style.css');
const JS_URL = assetUrl('main.js');

/* ---------------------------------------------------------------- languages */

// Simplified -> Traditional (Taiwan standard), with a couple of corrections
// for religious terminology where OpenCC's dictionary is over-aggressive.
const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' });
function toTraditional(s) {
  return s2t(s).replace(/靈脩/g, '靈修').replace(/軟件/g, '軟體');
}

const LANGS = {
  en: { code: 'en', hreflang: 'en', htmlLang: 'en', dir: '', label: 'EN' },
  'zh-CN': { code: 'zh-CN', hreflang: 'zh-CN', htmlLang: 'zh-Hans', dir: 'zh-cn', label: '简体' },
  'zh-TW': { code: 'zh-TW', hreflang: 'zh-TW', htmlLang: 'zh-Hant', dir: 'zh-tw', label: '繁體' },
};
const LANG_KEYS = Object.keys(LANGS);

const UI = {
  en: {
    appName: 'GraceWord',
    home: 'Home',
    blog: 'Blog',
    heroTitle: 'Blog',
    heroSubtitle: 'Scripture, devotion, and practical faith — resources to deepen your daily walk with God.',
    searchPlaceholder: 'Search articles...',
    catAll: 'All',
    readMore: 'Read More →',
    published: 'Published',
    related: 'Related Articles',
    stickyTagline: 'Scripture · Worship · Devotion',
    stickyBtn: 'Get the App →',
    followTitle: 'Stay Connected',
    followDesc: 'Follow us for daily inspiration',
  },
  'zh-CN': {
    appName: '恩语',
    home: '首页',
    blog: '博客',
    heroTitle: '博客',
    heroSubtitle: '经文、灵修与实用信仰——帮助你深化与神同行之路的资源。',
    searchPlaceholder: '搜索文章...',
    catAll: '全部',
    readMore: '阅读全文 →',
    published: '发布于',
    related: '相关文章',
    stickyTagline: '经文 · 敬拜 · 灵修',
    stickyBtn: '下载恩语 →',
    followTitle: '保持联系',
    followDesc: '关注我们获取每日灵感',
  },
};
UI['zh-TW'] = Object.fromEntries(Object.entries(UI['zh-CN']).map(([k, v]) => [k, toTraditional(v)]));

function t(lang, key) {
  return UI[lang][key];
}

for (const k in cats) cats[k].labelTw = toTraditional(cats[k].labelZh);
function catLabel(cat, lang) {
  if (lang === 'en') return cat.labelEn;
  if (lang === 'zh-CN') return cat.labelZh;
  return cat.labelTw;
}

marked.setOptions({ gfm: true, breaks: false });

/* ---------------------------------------------------------------- helpers */

function readMd(article, lang) {
  const suffix = lang === 'en' ? 'en' : 'zh';
  const f = path.join(SRC, `article-${article.id}-${suffix}.md`);
  return fs.readFileSync(f, 'utf8');
}

// Split leading H1 off a markdown document.
function stripH1(md) {
  const lines = md.split('\n');
  let out = [];
  let skipped = false;
  for (const line of lines) {
    if (!skipped && /^#\s+/.test(line)) { skipped = true; continue; }
    if (skipped && line.trim() === '' && out.length === 0) continue;
    out.push(line);
  }
  return out.join('\n');
}

// Convert markdown emphasis (`**bold**`, `*italic*`) to inline HTML up front.
// This sidesteps a CommonMark flanking-delimiter bug where `**text**` adjacent
// to CJK characters (e.g. `**经文**说：`) is left partially unrendered.
function preprocessEmphasis(md) {
  return md
    .split('\n')
    .map((line) => {
      if (line.indexOf('*') === -1) return line;
      line = line.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
      return line;
    })
    .join('\n');
}

function renderMarkdown(md) {
  return marked.parse(preprocessEmphasis(md));
}

// Inject in-body cross-links: wrap the FIRST occurrence of each anchor phrase
// (per language) in a language-aware relative link. Phrases must exist verbatim
// in the article body; misses are reported so they can be fixed.
function injectCrossLinks(bodyMd, article, lang) {
  const links = article.crossLinks || [];
  let out = bodyMd;
  for (const link of links) {
    const phrase = lang === 'en' ? link.en
      : lang === 'zh-CN' ? link.zh : toTraditional(link.zh);
    if (!phrase) continue;
    const idx = out.indexOf(phrase);
    if (idx === -1) {
      console.warn(`  [crosslink MISS] ${article.id} -> ${link.slug} (${lang}): "${phrase}"`);
      continue;
    }
    out = out.slice(0, idx) + `[${phrase}](${slugToPath(link.slug, lang)})` + out.slice(idx + phrase.length);
  }
  return out;
}

function cleanInline(s) {
  return s
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function mdToText(md) {
  const html = marked.parse(preprocessEmphasis(md));
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/www\.grace-word\.com/g, 'grace-word.com')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDescription(md) {
  const lines = md.split('\n');
  let out = '';
  for (const line of lines) {
    const s = line.trim();
    if (!s || s.startsWith('#') || s.startsWith('|') || s.startsWith('>') || s === '---') continue;
    out += ' ' + cleanInline(s);
    if (out.length > 165) break;
  }
  out = out.trim();
  if (out.length > 158) out = out.slice(0, 158).replace(/\s+\S*$/, '') + '…';
  return out;
}

function extractFaq(md) {
  const lines = md.split('\n');
  let i = lines.findIndex((l) => /^##\s+(Frequently Asked Questions|常见问题解答|常見問題解答)/i.test(l.trim()));
  if (i < 0) return [];

  const questionOf = (line) => {
    const s = line.trim();
    if (/^###\s+/.test(s)) return cleanInline(s.replace(/^###\s+/, ''));
    if (/^\*\*.*\*\*$/.test(s)) {
      return cleanInline(s.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^\d+\.\s*/, ''));
    }
    return null;
  };

  const faq = [];
  let cur = null;
  for (i++; i < lines.length; i++) {
    const s = lines[i].trim();
    if (s === '---') break;
    if (/^##\s+/.test(s)) break;
    const q = questionOf(lines[i]);
    if (q) {
      if (cur && cur.a.length) faq.push(cur);
      cur = { q, a: [] };
    } else if (cur && s) {
      cur.a.push(lines[i]);
    }
  }
  if (cur && cur.a.length) faq.push(cur);

  return faq.map((f) => ({ question: f.q, answer: mdToText(f.a.join('\n')) }));
}

function readingTime(md, lang) {
  const mins = Math.max(1, Math.round(mdToText(md).split(/\s+/).length / 200));
  if (lang === 'en') return `${mins} min read`;
  return lang === 'zh-TW' ? `約 ${mins} 分鐘` : `约 ${mins} 分钟`;
}

function slugToPath(slug, lang) {
  const dir = LANGS[lang].dir;
  return dir ? `/blog/${slug}/${dir}/` : `/blog/${slug}/`;
}

function blogListPath(lang) {
  const dir = LANGS[lang].dir;
  return dir ? `/blog/${dir}/` : `/blog/`;
}

function langUrls(slug) {
  const o = {};
  for (const lang of LANG_KEYS) o[lang] = slug ? slugToPath(slug, lang) : blogListPath(lang);
  return o;
}

function normalizeSlug(slug) {
  return slugAliases[slug] || slug;
}

function rewriteLinks(html, lang) {
  html = html.replace(/href="https?:\/\/(?:www\.)?grace-word\.com\/blog\/([a-z0-9-]+)\/?"/g, (m, slug) => {
    return `href="${slugToPath(normalizeSlug(slug), lang)}"`;
  });
  // Bare /blog listing link -> language-aware blog list
  html = html.replace(/href="https?:\/\/(?:www\.)?grace-word\.com\/blog\/?"/g, `href="${blogListPath(lang)}"`);
  html = html.replace(/href="https?:\/\/(?:www\.)?grace-word\.com\/?"/g, 'href="/"');
  html = html.replace(/>((?:https?:\/\/)?(?:www\.)?grace-word\.com)?\/blog\/([a-z0-9-]+)\/?</g, (m, pre, slug) => {
    return `>${slugToPath(normalizeSlug(slug), lang)}<`;
  });
  html = html.replace(/>www\.grace-word\.com</g, '>grace-word.com<');
  return html;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------------------------------------------------------------- schema */

const SOFTWARE_APP = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GraceWord',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'iOS, Android',
  description:
    'All-in-one Christian devotion app combining AI-powered gratitude journal, Bible Q&A, personalized devotion, verse wallpaper creation, and worship music discovery.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free with optional premium features' },
  featureList: [
    'AI-powered gratitude journal with Scripture matching',
    'Bible Q&A with direct verse navigation',
    'Personalized daily devotion',
    'Verse wallpaper creation and sharing',
    'Worship music discovery',
  ],
};

const QUIZ = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Which Biblical Character Are You?',
  description:
    'A personality quiz that maps your temperament to biblical characters and provides personalized spiritual growth insights.',
  about: { '@type': 'Thing', name: 'Biblical Characters Personality Types' },
};

function buildJsonLdBlock(article, lang, faq) {
  const cat = cats[article.category];
  const d = article.data[lang];
  const url = DOMAIN + slugToPath(article.slug, lang);

  const blocks = [];

  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: d.title,
    description: d.desc,
    url: url,
    datePublished: article.datePublished || site.datePublished,
    dateModified: article.dateModified || article.datePublished || site.dateModified,
    author: { '@type': 'Organization', name: 'GraceWord' },
    publisher: {
      '@type': 'Organization',
      name: 'GraceWord',
      url: DOMAIN + '/',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: url,
    articleSection: catLabel(cat, lang),
    inLanguage: LANGS[lang].hreflang,
  });

  if (faq && faq.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t(lang, 'home'), item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: t(lang, 'blog'), item: DOMAIN + blogListPath(lang) },
      { '@type': 'ListItem', position: 3, name: d.title, item: url },
    ],
  });

  if (article.category === 'd') blocks.push(SOFTWARE_APP);
  if (article.category === 'e') blocks.push(QUIZ);

  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

/* ---------------------------------------------------------------- layout */

function navHtml(lang, active, urls) {
  const blogActive = active === 'blog' ? ' class="active"' : '';
  const options = LANG_KEYS.map((k) => {
    const optActive = k === lang ? ' active' : '';
    return `      <a class="lang-option${optActive}" href="${urls[k]}" hreflang="${LANGS[k].hreflang}">${LANGS[k].label}</a>`;
  }).join('\n');
  return `
<header class="header">
  <div class="header-inner">
    <a href="/" class="header-logo" aria-label="GraceWord Home">
      <img src="${LOGO_URL}" alt="GraceWord">
      <span>${t(lang, 'appName')}</span>
    </a>
    <button class="menu-toggle" id="hamburger" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
    <nav class="header-nav" id="mobileMenu">
      <a href="/" role="menuitem">${t(lang, 'home')}</a>
      <a href="${blogListPath(lang)}" role="menuitem"${blogActive}>${t(lang, 'blog')}</a>
      <div class="lang-switch" id="langSwitch">
        <button class="lang-select-trigger" type="button" aria-haspopup="true" aria-expanded="false">
          <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="lang-current">${LANGS[lang].label}</span>
          <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="lang-dropdown" role="menu">
${options}
        </div>
      </div>
    </nav>
  </div>
</header>`;
}

function footerHtml(lang) {
  return `
<footer class="footer" role="contentinfo">
  <div class="footer-inner">
    <span>© 2026 ${t(lang, 'appName')}</span>
    <span class="divider">|</span>
      <a href="/privacy">Privacy Policy</a>
      <span class="divider">|</span>
      <a href="/terms">Terms of Use</a>
  </div>
</footer>`;
}

function socialHtml(lang) {
  return `
<section class="cta-section" id="cta" aria-label="Follow GraceWord on social media">
  <div class="cta-inner">
    <h2>${t(lang, 'followTitle')}</h2>
    <p class="cta-subtitle">${t(lang, 'followDesc')}</p>
    <div class="cta-social-links">
      <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><img src="${SOCIAL_ICONS.instagram}" alt="Instagram" loading="lazy"></a>
      <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><img src="${SOCIAL_ICONS.facebook}" alt="Facebook" loading="lazy"></a>
      <a href="${SOCIAL.youtube}" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><img src="${SOCIAL_ICONS.youtube}" alt="YouTube" loading="lazy"></a>
    </div>
    <p class="cta-email"><a href="mailto:support@grace-word.com">support@grace-word.com</a></p>
  </div>
</section>`;
}

function headHtml({ lang, title, description, canonical, isArticle, hreflang, jsonLd }) {
  const ogType = isArticle ? 'article' : 'website';
  const alternates = hreflang
    .map((h) => `<link rel="alternate" hreflang="${h.code}" href="${h.url}">`)
    .join('\n');
  const xDefault = hreflang.find((h) => h.code === 'en') || hreflang[0];
  const robotsMeta = NOINDEX ? '<meta name="robots" content="noindex,nofollow">' : '';
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
${robotsMeta}
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/webp" href="${LOGO_URL}">
<link rel="apple-touch-icon" href="${LOGO_URL}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${xDefault.url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="GraceWord">
<meta property="og:image" content="${LOGO_URL}">
<meta property="og:image:alt" content="GraceWord">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${LOGO_URL}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${CSS_URL}">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${jsonLd}`;
}

/* ---------------------------------------------------------------- cards */

function articleCard(article, lang, cat) {
  const d = article.data[lang];
  const url = slugToPath(article.slug, lang);
  return `<article class="article-card" data-cat="${article.category}" itemscope itemtype="https://schema.org/BlogPosting">
  <div class="article-card-body">
    <span class="cat-tag tag-${article.category}">${catLabel(cat, lang)}</span>
    <h3 itemprop="headline"><a href="${url}" itemprop="url">${esc(d.title)}</a></h3>
    <p class="excerpt" itemprop="description">${esc(d.desc)}</p>
    <div class="card-meta">
      <span class="read-time">${d.readTime}</span>
      <a href="${url}" class="read-more" itemprop="url">${t(lang, 'readMore')}</a>
    </div>
  </div>
</article>`;
}

/* ---------------------------------------------------------------- page builders */

function prepare() {
  for (const a of articles) {
    a.data = {};

    const enBody = stripH1(readMd(a, 'en'));
    a.data.en = {
      title: a.titleEn,
      body: enBody,
      desc: extractDescription(enBody),
      readTime: readingTime(enBody, 'en'),
      faq: extractFaq(enBody),
    };

    const zhBody = stripH1(readMd(a, 'zh'));
    a.data['zh-CN'] = {
      title: a.titleZh,
      body: zhBody,
      desc: extractDescription(zhBody),
      readTime: readingTime(zhBody, 'zh-CN'),
      faq: extractFaq(zhBody),
    };

    const twBody = toTraditional(zhBody);
    a.data['zh-TW'] = {
      title: toTraditional(a.titleZh),
      body: twBody,
      desc: extractDescription(twBody),
      readTime: readingTime(twBody, 'zh-TW'),
      faq: extractFaq(twBody),
    };
  }
}

function hreflangFor(slug) {
  return LANG_KEYS.map((lang) => ({ code: LANGS[lang].hreflang, url: DOMAIN + (slug ? slugToPath(slug, lang) : blogListPath(lang)) }));
}

function buildArticlePages() {
  for (const article of articles) {
    for (const lang of LANG_KEYS) {
      const d = article.data[lang];
      const url = slugToPath(article.slug, lang);
      const canonical = DOMAIN + url;
      const cat = cats[article.category];

      const bodyHtml = rewriteLinks(renderMarkdown(injectCrossLinks(d.body, article, lang)), lang);
      const hreflang = hreflangFor(article.slug);
      const jsonLd = buildJsonLdBlock(article, lang, d.faq);
      const head = headHtml({ lang, title: d.title, description: d.desc, canonical, isArticle: true, hreflang, jsonLd });
      const urls = langUrls(article.slug);

      const related = articles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 3);
      const relatedHtml = related.length
        ? `<section class="related-section"><div class="container">
            <h2 class="section-title">${t(lang, 'related')}</h2>
            <div class="related-grid">${related.map((a) => articleCard(a, lang, cats[a.category])).join('\n')}</div>
          </div></section>`
        : '';

      const html = `<!DOCTYPE html>
<html lang="${LANGS[lang].htmlLang}">
<head>
${head}
</head>
<body>
${navHtml(lang, 'blog', urls)}

<section class="article-hero">
  <div class="article-hero-inner">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">${t(lang, 'home')}</a> / <a href="${blogListPath(lang)}">${t(lang, 'blog')}</a> / <span>${esc(d.title)}</span>
    </nav>
    <span class="cat-tag tag-${article.category}">${catLabel(cat, lang)}</span>
    <h1>${esc(d.title)}</h1>
    <div class="article-meta">
      <span>${t(lang, 'published')} ${article.datePublished || site.datePublished}</span>
      <span>${d.readTime}</span>
    </div>
    ${lang !== 'en' ? `<div class="subtitle-en">${esc(article.data.en.title)}</div>` : ''}
  </div>
</section>

<section class="article-body-section">
  <article class="article-body" itemscope itemtype="https://schema.org/BlogPosting">
    ${bodyHtml}
  </article>
</section>

${relatedHtml}

${socialHtml(lang)}
${footerHtml(lang)}

<div class="sticky-bar" id="stickyBar">
  <div class="sticky-bar-inner">
    <div class="sticky-brand">
      <img src="${LOGO_URL}" alt="${t(lang, 'appName')}">
      <span class="sticky-brand-text">
        <strong>${t(lang, 'appName')}</strong>
        <small>${t(lang, 'stickyTagline')}</small>
      </span>
    </div>
    <a href="${DOWNLOAD_URL}" class="app-btn">${t(lang, 'stickyBtn')}</a>
  </div>
</div>

<script src="${JS_URL}"></script>
</body>
</html>`;

      const dir = path.join(DIST, 'blog', article.slug, LANGS[lang].dir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }
}

function categoryNav(lang) {
  const items = Object.entries(cats)
    .map(([key, cat]) => `<a href="#" class="cat-btn cat-${key}" data-cat="${key}" role="tab" aria-selected="false">${catLabel(cat, lang)}</a>`)
    .join('\n');
  return `<a href="#" class="cat-btn cat-all active" data-cat="all" role="tab" aria-selected="true">${t(lang, 'catAll')}</a>\n${items}`;
}

function buildBlogList() {
  for (const lang of LANG_KEYS) {
    const title = lang === 'en'
      ? 'GraceWord Blog — Scripture, Devotion & Faith Resources'
      : `GraceWord ${t(lang, 'blog')} — ${lang === 'zh-CN' ? '经文、灵修与信仰资源' : '經文、靈修與信仰資源'}`;
    const desc = lang === 'en'
      ? 'Explore articles on Bible verses, gratitude journaling, Bible study methods, Christian app reviews, and biblical personality quizzes.'
      : lang === 'zh-CN'
        ? '探索关于圣经经文、感恩日记、查经方法、基督徒应用评测与圣经人格测验的文章。'
        : '探索關於聖經經文、感恩日記、查經方法、基督徒應用評測與聖經人格測驗的文章。';
    const canonical = DOMAIN + blogListPath(lang);
    const hreflang = hreflangFor(null);
    const urls = langUrls(null);

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: desc,
      url: canonical,
      isPartOf: { '@type': 'WebSite', name: 'GraceWord', url: DOMAIN + '/' },
      publisher: {
        '@type': 'Organization',
        name: 'GraceWord',
        url: DOMAIN + '/',
        logo: { '@type': 'ImageObject', url: LOGO_URL },
      },
      inLanguage: LANGS[lang].hreflang,
    });

    const head = headHtml({
      lang,
      title,
      description: desc,
      canonical,
      isArticle: false,
      hreflang,
      jsonLd: `<script type="application/ld+json">${jsonLd}</script>`,
    });

    const cards = articles.map((a) => articleCard(a, lang, cats[a.category])).join('\n');

    const html = `<!DOCTYPE html>
<html lang="${LANGS[lang].htmlLang}">
<head>
${head}
</head>
<body>
${navHtml(lang, 'blog', urls)}

<section class="hero" id="blog-hero" aria-label="Blog hero introduction">
  <div class="hero-inner">
    <h1><span class="gold">${t(lang, 'appName')}</span> ${t(lang, 'heroTitle')}</h1>
    <p class="hero-subtitle">${t(lang, 'heroSubtitle')}</p>
    <div class="search-bar">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input type="search" id="blogSearch" placeholder="${t(lang, 'searchPlaceholder')}" aria-label="Search blog articles">
    </div>
  </div>
</section>

<section class="category-nav-section" aria-label="Article categories">
  <div class="container">
    <div class="category-nav" role="tablist" aria-label="Filter articles by category">
      ${categoryNav(lang)}
    </div>
  </div>
</section>

<section class="articles-section" id="articles" aria-label="Blog articles">
  <div class="container">
    <div class="articles-grid">
      ${cards}
    </div>
  </div>
</section>

${socialHtml(lang)}
${footerHtml(lang)}

<div class="sticky-bar" id="stickyBar">
  <div class="sticky-bar-inner">
    <div class="sticky-brand">
      <img src="${LOGO_URL}" alt="${t(lang, 'appName')}">
      <span class="sticky-brand-text">
        <strong>${t(lang, 'appName')}</strong>
        <small>${t(lang, 'stickyTagline')}</small>
      </span>
    </div>
    <a href="${DOWNLOAD_URL}" class="app-btn">${t(lang, 'stickyBtn')}</a>
  </div>
</div>

<script src="${JS_URL}"></script>
</body>
</html>`;

    const dir = path.join(DIST, 'blog', LANGS[lang].dir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

/* ---------------------------------------------------------------- seo files */

function buildSeoFiles() {
  const urls = [];
  const add = (loc, alts) => urls.push({ loc, alts });

  for (const lang of LANG_KEYS) {
    add(DOMAIN + blogListPath(lang), hreflangFor(null));
  }
  for (const a of articles) {
    for (const lang of LANG_KEYS) {
      add(DOMAIN + slugToPath(a.slug, lang), hreflangFor(a.slug));
    }
  }

  const urlEntries = urls
    .map((u) => {
      const alts = u.alts
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.code}" href="${a.url}"/>`)
        .join('\n      ');
      return `  <url>\n    <loc>${u.loc}</loc>\n    ${alts}\n  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

  fs.mkdirSync(path.join(DIST, 'blog'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'blog', 'sitemap.xml'), sitemap);

  const robots = NOINDEX
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/blog/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
}

/* ---------------------------------------------------------------- copy assets */

function copyAssets() {
  const outAssets = path.join(DIST, 'assets');
  fs.mkdirSync(outAssets, { recursive: true });
  for (const f of fs.readdirSync(ASSETS)) {
    fs.copyFileSync(path.join(ASSETS, f), path.join(outAssets, f));
  }
}

/* ---------------------------------------------------------------- run */

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  prepare();
  copyAssets();
  buildArticlePages();
  buildBlogList();
  buildSeoFiles();
  console.log('Build complete →', DIST);
}

main();
