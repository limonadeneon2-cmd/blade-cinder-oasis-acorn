import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as planSurvey, i as planAds, o as profileDigest } from "./heuristics-h__ljfX7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-B_l6-LZb.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function extractJson(text) {
	const trimmed = text.trim();
	const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const raw = fenced ? fenced[1] : trimmed;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const parsed = JSON.parse(raw.slice(start, end + 1));
		if (!Array.isArray(parsed.actions)) return null;
		return {
			commentary: parsed.commentary || "",
			actions: parsed.actions.filter((a) => a && typeof a.type === "string"),
			source: "ai"
		};
	} catch {
		return null;
	}
}
var decideActions_createServerFn_handler = createServerRpc({
	id: "3985e6ad82e720f744bbe6dbb68369fc16d5712e185d1215402890227d15df9b",
	name: "decideActions",
	filename: "src/lib/ai.ts"
}, (opts) => decideActions.__executeServer(opts));
var decideActions = createServerFn({ method: "POST" }).validator((input) => input).handler(decideActions_createServerFn_handler, async ({ data }) => {
	const fallback = data.mode === "survey" ? planSurvey(data.elements, data.profile ?? {}) : planAds(data.elements, { skipWhenPossible: !!data.skipWhenPossible });
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		...fallback,
		commentary: fallback.commentary
	};
	const system = data.mode === "ads" ? `Tu es le moteur d'automatisation de Répète-Actions.
Objectif : faire JOUER les publicités toute seules, puis récupérer la récompense.
Règles :
- Clique Play si la pub est à l'arrêt.
- Clique Mute si disponible.
- Si Skip est enabled, clique Skip (l'utilisateur l'autorise).
- Sinon attends (waitMs 800-2000) pour laisser la pub avancer.
- Clique Close / Claim / Next quand ils sont visibles et enabled.
- Ne clique jamais Acheter, S'inscrire, ni de lien externe.
Réponds UNIQUEMENT en JSON compact :
{"commentary":"phrase courte en français","actions":[{"type":"click|type|select|wait|done","targetId":"id","value":"","waitMs":0,"reason":"court"}]}
Maximum 6 actions.` : `Tu es le moteur d'automatisation de Répète-Actions, mode sondage.
Remplis le formulaire avec le PROFIL fourni. Utilise les DATES DE FÊTES enregistrées
dès qu'une question parle de fêtes, disponibilités, vacances, Noël, jours fériés.
Ne fabrique pas d'identité absente du profil. L'âge peut être déduit de la naissance.
Pour un QCM, choisis l'option la plus cohérente.
Réponds UNIQUEMENT en JSON compact :
{"commentary":"phrase courte en français","actions":[{"type":"click|type|select|wait|done","targetId":"id","value":"texte ou option","waitMs":0,"reason":"court"}]}
Une action par champ visible, puis click sur Suivant/Envoyer s'il est visible.`;
	const payload = {
		mode: data.mode,
		elements: data.elements,
		extra: data.extra ?? "",
		skipWhenPossible: !!data.skipWhenPossible,
		profil: data.profile ? profileDigest(data.profile) : null
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .2,
				max_tokens: 700,
				response_format: { type: "json_object" },
				messages: [{
					role: "system",
					content: system
				}, {
					role: "user",
					content: JSON.stringify(payload)
				}]
			})
		});
		if (!res.ok) return {
			...fallback,
			commentary: `${fallback.commentary} (moteur local — IA saturée pour l’instant)`
		};
		const plan = extractJson((await res.json()).choices?.[0]?.message?.content ?? "");
		if (!plan || plan.actions.length === 0) return fallback;
		return plan;
	} catch {
		return fallback;
	}
});
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4",
	name: "getAiStatus",
	filename: "src/lib/ai.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => ({ available: Boolean(process.env.XAI_API_KEY) }));
//#endregion
export { decideActions_createServerFn_handler, getAiStatus_createServerFn_handler };
