export type Era = "OT" | "NT" | "church";
export type Difficulty = 1 | 2 | 3;
export type GameMode = "zoom" | "painting";

export interface QuestionImage {
  src: string;
  title: string;
  artist: string;
  license: string;
  sourceUrl: string;
}

export interface ScriptureRef {
  book: string;
  chapter: number;
  verse: string;
}

export interface QuestionEvent {
  year: number;
  tolerance: number;
  placeName: string;
  lat: number;
  lng: number;
}

export interface Question {
  id: string;
  era: Era;
  difficulty: Difficulty;
  mode: GameMode;
  answer: string;
  options: string[];
  hints: string[];
  scripture: ScriptureRef;
  event: QuestionEvent;
  image: QuestionImage;
  summary: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapRoutePoint extends LatLng {
  label: string;
}

export interface VerseRef {
  ref: string;
  text: string;
}

export interface GameQuestion extends Question {
  artNote: string;
  verseHints: VerseRef[];
  keyVerse: VerseRef;
  storyId?: string;
  regionId?: string;
  regionName?: string;
  modernName?: string;
  geoNote?: string;
}

export interface QuestionResult {
  questionId: string;
  identifiedOnTry: number;
  yearGuess: number;
  guess: LatLng;
  yearPoints: number;
  distPoints: number;
  multiplier: number;
  total: number;
}

export interface ScoredResult extends QuestionResult {
  distanceKm: number;
}
