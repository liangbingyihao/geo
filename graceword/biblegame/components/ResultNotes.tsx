"use client";

import type { UiText } from "@/lib/i18n/types";
import type { GameQuestion } from "@/lib/types";

interface ResultNotesProps {
  question: GameQuestion;
  text: UiText["game"];
}

export default function ResultNotes({ question, text }: ResultNotesProps) {
  return (
    <details className="card p-4 text-sm">
      <summary className="cursor-pointer text-sm font-medium text-ink/60">
        {text.notesToggle}
      </summary>
      <div className="mt-3 space-y-4">
        {question.keyVerse.text && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.keyVerseTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/80">
              {question.keyVerse.text}
            </p>
            <p className="mt-1 text-xs text-ink/45">{question.keyVerse.ref}</p>
          </div>
        )}

        {question.artNote && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.artNoteTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              {question.artNote}
            </p>
          </div>
        )}

        {question.geoNote && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.geoNoteTitle}
            </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/80">
            <span className="text-ink/45">{text.biblicalPlaceLabel}：</span>
            {question.event.placeName}
          </p>
          <p className="text-sm leading-relaxed text-ink/80">
            <span className="text-ink/45">{text.regionLabel}：</span>
            {question.regionName}
            <span className="text-ink/30"> · </span>
            <span className="text-ink/45">{text.modernNameLabel}：</span>
            {question.modernName}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">
            {question.geoNote}
          </p>
          </div>
        )}
      </div>
    </details>
  );
}
