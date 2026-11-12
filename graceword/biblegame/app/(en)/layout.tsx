import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";
import { getUiText } from "@/data/i18n";
import { buildMetadata } from "@/lib/seo";
import "../globals.css";
import "leaflet/dist/leaflet.css";

const text = getUiText("en");

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/",
  title: text.meta.homeTitle,
  description: text.meta.homeDescription,
  siteName: text.meta.siteName,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6efe1",
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen font-serif antialiased">
        <SiteShell locale="en">{children}</SiteShell>
      </body>
    </html>
  );
}
