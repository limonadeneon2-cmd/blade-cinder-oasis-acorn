"use client";

import { useStudio } from "@/lib/store";

export function AiStatus() {
  const keys = useStudio((s) => s.geminiKeys) ?? ["", "", "", ""];
  const n = keys.filter((k) => k.trim().length >= 20).length;

  return (
    <p className="mt-2 text-[11px] text-muted-foreground">
      {n === 0
        ? "Colle tes 4 clés Gemini Flash dans le bloc « clés » — pas dans le chat."
        : `Gemini Flash prêt · ${n}/4 clés · roulement si quota`}
    </p>
  );
}
