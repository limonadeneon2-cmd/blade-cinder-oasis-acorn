// content.js
// Injecté dans chaque page. Deux rôles possibles selon ce que dit le
// background : (1) enregistreur — écoute clics / saisie / défilement, ou
// (2) lecteur — rejoue une liste d'étapes. Comme une page peut se recharger
// pendant l'enregistrement ou la lecture (navigation), ce script redemande
// son rôle à chaque chargement via CONTENT_READY.
//
// Tout est enveloppé dans une IIFE avec un garde-fou (window.__repeatActionsLoaded)
// parce que le background peut, en secours, réinjecter ce fichier manuellement
// dans un onglet déjà ouvert (voir ensureContentScript côté background) — sans
// ce garde-fou, une double injection dupliquerait les écouteurs d'événements.

(function () {
  if (window.__repeatActionsLoaded) return;
  window.__repeatActionsLoaded = true;

  let scrollDebounce = null;

// ---------- Sélecteur CSS ----------

function getSelector(el) {
  if (!(el instanceof Element)) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  const path = [];
  let node = el;
  while (node && node.nodeType === 1 && path.length < 6) {
    if (node.id) {
      path.unshift(`#${CSS.escape(node.id)}`);
      break;
    }
    let part = node.tagName.toLowerCase();
    const classes = Array.from(node.classList || []).slice(0, 2);
    if (classes.length) part += "." + classes.map((c) => CSS.escape(c)).join(".");
    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((s) => s.tagName === node.tagName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
    }
    path.unshift(part);
    node = parent;
  }
  return path.join(" > ");
}

function describe(el) {
  const text = (el.innerText || el.value || el.getAttribute?.("aria-label") || "").trim();
  return text ? text.slice(0, 40) : el.tagName?.toLowerCase() || "élément";
}

// ---------- Enregistrement ----------

function recordStep(step) {
  chrome.runtime.sendMessage({ type: "RECORD_STEP", step }).catch(() => {});
}

function onClick(e) {
  if (window.__repeatActionsRunning) return;
  const el = e.target;
  if (!(el instanceof Element)) return;
  const rect = el.getBoundingClientRect();
  const fracX = rect.width ? (e.clientX - rect.left) / rect.width : 0.5;
  const fracY = rect.height ? (e.clientY - rect.top) / rect.height : 0.5;
  recordStep({
    type: "click",
    selector: getSelector(el),
    fracX,
    fracY,
    label: `Clic — ${describe(el)}`,
  });
}

const SPECIAL_KEYS = new Set([
  "Enter", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Backspace", "Delete", " ", "Home", "End", "PageUp", "PageDown",
]);

function onKeydown(e) {
  if (window.__repeatActionsRunning) return;
  const isShortcut = e.ctrlKey || e.metaKey || e.altKey;
  if (!SPECIAL_KEYS.has(e.key) && !isShortcut) return; // le texte normal est capté par "input"
  recordStep({
    type: "key",
    key: e.key,
    code: e.code,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
    selector: getSelector(e.target),
    label: `Touche — ${e.key}`,
  });
}

function onInput(e) {
  if (window.__repeatActionsRunning) return;
  const el = e.target;
  const isEditable = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
  if (!isEditable) return;
  const value = el.isContentEditable ? el.innerText : el.value;
  recordStep({
    type: "input",
    selector: getSelector(el),
    value,
    label: `Saisie — ${describe(el)}`,
  });
}

function onScroll() {
  if (window.__repeatActionsRunning) return;
  clearTimeout(scrollDebounce);
  scrollDebounce = setTimeout(() => {
    recordStep({
      type: "scroll",
      x: window.scrollX,
      y: window.scrollY,
      label: `Défilement (${window.scrollX}, ${window.scrollY})`,
    });
  }, 200);
}

function attachRecorder() {
  document.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKeydown, true);
  document.addEventListener("input", onInput, true);
  window.addEventListener("scroll", onScroll, true);
}

function detachRecorder() {
  document.removeEventListener("click", onClick, true);
  document.removeEventListener("keydown", onKeydown, true);
  document.removeEventListener("input", onInput, true);
  window.removeEventListener("scroll", onScroll, true);
  clearTimeout(scrollDebounce);
}

// ---------- Lecture ----------
//
// La minuterie utilise un Worker dédié quand c'est possible : Chrome ralentit
// exprès les setTimeout/setInterval des onglets qui ne sont PAS visibles à
// l'écran (économie de batterie) — après plusieurs minutes caché, ça peut
// tomber à environ une fois par minute, ce qui donne l'impression que
// l'extension "s'est mise en veille". Un Worker n'a pas cette pénalité sur la
// plupart des versions de Chrome. Si le Worker ne peut pas être créé (CSP
// stricte du site), on retombe simplement sur un setTimeout normal.

let timerWorker = null; // null = pas encore essayé, false = indisponible, sinon le Worker
const pendingSleeps = new Map();

function getTimerWorker() {
  if (timerWorker !== null) return timerWorker;
  try {
    const code = "onmessage=(e)=>{const{id,ms}=e.data;setTimeout(()=>postMessage({id}),ms);};";
    const blob = new Blob([code], { type: "application/javascript" });
    const w = new Worker(URL.createObjectURL(blob));
    w.onmessage = (e) => {
      const resolve = pendingSleeps.get(e.data.id);
      if (resolve) {
        pendingSleeps.delete(e.data.id);
        resolve();
      }
    };
    w.onerror = () => {
      timerWorker = false; // le Worker a planté (CSP, etc.) — on repasse en mode normal
    };
    timerWorker = w;
  } catch (e) {
    timerWorker = false;
  }
  return timerWorker;
}

let sleepSeq = 0;
let cancelCurrentSleep = null;

function sleep(ms) {
  return new Promise((resolve) => {
    const worker = getTimerWorker();
    const id = ++sleepSeq;
    const finish = () => {
      pendingSleeps.delete(id);
      cancelCurrentSleep = null;
      resolve();
    };
    if (worker) {
      pendingSleeps.set(id, finish);
      worker.postMessage({ id, ms });
    } else {
      setTimeout(finish, ms);
    }
    cancelCurrentSleep = finish;
  });
}

// Permet au clic sur ■ (STOP_RUNNING) d'interrompre immédiatement une attente
// en cours, au lieu de devoir patienter jusqu'à la fin du délai (utile
// surtout si une étape a un long délai personnalisé).
function cancelSleep() {
  if (cancelCurrentSleep) cancelCurrentSleep();
}

function setNativeValue(el, value) {
  const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
}

async function executeStep(step) {
  switch (step.type) {
    case "click": {
      const el = document.querySelector(step.selector);
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width * (step.fracX ?? 0.5);
      const y = rect.top + rect.height * (step.fracY ?? 0.5);
      const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
      el.dispatchEvent(new MouseEvent("mousedown", opts));
      el.dispatchEvent(new MouseEvent("mouseup", opts));
      el.click(); // déclenche aussi les actions par défaut (suivre un lien, cocher une case…)
      break;
    }
    case "input": {
      const el = document.querySelector(step.selector);
      if (!el) return;
      if (el.isContentEditable) {
        el.innerText = step.value;
      } else {
        setNativeValue(el, step.value);
      }
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      break;
    }
    case "key": {
      const el = document.querySelector(step.selector) || document.activeElement || document.body;
      const base = {
        key: step.key,
        code: step.code,
        ctrlKey: step.ctrlKey,
        shiftKey: step.shiftKey,
        altKey: step.altKey,
        metaKey: step.metaKey,
        bubbles: true,
        cancelable: true,
      };
      el.dispatchEvent(new KeyboardEvent("keydown", base));
      el.dispatchEvent(new KeyboardEvent("keyup", base));
      break;
    }
    case "scroll":
      window.scrollTo({ top: step.y, left: step.x, behavior: "auto" });
      break;
    case "navigate":
      // Informatif seulement : la navigation s'est déjà produite (ou se
      // produira) suite au clic précédent.
      break;
  }
}

// IMPORTANT : la boucle (infinie ou avec un nombre de répétitions) tourne
// ENTIÈREMENT ici, dans la page — elle ne redemande plus au background de la
// relancer à chaque tour. Avant, chaque fin de tour envoyait un message au
// background qui devait renvoyer un nouveau RUN_STEPS ; si ce seul aller-retour
// échouait ne serait-ce qu'une fois (service worker endormi, minuscule
// problème réseau interne…), la boucle mourait silencieusement — l'icône
// affichait encore "en lecture" mais plus rien ne se passait. En gardant tout
// dans la même fonction, il n'y a plus cet aller-retour à chaque tour.
async function runSteps(steps, fromIndex, speed, infinite, loopsLeft) {
  window.__repeatActionsRunning = true;
  let idx = fromIndex;
  let remaining = loopsLeft || 0;

  while (window.__repeatActionsRunning) {
    while (idx < steps.length) {
      if (!window.__repeatActionsRunning) return;
      const step = steps[idx];
      const delay = Math.min(Math.max((step.delay || 0) / (speed || 1), 0), 15000);
      await sleep(delay);
      if (!window.__repeatActionsRunning) return;
      try {
        await executeStep(step);
      } catch (err) {
        console.warn("Répète-Actions : étape ignorée", step, err);
      }
      idx += 1;
      // On signale la progression après chaque étape : si elle vient de
      // déclencher une navigation, ce script sera détruit et la prochaine
      // page saura par où reprendre (voir CONTENT_READY côté background).
      chrome.runtime.sendMessage({
        type: "PLAYBACK_PROGRESS",
        index: idx,
        loopsLeft: remaining,
        hidden: document.hidden,
      }).catch(() => {});
    }
    if (infinite) {
      idx = 0;
      continue;
    }
    if (remaining > 0) {
      remaining -= 1;
      idx = 0;
      continue;
    }
    break;
  }

  window.__repeatActionsRunning = false;
  chrome.runtime.sendMessage({ type: "PLAYBACK_FINISHED" }).catch(() => {});
}

// ---------- Messages ----------

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "START_LISTEN":
      attachRecorder();
      sendResponse({ ok: true });
      break;
    case "STOP_LISTEN":
      detachRecorder();
      sendResponse({ ok: true });
      break;
    case "RUN_STEPS":
      runSteps(msg.steps, msg.fromIndex, msg.speed, msg.infinite, msg.loopsLeft);
      sendResponse({ ok: true });
      break;
    case "STOP_RUNNING":
      window.__repeatActionsRunning = false;
      cancelSleep();
      sendResponse({ ok: true });
      break;
    default:
      sendResponse({ ok: false });
  }
  return true;
});

