"use client";

import { useRef, useState } from "react";
import { Circle, Download, Play, Square, Trash2, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { BrowserFrame, type BrowserFrameHandle } from "./browser-frame";
import { ShopSite } from "./fake-sites/shop";
import { TapeStrip } from "./tape-strip";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { runMacroSteps } from "@/lib/engine";
import { useStudio } from "@/lib/store";
import type { Macro } from "@/lib/types";

const SPEEDS = [
  { v: 0.25, l: "0,25×" },
  { v: 0.5, l: "0,5×" },
  { v: 1, l: "1×" },
  { v: 2, l: "2×" },
  { v: 5, l: "5×" },
  { v: 100, l: "Instant" },
];

export function StudioPanel() {
  const frameRef = useRef<BrowserFrameHandle>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftNames, setDraftNames] = useState<Record<string, string>>({});

  const recording = useStudio((s) => s.recording);
  const playing = useStudio((s) => s.playing);
  const liveSteps = useStudio((s) => s.liveSteps);
  const drafts = useStudio((s) => s.drafts);
  const macros = useStudio((s) => s.macros);
  const speed = useStudio((s) => s.speed);
  const loops = useStudio((s) => s.loops);
  const infinite = useStudio((s) => s.infinite);
  const playingMacroId = useStudio((s) => s.playingMacroId);
  const stepIndex = useStudio((s) => s.stepIndex);
  const autoDismiss = useStudio((s) => s.autoDismiss);
  const {
    setRecording,
    stopRecording,
    saveDraft,
    discardDraft,
    updateDraftSteps,
    saveMacro,
    deleteMacro,
    setPlayback,
    setSpeed,
    setLoops,
    setInfinite,
    setAutoDismiss,
    log,
  } = useStudio();

  function toggleRecord() {
    if (playing) return;
    if (recording) {
      stopRecording();
      log("ok", "Enregistrement arrêté.");
    } else {
      setResetKey((k) => k + 1);
      setRecording(true);
      log("info", "Enregistrement lancé — clique et saisis dans la boutique.");
    }
  }

  async function playMacro(macro: Macro) {
    if (recording) return;
    if (playing && playingMacroId === macro.id) {
      abortRef.current?.abort();
      setPlayback({ playing: false, playingMacroId: null });
      return;
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setResetKey((k) => k + 1);
    setPlayback({ playing: true, playingMacroId: macro.id, stepIndex: 0 });
    log("info", `Lecture — ${macro.name}`);
    await new Promise((r) => window.setTimeout(r, 50));
    const fresh = frameRef.current?.host();
    if (!fresh) {
      setPlayback({ playing: false, playingMacroId: null });
      return;
    }
    try {
      let remaining = infinite ? Number.POSITIVE_INFINITY : Math.max(1, loops);
      while (!ac.signal.aborted && remaining > 0) {
        await runMacroSteps(fresh, macro.steps, 0, speed, ac.signal, (i) =>
          setPlayback({ stepIndex: i }),
        );
        remaining -= 1;
      }
      if (!ac.signal.aborted) log("ok", "Lecture terminée.");
    } finally {
      setPlayback({ playing: false, playingMacroId: null, stepIndex: 0 });
    }
  }

  function exportMacro(macro: Macro) {
    const blob = new Blob([JSON.stringify(macro, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${macro.name.replace(/[^a-z0-9-_]+/gi, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(file: File) {
    try {
      const macro = JSON.parse(await file.text()) as Macro;
      if (!Array.isArray(macro.steps)) throw new Error("format");
      saveMacro({
        ...macro,
        id: `macro_${Date.now()}`,
        name: macro.name || "Macro importée",
        createdAt: Date.now(),
      });
      toast.success("Macro importée");
    } catch {
      toast.error("Fichier de macro invalide");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <Button
            variant={recording ? "outline" : "record"}
            className="w-full"
            disabled={playing}
            onClick={toggleRecord}
          >
            {recording ? (
              <>
                <Square className="size-3.5 fill-current" />
                Arrêter ({liveSteps.length} étape{liveSteps.length > 1 ? "s" : ""})
              </>
            ) : (
              <>
                <Circle className="size-3 fill-current" />
                Démarrer l’enregistrement
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            {recording
              ? "Navigue dans la boutique : clics et saisies sont enregistrés."
              : "La macro se joue sur la page démo, comme l’extension sur un vrai onglet."}
          </p>
          {recording && liveSteps.length > 0 ? <TapeStrip steps={liveSteps} /> : null}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Assistant anti-pop-up
            </p>
            <Switch checked={autoDismiss} onCheckedChange={setAutoDismiss} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ferme les bannières type cookies / « fermer » pendant la lecture. Ne touche pas aux
            publicités — ça, c’est le mode Pubs.
          </p>
        </div>

        {drafts.map((d) => (
          <div key={d.id} className="rounded-xl border border-primary/30 bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
              Nouvelle macro
            </p>
            <Input
              className="mt-2"
              placeholder="Nom (ex. Connexion au site)"
              value={draftNames[d.id] ?? ""}
              onChange={(e) => setDraftNames((m) => ({ ...m, [d.id]: e.target.value }))}
            />
            <TapeStrip
              steps={d.steps}
              editable
              onChangeDelay={(i, v) => {
                const steps = d.steps.map((s, idx) => (idx === i ? { ...s, delay: v } : s));
                updateDraftSteps(d.id, steps);
              }}
            />
            <div className="mt-3 flex gap-2">
              <Button className="flex-1" onClick={() => saveDraft(d.id, draftNames[d.id] ?? "")}>
                Enregistrer
              </Button>
              <Button variant="ghost" onClick={() => discardDraft(d.id)}>
                Annuler
              </Button>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Mes macros
            </p>
            <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground hover:text-foreground">
              <Upload className="size-3.5" />
              Importer
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onImport(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {macros.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Aucune macro — enregistre ta première action ci-dessus.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {macros.map((macro) => {
                const isThis = playing && playingMacroId === macro.id;
                return (
                  <li key={macro.id} className="rounded-lg border border-border bg-secondary p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{macro.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {macro.steps.length} étapes
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant={isThis ? "record" : "outline"}
                          className="size-8"
                          disabled={recording}
                          onClick={() => void playMacro(macro)}
                          title={isThis ? "Arrêter" : "Jouer"}
                        >
                          {isThis ? (
                            <Square className="size-3 fill-current" />
                          ) : (
                            <Play className="ml-px size-3 fill-current" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => setEditingId(editingId === macro.id ? null : macro.id)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => exportMacro(macro)}
                        >
                          <Download className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => {
                            if (confirm(`Supprimer « ${macro.name} » ?`)) deleteMacro(macro.id);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {isThis ? (
                      <p className="mt-2 text-[11px] text-play">
                        Étape {stepIndex} / {macro.steps.length}
                        {infinite ? " · boucle infinie" : ""}
                      </p>
                    ) : null}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Label>
                        Vitesse
                        <select
                          disabled={isThis}
                          value={String(speed)}
                          onChange={(e) => setSpeed(parseFloat(e.target.value))}
                          className="mt-1 h-8 w-full rounded-md border border-border bg-card px-2 text-xs text-foreground"
                        >
                          {SPEEDS.map((s) => (
                            <option key={s.v} value={s.v}>
                              {s.l}
                            </option>
                          ))}
                        </select>
                      </Label>
                      <Label>
                        Répéter
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={99}
                            disabled={isThis || infinite}
                            value={infinite ? "" : loops}
                            onChange={(e) => setLoops(parseInt(e.target.value, 10) || 1)}
                            className="h-8 w-full rounded-md border border-border bg-card px-2 text-xs"
                          />
                          <label className="flex items-center gap-1 text-xs text-foreground">
                            <input
                              type="checkbox"
                              disabled={isThis}
                              checked={infinite}
                              onChange={(e) => setInfinite(e.target.checked)}
                            />
                            ∞
                          </label>
                        </div>
                      </Label>
                    </div>
                    {editingId === macro.id ? (
                      <TapeStrip
                        steps={macro.steps}
                        editable
                        activeIndex={isThis ? stepIndex : undefined}
                        onChangeDelay={(i, v) => {
                          const steps = macro.steps.map((s, idx) =>
                            idx === i ? { ...s, delay: v } : s,
                          );
                          saveMacro({ ...macro, steps });
                        }}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <BrowserFrame
        ref={frameRef}
        url="atelier-nord.demo/boutique"
        recording={recording}
        playing={playing}
        className="min-h-[520px]"
      >
        <ShopSite resetKey={resetKey} />
      </BrowserFrame>
    </div>
  );
}
