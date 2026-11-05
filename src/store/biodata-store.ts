"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type BiodataData,
  type OutputLocale,
  type TemplateId,
  emptyBiodata,
  sampleBiodata,
} from "@/lib/biodata";

interface DraftEntry {
  data: BiodataData;
  updatedAt: number;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : `d${Date.now().toString(36)}`;

interface BiodataStore {
  data: BiodataData;
  /** All saved drafts including the active one: id → entry. */
  drafts: Record<string, DraftEntry>;
  activeId: string;
  /** Snapshot history for undo (not persisted). */
  past: BiodataData[];
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
        | "familyAbout"
        | "familyExpectations"
        | "prefs"
        | "candidateFor"
        | "biodataNo"
      >
    >,
  ) => void;
  setTemplate: (template: TemplateId) => void;
  setOutputLocale: (locale: OutputLocale) => void;
  hydrateFromShare: (data: Partial<BiodataData>) => void;
  reset: () => void;
  undo: () => void;
  newDraft: () => void;
  switchDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
}

/** Write `data` into the active draft slot (keeps drafts map in sync). */
function sync(
  state: Pick<BiodataStore, "data" | "drafts" | "activeId" | "past">,
  data: BiodataData,
) {
  return {
    data,
    past: [...(state.past ?? []).slice(-49), state.data],
    drafts: {
      ...state.drafts,
      [state.activeId]: { data, updatedAt: Date.now() },
    },
  };
}

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set) => ({
      data: sampleBiodata,
      drafts: {},
      activeId: "default",
      past: [],

      setField: (section, field, value) =>
        set((state) =>
          sync(state, {
            ...state.data,
            [section]: {
              ...(state.data[section] as unknown as Record<string, unknown>),
              [field]: value,
            },
          }),
        ),

      setTopLevel: (patch) =>
        set((state) => sync(state, { ...state.data, ...patch })),

      setTemplate: (template) =>
        set((state) => sync(state, { ...state.data, template })),

      setOutputLocale: (outputLocale) =>
        set((state) => sync(state, { ...state.data, outputLocale })),

      hydrateFromShare: (shared) =>
        set((state) =>
          sync(state, {
            ...state.data,
            ...shared,
            photo: state.data.photo,
          }),
        ),

      reset: () =>
        set((state) =>
          sync(state, {
            ...sampleBiodata,
            template: state.data.template,
            outputLocale: state.data.outputLocale,
          }),
        ),

      undo: () =>
        set((state) => {
          const prev = state.past?.at(-1);
          if (!prev) return {};
          const past = state.past.slice(0, -1);
          return {
            data: prev,
            past,
            drafts: {
              ...state.drafts,
              [state.activeId]: { data: prev, updatedAt: Date.now() },
            },
          };
        }),

      newDraft: () =>
        set((state) => {
          const drafts = {
            ...state.drafts,
            [state.activeId]: { data: state.data, updatedAt: Date.now() },
          };
          const id = uid();
          const fresh: BiodataData = {
            ...emptyBiodata,
            template: state.data.template,
            outputLocale: state.data.outputLocale,
          };
          return { data: fresh, drafts, activeId: id, past: [] };
        }),

      switchDraft: (id) =>
        set((state) => {
          if (id === state.activeId) return {};
          const target = state.drafts[id];
          if (!target) return {};
          return {
            data: target.data,
            activeId: id,
            past: [],
            drafts: {
              ...state.drafts,
              [state.activeId]: { data: state.data, updatedAt: Date.now() },
            },
          };
        }),

      deleteDraft: (id) =>
        set((state) => {
          const drafts = { ...state.drafts };
          if (id === state.activeId) {
            const others = Object.keys(drafts).filter((k) => k !== id);
            if (others.length === 0) {
              return {
                data: { ...emptyBiodata, template: state.data.template },
                drafts: {},
                activeId: "default",
                past: [],
              };
            }
            const next = others[0];
            delete drafts[id];
            return {
              data: drafts[next].data,
              drafts,
              activeId: next,
              past: [],
            };
          }
          delete drafts[id];
          return { drafts };
        }),
    }),
    {
      name: "shubh-biodata",
      version: 2,
      // Don't persist undo history or transient fields.
      partialize: (s) => ({ data: s.data, drafts: s.drafts, activeId: s.activeId }),
      migrate: (persisted: unknown) => {
        const p = persisted as { data?: BiodataData; drafts?: Record<string, DraftEntry>; activeId?: string };
        if (p?.drafts && p.activeId) return persisted;
        if (p?.data) {
          return {
            data: p.data,
            activeId: "default",
            drafts: { default: { data: p.data, updatedAt: Date.now() } },
          };
        }
        return persisted;
      },
    },
  ),
);

/** Display name for a draft: candidate name or fallback. */
export function draftName(entry: DraftEntry, index: number): string {
  return entry.data.personal.name.trim() || `Biodata ${index + 1}`;
}
