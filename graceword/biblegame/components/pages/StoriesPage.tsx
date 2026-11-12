import { getStories, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import StoryLibrary from "../StoryLibrary";

export default function StoriesPage({ locale }: { locale: Locale }) {
  const text = getUiText(locale);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.stories.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{text.stories.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/65">
          {text.stories.intro}
        </p>
      </header>
      <StoryLibrary
        locale={locale}
        stories={getStories(locale)}
        text={text}
      />
    </div>
  );
}
