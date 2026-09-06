"use client";

import {
  ArrowDownUp,
  Keyboard,
  MousePointer2,
  Navigation,
  Type,
  Timer,
} from "lucide-react";
import type { MacroStep, StepType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<StepType, typeof MousePointer2> = {
  click: MousePointer2,
  input: Type,
  key: Keyboard,
  select: Type,
  scroll: ArrowDownUp,
  wait: Timer,
};

const TINT: Record<StepType, string> = {
  click: "border-primary/50",
  input: "border-play/50",
  key: "border-foreground/25",
  select: "border-play/50",
  scroll: "border-border",
  wait: "border-border",
};

interface TapeStripProps {
  steps: MacroStep[];
  editable?: boolean;
  activeIndex?: number;
  onChangeDelay?: (index: number, delay: number) => void;
}

export function TapeStrip({ steps, editable, activeIndex, onChangeDelay }: TapeStripProps) {
  if (steps.length === 0) {
    return (
      <p className="px-1 py-3 text-xs text-muted-foreground">
        Aucune étape pour l’instant.
      </p>
    );
  }
  return (
    <div className="flex gap-1.5 overflow-x-auto py-2">
      {steps.map((step, i) => {
        const Icon = ICONS[step.type] ?? Navigation;
        return (
          <div
            key={step.id}
            className={cn(
              "tape-chip flex min-w-[72px] shrink-0 flex-col items-center gap-1 rounded-md border bg-secondary px-2 py-1.5 text-center",
              TINT[step.type],
              activeIndex === i && "ring-1 ring-play",
            )}
            style={{ animationDelay: `${i * 40}ms` }}
            title={step.label}
          >
            <Icon className="size-3.5 text-foreground" />
            <span className="max-w-[88px] truncate text-[10px] text-muted-foreground">
              {step.label}
            </span>
            {editable ? (
              <label className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground">
                <input
                  type="number"
                  min={0}
                  value={step.delay}
                  onChange={(e) =>
                    onChangeDelay?.(i, Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  className="h-6 w-12 rounded-sm border border-border bg-card px-1 text-center text-[10px] text-foreground"
                />
                ms
              </label>
            ) : (
              <span className="font-mono text-[10px] text-muted-foreground">
                {step.delay} ms
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
