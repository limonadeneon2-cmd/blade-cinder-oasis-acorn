"use client";

import { useEffect, useImperativeHandle, forwardRef, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Gift, SkipForward, X } from "lucide-react";
import type { PageElement } from "@/lib/types";
import { cn } from "@/lib/utils";

export type AdKind = "preroll" | "interstitial" | "rewarded";

export interface AdsSiteHandle {
  snapshot: () => PageElement[];
  tickSpeed: (speed: number) => void;
}

interface AdsSiteProps {
  muteDefault: boolean;
  skipWhenPossible: boolean;
  speed: number;
  onReward: (n: number, label: string) => void;
  onLog: (text: string) => void;
}

const ADS: {
  kind: AdKind;
  brand: string;
  line: string;
  duration: number;
  skipAfter: number | null;
  reward: number;
}[] = [
  {
    kind: "preroll",
    brand: "Nord Cola",
    line: "L’eau pétillante des fjords, en canette.",
    duration: 8,
    skipAfter: 3,
    reward: 8,
  },
  {
    kind: "interstitial",
    brand: "Atelier Lumière",
    line: "Lampes de bureau, édition limitée.",
    duration: 6,
    skipAfter: 4,
    reward: 6,
  },
  {
    kind: "rewarded",
    brand: "Flux TV+",
    line: "Regarde pour débloquer le prochain épisode.",
    duration: 10,
    skipAfter: null,
    reward: 14,
  },
];

