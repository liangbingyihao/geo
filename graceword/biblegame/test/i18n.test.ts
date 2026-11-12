import { describe, expect, it } from "vitest";
import { EN_QUESTION_TEXT } from "../data/i18n/en/questions";
import { getQuestions } from "../data/i18n";
import { QUESTIONS } from "../data/questions";
import { swapLocalePath } from "../lib/i18n/paths";
import { buildMetadata } from "../lib/seo";

describe("English question text", () => {
  it("covers every question", () => {
    for (const question of QUESTIONS) {
      expect(EN_QUESTION_TEXT[question.id]).toBeDefined();
    }
  });

  it("has four unique options including the answer", () => {
    for (const [id, text] of Object.entries(EN_QUESTION_TEXT)) {
      expect(text.options, id).toHaveLength(4);
      expect(new Set(text.options).size, id).toBe(4);
      expect(text.options, id).toContain(text.answer);
    }
  });

  it("has non-empty hints, summary, place and image title", () => {
    for (const [id, text] of Object.entries(EN_QUESTION_TEXT)) {
      expect(text.hints.length, id).toBeGreaterThanOrEqual(3);
      expect(text.summary.length, id).toBeGreaterThan(0);
      expect(text.placeName.length, id).toBeGreaterThan(0);
      expect(text.imageTitle.length, id).toBeGreaterThan(0);
    }
  });

  it("merges into localized questions with translated books", () => {
    const english = getQuestions("en");
    expect(english).toHaveLength(QUESTIONS.length);
    const luke = english.find((question) => question.id === "annunciation");
    expect(luke?.scripture.book).toBe("Luke");
    expect(luke?.event.placeName).toBe("Nazareth");
    expect(luke?.options).toContain(luke?.answer);
  });

  it("keeps the Chinese question text", () => {
    const chinese = getQuestions("zh-Hant");
    expect(chinese).toHaveLength(QUESTIONS.length);
    expect(chinese.map((question) => question.id)).toEqual(
      QUESTIONS.map((question) => question.id),
    );
    expect(chinese[0].answer).toBe(QUESTIONS[0].answer);
    expect(chinese[0].artNote.length).toBeGreaterThan(0);
    expect(chinese[0].verseHints).toHaveLength(1);
    expect(chinese[0].keyVerse.text.length).toBeGreaterThan(0);
  });
});

describe("locale paths", () => {
  it("builds localized paths", () => {
    expect(swapLocalePath("/", "en")).toBe("/en/");
    expect(swapLocalePath("/", "zh-Hant")).toBe("/");
    expect(swapLocalePath("/play/", "en")).toBe("/en/play/");
    expect(swapLocalePath("/en/play/", "en")).toBe("/en/play/");
    expect(swapLocalePath("/en/play/", "zh-Hant")).toBe("/play/");
    expect(swapLocalePath("/credits/", "en")).toBe("/en/credits/");
  });

  it("keeps the current page when switching back", () => {
    expect(swapLocalePath("/en/credits/", "zh-Hant")).toBe("/credits/");
    expect(swapLocalePath("/en/", "zh-Hant")).toBe("/");
  });
});

describe("SEO metadata", () => {
  it("emits canonical and hreflang for both locales", () => {
    const zh = buildMetadata({
      locale: "zh-Hant",
      path: "/play/",
      title: "每日挑戰",
      description: "描述",
      siteName: "畫中尋經",
    });
    expect(zh.alternates?.canonical).toBe("/play/");
    expect(zh.alternates?.languages).toMatchObject({
      "zh-Hant": "/play/",
      en: "/en/play/",
      "x-default": "/play/",
    });

    const en = buildMetadata({
      locale: "en",
      path: "/play/",
      title: "Daily Challenge",
      description: "Description",
      siteName: "BibleArt",
    });
    expect(en.alternates?.canonical).toBe("/en/play/");
    expect(en.openGraph?.locale).toBe("en_US");
  });
});
