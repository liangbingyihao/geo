import type { Metadata } from "next";
import { BASE_PATH, SITE_URL, type Locale } from "./i18n/config";
import { localePath } from "./i18n/paths";

const metadataBase = new URL(`${SITE_URL}${BASE_PATH || "/"}`);

const OG_IMAGE = "/og.jpg";

interface SeoInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  siteName: string;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: SeoInput): Metadata {
  const canonical = localePath(locale, path);
  const zhPath = localePath("zh-Hant", path);
  const enPath = localePath("en", path);

  return {
    metadataBase,
    title,
    description,
    applicationName: siteName,
    alternates: {
      canonical,
      languages: {
        "zh-Hant": zhPath,
        en: enPath,
        "x-default": zhPath,
      },
    },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "zh_TW",
      alternateLocale: locale === "en" ? ["zh_TW"] : ["en_US"],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/icon.svg",
      apple: "/apple-icon.png",
    },
  };
}
