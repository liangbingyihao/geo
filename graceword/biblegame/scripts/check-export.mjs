import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(out, file), "utf8");
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

const requiredFiles = [
  "index.html",
  "play/index.html",
  "stories/index.html",
  "progress/index.html",
  "places/index.html",
  "credits/index.html",
  "en/index.html",
  "en/play/index.html",
  "en/stories/index.html",
  "en/progress/index.html",
  "en/places/index.html",
  "en/credits/index.html",
  "404.html",
  "sitemap.xml",
  "icon.svg",
  "og.jpg",
  "apple-icon.png",
  "geo/land.json",
  "geo/lakes.json",
  "geo/rivers.json",
];

for (const file of requiredFiles) {
  check(fs.existsSync(path.join(out, file)), `missing ${file}`);
}

if (!failures.length) {
  const zhHome = read("index.html");
  const enHome = read("en/index.html");
  const zhPlay = read("play/index.html");
  const enPlay = read("en/play/index.html");
  const zhStories = read("stories/index.html");
  const enStories = read("en/stories/index.html");
  const zhProgress = read("progress/index.html");
  const enProgress = read("en/progress/index.html");
  const zhPlaces = read("places/index.html");
  const enPlaces = read("en/places/index.html");
  const sitemap = read("sitemap.xml");

  check(zhHome.includes('<html lang="zh-Hant"'), "zh home missing lang");
  check(enHome.includes('<html lang="en"'), "en home missing lang");
  check(zhHome.includes("看一幅名畫"), "zh home text missing");
  check(enHome.includes("Look at a masterpiece"), "en home text missing");
  check(zhPlay.includes("每日挑戰"), "zh play text missing");
  check(enPlay.includes("Daily Challenge"), "en play text missing");
  check(zhStories.includes("故事庫"), "zh stories text missing");
  check(enStories.includes("Stories"), "en stories text missing");
  check(zhProgress.includes("我的紀錄"), "zh progress text missing");
  check(enProgress.includes("My Progress"), "en progress text missing");
  check(zhPlaces.includes("地名對照"), "zh places text missing");
  check(enPlaces.includes("Places"), "en places text missing");

  check(
    zhHome.includes('rel="canonical"') &&
      zhHome.includes('hrefLang="en"') &&
      zhHome.includes('hrefLang="x-default"'),
    "zh home canonical/hreflang missing",
  );
  check(
    enPlay.includes('rel="canonical"') &&
      enPlay.includes('hrefLang="zh-Hant"'),
    "en play canonical/hreflang missing",
  );
  check(
    zhHome.includes("application/ld+json"),
    "home JSON-LD missing",
  );
  check(
    zhHome.includes('property="og:image"') &&
      zhHome.includes("og.jpg"),
    "Open Graph image missing",
  );

  check(
    sitemap.includes("/bibleart/") && sitemap.includes("/bibleart/en/"),
    "sitemap missing locales",
  );

  const tilePattern = /tile\.openstreetmap\.org|maps\.wikimedia\.org/;
  const htmlFiles = [
    "index.html",
    "play/index.html",
    "stories/index.html",
    "progress/index.html",
    "places/index.html",
    "credits/index.html",
    "en/index.html",
    "en/play/index.html",
    "en/stories/index.html",
    "en/progress/index.html",
    "en/places/index.html",
    "en/credits/index.html",
  ];
  for (const file of htmlFiles) {
    check(!tilePattern.test(read(file)), `${file} references an external tile service`);
  }
}

if (failures.length) {
  console.error("Export check failed:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("Export check passed:");
console.log(" - zh + en pages, 404, sitemap, icons, OG image");
console.log(" - correct <html lang>, canonical and hreflang");
console.log(" - localized content and no external map tiles");
