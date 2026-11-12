import { getStories, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import ProgressDashboard from "../ProgressDashboard";

export default function ProgressPage({ locale }: { locale: Locale }) {
  const text = getUiText(locale);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.progress.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{text.progress.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/65">
          {text.progress.intro}
        </p>
      </header>
      <ProgressDashboard
        locale={locale}
        stories={getStories(locale)}
        text={text}
      />
    </div>
  );
}
