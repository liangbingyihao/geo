# GraceWord GEO 升级方案（对标 FaithGPT）— 附 SleepBuddy 复用

> 目标：把 `grace-word.com` 从「静态官网 + 25 篇博客」升级为 FaithGPT 级别的 **GEO-first 内容平台**。
> FaithGPT（faithgpt.io）是 GraceWord 最直接的同赛道竞品（基督教 AI 应用），其 robots / llms.txt / MCP / persona 策略是本仓库对标的黄金范本。
> 本方案仅产出文档与配置建议，不改 App 代码。

## 0. 核心理念

FaithGPT = **GEO-first**（显式放行全部 AI 爬虫：引用+训练） × **程序化矩阵**（~4,000 URL） × **数据差异化内容**（Benchmarks 基准中心） × **Agent 渠道**（MCP/API）。

GraceWord 分三阶段对齐：**P0 地基（GEO 精细度）→ P1 程序化矩阵 → P2 生态与规模化**。

## 1. FaithGPT 优点摘要（curl / sitemap 实测）

### 1.1 程序化矩阵（主 sitemap 3,207 条 + games 210 + tools 678 ≈ 4,000+ URL）

| 矩阵 | 规模 | 打法 | GraceWord 对应 |
|---|---|---|---|
| 博客 | **1,136 篇** | 内容飞轮 | 现有 25 篇 |
| App 目录 | **648+ 条** `/tools/app/{id}`（MobileApplication schema） | 程序化第三方聚合站 | 博客里的 app 对比可升级 |
| Persona 角色页 | **15 个**（sermon-prep / worship-leader / youth-pastor / small-group-leader / apologetics / seminary-student / chaplain / missionary…） | 按用户角色打搜索意图 | **缺，最该学** |
| Benchmarks | 35 模型页 + 27 发布记录 + leaderboard/categories/methodology | 独有数据内容 = 外链磁铁 + E-E-A-T | 可用 BibleTI 数据替代 |
| 免费游戏/测验 | 210+ 条 `/bible-games/` | 互动内容 | 已有 BibleTI（未数据化） |
| Newsletter | 25 期周刊 | 订阅 + 常态内容 | 缺 |
| 多语言 | `/es/` `/fr/` 全套 | 子目录 | 已有 en/zh-CN/zh-TW（更优，有 hreflang） |
| API 文档 | 8 页 `/api/*` + MCP | 开发者 SEO + 生态位 | 远期 |

### 1.2 GEO 策略（业界天花板级）

- **robots.txt 显式放行 9 个 AI 爬虫**（含训练）：GPTBot / ChatGPT-User / OAI-SearchBot / Google-Extended / anthropic-ai / Claude-Web / ClaudeBot / PerplexityBot / cohere-ai，注释原文「AI Crawlers we WANT (LLM citations / training presence)」。
- **同时封杀 10 个纯带宽爬虫**：AhrefsBot / SemrushBot / MJ12bot / DotBot / DataForSeoBot / Bytespider / Bytedance / Amazonbot / PetalBot / BLEXBot（省 CDN、防低质抓取）。
- **llms.txt**（63 行）：Primary URLs + **API/MCP 端点 + OpenAPI + 工具列表**，专为 LLM/Agent 摄取设计。
- **MCP 端点 `/api/mcp/`**：robots 显式 Allow + llms.txt 暴露 → Agent 可原生调用其能力。
- **首页 Schema 超完整**：`Product + AggregateRating(427 评·5.0) + 5×Review/Rating/Person + FAQPage(15 Q&A) + Organization/WebSite/Brand/BreadcrumbList`。
- 目录页 `CollectionPage + ItemList(32)`；App 详情页 `MobileApplication + Offer`。

### 1.3 FaithGPT 短板（我们的反超点）

- 实测**无 hreflang**（es/fr 子目录未做语言关联）→ 我们的 en/zh-CN/zh-TW hreflang 领先。
- Persona 页 schema 偏薄（仅 WebPage/Breadcrumb，未挂 SoftwareApplication）。
- **无中文覆盖** → 华人基督徒市场空档。
- benchmark slug 机器化（利于程序化、不利于人读）。

## 2. 已确认的决策

- **robots 策略：引用 + 训练全放行**（学 FaithGPT），同时封杀带宽爬虫。
- **目标站点：GraceWord 优先 + SleepBuddy 复用**。
- **产出形式：本方案文档（不改代码）**。

## 3. GraceWord 实施路线图

### P0 —— GEO 地基（最高优先）

