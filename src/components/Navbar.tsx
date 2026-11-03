"use client";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const opts = [
    { locale: "en" as const, label: "EN" },
    { locale: "hi" as const, label: "हिं" },
  ];
  return (
    <div
      className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5"
      title={t("language")}
    >
      {opts.map((o) => (
        <Link
          key={o.locale}
          href={pathname}
          locale={o.locale}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100",
            compact && "px-2",
          )}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Heart size={18} className="text-orange-600" fill="currentColor" />
          <span className="font-bold text-stone-900">{t("brand")}</span>
          <span className="text-xs text-stone-400">{t("brandHi")}</span>
        </Link>
        <nav className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/create"
            className="rounded-lg bg-orange-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            {t("create")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
