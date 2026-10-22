'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const OpenCC = require('opencc-js');
const site = require('../../site/header-footer.js');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'content');
const ASSETS = path.join(__dirname, 'assets');

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast.json'), 'utf8'));
const DOMAIN = data.domain.replace(/\/$/, '');
const podcast = data.podcast;
const seriesList = data.series;
// 只有一個專欄時：/podcast/ 直接作為該專欄頁，不另生成專欄頁與列表頁
const SINGLE_SERIES = seriesList.length === 1;

const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });

const CDN = 'https://cdn.grace-word.com';
const LOGO_URL = CDN + '/home/logo.webp';
const GA_ID = 'G-7CEHJHLWK1';
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap';

const REST_CSS = fs.readFileSync(path.join(ASSETS, 'style.css'), 'utf8');
const COMBINED_CSS = site.HEADER_CSS + '\n' + REST_CSS;
const CSS_URL = '/podcast/style.css';
const DOWNLOAD_URL = '/action/download';

const LANGS = {
  'zh-TW': { htmlLang: 'zh-Hant', hreflang: 'zh-TW', dir: '', label: '繁體', other: 'zh-CN' },
  'zh-CN': { htmlLang: 'zh-Hans', hreflang: 'zh-CN', dir: 'zh-cn', label: '简体', other: 'zh-TW' },
};

