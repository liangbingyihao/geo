# 畫中尋經 BibleArt · 每日聖經名畫挑戰

看一幅聖經題材的名畫，猜出畫中的人物或事件，再判斷它發生的年代與地點。靈感來自 Timeguessr / GeoGuessr 的雙軸計分，題材聚焦新約。

線上測試：

- 中文：`https://test.grace-word.com/bibleart/`
- English: `https://test.grace-word.com/bibleart/en/`

## 目前狀態

- 版本 `0.1.0`，測試站已部署；核心每日流程、雙語、故事庫、進度徽章、地圖與朋友挑戰均可用。
- 內容為新約 **6 個故事／30 題**；目前有 **200 項 Vitest 測試**與建置後雙語／SEO 檢查。
- 下一步是測試版穩定化、正式網域上線準備與內容擴充。完整進度、風險與驗收標準見 **[docs/ROADMAP.md](docs/ROADMAP.md)**。

## 文件導覽

| 文件 | 內容 |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 系統架構、資料流、每日抽題、狀態機、儲存、挑戰、地圖與設計取捨 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 當前進度、已完成里程碑、下一步規劃、風險與上線檢查清單 |
| [docs/USAGE.md](docs/USAGE.md) | 安裝、開發、建置、題庫維護、測試與疑難排解 |
| [docs/DEPLOY.md](docs/DEPLOY.md) | 測試站子路徑部署、Nginx、CDN、Cloudflare 與驗收指令 |

## 功能

- **中英雙語**：`zh-Hant`（根路徑）與 `en`（`/en/`），共用同一每日題組；完整的 `<html lang>`、canonical、hreflang 與 sitemap。
- **每日故事**：週一至六每天一個故事（5 幕），週日混合 5 題；中英共享同一故事。
- **故事庫**：`/stories/` 依年代與主題瀏覽；完成後可重玩（練習），未完成故事鎖定，不能預習。
- **故事進度**：localStorage 記錄每個故事的完成狀態與最佳分；練習不影響每日連闖。
- **我的紀錄**：`/progress/` 顯示連闖、最佳分、故事完成度、最近 7 天與徽章；noindex，不進 sitemap。
- **挑戰好友**：從已完成故事抽 5 題，先玩一次，再分享帶分數的連結；朋友玩同一組後可比較雙方成績；每日故事結算頁也可直接分享當天 5 題。
- **細節放大鏡**：圖片一開始放大 3×，每猜錯一次縮小一級並解鎖一條提示。
- **經文提示**：第一次猜錯顯示和合本／WEB 經文，結算頁展示關鍵經文。
- **藝術小知識**：結算頁說明畫家、構圖與象徵。
- **四選一辨識**：從四個聖經人物／事件中選出正確答案。
- **雙軸計分**：年代（時間軸）與地理（地圖標記）各 5,000 分，單題滿分 10,000。
- **地點提示**：猜地點階段只顯示所在區域（如加利利）；提交後才在結算頁顯示聖經地名、當今地點與地理小知識。
- **地理小知識**：結算頁說明歷史地名、當今地點與傳統/爭議。
- **地名對照（學習）**：`/places/` 僅列地名、區域、現代名、經文與地理說明，不含原畫與事件答案；不放入主導覽，從頁腳或版權頁進入。
- **故事回顧**：完成故事後顯示旅程地圖與五幕縮略圖。
- **連闖紀錄**：以 localStorage 記錄連續天數與最佳單日得分，免登入。
- **響應式介面**：手機上下排列、桌面左右分欄。
- **自帶地圖**：以 Natural Earth GeoJSON 繪製聖經世界底圖，不依賴外部瓦片，國內訪問穩定。
- **純靜態**：`next build` 直接輸出 `out/`，可部署到任意靜態主機或子路徑，運行時不需要 Node.js。

## 技術棧

- Next.js 15（App Router，`output: "export"`）+ React 19 + TypeScript
- Tailwind CSS 3
- Leaflet / react-leaflet + 自帶 Natural Earth GeoJSON 底圖（不載入外部瓦片，國內可穩定使用）
- 圖片：CDN（阿里雲 OSS `x-oss-process` 即時縮放 + WebP）
- GA4（`NEXT_PUBLIC_GA_ID`，事件帶 `locale`）
- 自製輕量 i18n：雙根布局、路由分組、伺服器端選語言
- SEO：canonical、hreflang、雙語 sitemap、OG/Twitter、JSON-LD
- Vitest（計分、抽題、雙語資料、SEO metadata、地圖資料測試）

