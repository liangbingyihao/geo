import { getStories, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import { absoluteUrl, localePath } from "@/lib/i18n/paths";
import DailyStatus from "../DailyStatus";
import LocaleLink from "../LocaleLink";
import TodayStory from "../TodayStory";
import SafeImage from "../SafeImage";

export default function HomePage({ locale }: { locale: Locale }) {
  const text = getUiText(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: text.meta.siteName,
    url: absoluteUrl(localePath(locale, "/")),
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    inLanguage: locale === "en" ? "en" : "zh-Hant",
    description: text.meta.homeDescription,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {text.home.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            {text.home.title1}
            <br />
            {text.home.title2}
          </h1>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink/65 sm:text-base">
            {text.home.subtitle}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LocaleLink
              locale={locale}
              href="/play/"
              className="rounded-xl bg-gold px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold/85"
            >
              {text.home.ctaStart}
            </LocaleLink>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 shadow-lg">
          <SafeImage
            src="/images/last_supper.jpg"
            alt={text.home.heroAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
            <p className="text-xs tracking-wider text-white/85">
              {text.home.heroCaption}
            </p>
          </div>
        </div>
      </section>

      <section>
        <TodayStory
          locale={locale}
          stories={getStories(locale)}
          text={text}
        />
      </section>

      <section>
        <DailyStatus locale={locale} text={text.daily} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {text.home.features.map((feature) => (
          <div key={feature.title} className="card p-5">
            <div className="mb-3 h-1 w-8 rounded-full bg-gold" />
            <h2 className="text-base font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              {feature.body}
            </p>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">{text.home.howToTitle}</h2>
        <ol className="mt-3 grid gap-2 text-sm leading-relaxed text-ink/65 sm:grid-cols-2">
          {text.home.howToSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