const UI = {
  'zh-TW': {
    appName: '恩語', home: '首頁', blog: '文章', podcast: '播客',
    series: '節目系列', allSeries: '全部', hostIntro: '主持人介紹',
    seriesSection: '系列節目', episodes: '節目列表', latestEpisodes: '最新節目',
    episodesCount: '共 {n} 集',
    keypoints: '本集重點', outline: '節目大綱',
    transcript: '展開完整逐字稿',
    sourceLink: '在 Soooradio 收聽原文',
    video: '觀看影片',
    hosts: '主持人', duration: '時長', published: '發布日期',
    subscribe: '訂閱播客', listen: '收聽本集',
    backToPodcast: '返回播客首頁', backToSeries: '返回節目系列',
    prevEpisode: '上一集', nextEpisode: '下一集',
    stickyTagline: '經文 · 敬拜 · 靈修', stickyBtn: '免費下載恩語 →',
    followTitle: '保持聯繫', followDesc: '關注我們獲取每日靈感',
    appIntro: 'GraceWord 致力於幫助信徒每日與聖經相交——透過個人化靈修、AI 輔助查經，以及將感恩與神的話連結的感恩日記。App 可在 {url} 免費取得。',
    copyright: '© 2026 恩語',
  },
  'zh-CN': {
    appName: '恩语', home: '首页', blog: '文章', podcast: '播客',
    series: '节目系列', allSeries: '全部', hostIntro: '主持人介绍',
    seriesSection: '系列节目', episodes: '节目列表', latestEpisodes: '最新节目',
    episodesCount: '共 {n} 集',
    keypoints: '本集重点', outline: '节目大纲',
    transcript: '展开完整逐字稿',
    sourceLink: '在 Soooradio 收听原文',
    video: '观看视频',
    hosts: '主持人', duration: '时长', published: '发布日期',
    subscribe: '订阅播客', listen: '收听本集',
    backToPodcast: '返回播客首页', backToSeries: '返回节目系列',
    prevEpisode: '上一集', nextEpisode: '下一集',
    stickyTagline: '经文 · 敬拜 · 灵修', stickyBtn: '免费下载恩语 →',
    followTitle: '保持联系', followDesc: '关注我们获取每日灵感',
    appIntro: 'GraceWord 致力于帮助信徒每日与圣经相交——通过个性化灵修、AI 辅助查经，以及将感恩与神的话连接的感恩日记。App 可在 {url} 免费获取。',
    copyright: '© 2026 恩语',
  },
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// PT32M38S -> 32:38 (iTunes RSS duration)
function isoDurationToClock(iso) {
  const m = String(iso).match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return iso;
  const h = +m[1] || 0, mi = +m[2] || 0, s = +m[3] || 0;
  const parts = h ? [h, mi, s] : [mi, s];
  return parts.map((n) => String(n).padStart(2, '0')).join(':');
}

// PT32M47S -> 1967 (seconds, for video sitemap)
function isoDurationToSeconds(iso) {
  const m = String(iso).match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return '';
  return String((+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0));
}

/* ---- transcript: plain dialogue text -> HTML ---- */
function formatTranscript(txt) {
  const lines = txt.split('\n');
  let html = '';
  let para = [];

  const flushPara = () => {
    if (para.length) { html += '<p>' + para.map(esc).join('<br>') + '</p>\n'; para = []; }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const t = line.trim();
    if (!t) { flushPara(); continue; }

    const sec = t.match(/^【(.+?)】\s*$/);
    if (sec) { flushPara(); html += '<h3>' + esc(t.replace(/^【/, '').replace(/】$/, '')) + '</h3>\n'; continue; }

    if (/^(主持人|嘉賓|嘉賓|Sandy|Jacky)\s*[：:]\s*$/.test(t)) {
      flushPara();
      html += '<p><strong>' + esc(t) + '</strong></p>\n';
      continue;
    }

    para.push(line);
  }
  flushPara();
  return html;
}

/* ---- paths ---- */
function homePath(lang) { return LANGS[lang].dir ? `/podcast/${LANGS[lang].dir}/` : '/podcast/'; }
function seriesPath(s, lang) { return LANGS[lang].dir ? `/podcast/${s.slug}/${LANGS[lang].dir}/` : `/podcast/${s.slug}/`; }
function epPath(s, ep, lang) { return LANGS[lang].dir ? `/podcast/${s.slug}/${ep.slug}/${LANGS[lang].dir}/` : `/podcast/${s.slug}/${ep.slug}/`; }
function feedPath(s) { return `/podcast/${s.slug}/feed.xml`; }

function altUrls(pathFor) {
  return LANG_KEYS.map((k) => ({ code: LANGS[k].hreflang, url: DOMAIN + pathFor(k) }));
}

/* ---- per-language text ---- */
function podcastName(lang) { return lang === 'zh-TW' ? podcast.titleTw : podcast.titleCn; }
function podcastDesc(lang) { return lang === 'zh-TW' ? podcast.descTw : podcast.descCn; }
function seriesName(s, lang) { return lang === 'zh-TW' ? s.nameTw : s.nameCn; }
function seriesDesc(s, lang) { return lang === 'zh-TW' ? s.descTw : s.descCn; }
function epTitle(ep, lang) { return lang === 'zh-TW' ? ep.titleTw : ep.titleCn; }
function epIntro(ep, lang) { return lang === 'zh-TW' ? ep.introTw : ep.introCn; }
function epKp(ep, lang) { return lang === 'zh-TW' ? ep.keyPointsTw : ep.keyPointsCn; }
function epOutline(ep, lang) { return lang === 'zh-TW' ? ep.outlineTw : ep.outlineCn; }
function epDurLabel(ep, lang) { return lang === 'zh-TW' ? ep.durationLabelTw : ep.durationLabelCn; }

/* ---- head ---- */
function head({ lang, title, description, canonical, ogImage, isEpisode, jsonLd, alternates, xDefault, youtube }) {
  const alts = alternates.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${a.url}">`).join('\n');
  const videoMeta = youtube
    ? `<meta property="og:video:url" content="https://www.youtube.com/embed/${youtube}">
<meta property="og:video:type" content="text/html">
<meta property="og:video:width" content="1280">
<meta property="og:video:height" content="720">
<meta property="og:video:secure_url" content="https://www.youtube.com/embed/${youtube}">
<meta name="twitter:player" content="https://www.youtube.com/embed/${youtube}">
<meta name="twitter:player:width" content="1280">
<meta name="twitter:player:height" content="720">`
    : '';
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${alts}
<link rel="alternate" hreflang="x-default" href="${DOMAIN}${xDefault}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="${isEpisode ? 'article' : 'website'}">
<meta property="og:site_name" content="GraceWord">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
${videoMeta}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${CSS_URL}">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${jsonLd}`;
}

/* ---- layout ---- */
function nav(lang, urlFor) {
  const langs = LANG_KEYS.map((k) => ({ code: k, label: LANGS[k].label, hreflang: LANGS[k].hreflang }));
  return site.header({ lang, active: 'podcast', langHref: (code) => urlFor(code), langs });
}

function footer(lang) {
  return site.footer({ lang });
}

function stickyBarHtml(lang) {
  return `<div class="sticky-bar" id="stickyBar">
  <div class="sticky-bar-inner">
    <div class="sticky-brand">
      <img src="${LOGO_URL}" alt="${esc(UI[lang].appName)}">
      <span class="sticky-brand-text">
        <strong>${esc(UI[lang].appName)}</strong>
        <small>${esc(UI[lang].stickyTagline)}</small>
      </span>
    </div>
    <a href="${DOWNLOAD_URL}" class="app-btn">${esc(UI[lang].stickyBtn)}</a>
  </div>
</div>`;
}

function appIntroHtml(lang) {
  const html = UI[lang].appIntro.replace('{url}', '<a href="https://grace-word.com">grace-word.com</a>');
  return `<aside class="app-intro">${html}</aside>`;
}

function bodyScripts() {
  return `<script>${site.HEADER_JS}
(function () {
  var sticky = document.getElementById('stickyBar');
  if (sticky) {
    var cta = document.querySelector('.site-footer');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sticky.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    if (cta) observer.observe(cta);
    else sticky.classList.add('visible');
  }
})();
</script>`;
}

function subscribeButtons(s, lang, isSeries) {
  const feed = isSeries ? feedPath(s) : null;
  const links = [];
  if (feed) links.push(`<a href="${DOMAIN}${feed}">${esc(seriesName(s, lang))} · RSS</a>`);
  return `<div class="subscribe">
    ${links.join('\n      ')}
  </div>`;
}

/* ---- schema ---- */
function homeJsonLd(lang, canonical) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: podcastName(lang),
    description: podcastDesc(lang),
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'GraceWord', url: DOMAIN + '/' },
    publisher: { '@type': 'Organization', name: 'GraceWord', url: DOMAIN + '/', logo: { '@type': 'ImageObject', url: LOGO_URL } },
    inLanguage: LANGS[lang].hreflang,
  });
}

