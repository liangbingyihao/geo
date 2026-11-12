import { describe, expect, it } from "vitest";
import {
  DAILY_COUNT,
  dailyDateKey,
  hashString,
  mulberry32,
  pickDailyQuestions,
  seededShuffle,
} from "../lib/daily";
import { QUESTIONS } from "../data/questions";

describe("dailyDateKey", () => {
  it("formats a UTC date as YYYY-MM-DD", () => {
    expect(dailyDateKey(new Date(Date.UTC(2026, 0, 5)))).toBe("2026-01-05");
    expect(dailyDateKey(new Date(Date.UTC(2026, 10, 9)))).toBe("2026-11-09");
  });

  it("uses the same UTC day for every timezone", () => {
    const lateUtc = new Date("2026-11-09T23:59:00Z");
    const earlyUtc = new Date("2026-11-10T00:01:00Z");
    expect(dailyDateKey(lateUtc)).toBe("2026-11-09");
    expect(dailyDateKey(earlyUtc)).toBe("2026-11-10");
  });
});

describe("hashString", () => {
  it("is deterministic", () => {
    expect(hashString("2026-11-09")).toBe(hashString("2026-11-09"));
  });

  it("changes for different input", () => {
    expect(hashString("2026-11-09")).not.toBe(hashString("2026-11-10"));
  });
});

describe("mulberry32 / seededShuffle", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("keeps the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = seededShuffle(input, 7);
    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort()).toEqual(input);
  });
});

describe("pickDailyQuestions", () => {
  const date = new Date(Date.UTC(2026, 10, 9));

  it("returns a fixed number of unique questions", () => {
    const picked = pickDailyQuestions(QUESTIONS, date);
    expect(picked).toHaveLength(DAILY_COUNT);
    expect(new Set(picked.map((q) => q.id)).size).toBe(DAILY_COUNT);
  });

  it("is deterministic for the same date", () => {
    const first = pickDailyQuestions(QUESTIONS, date).map((q) => q.id);
    const second = pickDailyQuestions(QUESTIONS, date).map((q) => q.id);
    expect(first).toEqual(second);
  });

  it("usually differs across dates", () => {
    const today = pickDailyQuestions(
      QUESTIONS,
      new Date(Date.UTC(2026, 10, 9)),
    ).map((q) => q.id);
    const tomorrow = pickDailyQuestions(
      QUESTIONS,
      new Date(Date.UTC(2026, 10, 10)),
    ).map((q) => q.id);
    expect(today).not.toEqual(tomorrow);
  });
});
