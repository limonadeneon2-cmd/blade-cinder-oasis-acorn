// background.js
// Rôle : le "chef d'orchestre". Il garde en mémoire (chrome.storage.local)
// l'état d'enregistrement et de lecture — mais IMPORTANT : cet état est classé
// PAR ONGLET (une "map" tabId -> état), pas un état unique pour toute
// l'extension. C'est ce qui permet à deux fenêtres (ou plus) de faire tourner
// des macros différentes — ou la même macro — en même temps, chacune
// indépendamment.
//
// Les macros elles-mêmes (la bibliothèque) restent partagées entre tous les
// onglets : une macro enregistrée dans l'onglet A est disponible pour être
// jouée dans l'onglet B, C, etc., simultanément si on veut.

const DEFAULT_SPEED = 1;

// ---------- Stockage ----------

async function getAll() {
  const data = await chrome.storage.local.get(["macros", "recordings", "playbacks", "drafts"]);
  return {
    macros: data.macros || {},
    recordings: data.recordings || {}, // { [tabId]: {active, tabId, steps, lastTs, lastUrl} }
    playbacks: data.playbacks || {},   // { [tabId]: {active, tabId, macroId, stepIndex, speed, loopsLeft} }
    drafts: data.drafts || {},         // { [draftId]: {id, steps, createdAt} }
  };
}

function applyBadge(tabId, isRecording, isPlaying) {
  if (isRecording) {
    chrome.action.setBadgeBackgroundColor({ color: "#E5484D", tabId });
    chrome.action.setBadgeText({ text: "REC", tabId });
  } else if (isPlaying) {
    chrome.action.setBadgeBackgroundColor({ color: "#4FD1C5", tabId });
    chrome.action.setBadgeText({ text: "▶", tabId });
  } else {
    chrome.action.setBadgeText({ text: "", tabId });
  }
}

async function setRecording(tabId, recording) {
  const { recordings, playbacks } = await getAll();
  if (recording) recordings[tabId] = recording;
  else delete recordings[tabId];
  await chrome.storage.local.set({ recordings });
  applyBadge(tabId, !!recording, !!playbacks[tabId]);
}

async function setPlayback(tabId, playback) {
  const { recordings, playbacks } = await getAll();
  if (playback) playbacks[tabId] = playback;
  else delete playbacks[tabId];
  await chrome.storage.local.set({ playbacks });
  applyBadge(tabId, !!recordings[tabId], !!playback);
}

// Le service worker n'a pas de "fenêtre à lui" : on demande donc l'onglet
// actif de la fenêtre actuellement au premier plan. Comme ouvrir le popup
// d'une fenêtre met automatiquement cette fenêtre au premier plan, ça pointe
// toujours vers le bon onglet — celui que l'utilisateur regarde dans LA
// fenêtre où il vient de cliquer sur l'icône de l'extension.
function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => resolve(tabs[0]));
  });
}

// Un onglet ouvert AVANT l'installation ou le rechargement de l'extension n'a
// personne à l'écoute (le script de contenu ne s'attache qu'aux pages qui se
// chargent après coup) — chrome.tabs.sendMessage échoue alors avec "Could not
// establish connection". Dans ce cas, on injecte le script manuellement : il
// va lui-même consulter l'état déjà enregistré (recording/playback pour cet
// onglet) et reprendre tout seul, donc pas besoin de renvoyer le message.
async function ensureContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return true;
  } catch (e) {
    return false; // page protégée par Chrome (chrome://, Web Store, PDF interne…)
  }
}

async function sendOrInject(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
    return true;
  } catch (e) {
    return ensureContentScript(tabId);
  }
}

// ---------- Aiguillage des messages ----------

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender).then(sendResponse);
  return true; // réponse asynchrone
});

