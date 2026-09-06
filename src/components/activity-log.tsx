"use client";

import { Bot, Check, CircleAlert, Info, MousePointer2 } from "lucide-react";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

const KIND = {
  ai: { Icon: Bot, className: "text-primary" },
  action: { Icon: MousePointer2, className: "text-play" },
  ok: { Icon: Check, className: "text-play" },
  warn: { Icon: CircleAlert, className: "text-record" },
  info: { Icon: Info, className: "text-muted-foreground" },
} as const;

export function ActivityLog() {
  const logs = useStudio((s) => s.logs);
  const clearLogs = useStudio((s) => s.clearLogs);

  return (
    <div className="flex min-h-40 flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Journal
        </p>
        <button
          type="button"
          onClick={clearLogs}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          Effacer
        </button>
      </div>
      <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto p-3">
        {logs.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Les actions de l’assistant s’afficheront ici.
          </p>
        ) : (
          logs.map((l) => {
            const { Icon, className } = KIND[l.kind];
            return (
              <div key={l.id} className="flex gap-2 text-xs leading-snug">
                <Icon className={cn("mt-0.5 size-3.5 shrink-0", className)} />
                <p className="text-pretty text-foreground/90">{l.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
