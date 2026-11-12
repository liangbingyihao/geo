import type { Metadata } from "next";
import PlayPage from "@/components/pages/PlayPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = buildMetadata({
  locale: "zh-Hant",
  path: "/play/",
  title: text.meta.playTitle,
  description: text.meta.playDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <PlayPage locale="zh-Hant" />;
}
