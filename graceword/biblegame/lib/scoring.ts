import type { Locale } from "./i18n/config";
import type { LatLng, Question, QuestionResult } from "./types";

export const MAX_AXIS = 5000;
export const MAX_QUESTION = MAX_AXIS * 2;
export const DEFAULT_MAX_DISTANCE_KM = 1500;

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function distanceScore(
  distanceKm: number,
  maxKm: number = DEFAULT_MAX_DISTANCE_KM,
): number {
  if (maxKm <= 0) return 0;
  return Math.round(MAX_AXIS * clamp01(1 - distanceKm / maxKm));
}

export function yearScore(
  guess: number,
  actual: number,
  tolerance: number,
): number {
  if (tolerance <= 0) return guess === actual ? MAX_AXIS : 0;
  const diff = Math.abs(guess - actual);
  const grace = tolerance * 0.2;
  if (diff <= grace) return MAX_AXIS;
  return Math.round(MAX_AXIS * clamp01(1 - (diff - grace) / (tolerance - grace)));
}

export function identificationMultiplier(wrongCount: number): number {
  return Math.max(0.4, 1 - 0.2 * wrongCount);
}

export interface ScoreInput {
  question: Question;
  yearGuess: number;
  guess: LatLng;
  wrongCount: number;
}

export function scoreQuestion({
  question,
  yearGuess,
  guess,
  wrongCount,
}: ScoreInput): QuestionResult & { distanceKm: number } {
  const distanceKm = haversineKm(guess, {
    lat: question.event.lat,
    lng: question.event.lng,
  });
  const multiplier = identificationMultiplier(wrongCount);
  const yearPoints = Math.round(
    yearScore(yearGuess, question.event.year, question.event.tolerance) * multiplier,
  );
  const distPoints = Math.round(distanceScore(distanceKm) * multiplier);

  return {
    questionId: question.id,
    identifiedOnTry: wrongCount + 1,
    yearGuess,
    guess,
    yearPoints,
    distPoints,
    multiplier,
    total: yearPoints + distPoints,
    distanceKm,
  };
}

export function formatYear(
  year: number,
  locale: Locale = "zh-Hant",
): string {
  if (locale === "en") {
    return year < 0 ? `${Math.abs(year)} BC` : `AD ${year}`;
  }
  if (year < 0) return `公元前 ${Math.abs(year)} 年`;
  return `公元 ${year} 年`;
}

export function scoreTier(
  total: number,
  locale: Locale = "zh-Hant",
): { label: string; note: string } {
  if (locale === "en") {
    if (total >= 45000)
      return {
        label: "Scripture Master",
        note: "You know the geography and dates of the Bible inside out.",
      };
    if (total >= 35000)
      return {
        label: "Well Read",
        note: "A strong result — a little more reading will make it perfect.",
      };
    if (total >= 25000)
      return {
        label: "Diligent Disciple",
        note: "You know many of the stories. Keep going.",
      };
    if (total >= 12000)
      return {
        label: "Seeker",
        note: "The paintings and stories are worth another look.",
      };
    return {
      label: "Just Starting",
      note: "Read the verses on the result screen and come back tomorrow.",
    };
  }

  if (total >= 45000) return { label: "經文大師", note: "你對聖經地理與年代暸如指掌。" };
  if (total >= 35000) return { label: "熟讀聖經", note: "表現出色，再細讀幾段就更完美。" };
  if (total >= 25000) return { label: "勤奮門徒", note: "已經掌握不少故事，繼續加油。" };
  if (total >= 12000) return { label: "初信慕道", note: "名畫與故事都值得再細細品味。" };
  return { label: "剛起步", note: "看完結算頁的經文，明天再來一趟。" };
}
