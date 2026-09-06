import type { AiAction, AiPlan, PageElement, Profile } from "./types";
import { ageFromIso, formatBirthFr, formatHolidayDate } from "./utils";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function holidaysBlurb(profile: Profile) {
  if (!profile.holidays?.length) {
    return "Je n’ai pas de dates de fêtes particulières à déclarer.";
  }
  return profile.holidays
    .map((h) => {
      const when = formatHolidayDate(h.month, h.day, h.year);
      return h.notes ? `${h.name} (${when}) — ${h.notes}` : `${h.name} (${when})`;
    })
    .join(" ; ");
}

export function profileAnswer(label: string, profile: Profile): string | null {
  const n = norm(label);
  const age = ageFromIso(profile.birthDate ?? "");

  if (/(prenom|first name)/.test(n)) return profile.firstName || null;
  if (/nom de famille|last name/.test(n) || (/^nom$/.test(n) && !/prenom/.test(n))) {
    return profile.lastName || null;
  }
  if (/nom complet|identite/.test(n)) {
    const full = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
    return full || null;
  }
  if (/e-?mail|courriel|adresse mail/.test(n)) return profile.email || null;
  if (/telephone|tel|phone|mobile/.test(n)) return profile.phone || null;
  if (/ville|city|commune/.test(n)) return profile.city || null;
  if (/pays|country/.test(n)) return profile.country || null;
  if (/metier|profession|occupation|poste/.test(n)) return profile.occupation || null;
  if (/genre|sexe|gender/.test(n)) return profile.gender || null;
  if (/langue/.test(n)) return profile.language || null;
  if (/tranche d age|age/.test(n) && age != null) return String(age);
  if (/naissance|anniversaire|birthday|date de naissance/.test(n)) {
    return profile.birthDate ? formatBirthFr(profile.birthDate) : null;
  }
  if (/fete|ferie|vacance|disponib|date importante|jour special|noel|holiday/.test(n)) {
    return holidaysBlurb(profile);
  }
  if (/(aime|gout|preference|interet|hobby)/.test(n) && !/pas aime/.test(n)) {
    return profile.likes || null;
  }
  if (/deteste|n aime pas|dislike/.test(n)) return profile.dislikes || null;
  if (/commentaire|precision|libre|bio|propos de vous|decrivez/.test(n)) {
    const bits = [profile.bio, holidaysBlurb(profile)].filter(Boolean);
    return bits.join(" ");
  }
  return null;
}

function pickOption(options: string[], wanted: string | null, label: string, profile: Profile) {
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
    if (/25|noel|decembre/.test(nLabel) && noel) {
      return (
        options.find((o) => /non|occupe/.test(norm(o))) ??
        options.find((o) => /oui|disponible/.test(norm(o))) ??
        options[0]
      );
    }
  }

  if (/juillet|vacance/.test(nLabel)) {
    const summer = profile.holidays?.some((h) => h.month === 7);
    if (summer) {
      return (
        options.find((o) => /partie du mois|oui/.test(norm(o))) ??
        options.find((o) => /^oui$/.test(norm(o))) ??
        options[0]
      );
    }
  }

  if (/genre|sexe/.test(nLabel) && profile.gender) {
    const g = norm(profile.gender);
    const hit = options.find((o) => norm(o).includes(g) || g.includes(norm(o)));
    if (hit) return hit;
  }

  const age = ageFromIso(profile.birthDate ?? "");
  if (age != null && /age|tranche/.test(nLabel)) {
    for (const o of options) {
      const m = o.match(/(\d+)\s*[–-]\s*(\d+)/);
      if (m) {
        const a = Number(m[1]);
        const b = Number(m[2]);
        if (age >= a && age <= b) return o;
      }
      if (/65|plus|et plus/.test(norm(o)) && age >= 55) return o;
    }
  }

  const prefer = options.find((o) => /neutre|sans avis|prefere ne pas|autre|peut-etre/.test(norm(o)));
  return prefer ?? options[0];
}

