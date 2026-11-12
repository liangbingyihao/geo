import { describe, expect, it } from "vitest";
import { getQuestions } from "../data/i18n";
import { PLACE_INFO } from "../data/places";
import { QUESTIONS } from "../data/questions";
import { getMapLabels } from "../lib/map-labels";

describe("place information", () => {
  it("covers every question", () => {
    for (const question of QUESTIONS) {
      expect(PLACE_INFO[question.id], question.id).toBeDefined();
    }
  });

  it("uses a region that exists on the map in both languages", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      const regionIds = new Set(getMapLabels(locale).map((label) => label.id));
      for (const question of QUESTIONS) {
        const place = PLACE_INFO[question.id];
        expect(regionIds.has(place.regionId), `${locale} ${question.id}`).toBe(
          true,
        );
      }
    }
  });

  it("has modern names and geography notes in both languages", () => {
    for (const question of QUESTIONS) {
      const place = PLACE_INFO[question.id];
      for (const locale of ["zh-Hant", "en"] as const) {
        expect(place.modernName[locale].length, question.id).toBeGreaterThan(0);
        expect(place.geoNote[locale].length, question.id).toBeGreaterThan(0);
      }
    }
  });

  it("attaches region and modern name to localized questions", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      const labels = getMapLabels(locale);
      for (const question of getQuestions(locale)) {
        const place = PLACE_INFO[question.id];
        const region = labels.find((label) => label.id === place.regionId);
        expect(question.regionId, question.id).toBe(place.regionId);
        expect(question.regionName, question.id).toBe(region?.name);
        expect(question.modernName, question.id).toBe(
          place.modernName[locale],
        );
        expect(question.geoNote, question.id).toBe(place.geoNote[locale]);
      }
    }
  });
});
