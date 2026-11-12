"use client";

import type { Locale } from "@/lib/i18n/config";
import { formatYear } from "@/lib/scoring";

interface YearSliderProps {
  value: number;
  onChange: (value: number) => void;
  locale: Locale;
  prompt: string;
  touched?: boolean;
  onInteract?: () => void;
  unselectedLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
  min?: number;
  max?: number;
}

export default function YearSlider({
  value,
  onChange,
  locale,
  prompt,
  touched = false,
  onInteract,
  unselectedLabel,
  decreaseLabel,
  increaseLabel,
  min = -10,
  max = 100,
}: YearSliderProps) {
  function update(next: number) {
    onChange(Math.min(max, Math.max(min, next)));
    onInteract?.();
  }

  return (
    <div>
      <label htmlFor="year" className="text-sm font-medium text-ink/70">
        {prompt}
      </label>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => update(value - 1)}
          disabled={value <= min}
          aria-label={decreaseLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg text-ink/70 transition enabled:hover:border-gold enabled:hover:text-gold disabled:opacity-30"
        >
          −
        </button>

        <div className="flex-1 text-center">
          <p
            className={`text-2xl font-semibold tabular-nums ${
              touched ? "text-gold" : "text-ink/40"
            }`}
          >
            {touched ? formatYear(value, locale) : unselectedLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => update(value + 1)}
          disabled={value >= max}
          aria-label={increaseLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg text-ink/70 transition enabled:hover:border-gold enabled:hover:text-gold disabled:opacity-30"
        >
          +
        </button>
      </div>

      <input
        id="year"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => update(Number(event.target.value))}
        onPointerDown={onInteract}
        onKeyDown={onInteract}
        aria-valuetext={formatYear(value, locale)}
        className="mt-3 w-full"
      />

      <div className="mt-1 flex justify-between text-xs text-ink/50">
        <span>{formatYear(min, locale)}</span>
        <span>{formatYear(max, locale)}</span>
      </div>
    </div>
  );
}
