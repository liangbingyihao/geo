# Geo（GraceWord / Sleep-Buddy）SEO/GEO — 待办清单

> 目录结构见 README.md；写作规范见 GEO-WRITING-RULES.md；站点结构与 Schema 规范见 GEO-SITE-STRUCTURE.md；博客构建/部署在 `graceword/blog/` 下。

## ✅ 已完成
- [x] Cloudflare 关闭 AI 爬虫屏蔽（robots.txt：允许搜索/引用、禁止训练，已上线生效）
- [x] 部署上线：/blog/（en/zh-cn/zh-tw）、/blog/sitemap.xml、CDN assets、robots.txt
- [x] Cloudflare：www -> 非www 301 + HTTP -> HTTPS（已生效）
- [x] 主页「Blog」→「Articles」入口（语言感知跳转 + 三语言标签）
- [x] 正文内链：59 条 crossLinks，无孤儿
- [x] 主页 schema：Organization / WebSite / SoftwareApplication / FAQPage
- [x] 博客 HowTo schema：B01 / C02 / C04（英文 steps）
- [x] 裸域名自动链接（grace-word.com → /）
- [x] FAQPage 全量覆盖（25/25）+ 「问题N：」前缀清理
- [x] robots.txt 加 /share/ /r/ 禁止 + CCBot 放行
- [x] GEO 写作规范 → GEO-WRITING-RULES.md（根目录）
- [x] GEO 站点结构/Schema 规范 → GEO-SITE-STRUCTURE.md（根目录）
- [x] BibleTI 入口调整：header「Bible Quiz」直链 + 「Take the Quiz」按钮改真链接 + 两处新 tab（指向生产 /bibleti）
- [x] quiz 链接修复：test.grace-word.com/bibleti → grace-word.com/bibleti

## 🟡 P1
- [ ] BibleTI 页增强（bibleti 页代码不在本仓库，需那边配合）：Quiz schema + 分享机制（① 一键生成 Instagram 适配图 ② 一键复制分享文案 ③ 直接跳转 App 下载）+ 页内「返回主页」入口
- [ ] Sleep-Buddy 博客：解压 sleepbuddy-blog.zip，接入构建体系（build.js 多站点化）
- [x] 播客 `/podcast/` 基建 + 第 1 集构建完成（首页 CollectionPage + 系列页 PodcastSeries + 单集页 PodcastEpisode + 大纲/可展开逐字稿，zh-TW/zh-CN，每系列 RSS，dist 就绪）——见 `graceword/podcast/README.md`
- [ ] 播客部署上线：`style.css` 上传 CDN、nginx 加 `location /podcast/`、robots.txt 追加 podcast sitemap、rsync dist/ 到 `/var/www/html/graceword/podcast/`

## 🟢 P2
- [ ] A01->B01 锚文本：gratitude journal -> AI-powered gratitude journal
- [ ] og:image 换 1200×630 JPG 横幅（现用 logo.webp；QQ/微信分享卡片对 WebP 支持不稳）
- [ ] 主页多语言 URL 化（/zh-cn/ /zh-tw/ + hreflang）——现单 URL + JS 切换，中文内容不可独立收录/AI 引用
- [ ] `/features` 功能详情页（5 大功能：感恩日记 / AI 查经 / 灵修定制 / 经文壁纸 / 敬拜音乐）
- [ ] `/about` 创始故事页（AboutPage schema + Organization.founder）
- [ ] 播客 RSS `/podcast/ai-era-jesus/feed.xml` + 提交 Apple/Spotify（音频上 CDN 后）；后续集 ASR 逐字稿（粤语）增强 GEO

## 🟢 P3（可选 / 之后）
- [ ] `llms.txt`（站点导览 + 25 篇链接与描述，三语言）—— 新兴标准，供 LLM 工具/Agent 摄取，非必需
- [ ] `llms-full.txt`（全部文章正文合并，供 AI 一次摄取）—— 可选
- [ ] 目录锚点（TOC，长文页内跳转）
- [ ] HowTo 步骤多语言化（现仅英文 steps）
- [ ] SoftwareApplication 加 aggregateRating（需真实 App Store 评分）
- [ ] 低入链文章补链（已无孤儿，可选）
- [ ] `/features` 若需更细粒度：拆成 5 个功能子页（/features/gratitude-journal 等）

