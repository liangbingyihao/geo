import type { MetadataRoute } from "next";
import { BASE_PATH, SITE_URL } from "@/lib/i18n/config";

export const dynamic = "force-static";

const base = `${SITE_URL}${BASE_PATH}`;

const routes = [
  { zh: "/", en: "/en/", priority: 1 },
  { zh: "/play/", en: "/en/play/", priority: 0.8 },
  { zh: "/stories/", en: "/en/stories/", priority: 0.7 },
  { zh: "/credits/", en: "/en/credits/", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const languages = {
      "zh-Hant": `${base}${route.zh}`,
      en: `${base}${route.en}`,
      "x-default": `${base}${route.zh}`,
    };

    return [
      {
        url: `${base}${route.zh}`,
        changeFrequency: "daily" as const,
        priority: route.priority,
        alternates: { languages },
      },
      {
        url: `${base}${route.en}`,
        changeFrequency: "daily" as const,
        priority: route.priority,
        alternates: { languages },
      },
    ];
  });
}
