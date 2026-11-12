import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = buildMetadata({
  locale: "zh-Hant",
  path: "/",
  title: text.meta.homeTitle,
  description: text.meta.homeDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <HomePage locale="zh-Hant" />;
}
