'use strict';

/**
 * GraceWord — shared site header & footer (single source of truth).
 * Used by the blog build and the podcast build so header/footer stay
 * identical across site, blog and podcast.
 *
 * Header layout/style is based on the homepage (grace-word.com/).
 */

const CDN = 'https://cdn.grace-word.com';
const LOGO_URL = CDN + '/home/logo.webp';

const CAMPAIGN = require('./campaign.json');
const PROMO = CAMPAIGN.promo;

function promoActive(now) {
  if (!PROMO || !PROMO.enabled) return false;
  const t = (now || new Date()).getTime();
  const s = Date.parse(PROMO.start + 'T00:00:00Z');
  const e = Date.parse(PROMO.end + 'T23:59:59Z');
  return t >= s && t <= e;
}
function promoLabel(lang) {
  return lang === 'zh-CN' ? PROMO.labelCn : lang === 'zh-TW' ? PROMO.labelTw : PROMO.labelEn;
}

const LINK = {
  appStore: 'https://apps.apple.com/app/id6758707628',
  googlePlay: 'https://play.google.com/store/apps/details?id=app.graceword.android',
  instagram: 'https://www.instagram.com/graceword_love_you/',
  facebook: 'https://www.facebook.com/profile.php?id=61584842382498',
  youtube: 'https://www.youtube.com/@GraceWord-Love-You',
  email: 'mailto:support@grace-word.com',
};
const ICON = {
  instagram: CDN + '/home/icon-instagram.webp',
  facebook: CDN + '/home/icon-facebook.webp',
  youtube: CDN + '/home/icon-youtube.webp',
};

// 邮件订阅接口（同源相对路径，test.grace-word.com 经 APISIX 路由到 Go API）
const NEWSLETTER_ENDPOINT = '/web/subscribe';

const LANGS = [
  { code: 'en', label: 'EN', hreflang: 'en' },
  { code: 'zh-CN', label: '简体', hreflang: 'zh-CN' },
  { code: 'zh-TW', label: '繁體', hreflang: 'zh-TW' },
];

const APP_NAME = { en: 'GraceWord', 'zh-CN': '恩语', 'zh-TW': '恩語' };

/*
 * blog:      /blog/  /blog/zh-cn/  /blog/zh-tw/
 * podcast:   /podcast/ (zh-TW default) /podcast/zh-cn/   (no English)
 */
function blogDir(lang) { return lang === 'zh-CN' ? 'zh-cn/' : lang === 'zh-TW' ? 'zh-tw/' : ''; }
function podcastDir(lang) { return lang === 'zh-CN' ? 'zh-cn/' : ''; }

const NAV = {
  en: [['Features', '/#features'], ['BibleTI Test', '/bibleti'], ['Articles', 'BLOG'], ['Podcast', 'PODCAST'], ['About', '/about'], ['Contact Us', '/#contact']],
  'zh-CN': [['功能', '/#features'], ['BibleTI测试', '/bibleti'], ['文章', 'BLOG'], ['播客', 'PODCAST'], ['关于', '/about'], ['联系我们', '/#contact']],
  'zh-TW': [['功能', '/#features'], ['BibleTI測試', '/bibleti'], ['文章', 'BLOG'], ['播客', 'PODCAST'], ['關於', '/about'], ['聯絡我們', '/#contact']],
};

