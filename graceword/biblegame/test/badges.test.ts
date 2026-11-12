import { describe, expect, it } from "vitest";
import {
  completedStoryCount,
  getBadges,
  recentDays,
  totalStoryPlays,
  type BadgeId,
} from "../lib/badges";
import type { Stats } from "../lib/storage";

function makeStats(overrides: Partial<Stats> = {}): Stats {
  return {
    streak: 0,
    bestScore: 0,
    lastPlayed: null,
    plays: {},
    stories: {},
    ...overrides,
  };
}

function badge(stats: Stats, id: BadgeId, storyCount = 6): boolean {
  return getBadges(stats, storyCount).find((item) => item.id === id)!.achieved;
}

describe("badges", () => {
  it("awards the first daily badge after a play", () => {
    expect(badge(makeStats(), "first-daily")).toBe(false);
    expect(
      badge(makeStats({ plays: { "2026-11-09": 12000 } }), "first-daily"),
    ).toBe(true);
  });

  it("awards streak badges", () => {
    expect(badge(makeStats({ streak: 2 }), "streak-3")).toBe(false);
    expect(badge(makeStats({ streak: 3 }), "streak-3")).toBe(true);
    expect(badge(makeStats({ streak: 7 }), "streak-7")).toBe(true);
  });

  it("awards story completion badges", () => {
    const one = makeStats({
      stories: {
        birth: {
          completed: true,
          bestScore: 30000,
          maxScore: 50000,
          lastPlayed: "2026-11-09",
          plays: 1,
        },
      },
    });
    expect(badge(one, "story-first")).toBe(true);
    expect(badge(one, "story-all", 6)).toBe(false);
    expect(badge(one, "story-all", 1)).toBe(true);
  });

  it("awards perfect story, high score and practice badges", () => {
    const stats = makeStats({
      bestScore: 41000,
      stories: {
        birth: {
          completed: true,
          bestScore: 50000,
          maxScore: 50000,
          lastPlayed: "2026-11-09",
          plays: 2,
        },
      },
    });
    expect(badge(stats, "story-perfect")).toBe(true);
    expect(badge(stats, "high-score")).toBe(true);
    expect(badge(stats, "practice")).toBe(true);
  });
});

describe("progress helpers", () => {
  it("counts completed stories and plays", () => {
    const stats = makeStats({
      stories: {
        birth: {
          completed: true,
          bestScore: 40000,
          maxScore: 50000,
          lastPlayed: "2026-11-09",
          plays: 2,
        },
        passion: {
          completed: false,
          bestScore: 0,
          maxScore: 50000,
          lastPlayed: "",
          plays: 0,
        },
      },
    });
    expect(completedStoryCount(stats)).toBe(1);
    expect(totalStoryPlays(stats)).toBe(2);
  });

  it("builds the last seven days with today marked", () => {
    const stats = makeStats({ plays: { "2026-11-09": 30000 } });
    const days = recentDays(stats, 7, new Date(Date.UTC(2026, 10, 9)));

    expect(days).toHaveLength(7);
    expect(days[days.length - 1].key).toBe("2026-11-09");
    expect(days[days.length - 1].today).toBe(true);
    expect(days[days.length - 1].score).toBe(30000);
    expect(days[0].key).toBe("2026-11-03");
  });
});
