"use client";

import { useRef, useState } from "react";
import { Bot, Square, Coins } from "lucide-react";
import { BrowserFrame, type BrowserFrameHandle } from "./browser-frame";
import { AdsSite, type AdsSiteHandle } from "./fake-sites/ads";
import { ActivityLog } from "./activity-log";
import { AiStatus } from "./ai-status";
import { GeminiKeysCard } from "./gemini-keys-card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { runAssistant } from "@/lib/runner";
import { useStudio } from "@/lib/store";

export function AdsPanel() {
  const frameRef = useRef<BrowserFrameHandle>(null);
  const adsRef = useRef<AdsSiteHandle>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(0);
  const finishedRef = useRef(false);

  const speed = useStudio((s) => s.speed);
  const mute = useStudio((s) => s.adMute);
  const skip = useStudio((s) => s.adSkipWhenPossible);
  const tokens = useStudio((s) => s.adTokens);
  const { setAdMute, setAdSkipWhenPossible, setSpeed, addTokens, log } = useStudio();

  async function start() {
    if (running) {
      abortRef.current?.abort();
      setRunning(false);
      return;
    }
    finishedRef.current = false;
    const ac = new AbortController();
    abortRef.current = ac;
    setRunning(true);
    log("info", "Assistant pubs lancé.");
    try {
      await runAssistant({
        mode: "ads",
        getHost: () => frameRef.current?.host() ?? null,
        snapshot: () => adsRef.current?.snapshot() ?? [],
        skipWhenPossible: skip,
        extra: mute ? "Couper le son si possible." : "Laisser le son.",
        speed,
        signal: ac.signal,
        onLog: log,
        isFinished: () => finishedRef.current,
        getGeminiKeys: () => useStudio.getState().geminiKeys,
        getGeminiCursor: () => useStudio.getState().geminiCursor,
        setGeminiCursor: useStudio.getState().setGeminiCursor,
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-display text-lg font-semibold">Mode pubs</p>
          <p className="mt-1 text-sm text-muted-foreground">
            L’IA repère lecture, skip, fermeture et récompense — puis joue la séquence toute
            seule. Pré-roll, interstitiel, puis pub récompensée.
          </p>
          <AiStatus />
          <Button
            variant={running ? "record" : "play"}
            className="mt-4 w-full"
            onClick={() => void start()}
          >
            {running ? (
              <>
                <Square className="size-3.5 fill-current" />
                Arrêter
              </>
            ) : (
              <>
                <Bot className="size-4" />
                Faire jouer les pubs
              </>
            )}
          </Button>
          <button
            type="button"
            className="mt-2 w-full text-center text-[11px] text-muted-foreground hover:text-foreground"
            onClick={() => {
              abortRef.current?.abort();
              setRunning(false);
              finishedRef.current = false;
              setSession((n) => n + 1);
            }}
          >
            Réinitialiser la session
          </button>
        </div>

        <GeminiKeysCard />

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Coins className="size-4 text-primary" />
              Jetons
            </span>
            <span className="font-mono text-lg tabular-nums">{tokens}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              Passer dès que possible
              <Switch checked={skip} onCheckedChange={setAdSkipWhenPossible} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              Couper le son
              <Switch checked={mute} onCheckedChange={setAdMute} />
            </label>
            <Label>
              Vitesse
              <select
                value={String(speed)}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="mt-1 h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm"
              >
                <option value="1">1×</option>
                <option value="2">2×</option>
                <option value="5">5×</option>
              </select>
            </Label>
          </div>
        </div>
        <ActivityLog />
      </div>

      <BrowserFrame
        ref={frameRef}
        url="fluxtv.demo/regarder"
        playing={running}
        className="min-h-[520px]"
      >
        <AdsSite
          key={session}
          ref={adsRef}
          muteDefault={mute}
          skipWhenPossible={skip}
          speed={speed}
          onReward={(n, label) => {
            addTokens(n);
            log("ok", `+${n} jetons · ${label}`);
          }}
          onLog={(t) => log("info", t)}
        />
      </BrowserFrame>
    </div>
  );
}