## ✝️ GraceWord（对标 FaithGPT，完整方案见 `FAITHGPT-GEO-PLAN.md`）

### 🟡 P0 GEO 地基（最高优先）
- [ ] robots.txt 三级化：显式放行 9 类 AI 爬虫（引用+训练）+ 封杀 10 类 leech（参考实现见方案 §4）
- [ ] llms.txt + llms-full.txt（从 P3 提级，仿 FaithGPT 结构：Primary URLs + 文章/播客/测验描述 + 三语言）
- [ ] 首页 Schema 增强：+ Product + AggregateRating（App Store 真实评分）+ Review/Person（用 feedback.txt 素材）+ Brand
- [ ] hreflang 三语 URL（中文 URL 化从 P2 提级；en/zh-CN/zh-TW 正确关联 → 反超 FaithGPT 无 hreflang）

### 🟢 P1 程序化矩阵
- [ ] Persona 角色页（15 个）：/for-pastors /for-youth /for-parents /for-small-groups /for-sunday-school /for-new-believers /for-worship-leaders /for-students /for-counselors…
- [ ] Christian App 目录起步：/tools/app/{id} MobileApplication schema，先 20-50 条（复用博客里 app 对比内容）
- [ ] BibleTI 数据化：结果页公开数据/排行榜 + Quiz schema
- [ ] Newsletter 周刊（AI + 信仰主题，仿 FaithGPT 25 期）
- [ ] 博客规模化：25 → 100+，覆盖 persona / 对比 / 工具三类词，周 2-3 篇

### 🟢 P2 生态与规模化
- [ ] 竞品对比页：/faithgpt-alternative /holyjot-alternative /youversion-alternative…
- [ ] 多语言扩展 es/fr（中期）
- [ ] MCP/API 暴露（远期，让 Agent 原生调用）

## 🌙 SleepBuddy（对标 HolyJot，完整方案见 `SLEEPBUDDY-GEO-PLAN.md`）

### 🟡 P0 地基（最高优先）
- [ ] 功能内容文字化：纯图片轮播 → 每功能 HTML 标题+描述（最大单点漏洞）
- [ ] 首页 Schema：Organization/WebSite/SoftwareApplication/FAQPage（复用 graceword 模板）
- [ ] OG/Twitter/Canonical（og:image 用 1200×630 JPG）
- [ ] 语言 URL 化 `/en/` `/zh/`（含 zh-TW）+ hreflang，废除纯 JS 切换
- [ ] robots.txt 标准化：放行 GPTBot/CCBot/Google-Extended、禁训练、加 sitemap
- [ ] 首页 FAQ 区块（5-8 条真实问题 + FAQPage schema）

### 🟢 P1 程序化矩阵
- [ ] 博客接入：解压 sleepbuddy-blog.zip → build.js 多站点化（三语言 + BlogPosting/FAQPage + crossLinks + 数据引用带出处）
- [ ] `/features` 功能页（ItemList schema）
- [ ] 免费工具页：/free-sleep-calculator /free-bedtime-calculator /sleep-debt-calculator
- [ ] 竞品对比页：sleep-cycle / sleep-town 等 alternative
- [ ] 节律型测验页（chronotype quiz + Quiz schema + 分享三件套）

### 🟡 P2 增长与 E-E-A-T
- [ ] 轮辐式 footer 内链（工具/功能/博客/对比四组）
- [ ] graceword ↔ sleepbuddy 交叉引流
- [ ] 可下载模板（21 天早睡挑战打卡表等）
- [ ] llms.txt + aggregateRating

## 发布后如何修改
> 完整构建/部署命令（site / blog / podcast / bibleti + 安全规则 + 验证）见根目录 [`DEPLOY.md`](DEPLOY.md)。

- 博客：改源（graceword/blog/20260702/*.md 或 build/articles.json）→ 重建 → rsync
  - 生产：node graceword/blog/build/build.js
  - 测试：SITE_URL=https://test.grace-word.com NOINDEX=1 OUT_DIR=dist-test node graceword/blog/build/build.js
  - 只改内容、不改 slug；CSS/JS 带 ?v=<hash>，改动自动换新版本。
- 主页（手写 HTML）：改 index.html + js/config.js、i18n.js、main.js → 上传 CDN（记得 ?v= 版本号 +1）→ 同步 index.html。
