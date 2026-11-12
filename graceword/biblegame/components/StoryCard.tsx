import type { LocalizedStory } from "@/data/stories";
import {
  getStoryEraLabels,
  getStoryThemeGroupLabels,
  themeGroupForTheme,
} from "@/data/i18n/story-taxonomy";
import type { Locale } from "@/lib/i18n/config";
import { fill, localeNumber } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import type { StoryProgress } from "@/lib/storage";
import type { StoryPlayMode } from "@/lib/story-access";
import LocaleLink from "./LocaleLink";

interface StoryCardProps {
  story: LocalizedStory;
  mode: StoryPlayMode;
  progress?: StoryProgress;
  locale: Locale;
  text: UiText;
  featured?: boolean;
}

export default function StoryCard({
  story,
  mode,
  progress,
  locale,
  text,
  featured = false,
}: StoryCardProps) {
  const eraLabels = getStoryEraLabels(locale);
  const groupLabels = getStoryThemeGroupLabels(locale);
  const groupIds = [...new Set(story.themes.map(themeGroupForTheme))];
  const bestScore = progress?.bestScore ?? 0;
  const isTodayCompleted = mode === "daily" && progress?.completed;

  return (
    <article
      className={
        featured
          ? "card border-gold/30 bg-gold/5 p-5 sm:p-6"
          : `flex flex-col gap-3 p-5 ${
              mode === "locked" ? "card opacity-75" : "card"
            }`
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {featured && (
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gold">
              {text.stories.today}
            </p>
          )}
          <h2
            className={
              featured ? "text-2xl font-semibold" : "text-lg font-semibold"
            }
          >
            {story.title}
          </h2>
          <p className="mt-1 text-xs text-ink/45">
            {fill(text.stories.scenes, {
              count: story.questionIds.length,
            })}
          </p>
        </div>
        {!featured && mode === "daily" && (
          <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold">
            {text.stories.today}
          </span>
        )}
        {!featured && mode === "practice" && (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            {text.stories.completed}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px] text-ink/50">
        <span className="rounded-full bg-ink/5 px-2 py-0.5">
          {eraLabels[story.era]}
        </span>
        {groupIds.map((groupId) => (
          <span key={groupId} className="rounded-full bg-ink/5 px-2 py-0.5">
            {groupLabels[groupId]}
          </span>
        ))}
      </div>

      {mode !== "locked" && (
        <p
          className={
            featured
              ? "max-w-3xl text-sm leading-relaxed text-ink/65"
              : "text-sm leading-relaxed text-ink/65"
          }
        >
          {story.intro}
        </p>
      )}

      {mode !== "locked" && progress?.completed && (
        <p className="text-xs text-ink/50">
          {fill(text.stories.best, {
            score: localeNumber(bestScore, locale),
          })}
        </p>
      )}

      {mode === "daily" && (
        <LocaleLink
          locale={locale}
          href="/play/"
          className={
            featured
              ? "inline-block w-full rounded-xl bg-gold px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold/85 sm:w-auto"
              : "mt-auto rounded-xl bg-gold px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gold/85"
          }
        >
          {isTodayCompleted
            ? text.stories.replayToday
            : text.stories.startToday}
        </LocaleLink>
      )}

      {mode === "practice" && (
        <LocaleLink
          locale={locale}
          href={`/play/?story=${story.id}`}
          className={
            featured
              ? "inline-block w-full rounded-xl border border-ink/15 px-5 py-3 text-center text-sm font-semibold transition hover:border-gold hover:text-gold sm:w-auto"
              : "mt-auto rounded-xl border border-ink/15 px-4 py-2.5 text-center text-sm font-semibold transition hover:border-gold hover:text-gold"
          }
        >
          {text.stories.replayPractice}
        </LocaleLink>
      )}

      {mode === "locked" && (
        <p className="mt-auto text-xs text-ink/45">
          {text.stories.unlockHint}
        </p>
      )}
    </article>
  );
}
