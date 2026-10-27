'use strict';

/**
 * GraceWord 博客构建配置 —— 供 shared/build/blog-builder.js 使用。
 */
const path = require('path');
const OpenCC = require('opencc-js');

const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' });

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap';

module.exports = {
  name: 'GraceWord',
  domain: 'https://grace-word.com',
  cdn: 'https://cdn.grace-word.com',
  logoUrl: 'https://cdn.grace-word.com/home/logo.webp',
  ogImage: 'https://cdn.grace-word.com/home/logo.webp',
  downloadUrl: '/action/download',
  gaId: 'G-7CEHJHLWK1',
  fonts: FONTS,
  headerFooter: require('../../site/header-footer.js'),
  deps: { marked: require('marked'), OpenCC },
  toTw: (s) => s2t(s).replace(/靈脩/g, '靈修').replace(/軟件/g, '軟體'),
  rootDir: path.resolve(__dirname, '..'),
  srcDir: path.join(path.resolve(__dirname, '..'), '20260702'),
  articlesJson: path.join(__dirname, 'articles.json'),
  assetDir: path.join(__dirname, 'assets'),
  ui: {
    en: {
      appName: 'GraceWord',
      home: 'Home',
      blog: 'Articles',
      podcast: 'Podcast',
      heroTitle: 'Articles',
      heroSubtitle: 'Scripture, devotion, and practical faith — resources to deepen your daily walk with God.',
      searchPlaceholder: 'Search articles...',
      catAll: 'All',
      readMore: 'Read More →',
      published: 'Published',
      related: 'Related Articles',
      stickyTagline: 'Scripture · Worship · Devotion',
      stickyBtn: 'Download GraceWord Free →',
      followTitle: 'Stay Connected',
      followDesc: 'Follow us for daily inspiration',
    },
    'zh-CN': {
      appName: '恩语',
      home: '首页',
      blog: '文章',
      podcast: '播客',
      heroTitle: '文章',
      heroSubtitle: '经文、灵修与实用信仰——帮助你深化与神同行之路的资源。',
      searchPlaceholder: '搜索文章...',
      catAll: '全部',
      readMore: '阅读全文 →',
      published: '发布于',
      related: '相关文章',
      stickyTagline: '经文 · 敬拜 · 灵修',
      stickyBtn: '免费下载恩语 →',
      followTitle: '保持联系',
      followDesc: '关注我们获取每日灵感',
    },
  },
  list: {
    en: {
      title: 'GraceWord Articles — Scripture, Devotion & Faith Resources',
      desc: 'Explore articles on Bible verses, gratitude journaling, Bible study methods, Christian app reviews, and biblical personality quizzes.',
    },
    'zh-CN': {
      title: 'GraceWord 文章 — 经文、灵修与信仰资源',
      desc: '探索关于圣经经文、感恩日记、查经方法、基督徒应用评测与圣经人格测验的文章。',
    },
    'zh-TW': {
      title: 'GraceWord 文章 — 經文、靈修與信仰資源',
      desc: '探索關於聖經經文、感恩日記、查經方法、基督徒應用評測與聖經人格測驗的文章。',
    },
  },
  softwareApp: {
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
  },
  quiz: {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'Which Biblical Character Are You?',
    description:
      'A personality quiz that maps your temperament to biblical characters and provides personalized spiritual growth insights.',
    about: { '@type': 'Thing', name: 'Biblical Characters Personality Types' },
  },
};
