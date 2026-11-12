export type StoryId =
  | "birth"
  | "early-ministry"
  | "galilee"
  | "passion"
  | "resurrection"
  | "early-church";

export type StoryEra = "nt" | "early-church" | "ot" | "church-history";

export type StoryTheme =
  | "birth"
  | "people"
  | "miracle"
  | "parable"
  | "teaching"
  | "passion"
  | "resurrection"
  | "mission"
  | "holy-spirit";

export interface Story {
  id: StoryId;
  questionIds: string[];
  era: StoryEra;
  themes: StoryTheme[];
  order: number;
  anchorQuestionId: string;
}

export interface LocalizedStory extends Story {
  title: string;
  intro: string;
  outro: string;
}

export const STORIES: Story[] = [
  {
    id: "birth",
    questionIds: [
      "annunciation",
      "visitation",
      "nativity",
      "magi",
      "flight_egypt",
    ],
    era: "nt",
    themes: ["birth", "people"],
    order: 1,
    anchorQuestionId: "nativity",
  },
  {
    id: "early-ministry",
    questionIds: [
      "baptism",
      "temptation",
      "cana",
      "calling_peter",
      "calling_matthew",
    ],
    era: "nt",
    themes: ["miracle", "people"],
    order: 2,
    anchorQuestionId: "baptism",
  },
  {
    id: "galilee",
    questionIds: [
      "sermon",
      "good_samaritan",
      "storm",
      "feed5000",
      "walk_water",
    ],
    era: "nt",
    themes: ["miracle", "parable", "teaching"],
    order: 3,
    anchorQuestionId: "sermon",
  },
  {
    id: "passion",
    questionIds: [
      "blind",
      "lazarus",
      "last_supper",
      "gethsemane",
      "crucifixion",
    ],
    era: "nt",
    themes: ["passion", "miracle"],
    order: 4,
    anchorQuestionId: "crucifixion",
  },
  {
    id: "resurrection",
    questionIds: [
      "resurrection",
      "thomas",
      "emmaus",
      "peter_commission",
      "ascension",
    ],
    era: "nt",
    themes: ["resurrection", "mission"],
    order: 5,
    anchorQuestionId: "resurrection",
  },
  {
    id: "early-church",
    questionIds: [
      "pentecost",
      "peter_prison",
      "saul",
      "athens",
      "patmos",
    ],
    era: "early-church",
    themes: ["mission", "holy-spirit"],
    order: 6,
    anchorQuestionId: "pentecost",
  },
];

export const STORIES_BY_ID = new Map(STORIES.map((story) => [story.id, story]));

export const QUESTION_STORY: Record<string, StoryId> = Object.fromEntries(
  STORIES.flatMap((story) =>
    story.questionIds.map((questionId) => [questionId, story.id]),
  ),
);
