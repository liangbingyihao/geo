import { dailyDateKey } from "./daily";

const KEY = "biblegame.stats.v1";

export interface StoryProgress {
  completed: boolean;
  bestScore: number;
  maxScore: number;
  lastPlayed: string;
  plays: number;
}

export interface Stats {
  streak: number;
  bestScore: number;
  lastPlayed: string | null;
  plays: Record<string, number>;
  stories: Record<string, StoryProgress>;
}

const EMPTY: Stats = {
  streak: 0,
  bestScore: 0,
  lastPlayed: null,
  plays: {},
  stories: {},
};

export function getStats(): Stats {
  if (typeof window === "undefined") return { ...EMPTY, stories: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, stories: {} };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      ...EMPTY,
      ...parsed,
      plays: parsed.plays ?? {},
      stories: parsed.stories ?? {},
    };
  } catch {
    return { ...EMPTY, stories: {} };
  }
}

function prevDateKey(date: Date): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 1);
  return dailyDateKey(d);
}

function persist(stats: Stats): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    /* ignore quota errors */
  }
}

export function recordDailyScore(score: number, date: Date = new Date()): Stats {
  const today = dailyDateKey(date);
  const stats = getStats();
  const alreadyPlayed = stats.lastPlayed === today;

  const newStats: Stats = {
    ...stats,
    bestScore: Math.max(stats.bestScore, score),
    lastPlayed: today,
    plays: { ...stats.plays, [today]: Math.max(stats.plays[today] ?? 0, score) },
  };

  if (!alreadyPlayed) {
    newStats.streak = stats.lastPlayed === prevDateKey(date) ? stats.streak + 1 : 1;
  }

  persist(newStats);
  return newStats;
}

export function mergeStoryProgress(
  stats: Stats,
  storyId: string,
  score: number,
  maxScore: number,
  date: Date = new Date(),
): Stats {
  const previous = stats.stories[storyId];
  const next: StoryProgress = {
    completed: true,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    maxScore,
    lastPlayed: dailyDateKey(date),
    plays: (previous?.plays ?? 0) + 1,
  };

  return {
    ...stats,
    stories: { ...stats.stories, [storyId]: next },
  };
}

export function recordStoryResult(
  storyId: string,
  score: number,
  maxScore: number,
  date: Date = new Date(),
): Stats {
  const stats = mergeStoryProgress(getStats(), storyId, score, maxScore, date);
  persist(stats);
  return stats;
}
