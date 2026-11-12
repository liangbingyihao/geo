import type { LocalizedStory } from "@/data/stories";
import type { GameQuestion, Question } from "./types";

export const DAILY_COUNT = 5;

export type DailySession =
  | { type: "story"; story: LocalizedStory; questions: GameQuestion[] }
  | { type: "mixed"; questions: GameQuestion[] };

/**
 * All locales share one daily puzzle. Use UTC so everyone sees the same
 * "day" at the same moment.
 */
export function dailyDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** @deprecated use dailyDateKey */
export const dateKey = dailyDateKey;

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickDailyQuestions<T extends Question>(
  all: T[],
  date: Date = new Date(),
  count: number = DAILY_COUNT,
): T[] {
  const seed = hashString(dailyDateKey(date));
  const shuffled = seededShuffle(all, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Monday–Saturday use a story; Sunday is a mixed challenge.
 * The story order is shuffled once per week so every story appears once.
 */
export function pickDailyStory(
  date: Date = new Date(),
  stories: LocalizedStory[],
): LocalizedStory | null {
  if (stories.length === 0) return null;

  const epochDay = Math.floor(
    Date.parse(`${dailyDateKey(date)}T00:00:00Z`) / 86_400_000,
  );
  const weekday = (epochDay + 4) % 7; // 0 = Sunday
  if (weekday === 0) return null;

  const monday = epochDay - ((weekday + 6) % 7);
  const order = seededShuffle(stories, hashString(String(monday)));
  return order[(weekday - 1) % order.length];
}

export function pickDailySession(
  date: Date,
  stories: LocalizedStory[],
  questions: GameQuestion[],
): DailySession {
  const story = pickDailyStory(date, stories);
  if (story) {
    const byId = new Map(questions.map((question) => [question.id, question]));
    const storyQuestions = story.questionIds
      .map((id) => byId.get(id))
      .filter((question): question is GameQuestion => Boolean(question));

    if (storyQuestions.length > 0) {
      return { type: "story", story, questions: storyQuestions };
    }
  }

  return {
    type: "mixed",
    questions: pickDailyQuestions(questions, date),
  };
}
