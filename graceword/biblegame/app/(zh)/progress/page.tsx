import type { Metadata } from "next";
import ProgressPage from "@/components/pages/ProgressPage";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";

const text = getUiText("zh-Hant");

export const metadata: Metadata = {
  ...buildMetadata({
    locale: "zh-Hant",
    path: "/progress/",
    title: text.meta.progressTitle,
    description: text.meta.progressDescription,
    siteName: text.meta.siteName,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ProgressPage locale="zh-Hant" />;
}
