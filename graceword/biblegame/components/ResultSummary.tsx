"use client";

import type { Locale } from "@/lib/i18n/config";
import { fill, localeNumber } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import { formatYear, MAX_AXIS } from "@/lib/scoring";
import type { GameQuestion, ScoredResult } from "@/lib/types";

function AxisBar({
  label,
  value,
  detail,
  locale,
  scoreUnit,
}: {
  label: string;
  value: number;
  detail: string;
  locale: Locale;
  scoreUnit: string;
}) {
  const pct = Math.round((value / MAX_AXIS) * 100);
  const color =
    pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-400";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink/70">{label}</span>
        <span className="tabular-nums text-ink/60">
          {localeNumber(value, locale)} {scoreUnit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink/50">{detail}</p>
    </div>
  );
}

interface ResultSummaryProps {
  question: GameQuestion;
  result: ScoredResult;
  locale: Locale;
  text: UiText["game"];
}

export default function ResultSummary({
  question,
  result,
  locale,
  text,
}: ResultSummaryProps) {
  const { event, scripture } = question;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">
          {text.correctAnswer}
        </p>
        <h3 className="mt-1 text-2xl font-semibold">{question.answer}</h3>
        <p className="mt-1 text-sm text-ink/60">
          {scripture.book} {scripture.chapter}:{scripture.verse}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gold/10 px-4 py-3">
        <span className="text-sm text-ink/70">{text.questionScore}</span>
        <span className="text-2xl font-semibold tabular-nums text-gold">
          {localeNumber(result.total, locale)}
        </span>
      </div>

      <div className="space-y-4">
        <AxisBar
          label={text.yearAxis}
          value={result.yearPoints}
          locale={locale}
          scoreUnit={text.scoreUnit}
          detail={fill(text.yearDetail, {
            guess: formatYear(result.yearGuess, locale),
            actual: formatYear(event.year, locale),
          })}
        />
        <AxisBar
          label={text.distanceAxis}
          value={result.distPoints}
          locale={locale}
          scoreUnit={text.scoreUnit}
          detail={fill(text.distanceDetail, {
            km: Math.round(result.distanceKm),
            place: event.placeName,
          })}
        />
      </div>

      {result.identifiedOnTry > 1 && (
        <p className="rounded-lg bg-ink/5 px-3 py-2 text-xs text-ink/60">
          {fill(text.multiplier, {
            try: result.identifiedOnTry,
            multiplier: result.multiplier.toFixed(1),
          })}
        </p>
      )}
    </div>
  );
}
