"use client";

import { useEffect, useState } from "react";
import type { LocalizedStory } from "@/data/stories";
import { BADGE_TEXT } from "@/data/i18n/badges";
import type { Locale } from "@/lib/i18n/config";
import { encodeChallenge } from "@/lib/challenge";
import { fill, localeNumber } from "@/lib/i18n/format";
import { absoluteUrl, localePath } from "@/lib/i18n/paths";
import type { UiText } from "@/lib/i18n/types";
import {
  completedStoryCount,
  getBadges,
  recentDays,
  totalStoryPlays,
} from "@/lib/badges";
import { getStats, type Stats } from "@/lib/storage";
import LocaleLink from "./LocaleLink";

interface ProgressDashboardProps {
  locale: Locale;
  stories: LocalizedStory[];
  text: UiText;
}

function shortDate(key: string, locale: Locale): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-TW", {
    timeZone: "UTC",
    month: "numeric",
    day: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export default function ProgressDashboard({
  locale,
  stories,
  text,
}: ProgressDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-24 animate-pulse rounded-2xl bg-ink/5" />
          <div className="h-24 animate-pulse rounded-2xl bg-ink/5" />
          <div className="h-24 animate-pulse rounded-2xl bg-ink/5" />
          <div className="h-24 animate-pulse rounded-2xl bg-ink/5" />
        </div>
        <div className="h-40 animate-pulse rounded-2xl bg-ink/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-ink/5" />
      </div>
    );
  }

  const completed = completedStoryCount(stats);
  const plays = totalStoryPlays(stats);
  const badges = getBadges(stats, stories.length);
  const days = recentDays(stats, 7);
  const badgeLabels = BADGE_TEXT[locale];
  const earnedCount = badges.filter((badge) => badge.achieved).length;

  const completedQuestionIds = [
    ...new Set(
      stories
        .filter((story) => stats.stories[story.id]?.completed)
        .flatMap((story) => story.questionIds),
    ),
  ];

  function createChallenge() {
    const pool = [...completedQuestionIds];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const ids = pool.slice(0, 5);
    const token = encodeChallenge(ids);
    window.location.assign(
      `${absoluteUrl(localePath(locale, "/play/"))}?challenge=${token}`,
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-3 text-center sm:grid-cols-2 lg:grid-cols-4">
        <div className="card px-4 py-4">
          <p className="text-2xl font-semibold tabular-nums text-gold">
            {stats.streak}
          </p>
          <p className="mt-1 text-xs text-ink/55">{text.progress.streak}</p>
        </div>
        <div className="card px-4 py-4">
          <p className="text-2xl font-semibold tabular-nums text-gold">
            {localeNumber(stats.bestScore, locale)}
          </p>
          <p className="mt-1 text-xs text-ink/55">{text.progress.bestDaily}</p>
        </div>
        <div className="card px-4 py-4">
          <p className="text-2xl font-semibold tabular-nums text-gold">
            {completed} / {stories.length}
          </p>
          <p className="mt-1 text-xs text-ink/55">
            {text.progress.storiesCompleted}
          </p>
        </div>
        <div className="card px-4 py-4">
          <p className="text-2xl font-semibold tabular-nums text-gold">
            {plays}
          </p>
          <p className="mt-1 text-xs text-ink/55">{text.progress.storyPlays}</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">{text.progress.recentTitle}</h2>
        <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
          {days.map((day) => (
            <div
              key={day.key}
              className={`rounded-xl border px-1 py-2 ${
                day.today
                  ? "border-gold bg-gold/10"
                  : "border-ink/10 bg-white/40"
              }`}
            >
              <p className="text-[10px] text-ink/45">
                {shortDate(day.key, locale)}
              </p>
              <p
                className={`mt-1 text-xs font-semibold tabular-nums ${
                  day.score !== null ? "text-gold" : "text-ink/30"
                }`}
              >
                {day.score !== null
                  ? localeNumber(day.score, locale)
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">{text.progress.badgesTitle}</h2>
          <p className="text-xs text-ink/45">
            {earnedCount} / {badges.length}
          </p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => {
            const label = badgeLabels[badge.id];
            return (
              <div
                key={badge.id}
                className={`card p-4 ${
                  badge.achieved ? "border-gold/30 bg-gold/5" : "opacity-65"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{label.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      badge.achieved
                        ? "bg-gold/15 text-gold"
                        : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    {badge.achieved
                      ? text.progress.achieved
                      : text.progress.locked}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">
                  {label.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          {text.progress.storyProgressTitle}
        </h2>
        <div className="mt-3 space-y-2">
          {stories
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((story) => {
              const progress = stats.stories[story.id];
              return (
                <div
                  key={story.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white/40 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{story.title}</p>
                    <p className="text-xs text-ink/50">
                      {progress?.completed
                        ? text.stories.completed
                        : text.stories.notCompleted}
                    </p>
                  </div>
                  <p className="text-xs tabular-nums text-ink/55">
                    {progress?.completed
                      ? fill(text.stories.best, {
                          score: localeNumber(progress.bestScore, locale),
                        })
                      : "—"}
                  </p>
                </div>
              );
            })}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">
          {text.progress.challengeTitle}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          {text.progress.challengeIntro}
        </p>

        {completedQuestionIds.length === 0 ? (
          <p className="mt-3 text-xs text-ink/50">
            {text.progress.challengeNeedsStory}
          </p>
        ) : (
          <button
            type="button"
            onClick={createChallenge}
            className="mt-3 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-white transition hover:bg-gold/85"
          >
            {text.progress.createChallenge}
          </button>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <LocaleLink
          locale={locale}
          href="/play/"
          className="flex-1 rounded-xl bg-gold px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold/85"
        >
          {text.progress.startDaily}
        </LocaleLink>
        <LocaleLink
          locale={locale}
          href="/stories/"
          className="flex-1 rounded-xl border border-ink/15 px-5 py-3 text-center text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          {text.progress.goStories}
        </LocaleLink>
      </div>
    </div>
  );
}
