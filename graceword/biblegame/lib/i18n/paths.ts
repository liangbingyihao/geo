import { BASE_PATH, SITE_URL, type Locale } from "./config";

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return normalized === "/" ? "/en/" : `/en${normalized}`;
  }
  return normalized;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${BASE_PATH}${path}`;
}

export function swapLocalePath(pathname: string, target: Locale): string {
  let path = pathname || "/";

  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length) || "/";
  }

  if (path === "/en" || path.startsWith("/en/")) {
    path = path.slice(3) || "/";
  }

  return localePath(target, path);
}
