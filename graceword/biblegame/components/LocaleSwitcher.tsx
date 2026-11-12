"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { swapLocalePath } from "@/lib/i18n/paths";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "zh-Hant" : "en";
  const href = swapLocalePath(pathname, target);

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      className="rounded-full border border-ink/15 px-2.5 py-1 text-xs font-medium transition hover:border-gold hover:text-gold"
    >
      {target === "en" ? "EN" : "中文"}
    </Link>
  );
}
