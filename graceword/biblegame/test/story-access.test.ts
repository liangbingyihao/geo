import { describe, expect, it } from "vitest";
import {
  getStoryPlayMode,
  isStoryPlayable,
} from "../lib/story-access";
import type { StoryProgress } from "../lib/storage";

const completed: StoryProgress = {
  completed: true,
  bestScore: 42000,
  maxScore: 50000,
  lastPlayed: "2026-11-09",
  plays: 1,
};

describe("story access", () => {
  it("allows today's story even if not completed", () => {
    expect(getStoryPlayMode("passion", "passion", undefined)).toBe("daily");
    expect(isStoryPlayable("passion", "passion", undefined)).toBe(true);
  });

  it("allows practice only for completed stories", () => {
    expect(getStoryPlayMode("birth", "passion", completed)).toBe("practice");
    expect(isStoryPlayable("birth", "passion", completed)).toBe(true);
  });

  it("locks unfinished stories that are not today's story", () => {
    expect(getStoryPlayMode("birth", "passion", undefined)).toBe("locked");
    expect(isStoryPlayable("birth", "passion", undefined)).toBe(false);
  });

  it("treats a completed today's story as daily", () => {
    expect(getStoryPlayMode("passion", "passion", completed)).toBe("daily");
  });

  it("locks stories when there is no today story (Sunday)", () => {
    expect(getStoryPlayMode("birth", null, undefined)).toBe("locked");
    expect(getStoryPlayMode("birth", null, completed)).toBe("practice");
  });
});
