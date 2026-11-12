import { describe, expect, it } from "vitest";
import { mergeStoryProgress, type Stats } from "../lib/storage";

const base: Stats = {
  streak: 3,
  bestScore: 35000,
  lastPlayed: "2026-11-08",
  plays: { "2026-11-08": 35000 },
  stories: {},
};

describe("mergeStoryProgress", () => {
  it("records completion and best score without touching daily stats", () => {
    const merged = mergeStoryProgress(
      base,
      "birth",
      42000,
      50000,
      new Date(Date.UTC(2026, 10, 9)),
    );

    expect(merged.streak).toBe(3);
    expect(merged.bestScore).toBe(35000);
    expect(merged.lastPlayed).toBe("2026-11-08");
    expect(merged.plays).toEqual({ "2026-11-08": 35000 });
    expect(merged.stories.birth).toEqual({
      completed: true,
      bestScore: 42000,
      maxScore: 50000,
      lastPlayed: "2026-11-09",
      plays: 1,
    });
  });

  it("keeps the highest score and increments plays", () => {
    const first = mergeStoryProgress(
      base,
      "birth",
      42000,
      50000,
      new Date(Date.UTC(2026, 10, 9)),
    );
    const second = mergeStoryProgress(
      first,
      "birth",
      30000,
      50000,
      new Date(Date.UTC(2026, 10, 10)),
    );

    expect(second.stories.birth.bestScore).toBe(42000);
    expect(second.stories.birth.plays).toBe(2);
    expect(second.stories.birth.lastPlayed).toBe("2026-11-10");
  });
});
