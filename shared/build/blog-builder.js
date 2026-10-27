'use strict';

/**
 * shared/build/blog-builder.js — 多站点博客构建引擎（GraceWord / SleepBuddy 共用）。
 *
 * 用法：
 *   const builder = require('./blog-builder.js');
 *   builder.build(CONFIG);
 *
 * CONFIG 字段见 build() 开头注释。各品牌只需提供自身配置（品牌名/域名/CDN/
 * UI 文案/分类 schema/header-footer 模块/源目录/articles.json），即可复用同一套
 * 三语言 + BlogPosting/FAQPage/BreadcrumbList + crossLinks + hreflang + sitemap 逻辑。
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * @param {object} cfg
 * @param {string} cfg.name         品牌/组织名（如 'GraceWord'、'SleepBuddy'）
 * @param {string} cfg.domain       生产域名（如 'https://grace-word.com'）
 * @param {string} cfg.cdn          CDN 基址
 * @param {string} cfg.logoUrl      logo 绝对 URL
 * @param {string} cfg.ogImage      og:image 绝对 URL（默认 = logoUrl）
 * @param {string} cfg.downloadUrl  下载入口（根相对路径）
 * @param {string} cfg.gaId         Google Analytics ID
 * @param {string} cfg.fonts        Google Fonts href
 * @param {object} cfg.headerFooter header/footer 模块（含 header/footer/HEADER_CSS/HEADER_JS）
 * @param {object} cfg.deps         { marked, OpenCC } 依赖注入（各品牌 build 目录自行 npm install）
 * @param {object} cfg.ui           { en, 'zh-CN' } 博客 UI 文案（zh-TW 由 toTw 派生）
 * @param {function} cfg.toTw       OpenCC 简->繁转换函数
 * @param {string} cfg.srcDir       源文章目录（绝对路径）
 * @param {string} cfg.articlesJson articles.json 绝对路径
 * @param {string} cfg.assetDir     build 脚本的 assets 目录
 * @param {object} cfg.list         { en, 'zh-CN', 'zh-TW' } 列表页 title/desc
 * @param {object} [cfg.softwareApp] SoftwareApplication schema 块（category==='d' 时注入）
 * @param {object} [cfg.quiz]        Quiz schema 块（category==='e' 时注入）
 */
