import type { Metadata } from "next";
import PlacesPage from "@/components/pages/PlacesPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = {
  ...buildMetadata({
    locale: "zh-Hant",
    path: "/places/",
    title: text.meta.placesTitle,
    description: text.meta.placesDescription,
    siteName: text.meta.siteName,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PlacesPage locale="zh-Hant" />;
}
