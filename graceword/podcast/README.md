# GraceWord 播客（Podcast）

- **播客首页**：`grace-word.com/podcast/`（与 /blog/ 并列；展示所有系列 + 全部节目，可按系列筛选）
- **系列页**：`grace-word.com/podcast/{series}/`（如 `ai-era-jesus` → A.I.時代講耶穌）
- **单集页**：`grace-word.com/podcast/{series}/{ep}/`
- **订阅源（RSS）**：每个系列一份 `grace-word.com/podcast/{series}/feed.xml`（提交 Apple/Spotify 用）
- **音频语言**：粤语（`inLanguage: yue`）
- **网页文字**：zh-TW + zh-CN（hreflang 两向，`<html lang>` 用 zh-Hant/zh-Hans）

## 目录

```
podcast/
├── README.md          # 本文件
├── podcast.json       # 站点元数据 + series 数组（每系列含 episodes）
├── content/           # 每集一目录（按集 slug 命名）
│   └── three-tech-waves-unchanging-heart/transcript.txt  # 逐字稿（繁体，简体由 OpenCC t2s 派生）
├── build/             # 播客构建
│   ├── assets/style.css  # 播客样式（→ CDN cdn.grace-word.com/podcast/style.css）
│   └── build.js          # 生成：首页 + 系列页 + 单集页 + sitemap + 每系列 RSS
└── dist/              # 产物（→ /var/www/html/graceword/podcast/）
```

## podcast.json 结构

```jsonc
{
  "domain": "https://grace-word.com",
  "podcast": {           // 播客首页（栏目）元数据
    "titleTw": "...", "titleCn": "...",
    "descTw": "...", "descCn": "...",
    "cover": "https://cdn.grace-word.com/podcast/....jpg"
  },
  "series": [            // 系列数组（可多个）
    {
      "slug": "ai-era-jesus",
      "nameTw": "...", "nameCn": "...",
      "descTw": "...", "descCn": "...",
      "language": "yue",
      "cover": "...",
      "episodes": [
        {
          "slug": "three-tech-waves-unchanging-heart",   // 内容目录 content/{slug}/ 与 URL 段
          "episodeNumber": 1,
          "titleTw": "...", "titleCn": "...",
          "hosts": ["Sandy Lee", "Jacky Li"],
          "datePublished": "2026-10-03",
          "duration": "PT32M38S",
          "durationLabelTw": "32 分鐘", "durationLabelCn": "32 分钟",
          "audio": "...", "audioSize": 15668412, "cover": "...",
          "introTw": "...", "introCn": "...",
          "keyPointsTw": [], "keyPointsCn": [],
          "outlineTw": [{"title":"...","time":"..."}], "outlineCn": []
        }
      ]
    }
  ]
}
```

## 构建与部署

```bash
cd build
npm install            # 依赖 opencc-js
node build.js          # 生成 ../dist/
```

- 页面引用 CDN：`https://cdn.grace-word.com/podcast/style.css?v=<md5>`（`?v` 由构建按 `build/assets/style.css` 内容自动生成 8 位 md5，改文件即换新版本，无需手改；构建产物里的 `dist/podcast/style.css` 上传 CDN 即可）
- 部署：`rsync -avz dist/podcast/ user@server:/var/www/html/graceword/podcast/`
- nginx 需加 `location /podcast/`（与 /blog/ 并列）；robots.txt 追加 `Sitemap: https://grace-word.com/podcast/sitemap.xml`
- 页面结构：
  - 首页 = 栏目 hero + 系列卡片 + 系列筛选 tab + 全节目卡片；Schema = `CollectionPage`
  - 系列页 = 系列 hero + 订阅 + 该系列节目列表；Schema = `PodcastSeries`
  - 单集页 = 播放器 + 导语 + 大纲 + 本集要点 + 可展开完整逐字稿（`<details>`，合规非隐藏）；Schema = `PodcastEpisode`（含 `AudioObject`）
  - 三类页面底部统一：`cta-section`（关注社媒 IG/FB/YouTube + 邮箱）→ `footer` → `sticky-bar`（固定底栏下载 App，`/action/download` 分流），与博客一致
  - 应用名本地化：`恩語播客/恩语播客` 与版权 `© 2026 恩語/恩语`；schema/og:site_name 仍保留 `GraceWord`（SEO 品牌）
  - hreflang zh-TW/zh-CN 两向；音频 `inLanguage: yue`

## 加新系列 / 加新集

1. 提供：音频 + 封面 + 逐字稿/内容文章 + 元数据（系列名/标题/主持人/时长/日期）
2. 按「音频制作规范」压缩音频 → 上传 CDN `cdn.grace-word.com/podcast/sojdai/`
3. 新建系列：在 `podcast.json` 的 `series` 数组加一项（含 slug/名称/描述/cover/language）；加集：在该系列的 `episodes` 加一条（含 intro/要点/大纲，TW/CN 两份）
4. 逐字稿放 `content/{ep-slug}/transcript.txt`（繁体；不同系列每集 slug 需全局唯一，避免内容目录冲突）
5. `node build.js` → 部署 `dist/podcast/`

## 音频制作规范（重要）

目标：**MP3 64 kbps 单声道（mono）**，人声播客足够，33 分钟约 **16MB**（原 128k 立体声 30MB → 减半）。

### 压缩命令（ffmpeg）

```bash
FFMPEG=/path/to/ffmpeg
$FFMPEG -y -i 输入.mp3 -ac 1 -b:a 64k 输出.mp3
```

### 获取 ffmpeg（本机无 apt/sudo 权限时）

```bash
python3 -m pip install imageio-ffmpeg
FFMPEG=$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
```

### 验证

```bash
$FFMPEG -i 输出.mp3   # 看 Duration / Audio: ... mono, 64 kb/s
ls -lh 输出.mp3       # 期望约 16MB
```

### 第 1 集现状

| 文件 | 说明 |
|------|------|
| `sojdai01.mp3` | **15MB**，64k mono，32:38（已压缩，将来上 CDN） |
| `sojdai01_original.mp3` | 30MB，原 128k 立体声备份 |
| `sojdai01.jpg` | 封面图（237KB） |
| `content/three-tech-waves-unchanging-heart/transcript.txt` | 逐字稿（繁体，简体由 OpenCC 派生） |

CDN 路径（规划）：`cdn.grace-word.com/podcast/sojdai/sojdai01.mp3`