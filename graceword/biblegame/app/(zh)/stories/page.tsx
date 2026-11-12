import type { Metadata } from "next";
import StoriesPage from "@/components/pages/StoriesPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = buildMetadata({
  locale: "zh-Hant",
  path: "/stories/",
  title: text.meta.storiesTitle,
  description: text.meta.storiesDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <StoriesPage locale="zh-Hant" />;
}