function seriesJsonLd(s, lang, url) {
  const hosts = s.hosts || [];
  const persons = hosts.map((h) => ({
    '@type': 'Person',
    name: h.name,
    ...(h.link ? { url: h.link } : {}),
  }));
  const author = persons.length === 1 ? persons[0] : persons;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: seriesName(s, lang),
    description: seriesDesc(s, lang),
    url: url || (DOMAIN + seriesPath(s, lang)),
    webFeed: DOMAIN + feedPath(s),
    image: s.cover,
    inLanguage: s.language,
    publisher: { '@type': 'Organization', name: 'GraceWord', url: DOMAIN + '/' },
    ...(persons.length ? { author } : {}),
  });
}

function episodeJsonLd(s, ep, lang) {
  const o = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: epTitle(ep, lang),
    description: epIntro(ep, lang),
    url: DOMAIN + epPath(s, ep, lang),
    datePublished: ep.datePublished,
    timeRequired: ep.duration,
    episodeNumber: ep.episodeNumber,
    partOfSeries: { '@type': 'PodcastSeries', name: seriesName(s, lang), url: DOMAIN + seriesPath(s, lang) },
    associatedMedia: {
      '@type': 'AudioObject',
      name: epTitle(ep, lang),
      contentUrl: ep.audio,
      encodingFormat: 'audio/mpeg',
      ...(ep.audioSize ? { contentSize: String(ep.audioSize) } : {}),
    },
    inLanguage: s.language,
    image: ep.cover,
  };
  if (ep.youtube) {
    o.video = {
      '@type': 'VideoObject',
      name: epTitle(ep, lang),
      description: epIntro(ep, lang),
      embedUrl: 'https://www.youtube-nocookie.com/embed/' + ep.youtube,
      thumbnailUrl: 'https://i.ytimg.com/vi/' + ep.youtube + '/hqdefault.jpg',
      uploadDate: ep.datePublished,
      duration: ep.duration,
      inLanguage: s.language,
      isFamilyFriendly: true,
    };
  }
  if (ep.hosts && ep.hosts.length) o.producer = { '@type': 'Person', name: ep.hosts.join(', ') };
  return JSON.stringify(o);
}

