# 操作與維護說明

本文件說明「畫中尋經 BibleArt」的安裝、開發、靜態建置、環境變數與維護方式。
測試環境的子路徑部署步驟請見 **[DEPLOY.md](DEPLOY.md)**；系統設計見 **[ARCHITECTURE.md](ARCHITECTURE.md)**；目前進度與後續規劃見 **[ROADMAP.md](ROADMAP.md)**。

## 1. 環境需求

- Node.js **18.18 以上**（本專案以 Node 24 驗證）
- npm 9 以上
- 可連線至 npm registry（安裝階段）
- 圖片由 CDN 提供，瀏覽時需能連線至 `cdn.grace-word.com`
- 地圖資料已隨靜態包提供，不需要連線任何外部瓦片服務

```bash
node -v
npm -v
```

## 2. 安裝

```bash
npm install
```

## 3. 開發模式

```bash
npm run dev
```

開啟 `http://localhost:3000`：

- 中文首頁：`/`
- 中文每日挑戰：`/play/`
- 中文素材版權：`/credits/`
- 英文首頁：`/en/`
- 英文每日挑戰：`/en/play/`
- 英文素材版權：`/en/credits/`

開發模式不讀取 `.env.production`，因此執行在網域根路徑，且圖片可使用本地 `public/images/`。

換埠號：

```bash
npm run dev -- -p 3001
```

## 4. 靜態建置與預覽

```bash
npm run build   # 讀取 .env.production，輸出 out/
npm start       # 以 serve 預覽 out/，http://localhost:3000
```

建置時會自動載入 `.env.production`，產生：

- `out/index.html`、`out/play/index.html`、`out/credits/index.html`
- `out/en/index.html`、`out/en/play/index.html`、`out/en/credits/index.html`
- `out/404.html`、`out/sitemap.xml`
- `out/_next/...`、`out/images/...`、`out/geo/...`

`output: "export"` 表示**沒有 Node 執行階段**；`out/` 可放到任何靜態伺服器或子路徑。

建置後可執行雙語與 SEO 檢查：

```bash
npm run check:export
```

換埠號預覽：

```bash
npx serve out -l 3001
```

## 5. 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 開發伺服器（熱更新，根路徑） |
| `npm run build` | 靜態匯出到 `out/` |
| `npm start` | 以 `serve` 預覽 `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 型別檢查 |
| `npm test` | Vitest（目前 200 項：計分、抽題、題庫、雙語、SEO、地圖資料） |
| `npm run check:export` | 建置後檢查雙語輸出、canonical/hreflang、sitemap |

## 6. 環境變數

`.env.production`（已提交，僅含公開設定）：

```env
NEXT_PUBLIC_BASE_PATH=/bibleart
NEXT_PUBLIC_SITE_URL=https://test.grace-word.com
NEXT_PUBLIC_IMAGE_BASE_URL=https://cdn.grace-word.com/game/images
NEXT_PUBLIC_GA_ID=G-7CEHJHLWK1
```

| 變數 | 作用 | 留空時 |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | 部署子路徑，如 `/bibleart` | 部署在網域根路徑 |
| `NEXT_PUBLIC_SITE_URL` | canonical、hreflang、sitemap 的公開來源 | 預設 `https://test.grace-word.com` |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | 圖片 CDN 基礎路徑 | 使用本地 `public/images` |
| `NEXT_PUBLIC_GA_ID` | GA4 評估 ID | 關閉 GA |

注意：

- `NEXT_PUBLIC_*` 於**建置時內聯**，修改後必須重新 `npm run build`。
- 部署路徑改變時，`NEXT_PUBLIC_BASE_PATH` 必須同步修改並重新建置，否則資源會 404。
- 生產建置務必把 `NEXT_PUBLIC_SITE_URL` 改成正式域名，否則 canonical/hreflang 會指向測試站。

### 雙語與 SEO

- 中文在根路徑，英文在 `/en/`；兩者為獨立根布局，`<html lang>` 分別為 `zh-Hant` / `en`。
- 每頁輸出 canonical、`hreflang`（`zh-Hant`、`en`、`x-default`）、OG/Twitter 與 JSON-LD。
- `out/sitemap.xml` 包含兩種語言與 `alternates.languages`。
- 測試站由 Nginx 加上 `X-Robots-Tag: noindex`；SEO 以生產環境為準。
- 子路徑的 `robots.txt` 不被搜尋引擎採用；請在主域 robots.txt 加入 `Sitemap: https://<domain>/bibleart/sitemap.xml`。
- 每日題組中英共用，固定以 **UTC** 換題（北京 08:00 / 美東 19:00–20:00）。

