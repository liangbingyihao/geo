import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../data/questions";

describe("question bank integrity", () => {
  it("has unique ids", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least 20 questions", () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(20);
  });

  it.each(QUESTIONS.map((q) => [q.id, q] as const))(
    "%s has four unique options that include the answer",
    (_id, q) => {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.answer);
    },
  );

  it.each(QUESTIONS.map((q) => [q.id, q] as const))(
    "%s has three hints and a valid scripture reference",
    (_id, q) => {
      expect(q.hints.length).toBeGreaterThanOrEqual(3);
      expect(q.scripture.book.length).toBeGreaterThan(0);
      expect(q.scripture.chapter).toBeGreaterThan(0);
      expect(q.scripture.verse.length).toBeGreaterThan(0);
    },
  );

  it.each(QUESTIONS.map((q) => [q.id, q] as const))(
    "%s has a year inside the slider range and a valid location",
    (_id, q) => {
      expect(q.event.year).toBeGreaterThanOrEqual(-10);
      expect(q.event.year).toBeLessThanOrEqual(100);
      expect(q.event.tolerance).toBeGreaterThan(0);
      expect(q.event.lat).toBeGreaterThanOrEqual(-90);
      expect(q.event.lat).toBeLessThanOrEqual(90);
      expect(q.event.lng).toBeGreaterThanOrEqual(-180);
      expect(q.event.lng).toBeLessThanOrEqual(180);
    },
  );

  it.each(QUESTIONS.map((q) => [q.id, q] as const))(
    "%s has an image file on disk",
    (_id, q) => {
      const file = path.join(process.cwd(), "public", q.image.src);
      expect(fs.existsSync(file)).toBe(true);
      expect(q.image.artist.length).toBeGreaterThan(0);
      expect(q.image.sourceUrl).toMatch(/^https:\/\//);
    },
  );
});