function build(cfg) {
  const { marked, OpenCC } = cfg.deps;
  const ROOT = cfg.rootDir;
  const SRC = cfg.srcDir;
  const DIST = path.join(ROOT, process.env.OUT_DIR || 'dist');
  const ASSETS = cfg.assetDir;

  const manifest = JSON.parse(fs.readFileSync(cfg.articlesJson, 'utf8'));
  const site = manifest.site;
  const cats = manifest.categories;
  const articles = manifest.articles;
  const slugAliases = manifest.slugAliases || {};
  const DOMAIN = (process.env.SITE_URL || cfg.domain).replace(/\/$/, '');
  const NOINDEX = process.env.NOINDEX === '1';

  const CDN = cfg.cdn;
  const LOGO_URL = cfg.logoUrl;
  const OG_IMAGE = cfg.ogImage || LOGO_URL;
  const DOWNLOAD_URL = cfg.downloadUrl;
  const GA_ID = cfg.gaId;
  const FONTS = cfg.fonts;
  const VERSION = site.version || (cfg.list.en && cfg.list.en.title) || 'v1';
  const toTraditional = cfg.toTw;

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

  const REST_CSS = fs.readFileSync(path.join(ASSETS, 'style.css'), 'utf8');
  const COMBINED_CSS = cfg.headerFooter.HEADER_CSS + '\n' + REST_CSS;
  const CSS_URL = '/blog/style.css';
  const JS_URL = '/blog/main.js';

  /* ---------------------------------------------------------------- languages */

  const LANGS = {
    en: { code: 'en', hreflang: 'en', htmlLang: 'en', dir: '', label: 'EN' },
    'zh-CN': { code: 'zh-CN', hreflang: 'zh-CN', htmlLang: 'zh-Hans', dir: 'zh-cn', label: '简体' },
    'zh-TW': { code: 'zh-TW', hreflang: 'zh-TW', htmlLang: 'zh-Hant', dir: 'zh-tw', label: '繁體' },
  };
  const LANG_KEYS = Object.keys(LANGS);

  const UI = {};
  for (const k of ['en', 'zh-CN']) UI[k] = cfg.ui[k];
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

  function autoLinkDomain(md) {
    const bare = cfg.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return md.split('\n').map((line) => {
      if (line.indexOf(bare) === -1) return line;
      if (new RegExp(`\\[[^\\]]*\\]\\([^)]*${bare.replace(/\./g, '\\.')}[^)]*\\)`).test(line)) return line;
      line = line.replace(
        new RegExp(`(?<![\\w.-])((?:www\\.)?${bare.replace(/\./g, '\\.')})(\\/blog\\/[a-z0-9-]+)?`, 'g'),
        (m, domainName, blogPath) => blogPath
          ? `[${m}](${cfg.domain}${blogPath})`
          : `[${m}](${cfg.domain}/)`
      );
      return line;
    }).join('\n');
  }

  function renderMarkdown(md) {
    return marked.parse(preprocessEmphasis(autoLinkDomain(md)));
  }

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
      .replace(new RegExp(`www\\.${cfg.domain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/\./g, '\\.')}`, 'g'), cfg.domain.replace(/^https?:\/\//, ''))
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
    let i = lines.findIndex((l) => /^##\s+.*(frequently asked questions|faq|常见问题|常見問題|常见问答|常見問答)/i.test(l.trim()));
    if (i < 0) return [];

    const questionOf = (line) => {
      const s = line.trim();
      const stripNum = (x) => x.replace(/^(问题|問題)\s*\d+\s*[：:]\s*/, '').replace(/^\d+\.\s*/, '');
      if (/^###\s+/.test(s)) return cleanInline(stripNum(s.replace(/^###\s+/, '')));
      if (/^\*\*.*\*\*$/.test(s)) {
        return cleanInline(stripNum(s.replace(/^\*\*/, '').replace(/\*\*$/, '')));
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
    const bare = cfg.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    html = html.replace(new RegExp(`href="https?:\\/\\/(?:www\\.)?${bare.replace(/\./g, '\\.')}\\/blog\\/([a-z0-9-]+)\\/?"`, 'g'), (m, slug) => {
      return `href="${slugToPath(normalizeSlug(slug), lang)}"`;
    });
    html = html.replace(new RegExp(`href="https?:\\/\\/(?:www\\.)?${bare.replace(/\./g, '\\.')}\\/blog\\/?"`, 'g'), `href="${blogListPath(lang)}"`);
    html = html.replace(new RegExp(`href="https?:\\/\\/(?:www\\.)?${bare.replace(/\./g, '\\.')}\\/?"`, 'g'), 'href="/"');
    html = html.replace(new RegExp(`>((?:https?:\\/\\/)?(?:www\\.)?${bare.replace(/\./g, '\\.')})?\\/blog\\/([a-z0-9-]+)\\/?<`, 'g'), (m, pre, slug) => {
      return `>${slugToPath(normalizeSlug(slug), lang)}<`;
    });
    html = html.replace(new RegExp(`>www\\.${bare.replace(/\./g, '\\.')}<`, 'g'), `>${bare}<`);
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
      author: { '@type': 'Organization', name: cfg.name },
      publisher: {
        '@type': 'Organization',
        name: cfg.name,
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

    if (article.howTo) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: article.howTo.name,
        step: article.howTo.steps.map((s) => ({
          '@type': 'HowToStep',
          name: s.name,
          text: s.text,
        })),
      });
    }

    if (cfg.softwareApp && article.category === 'd') blocks.push(cfg.softwareApp);
    if (cfg.quiz && article.category === 'e') blocks.push(cfg.quiz);

    return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
  }

  /* ---------------------------------------------------------------- layout */

  function navHtml(lang, active, urls) {
    const langs = LANG_KEYS.map((k) => ({ code: k, label: LANGS[k].label, hreflang: LANGS[k].hreflang }));
    return cfg.headerFooter.header({ lang, active, langHref: (code) => urls[code], langs });
  }

  function footerHtml(lang) {
    return cfg.headerFooter.footer({ lang });
  }

  function headHtml({ lang, title, description, canonical, isArticle, hreflang, jsonLd }) {
    const ogType = isArticle ? 'article' : 'website';
    const alternates = hreflang
      .map((h) => `<link rel="alternate" hreflang="${h.code}" href="${h.url}">`)
      .join('\n');
    const xDefault = hreflang.find((h) => h.code === 'en') || hreflang[0];
    const robotsMeta = NOINDEX ? '<meta name="robots" content="noindex,nofollow">' : '';
    const ga = GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
` : '';
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
<meta property="og:site_name" content="${cfg.name}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:alt" content="${cfg.name}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${CSS_URL}">
${ga}${jsonLd}`;
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
      const list = cfg.list[lang];
      const title = list.title;
      const desc = list.desc;
      const canonical = DOMAIN + blogListPath(lang);
      const hreflang = hreflangFor(null);
      const urls = langUrls(null);

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description: desc,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: cfg.name, url: DOMAIN + '/' },
        publisher: {
          '@type': 'Organization',
          name: cfg.name,
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
    const out = path.join(DIST, 'blog');
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'style.css'), COMBINED_CSS);
    const contentJs = fs.readFileSync(path.join(ASSETS, 'main.js'), 'utf8');
    fs.writeFileSync(path.join(out, 'main.js'), cfg.headerFooter.HEADER_JS + '\n' + contentJs);
  }

  /* ---------------------------------------------------------------- run */

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  prepare();
  copyAssets();
  buildArticlePages();
  buildBlogList();
  buildSeoFiles();
  console.log('Build complete →', DIST);
}

module.exports = { build };