async function handleMessage(msg, sender) {
  switch (msg.type) {
    case "GET_STATE": {
      const all = await getAll();
      const tab = await getActiveTab();
      return { ...all, activeTabId: tab ? tab.id : null };
    }

    case "START_RECORDING": {
      const tab = await getActiveTab();
      if (!tab) return { ok: false, error: "Aucun onglet actif." };
      const { playbacks } = await getAll();
      if (playbacks[tab.id]) {
        return { ok: false, error: "Une macro joue déjà sur cet onglet — arrête-la d'abord." };
      }
      const recording = { active: true, tabId: tab.id, steps: [], lastTs: Date.now(), lastUrl: tab.url };
      await setRecording(tab.id, recording);
      const started = await sendOrInject(tab.id, { type: "START_LISTEN" });
      if (!started) {
        await setRecording(tab.id, null);
        return { ok: false, error: "Impossible de démarrer l'enregistrement sur cette page (page protégée par Chrome, comme chrome:// ou le Web Store)." };
      }
      return { ok: true };
    }

    case "STOP_RECORDING": {
      const tab = await getActiveTab();
      if (!tab) return { ok: false, error: "Aucun onglet actif." };
      const { recordings, drafts } = await getAll();
      const recording = recordings[tab.id];
      if (recording) {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: "STOP_LISTEN" });
        } catch (e) {}
      }
      const steps = recording ? recording.steps : [];
      await setRecording(tab.id, null);
      if (steps.length === 0) return { ok: true, draftId: null };
      const draftId = `draft_${Date.now()}`;
      drafts[draftId] = { id: draftId, steps, createdAt: Date.now() };
      await chrome.storage.local.set({ drafts });
      return { ok: true, draftId };
    }

    case "UPDATE_DRAFT_STEPS": {
      const { drafts } = await getAll();
      if (drafts[msg.id]) {
        drafts[msg.id].steps = msg.steps;
        await chrome.storage.local.set({ drafts });
      }
      return { ok: true };
    }

    case "DISCARD_DRAFT": {
      const { drafts } = await getAll();
      delete drafts[msg.id];
      await chrome.storage.local.set({ drafts });
      return { ok: true };
    }

    case "SAVE_MACRO": {
      const { macros, drafts } = await getAll();
      const id = msg.id || `macro_${Date.now()}`;
      macros[id] = {
        id,
        name: msg.name || "Macro sans nom",
        steps: msg.steps || [],
        createdAt: macros[id]?.createdAt || Date.now(),
      };
      await chrome.storage.local.set({ macros });
      if (msg.draftId) {
        delete drafts[msg.draftId];
        await chrome.storage.local.set({ drafts });
      }
      return { ok: true, id };
    }

    case "DELETE_MACRO": {
      const { macros, playbacks } = await getAll();
      delete macros[msg.id];
      await chrome.storage.local.set({ macros });
      // Si cette macro est en train de jouer quelque part, on arrête proprement
      // ces onglets — sinon ils restent "bloqués" à croire qu'une lecture est
      // toujours en cours, sans plus rien pour l'arrêter depuis le popup.
      for (const [tabIdStr, pb] of Object.entries(playbacks)) {
        if (pb.macroId === msg.id) {
          const tid = Number(tabIdStr);
          try {
            await chrome.tabs.sendMessage(tid, { type: "STOP_RUNNING" });
          } catch (e) {}
          await setPlayback(tid, null);
        }
      }
      return { ok: true };
    }

    case "PLAY_MACRO": {
      const { macros, recordings } = await getAll();
      const macro = macros[msg.id];
      if (!macro) return { ok: false, error: "Macro introuvable." };
      const tab = await getActiveTab();
      if (!tab) return { ok: false, error: "Aucun onglet actif." };
      if (recordings[tab.id]) {
        return { ok: false, error: "Arrête l'enregistrement sur cet onglet avant de lancer une lecture." };
      }
      const playback = {
        active: true,
        tabId: tab.id,
        macroId: msg.id,
        stepIndex: 0,
        speed: msg.speed || DEFAULT_SPEED,
        infinite: !!msg.infinite,
        loopsLeft: msg.infinite ? 0 : (msg.loops || 1) - 1,
      };
      await setPlayback(tab.id, playback);
      const started = await sendOrInject(tab.id, {
        type: "RUN_STEPS",
        steps: macro.steps,
        fromIndex: 0,
        speed: playback.speed,
        infinite: playback.infinite,
        loopsLeft: playback.loopsLeft,
      });
      if (!started) {
        await setPlayback(tab.id, null);
        return { ok: false, error: "Impossible de lancer la lecture sur cette page (page protégée par Chrome, comme chrome:// ou le Web Store)." };
      }
      return { ok: true };
    }

    case "STOP_PLAYBACK": {
      const tab = await getActiveTab();
      if (!tab) return { ok: false };
      const { playbacks } = await getAll();
      if (playbacks[tab.id]) {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: "STOP_RUNNING" });
        } catch (e) {}
      }
      await setPlayback(tab.id, null);
      return { ok: true };
    }

    case "IMPORT_MACRO": {
      const { macros } = await getAll();
      const id = `macro_${Date.now()}`;
      macros[id] = { ...msg.macro, id, createdAt: Date.now() };
      await chrome.storage.local.set({ macros });
      return { ok: true, id };
    }

    // ----- Messages en provenance d'un content script (toujours scopés à sender.tab.id) -----

    case "CONTENT_READY": {
      const tabId = sender.tab?.id;
      const { recordings, playbacks, macros } = await getAll();

      const recording = recordings[tabId];
      if (recording && recording.active) {
        if (recording.lastUrl !== msg.url) {
          recording.steps.push({
            type: "navigate",
            url: msg.url,
            delay: Date.now() - recording.lastTs,
            label: "Navigation vers une nouvelle page",
          });
          recording.lastTs = Date.now();
          recording.lastUrl = msg.url;
          await setRecording(tabId, recording);
        }
        return { resume: "record" };
      }

      const playback = playbacks[tabId];
      if (playback && playback.active) {
        const macro = macros[playback.macroId];
        if (macro) {
          return {
            resume: "play",
            steps: macro.steps,
            fromIndex: playback.stepIndex,
            speed: playback.speed,
            infinite: playback.infinite,
            loopsLeft: playback.loopsLeft,
          };
        }
      }

      return { resume: "none" };
    }

    case "RECORD_STEP": {
      const tabId = sender.tab?.id;
      const { recordings } = await getAll();
      const recording = recordings[tabId];
      if (!recording || !recording.active) return { ok: false };
      const now = Date.now();
      const step = { ...msg.step, delay: now - recording.lastTs };
      recording.steps.push(step);
      recording.lastTs = now;
      await setRecording(tabId, recording);
      return { ok: true, count: recording.steps.length };
    }

    case "PLAYBACK_PROGRESS": {
      const tabId = sender.tab?.id;
      const { playbacks } = await getAll();
      const playback = playbacks[tabId];
      if (!playback) return { ok: false };
      playback.stepIndex = msg.index;
      if (typeof msg.loopsLeft === "number") playback.loopsLeft = msg.loopsLeft;
      if (typeof msg.hidden === "boolean") playback.hidden = msg.hidden;
      await setPlayback(tabId, playback);
      return { ok: true };
    }

    case "PLAYBACK_FINISHED": {
      // La boucle (répétitions ou infinie) est maintenant entièrement gérée
      // dans content.js lui-même — ce message ne veut dire qu'une chose :
      // "c'est vraiment terminé (ou arrêté)". Il n'y a donc plus de
      // renvoi de RUN_STEPS ici, plus de point de défaillance silencieux
      // entre deux tours de boucle.
      const tabId = sender.tab?.id;
      await setPlayback(tabId, null);
      return { ok: true };
    }

    default:
      return { ok: false, error: "Message inconnu." };
  }
}

// Si un onglet qui enregistre ou joue se ferme, on nettoie son entrée pour ne
// pas laisser une "carte" fantôme dans le stockage.
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { recordings, playbacks } = await getAll();
  if (recordings[tabId]) {
    delete recordings[tabId];
    await chrome.storage.local.set({ recordings });
  }
  if (playbacks[tabId]) {
    delete playbacks[tabId];
    await chrome.storage.local.set({ playbacks });
  }
});
