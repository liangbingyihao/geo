import type { LocalizedStory } from "@/data/stories";
import { pickDailyStory } from "./daily";
import type { StoryProgress } from "./storage";

export type StoryPlayMode = "daily" | "practice" | "locked";

export function getTodayStoryId(
  stories: LocalizedStory[],
  date: Date = new Date(),
): string | null {
  return pickDailyStory(date, stories)?.id ?? null;
}

export function getStoryPlayMode(
  storyId: string,
  todayStoryId: string | null,
  progress?: StoryProgress,
): StoryPlayMode {
  if (storyId === todayStoryId) return "daily";
  if (progress?.completed) return "practice";
  return "locked";
}

export function isStoryPlayable(
  storyId: string,
  todayStoryId: string | null,
  progress?: StoryProgress,
): boolean {
  return getStoryPlayMode(storyId, todayStoryId, progress) !== "locked";
}
