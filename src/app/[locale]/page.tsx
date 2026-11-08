import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Heart,
  Languages,
  Lock,
  Palette,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import { TEMPLATE_IDS } from "@/lib/biodata";

const TEMPLATE_CARD: Record<string, string> = {
  traditional: "border-[#b45309] bg-[#fffdf5]",
  royal: "border-[#fbbf24] bg-[#6d0f2b] text-amber-100",
  modern: "border-teal-600 bg-white",
  floral: "border-pink-400 bg-[#fff9f4]",
  emerald: "border-emerald-200 bg-[#065f46] text-emerald-50",
  mandala: "border-amber-600 bg-[#fdf8ee]",
  peacock: "border-teal-700 bg-[#f7fbf9]",
  jharokha: "border-[#7f1d1d] bg-[#faf3e3]",
  toran: "border-amber-500 bg-[#fffdf4]",
  banarasi: "border-violet-900 bg-[#fdfbf5]",
  kalash: "border-red-700 bg-[#fffaf2]",
  navy: "border-blue-900 bg-white",
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tt = await getTranslations("templates");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #ea580c 0, transparent 40%), radial-gradient(circle at 80% 70%, #9f1239 0, transparent 40%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-16 sm:pt-20 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="mb-4 inline-block rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {t("badge")}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-stone-600 sm:text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 hover:shadow-lg"
              >
                {t("cta")} <ArrowRight size={17} />
              </Link>
              <Link
                href="#templates"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-700 hover:bg-stone-50"
              >
                {t("viewTemplates")}
              </Link>
            </div>
            <p className="mt-6 text-xl text-stone-400">॥ श्री गणेशाय नमः ॥</p>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-3 rotate-2 rounded-2xl bg-gradient-to-br from-saffron-200 to-maroon-700/20 opacity-60"
            />
            <HeroBiodata t={t} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            {t("howTitle")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { icon: ScrollText, title: t("step1Title"), text: t("step1Text") },
              { icon: Palette, title: t("step2Title"), text: t("step2Text") },
              { icon: FileText, title: t("step3Title"), text: t("step3Text") },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <s.icon size={22} />
                </div>
                <h3 className="font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-stone-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates strip */}
      <section id="templates" className="py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            {t("templatesTitle")}
          </h2>
          <p className="mt-2 text-center text-stone-600">
            {t("templatesSubtitle")}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TEMPLATE_IDS.map((id) => (
              <div
                key={id}
                className={`w-40 shrink-0 snap-start rounded-xl border-2 p-3 text-center text-sm font-semibold shadow-sm ${TEMPLATE_CARD[id]}`}
              >
                <div className="mx-auto mb-2 h-16 w-12 rounded border border-current opacity-40" />
                {tt(id)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            {t("featuresTitle")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Languages, title: t("feature1Title"), text: t("feature1Text") },
              { icon: Sparkles, title: t("feature2Title"), text: t("feature2Text") },
              { icon: FileText, title: t("feature3Title"), text: t("feature3Text") },
              { icon: Heart, title: t("feature4Title"), text: t("feature4Text") },
            ].map((f, i) => (
              <div key={i}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy + CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-stone-900">{t("whyTitle")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["why1", "why2", "why3"].map((k) => (
              <div key={k} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-stone-800">{t(`${k}Title`)}</p>
                <p className="mt-1 text-sm text-stone-600">{t(`${k}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="templates" className="py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Lock size={22} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            {t("privacyTitle")}
          </h2>
          <p className="mt-2 text-stone-600">{t("privacyText")}</p>
          <Link
            href="/create"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            {t("cta")} <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center">
          <p className="text-sm text-stone-500">{t("footerTagline")}</p>
          <a
            href="https://github.com/nkunal1992/biodata-app"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} /> {t("footerSource")}
          </a>
        </div>
      </footer>
    </div>
  );
}


/** Stylized mini-biodata card for the hero — pure JSX, no raster assets. */
function HeroBiodata({ t }: { t: (k: string) => string }) {
  const rows: [string, string][] = [
    [t("mockName"), "Aarav Sharma"],
    [t("mockDob"), "15 March 1995"],
    [t("mockGotra"), "Kaushik"],
    [t("mockEdu"), "B.Tech, IIT Delhi"],
    [t("mockOcc"), "Senior Software Engineer"],
    [t("mockFam"), "Sharma Parivar, Jaipur"],
  ];
  return (
    <div className="relative rounded-xl border-2 border-maroon-700/80 bg-[#fffdf6] p-1.5 shadow-warm-md">
      <div className="rounded-lg border border-saffron-500/50 px-6 py-8">
        <p className="text-center text-[10px] tracking-[0.2em] text-maroon-700">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <div className="mx-auto mt-4 h-14 w-11 rounded-t-full border-2 border-saffron-600/60 bg-saffron-50" />
        <h3 className="mt-3 text-center font-serif text-xl font-bold text-maroon-800">
          {t("mockTitle")}
        </h3>
        <div className="mx-auto mt-2 h-px w-24 bg-saffron-500/60" />
        <dl className="mt-5 space-y-2.5">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 text-[11px]">
              <dt className="w-20 shrink-0 font-semibold text-stone-500">{k}</dt>
              <dd className="text-stone-800">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-saffron-500/70" />
          ))}
        </div>
      </div>
    </div>
  );
}