## 7. 遊戲玩法

1. 進入 `/play/`：週一至六為「今日故事」五幕，週日為混合五題。
2. 故事模式會顯示故事標題、導語與「第 n 幕 / 共 5 幕」。
3. 畫面先顯示高度放大的名畫局部，從 **A–D 四個選項**猜人物或事件。
4. 第一次猜錯顯示經文提示；之後顯示白話提示，本題分數乘上遞減係數（最低 0.4）。
5. 辨認正確後：先選擇年代；地圖旁只提供所在區域提示（如加利利），不會顯示準確答案地名。
6. 提交後結算頁顯示年代分、地理分，以及完整的聖經地名、當今地點、關鍵經文、藝術小知識與地理小知識。
7. 故事完成後顯示旅程地圖與五幕回顧，並可複製戰績方塊分享。

故事庫：`/stories/`（中文）、`/en/stories/`（英文）。只有今日故事與已完成故事可進入；未完成/未來故事鎖定，不能預習。已完成故事可重玩（練習），練習不增加每日連闖，也不顯示每日分享。

我的紀錄：`/progress/`（中文）、`/en/progress/`（英文）。顯示連闖、最佳分、故事完成度、最近 7 天與徽章；頁面 noindex，不加入 sitemap。

挑戰好友：在「我的紀錄」頁從已完成故事抽 5 題並發起挑戰；先玩一次，結算後「分享我的挑戰成績」會產生帶分數的 `?challenge=` 連結。朋友打開後玩同一組題目，結算會顯示雙方成績與差距；屬練習模式，不影響每日連闖，也不解鎖故事。每日故事或混合題結算頁也有「挑戰好友」，直接分享當天 5 題與你的成績。token 中的分數可被修改，靜態站不做可信驗證。

地名對照學習頁：`/places/`（中文）、`/en/places/`（英文）。不放入主導覽，從頁腳或「素材版權」頁進入；頁面不含原畫與事件答案，並設為 noindex。

測試用：`/play/?story=passion` 可預覽指定故事（`birth`、`early-ministry`、`galilee`、`passion`、`resurrection`、`early-church`）。

連闖紀錄只存在瀏覽器 `localStorage`，清除瀏覽器資料即重置。

## 8. 專案結構

```text
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
  LocaleLink.tsx / LocaleSwitcher.tsx
  pages/              首頁／遊戲／故事庫／進度／地名／版權頁共用元件
  Game.tsx            答題流程、故事模式與計分
  StoryLibrary.tsx    故事庫、篩選與完成/練習狀態
  ProgressDashboard.tsx 連闖、故事進度與徽章
  StoryRecap.tsx      故事旅程地圖與五幕回顧
  TodayStory.tsx      首頁今日故事
  Analytics.tsx       GA4 與路由 page_view
  SafeImage.tsx       CDN 圖片＋本地回退
  ZoomImage.tsx       放大／縮小圖片
  GuessOptions.tsx    四選一按鈕
  YearSlider.tsx      年代時間軸
  MapGuess.tsx        地圖動態載入（停用 SSR）
  MapGuessInner.tsx   Leaflet + GeoJSON 底圖＋故事路線
  MapLabels.tsx       雙語海域／區域標註
  ResultSummary.tsx   單題結果摘要
  ResultNotes.tsx     關鍵經文、藝術知識、地理知識（可收合）
  ResultMeta.tsx      答案與地點資訊（可收合）
  ShareGrid.tsx       戰績方塊與複製
  DailyStatus.tsx     首頁連闖狀態
  StoryCard.tsx       故事庫卡片
data/
  questions.ts        30 道題目事實
  stories.ts          6 個故事、年代／主題／順序／錨點題目
  verse-refs.ts       經文出處
  verses.json         CUV／WEB 經文
  places.ts           地點的區域、當今名稱與地理小知識
  books.ts            書卷中英對照
  i18n/               雙語 UI、題目、故事、藝術知識
lib/
  types.ts            型別定義
  i18n/               locale、路徑、格式化、UI 型別
  seo.ts              metadata、canonical、hreflang
  scoring.ts          Haversine、年代與地理計分
  daily.ts            UTC 日期、每日故事與混合抽題
  storage.ts          localStorage 連闖與故事進度
  story-access.ts     今日／已完成／鎖定判斷
  badges.ts           徽章條件與最近 7 天
  challenge.ts        挑戰連結編碼／解碼
  image.ts            CDN／子路徑／public 資源網址
  image-loader.js     next/image 自訂 loader
  map-labels.ts       雙語地圖標註與縮放規則
public/images/        題目畫作（本地回退）
public/geo/           Natural Earth 地圖資料
scripts/
  build-geo.sh        重新產生地圖資料
  fetch-verses.mjs    更新 CUV／WEB 經文
  check-export.mjs    建置後雙語與 SEO 檢查
test/                 Vitest 測試
docs/
  ARCHITECTURE.md     架構設計與技術取捨
  ROADMAP.md          當前進度與後續規劃
  USAGE.md            本文件
  DEPLOY.md           測試環境部署
```