/* ---- card builders ---- */
function episodeCard(s, ep, lang) {
  const listen = UI[lang].listen;
  const clock = isoDurationToClock(ep.duration);
  return `<a class="episode-card" href="${epPath(s, ep, lang)}">
    <img class="e-thumb" src="${ep.cover}" alt="${esc(epTitle(ep, lang))}">
    <div class="e-body">
      <div class="e-head">
        <h3>${esc(epTitle(ep, lang))}</h3>
        <span class="e-meta-wrap"><span class="e-ep">Ep. ${ep.episodeNumber}</span><span class="e-meta">${clock}</span></span>
      </div>
      <p class="e-excerpt">${esc(epIntro(ep, lang))}</p>
      <span class="e-listen">${esc(listen)}</span>
    </div>
  </a>`;
}

function hostHtml(s, lang) {
  const hosts = s.hosts || [];
  if (!hosts.length) return '';
  const cards = hosts.map((h) => `<div class="host-card">
    <div class="host-info">
      <h3>${esc(h.name)}</h3>
      <p>${esc(lang === 'zh-TW' ? h.bioTw : h.bioCn)}</p>
      ${h.link ? `<a class="host-link" href="${h.link}" target="_blank" rel="noopener">Soooradio ↗</a>` : ''}
    </div>
  </div>`).join('\n');
  return `<section class="host-section" aria-label="${esc(UI[lang].hostIntro)}">
  <div class="container-wide">
    <h2 class="host-title">${esc(UI[lang].hostIntro)}</h2>
    <div class="host-grid">
      ${cards}
    </div>
  </div>
</section>`;
}

function episodesOrdered(s) {
  return [...s.episodes]
    .filter((e) => e.published !== false)
    .sort((a, b) =>
    (b.datePublished || '').localeCompare(a.datePublished || '') ||
    (b.episodeNumber || 0) - (a.episodeNumber || 0));
}

function tabsHtml(lang, activeSlug) {
  const items = [`<a href="${homePath(lang)}" class="podcast-tab${activeSlug === 'all' ? ' active' : ''}">${esc(UI[lang].allSeries)}</a>`]
    .concat(seriesList.map((s) => `<a href="${seriesPath(s, lang)}" class="podcast-tab${activeSlug === s.slug ? ' active' : ''}">${esc(seriesName(s, lang))}</a>`))
    .join('\n      ');
  return `<div class="podcast-tabs">
      ${items}
    </div>`;
}

function seriesBody(s, lang, withTabs) {
  const cards = episodesOrdered(s).map((ep) => episodeCard(s, ep, lang)).join('\n');
  const tabsBlock = withTabs ? tabsHtml(lang, s.slug) : '';
  const hosts = s.hosts || [];
  const hostLine = hosts.length
    ? `<p class="hero-hosts"><span>${esc(UI[lang].hosts)}：</span>${hosts.map((h) => `<span class="host-name">${esc(h.name)}</span>`).join('、')}</p>`
    : '';
  const tagline = lang === 'zh-TW' ? (s.taglineTw || '') : (s.taglineCn || '');
  const taglineLine = tagline ? `<p class="hero-tagline">${esc(tagline)}</p>` : '';
  return `<section class="hero">
  <div class="hero-inner">
    ${s.artwork ? `<img class="hero-artwork" src="${s.artwork}" alt="${esc(seriesName(s, lang))}">` : ''}
    <h1 class="visually-hidden">${esc(seriesName(s, lang))}</h1>
    <p class="hero-subtitle">${esc(seriesDesc(s, lang))}</p>
    ${hostLine}
    ${taglineLine}
  </div>
</section>

<div class="container-wide" style="padding: 40px 24px 60px;">
  ${tabsBlock}
  <h2 class="section-title" style="font-family:var(--font-serif);color:var(--primary);margin-bottom:20px;">${esc(UI[lang].episodes)}</h2>
  <div class="episode-list">
    ${cards}
  </div>
</div>

${hostHtml(s, lang)}`;
}

/* ---- page builders ---- */
const LANG_KEYS = Object.keys(LANGS);

