import { describe, expect, it } from "vitest";
import { getQuestions, getStories } from "../data/i18n";
import { ART_NOTES } from "../data/i18n/art-notes";
import { STORY_TEXT } from "../data/i18n/stories";
import { QUESTIONS } from "../data/questions";
import { QUESTION_STORY, STORIES } from "../data/stories";
import { VERSE_REFS } from "../data/verse-refs";
import verses from "../data/verses.json";
import { pickDailySession, pickDailyStory } from "../lib/daily";

const VERSE_DATA = verses as unknown as Record<
  string,
  {
    hint: Record<string, { ref: string; text: string }>;
    key: Record<string, { ref: string; text: string }>;
  }
>;

const ids = new Set(QUESTIONS.map((question) => question.id));

describe("story definitions", () => {
  it("has six stories with five questions each", () => {
    expect(STORIES).toHaveLength(6);
    for (const story of STORIES) {
      expect(story.questionIds, story.id).toHaveLength(5);
      expect(new Set(story.questionIds).size, story.id).toBe(5);
      for (const id of story.questionIds) {
        expect(ids.has(id), `${story.id} -> ${id}`).toBe(true);
      }
    }
  });

  it("has era, theme, order and anchor metadata", () => {
    const order = new Set<number>();
    for (const story of STORIES) {
      expect(["nt", "early-church", "ot", "church-history"]).toContain(
        story.era,
      );
      expect(story.themes.length).toBeGreaterThan(0);
      expect(order.has(story.order)).toBe(false);
      order.add(story.order);
      expect(story.questionIds).toContain(story.anchorQuestionId);
    }
  });

  it("assigns every question to exactly one story", () => {
    const seen = new Set<string>();
    for (const story of STORIES) {
      for (const id of story.questionIds) {
        expect(seen.has(id), `duplicate ${id}`).toBe(false);
        seen.add(id);
      }
    }
    expect(seen.size).toBe(QUESTIONS.length);
    expect(Object.keys(QUESTION_STORY)).toHaveLength(QUESTIONS.length);
  });

  it("has localized titles and intros for both languages", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      for (const story of STORIES) {
        const text = STORY_TEXT[locale][story.id];
        expect(text.title.length, `${locale} ${story.id}`).toBeGreaterThan(0);
        expect(text.intro.length, `${locale} ${story.id}`).toBeGreaterThan(0);
        expect(text.outro.length, `${locale} ${story.id}`).toBeGreaterThan(0);
      }
      expect(getStories(locale)).toHaveLength(6);
    }
  });
});

describe("verse and art data", () => {
  it("has a hint and key verse for every question in both languages", () => {
    for (const question of QUESTIONS) {
      expect(VERSE_REFS[question.id], question.id).toBeDefined();
      const entry = VERSE_DATA[question.id];
      expect(entry, question.id).toBeDefined();
      for (const locale of ["zh-Hant", "en"] as const) {
        expect(entry.hint[locale].ref.length, question.id).toBeGreaterThan(0);
        expect(entry.hint[locale].text.length, question.id).toBeGreaterThan(0);
        expect(entry.key[locale].ref.length, question.id).toBeGreaterThan(0);
        expect(entry.key[locale].text.length, question.id).toBeGreaterThan(0);
      }
    }
  });

  it("attaches art notes and verses to localized questions", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      for (const question of getQuestions(locale)) {
        expect(question.artNote.length, `${locale} ${question.id}`).toBeGreaterThan(0);
        expect(question.verseHints, question.id).toHaveLength(1);
        expect(question.keyVerse.text.length, question.id).toBeGreaterThan(0);
        expect(question.storyId, question.id).toBe(QUESTION_STORY[question.id]);
      }
    }
  });

  it("has art notes for every question in both languages", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      for (const question of QUESTIONS) {
        expect(ART_NOTES[locale][question.id], `${locale} ${question.id}`).toBeTruthy();
      }
    }
  });
});

describe("daily story selection", () => {
  const base = Date.UTC(2026, 10, 9); // 2026-11-09
  const days = Array.from({ length: 7 }, (_, i) => new Date(base + i * 86_400_000));

  it("returns six stories and one mixed day each week", () => {
    const stories = getStories("zh-Hant");
    const picks = days.map((date) => pickDailyStory(date, stories));
    const storyIds = picks.filter((story) => story).map((story) => story!.id);
    expect(storyIds).toHaveLength(6);
    expect(new Set(storyIds).size).toBe(6);
    expect(picks.filter((story) => story === null)).toHaveLength(1);
  });

  it("is deterministic and identical across locales", () => {
    const zh = getStories("zh-Hant");
    const en = getStories("en");
    for (const date of days) {
      const first = pickDailyStory(date, zh);
      const second = pickDailyStory(date, zh);
      const english = pickDailyStory(date, en);
      expect(first?.id ?? null).toBe(second?.id ?? null);
      expect(first?.id ?? null).toBe(english?.id ?? null);
    }
  });

  it("builds a five-question session for story and mixed days", () => {
    const questions = getQuestions("zh-Hant");
    const stories = getStories("zh-Hant");
    let sawStory = false;
    let sawMixed = false;

    for (const date of days) {
      const session = pickDailySession(date, stories, questions);
      expect(session.questions).toHaveLength(5);
      if (session.type === "story") {
        sawStory = true;
        expect(session.story.questionIds).toEqual(
          session.questions.map((question) => question.id),
        );
      } else {
        sawMixed = true;
      }
    }

    expect(sawStory).toBe(true);
    expect(sawMixed).toBe(true);
  });
});
