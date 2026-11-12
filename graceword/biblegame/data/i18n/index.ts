import type { Locale } from "@/lib/i18n/config";
import type { UiText } from "@/lib/i18n/types";
import type { GameQuestion, Question, VerseRef } from "@/lib/types";
import { getMapLabels } from "@/lib/map-labels";
import { BOOK_NAMES } from "../books";
import { PLACE_INFO } from "../places";
import { QUESTIONS } from "../questions";
import { QUESTION_STORY, STORIES, type LocalizedStory } from "../stories";
import verses from "../verses.json";
import { ART_NOTES } from "./art-notes";
import { UI_TEXT as EN_UI } from "./en";
import { EN_QUESTION_TEXT } from "./en/questions";
import { STORY_TEXT } from "./stories";
import { UI_TEXT as ZH_UI } from "./zh-Hant";

interface VerseEntry {
  hint: Record<Locale, VerseRef>;
  key: Record<Locale, VerseRef>;
}

const VERSE_DATA = verses as unknown as Record<string, VerseEntry>;

export function getUiText(locale: Locale): UiText {
  return locale === "en" ? EN_UI : ZH_UI;
}

function localizeQuestion(question: Question, locale: Locale): Question {
  if (locale === "zh-Hant") return question;
  const text = EN_QUESTION_TEXT[question.id];
  if (!text) return question;

  return {
    ...question,
    answer: text.answer,
    options: text.options,
    hints: text.hints,
    summary: text.summary,
    event: { ...question.event, placeName: text.placeName },
    image: { ...question.image, title: text.imageTitle },
    scripture: {
      ...question.scripture,
      book: BOOK_NAMES[question.scripture.book] ?? question.scripture.book,
    },
  };
}

export function getQuestions(locale: Locale): GameQuestion[] {
  const labels = getMapLabels(locale);

  return QUESTIONS.map((question) => {
    const localized = localizeQuestion(question, locale);
    const verse = VERSE_DATA[question.id];
    const place = PLACE_INFO[question.id];
    const region = place
      ? labels.find((label) => label.id === place.regionId)
      : undefined;

    return {
      ...localized,
      artNote: ART_NOTES[locale][question.id] ?? "",
      verseHints: verse ? [verse.hint[locale]] : [],
      keyVerse: verse?.key[locale] ?? { ref: "", text: "" },
      storyId: QUESTION_STORY[question.id],
      regionId: place?.regionId,
      regionName: region?.name,
      modernName: place?.modernName[locale],
      geoNote: place?.geoNote[locale],
    };
  });
}

export function getStories(locale: Locale): LocalizedStory[] {
  return STORIES.map((story) => ({
    ...story,
    ...STORY_TEXT[locale][story.id],
  }));
}
