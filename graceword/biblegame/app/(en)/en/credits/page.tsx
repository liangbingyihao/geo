import type { Metadata } from "next";
import CreditsPage from "@/components/pages/CreditsPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("en");

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/credits/",
  title: text.meta.creditsTitle,
  description: text.meta.creditsDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <CreditsPage locale="en" />;
}
