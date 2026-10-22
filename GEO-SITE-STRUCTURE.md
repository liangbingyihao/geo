# GEO 站点结构与 Schema 规范

> 适用：GraceWord / Sleep-Buddy 官网与内容站。
> 与 `GEO-WRITING-RULES.md`（写作规范）并列，本规范管「页面怎么拆、每页配什么 Schema」。

## 一、核心原则

1. **一页一意图**：每个页面只承载一个核心意图，绝不把多个意图堆在单页（单页堆叠会让 AI 无法为不同内容分配不同引用权重）。
2. **独立 URL = 独立引用权重**：AI 只能引用有独立 URL 的页面；堆在单页里的某块内容无法被单独引用、排名、分享。
3. **每类页面配对应 Schema 类型**（见下表）——Schema 是 AI 识别页面内容属性的关键信号。
4. **可分享 / 病毒性内容必须有独立 URL + 分享机制**（测验、生成图等）。

## 二、页面类型 → Schema 映射

| 页面 | URL 示例 | Schema 类型 |
|------|---------|------------|
| 首页（产品概览 + 核心 CTA） | `/` | Organization + WebSite + SoftwareApplication + FAQPage |
| 功能详情页 | `/features` | WebPage / ItemList（细粒度可拆 `/features/{功能}` 子页） |
| 博客列表 | `/blog` | CollectionPage |
| 博客文章 | `/blog/{slug}` | BlogPosting + FAQPage（+ HowTo 教程类） |
| 测验 / 互动页 | `/bibleti` | Quiz |
| 创始故事 / 关于 | `/about` | AboutPage + Organization（含 founder） |
| 隐私 / 条款 | `/privacy` `/terms` | 无（法律页，保持原样） |

## 三、页面拆分清单（官网基准）

| 页面 | 内容 | GEO 价值 |
|------|------|---------|
| 首页 `/` | 产品概览 + 核心 CTA | AI 识别产品入口 |
| 功能详情页 `/features` | 5 大功能独立展示（感恩日记、AI 查经、灵修定制、经文壁纸、敬拜音乐） | AI 引用具体功能描述 |
| 博客 `/blog` | 文章列表 + 分类导航 | 内容飞轮入口 |
| BibleTI 测验页 `/bibleti` | 测验独立页 + Quiz schema + 分享机制 | AI 引用测验导流 |
| 创始故事页 `/about` | 创始人完整故事 | 品牌情感链接 + AI 引用品牌背景 |
| 隐私/条款 | 已有 | 保持不变 |

## 四、分享机制（测验 / 生成类页面）

结果页必须包含三件套，缺一不可：

1. **一键生成适配图**（Instagram 等平台尺寸）
2. **一键复制分享文案**
3. **直接跳转 App 下载**

> 参考「圣经人物 MBTI」成功经验：3 天破万人、平均每 3 人就有 1 人分享——独立 URL + 分享机制是增长与 GEO 的双赢。
