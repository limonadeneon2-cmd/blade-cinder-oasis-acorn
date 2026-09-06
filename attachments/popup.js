const ICONS = { click: "🖱️", key: "⌨️", input: "📝", scroll: "↕️", navigate: "↪️" };

// state.recordings et state.playbacks sont des maps { tabId: {...} }.
// state.activeTabId est l'onglet actif DE LA FENÊTRE À LAQUELLE CE POPUP
// APPARTIENT — c'est ce qui permet à chaque fenêtre de montrer/contrôler
// uniquement ce qui se passe chez elle.
let state = { macros: {}, recordings: {}, playbacks: {}, drafts: {}, activeTabId: null };
let editingMacroId = null;

// Ces deux maps gardent en mémoire, le temps de vie du popup, ce que tu es en
// train de configurer mais n'as pas encore validé (nom de brouillon, vitesse
// / ∞ avant de cliquer ▶). Sans ça, un rafraîchissement déclenché par une
// AUTRE fenêtre (ex. une macro qui avance ailleurs) effaçait ce que tu venais
// de taper ou de cocher avant même que tu aies pu valider.
const pendingDraftNames = {}; // { [draftId]: name }
const pendingMacroSettings = {}; // { [macroId]: { speed, loops, infinite } }

const send = (msg) => chrome.runtime.sendMessage(msg);

async function refresh() {
  state = await send({ type: "GET_STATE" });
  renderAll();
}

function renderAll() {
  renderRecording();
  renderDrafts();
  renderMacros();
}

function myRecording() {
  return state.recordings[state.activeTabId] || null;
}
function myPlayback() {
  return state.playbacks[state.activeTabId] || null;
}

// ---------- Enregistrement en cours (sur l'onglet de CETTE fenêtre) ----------

function renderRecording() {
  const dot = document.getElementById("recDot");
  const btn = document.getElementById("toggleRecordBtn");
  const status = document.getElementById("recordStatus");
  const recording = myRecording();
  const playback = myPlayback();

  dot.classList.toggle("live", !!recording);

  if (recording) {
    const n = recording.steps.length;
    btn.textContent = `■ Arrêter (${n} étape${n > 1 ? "s" : ""})`;
    btn.classList.add("active");
    status.textContent = "Navigue normalement : clics, saisie et défilement sont enregistrés sur cet onglet.";
  } else {
    btn.textContent = "● Démarrer l'enregistrement";
    btn.classList.remove("active");
    status.textContent = "";
  }

  btn.disabled = !!playback;
  btn.title = playback ? "Arrête d'abord la lecture en cours sur cet onglet." : "";
}

// ---------- Bande de bobine (chips d'étapes) ----------

function buildChip(step, index, onChangeDelay) {
  const chip = document.createElement("div");
  chip.className = `tape-chip type-${step.type}`;
  chip.title = step.label || step.type;

  const icon = document.createElement("span");
  icon.className = "chip-icon";
  icon.textContent = ICONS[step.type] || "•";
  chip.appendChild(icon);

  const delayWrap = document.createElement("span");
  delayWrap.className = "chip-delay";

  if (onChangeDelay) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = step.delay ?? 0;
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("change", () => {
      const v = Math.max(0, parseInt(input.value, 10) || 0);
      onChangeDelay(index, v);
    });
    delayWrap.appendChild(input);
    delayWrap.appendChild(document.createTextNode(" ms"));
  } else {
    delayWrap.textContent = `${step.delay ?? 0} ms`;
  }

  chip.appendChild(delayWrap);
  return chip;
}

function renderStrip(container, steps, editable, onChangeDelay) {
  container.innerHTML = "";
  steps.forEach((step, i) => container.appendChild(buildChip(step, i, editable ? onChangeDelay : null)));
}

// ---------- Brouillons (macros tout juste enregistrées, en attente d'un nom) ----------
// Il peut y en avoir plusieurs en même temps si plusieurs fenêtres ont
// terminé un enregistrement sans encore sauvegarder.