export const AdsSite = forwardRef<AdsSiteHandle, AdsSiteProps>(function AdsSite(
  { muteDefault, skipWhenPossible, speed, onReward, onLog },
  ref,
) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [t, setT] = useState(0);
  const [muted, setMuted] = useState(muteDefault);
  const [claimed, setClaimed] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const ad = ADS[index];

  useEffect(() => {
    if (phase !== "playing" || !ad) return;
    const id = window.setInterval(() => {
      setT((prev) => {
        const next = prev + 0.25 * (speedRef.current || 1);
        if (next >= ad.duration) {
          window.clearInterval(id);
          setPhase("done");
          return ad.duration;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, ad, index]);

  const remaining = ad ? Math.max(0, ad.duration - t) : 0;
  const skipReady = !!(ad?.skipAfter != null && t >= ad.skipAfter);
  const progress = ad ? Math.min(1, t / ad.duration) : 0;

  function snapshot(): PageElement[] {
    if (sessionDone) return [];
    const els: PageElement[] = [];
    if (phase === "idle") {
      els.push({
        id: "ad-play",
        tag: "button",
        label: "Lecture",
        visible: true,
        kind: "play",
      });
    }
    if (phase === "playing" || phase === "idle") {
      els.push({
        id: "ad-mute",
        tag: "button",
        label: muted ? "Son coupé" : "Couper le son",
        visible: true,
        kind: "mute",
      });
    }
    if (ad?.skipAfter != null) {
      const remain = Math.max(0, ad.skipAfter - t);
      els.push({
        id: "ad-skip",
        tag: "button",
        label: skipReady ? "Passer" : `Passer dans ${Math.ceil(remain)}s`,
        visible: phase === "playing" || phase === "done",
        disabled: !skipReady,
        waitMs: skipReady ? 0 : Math.ceil(remain * 1000) + 200,
        kind: "skip",
      });
    }
    if (phase === "playing" && ad && (ad.skipAfter == null || !skipWhenPossible)) {
      els.push({
        id: "ad-wait-end",
        tag: "div",
        label: `Publicité en cours · ${remaining.toFixed(1)}s`,
        visible: true,
        waitMs: Math.ceil(remaining * 1000) + 200,
      });
    }
    if (phase === "done" && ad?.kind === "interstitial") {
      els.push({
        id: "ad-close",
        tag: "button",
        label: "Fermer",
        visible: true,
        kind: "close",
      });
    }
    if (phase === "done" && ad?.kind === "rewarded" && !claimed) {
      els.push({
        id: "ad-claim",
        tag: "button",
        label: "Récupérer la récompense",
        visible: true,
        kind: "claim",
      });
    }
    const canAdvance =
      phase === "done" &&
      index < ADS.length - 1 &&
      (ad?.kind === "preroll" || (ad?.kind === "rewarded" && claimed));
    if (canAdvance) {
      els.push({
        id: "ad-next",
        tag: "button",
        label: "Pub suivante",
        visible: true,
        kind: "next",
      });
    }
    return els;
  }

  useImperativeHandle(ref, () => ({
    snapshot,
    tickSpeed: (s) => {
      speedRef.current = s;
    },
  }));

  function start() {
    if (!ad) return;
    setPhase("playing");
    onLog(`Lecture — ${ad.brand}`);
  }

  function skip() {
    if (!skipReady || !ad) return;
    setPhase("done");
    setT(ad.duration);
    onLog(`Pub passée — ${ad.brand}`);
    grantIfNeeded();
  }

  function grantIfNeeded() {
    if (!ad || claimed) return;
    if (ad.kind !== "rewarded") {
      setClaimed(true);
      onReward(ad.reward, ad.brand);
    }
  }

  function close() {
    grantIfNeeded();
    goNext();
  }

  function claim() {
    if (!ad || claimed) return;
    setClaimed(true);
    onReward(ad.reward, ad.brand);
    onLog(`Récompense récupérée · +${ad.reward} jetons`);
  }

  function goNext() {
    if (index >= ADS.length - 1) {
      setSessionDone(true);
      onLog("Session pubs terminée.");
      return;
    }
    setIndex((i) => i + 1);
    setPhase("idle");
    setT(0);
    setClaimed(false);
  }

  if (sessionDone) {
    return (
      <div className="site-ads flex min-h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Gift className="size-8 text-play" />
        <p className="font-display text-2xl font-semibold">Session terminée</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Les trois formats de pub ont été joués. Relance l’assistant pour une nouvelle passe.
        </p>
        <button
          type="button"
          data-ra-id="ad-replay"
          onClick={() => {
            setIndex(0);
            setPhase("idle");
            setT(0);
            setClaimed(false);
            setSessionDone(false);
          }}
          className="mt-2 h-10 rounded-md bg-play px-4 text-sm font-medium text-play-foreground"
        >
          Recommencer
        </button>
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="site-ads min-h-full">
      <header className="flex items-center justify-between px-5 py-3 text-xs text-zinc-400">
        <span className="font-display text-sm text-zinc-100">Flux TV</span>
        <span className="font-mono uppercase tracking-wider">
          {index + 1} / {ADS.length} · {ad.kind}
        </span>
      </header>

      <div className="px-5 pb-5">
        <div className="relative overflow-hidden rounded-lg">
          <div className="ad-static grain relative aspect-video">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Publicité</p>
              <p className="font-display text-3xl font-semibold text-zinc-50">{ad.brand}</p>
              <p className="max-w-md text-sm text-zinc-300">{ad.line}</p>
            </div>
            {phase !== "playing" ? <div className="absolute inset-0 bg-black/25" /> : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2">
              {phase === "idle" ? (
                <button
                  type="button"
                  data-ra-id="ad-play"
                  onClick={start}
                  className="flex size-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-950"
                  aria-label="Lecture"
                >
                  <Play className="ml-0.5 size-4" />
                </button>
              ) : phase === "playing" ? (
                <span className="flex size-10 items-center justify-center rounded-full bg-zinc-50/15 text-zinc-50">
                  <Pause className="size-4" />
                </span>
              ) : (
                <span className="rounded-full bg-play/20 px-2.5 py-1 text-[11px] text-play">
                  Terminé
                </span>
              )}
              <button
                type="button"
                data-ra-id="ad-mute"
                onClick={() => setMuted((m) => !m)}
                className="flex size-9 items-center justify-center rounded-full bg-black/40 text-zinc-100"
                aria-label="Son"
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <span className="font-mono text-[11px] text-zinc-200">{remaining.toFixed(1)}s</span>
            </div>

            {ad.skipAfter != null ? (
              <button
                type="button"
                data-ra-id="ad-skip"
                disabled={!skipReady}
                onClick={skip}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium",
                  skipReady ? "bg-zinc-50 text-zinc-950" : "bg-black/40 text-zinc-400",
                )}
              >
                <SkipForward className="size-3.5" />
                {skipReady ? "Passer" : `Passer ${Math.ceil((ad.skipAfter ?? 0) - t)}s`}
              </button>
            ) : (
              <span className="text-[11px] text-zinc-300">Lecture obligatoire</span>
            )}
          </div>

          <div className="absolute inset-x-0 top-0 h-0.5 bg-black/40">
            <div
              className="h-full bg-primary transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {phase === "done" && ad.kind === "interstitial" ? (
            <button
              type="button"
              data-ra-id="ad-close"
              onClick={close}
              className="flex h-10 items-center gap-2 rounded-md border border-zinc-700 px-3 text-sm text-zinc-100"
            >
              <X className="size-4" />
              Fermer
            </button>
          ) : null}
          {phase === "done" && ad.kind === "rewarded" && !claimed ? (
            <button
              type="button"
              data-ra-id="ad-claim"
              onClick={claim}
              className="flex h-10 items-center gap-2 rounded-md bg-play px-3 text-sm font-medium text-play-foreground"
            >
              <Gift className="size-4" />
              Récupérer +{ad.reward} jetons
            </button>
          ) : null}
          {phase === "done" &&
          (ad.kind === "preroll" || (ad.kind === "rewarded" && claimed)) &&
          index < ADS.length - 1 ? (
            <button
              type="button"
              data-ra-id="ad-next"
              onClick={goNext}
              className="h-10 rounded-md bg-zinc-50 px-4 text-sm font-medium text-zinc-950"
            >
              Pub suivante
            </button>
          ) : null}
          {skipWhenPossible ? (
            <span className="ml-auto text-[11px] text-zinc-500">Skip autorisé dès que possible</span>
          ) : (
            <span className="ml-auto text-[11px] text-zinc-500">Lecture jusqu’au bout</span>
          )}
        </div>
      </div>
    </div>
  );
});
