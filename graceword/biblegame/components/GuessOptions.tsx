"use client";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface GuessOptionsProps {
  options: string[];
  wrong: string[];
  ariaLabel: string;
  onSelect: (option: string) => void;
}

export default function GuessOptions({
  options,
  wrong,
  ariaLabel,
  onSelect,
}: GuessOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={ariaLabel}>
      {options.map((option, index) => {
        const isWrong = wrong.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            disabled={isWrong}
            className={[
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition sm:text-base",
              isWrong
                ? "cursor-not-allowed border-red-300 bg-red-50/70 text-red-400 line-through"
                : "border-ink/15 bg-white/70 hover:-translate-y-0.5 hover:border-gold hover:shadow-md",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isWrong ? "bg-red-100 text-red-400" : "bg-gold/15 text-gold",
              ].join(" ")}
            >
              {LETTERS[index] ?? "?"}
            </span>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
