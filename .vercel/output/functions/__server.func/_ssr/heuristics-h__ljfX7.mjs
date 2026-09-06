import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/heuristics-h__ljfX7.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
var MONTHS_FR = [
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre"
];
function monthNameFr(month) {
	return MONTHS_FR[(month - 1 + 12) % 12] ?? "";
}
function formatHolidayDate(month, day, year) {
	const base = `${day} ${monthNameFr(month)}`;
	return year ? `${base} ${year}` : `${base} · chaque année`;
}
function ageFromIso(iso) {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	const now = /* @__PURE__ */ new Date();
	let age = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || m === 0 && now.getDate() < d.getDate()) age -= 1;
	return age;
}
function formatBirthFr(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return `${d.getDate()} ${monthNameFr(d.getMonth() + 1)} ${d.getFullYear()}`;
}
function sleep(ms, signal) {
	return new Promise((resolve) => {
		if (signal?.aborted || ms <= 0) {
			resolve();
			return;
		}
		const t = setTimeout(resolve, ms);
		const onAbort = () => {
			clearTimeout(t);
			resolve();
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function norm(s) {
	return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function holidaysBlurb(profile) {
	if (!profile.holidays?.length) return "Je n’ai pas de dates de fêtes particulières à déclarer.";
	return profile.holidays.map((h) => {
		const when = formatHolidayDate(h.month, h.day, h.year);
		return h.notes ? `${h.name} (${when}) — ${h.notes}` : `${h.name} (${when})`;
	}).join(" ; ");
}
function profileAnswer(label, profile) {
	const n = norm(label);
	const age = ageFromIso(profile.birthDate ?? "");
	if (/(prenom|first name)/.test(n)) return profile.firstName || null;
	if (/nom de famille|last name/.test(n) || /^nom$/.test(n) && !/prenom/.test(n)) return profile.lastName || null;
	if (/nom complet|identite/.test(n)) return `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || null;
	if (/e-?mail|courriel|adresse mail/.test(n)) return profile.email || null;
	if (/telephone|tel|phone|mobile/.test(n)) return profile.phone || null;
	if (/ville|city|commune/.test(n)) return profile.city || null;
	if (/pays|country/.test(n)) return profile.country || null;
	if (/metier|profession|occupation|poste/.test(n)) return profile.occupation || null;
	if (/genre|sexe|gender/.test(n)) return profile.gender || null;
	if (/langue/.test(n)) return profile.language || null;
	if (/tranche d age|age/.test(n) && age != null) return String(age);
	if (/naissance|anniversaire|birthday|date de naissance/.test(n)) return profile.birthDate ? formatBirthFr(profile.birthDate) : null;
	if (/fete|ferie|vacance|disponib|date importante|jour special|noel|holiday/.test(n)) return holidaysBlurb(profile);
	if (/(aime|gout|preference|interet|hobby)/.test(n) && !/pas aime/.test(n)) return profile.likes || null;
	if (/deteste|n aime pas|dislike/.test(n)) return profile.dislikes || null;
	if (/commentaire|precision|libre|bio|propos de vous|decrivez/.test(n)) return [profile.bio, holidaysBlurb(profile)].filter(Boolean).join(" ");
	return null;
}
function pickOption(options, wanted, label, profile) {
	if (!options.length) return null;
	const nLabel = norm(label);
	const nWanted = wanted ? norm(wanted) : "";
	if (nWanted) {
		const exact = options.find((o) => norm(o) === nWanted);
		if (exact) return exact;
		const partial = options.find((o) => norm(o).includes(nWanted) || nWanted.includes(norm(o)));
		if (partial) return partial;
	}
	if (/disponible|libre|present/.test(nLabel)) {
		const noel = profile.holidays?.some((h) => h.month === 12 && h.day === 25);
		if (/25|noel|decembre/.test(nLabel) && noel) return options.find((o) => /non|occupe/.test(norm(o))) ?? options.find((o) => /oui|disponible/.test(norm(o))) ?? options[0];
	}
	if (/juillet|vacance/.test(nLabel)) {
		if (profile.holidays?.some((h) => h.month === 7)) return options.find((o) => /partie du mois|oui/.test(norm(o))) ?? options.find((o) => /^oui$/.test(norm(o))) ?? options[0];
	}
	if (/genre|sexe/.test(nLabel) && profile.gender) {
		const g = norm(profile.gender);
		const hit = options.find((o) => norm(o).includes(g) || g.includes(norm(o)));
		if (hit) return hit;
	}
	const age = ageFromIso(profile.birthDate ?? "");
	if (age != null && /age|tranche/.test(nLabel)) for (const o of options) {
		const m = o.match(/(\d+)\s*[–-]\s*(\d+)/);
		if (m) {
			const a = Number(m[1]);
			const b = Number(m[2]);
			if (age >= a && age <= b) return o;
		}
		if (/65|plus|et plus/.test(norm(o)) && age >= 55) return o;
	}
	return options.find((o) => /neutre|sans avis|prefere ne pas|autre|peut-etre/.test(norm(o))) ?? options[0];
}
function planSurvey(elements, profile) {
	const actions = [];
	for (const el of elements) {
		if (!el.visible || el.disabled) continue;
		if (el.options && el.options.length) {
			const wanted = profileAnswer(el.label, profile);
			const choice = pickOption(el.options, wanted, el.label, profile);
			if (choice) actions.push({
				type: "select",
				targetId: el.id,
				value: choice,
				reason: `Choisir « ${choice} » d’après le profil.`
			});
		} else if (el.tag === "input" || el.tag === "textarea" || el.kind === "field") {
			const value = profileAnswer(el.label, profile) ?? "";
			if (value) actions.push({
				type: "type",
				targetId: el.id,
				value,
				reason: `Remplir « ${el.label} ».`
			});
		} else if (el.tag === "button" && /suivant|continuer|envoyer|valider/.test(norm(el.label))) actions.push({
			type: "click",
			targetId: el.id,
			reason: el.label
		});
	}
	return {
		commentary: "Je remplis le sondage avec ton profil, y compris les dates de fêtes enregistrées.",
		actions,
		source: "local"
	};
}
function planAds(elements, opts) {
	const actions = [];
	const play = elements.find((e) => e.kind === "play" && e.visible && !e.disabled);
	const skip = elements.find((e) => e.kind === "skip" && e.visible);
	const close = elements.find((e) => e.kind === "close" && e.visible && !e.disabled);
	const claim = elements.find((e) => e.kind === "claim" && e.visible && !e.disabled);
	const next = elements.find((e) => e.kind === "next" && e.visible && !e.disabled);
	const mute = elements.find((e) => e.kind === "mute" && e.visible && !e.disabled);
	if (claim) {
		actions.push({
			type: "click",
			targetId: claim.id,
			reason: "Récupérer la récompense."
		});
		return {
			commentary: "Je détecte les publicités et je les fais défiler toute seules.",
			actions,
			source: "local"
		};
	}
	if (close) {
		actions.push({
			type: "click",
			targetId: close.id,
			reason: "Fermer l’interstitiel."
		});
		return {
			commentary: "Je détecte les publicités et je les fais défiler toute seules.",
			actions,
			source: "local"
		};
	}
	if (next) {
		actions.push({
			type: "click",
			targetId: next.id,
			reason: "Enchaîner sur la pub suivante."
		});
		return {
			commentary: "Je détecte les publicités et je les fais défiler toute seules.",
			actions,
			source: "local"
		};
	}
	const alreadyMuted = mute && /coupe/.test(mute.label.toLowerCase());
	if (mute && !alreadyMuted) actions.push({
		type: "click",
		targetId: mute.id,
		reason: "Couper le son de la pub."
	});
	if (play) actions.push({
		type: "click",
		targetId: play.id,
		reason: "Lancer la lecture de la publicité."
	});
	if (skip && opts.skipWhenPossible) {
		if (skip.disabled) actions.push({
			type: "wait",
			waitMs: Math.max(skip.waitMs ?? 1200, 800),
			reason: "Attendre que « Passer » s’active."
		});
		else actions.push({
			type: "click",
			targetId: skip.id,
			reason: "Passer la publicité."
		});
	} else if (play || skip && skip.disabled) {
		const waitEl = elements.find((e) => e.id === "ad-wait-end");
		actions.push({
			type: "wait",
			waitMs: Math.max(skip?.waitMs ?? waitEl?.waitMs ?? 1600, 1200),
			reason: "Laisser la publicité avancer."
		});
	}
	if (actions.length === 0) actions.push({
		type: "wait",
		waitMs: 900,
		reason: "Relire l’écran."
	});
	return {
		commentary: "Je détecte les publicités et je les fais défiler toute seules.",
		actions,
		source: "local"
	};
}
function profileDigest(profile) {
	const age = ageFromIso(profile.birthDate ?? "");
	return {
		identite: {
			prenom: profile.firstName,
			nom: profile.lastName,
			email: profile.email,
			telephone: profile.phone,
			naissance: profile.birthDate ? formatBirthFr(profile.birthDate) : "",
			age: age ?? "",
			ville: profile.city,
			pays: profile.country,
			metier: profile.occupation,
			genre: profile.gender,
			langue: profile.language
		},
		bio: profile.bio,
		aime: profile.likes,
		nAimePas: profile.dislikes,
		fetes: (profile.holidays ?? []).map((h) => ({
			nom: h.name,
			date: formatHolidayDate(h.month, h.day, h.year),
			notes: h.notes
		}))
	};
}
//#endregion
export { planSurvey as a, uid as c, planAds as i, formatHolidayDate as n, profileDigest as o, monthNameFr as r, sleep as s, cn as t };
