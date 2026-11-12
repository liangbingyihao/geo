"use client";

import { useEffect, useMemo, useState } from "react";
import type { LocalizedStory, StoryEra } from "@/data/stories";
import {
  THEME_GROUPS,
  getStoryEraLabels,
  getStoryThemeGroupLabels,
  themeGroupForTheme,
  type StoryThemeGroup,
} from "@/data/i18n/story-taxonomy";
import type { Locale } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import { getStats, type Stats } from "@/lib/storage";
import {
  getStoryPlayMode,
  getTodayStoryId,
} from "@/lib/story-access";
import LocaleLink from "./LocaleLink";
import StoryCard from "./StoryCard";

interface StoryLibraryProps {
  locale: Locale;
  stories: LocalizedStory[];
  text: UiText;
}

export default function StoryLibrary({
  locale,
  stories,
  text,
}: StoryLibraryProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayId, setTodayId] = useState<string | null>(null);
  const [era, setEra] = useState<StoryEra | "all">("all");
  const [theme, setTheme] = useState<StoryThemeGroup | "all">("all");

  useEffect(() => {
    const now = new Date();
    setStats(getStats());
    setTodayId(getTodayStoryId(stories, now));
  }, [stories]);

  const eraLabels = getStoryEraLabels(locale);
  const groupLabels = getStoryThemeGroupLabels(locale);

  const gridBase = useMemo(
    () => stories.filter((story) => story.id !== todayId),
    [stories, todayId],
  );

  const eraOptions = useMemo(() => {
    const counts = new Map<StoryEra, number>();
    for (const story of gridBase) {
      counts.set(story.era, (counts.get(story.era) ?? 0) + 1);
    }
    return (["nt", "early-church", "ot", "church-history"] as StoryEra[])
      .filter((id) => (counts.get(id) ?? 0) > 0)
      .map((id) => ({ id, count: counts.get(id) ?? 0 }));
  }, [gridBase]);

  const themeOptions = useMemo(() => {
    const counts = new Map<StoryThemeGroup, number>();
    for (const story of gridBase) {
      const groups = new Set(story.themes.map(themeGroupForTheme));
      for (const group of groups) {
        counts.set(group, (counts.get(group) ?? 0) + 1);
      }
    }
    return THEME_GROUPS.filter((group) => (counts.get(group.id) ?? 0) > 0).map(
      (group) => ({ id: group.id, count: counts.get(group.id) ?? 0 }),
    );
  }, [gridBase]);

  const filtered = useMemo(() => {
    return gridBase
      .filter((story) => {
        if (era !== "all" && story.era !== era) return false;
        if (
          theme !== "all" &&
          !story.themes.some((item) => themeGroupForTheme(item) === theme)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [gridBase, era, theme]);

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-ink/10" />
        <div className="h-40 animate-pulse rounded-2xl bg-ink/5" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-ink/5" />
          <div className="h-48 animate-pulse rounded-2xl bg-ink/5" />
        </div>
      </div>
    );
  }

  const todayStory = todayId
    ? stories.find((story) => story.id === todayId) ?? null
    : null;

  const todayMatchesFilters =
    todayStory !== null &&
    (era === "all" || todayStory.era === era) &&
    (theme === "all" ||
      todayStory.themes.some(
        (item) => themeGroupForTheme(item) === theme,
      ));

  const completedCount = stories.filter(
    (story) => stats.stories[story.id]?.completed,
  ).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/55">
        {fill(text.stories.progress, {
          completed: completedCount,
          total: stories.length,
        })}
      </p>

      {todayStory ? (
        <StoryCard
          story={todayStory}
          mode="daily"
          progress={stats.stories[todayStory.id]}
          locale={locale}
          text={text}
          featured
        />
      ) : (
        <div className="card border-gold/30 bg-gold/5 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            {text.stories.today}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            {text.stories.mixedToday}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/65">
            {text.home.mixedIntro}
          </p>
          <LocaleLink
            locale={locale}
            href="/play/"
            className="mt-4 inline-block w-full rounded-xl bg-gold px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold/85 sm:w-auto"
          >
            {text.home.startMixed}
          </LocaleLink>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-ink/40">
            {text.stories.eraLabel}
          </span>
          <button
            type="button"
            onClick={() => setEra("all")}
            aria-pressed={era === "all"}
            className={`rounded-full px-3 py-1 text-xs transition ${
              era === "all"
                ? "bg-gold text-white"
                : "border border-ink/15 text-ink/60 hover:border-gold hover:text-gold"
            }`}
          >
            {text.stories.all}
          </button>
          {eraOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setEra(option.id)}
              aria-pressed={era === option.id}
              className={`rounded-full px-3 py-1 text-xs transition ${
                era === option.id
                  ? "bg-gold text-white"
                  : "border border-ink/15 text-ink/60 hover:border-gold hover:text-gold"
              }`}
            >
              {eraLabels[option.id]} ({option.count})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-ink/40">
            {text.stories.themeLabel}
          </span>
          <button
            type="button"
            onClick={() => setTheme("all")}
            aria-pressed={theme === "all"}
            className={`rounded-full px-3 py-1 text-xs transition ${
              theme === "all"
                ? "bg-gold text-white"
                : "border border-ink/15 text-ink/60 hover:border-gold hover:text-gold"
            }`}
          >
            {text.stories.all}
          </button>
          {themeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id)}
              aria-pressed={theme === option.id}
              className={`rounded-full px-3 py-1 text-xs transition ${
                theme === option.id
                  ? "bg-gold text-white"
                  : "border border-ink/15 text-ink/60 hover:border-gold hover:text-gold"
              }`}
            >
              {groupLabels[option.id]} ({option.count})
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-lg font-semibold">{text.stories.allStories}</h2>

      {filtered.length === 0 ? (
        <p className="card p-6 text-center text-sm text-ink/55">
          {todayMatchesFilters
            ? text.stories.todayOnlyFilter
            : text.stories.empty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              mode={getStoryPlayMode(
                story.id,
                todayId,
                stats.stories[story.id],
              )}
              progress={stats.stories[story.id]}
              locale={locale}
              text={text}
            />
          ))}
        </div>
      )}
    </div>
  );
}
