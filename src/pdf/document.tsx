import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { BiodataData, TemplateId } from "@/lib/biodata";
import { docLabels } from "./labels";
import { registerFonts } from "./fonts";
import { TraditionalTemplate } from "./templates/traditional";
import { RoyalTemplate } from "./templates/royal";
import { ModernTemplate } from "./templates/modern";
import { FloralTemplate } from "./templates/floral";
import { EmeraldTemplate } from "./templates/emerald";
import { MandalaTemplate } from "./templates/mandala";
import { PeacockTemplate } from "./templates/peacock";
import { JharokhaTemplate } from "./templates/jharokha";
import { ToranTemplate } from "./templates/toran";
import { BanarasiTemplate } from "./templates/banarasi";
import { KalashTemplate } from "./templates/kalash";
import { NavyTemplate } from "./templates/navy";

const TEMPLATES: Record<
  TemplateId,
  (p: {
    data: BiodataData;
    labels: ReturnType<typeof docLabels>;
  }) => ReactElement<DocumentProps>
> = {
  traditional: TraditionalTemplate,
  royal: RoyalTemplate,
  modern: ModernTemplate,
  floral: FloralTemplate,
  emerald: EmeraldTemplate,
  mandala: MandalaTemplate,
  peacock: PeacockTemplate,
  jharokha: JharokhaTemplate,
  toran: ToranTemplate,
  banarasi: BanarasiTemplate,
  kalash: KalashTemplate,
  navy: NavyTemplate,
};

/** Single source of truth — used by both <PDFViewer> preview and download. */
export function buildBiodataDocument(
  data: BiodataData,
): ReactElement<DocumentProps> {
  registerFonts();
  const labels = docLabels(data.outputLocale);
  const Template = TEMPLATES[data.template] ?? TraditionalTemplate;
  return <Template data={data} labels={labels} />;
}
