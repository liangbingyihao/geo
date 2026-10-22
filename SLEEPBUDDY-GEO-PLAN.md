# SleepBuddy GEO/SEO 改进方案（对标 HolyJot）

> 目标：把 `sleep-buddy.com` 从「3 页纯展示落地页」升级为 HolyJot 级别的「可被搜索与 AI 正确识别、可规模化扩张的内容站」。全程对标 holyjot 优点，同时沿用本仓库已确立的 GEO 规范（`GEO-WRITING-RULES.md` / `GEO-SITE-STRUCTURE.md`）与 GraceWord 已落地的最佳实践。

## 0. 核心理念（一句话）

HolyJot 赢在 **一页一意图 × 程序化矩阵 × 轮辐内链 × 内容飞轮**；SleepBuddy 当前连「功能可被 AI 读到」都做不到。→ 先补地基（P0），再铺矩阵（P1），后建权威（P2）。

## 1. HolyJot 优点摘要（本方案要借鉴的）

1. 6 大程序化矩阵：竞品对比页（alternative）／免费交互工具页／可下载模板／功能子页／内容集／逐日博客。
2. 每页同构模板：H1=目标词 → benefit 卡片 → 三步 → 带出处经文/数据 → 5 条 FAQ → CTA。
3. Schema 全套：`Organization + WebSite(SearchAction) + SoftwareApplication + FAQPage + ContactPoint + Article`。
4. 轮辐式 footer 内链（每页 50+ 条分 3 组目录）。
5. E-E-A-T 完整（地址/电话/社媒/公司页/姊妹产品交叉引流）。

## 2. HolyJot 短板 → 本方案的反超点

- **robots 全禁 AI** → 我们采用 FaithGPT 式策略（详见 `FAITHGPT-GEO-PLAN.md`）：**放行 AI 爬虫（引用+训练），封杀纯带宽爬虫**（GEO-first）。
- **无多语言/hreflang** → SleepBuddy 走 `en/zh-CN/zh-TW` 三语言 hreflang（中文是空档优势）。
- **博客用 `Article` 非 `BlogPosting`、测验页无 `Quiz` schema** → 我们按仓库规范做得更细。

## 3. 实施路线图

### P0 —— 地基（最高优先，投入小见效快）

> 使命：让现有页面「可被搜索与 AI 正确识别」。

| # | 事项 | 现状 → 目标 | 产出 |
|---|---|---|---|
| P0-1 | **功能内容文字化** | 纯图片轮播 → 每功能 HTML 标题+描述，图仅作配图 | 功能可被 AI/搜索抓取（最大单点漏洞） |
| P0-2 | **首页 Schema** | 无 → `Organization/WebSite/SoftwareApplication/FAQPage` | 复用 graceword 模板，含 `sameAs` 社媒 |
| P0-3 | **OG/Twitter/Canonical** | 缺 → 补齐（og:image 用 1200×630 JPG） | 社交分享卡片稳定 |
| P0-4 | **语言 URL 化** | JS 单 URL 切换 → `/en/` `/zh/`（含 zh-TW）+ hreflang | 中文内容可独立收录与 AI 引用 |
| P0-5 | **robots.txt 三级化** | 默认 Allow → 显式放行 9 类 AI 爬虫（引用+训练）+ 封杀 10 类 leech、加 sitemap | 与 FaithGPT 策略一致（见下） |
| P0-6 | **首页 FAQ 区块** | 无 → 5-8 条真实问题（配 FAQPage schema） | 捕获长尾问答位 |

参考 robots.txt 策略（与 `FAITHGPT-GEO-PLAN.md` §4 一致）：

```
User-agent: *
Allow: /

# AI crawlers we WANT (citations AND training presence)
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: CCBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: cohere-ai
Allow: /

# Leech crawlers (bandwidth, no traffic value)
User-agent: Bytespider
Disallow: /
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: DataForSeoBot
Disallow: /
User-agent: BLEXBot
Disallow: /
User-agent: PetalBot
Disallow: /
User-agent: Amazonbot
Disallow: /
User-agent: Bytedance
Disallow: /

Sitemap: https://sleep-buddy.com/sitemap.xml
```

### P1 —— 程序化矩阵（套用 HolyJot 打法）

| # | 事项 | 说明 |
|---|---|---|
| P1-1 | **博客接入** | 解压 `sleepbuddy-blog.zip` → 接入 `build.js` 多站点化；三语言 + `BlogPosting/FAQPage` + crossLinks + 数据引用带出处（NIH/CDC/Sleep Foundation + 年份） |
| P1-2 | `/features` 功能页 | ItemList schema，后续拆 `/features/{slug}` 子页 |
| P1-3 | **睡眠版免费工具页** | `/free-sleep-calculator` `/free-bedtime-calculator` `/sleep-debt-calculator`（交互工具=外链磁铁） |
| P1-4 | **竞品对比页** | `/sleep-cycle-alternative` `/sleep-town-alternative` 等 App Store 竞品 |
| P1-5 | **节律型测验页** | chronotype quiz + `Quiz` schema + 分享三件套（复用圣经人物 MBTI 成功经验） |

### P2 —— 增长与 E-E-A-T

| # | 事项 | 说明 |
|---|---|---|
| P2-1 | 轮辐式 footer 内链 | 工具/功能/博客/对比四组目录（页面就绪后上） |
| P2-2 | 姊妹产品交叉引流 | graceword ↔ sleepbuddy 互链 |
| P2-3 | 可下载模板 | `21天早睡挑战打卡表.pdf` 等 |
| P2-4 | `llms.txt` + `aggregateRating` | 内容成型后补 |

## 4. 验收标准

- P0 后：首页 Google 富结果可识别 `Organization/SoftwareApplication/FAQPage`；`site:sleep-buddy.com` 命中英文与中文 URL 各一套；AI 问答（如「什么 App 能帮我早睡」）能引用睡眠锁屏/好友共眠功能文字。
- P1 后：sitemap 从 3 条 → 30+ 条，工具页/对比页开始进搜索。
- 每篇内容过 `GEO-WRITING-RULES.md` 自查清单。

## 5. 与现有 TODO 的映射

在 `TODO.md` 新增「SleepBuddy」小节，引用上述 P0-P2；P0 完成后勾掉既有 `sleep-buddy/blog` 接入与主页多语言 URL 化两项。