import { getQuestions, getStories, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";

export default function PlacesPage({ locale }: { locale: Locale }) {
  const text = getUiText(locale);
  const stories = getStories(locale);
  const questions = getQuestions(locale);
  const byId = new Map(questions.map((question) => [question.id, question]));

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.places.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{text.places.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/65">
          {text.places.intro}
        </p>
        <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs leading-relaxed text-ink/65">
          {text.places.spoilerNote}
        </p>
      </header>

      {stories.map((story) => (
        <section key={story.id} className="space-y-3">
          <h2 className="text-lg font-semibold">{story.title}</h2>
          <div className="overflow-hidden rounded-xl border border-ink/10">
            <div className="hidden bg-ink/5 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-ink/45 sm:grid sm:grid-cols-[1fr_1fr_1.5fr_0.8fr] sm:gap-3">
              <span>{text.places.biblicalLabel}</span>
              <span>{text.places.regionLabel}</span>
              <span>{text.places.modernLabel}</span>
              <span>{text.places.scriptureLabel}</span>
            </div>

            {story.questionIds.map((id) => {
              const question = byId.get(id);
              if (!question) return null;

              return (
                <div
                  key={id}
                  className="border-t border-ink/10 px-3 py-3 text-sm"
                >
                  <div className="grid gap-1 sm:grid-cols-[1fr_1fr_1.5fr_0.8fr] sm:gap-3">
                    <div>
                      <span className="text-ink/45 sm:hidden">
                        {text.places.biblicalLabel}：
                      </span>
                      <span className="font-medium">
                        {question.event.placeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink/45 sm:hidden">
                        {text.places.regionLabel}：
                      </span>
                      {question.regionName}
                    </div>
                    <div>
                      <span className="text-ink/45 sm:hidden">
                        {text.places.modernLabel}：
                      </span>
                      {question.modernName}
                    </div>
                    <div>
                      <span className="text-ink/45 sm:hidden">
                        {text.places.scriptureLabel}：
                      </span>
                      {question.scripture.book} {question.scripture.chapter}:
                      {question.scripture.verse}
                    </div>
                  </div>

                  {question.geoNote && (
                    <p className="mt-2 text-xs leading-relaxed text-ink/60">
                      <span className="font-semibold text-gold">
                        {text.places.noteLabel}：
                      </span>
                      {question.geoNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