const T = {
  en: {
    tagline: 'Scripture · Worship · Devotion', explore: 'Explore', support: 'Support',
    features: 'Features', quiz: 'BibleTI Test', articles: 'Articles', podcast: 'Podcast',
    about: 'About', contact: 'Contact Us', privacy: 'Privacy Policy', terms: 'Terms of Use',
    pricing: 'Pricing',
    download: 'Get the App', appStore: 'App Store', googlePlay: 'Google Play',
    newsletterTitle: 'Daily GraceWord, straight to your inbox',
    newsletterSub: 'Devotions, Scripture, and encouragement.',
    newsletterPlaceholder: 'Your email',
    newsletterBtn: 'Subscribe',
    newsletterNote: 'You can unsubscribe at any time.',
    newsletterOk: 'Thanks! Please check your inbox to confirm.',
    newsletterErr: 'Something went wrong. Please try again later.',
    newsletterInvalid: 'Please enter a valid email address.',
  },
  'zh-CN': {
    tagline: '经文 · 敬拜 · 灵修', explore: '探索', support: '支持',
    features: '功能', quiz: 'BibleTI测试', articles: '文章', podcast: '播客',
    about: '关于我们', contact: '联系我们', privacy: '隐私政策', terms: '使用条款',
    pricing: '定价',
    download: '下载应用', appStore: 'App Store', googlePlay: 'Google Play',
    newsletterTitle: '每日恩语，直达你的邮箱',
    newsletterSub: '灵修、经文与鼓励。',
    newsletterPlaceholder: '你的邮箱',
    newsletterBtn: '订阅',
    newsletterNote: '可随时退订。',
    newsletterOk: '谢谢！请查收邮箱确认订阅。',
    newsletterErr: '订阅失败，请稍后重试。',
    newsletterInvalid: '请输入有效的邮箱地址。',
  },
  'zh-TW': {
    tagline: '經文 · 敬拜 · 靈修', explore: '探索', support: '支援',
    features: '功能', quiz: 'BibleTI測試', articles: '文章', podcast: '播客',
    about: '關於我們', contact: '聯絡我們', privacy: '隱私政策', terms: '使用條款',
    pricing: '定價',
    download: '下載應用', appStore: 'App Store', googlePlay: 'Google Play',
    newsletterTitle: '每日恩語，直達你的信箱',
    newsletterSub: '靈修、經文與鼓勵。',
    newsletterPlaceholder: '你的信箱',
    newsletterBtn: '訂閱',
    newsletterNote: '可隨時退訂。',
    newsletterOk: '謝謝！請查收信箱確認訂閱。',
    newsletterErr: '訂閱失敗，請稍後重試。',
    newsletterInvalid: '請輸入有效的信箱地址。',
  },
};

function navItems(lang) {
  const hd = blogDir(lang); // homepage family uses the same dir convention: '', 'zh-cn/', 'zh-tw/'
  const items = NAV[lang].map(([label, href]) => {
    if (href === 'BLOG') return [label, '/blog/' + blogDir(lang)];
    if (href === 'PODCAST') return [label, '/podcast/' + podcastDir(lang)];
    if (href === '/#features') return [label, '/' + hd + '#features'];
    if (href === '/about') return [label, '/about/' + hd];
    if (href === '/#contact') return [label, '/' + hd + '#contact'];
    return [label, href];
  });
  if (promoActive()) items.push([promoLabel(lang), '/' + PROMO.slug + '/' + hd]);
  return items;
}

