import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAX_DISTANCE_KM,
  MAX_AXIS,
  distanceScore,
  formatYear,
  haversineKm,
  identificationMultiplier,
  scoreQuestion,
  yearScore,
} from "../lib/scoring";
import type { Question } from "../lib/types";

const question: Question = {
  id: "test",
  era: "NT",
  difficulty: 1,
  mode: "zoom",
  answer: "測試事件",
  options: ["測試事件", "甲", "乙", "丙"],
  hints: ["提示一", "提示二", "提示三"],
  scripture: { book: "約翰福音", chapter: 1, verse: "1" },
  event: {
    year: 30,
    tolerance: 10,
    placeName: "耶路撒冷",
    lat: 31.7784,
    lng: 35.2298,
  },
  image: {
    src: "/images/test.jpg",
    title: "測試",
    artist: "未知",
    license: "Public domain",
    sourceUrl: "https://example.com",
  },
  summary: "測試用題目。",
};

describe("haversineKm", () => {
  it("returns 0 for the same point", () => {
    expect(haversineKm({ lat: 31.7, lng: 35.2 }, { lat: 31.7, lng: 35.2 })).toBe(0);
  });

  it("is roughly symmetric", () => {
    const a = { lat: 31.7, lng: 35.2 };
    const b = { lat: 37.97, lng: 23.72 };
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 5);
  });

  it("matches a known distance (Jerusalem to Athens ~1250km)", () => {
    const km = haversineKm(
      { lat: 31.7784, lng: 35.2298 },
      { lat: 37.9715, lng: 23.7267 },
    );
    expect(km).toBeGreaterThan(1150);
    expect(km).toBeLessThan(1350);
  });
});

describe("distanceScore", () => {
  it("gives full marks at distance 0", () => {
    expect(distanceScore(0)).toBe(MAX_AXIS);
  });

  it("gives zero at or beyond the max distance", () => {
    expect(distanceScore(DEFAULT_MAX_DISTANCE_KM)).toBe(0);
    expect(distanceScore(DEFAULT_MAX_DISTANCE_KM * 2)).toBe(0);
  });

  it("gives half at half the max distance", () => {
    expect(distanceScore(DEFAULT_MAX_DISTANCE_KM / 2)).toBe(MAX_AXIS / 2);
  });
});

describe("yearScore", () => {
  it("gives full marks inside the grace window", () => {
    expect(yearScore(30, 30, 10)).toBe(MAX_AXIS);
    expect(yearScore(31, 30, 10)).toBe(MAX_AXIS);
  });

  it("gives zero at the tolerance boundary and beyond", () => {
    expect(yearScore(40, 30, 10)).toBe(0);
    expect(yearScore(50, 30, 10)).toBe(0);
  });

  it("decreases as the guess gets further away", () => {
    const near = yearScore(34, 30, 10);
    const far = yearScore(38, 30, 10);
    expect(near).toBeGreaterThan(far);
    expect(far).toBeGreaterThanOrEqual(0);
  });
});

describe("identificationMultiplier", () => {
  it("keeps full score on the first try", () => {
    expect(identificationMultiplier(0)).toBe(1);
  });

  it("decays but never drops below 0.4", () => {
    expect(identificationMultiplier(1)).toBe(0.8);
    expect(identificationMultiplier(2)).toBe(0.6);
    expect(identificationMultiplier(3)).toBe(0.4);
    expect(identificationMultiplier(10)).toBe(0.4);
  });
});

describe("scoreQuestion", () => {
  it("gives a perfect score for an exact answer", () => {
    const result = scoreQuestion({
      question,
      yearGuess: 30,
      guess: { lat: 31.7784, lng: 35.2298 },
      wrongCount: 0,
    });
    expect(result.yearPoints).toBe(MAX_AXIS);
    expect(result.distPoints).toBe(MAX_AXIS);
    expect(result.total).toBe(MAX_AXIS * 2);
    expect(result.distanceKm).toBe(0);
  });

  it("penalises wrong identifications", () => {
    const exact = scoreQuestion({
      question,
      yearGuess: 30,
      guess: { lat: 31.7784, lng: 35.2298 },
      wrongCount: 0,
    });
    const penalised = scoreQuestion({
      question,
      yearGuess: 30,
      guess: { lat: 31.7784, lng: 35.2298 },
      wrongCount: 2,
    });
    expect(penalised.total).toBeLessThan(exact.total);
    expect(penalised.multiplier).toBe(0.6);
  });

  it("combines year and distance scores", () => {
    const result = scoreQuestion({
      question,
      yearGuess: 30,
      guess: { lat: 51.5, lng: -0.12 },
      wrongCount: 0,
    });
    expect(result.yearPoints).toBe(MAX_AXIS);
    expect(result.distPoints).toBe(0);
    expect(result.total).toBe(MAX_AXIS);
  });
});

describe("formatYear", () => {
  it("formats BC and AD years", () => {
    expect(formatYear(-5)).toBe("公元前 5 年");
    expect(formatYear(30)).toBe("公元 30 年");
  });
});
