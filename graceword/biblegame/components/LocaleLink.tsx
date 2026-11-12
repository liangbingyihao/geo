import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";

interface LocaleLinkProps {
  locale: Locale;
  href: string;
  className?: string;
  children: ReactNode;
}

export default function LocaleLink({
  locale,
  href,
  className,
  children,
}: LocaleLinkProps) {
  return (
    <Link href={localePath(locale, href)} className={className}>
      {children}
    </Link>
  );
}
