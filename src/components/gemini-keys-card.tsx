"use client";

import { KeyRound } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useStudio } from "@/lib/store";

export function GeminiKeysCard() {
  const keys = useStudio((s) => s.geminiKeys) ?? ["", "", "", ""];
  const { setGeminiKey, clearGeminiKeys } = useStudio();
  const filled = keys.filter((k) => k.trim().length >= 20).length;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <KeyRound className="size-4 text-primary" />
          Gemini Flash · 4 clés
        </p>
        {filled > 0 && (
          <button
            type="button"
            className="text-[11px] text-muted-foreground hover:text-foreground"
            onClick={clearGeminiKeys}
          >
            Effacer
          </button>
        )}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Colle tes clés ici, pas dans le chat. Si une est saturée, on passe à la suivante.
        Elles restent dans ton navigateur.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {keys.map((value, i) => (
          <Label key={i} className="text-[11px] text-muted-foreground">
            Clé {i + 1}
            <Input
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="AIza…"
              value={value}
              onChange={(e) => setGeminiKey(i, e.target.value)}
              className="mt-1 h-9 font-mono text-xs"
            />
          </Label>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        {filled === 0
          ? "Aucune clé — le moteur local prend le relais."
          : `${filled}/4 actives · roulement automatique`}
      </p>
    </div>
  );
}
