export type Locale = "zh-Hant" | "en";

export const LOCALES: Locale[] = ["zh-Hant", "en"];
export const DEFAULT_LOCALE: Locale = "zh-Hant";

/** All locales share one daily puzzle, so there is a single canonical timezone. */
export const DAILY_TIME_ZONE = "UTC";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://test.grace-word.com"
).replace(/\/+$/, "");

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
