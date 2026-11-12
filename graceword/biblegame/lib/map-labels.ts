import type { Locale } from "./i18n/config";

export type MapLabelKind = "sea" | "river" | "region";

export interface MapLabelBase {
  id: string;
  lat: number;
  lng: number;
  kind: MapLabelKind;
  minZoom: number;
}

export interface MapLabel extends MapLabelBase {
  name: string;
}

/**
 * Language-neutral map label positions. The visible names live in the
 * locale dictionaries below; city names are deliberately omitted so the
 * map does not give away the answer.
 */
export const MAP_LABEL_BASES: MapLabelBase[] = [
  // Seas
  { id: "mediterranean", lat: 34.5, lng: 18.0, kind: "sea", minZoom: 3 },
  { id: "aegean", lat: 38.2, lng: 25.3, kind: "sea", minZoom: 4 },
  { id: "black_sea", lat: 43.0, lng: 34.5, kind: "sea", minZoom: 4 },
  { id: "red_sea", lat: 22.0, lng: 38.0, kind: "sea", minZoom: 4 },
  { id: "sea_of_galilee", lat: 32.82, lng: 35.59, kind: "sea", minZoom: 5 },
  { id: "dead_sea", lat: 31.5, lng: 35.5, kind: "sea", minZoom: 5 },

  // River
  { id: "jordan", lat: 32.0, lng: 35.65, kind: "river", minZoom: 8 },

  // Neighbouring regions
  { id: "italy", lat: 42.8, lng: 12.8, kind: "region", minZoom: 4 },
  { id: "greece", lat: 39.6, lng: 21.8, kind: "region", minZoom: 4 },
  { id: "asia_minor", lat: 39.2, lng: 33.5, kind: "region", minZoom: 4 },
  { id: "syria", lat: 34.8, lng: 38.2, kind: "region", minZoom: 4 },
  { id: "egypt", lat: 27.0, lng: 30.0, kind: "region", minZoom: 4 },
  { id: "cyprus", lat: 35.1, lng: 33.2, kind: "region", minZoom: 4 },
  { id: "crete", lat: 35.2, lng: 24.9, kind: "region", minZoom: 4 },

  // Biblical regions
  { id: "galilee", lat: 33.2, lng: 34.7, kind: "region", minZoom: 6 },
  { id: "samaria", lat: 32.2, lng: 34.8, kind: "region", minZoom: 7 },
  { id: "judea", lat: 31.6, lng: 34.8, kind: "region", minZoom: 7 },
];

const LABEL_NAMES: Record<Locale, Record<string, string>> = {
  "zh-Hant": {
    mediterranean: "地中海",
    aegean: "愛琴海",
    black_sea: "黑海",
    red_sea: "紅海",
    sea_of_galilee: "加利利海",
    dead_sea: "死海",
    jordan: "約旦河",
    italy: "義大利",
    greece: "希臘",
    asia_minor: "小亞細亞",
    syria: "敘利亞",
    egypt: "埃及",
    cyprus: "賽普勒斯",
    crete: "克里特",
    galilee: "加利利",
    samaria: "撒馬利亞",
    judea: "猶太",
  },
  en: {
    mediterranean: "Mediterranean",
    aegean: "Aegean Sea",
    black_sea: "Black Sea",
    red_sea: "Red Sea",
    sea_of_galilee: "Sea of Galilee",
    dead_sea: "Dead Sea",
    jordan: "Jordan River",
    italy: "Italy",
    greece: "Greece",
    asia_minor: "Asia Minor",
    syria: "Syria",
    egypt: "Egypt",
    cyprus: "Cyprus",
    crete: "Crete",
    galilee: "Galilee",
    samaria: "Samaria",
    judea: "Judea",
  },
};

export function getMapLabels(locale: Locale): MapLabel[] {
  return MAP_LABEL_BASES.map((base) => ({
    ...base,
    name: LABEL_NAMES[locale][base.id],
  }));
}

export function visibleMapLabels(
  zoom: number,
  labels: MapLabel[],
  hidden: string[] = [],
): MapLabel[] {
  return labels.filter(
    (label) => zoom >= label.minZoom && !hidden.includes(label.name),
  );
}
