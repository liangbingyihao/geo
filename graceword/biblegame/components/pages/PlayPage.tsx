import { getQuestions, getStories, getUiText } from "@/data/i18n";
import type { Locale } from "@/lib/i18n/config";
import { getMapLabels } from "@/lib/map-labels";
import Game from "../Game";

export default function PlayPage({ locale }: { locale: Locale }) {
  return (
    <Game
      locale={locale}
      questions={getQuestions(locale)}
      stories={getStories(locale)}
      text={getUiText(locale)}
      labels={getMapLabels(locale)}
    />
  );
}
