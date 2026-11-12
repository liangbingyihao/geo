"use client";

import { useEffect, useState } from "react";
import { dailyDateKey } from "@/lib/daily";
import type { Locale } from "@/lib/i18n/config";
import { formatDailyDate, localeNumber } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import { getStats, type Stats } from "@/lib/storage";

interface DailyStatusProps {
  locale: Locale;
  text: UiText["daily"];
}

export default function DailyStatus({ locale, text }: DailyStatusProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [today, setToday] = useState("");
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const d = new Date();
    const key = dailyDateKey(d);
    const current = getStats();
    setStats(current);
    setToday(key);
    setPlayed(current.lastPlayed === key);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="card px-3 py-4">
        <p className="text-2xl font-semibold tabular-nums text-gold">
          {stats ? stats.streak : "–"}
        </p>
        <p className="mt-1 text-xs text-ink/55">{text.streak}</p>
      </div>
      <div className="card px-3 py-4">
        <p className="text-2xl font-semibold tabular-nums text-gold">
          {stats ? localeNumber(stats.bestScore, locale) : "–"}
        </p>
        <p className="mt-1 text-xs text-ink/55">{text.best}</p>
      </div>
      <div className="card px-3 py-4">
        <p className="text-sm font-semibold text-ink/80">
          {today ? formatDailyDate(today, locale) : "—"}
        </p>
        <p className="mt-1 text-xs text-ink/55">
          {played ? text.played : text.notPlayed}
        </p>
      </div>
    </div>
  );
}
