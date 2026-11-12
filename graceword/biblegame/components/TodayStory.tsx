"use client";

import { useEffect, useState } from "react";
import type { LocalizedStory } from "@/data/stories";
import { pickDailyStory } from "@/lib/daily";
import type { Locale } from "@/lib/i18n/config";
import type { UiText } from "@/lib/i18n/types";
import LocaleLink from "./LocaleLink";

interface TodayStoryProps {
  locale: Locale;
  stories: LocalizedStory[];
  text: UiText;
}

export default function TodayStory({
  locale,
  stories,
  text,
}: TodayStoryProps) {
  const [story, setStory] = useState<LocalizedStory | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setStory(pickDailyStory(new Date(), stories));
  }, [stories]);

  if (story === undefined) {
    return (
      <div className="card h-28 animate-pulse bg-ink/5" aria-hidden="true" />
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">
        {text.home.todayStory}
      </p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {story ? story.title : text.home.mixedChallenge}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/60">
            {story ? story.intro : text.home.mixedIntro}
          </p>
        </div>
        <LocaleLink
          locale={locale}
          href="/play/"
          className="shrink-0 rounded-xl bg-gold px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold/85"
        >
          {story ? text.home.startStory : text.home.startMixed}
        </LocaleLink>
      </div>
    </div>
  );
}
