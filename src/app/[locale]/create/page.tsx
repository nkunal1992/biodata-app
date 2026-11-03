import { setRequestLocale } from "next-intl/server";
import EditorShell from "@/components/editor/EditorShell";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EditorShell />;
}
