import type { AiPlan } from "./types";

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
const KEY_MAX = 200;

export function sanitizeGeminiKeys(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 4).map((k) =>
    typeof k === "string" ? k.trim().slice(0, KEY_MAX) : "",
  );
}

function slotsFrom(raw: unknown): { slot: number; key: string }[] {
  return sanitizeGeminiKeys(raw)
    .map((key, slot) => ({ slot, key }))
    .filter((s) => s.key.length >= 20);
}

function isQuota(status: number, body: string) {
  if (status === 429 || status === 503) return true;
  const t = body.toLowerCase();
  return /quota|rate.?limit|resource.?exhausted|too many requests|billing/.test(t);
}

function isDeadKey(status: number, body: string) {
  if (status === 400 || status === 401 || status === 403) {
    const t = body.toLowerCase();
    return /api.?key|invalid|permission|expired|disabled/.test(t);
  }
  return false;
}

interface GeminiOk {
  plan: AiPlan;
  slot: number;
  nextCursor: number;
}

export async function completeWithGeminiRotation(opts: {
  keys: string[];
  startIndex: number;
  system: string;
  user: string;
  extractJson: (text: string) => AiPlan | null;
}): Promise<GeminiOk | null> {
  const slots = slotsFrom(opts.keys);
  if (slots.length === 0) return null;

  let start = slots.findIndex((s) => s.slot >= (opts.startIndex % 4));
  if (start < 0) start = 0;

  for (let i = 0; i < slots.length; i++) {
    const current = slots[(start + i) % slots.length];
    const next = slots[(start + i + 1) % slots.length];

    for (const model of MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": current.key,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: opts.system }] },
              contents: [{ role: "user", parts: [{ text: opts.user }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 700,
                responseMimeType: "application/json",
              },
            }),
            signal: AbortSignal.timeout(14000),
          },
        );
        const body = await res.text();
        if (res.status === 404) continue;
        if (!res.ok) {
          if (isQuota(res.status, body) || isDeadKey(res.status, body)) break;
          continue;
        }
        const parsed = JSON.parse(body) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text =
          parsed.candidates?.[0]?.content?.parts
            ?.map((p) => p.text ?? "")
            .join("") ?? "";
        const plan = opts.extractJson(text);
        if (!plan || plan.actions.length === 0) break;
        return {
          plan,
          slot: current.slot + 1,
          nextCursor: next.slot,
        };
      } catch {
        break;
      }
    }
  }
  return null;
}
