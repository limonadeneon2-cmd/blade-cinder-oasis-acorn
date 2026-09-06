import { createServerFn } from "@tanstack/react-start";
import { completeWithGeminiRotation, sanitizeGeminiKeys } from "./gemini";
import { planAds, planSurvey, profileDigest } from "./heuristics";
import type { AiPlan, PageElement, Profile } from "./types";

interface DecideInput {
  mode: "ads" | "survey";
  elements: PageElement[];
  profile?: Profile;
  skipWhenPossible?: boolean;
  extra?: string;
  geminiKeys?: string[];
  geminiCursor?: number;
}

function extractJson(text: string): AiPlan | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      commentary?: string;
      actions?: AiPlan["actions"];
    };
    if (!Array.isArray(parsed.actions)) return null;
    return {
      commentary: parsed.commentary || "",
      actions: parsed.actions.filter((a) => a && typeof a.type === "string"),
      source: "ai",
    };
  } catch {
    return null;
  }
}

function systemPrompt(mode: DecideInput["mode"]) {
  return mode === "ads"
    ? `Tu es le moteur d'automatisation de Répète-Actions.
Objectif : faire JOUER les publicités toute seules, puis récupérer la récompense.
Règles :
- Clique Play si la pub est à l'arrêt.
- Clique Mute seulement si le son n'est pas déjà coupé.
- Si Skip est enabled, clique Skip (l'utilisateur l'autorise).
- Sinon attends (waitMs 800-2000) pour laisser la pub avancer.
- Priorité : Claim, Close, Next, Skip, Play.
- Ne clique jamais Acheter, S'inscrire, ni de lien externe.
Réponds UNIQUEMENT en JSON compact :
{"commentary":"phrase courte en français","actions":[{"type":"click|type|select|wait|done","targetId":"id","value":"","waitMs":0,"reason":"court"}]}
Maximum 4 actions.`
    : `Tu es le moteur d'automatisation de Répète-Actions, mode sondage.
Remplis le formulaire avec le PROFIL fourni. Utilise les DATES DE FÊTES enregistrées
dès qu'une question parle de fêtes, disponibilités, vacances, Noël, jours fériés.
Ne fabrique pas d'identité absente du profil. L'âge peut être déduit de la naissance.
Pour un QCM, choisis l'option la plus cohérente.
Réponds UNIQUEMENT en JSON compact :
{"commentary":"phrase courte en français","actions":[{"type":"click|type|select|wait|done","targetId":"id","value":"texte ou option","waitMs":0,"reason":"court"}]}
Une action par champ visible, puis click sur Suivant/Envoyer s'il est visible.`;
}

async function tryGrok(system: string, user: string): Promise<AiPlan | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return extractJson(body.choices?.[0]?.message?.content ?? "");
  } catch {
    return null;
  }
}

export const decideActions = createServerFn({ method: "POST" })
  .validator((input: DecideInput) => ({
    ...input,
    geminiKeys: sanitizeGeminiKeys(input.geminiKeys),
    geminiCursor: Number.isFinite(input.geminiCursor) ? input.geminiCursor : 0,
  }))
  .handler(async ({ data }): Promise<AiPlan> => {
    const fallback: AiPlan =
      data.mode === "survey"
        ? planSurvey(data.elements, data.profile ?? ({} as Profile))
        : planAds(data.elements, { skipWhenPossible: !!data.skipWhenPossible });

    const system = systemPrompt(data.mode);
    const user = JSON.stringify({
      mode: data.mode,
      elements: data.elements,
      extra: data.extra ?? "",
      skipWhenPossible: !!data.skipWhenPossible,
      profil: data.profile ? profileDigest(data.profile) : null,
    });

    const gemini = await completeWithGeminiRotation({
      keys: data.geminiKeys ?? [],
      startIndex: data.geminiCursor ?? 0,
      system,
      user,
      extractJson,
    });
    if (gemini) {
      return {
        ...gemini.plan,
        source: "ai",
        provider: "gemini",
        geminiSlot: gemini.slot,
        nextCursor: gemini.nextCursor,
      };
    }

    const grok = await tryGrok(system, user);
    if (grok && grok.actions.length > 0) {
      return { ...grok, provider: "grok" };
    }

    const hadGemini = (data.geminiKeys?.length ?? 0) > 0;
    return {
      ...fallback,
      provider: "local",
      commentary: hadGemini
        ? `${fallback.commentary} (moteur local — 4 clés Gemini saturées ou invalides ce tour)`
        : `${fallback.commentary} (moteur local)`,
    };
  });
