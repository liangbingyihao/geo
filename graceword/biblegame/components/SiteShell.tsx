import type { ReactNode } from "react";
import { getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import Analytics from "./Analytics";
import LocaleLink from "./LocaleLink";
import LocaleSwitcher from "./LocaleSwitcher";

interface SiteShellProps {
  locale: Locale;
  children: ReactNode;
}

export default function SiteShell({ locale, children }: SiteShellProps) {
  const text = getUiText(locale);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-parchment/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <LocaleLink locale={locale} href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
              ✝
            </span>
            <span className="text-lg font-semibold tracking-wide">
              {text.brand}
              <span className="ml-2 hidden text-xs font-normal tracking-[0.2em] text-ink/40 sm:inline">
                {text.brandSub}
              </span>
            </span>
          </LocaleLink>
          <nav className="flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
            <LocaleLink locale={locale} href="/play/" className="hover:text-gold">
              {text.navDaily}
            </LocaleLink>
            <LocaleLink
              locale={locale}
              href="/stories/"
              className="hover:text-gold"
            >
              {text.navStories}
            </LocaleLink>
            <LocaleLink
              locale={locale}
              href="/progress/"
              className="hover:text-gold"
            >
              {text.navProgress}
            </LocaleLink>
            <LocaleSwitcher locale={locale} />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs leading-relaxed text-ink/50">
        <p>{text.footerFree}</p>
        <p>{text.footerScripture}</p>
        <p className="mt-2 space-x-2">
          <LocaleLink
            locale={locale}
            href="/credits/"
            className="underline decoration-dotted underline-offset-2 hover:text-gold"
          >
            {text.navCredits}
          </LocaleLink>
          <span aria-hidden="true">·</span>
          <LocaleLink
            locale={locale}
            href="/places/"
            className="underline decoration-dotted underline-offset-2 hover:text-gold"
          >
            {text.places.studyLink}
          </LocaleLink>
        </p>
      </footer>

      <Analytics locale={locale} />
    </>
  );
}
