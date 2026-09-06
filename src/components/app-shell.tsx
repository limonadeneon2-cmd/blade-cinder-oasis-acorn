"use client";

import { Circle, Clapperboard, ClipboardList, Repeat } from "lucide-react";
import { AdsPanel } from "./ads-panel";
import { StudioPanel } from "./studio-panel";
import { SurveyPanel } from "./survey-panel";
import { useStudio } from "@/lib/store";
import type { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const MODES: { id: AppMode; label: string; Icon: typeof Repeat; hint: string }[] = [
  { id: "studio", label: "Studio", Icon: Repeat, hint: "Enregistrer & rejouer" },
  { id: "ads", label: "Pubs", Icon: Clapperboard, hint: "Les faire jouer" },
  { id: "surveys", label: "Sondages", Icon: ClipboardList, hint: "Réponses auto" },
];

export function AppShell() {
  const mode = useStudio((s) => s.mode);
  const recording = useStudio((s) => s.recording);
  const setMode = useStudio((s) => s.setMode);

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "size-2.5 rounded-full bg-border",
                recording && "rec-live bg-record",
              )}
            />
            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Répète-Actions
              </h1>
              <p className="font-mono text-[11px] text-muted-foreground">
                Enregistre. Joue les pubs. Réponds aux sondages.
              </p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-lg bg-secondary p-1">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm transition-colors sm:flex-none",
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <m.Icon className="size-4" />
                  {m.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {mode === "studio" ? (
          <>
            <Intro />
            <StudioPanel />
          </>
        ) : null}
        {mode === "ads" ? <AdsPanel /> : null}
        {mode === "surveys" ? <SurveyPanel /> : null}
      </main>
    </div>
  );
}

function Intro() {
  return (
    <section className="mb-6 max-w-2xl">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Même logique que l’extension : tu enregistres une suite de clics, tu la rejoues à la
        vitesse que tu veux. Ici, le studio le fait sur une boutique démo. L’IA s’occupe des pubs
        et remplit les sondages en s’appuyant sur tes dates de fêtes.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          <Circle className="size-2 fill-record text-record" />
          Enregistrement par onglet
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          Pubs en lecture auto
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          Sondages + calendrier de fêtes
        </span>
      </div>
    </section>
  );
}
