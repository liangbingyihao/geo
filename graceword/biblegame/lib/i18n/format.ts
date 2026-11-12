import type { Locale } from "./config";

export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

export function formatDailyDate(key: string, locale: Locale): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-TW", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function localeNumber(value: number, locale: Locale): string {
  return value.toLocaleString(locale === "en" ? "en-US" : "zh-Hant");
}