## 9. 維護題庫

在 `data/questions.ts` 新增一筆 `Question`，確認：

- `options` 為四個不重複選項，且必須包含 `answer`（字串需完全一致）。
- `hints` 至少三條，對應最多三次猜錯。
- `event.year` 介於 `-10` 到 `100`，西元前用負數；`tolerance` 為得分歸零的年距。
- `event.lat` / `event.lng` 為事件地點座標。
- `image.src` 指向 `public/images/` 下的檔案，並填寫 `artist`、`license`、`sourceUrl`。
- 英文題目文本加在 `data/i18n/en/questions.ts`（答案、選項、提示、摘要、地名、畫作標題）。
- 藝術小知識加在 `data/i18n/art-notes.ts`（中英各一）。
- 經文出處加在 `data/verse-refs.ts`，執行 `node scripts/fetch-verses.mjs` 更新 `data/verses.json`。
- 地點的區域、當今名稱與地理小知識加在 `data/places.ts`（中英各一）。
- 故事新增或順序調整，更新 `data/stories.ts`（每故事 5 題、era、themes、order、anchorQuestionId）與 `data/i18n/stories.ts`。

完成後執行：

```bash
node scripts/fetch-verses.mjs   # 只有改到經文出處時需要
npm test
```

測試會檢查選項、提示、年份、座標、圖片檔、故事完整性、經文與藝術知識。

## 10. 圖片與 CDN

- 本地圖片放在 `public/images/`，檔名需與 `questions.ts` 的 `image.src` 一致。
- 生產環境由 `NEXT_PUBLIC_IMAGE_BASE_URL` 指向的 CDN 提供。
- `lib/image-loader.js` 會為遠端圖片附加：

  ```text
  ?x-oss-process=image/resize,w_<width>/quality,q_75/format,webp
  ```

  由阿里雲 OSS 即時縮放並輸出 WebP，伺服器不需要處理圖片。

