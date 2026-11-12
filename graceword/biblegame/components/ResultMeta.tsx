"use client";

import { fill } from "@/lib/i18n/format";
import type { UiText } from "@/lib/i18n/types";
import type { GameQuestion } from "@/lib/types";

interface ResultMetaProps {
  question: GameQuestion;
  text: UiText["game"];
}

export default function ResultMeta({ question, text }: ResultMetaProps) {
  return (
    <details className="card p-4 text-sm">
      <summary className="cursor-pointer text-sm font-medium text-ink/60">
        {text.moreDetails}
      </summary>
      <div className="mt-3 space-y-2">
        <p className="leading-relaxed text-ink/75">{question.summary}</p>
        <p className="text-[11px] leading-relaxed text-ink/45">
          {fill(text.imageCredit, {
            title: question.image.title,
            artist: question.image.artist,
            license: question.image.license,
          })}{" "}
          <a
            href={question.image.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-gold"
          >
            Wikimedia Commons
          </a>
        </p>
      </div>
    </details>
  );
}
