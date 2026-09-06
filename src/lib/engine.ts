import type { AiAction, MacroStep } from "./types";
import { sleep } from "./utils";

export interface PlayHost {
  root: HTMLElement;
  moveCursor: (el: Element) => Promise<void>;
  pulse: () => void;
  highlight: (el: Element | null) => void;
}

function findTarget(root: HTMLElement, id: string) {
  return root.querySelector<HTMLElement>(`[data-ra-id="${CSS.escape(id)}"]`);
}

function nativeSet(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function executeAction(
  host: PlayHost,
  action: AiAction | MacroStep,
  signal: AbortSignal,
) {
  if (signal.aborted) return;
  const type = action.type;
  const targetId = "targetId" in action ? action.targetId : undefined;
  const value = "value" in action ? action.value : undefined;
  const waitMs = "waitMs" in action ? action.waitMs : undefined;

  if (type === "wait" || type === "done") {
    if (waitMs) await sleep(waitMs, signal);
    return;
  }
  if (!targetId) return;
  const el = findTarget(host.root, targetId);
  if (!el) return;
  if (el instanceof HTMLButtonElement && el.disabled) return;
  el.scrollIntoView({ block: "center", behavior: "instant" });
  await host.moveCursor(el);
  if (signal.aborted) return;
  host.highlight(el);
  host.pulse();

  if (type === "click") {
    el.click();
  } else if (type === "type" || type === "input") {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      nativeSet(el, value ?? "");
    } else {
      el.click();
    }
  } else if (type === "select") {
    if (el instanceof HTMLSelectElement && value) {
      el.value = value;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (value) {
      const opt = host.root.querySelector<HTMLElement>(
        `[data-ra-id="${CSS.escape(targetId)}"] [data-option="${CSS.escape(value)}"]`,
      );
      (opt ?? el).click();
    } else {
      el.click();
    }
  } else if (type === "key") {
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: value || "Enter", bubbles: true, cancelable: true }),
    );
  } else if (type === "scroll") {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

export async function runMacroSteps(
  host: PlayHost,
  steps: MacroStep[],
  fromIndex: number,
  speed: number,
  signal: AbortSignal,
  onIndex: (i: number) => void,
) {
  for (let i = fromIndex; i < steps.length; i++) {
    if (signal.aborted) return;
    const step = steps[i];
    const delay = Math.min(Math.max((step.delay || 0) / (speed || 1), 0), 15000);
    await sleep(delay, signal);
    if (signal.aborted) return;
    await executeAction(host, step, signal);
    onIndex(i + 1);
  }
}