## 開始使用

> 完整操作、建置與子路徑部署請見 **[docs/USAGE.md](docs/USAGE.md)**；
> 測試環境部署步驟見 **[docs/DEPLOY.md](docs/DEPLOY.md)**。

```bash
npm install
npm run dev      # http://localhost:3000（開發模式在網域根路徑）
```

其他指令：

```bash
npm run build      # 靜態匯出到 out/（讀取 .env.production）
npm start          # 以 serve 預覽 out/，http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # TypeScript 型別檢查
npm test           # Vitest
npm run check:export  # 建置後檢查雙語輸出、canonical/hreflang、sitemap
```

## 每日時區

中英文共用同一個每日題組，固定使用 **UTC** 換題：

- 北京時間 08:00
- 美東 19:00–20:00（依夏令時）

所有連闖與每日日期都以 UTC 計算。

## 環境變數

`.env.production` 已包含可公開的建置設定：

```env
NEXT_PUBLIC_BASE_PATH=/bibleart
NEXT_PUBLIC_SITE_URL=https://test.grace-word.com
NEXT_PUBLIC_IMAGE_BASE_URL=https://cdn.grace-word.com/game/images
NEXT_PUBLIC_GA_ID=G-7CEHJHLWK1
```

- `NEXT_PUBLIC_BASE_PATH`：部署子路徑；留空則部署在網域根路徑。
- `NEXT_PUBLIC_SITE_URL`：canonical、hreflang、sitemap 使用的公開來源；生產建置時改成正式域名。
- `NEXT_PUBLIC_IMAGE_BASE_URL`：CDN 圖片基礎路徑；未設定時使用本地 `public/images`。
- `NEXT_PUBLIC_GA_ID`：GA4 評估 ID；留空即關閉追蹤。

> `NEXT_PUBLIC_*` 會在**建置時**內聯，變更後必須重新 `npm run build`。

## 目錄結構

```
app/
  (zh)/layout.tsx     <html lang="zh-Hant">
  (zh)/page.tsx       中文首頁
  (zh)/play/page.tsx
  (zh)/stories/page.tsx
  (zh)/progress/page.tsx
  (zh)/places/page.tsx
  (zh)/credits/page.tsx
  (en)/layout.tsx     <html lang="en">
  (en)/en/page.tsx    英文首頁
  (en)/en/play/page.tsx
  (en)/en/stories/page.tsx
  (en)/en/progress/page.tsx
  (en)/en/places/page.tsx
  (en)/en/credits/page.tsx
  global-not-found.tsx
  sitemap.ts
components/
  SiteShell.tsx       導覽、頁腳、語言切換、GA
  LocaleLink.tsx      語言感知連結
  LocaleSwitcher.tsx  中英切換
  pages/              首頁／遊戲／故事庫／進度／地名／版權頁的共用伺服器元件
  Game.tsx            答題流程、故事模式與狀態機
  StoryLibrary.tsx    故事庫、篩選與完成/練習狀態
  ProgressDashboard.tsx 連闖、故事進度與徽章
  StoryRecap.tsx      故事旅程地圖與五幕回顧
  TodayStory.tsx      首頁今日故事
  Analytics.tsx       GA4（事件帶 locale）
  SafeImage.tsx       CDN 圖片＋本地回退
  ZoomImage.tsx       放大／縮小圖片
  GuessOptions.tsx    四選一
  YearSlider.tsx      年代時間軸
  MapGuess.tsx        地圖（動態載入，停用 SSR）
  MapGuessInner.tsx   Leaflet + GeoJSON 底圖＋故事路線
  MapLabels.tsx       雙語海域／區域標註
  ResultSummary.tsx   單題結果摘要
  ResultNotes.tsx     關鍵經文、藝術知識與地理知識（可收合）
  ResultMeta.tsx      答案與地點資訊（可收合）
  ShareGrid.tsx       戰績方塊與複製
  DailyStatus.tsx     首頁連闖狀態
  StoryCard.tsx       故事庫卡片
data/
  questions.ts        30 道題目事實（圖片、座標、年份、經文）
  stories.ts          6 個故事、年代／主題／順序／錨點題目
  verse-refs.ts       每題的提示經文與關鍵經文出處
  verses.json         CUV／WEB 經文（由腳本產生）
  places.ts           地點的區域、當今名稱與地理小知識
  books.ts            書卷中英對照
  i18n/
    zh-Hant.ts        中文 UI 文案
    en.ts             英文 UI 文案
    en/questions.ts   英文題目文本
    art-notes.ts      30 題的雙語藝術小知識
    stories.ts        6 個故事的雙語標題／導語／收尾
    story-taxonomy.ts 年代與主題標籤
    badges.ts         徽章文案
    index.ts          getQuestions / getStories / getUiText
lib/
  types.ts            型別
  i18n/               locale、路徑、格式化、UI 型別
  seo.ts              metadata / canonical / hreflang / OG
  scoring.ts          Haversine、年代與地理計分
  daily.ts            UTC 日期種子與每日抽題
  storage.ts          localStorage 連闖與故事進度
  story-access.ts     今日／已完成／鎖定判斷
  badges.ts           徽章條件與最近 7 天
  challenge.ts        挑戰連結的編碼／解碼、分數與驗證
  image.ts            CDN／子路徑／public 資源網址
  image-loader.js     next/image 自訂 loader（OSS 縮放＋WebP）
  map-labels.ts       雙語地圖標註基礎與縮放規則
public/images/        題目畫作（本地回退）
public/geo/           Natural Earth 地圖資料（land / lakes / rivers）
public/og.jpg         社群分享圖（1200×630）
public/icon.svg       網站圖示
scripts/
  build-geo.sh        重新產生地圖資料
  fetch-verses.mjs    從 getbible.net 抓取 CUV／WEB 經文
  check-export.mjs    建置後雙語與 SEO 檢查
test/                 Vitest 測試
docs/
  ARCHITECTURE.md     架構設計與技術取捨
  ROADMAP.md          當前進度與後續規劃
  USAGE.md            操作與維護說明
  DEPLOY.md           測試環境部署指令
```