// ---------- Démarrage : on demande au background ce qu'on doit faire ----------

(async function init() {
  try {
    const res = await chrome.runtime.sendMessage({ type: "CONTENT_READY", url: location.href });
    if (!res) return;
    if (res.resume === "record") attachRecorder();
    else if (res.resume === "play") runSteps(res.steps, res.fromIndex, res.speed, res.infinite, res.loopsLeft);
  } catch (e) {
    // Le background n'est pas encore prêt (rare) — on ignore.
  }
})();

// ---------- Assistant anti-pop-up (générique — ne touche jamais aux publicités) ----------
// Tourne indépendamment de l'enregistrement/lecture, sur toutes les pages, si
// l'interrupteur est activé dans le popup. Reconnaît des motifs habituels de
// bannières/fenêtres (cookies, "Fermer", "Non merci"...) par sélecteur et par
// texte de bouton — aucune clé API, aucun appel externe.

let dismissInterval = null;
const dismissedElements = new WeakSet();

const DISMISS_SELECTORS = [
  '[aria-label="Close" i]',
  '[aria-label="Fermer" i]',
  ".modal-close",
  ".popup-close",
  ".overlay-close",
  ".close-button",
  "button.close",
  '[class*="btn-close"]',
  '[class*="dismiss"]',
];