- 替換圖片後，若 CDN 檔名不變，可能受快取影響（目前 `max-age=14400`）；可在 OSS/CDN 重新整理快取，或改用帶版本的檔名。
- `SafeImage` 會在 CDN 圖片載入失敗時回退到 `public/images/` 的本地副本；新圖仍需上傳 CDN 以獲得最佳效能。
- 目前新增的 5 張圖（`visitation`、`flight_egypt`、`calling_matthew`、`peter_commission`、`peter_prison`）已上傳 CDN；日後更換或新增圖片時，仍需上傳並確認公開 URL 回傳 200。
- 部署時採「方案 A」：圖片走 CDN，`_next/static` 留在 Nginx 並由 Cloudflare 快取，不啟用 `assetPrefix`。完整策略與驗收指令見 **[DEPLOY.md](DEPLOY.md#4-靜態資源託管策略方案-a)**。

### 地圖資料（Natural Earth）

- 地圖由 `public/geo/` 內的 GeoJSON 在瀏覽器端繪製，**不載入 OpenStreetMap 或任何外部瓦片**，國內訪問穩定。
- 資料來源：Natural Earth 1:50m（公有領域）。
- 重新產生地圖資料：

  ```bash
  ./scripts/build-geo.sh
  ```

- 中文標註定義在 `lib/map-labels.ts`；猜地點時會隱藏與本題 `event.placeName` 同名的標註，避免劇透。
- 提交答案後，地圖會在正確位置顯示該事件的中文地名。

授權原則：

- 優先使用公共領域（Public Domain）或 CC0。
- CC BY / CC BY-SA 需標明作者與授權並保留原始連結。
- 本專案為免費、非商業用途；不得加廣告、收費或另行打包散布圖片。

## 11. 測試

```bash
npm test
```

涵蓋：

- `test/scoring.test.ts`：Haversine、年代分、地理分、辨識係數。
- `test/daily.test.ts`：UTC 日期、種子亂數、每日抽題確定性。
- `test/questions.test.ts`：題庫欄位、選項、提示、座標與圖片檔完整性。
- `test/stories.test.ts`：6 個故事、每故事 5 題、年代/主題/錨點、經文、藝術知識、每日故事選擇。
- `test/story-access.test.ts`：今日故事、已完成練習、未完成鎖定。
- `test/badges.test.ts`：徽章條件、故事完成數、最近 7 天。
- `test/challenge.test.ts`：挑戰連結編碼、解碼、去重與非法 token。
- `test/storage.test.ts`：故事最佳分與完成度合併，不影響每日數據。
- `test/places.test.ts`：30 個地點的區域、當今名稱與地理小知識。
- `test/i18n.test.ts`：英文題目完整性、語言路徑、SEO metadata。
- `test/map-labels.test.ts`：雙語地圖標註、縮放與防劇透。
- `test/geo.test.ts`：Natural Earth 資料檔存在與格式。

## 12. 部署

本專案為**純靜態**，部署到子路徑的完整步驟與 Nginx 設定請見 **[DEPLOY.md](DEPLOY.md)**。

摘要：

```bash
npm run build
npm run check:export
rsync -avz --delete out/ root@47.83.137.24:/opt/common/nginx/html/graceword/bibleart/
```

## 13. 疑難排解

**部署後 CSS/JS 404 或連結跑到網域根路徑**

`NEXT_PUBLIC_BASE_PATH` 與實際部署路徑不一致。確認 `.env.production` 後重新 `npm run build`。

**直接開 `/play/` 或 `/en/play/` 404**

需要子路徑伺服器支援目錄索引（`index.html`）與 `trailingSlash`。Nginx 使用 `try_files $uri $uri/ =404;`，或參考 `DEPLOY.md`。也請確認部署時有上傳 `out/play/` 與 `out/en/play/`。

**canonical / hreflang 指向錯誤網域**

檢查建置時的 `NEXT_PUBLIC_SITE_URL`；測試與生產必須分開設定，修改後重新 `npm run build`。

**語言切換後整頁刷新**

這是 Next.js 多根布局的預期行為，不是錯誤。

**圖片破圖**

先直接開 CDN URL 檢查是否 200；確認 `NEXT_PUBLIC_IMAGE_BASE_URL` 結尾沒有多餘斜線、CDN 允許公開讀取且未開防盜鏈。

**地圖空白**

地圖資料是隨靜態包提供的 GeoJSON，不依賴外部瓦片。請確認：

```bash
curl -I https://test.grace-word.com/bibleart/geo/land.json
```

應返回 200。若部署時漏傳 `out/geo/`，重新上傳即可；地圖組件會顯示「地圖資料載入失敗」。

**GA 沒有資料**

確認 `NEXT_PUBLIC_GA_ID` 在建置時已設定；廣告阻擋外掛也會阻擋 GA。

**建置或啟動出現 `Bus error (core dumped)` / `SIGBUS`**

通常是 `@next/swc` 原生檔下載不完整。重新安裝：

```bash
rm -rf node_modules/@next/swc-linux-x64-gnu
npm install @next/swc-linux-x64-gnu@15.5.29 --no-save --force
node -e "require('@next/swc-linux-x64-gnu'); console.log('ok')"
```

**樣式或建置結果異常**

清除快取後重建：

```bash
rm -rf .next out
npm run build
```

## 14. 授權與致謝

- 畫作來源：Wikimedia Commons（公共領域、CC0，少數 CC BY-SA）。
- 地圖資料：Natural Earth（公有領域），以 Leaflet 於瀏覽器端繪製。
- 經文出處：中文使用和合本（CUV），英文使用 World English Bible（WEB）；經文文本透過 getbible.net API 取得，皆為公有領域。年代與地點為學術通行約略值。

完整作者與授權清單請見遊戲內 `/credits` 頁面。