function renderDrafts() {
  const container = document.getElementById("draftsContainer");
  container.innerHTML = "";
  const tmpl = document.getElementById("draftTemplate");
  const drafts = Object.values(state.drafts).sort((a, b) => a.createdAt - b.createdAt);

  drafts.forEach((draft) => {
    const node = tmpl.content.cloneNode(true);
    const strip = node.querySelector(".draft-strip");
    renderStrip(strip, draft.steps, true, (i, v) => {
      draft.steps[i].delay = v;
      // Persisté tout de suite : si une autre fenêtre déclenche un
      // rafraîchissement avant que tu cliques "Enregistrer", ton ajustement
      // de délai ne doit pas se perdre.
      send({ type: "UPDATE_DRAFT_STEPS", id: draft.id, steps: draft.steps });
    });

    const nameInput = node.querySelector(".draft-name");
    nameInput.value = pendingDraftNames[draft.id] || "";
    nameInput.addEventListener("input", () => {
      pendingDraftNames[draft.id] = nameInput.value;
    });

    node.querySelector(".save-draft-btn").addEventListener("click", async () => {
      const name = nameInput.value.trim() || "Macro sans nom";
      await send({ type: "SAVE_MACRO", name, steps: draft.steps, draftId: draft.id });
      delete pendingDraftNames[draft.id];
      await refresh();
    });
    node.querySelector(".discard-draft-btn").addEventListener("click", async () => {
      await send({ type: "DISCARD_DRAFT", id: draft.id });
      delete pendingDraftNames[draft.id];
      await refresh();
    });

    container.appendChild(node);
  });
}

// ---------- Liste des macros enregistrées (bibliothèque partagée) ----------

function renderMacros() {
  const list = document.getElementById("macroList");
  const empty = document.getElementById("emptyState");
  const macros = Object.values(state.macros).sort((a, b) => b.createdAt - a.createdAt);
  list.innerHTML = "";
  empty.classList.toggle("hidden", macros.length > 0);

  const myRec = myRecording();
  const myPb = myPlayback();

  const tmpl = document.getElementById("macroItemTemplate");
  macros.forEach((macro) => {
    const node = tmpl.content.cloneNode(true);
    const li = node.querySelector(".macro-item");
    li.dataset.id = macro.id;
    node.querySelector(".macro-name").textContent = macro.name;
    const date = new Date(macro.createdAt).toLocaleDateString("fr-CA");
    node.querySelector(".macro-meta").textContent = ` · ${macro.steps.length} étapes · ${date}`;

    const isPlayingThis = !!(myPb && myPb.macroId === macro.id);
    const anotherPlayingHere = !!(myPb && myPb.macroId !== macro.id);

    const playBtn = node.querySelector(".play-btn");
    playBtn.textContent = isPlayingThis ? "■" : "▶";
    playBtn.title = isPlayingThis
      ? "Arrêter la lecture sur cet onglet"
      : "Jouer sur l'onglet actif de cette fenêtre";
    playBtn.classList.toggle("playing", isPlayingThis);
    playBtn.disabled = !!myRec || anotherPlayingHere;
    if (anotherPlayingHere) playBtn.title = "Une autre macro joue déjà sur cet onglet.";
    if (myRec) playBtn.title = "Arrête l'enregistrement sur cet onglet avant de lancer une lecture.";
    playBtn.addEventListener("click", () => onPlayToggle(macro, isPlayingThis));

    const statusEl = node.querySelector(".playback-status");
    if (isPlayingThis) {
      statusEl.classList.remove("hidden");
      let txt = myPb.infinite
        ? `Étape ${myPb.stepIndex} / ${macro.steps.length} · boucle infinie (clique ■ pour arrêter)`
        : `Étape ${myPb.stepIndex} / ${macro.steps.length}`;
      if (myPb.hidden) {
        txt += " ⚠️ cet onglet n'est pas visible à l'écran — Chrome ralentit la lecture";
      }
      statusEl.textContent = txt;
    }

    node.querySelector(".edit-btn").addEventListener("click", () => {
      editingMacroId = editingMacroId === macro.id ? null : macro.id;
      renderMacros();
    });
    node.querySelector(".export-btn").addEventListener("click", () => exportMacro(macro));
    node.querySelector(".delete-btn").addEventListener("click", () => onDelete(macro));

    const speedSelect = node.querySelector(".speed-select");
    const loopInput = node.querySelector(".loop-input");
    const infiniteCb = node.querySelector(".infinite-checkbox");

    if (isPlayingThis) {
      // On affiche et on verrouille les réglages RÉELLEMENT en cours (ils ont
      // été figés au moment du clic sur ▶ et ne peuvent plus changer en
      // route) — sinon la case ∞ semblait "se décocher" alors que la boucle
      // infinie continuait pour de vrai en arrière-plan.
      speedSelect.value = String(myPb.speed);
      speedSelect.disabled = true;
      infiniteCb.checked = !!myPb.infinite;
      infiniteCb.disabled = true;
      loopInput.disabled = true;
      if (myPb.infinite) loopInput.value = "";
    } else {
      // On restaure ce que tu étais en train de configurer AVANT de cliquer
      // ▶ (au cas où un rafraîchissement causé par une autre fenêtre serait
      // survenu entre-temps) — sinon la case ∞ ou la vitesse choisie pouvait
      // se réinitialiser toute seule juste avant que tu cliques sur lecture.
      const pending = pendingMacroSettings[macro.id];
      if (pending) {
        speedSelect.value = pending.speed;
        loopInput.value = pending.loops;
        infiniteCb.checked = pending.infinite;
      }
      speedSelect.disabled = false;
      infiniteCb.disabled = false;
      loopInput.disabled = infiniteCb.checked;
    }

    function savePendingSettings() {
      pendingMacroSettings[macro.id] = {
        speed: speedSelect.value,
        loops: loopInput.value,
        infinite: infiniteCb.checked,
      };
    }
    speedSelect.addEventListener("change", savePendingSettings);
    loopInput.addEventListener("change", savePendingSettings);
    infiniteCb.addEventListener("change", () => {
      loopInput.disabled = infiniteCb.checked;
      savePendingSettings();
    });

    const stripEl = node.querySelector(".macro-strip");
    if (editingMacroId === macro.id) {
      stripEl.classList.add("visible");
      renderStrip(stripEl, macro.steps, true, (i, v) => {
        macro.steps[i].delay = v;
        send({ type: "SAVE_MACRO", id: macro.id, name: macro.name, steps: macro.steps });
      });
    }

    list.appendChild(node);
  });
}

