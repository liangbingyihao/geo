"use client";

import { useMemo } from "react";
import type { LocalizedStory } from "@/data/stories";
import type { Locale } from "@/lib/i18n/config";
import { localeNumber } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import type { MapLabel } from "@/lib/map-labels";
import type {
  GameQuestion,
  MapRoutePoint,
  ScoredResult,
} from "@/lib/types";
import MapGuess from "./MapGuess";
import SafeImage from "./SafeImage";

interface StoryRecapProps {
  story: LocalizedStory;
  questions: GameQuestion[];
  results: ScoredResult[];
  locale: Locale;
  text: UiText;
  labels: MapLabel[];
}

export default function StoryRecap({
  story,
  questions,
  results,
  locale,
  text,
  labels,
}: StoryRecapProps) {
  const route = useMemo<MapRoutePoint[]>(
    () =>
      questions.map((question) => ({
        lat: question.event.lat,
        lng: question.event.lng,
        label: question.event.placeName,
      })),
    [questions],
  );

  const resultById = useMemo(
    () => new Map(results.map((result) => [result.questionId, result])),
    [results],
  );

  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">
          {text.story.recapTitle}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{story.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          {text.story.recapIntro}
        </p>
      </div>

      <div className="card p-4">
        <p className="mb-2 text-xs text-ink/55">{text.story.journeyMap}</p>
        <MapGuess
          guess={null}
          onGuess={() => undefined}
          labels={labels}
          mapText={text.map}
          route={route}
          heightClassName="h-64 w-full rounded-xl sm:h-72"
        />
        <ol className="mt-3 grid gap-1 text-xs text-ink/60 sm:grid-cols-2">
          {questions.map((question, index) => (
            <li key={`${question.id}-${index}`}>
              <span className="font-semibold text-gold">{index + 1}.</span>{" "}
              {question.event.placeName}
              {question.regionName ? ` · ${question.regionName}` : ""}
              {question.modernName ? ` · ${question.modernName}` : ""}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink/70">
          {text.story.scenesTitle}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((question, index) => {
            const result = resultById.get(question.id);
            return (
              <div key={question.id} className="card overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <SafeImage
                    src={question.image.src}
                    alt={question.image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover"
                  />
                  <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-sm font-semibold">{question.answer}</p>
                  <p className="text-xs text-ink/55">
                    {question.event.placeName}
                    {question.regionName ? ` · ${question.regionName}` : ""}
                  </p>
                  {question.modernName && (
                    <p className="text-[11px] text-ink/45">{question.modernName}</p>
                  )}
                  {result && (
                    <p className="text-xs tabular-nums text-ink/45">
                      {localeNumber(result.total, locale)} {text.game.scoreUnit}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {story.outro && (
        <p className="text-center text-sm italic leading-relaxed text-ink/60">
          {story.outro}
        </p>
      )}
    </section>
  );
}