export function planSurvey(elements: PageElement[], profile: Profile): AiPlan {
  const actions: AiAction[] = [];
  for (const el of elements) {
    if (!el.visible || el.disabled) continue;
    if (el.options && el.options.length) {
      const wanted = profileAnswer(el.label, profile);
      const choice = pickOption(el.options, wanted, el.label, profile);
      if (choice) {
        actions.push({
          type: "select",
          targetId: el.id,
          value: choice,
          reason: `Choisir « ${choice} » d’après le profil.`,
        });
      }
    } else if (el.tag === "input" || el.tag === "textarea" || el.kind === "field") {
      const value = profileAnswer(el.label, profile) ?? "";
      if (value) {
        actions.push({
          type: "type",
          targetId: el.id,
          value,
          reason: `Remplir « ${el.label} ».`,
        });
      }
    } else if (el.tag === "button" && /suivant|continuer|envoyer|valider/.test(norm(el.label))) {
      actions.push({
        type: "click",
        targetId: el.id,
        reason: el.label,
      });
    }
  }
  return {
    commentary:
      "Je remplis le sondage avec ton profil, y compris les dates de fêtes enregistrées.",
    actions,
    source: "local",
  };
}

export function planAds(
  elements: PageElement[],
  opts: { skipWhenPossible: boolean },
): AiPlan {
  const actions: AiAction[] = [];
  const play = elements.find((e) => e.kind === "play" && e.visible && !e.disabled);
  const skip = elements.find((e) => e.kind === "skip" && e.visible);
  const close = elements.find((e) => e.kind === "close" && e.visible && !e.disabled);
  const claim = elements.find((e) => e.kind === "claim" && e.visible && !e.disabled);
  const next = elements.find((e) => e.kind === "next" && e.visible && !e.disabled);
  const mute = elements.find((e) => e.kind === "mute" && e.visible && !e.disabled);

  if (claim) {
    actions.push({ type: "click", targetId: claim.id, reason: "Récupérer la récompense." });
    return {
      commentary: "Je détecte les publicités et je les fais défiler toute seules.",
      actions,
      source: "local",
    };
  }
  if (close) {
    actions.push({ type: "click", targetId: close.id, reason: "Fermer l’interstitiel." });
    return {
      commentary: "Je détecte les publicités et je les fais défiler toute seules.",
      actions,
      source: "local",
    };
  }
  if (next) {
    actions.push({ type: "click", targetId: next.id, reason: "Enchaîner sur la pub suivante." });
    return {
      commentary: "Je détecte les publicités et je les fais défiler toute seules.",
      actions,
      source: "local",
    };
  }

  const alreadyMuted = mute && /coupe/.test(mute.label.toLowerCase());
  if (mute && !alreadyMuted) {
    actions.push({ type: "click", targetId: mute.id, reason: "Couper le son de la pub." });
  }
  if (play) {
    actions.push({ type: "click", targetId: play.id, reason: "Lancer la lecture de la publicité." });
  }

  if (skip && opts.skipWhenPossible) {
    if (skip.disabled) {
      actions.push({
        type: "wait",
        waitMs: Math.max(skip.waitMs ?? 1200, 800),
        reason: "Attendre que « Passer » s’active.",
      });
    } else {
      actions.push({ type: "click", targetId: skip.id, reason: "Passer la publicité." });
    }
  } else if (play || (skip && skip.disabled)) {
    const waitEl = elements.find((e) => e.id === "ad-wait-end");
    actions.push({
      type: "wait",
      waitMs: Math.max(skip?.waitMs ?? waitEl?.waitMs ?? 1600, 1200),
      reason: "Laisser la publicité avancer.",
    });
  }

  if (actions.length === 0) {
    actions.push({ type: "wait", waitMs: 900, reason: "Relire l’écran." });
  }

  return {
    commentary: "Je détecte les publicités et je les fais défiler toute seules.",
    actions,
    source: "local",
  };
}

export function profileDigest(profile: Profile) {
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
      langue: profile.language,
    },
    bio: profile.bio,
    aime: profile.likes,
    nAimePas: profile.dislikes,
    fetes: (profile.holidays ?? []).map((h) => ({
      nom: h.name,
      date: formatHolidayDate(h.month, h.day, h.year),
      notes: h.notes,
    })),
  };
}