function buildHome() {
  for (const lang of LANG_KEYS) {
    const canonical = DOMAIN + homePath(lang);
    const alternates = altUrls((k) => homePath(k));
    const xDefault = homePath('zh-TW');

    let title, desc, ogImage, jsonLd, body;
    if (SINGLE_SERIES) {
      const s = seriesList[0];
      title = `${seriesName(s, lang)} — ${podcastName(lang)}`;
      desc = seriesDesc(s, lang);
      ogImage = s.cover;
      jsonLd = `<script type="application/ld+json">${seriesJsonLd(s, lang, canonical)}</script>`;
      body = seriesBody(s, lang, false);
    } else {
      title = podcastName(lang);
      desc = podcastDesc(lang);
      ogImage = podcast.cover;
      jsonLd = `<script type="application/ld+json">${homeJsonLd(lang, canonical)}</script>`;
      const epCards = seriesList.flatMap((s) => episodesOrdered(s).map((ep) => episodeCard(s, ep, lang))).join('\n');
      body = `<section class="hero" id="podcast-hero" aria-label="GraceWord podcast">
  <div class="hero-inner">
    <h1>${esc(podcastName(lang))}</h1>
    <p class="hero-subtitle">${esc(podcastDesc(lang))}</p>
  </div>
</section>

<section class="podcast-section" aria-label="${esc(UI[lang].episodes)}">
  <div class="container-wide">
    ${tabsHtml(lang, 'all')}
    <div class="episode-list">
      ${epCards}
    </div>
  </div>
</section>`;
    }

    const headHtml = head({ lang, title, description: desc, canonical, ogImage, isEpisode: false, jsonLd, alternates, xDefault });

    const html = `<!DOCTYPE html>
<html lang="${LANGS[lang].htmlLang}">
<head>
${headHtml}
</head>
<body>
${nav(lang, (k) => homePath(k))}
${body}
${footer(lang)}
${stickyBarHtml(lang)}
${bodyScripts()}
</body>
</html>`;

    const dir = path.join(DIST, 'podcast', LANGS[lang].dir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function buildSeriesPages() {
  if (SINGLE_SERIES) return;
  for (const s of seriesList) {
    for (const lang of LANG_KEYS) {
      const title = `${seriesName(s, lang)} — ${podcastName(lang)}`;
      const desc = seriesDesc(s, lang);
      const canonical = DOMAIN + seriesPath(s, lang);
      const alternates = altUrls((k) => seriesPath(s, k));
      const jsonLd = `<script type="application/ld+json">${seriesJsonLd(s, lang)}</script>`;
      const headHtml = head({ lang, title, description: desc, canonical, ogImage: s.cover, isEpisode: false, jsonLd, alternates, xDefault: seriesPath(s, 'zh-TW') });

      const html = `<!DOCTYPE html>
<html lang="${LANGS[lang].htmlLang}">
<head>
${headHtml}
</head>
<body>
${nav(lang, (k) => seriesPath(s, k))}
${seriesBody(s, lang, true)}
${footer(lang)}
${stickyBarHtml(lang)}
${bodyScripts()}
</body>
</html>`;

      const dir = path.join(DIST, 'podcast', s.slug, LANGS[lang].dir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }
}

function buildEpisodePages() {
  for (const s of seriesList) {
    const epsOrdered = episodesOrdered(s);
    for (const ep of episodesOrdered(s)) {
      const epsIdx = epsOrdered.findIndex((e) => e.slug === ep.slug);
      const prevEp = epsOrdered[epsIdx + 1];
      const nextEp = epsOrdered[epsIdx - 1];
      const twTranscript = fs.readFileSync(path.join(CONTENT, ep.slug, 'transcript.txt'), 'utf8');
      const cnTranscript = t2s(twTranscript);

      for (const lang of LANG_KEYS) {
        const title = `${epTitle(ep, lang)} — ${seriesName(s, lang)}`;
        const desc = epIntro(ep, lang).slice(0, 160);
        const canonical = DOMAIN + epPath(s, ep, lang);
        const alternates = altUrls((k) => epPath(s, ep, k));
        const jsonLd = `<script type="application/ld+json">${episodeJsonLd(s, ep, lang)}</script>`;
        const headHtml = head({ lang, title, description: desc, canonical, ogImage: ep.cover, isEpisode: true, jsonLd, alternates, xDefault: epPath(s, ep, 'zh-TW'), youtube: ep.youtube });

        const transcriptText = lang === 'zh-TW' ? twTranscript : cnTranscript;
        const transcriptHtml = formatTranscript(transcriptText);

        const kp = epKp(ep, lang).map((k) => `<li>${esc(k)}</li>`).join('\n');
        const outline = epOutline(ep, lang).map((o) => `<li><span>${esc(o.title)}</span><span class="o-time">${esc(o.time)}</span></li>`).join('\n');

        const epNavPrev = prevEp ? `<a class="ep-nav prev" href="${epPath(s, prevEp, lang)}"><img class="ep-nav-cover" src="${prevEp.cover}" alt="${esc(epTitle(prevEp, lang))}"><span class="ep-nav-text"><small>← ${UI[lang].prevEpisode} · Ep. ${prevEp.episodeNumber}</small><strong>${esc(epTitle(prevEp, lang))}</strong></span></a>` : '';
        const epNavNext = nextEp ? `<a class="ep-nav next" href="${epPath(s, nextEp, lang)}"><span class="ep-nav-text"><small>${UI[lang].nextEpisode} · Ep. ${nextEp.episodeNumber} →</small><strong>${esc(epTitle(nextEp, lang))}</strong></span><img class="ep-nav-cover" src="${nextEp.cover}" alt="${esc(epTitle(nextEp, lang))}"></a>` : '';
        const epNav = (epNavPrev || epNavNext) ? `<nav class="episode-nav" aria-label="${esc(UI[lang].episodes)}">${epNavPrev}${epNavNext}</nav>` : '';

        const html = `<!DOCTYPE html>
<html lang="${LANGS[lang].htmlLang}">
<head>
${headHtml}
</head>
<body>
${nav(lang, (k) => epPath(s, ep, k))}

<section class="episode-hero">
  <div class="episode-hero-inner">
    <nav class="breadcrumbs"><a href="${homePath(lang)}">${esc(UI[lang].podcast)}</a> / <a href="${SINGLE_SERIES ? homePath(lang) : seriesPath(s, lang)}">${esc(seriesName(s, lang))}</a> / <span>${esc(epTitle(ep, lang))}</span></nav>
    <h1>${esc(epTitle(ep, lang))}</h1>
    <div class="episode-meta">
      <span>${UI[lang].hosts}：${esc(ep.hosts.join(' · '))}</span>
      <span>${UI[lang].published} ${ep.datePublished}</span>
      <span>${UI[lang].duration} ${epDurLabel(ep, lang)}</span>
    </div>
  </div>
</section>

<div class="episode-body">
  <figure class="episode-cover">
    <img src="${ep.cover}" alt="${esc(epTitle(ep, lang))}" loading="lazy">
  </figure>
  <div class="player-card">
    <div class="player-info">
      <p class="p-title">${esc(epTitle(ep, lang))}</p>
      <p class="p-meta">${esc(ep.hosts.join(' · '))} · ${epDurLabel(ep, lang)}</p>
      <audio controls preload="none" src="${ep.audio}"></audio>
    </div>
  </div>

  ${ep.sourceUrl ? `<p class="episode-source"><a class="ep-source-link" href="${ep.sourceUrl}" target="_blank" rel="noopener">🎧 ${esc(UI[lang].sourceLink)} ↗</a></p>` : ''}

  ${ep.youtube ? `
  <h2 class="section-title">${UI[lang].video}</h2>
  <div class="video-embed">
    <iframe src="https://www.youtube-nocookie.com/embed/${esc(ep.youtube)}" title="${esc(epTitle(ep, lang))}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>` : ''}

  <div class="intro">
    ${esc(epIntro(ep, lang)).split('\n').map((p) => `<p>${esc(p)}</p>`).join('\n')}
  </div>

  <h2 class="section-title">${UI[lang].outline}</h2>
  <ul class="outline">
    ${outline}
  </ul>

  <h2 class="section-title">${UI[lang].keypoints}</h2>
  <ul class="keypoints">
    ${kp}
  </ul>

  <details class="transcript">
    <summary>${UI[lang].transcript}</summary>
    <div class="transcript-body">
      ${transcriptHtml}
    </div>
  </details>

  ${epNav}

  <div style="margin-top:28px;">
    <a href="${SINGLE_SERIES ? homePath(lang) : seriesPath(s, lang)}" style="font-family:var(--font-serif);font-weight:600;">← ${UI[lang].backToSeries}</a>
  </div>

  ${appIntroHtml(lang)}
</div>

${footer(lang)}
${stickyBarHtml(lang)}
${bodyScripts()}
</body>
</html>`;

        const dir = path.join(DIST, 'podcast', s.slug, ep.slug, LANGS[lang].dir);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }
    }
  }
}

/* ---- sitemap (hreflang alternates, mirrors blog) ---- */
function buildSitemap() {
  const urls = [];
  const add = (loc, alts, video) => urls.push({ loc, alts, video: video || '' });

  for (const lang of LANG_KEYS) add(DOMAIN + homePath(lang), altUrls((k) => homePath(k)));
  for (const s of seriesList) {
    if (!SINGLE_SERIES) {
      for (const lang of LANG_KEYS) add(DOMAIN + seriesPath(s, lang), altUrls((k) => seriesPath(s, k)));
    }
    for (const ep of episodesOrdered(s)) {
      for (const lang of LANG_KEYS) {
        const video = (lang === 'zh-TW' && ep.youtube)
          ? videoSitemapEntry(s, ep)
          : '';
        add(DOMAIN + epPath(s, ep, lang), altUrls((k) => epPath(s, ep, k)), video);
      }
    }
  }

  const urlEntries = urls
    .map((u) => {
      const alts = u.alts
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.code}" href="${a.url}"/>`)
        .join('\n      ');
      const video = u.video ? `\n    ${u.video}` : '';
      return `  <url>\n    <loc>${u.loc}</loc>\n    ${alts}${video}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'podcast', 'sitemap.xml'), xml);
}

function videoSitemapEntry(s, ep) {
  const id = ep.youtube;
  const duration = isoDurationToSeconds(ep.duration);
  return `<video:video>
    <video:thumbnail_loc>https://i.ytimg.com/vi/${id}/hqdefault.jpg</video:thumbnail_loc>
    <video:title>${esc(ep.titleTw)}</video:title>
    <video:description>${esc(ep.introTw)}</video:description>
    <video:player_loc allow_embed="yes">https://www.youtube.com/embed/${id}</video:player_loc>
    <video:upload_date>${ep.datePublished}</video:upload_date>
    ${duration ? `<video:duration>${duration}</video:duration>` : ''}
    <video:family_friendly>yes</video:family_friendly>
  </video:video>`;
}

/* ---- per-series RSS feed ---- */
function buildFeeds() {
  for (const s of seriesList) {
    const items = episodesOrdered(s).map((ep) => {
      const date = new Date(ep.datePublished).toUTCString();
      return `    <item>
      <title>${esc(ep.titleTw)}</title>
      <link>${DOMAIN + epPath(s, ep, 'zh-TW')}</link>
      <guid isPermaLink="true">${DOMAIN + epPath(s, ep, 'zh-TW')}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(ep.introTw)}</description>
      <itunes:duration>${isoDurationToClock(ep.duration)}</itunes:duration>
      <itunes:image href="${ep.cover}"/>
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <enclosure url="${ep.audio}" length="${ep.audioSize}" type="audio/mpeg"/>
    </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
  <channel>
    <title>${esc(s.nameTw)}</title>
    <link>${DOMAIN + seriesPath(s, 'zh-TW')}</link>
    <language>${s.language}</language>
    <description>${esc(s.descTw)}</description>
    <itunes:image href="${s.cover}"/>
    <itunes:author>GraceWord</itunes:author>
    <itunes:explicit>no</itunes:explicit>
    <itunes:category text="Religion &amp; Spirituality"/>
${items}
  </channel>
</rss>`;
    const dir = path.join(DIST, 'podcast', s.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'feed.xml'), rss);
  }
}

/* ---- copy assets (combined CSS → dist 供上传 CDN) ---- */
function copyAssets() {
  const out = path.join(DIST, 'podcast');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'style.css'), COMBINED_CSS);
}

/* ---- run ---- */
function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyAssets();
  buildHome();
  buildSeriesPages();
  buildEpisodePages();
  buildSitemap();
  buildFeeds();
  console.log('Podcast build complete →', DIST);
}

main();
