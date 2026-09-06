import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAMPLE_MACROS, SAMPLE_PROFILE } from "./demo-data";
import type { AppMode, Holiday, LogEntry, Macro, MacroStep, Profile } from "./types";
import { uid } from "./utils";

interface StudioState {
  mode: AppMode;
  macros: Macro[];
  drafts: Macro[];
  recording: boolean;
  playing: boolean;
  recordStartedAt: number;
  lastStepAt: number;
  liveSteps: MacroStep[];
  speed: number;
  loops: number;
  infinite: boolean;
  playingMacroId: string | null;
  stepIndex: number;
  profile: Profile;
  logs: LogEntry[];
  autoDismiss: boolean;
  adSkipWhenPossible: boolean;
  adMute: boolean;
  adTokens: number;
  geminiKeys: [string, string, string, string];
  geminiCursor: number;
  setMode: (mode: AppMode) => void;
  setRecording: (v: boolean) => void;
  pushLiveStep: (step: Omit<MacroStep, "id" | "delay"> & { delay?: number }) => void;
  stopRecording: () => void;
  saveDraft: (id: string, name: string) => void;
  discardDraft: (id: string) => void;
  updateDraftSteps: (id: string, steps: MacroStep[]) => void;
  saveMacro: (macro: Macro) => void;
  deleteMacro: (id: string) => void;
  setPlayback: (partial: {
    playing?: boolean;
    playingMacroId?: string | null;
    stepIndex?: number;
  }) => void;
  setSpeed: (n: number) => void;
  setLoops: (n: number) => void;
  setInfinite: (v: boolean) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  addHoliday: (h: Omit<Holiday, "id">) => void;
  removeHoliday: (id: string) => void;
  loadSampleProfile: () => void;
  log: (kind: LogEntry["kind"], text: string) => void;
  clearLogs: () => void;
  setAutoDismiss: (v: boolean) => void;
  setAdSkipWhenPossible: (v: boolean) => void;
  setAdMute: (v: boolean) => void;
  addTokens: (n: number) => void;
  setGeminiKey: (index: number, value: string) => void;
  setGeminiCursor: (n: number) => void;
  clearGeminiKeys: () => void;
}

const emptyProfile = (): Profile => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  city: "",
  country: "France",
  occupation: "",
  gender: "",
  language: "Français",
  bio: "",
  likes: "",
  dislikes: "",
  holidays: [],
});

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      mode: "studio",
      macros: SAMPLE_MACROS,
      drafts: [],
      recording: false,
      playing: false,
      recordStartedAt: 0,
      lastStepAt: 0,
      liveSteps: [],
      speed: 1,
      loops: 1,
      infinite: false,
      playingMacroId: null,
      stepIndex: 0,
      profile: SAMPLE_PROFILE,
      logs: [],
      autoDismiss: true,
      adSkipWhenPossible: true,
      adMute: true,
      adTokens: 0,
      geminiKeys: ["", "", "", ""],
      geminiCursor: 0,
      setMode: (mode) => set({ mode }),
      setRecording: (v) =>
        set(
          v
            ? {
                recording: true,
                liveSteps: [],
                recordStartedAt: Date.now(),
                lastStepAt: Date.now(),
              }
            : { recording: false },
        ),
      pushLiveStep: (step) => {
        const now = Date.now();
        const delay = step.delay ?? Math.max(0, now - get().lastStepAt);
        set({
          liveSteps: [
            ...get().liveSteps,
            { ...step, id: uid("step"), delay: Math.min(delay, 15000) },
          ],
          lastStepAt: now,
        });
      },
      stopRecording: () => {
        const steps = get().liveSteps;
        if (steps.length === 0) {
          set({ recording: false, liveSteps: [] });
          return;
        }
        const draft: Macro = {
          id: uid("draft"),
          name: "",
          steps,
          createdAt: Date.now(),
        };
        set({
          recording: false,
          liveSteps: [],
          drafts: [...get().drafts, draft],
        });
      },
      saveDraft: (id, name) => {
        const draft = get().drafts.find((d) => d.id === id);
        if (!draft) return;
        const macro: Macro = {
          ...draft,
          id: uid("macro"),
          name: name.trim() || "Macro sans nom",
        };
        set({
          macros: [macro, ...get().macros],
          drafts: get().drafts.filter((d) => d.id !== id),
        });
      },
      discardDraft: (id) =>
        set({ drafts: get().drafts.filter((d) => d.id !== id) }),
      updateDraftSteps: (id, steps) =>
        set({
          drafts: get().drafts.map((d) => (d.id === id ? { ...d, steps } : d)),
        }),
      saveMacro: (macro) =>
        set({
          macros: get().macros.some((m) => m.id === macro.id)
            ? get().macros.map((m) => (m.id === macro.id ? macro : m))
            : [macro, ...get().macros],
        }),
      deleteMacro: (id) =>
        set({ macros: get().macros.filter((m) => m.id !== id) }),
      setPlayback: (partial) => set(partial),
      setSpeed: (n) => set({ speed: n }),
      setLoops: (n) => set({ loops: n }),
      setInfinite: (v) => set({ infinite: v }),
      updateProfile: (partial) =>
        set({ profile: { ...get().profile, ...partial } }),
      addHoliday: (h) =>
        set({
          profile: {
            ...get().profile,
            holidays: [...get().profile.holidays, { ...h, id: uid("hol") }],
          },
        }),
      removeHoliday: (id) =>
        set({
          profile: {
            ...get().profile,
            holidays: get().profile.holidays.filter((h) => h.id !== id),
          },
        }),
      loadSampleProfile: () => set({ profile: SAMPLE_PROFILE }),
      log: (kind, text) =>
        set({
          logs: [
            { id: uid("log"), at: Date.now(), kind, text },
            ...get().logs,
          ].slice(0, 80),
        }),
      clearLogs: () => set({ logs: [] }),
      setAutoDismiss: (v) => set({ autoDismiss: v }),
      setAdSkipWhenPossible: (v) => set({ adSkipWhenPossible: v }),
      setAdMute: (v) => set({ adMute: v }),
      addTokens: (n) => set({ adTokens: get().adTokens + n }),
      setGeminiKey: (index, value) => {
        const i = Math.max(0, Math.min(3, index));
        const current = get().geminiKeys ?? ["", "", "", ""];
        const next: [string, string, string, string] = [
          current[0] ?? "",
          current[1] ?? "",
          current[2] ?? "",
          current[3] ?? "",
        ];
        next[i] = value;
        set({ geminiKeys: next });
      },
      setGeminiCursor: (n) => set({ geminiCursor: ((n % 4) + 4) % 4 }),
      clearGeminiKeys: () => set({ geminiKeys: ["", "", "", ""], geminiCursor: 0 }),
    }),
    {
      name: "repete-actions-v1",
      partialize: (s) => ({
        macros: s.macros,
        profile: s.profile,
        speed: s.speed,
        loops: s.loops,
        infinite: s.infinite,
        autoDismiss: s.autoDismiss,
        adSkipWhenPossible: s.adSkipWhenPossible,
        adMute: s.adMute,
        adTokens: s.adTokens,
        geminiKeys: s.geminiKeys,
        geminiCursor: s.geminiCursor,
      }),
    },
  ),
);
