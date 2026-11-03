"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type BiodataData,
  type OutputLocale,
  type TemplateId,
  sampleBiodata,
} from "@/lib/biodata";

interface BiodataStore {
  data: BiodataData;
  setField: <K extends keyof BiodataData>(
    section: K,
    field: string,
    value: string,
  ) => void;
  setTopLevel: (
    patch: Partial<
      Pick<
        BiodataData,
        | "photo"
        | "invocation"
        | "aboutMe"
        | "expectations"
        | "accent"
        | "photoFrame"
        | "pageBorder"
        | "invocationIcon"
        | "pageBackground"
      >
    >,
  ) => void;
  setTemplate: (template: TemplateId) => void;
  setOutputLocale: (locale: OutputLocale) => void;
  hydrateFromShare: (data: Partial<BiodataData>) => void;
  reset: () => void;
}

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set) => ({
      data: sampleBiodata,

      setField: (section, field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            [section]: {
              ...(state.data[section] as unknown as Record<string, unknown>),
              [field]: value,
            },
          },
        })),

      setTopLevel: (patch) =>
        set((state) => ({ data: { ...state.data, ...patch } })),

      setTemplate: (template) =>
        set((state) => ({ data: { ...state.data, template } })),

      setOutputLocale: (outputLocale) =>
        set((state) => ({ data: { ...state.data, outputLocale } })),

      hydrateFromShare: (shared) =>
        set((state) => ({
          data: { ...state.data, ...shared, photo: state.data.photo },
        })),

      reset: () => set({ data: sampleBiodata }),
    }),
    { name: "shubh-biodata" },
  ),
);
