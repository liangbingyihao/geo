import { dailyDateKey } from "./daily";
import type { Stats } from "./storage";

export type BadgeId =
  | "first-daily"
  | "streak-3"
  | "streak-7"
  | "story-first"
  | "story-all"
  | "story-perfect"
  | "high-score"
  | "practice";

export interface Badge {
  id: BadgeId;
  achieved: boolean;
}

export function completedStoryCount(stats: Stats): number {
  return Object.values(stats.stories).filter((story) => story.completed).length;
}

export function totalStoryPlays(stats: Stats): number {
  return Object.values(stats.stories).reduce(
    (sum, story) => sum + story.plays,
    0,
  );
}

export function recentDays(
  stats: Stats,
  count = 7,
  date: Date = new Date(),
): { key: string; score: number | null; today: boolean }[] {
  const todayKey = dailyDateKey(date);
  const days: { key: string; score: number | null; today: boolean }[] = [];

  for (let offset = count - 1; offset >= 0; offset--) {
    const day = new Date(date);
    day.setUTCDate(day.getUTCDate() - offset);
    const key = dailyDateKey(day);
    days.push({
      key,
      score: stats.plays[key] ?? null,
      today: key === todayKey,
    });
  }

  return days;
}

export function getBadges(stats: Stats, storyCount: number): Badge[] {
  const completed = completedStoryCount(stats);
  const hasStoryPlay = totalStoryPlays(stats) > 0;
  const hasPractice = Object.values(stats.stories).some(
    (story) => story.plays > 1,
  );
  const hasPerfectStory = Object.values(stats.stories).some(
    (story) => story.maxScore > 0 && story.bestScore >= story.maxScore,
  );

  return [
    { id: "first-daily", achieved: Object.keys(stats.plays).length > 0 },
    { id: "streak-3", achieved: stats.streak >= 3 },
    { id: "streak-7", achieved: stats.streak >= 7 },
    { id: "story-first", achieved: completed >= 1 },
    { id: "story-all", achieved: storyCount > 0 && completed >= storyCount },
    { id: "story-perfect", achieved: hasStoryPlay && hasPerfectStory },
    { id: "high-score", achieved: stats.bestScore >= 40000 },
    { id: "practice", achieved: hasPractice },
  ];
}