| # | 事项 | 现状 → 目标 |
|---|---|---|
| P0-1 | **robots.txt 三级化** | 现「仅禁训练」→ 显式放行 9 类 AI 爬虫（含训练）+ 封杀 10 类 leech；参考实现见 §4 |
| P0-2 | **llms.txt + llms-full.txt** | 从 TODO P3 提级到 P1：仿 FaithGPT 结构（Primary URLs + 25 篇/播客/测验描述 + 三语言），参考 §5 |
| P0-3 | **首页 Schema 增强** | + `Product + AggregateRating + Review/Person + Brand`（用 App Store 真实评分 + 已有 feedback.txt/q&a.xlsx 素材） |
| P0-4 | **hreflang 三语 URL** | 中文 URL 化从 P2 提级；正确 en/zh-CN/zh-TW 关联 → 反超 FaithGPT |

### P1 —— 程序化矩阵（GraceWord 版）

| # | 事项 | 说明 |
|---|---|---|
| P1-1 | **Persona 角色页（15 个）** | `/for-pastors` `/for-youth` `/for-parents` `/for-small-groups` `/for-sunday-school` `/for-new-believers` `/for-worship-leaders` `/for-students` `/for-counselors`… 每页一角色、一意图、FAQ + Breadcrumb（可补 SoftwareApplication） |
| P1-2 | **Christian App 目录起步** | `/tools/app/{id}` MobileApplication schema，把博客已写的 app 对比升级为条目，先 20-50 条 |
| P1-3 | **BibleTI 数据化** | 结果页公开数据/排行榜 + Quiz schema（对照 FaithGPT games 210 页的互动规模） |
| P1-4 | **Newsletter 周刊** | AI + 信仰主题，订阅入口（仿 FaithGPT 25 期） |
| P1-5 | **博客规模化** | 25 → 100+，覆盖 persona / 对比 / 工具三类词，周 2-3 篇 |

### P2 —— 生态与规模化

| # | 事项 | 说明 |
|---|---|---|
| P2-1 | **竞品对比页** | `/faithgpt-alternative` `/holyjot-alternative` `/youversion-alternative`…（FaithGPT 有 alternatives/reviews） |
| P2-2 | **多语言扩展 es/fr** | 中期选项 |
| P2-3 | **MCP/API（远期）** | 后端若暴露 API，仿 FaithGPT 提供 MCP → 让 Agent 原生调用（杀手锏） |

## 4. robots.txt 参考实现（引用+训练全放行 + 封杀 leech）

```text
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

Sitemap: https://grace-word.com/sitemap.xml
```

> 说明：当前 `graceword/deploy/robots.txt` 的「允许引用 / 禁止训练」策略按本决策整体放开；保留 Disallow 私有路由（/share/ /r/ 等）。

## 5. llms.txt 参考结构（`grace-word.com/llms.txt`）

```text
# GraceWord

> Daily devotion, Bible quiz, gratitude journal, worship & Scripture AI for Christians. 三语言：en / zh-CN / zh-TW。

## Primary URLs
- [Home](https://grace-word.com/)
- [Bible Quiz](https://grace-word.com/bibleti)
- [Blog](https://grace-word.com/blog/)
- [Podcast](https://grace-word.com/podcast/)
- [Features](https://grace-word.com/features)

## Blog (25 篇，en/zh-CN/zh-TW)
- [文章标题](https://grace-word.com/blog/{slug}) — 一句话描述
- ...

## Tools
- BibleTI 测验 / 读经计划 / 每日经文…
```

## 6. SleepBuddy 复用项

- **精细 robots**：同 §4 三级策略（引用+训练放行、封杀 leech），更新 `SLEEPBUDDY-GEO-PLAN.md` 中 P0-5 的参考实现。
- **llms.txt**：`sleep-buddy.com/llms.txt`（Primary URLs + 博客 + 工具页）。
- **Persona 睡眠版**：`/for-teens` `/for-parents` `/for-shift-workers` `/for-early-risers`（并入 sleepbuddy P1 矩阵）。
- **博客规模化 + 免费工具**：与现有 sleepbuddy 方案一致，统一走三语言 + BlogPosting/FAQPage。

## 7. 验收标准

- P0 后：首页富结果含 `Product/AggregateRating`；`site:grace-word.com` 英文/中文 URL 各可收录；用 Perplexity/ChatGPT 提问「基督徒每日灵修 App」能引用 grace-word.com。
- P1 后：sitemap 从 30+ → 100+；persona 页、app 目录页开始进搜索与 AI 引用。
- 每篇内容过 `GEO-WRITING-RULES.md` 自查清单。

## 8. TODO 映射

在 `TODO.md` 新增「GraceWord（对标 FaithGPT）」小节，引用 §3 的 P0-P2；其中 P0-2（llms.txt）与 P0-4（中文 URL 化）从原 P2/P3 提级。