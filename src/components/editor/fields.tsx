"use client";

import { useTranslations } from "next-intl";
import { useBiodataStore } from "@/store/biodata-store";
import { cn } from "@/lib/cn";

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-600">
        {label}
      </span>
      {children}
    </label>
  );
}

export interface FieldDef {
  name: string;
  type?: "text" | "date" | "time" | "select" | "textarea";
  /** editor.options.* key holding the option list (for select). */
  optionsKey?: string;
  span?: boolean;
}

/**
 * Renders a grid of inputs for one store section (personal/astro/...).
 * Field labels/placeholders come from messages → editor.fields/placeholders.
 */
export function SectionFields({
  section,
  defs,
}: {
  section: "personal" | "astro" | "career" | "family" | "contact";
  defs: FieldDef[];
}) {
  const t = useTranslations("editor");
  const values = useBiodataStore(
    (s) => s.data[section],
  ) as unknown as Record<string, string>;
  const setField = useBiodataStore((s) => s.setField);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {defs.map((def) => {
        const label = t(`fields.${def.name}`);
        const hasPh = t.has(`placeholders.${def.name}`);
        const ph = hasPh ? t(`placeholders.${def.name}`) : undefined;
        const cls = cn(def.span && "sm:col-span-2");
        const value = values[def.name] ?? "";
        const onChange = (
          e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >,
        ) => setField(section, def.name, e.target.value);

        if (def.type === "select") {
          const opts = t.raw(`options.${def.optionsKey}`) as Record<
            string,
            string
          >;
          return (
            <Field key={def.name} label={label}>
              <div className={cls}>
                <select
                  className={inputCls}
                  value={value}
                  onChange={onChange}
                >
                  <option value="">{t("options.select")}</option>
                  {Object.entries(opts).map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          );
        }
        if (def.type === "textarea") {
          return (
            <Field key={def.name} label={label}>
              <div className={cls}>
                <textarea
                  className={cn(inputCls, "min-h-20")}
                  value={value}
                  placeholder={ph}
                  onChange={onChange}
                />
              </div>
            </Field>
          );
        }
        return (
          <Field key={def.name} label={label}>
            <div className={cls}>
              <input
                className={inputCls}
                type={def.type ?? "text"}
                value={value}
                placeholder={ph}
                onChange={onChange}
              />
            </div>
          </Field>
        );
      })}
    </div>
  );
}

/** For top-level string fields (aboutMe / expectations / invocation). */
export function TopLevelField({
  name,
  textarea = false,
}: {
  name: "aboutMe" | "expectations" | "invocation";
  textarea?: boolean;
}) {
  const t = useTranslations("editor");
  const value = useBiodataStore((s) => s.data[name]);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const ph = t.has(`placeholders.${name}`)
    ? t(`placeholders.${name}`)
    : undefined;
  return (
    <Field label={t(`fields.${name}`)}>
      {textarea ? (
        <textarea
          className={cn(inputCls, "min-h-24")}
          value={value}
          placeholder={ph}
          onChange={(e) => setTopLevel({ [name]: e.target.value })}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={ph}
          onChange={(e) => setTopLevel({ [name]: e.target.value })}
        />
      )}
    </Field>
  );
}
