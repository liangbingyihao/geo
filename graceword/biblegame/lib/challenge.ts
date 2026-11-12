export interface ChallengeData {
  ids: string[];
  score?: number;
}

interface ChallengePayload {
  v: 1;
  ids: string[];
  s?: number;
}

const MAX_QUESTIONS = 10;
const MAX_SCORE = 100000;
const ID_PATTERN = /^[a-z0-9_]+$/;

function toBase64Url(value: string): string {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padding = value.length % 4 ? "=".repeat(4 - (value.length % 4)) : "";
  return atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding);
}

function normalizeScore(score: unknown): number | undefined {
  if (typeof score !== "number" || !Number.isFinite(score)) return undefined;
  if (score < 0 || score > MAX_SCORE) return undefined;
  return Math.round(score);
}

export function encodeChallenge(ids: string[], score?: number): string {
  const unique = [...new Set(ids)].filter((id) => ID_PATTERN.test(id));
  const payload: ChallengePayload = {
    v: 1,
    ids: unique.slice(0, MAX_QUESTIONS),
  };
  const normalizedScore = normalizeScore(score);
  if (normalizedScore !== undefined) payload.s = normalizedScore;

  return toBase64Url(JSON.stringify(payload));
}

export function decodeChallenge(token: string): ChallengeData | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<ChallengePayload>;
    if (parsed.v !== 1 || !Array.isArray(parsed.ids)) return null;

    const ids = [
      ...new Set(
        parsed.ids.filter(
          (id): id is string =>
            typeof id === "string" && ID_PATTERN.test(id),
        ),
      ),
    ].slice(0, MAX_QUESTIONS);

    if (ids.length === 0) return null;

    return { ids, score: normalizeScore(parsed.s) };
  } catch {
    return null;
  }
}
