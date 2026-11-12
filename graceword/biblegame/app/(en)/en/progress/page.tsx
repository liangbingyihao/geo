import type { Metadata } from "next";
import ProgressPage from "@/components/pages/ProgressPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("en");

export const metadata: Metadata = {
  ...buildMetadata({
    locale: "en",
    path: "/progress/",
    title: text.meta.progressTitle,
    description: text.meta.progressDescription,
    siteName: text.meta.siteName,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ProgressPage locale="en" />;
}
