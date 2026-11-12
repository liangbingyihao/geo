import type { Locale } from "@/lib/i18n/config";
import type { StoryEra, StoryTheme } from "../stories";

export type StoryThemeGroup =
  | "birth-people"
  | "miracle"
  | "teaching"
  | "passion-resurrection"
  | "mission-spirit";

export const THEME_GROUPS: {
  id: StoryThemeGroup;
  themes: StoryTheme[];
}[] = [
  { id: "birth-people", themes: ["birth", "people"] },
  { id: "miracle", themes: ["miracle"] },
  { id: "teaching", themes: ["parable", "teaching"] },
  { id: "passion-resurrection", themes: ["passion", "resurrection"] },
  { id: "mission-spirit", themes: ["mission", "holy-spirit"] },
];

export function themeGroupForTheme(theme: StoryTheme): StoryThemeGroup {
  return (
    THEME_GROUPS.find((group) => group.themes.includes(theme))?.id ??
    "birth-people"
  );
}

const ERA_LABELS: Record<Locale, Record<StoryEra, string>> = {
  "zh-Hant": {
    nt: "新約",
    "early-church": "初代教會",
    ot: "舊約",
    "church-history": "教會歷史",
  },
  en: {
    nt: "New Testament",
    "early-church": "Early Church",
    ot: "Old Testament",
    "church-history": "Church History",
  },
};

const THEME_LABELS: Record<Locale, Record<StoryTheme, string>> = {
  "zh-Hant": {
    birth: "降生",
    people: "人物",
    miracle: "神蹟",
    parable: "比喻",
    teaching: "教導",
    passion: "受難",
    resurrection: "復活",
    mission: "宣教",
    "holy-spirit": "聖靈",
  },
  en: {
    birth: "Birth",
    people: "People",
    miracle: "Miracles",
    parable: "Parables",
    teaching: "Teaching",
    passion: "Passion",
    resurrection: "Resurrection",
    mission: "Mission",
    "holy-spirit": "Holy Spirit",
  },
};

const THEME_GROUP_LABELS: Record<Locale, Record<StoryThemeGroup, string>> = {
  "zh-Hant": {
    "birth-people": "降生與人物",
    miracle: "神蹟",
    teaching: "比喻與教導",
    "passion-resurrection": "受難與復活",
    "mission-spirit": "宣教與聖靈",
  },
  en: {
    "birth-people": "Birth & People",
    miracle: "Miracles",
    teaching: "Parables & Teaching",
    "passion-resurrection": "Passion & Resurrection",
    "mission-spirit": "Mission & Spirit",
  },
};

export function getStoryEraLabels(
  locale: Locale,
): Record<StoryEra, string> {
  return ERA_LABELS[locale];
}

export function getStoryThemeLabels(
  locale: Locale,
): Record<StoryTheme, string> {
  return THEME_LABELS[locale];
}

export function getStoryThemeGroupLabels(
  locale: Locale,
): Record<StoryThemeGroup, string> {
  return THEME_GROUP_LABELS[locale];
}
