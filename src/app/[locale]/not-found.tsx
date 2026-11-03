import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-50 px-4 text-center">
      <p className="text-4xl text-stone-400">॥</p>
      <h1 className="text-xl font-semibold text-stone-900">{t("title")}</h1>
      <p className="text-sm text-stone-500">{t("text")}</p>
      <Link href="/" className="text-sm font-medium text-orange-700 underline">
        {t("home")}
      </Link>
    </main>
  );
}
