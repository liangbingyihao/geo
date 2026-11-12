import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "data", "verses.json");
const VERSE_REFS = JSON.parse(
  await fs.readFile(
    path.join(process.cwd(), "data", "verse-refs.json"),
    "utf8",
  ),
);

const BOOK_NUMBERS = {
  Genesis: 1,
  Exodus: 2,
  Matthew: 40,
  Mark: 41,
  Luke: 42,
  John: 43,
  Acts: 44,
  Revelation: 66,
};

const TRANSLATIONS = { "zh-Hant": "cut", en: "web" };
const chapterCache = new Map();

function parseRef(ref) {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) throw new Error(`Unsupported reference: ${ref}`);
  const [, book, chapter, verse] = match;
  const bookNumber = BOOK_NUMBERS[book];
  if (!bookNumber) throw new Error(`Unknown book: ${book}`);
  return { book, bookNumber, chapter: Number(chapter), verse: Number(verse) };
}

async function loadChapter(translation, bookNumber, chapter) {
  const key = `${translation}:${bookNumber}:${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key);

  const url = `https://api.getbible.net/v2/${translation}/${bookNumber}/${chapter}.json`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "biblegame-dev/0.1 (educational)" },
      });
      if (res.ok) {
        const json = await res.json();
        chapterCache.set(key, json);
        return json;
      }
    } catch {
      /* retry */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw new Error(`Failed to fetch ${url}`);
}

function cleanText(text, translation) {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  // The CUT source inserts spaces between Chinese phrases; remove them.
  return translation === "cut" ? normalized.replace(/\s+/g, "") : normalized;
}

async function fetchVerse(ref, translation) {
  const { bookNumber, chapter, verse } = parseRef(ref);
  const data = await loadChapter(translation, bookNumber, chapter);
  const found = data.verses.find((item) => item.verse === verse);
  if (!found) throw new Error(`Verse not found: ${ref} (${translation})`);
  return {
    ref: `${data.book_name} ${chapter}:${verse}`,
    text: cleanText(found.text, translation),
  };
}

const out = {};

for (const [id, refs] of Object.entries(VERSE_REFS)) {
  process.stdout.write(`${id}... `);
  const entry = { hint: {}, key: {} };

  for (const [locale, translation] of Object.entries(TRANSLATIONS)) {
    entry.hint[locale] = await fetchVerse(refs.hint, translation);
    entry.key[locale] = await fetchVerse(refs.key, translation);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  out[id] = entry;
  console.log("ok");
}

await fs.writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`\nWrote ${OUT}`);
