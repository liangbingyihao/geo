import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const GEO_DIR = path.join(process.cwd(), "public", "geo");
const FILES = ["land.json", "lakes.json", "rivers.json"];

describe("map GeoJSON data", () => {
  it.each(FILES)("%s exists", (file) => {
    expect(fs.existsSync(path.join(GEO_DIR, file))).toBe(true);
  });

  it.each(FILES)("%s is a non-empty FeatureCollection", (file) => {
    const raw = fs.readFileSync(path.join(GEO_DIR, file), "utf8");
    const data = JSON.parse(raw) as {
      type?: string;
      features?: unknown[];
    };
    expect(data.type).toBe("FeatureCollection");
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features?.length ?? 0).toBeGreaterThan(0);
  });

  it("keeps the bundled map data small enough for mobile", () => {
    const total = FILES.reduce(
      (sum, file) => sum + fs.statSync(path.join(GEO_DIR, file)).size,
      0,
    );
    expect(total).toBeLessThan(600 * 1024);
  });
});
