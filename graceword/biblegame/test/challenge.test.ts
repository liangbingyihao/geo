import { describe, expect, it } from "vitest";
import { decodeChallenge, encodeChallenge } from "../lib/challenge";

describe("challenge tokens", () => {
  it("round-trips question ids", () => {
    const ids = ["cana", "storm", "feed5000", "walk_water", "last_supper"];
    expect(decodeChallenge(encodeChallenge(ids))).toEqual({ ids });
  });

  it("round-trips a sender score", () => {
    const ids = ["cana", "storm"];
    expect(decodeChallenge(encodeChallenge(ids, 42000))).toEqual({
      ids,
      score: 42000,
    });
  });

  it("rounds and ignores invalid scores", () => {
    const ids = ["cana"];
    expect(decodeChallenge(encodeChallenge(ids, 42000.6))?.score).toBe(42001);
    expect(decodeChallenge(encodeChallenge(ids, -1))?.score).toBeUndefined();
    expect(decodeChallenge(encodeChallenge(ids, 100001))?.score).toBeUndefined();
    expect(decodeChallenge(encodeChallenge(ids, NaN))?.score).toBeUndefined();
  });

  it("removes duplicates and invalid ids", () => {
    const ids = ["cana", "cana", "storm", "", "../evil", "feed5000"];
    expect(decodeChallenge(encodeChallenge(ids))).toEqual({
      ids: ["cana", "storm", "feed5000"],
    });
  });

  it("rejects malformed tokens", () => {
    expect(decodeChallenge("not-a-valid-token")).toBeNull();
    expect(decodeChallenge("")).toBeNull();
  });

  it("rejects a valid token with no ids", () => {
    expect(decodeChallenge(encodeChallenge(["bad id", ""]))).toBeNull();
  });
});
