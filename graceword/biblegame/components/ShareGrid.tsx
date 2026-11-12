"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { fill, formatDailyDate, localeNumber } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import { MAX_QUESTION } from "@/lib/scoring";
import type { QuestionResult } from "@/lib/types";

function square(points: number): string {
  const pct = points / MAX_QUESTION;
  if (pct >= 0.78) return "🟩";
  if (pct >= 0.4) return "🟨";
  return "🟥";
}

interface ShareGridProps {
  results: QuestionResult[];
  total: number;
  date: string;
  locale: Locale;
  text: UiText["share"];
  context?: string;
}

export default function ShareGrid({
  results,
  total,
  date,
  locale,
  text,
  context,
}: ShareGridProps) {
  const [copied, setCopied] = useState(false);

  const yearRow = results.map((r) => square(r.yearPoints * 2)).join("");
  const distRow = results.map((r) => square(r.distPoints * 2)).join("");

  const header = context
    ? fill(text.storyHeader, {
        story: context,
        date: formatDailyDate(date, locale),
      })
    : fill(text.header, { date: formatDailyDate(date, locale) });

  const shareText = [
    header,
    `${text.yearRow} ${yearRow}`,
    `${text.distRow} ${distRow}`,
    `${text.totalRow} ${localeNumber(total, locale)} / ${localeNumber(
      MAX_QUESTION * results.length,
      locale,
    )}`,
  ].join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const area = document.createElement("textarea");
      area.value = shareText;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-ink/70">{text.title}</p>
      <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-ink/5 p-4 text-base leading-relaxed">
        {shareText}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="mt-3 w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-parchment transition hover:bg-ink/85"
      >
        {copied ? text.copied : text.copy}
      </button>
    </div>
  );
}