const DISMISS_TEXT = /^(fermer|close|no,? thanks|non merci|skip|passer|j'accepte|tout accepter|accepter et fermer|continuer sans accepter|reject all|tout refuser|refuser|×|✕|x|ok)$/i;

function isVisible(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  const style = getComputedStyle(el);
  return style.visibility !== "hidden" && style.display !== "none";
}

// Le motif de texte générique ("OK", "Fermer", "x"...) est beaucoup trop
// courant sur un site normal pour cliquer dessus partout sur la page — on ne
// l'utilise donc QUE si le bouton est visiblement à l'intérieur d'une fenêtre
// superposée (rôle dialog, classes/ids évocateurs, ou positionnement
// fixe/absolu avec un z-index élevé, typique des modales et bannières).
function isLikelyOverlayContext(el) {
  let node = el;
  for (let depth = 0; depth < 8 && node; depth++) {
    if (node.getAttribute) {
      const role = (node.getAttribute("role") || "").toLowerCase();
      if (role === "dialog" || role === "alertdialog") return true;
    }
    const cls = typeof node.className === "string" ? node.className.toLowerCase() : "";
    const id = (node.id || "").toLowerCase();
    if (/(modal|overlay|popup|dialog|backdrop|cookie|consent|gdpr|newsletter|banner)/.test(cls + " " + id)) {
      return true;
    }
    if (node.nodeType === 1) {
      const style = getComputedStyle(node);
      const z = parseInt(style.zIndex, 10);
      if ((style.position === "fixed" || style.position === "absolute") && !Number.isNaN(z) && z >= 999) {
        return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

function tryDismissOverlays() {
  DISMISS_SELECTORS.forEach((sel) => {
    let found;
    try {
      found = document.querySelectorAll(sel);
    } catch (e) {
      return; // sélecteur non supporté par ce navigateur — on ignore
    }
    found.forEach((el) => {
      if (!dismissedElements.has(el) && isVisible(el)) {
        dismissedElements.add(el);
        try { el.click(); } catch (e) {}
      }
    });
  });

  document.querySelectorAll('button, a, [role="button"]').forEach((el) => {
    if (dismissedElements.has(el)) return;
    const txt = (el.innerText || "").trim();
    if (txt && txt.length <= 22 && DISMISS_TEXT.test(txt) && isVisible(el) && isLikelyOverlayContext(el)) {
      dismissedElements.add(el);
      try { el.click(); } catch (e) {}
    }
  });
}

function startAutoDismiss() {
  if (dismissInterval) return;
  dismissInterval = setInterval(tryDismissOverlays, 1500);
}

function stopAutoDismiss() {
  clearInterval(dismissInterval);
  dismissInterval = null;
}

chrome.storage.local.get("autoDismiss", (data) => {
  if (data.autoDismiss) startAutoDismiss();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.autoDismiss) {
    if (changes.autoDismiss.newValue) startAutoDismiss();
    else stopAutoDismiss();
  }
});
})();
