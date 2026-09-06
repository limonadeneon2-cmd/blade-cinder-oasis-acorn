import { decideActions } from "./ai";
import { executeAction, type PlayHost } from "./engine";
import { planAds, planSurvey } from "./heuristics";
import type { PageElement, Profile } from "./types";
import { sleep } from "./utils";

export async function runAssistant(opts: {
  mode: "ads" | "survey";
  getHost: () => PlayHost | null;
  snapshot: () => PageElement[];
  profile?: Profile;
  skipWhenPossible?: boolean;
  extra?: string;
  speed: number;
  signal: AbortSignal;
  onLog: (kind: "ai" | "action" | "ok" | "warn" | "info", text: string) => void;
  isFinished?: () => boolean;
  getGeminiKeys?: () => string[];
  getGeminiCursor?: () => number;
  setGeminiCursor?: (n: number) => void;
}) {
  const speed = Math.max(opts.speed || 1, 0.25);
  let calls = 0;

  while (!opts.signal.aborted && calls < 16) {
    if (opts.isFinished?.()) {
      opts.onLog("ok", "Terminé.");
      return;
    }
    const elements = opts.snapshot();
    if (elements.length === 0) {
      opts.onLog("ok", "Plus rien à automatiser sur cette page.");
      return;
    }

    let plan;
    try {
      plan = await decideActions({
        data: {
          mode: opts.mode,
          elements,
          profile: opts.profile,
          skipWhenPossible: opts.skipWhenPossible,
          extra: opts.extra,
          geminiKeys: opts.getGeminiKeys?.() ?? [],
          geminiCursor: opts.getGeminiCursor?.() ?? 0,
        },
      });
    } catch {
      plan =
        opts.mode === "survey"
          ? planSurvey(elements, opts.profile ?? ({} as Profile))
          : planAds(elements, { skipWhenPossible: !!opts.skipWhenPossible });
      opts.onLog("warn", "IA injoignable — bascule sur le moteur local.");
    }

    calls += 1;
    if (typeof plan.nextCursor === "number") {
      opts.setGeminiCursor?.(plan.nextCursor);
    }
    if (plan.provider === "gemini" && plan.geminiSlot) {
      opts.onLog("ai", `Gemini Flash · clé ${plan.geminiSlot}/4`);
    }
    if (plan.commentary) {
      opts.onLog(plan.source === "ai" ? "ai" : "info", plan.commentary);
    }

    const host = opts.getHost();
    if (!host) return;

    let did = false;
    for (const action of plan.actions) {
      if (opts.signal.aborted) return;
      if (action.type === "done") {
        if (opts.snapshot().length === 0) {
          opts.onLog("ok", action.reason || "Boucle terminée.");
          return;
        }
        continue;
      }
      const waitMs = action.waitMs ? Math.max(120, action.waitMs / speed) : undefined;
      opts.onLog("action", action.reason);
      await executeAction(host, { ...action, waitMs }, opts.signal);
      did = true;
      await sleep(220 / speed, opts.signal);
      if (opts.isFinished?.()) {
        opts.onLog("ok", "Terminé.");
        return;
      }
    }

    if (!did) break;
    await sleep(360 / speed, opts.signal);
  }
}
