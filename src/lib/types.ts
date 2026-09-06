export type StepType = "click" | "input" | "key" | "select" | "scroll" | "wait";

export interface MacroStep {
  id: string;
  type: StepType;
  targetId: string;
  value?: string;
  delay: number;
  label: string;
}

export interface Macro {
  id: string;
  name: string;
  steps: MacroStep[];
  createdAt: number;
}

export interface Holiday {
  id: string;
  name: string;
  month: number;
  day: number;
  year?: number;
  notes: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  country: string;
  occupation: string;
  gender: string;
  language: string;
  bio: string;
  likes: string;
  dislikes: string;
  holidays: Holiday[];
}

export type AppMode = "studio" | "ads" | "surveys";

export interface LogEntry {
  id: string;
  at: number;
  kind: "info" | "ai" | "action" | "ok" | "warn";
  text: string;
}

export interface AiAction {
  type: "click" | "type" | "select" | "wait" | "done";
  targetId?: string;
  value?: string;
  waitMs?: number;
  reason: string;
}

export interface AiPlan {
  commentary: string;
  actions: AiAction[];
  source: "ai" | "local";
  provider?: "gemini" | "grok" | "local";
  geminiSlot?: number;
  nextCursor?: number;
}

export interface PageElement {
  id: string;
  tag: string;
  role?: string;
  label: string;
  value?: string;
  options?: string[];
  disabled?: boolean;
  visible: boolean;
  waitMs?: number;
  kind?: "play" | "skip" | "close" | "claim" | "next" | "mute" | "field" | "choice";
}

export const FR_HOLIDAY_PRESETS: Omit<Holiday, "id" | "notes">[] = [
  { name: "Jour de l'An", month: 1, day: 1 },
  { name: "Fête du travail", month: 5, day: 1 },
  { name: "Victoire 1945", month: 5, day: 8 },
  { name: "Fête nationale", month: 7, day: 14 },
  { name: "Assomption", month: 8, day: 15 },
  { name: "Toussaint", month: 11, day: 1 },
  { name: "Armistice", month: 11, day: 11 },
  { name: "Noël", month: 12, day: 25 },
];
