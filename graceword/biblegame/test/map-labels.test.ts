import { describe, expect, it } from "vitest";
import {
  MAP_LABEL_BASES,
  getMapLabels,
  visibleMapLabels,
} from "../lib/map-labels";
import { QUESTIONS } from "../data/questions";
import { getQuestions } from "../data/i18n";

describe("map labels", () => {
  it("has unique names in each locale", () => {
    for (const locale of ["zh-Hant", "en"] as const) {
      const names = getMapLabels(locale).map((label) => label.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it("keeps every label inside the map region", () => {
    for (const label of MAP_LABEL_BASES) {
      expect(label.lat).toBeGreaterThanOrEqual(-90);
      expect(label.lat).toBeLessThanOrEqual(90);
      expect(label.lng).toBeGreaterThanOrEqual(-180);
      expect(label.lng).toBeLessThanOrEqual(180);
    }
  });

  it("uses sensible zoom thresholds", () => {
    for (const label of MAP_LABEL_BASES) {
      expect(label.minZoom).toBeGreaterThanOrEqual(3);
      expect(label.minZoom).toBeLessThanOrEqual(8);
    }
  });

  it("does not use a question answer as a label", () => {
    const answers = new Set([
      ...QUESTIONS.map((question) => question.answer),
      ...getQuestions("en").map((question) => question.answer),
    ]);
    for (const label of [
      ...getMapLabels("zh-Hant"),
      ...getMapLabels("en"),
    ]) {
      expect(answers.has(label.name)).toBe(false);
    }
  });

  it("filters by zoom level", () => {
    const labels = getMapLabels("zh-Hant");
    const lowZoom = visibleMapLabels(4, labels).map((label) => label.name);
    const midZoom = visibleMapLabels(6, labels).map((label) => label.name);
    const highZoom = visibleMapLabels(7, labels).map((label) => label.name);
    const topZoom = visibleMapLabels(8, labels).map((label) => label.name);
    expect(lowZoom).toContain("地中海");
    expect(lowZoom).not.toContain("加利利海");
    expect(midZoom).toContain("加利利海");
    expect(midZoom).not.toContain("猶太");
    expect(highZoom).toContain("猶太");
    expect(highZoom).not.toContain("約旦河");
    expect(topZoom).toContain("約旦河");
  });

  it("hides labels that would spoil the current answer", () => {
    const zhLabels = getMapLabels("zh-Hant");
    const zhNames = visibleMapLabels(6, zhLabels, [
      "加利利海",
      "約旦河",
    ]).map((label) => label.name);
    expect(zhNames).not.toContain("加利利海");
    expect(zhNames).not.toContain("約旦河");
    expect(zhNames).toContain("死海");

    const enLabels = getMapLabels("en");
    const enNames = visibleMapLabels(6, enLabels, ["Sea of Galilee"]).map(
      (label) => label.name,
    );
    expect(enNames).not.toContain("Sea of Galilee");
    expect(enNames).toContain("Dead Sea");
  });
});
