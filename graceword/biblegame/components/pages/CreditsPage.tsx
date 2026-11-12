import { getQuestions, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import LocaleLink from "../LocaleLink";

export default function CreditsPage({ locale }: { locale: Locale }) {
  const text = getUiText(locale);
  const seen = new Set<string>();
  const images = getQuestions(locale).filter((question) => {
    if (seen.has(question.image.src)) return false;
    seen.add(question.image.src);
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.credits.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{text.credits.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {text.credits.intro}
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">{text.credits.worksTitle}</h2>
        <ul className="mt-3 space-y-3">
          {images.map(({ id, image }) => (
            <li key={id} className="card p-4 text-sm">
              <p className="font-medium">
                {image.title}
                <span className="text-ink/50"> — {image.artist}</span>
              </p>
              <p className="mt-1 text-xs text-ink/55">
                {text.credits.licenseLabel}
                {image.license}
              </p>
              <a
                href={image.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block break-all text-xs text-gold underline decoration-dotted underline-offset-2"
              >
                {image.sourceUrl}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 text-sm leading-relaxed text-ink/65">
        <h2 className="text-lg font-semibold text-ink">
          {text.credits.otherTitle}
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {text.credits.other.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card p-5 text-sm leading-relaxed text-ink/65">
        <h2 className="text-lg font-semibold text-ink">
          {text.credits.useTitle}
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {text.credits.use.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card p-5 text-sm leading-relaxed text-ink/65">
        <h2 className="text-lg font-semibold text-ink">{text.places.title}</h2>
        <p className="mt-2">{text.places.intro}</p>
        <LocaleLink
          locale={locale}
          href="/places/"
          className="mt-2 inline-block text-gold underline decoration-dotted underline-offset-2"
        >
          {text.places.studyLink}
        </LocaleLink>
      </section>
    </div>
  );
}
