import type { Metadata } from "next";
import { BASE_PATH } from "@/lib/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · BibleArt",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const base = BASE_PATH || "";

  return (
    <html lang="zh-Hant" dir="ltr">
      <body className="min-h-screen font-serif antialiased">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-5xl font-bold text-gold">404</p>
          <h1 className="text-xl font-semibold">
            找不到頁面
            <span lang="en" className="block text-base font-normal text-ink/60">
              Page not found
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-ink/60">
            這個頁面不存在。你可以回到首頁，或切換到英文版。
            <span lang="en" className="block">
              This page does not exist. Return home or switch to the English site.
            </span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`${base}/`}
              className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold/85"
            >
              回到首頁
            </a>
            <a
              href={`${base}/en/`}
              lang="en"
              hrefLang="en"
              className="rounded-xl border border-ink/15 px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              English home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
