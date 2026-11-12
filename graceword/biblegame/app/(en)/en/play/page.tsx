import type { Metadata } from "next";
import PlayPage from "@/components/pages/PlayPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("en");

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/play/",
  title: text.meta.playTitle,
  description: text.meta.playDescription,
  siteName: text.meta.siteName,
});

export default function Page() {
  return <PlayPage locale="en" />;
}
