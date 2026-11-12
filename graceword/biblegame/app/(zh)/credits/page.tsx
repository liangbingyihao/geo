import type { Metadata } from "next";
import CreditsPage from "@/components/pages/CreditsPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = buildMetadata({
  locale: "zh-Hant",
  path: "/credits/",
  title: text.meta.creditsTitle,
  description: text.meta.creditsDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <CreditsPage locale="zh-Hant" />;
}