## 計分規則

1. 辨識：答對進入下一階段；答錯次數 `n` 會使本題分數乘以 `max(0.4, 1 - 0.2n)`。
2. 年代：`|猜測 - 正確|` 在容忍區間的 20% 內滿分，之後線性遞減，至容忍上限為 0。
3. 地理：以 Haversine 距離換算，0 公里 5,000 分，1,500 公里以上 0 分。
4. 單題 = 年代分 + 地理分（皆已乘辨識係數），每日五題滿分 50,000。

## 新增題目

在 `data/questions.ts` 加入一筆 `Question`：

- `answer` 必須與 `options` 中的其中一項完全相同。
- `event.year` 為代表性年份（西元前用負數），`tolerance` 為得分歸零的年距。
- `event.lat/lng` 為事件地點座標；地名顯示於結算頁。
- `image.src` 指向 `public/images/` 下的檔案，並填寫 `artist`、`license`、`sourceUrl` 供版權頁使用。
- 英文文本加在 `data/i18n/en/questions.ts`，需提供 `answer`、`options`、`hints`、`summary`、`placeName`、`imageTitle`；`options` 必須包含 `answer`。
- 書卷英文名加在 `data/books.ts`。
- 藝術小知識加在 `data/i18n/art-notes.ts`（中英各一）。
- 經文出處加在 `data/verse-refs.ts`，再執行 `node scripts/fetch-verses.mjs` 更新 `data/verses.json`。
- 地點的區域、當今名稱與地理小知識加在 `data/places.ts`（中英各一）。
- 若新增故事或調整順序，更新 `data/stories.ts`（每故事 5 題）與 `data/i18n/stories.ts`。

新增後執行 `npm test`，故事、經文、雙語與計分測試會一起檢查。

## 素材與版權

- 畫作來自 Wikimedia Commons，主要為公共領域（Public Domain）或 CC0；少數為 CC BY-SA，已在 `app/credits` 與題目結算頁標明作者與授權。
- 本專案定位為免費、非商業的教育與福音用途：不設廣告、內購或收費。
- 轉載或改作時請保留作者、授權與原始連結；請勿將圖片另行打包散布。
- 地圖資料來自 Natural Earth（公有領域），以 Leaflet 在瀏覽器端繪製，不載入外部瓦片服務。
- 中文經文出處以和合本（CUV）標示，英文使用 World English Bible（WEB）；年代與地點為學術通行的約略值。
- 社群分享圖 `public/og.jpg` 取自公版畫作裁切。

## 後續方向

完整優先級、驗收標準與風險見 **[docs/ROADMAP.md](docs/ROADMAP.md)**。

- **0.1.x**：測試版穩定化、正式站上線準備、最小 E2E。
- **0.2**：內容擴充至 12 個故事／60 題以上、硬核模式、圖鑑收藏、季節活動。
- **0.3**：經文猜圖（反轉）、PWA 離線；多人房間與帳號同步需要後端。