function activeAttr(href, active) {
  if (active === 'blog' && /\/blog\//.test(href)) return ' class="active"';
  if (active === 'podcast' && /\/podcast\//.test(href)) return ' class="active"';
  if (active === 'about' && /\/about/.test(href)) return ' class="active"';
  if (active === 'features' && /\/#features/.test(href)) return ' class="active"';
  return '';
}

/**
 * @param {object} o
 * @param {string} o.lang        current language code (en/zh-CN/zh-TW)
 * @param {string} o.active      'blog' | 'podcast' | '' (highlight nav item)
 * @param {function} o.langHref  (code) => url of the current page in that language
 * @param {array}   o.langs      optional [{code,label,hreflang}], default = LANGS
 */
function header({ lang, active = '', langHref, langs }) {
  const list = langs || LANGS;
  const nav = navItems(lang)
    .map(([label, href]) => `<a href="${href}"${activeAttr(href, active)}>${label}</a>`)
    .join('\n      ');

  const opts = list.map((l) => {
    const act = l.code === lang ? ' active' : '';
    return `<a class="lang-option${act}" href="${langHref(l.code)}" hreflang="${l.hreflang}">${l.label}</a>`;
  });
  const mobileOpts = opts.join('');
  const dropOpts = opts.join('\n        ');

  const cur = list.find((l) => l.code === lang) || { label: lang };

  return `<header class="header">
  <div class="header-inner">
    <a href="/${blogDir(lang)}" class="header-logo" aria-label="GraceWord"><img src="${LOGO_URL}" alt="GraceWord"><span>${APP_NAME[lang] || lang}</span></a>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button>
    <nav class="header-nav" id="headerNav">
      ${nav}
      <div class="lang-switch-mobile">
        <div class="lang-dropdown-mobile">${mobileOpts}</div>
      </div>
    </nav>
    <div class="lang-switch" id="langSwitch">
      <button class="lang-select-trigger" type="button" aria-haspopup="true" aria-expanded="false">
        <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="lang-current">${cur.label}</span>
        <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="lang-dropdown">
        ${dropOpts}
      </div>
    </div>
  </div>
</header>`;
}

function footer({ lang }) {
  const t = T[lang];
  const bdir = blogDir(lang);
  const pdir = podcastDir(lang);
  return `<section class="newsletter">
  <div class="newsletter-inner">
    <h2 class="newsletter-title">${t.newsletterTitle}</h2>
    <p class="newsletter-sub">${t.newsletterSub}</p>
    <form class="newsletter-form" id="newsletterForm" action="#" method="post" novalidate
      data-ok="${t.newsletterOk}" data-err="${t.newsletterErr}" data-invalid="${t.newsletterInvalid}">
      <input class="newsletter-input" type="email" name="email" placeholder="${t.newsletterPlaceholder}" required aria-label="${t.newsletterPlaceholder}" autocomplete="email">
      <button class="newsletter-btn" type="submit">${t.newsletterBtn}</button>
    </form>
    <p class="newsletter-msg" role="status" aria-live="polite"></p>
    <p class="newsletter-note">${t.newsletterNote}</p>
  </div>
</section>
<footer class="site-footer" id="contact">
  <div class="site-footer-inner">
    <div class="site-footer-col site-footer-brand">
      <a href="/${blogDir(lang)}" class="site-footer-logo"><img src="${LOGO_URL}" alt="GraceWord"><span>${APP_NAME[lang]}</span></a>
      <p class="site-footer-tagline">${t.tagline}</p>
      <div class="site-footer-social">
        <a href="${LINK.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><img src="${ICON.instagram}" alt="Instagram" loading="lazy"></a>
        <a href="${LINK.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><img src="${ICON.facebook}" alt="Facebook" loading="lazy"></a>
        <a href="${LINK.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><img src="${ICON.youtube}" alt="YouTube" loading="lazy"></a>
      </div>
      <span class="site-footer-email">support@grace-word.com</span>
    </div>
    <div class="site-footer-col">
      <h4>${t.explore}</h4>
      <a href="/${blogDir(lang)}#features">${t.features}</a>
      <a href="/bibleti">${t.quiz}</a>
      <a href="/blog/${bdir}">${t.articles}</a>
      <a href="/podcast/${pdir}">${t.podcast}</a>
      <a href="/about/${blogDir(lang)}">${t.about}</a>
      <a href="/pricing/${blogDir(lang)}">${t.pricing}</a>
    </div>
    <div class="site-footer-col">
      <h4>${t.support}</h4>
      <a href="/privacy">${t.privacy}</a>
      <a href="/terms">${t.terms}</a>
    </div>
    <div class="site-footer-col">
      <h4>${t.download}</h4>
      <a href="${LINK.appStore}" target="_blank" rel="noopener">${t.appStore}</a>
      <a href="${LINK.googlePlay}" target="_blank" rel="noopener">${t.googlePlay}</a>
    </div>
  </div>
  <div class="site-footer-bottom">
    <span>© 2026 ${APP_NAME[lang]}</span>
  </div>
</footer>`;
}

/* Shared header/footer CSS (based on the homepage header). */
const HEADER_CSS = `
/* ===== Site header (shared, homepage-based) ===== */
:root { --header-height: 60px; }
.header {
  position: sticky; top: 0; left: 0; right: 0; z-index: 1000;
  background: var(--bg); height: var(--header-height); display: flex; align-items: center;
  padding: 0 80px;
}
.header-inner { max-width: 1360px; margin: 0 auto; width: 100%; display: flex; align-items: center; position: relative; }
.header-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.header-logo img { height: 36px; width: auto; }
.header-logo span { font-size: 32px; font-weight: bold; color: var(--text); font-family: 'GenRyuMin TW TTF-Bold', 'GenRyuMin', 'Noto Serif SC', serif; }
.header-nav { display: flex; align-items: center; gap: 40px; position: absolute; left: 305px; margin-left: 0; }
.header-nav a { color: var(--text); text-decoration: none; font-size: 24px; font-weight: 400; transition: color 0.2s; cursor: pointer; font-family: var(--font-serif); }
.header-nav a:hover, .header-nav a.active { color: var(--primary); }
.lang-switch { position: relative; margin-left: auto; }
.lang-select-trigger { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 4px 8px; font-size: 24px; font-weight: 400; color: var(--text); background: none; border: none; font-family: var(--font-serif); }
.lang-select-trigger:hover { color: var(--primary); }
.lang-current { font-size: 24px; font-family: var(--font-serif); }
.lang-switch .globe-icon { width: 24px; height: 24px; color: var(--text); flex-shrink: 0; }
.lang-switch .chevron { color: var(--text-muted); }
.lang-dropdown { position: absolute; top: 100%; right: 0; display: none; background: var(--white); border: 1px solid var(--border); border-radius: 6px; min-width: 100px; box-shadow: var(--shadow); z-index: 100; padding: 4px 0; }
.lang-dropdown.open { display: block; }
.lang-dropdown .lang-option { display: block; width: 100%; padding: 8px 16px; text-align: left; font-size: 20px; color: var(--text); font-family: var(--font-serif); white-space: nowrap; }
.lang-dropdown .lang-option:hover { background: var(--bg); color: var(--primary); }
.lang-dropdown .lang-option.active { color: var(--primary); font-weight: 700; }
.lang-switch-mobile { display: none; }
.menu-toggle { display: none; background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; }
@media (max-width: 1500px) {
  .header-nav { gap: 22px; }
  .header-nav a { font-size: 20px; }
}
@media (max-width: 768px) {
  .header { padding: 0 20px; }
  .header-logo span { font-size: 22px; }
  .header-nav a { font-size: 18px; }
  .lang-select-trigger, .lang-current { font-size: 18px; }
  .header-nav { display: none; position: absolute; top: var(--header-height); left: 0; right: 0; background: var(--bg); flex-direction: column; padding: 20px; gap: 16px; align-items: flex-start; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .header-nav.open { display: flex; }
  .menu-toggle { display: block; }
  .lang-switch-mobile { display: block; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
  .lang-switch-mobile .lang-dropdown-mobile { display: flex; gap: 4px; }
  .lang-switch-mobile .lang-option { background: none; border: 1px solid var(--border); color: var(--text); padding: 4px 10px; border-radius: 4px; font-size: 20px; cursor: pointer; font-family: var(--font-serif); }
  .lang-switch-mobile .lang-option:hover { color: var(--primary); border-color: var(--primary); }
}

/* ===== Newsletter subscribe (shared) ===== */
.newsletter { padding: 56px 24px; }
.newsletter-inner { max-width: var(--max-width); margin: 0 auto; background: #fff; box-shadow: var(--shadow-hover); border: 1px solid var(--border); border-radius: var(--radius); padding: 56px 24px; text-align: center; }
.newsletter-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
.newsletter-sub { color: var(--text-light); font-size: 0.95rem; margin-bottom: 20px; }
.newsletter-form { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 460px; margin: 0 auto; }
.newsletter-input { flex: 1; min-width: 220px; padding: 12px 16px; border: 1px solid var(--border); border-radius: 50px; font-size: 0.95rem; font-family: var(--font); color: var(--text); background: #fff; }
.newsletter-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(153,27,27,0.12); }
.newsletter-btn { padding: 12px 28px; border: none; border-radius: 50px; background: var(--primary); color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: var(--font-serif); transition: background 0.2s; }
.newsletter-btn:hover { background: var(--primary-bright); }
.newsletter-note { margin-top: 12px; font-size: 0.8rem; color: var(--text-muted); }
.newsletter-msg { margin-top: 12px; font-size: 0.9rem; font-weight: 600; min-height: 1.2em; }
.newsletter-msg.ok { color: #2e7d32; }
.newsletter-msg.err { color: var(--primary); }

/* ===== Site footer (shared, internal-link roundup) ===== */
.site-footer { background: var(--text); color: rgba(255,255,255,0.7); margin-top: 60px; }
.site-footer-inner { max-width: 1360px; margin: 0 auto; padding: 56px 24px 32px; display: grid; grid-template-columns: 1fr; gap: 32px; }
.site-footer-col { display: flex; flex-direction: column; gap: 10px; }
.site-footer-col h4 { font-family: var(--font-serif); font-size: 1rem; color: var(--white); margin-bottom: 4px; }
.site-footer-col a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; }
.site-footer-col a:hover { color: #c9a96e; }
.site-footer-email { color: rgba(255,255,255,0.85); font-size: 0.85rem; word-break: break-all; }
.site-footer-logo { display: flex; align-items: center; gap: 8px; }
.site-footer-logo img { height: 32px; width: auto; }
.site-footer-logo span { font-family: var(--font-serif); font-size: 22px; color: var(--white); font-weight: 700; }
.site-footer-tagline { font-family: var(--font-serif); font-size: 0.85rem; color: rgba(255,255,255,0.55); }
.site-footer-social { display: flex; gap: 12px; margin-top: 4px; }
.site-footer-social img { width: 28px; height: 28px; object-fit: contain; }
.site-footer-bottom { border-top: 1px solid rgba(255,255,255,0.12); }
.site-footer-bottom { max-width: 1360px; margin: 0 auto; padding: 16px 24px; font-family: var(--font-serif); font-size: 0.8rem; color: rgba(255,255,255,0.5); }
@media (min-width: 768px) {
  .site-footer-inner { grid-template-columns: 2fr 1fr 1fr 1fr; padding: 64px 24px 40px; gap: 48px; }
}
`;

/* Shared header JS (menu toggle + language dropdown). */
const HEADER_JS = `
document.getElementById('menuToggle')?.addEventListener('click', function () {
  document.getElementById('headerNav').classList.toggle('open');
});
(function () {
  var langSwitch = document.getElementById('langSwitch');
  if (!langSwitch) return;
  var trigger = langSwitch.querySelector('.lang-select-trigger');
  var dropdown = langSwitch.querySelector('.lang-dropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }
})();
/* Newsletter subscribe → POST /web/subscribe */
(function () {
  var form = document.getElementById('newsletterForm');
  if (!form) return;
  var input = form.querySelector('input[type=email]');
  var btn = form.querySelector('button[type=submit]');
  var msg = form.parentNode.querySelector('.newsletter-msg');
  var langMap = { 'en': 'en', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW' };
  var lang = langMap[document.documentElement.lang] || 'en';
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function show(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'newsletter-msg' + (ok ? ' ok' : ' err');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (input.value || '').trim();
    if (!re.test(email)) {
      show(form.getAttribute('data-invalid'), false);
      input.focus();
      return;
    }
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (err) { tz = ''; }
    btn.disabled = true;
    fetch('${NEWSLETTER_ENDPOINT}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, tz: tz, lang: lang, promote: false })
    }).then(function (res) {
      if (res.ok) {
        show(form.getAttribute('data-ok'), true);
        input.value = '';
      } else {
        res.json().catch(function () { return null; }).then(function (j) {
          var m = j && typeof j.msg === 'string' && j.msg.trim() ? j.msg : '';
          show(m || form.getAttribute('data-err'), false);
        });
      }
    }).catch(function () {
      show(form.getAttribute('data-err'), false);
    }).finally(function () {
      btn.disabled = false;
    });
  });
})();
`;

module.exports = { header, footer, HEADER_CSS, HEADER_JS, LANGS, LINK, ICON, PROMO, promoActive, promoLabel };