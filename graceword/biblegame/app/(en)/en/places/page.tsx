import type { Metadata } from "next";
import PlacesPage from "@/components/pages/PlacesPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("en");

export const metadata: Metadata = {
  ...buildMetadata({
    locale: "en",
    path: "/places/",
    title: text.meta.placesTitle,
    description: text.meta.placesDescription,
    siteName: text.meta.siteName,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PlacesPage locale="en" />;
}