// ---------- Actions ----------

document.getElementById("toggleRecordBtn").addEventListener("click", async () => {
  if (myRecording()) {
    await send({ type: "STOP_RECORDING" });
  } else {
    const res = await send({ type: "START_RECORDING" });
    if (!res.ok) alert(res.error || "Impossible de démarrer l'enregistrement.");
  }
  await refresh();
});

async function onPlayToggle(macro, isPlaying) {
  if (isPlaying) {
    await send({ type: "STOP_PLAYBACK" });
  } else {
    const li = document.querySelector(`.macro-item[data-id="${macro.id}"]`);
    const speed = parseFloat(li.querySelector(".speed-select").value);
    const loops = parseInt(li.querySelector(".loop-input").value, 10) || 1;
    const infinite = li.querySelector(".infinite-checkbox").checked;
    const res = await send({ type: "PLAY_MACRO", id: macro.id, speed, loops, infinite });
    if (!res.ok) {
      alert(res.error || "Impossible de lancer la lecture sur cette page.");
    } else {
      delete pendingMacroSettings[macro.id];
    }
  }
  await refresh();
}

async function onDelete(macro) {
  if (!confirm(`Supprimer la macro « ${macro.name} » ?`)) return;
  await send({ type: "DELETE_MACRO", id: macro.id });
  await refresh();
}

function exportMacro(macro) {
  const blob = new Blob([JSON.stringify(macro, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${macro.name.replace(/[^a-z0-9-_]+/gi, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("importInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const macro = JSON.parse(text);
    if (!macro.steps || !Array.isArray(macro.steps)) throw new Error("format invalide");
    await send({ type: "IMPORT_MACRO", macro: { name: macro.name || "Macro importée", steps: macro.steps } });
    await refresh();
  } catch (err) {
    alert("Ce fichier ne semble pas être une macro Répète-Actions valide.");
  }
  e.target.value = "";
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") refresh();
});

async function initAutoDismissToggle() {
  const { autoDismiss } = await chrome.storage.local.get("autoDismiss");
  const cb = document.getElementById("autoDismissToggle");
  cb.checked = !!autoDismiss;
  cb.addEventListener("change", () => {
    chrome.storage.local.set({ autoDismiss: cb.checked });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();
  initAutoDismissToggle();
});
