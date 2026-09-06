"use client";

import { useRef, useState } from "react";
import { Bot, CalendarDays, Plus, Square, Trash2 } from "lucide-react";
import { BrowserFrame, type BrowserFrameHandle } from "./browser-frame";
import { SurveySite, type SurveySiteHandle } from "./fake-sites/survey";
import { ActivityLog } from "./activity-log";
import { AiStatus } from "./ai-status";
import { GeminiKeysCard } from "./gemini-keys-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { runAssistant } from "@/lib/runner";
import { useStudio } from "@/lib/store";
import { FR_HOLIDAY_PRESETS } from "@/lib/types";
import { formatHolidayDate, monthNameFr } from "@/lib/utils";

export function SurveyPanel() {
  const frameRef = useRef<BrowserFrameHandle>(null);
  const surveyRef = useRef<SurveySiteHandle>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(0);
  const finishedRef = useRef(false);
  const [holName, setHolName] = useState("");
  const [holDay, setHolDay] = useState(25);
  const [holMonth, setHolMonth] = useState(12);

  const profile = useStudio((s) => s.profile);
  const speed = useStudio((s) => s.speed);
  const { updateProfile, addHoliday, removeHoliday, loadSampleProfile, log } = useStudio();

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
    log("info", "Mode sondage — remplissage à partir du profil et des fêtes.");
    try {
      await runAssistant({
        mode: "survey",
        getHost: () => frameRef.current?.host() ?? null,
        snapshot: () => surveyRef.current?.snapshot() ?? [],
        profile,
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

  function addFromForm() {
    if (!holName.trim()) return;
    addHoliday({ name: holName.trim(), day: holDay, month: holMonth, notes: "" });
    setHolName("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-display text-lg font-semibold">Mode sondage</p>
          <p className="mt-1 text-sm text-muted-foreground">
            L’assistant répond avec ton identité et les dates de fêtes que tu as ajoutées — Noël,
            anniversaires, départs en vacances.
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
                Répondre au sondage
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
            Recommencer le formulaire
          </button>
        </div>

        <GeminiKeysCard />

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Profil
            </p>
            <button
              type="button"
              onClick={loadSampleProfile}
              className="text-[11px] text-primary hover:underline"
            >
              Charger l’exemple Léa
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Field label="Prénom" value={profile.firstName} onChange={(v) => updateProfile({ firstName: v })} />
            <Field label="Nom" value={profile.lastName} onChange={(v) => updateProfile({ lastName: v })} />
            <Field label="E-mail" value={profile.email} onChange={(v) => updateProfile({ email: v })} className="col-span-2" />
            <Field label="Ville" value={profile.city} onChange={(v) => updateProfile({ city: v })} />
            <Field
              label="Naissance"
              type="date"
              value={profile.birthDate}
              onChange={(v) => updateProfile({ birthDate: v })}
            />
            <Field
              label="Métier"
              value={profile.occupation}
              onChange={(v) => updateProfile({ occupation: v })}
              className="col-span-2"
            />
          </div>
          <Label className="mt-3 block">
            Ce que tu aimes
            <Input
              className="mt-1"
              value={profile.likes}
              onChange={(e) => updateProfile({ likes: e.target.value })}
            />
          </Label>
          <Label className="mt-2 block">
            Bio
            <Textarea
              className="mt-1"
              rows={2}
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
            />
          </Label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Dates de fêtes
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FR_HOLIDAY_PRESETS.map((p) => {
              const already = profile.holidays.some(
                (h) => h.name === p.name && h.month === p.month && h.day === p.day,
              );
              return (
                <button
                  key={p.name}
                  type="button"
                  disabled={already}
                  onClick={() => addHoliday({ ...p, notes: "" })}
                  className="h-8 rounded-full border border-border px-2.5 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {profile.holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-start justify-between gap-2 rounded-md border border-border bg-secondary px-2.5 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {formatHolidayDate(h.month, h.day, h.year)}
                  </p>
                  {h.notes ? <p className="text-[11px] text-muted-foreground">{h.notes}</p> : null}
                </div>
                <button type="button" onClick={() => removeHoliday(h.id)} className="text-muted-foreground hover:text-record">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_4.5rem_7rem_auto] gap-1.5">
            <Input
              placeholder="Nom de la fête"
              value={holName}
              onChange={(e) => setHolName(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              max={31}
              value={holDay}
              onChange={(e) => setHolDay(parseInt(e.target.value, 10) || 1)}
            />
            <select
              value={holMonth}
              onChange={(e) => setHolMonth(parseInt(e.target.value, 10))}
              className="h-10 rounded-md border border-border bg-secondary px-2 text-xs"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monthNameFr(i + 1)}
                </option>
              ))}
            </select>
            <Button size="icon" onClick={addFromForm} aria-label="Ajouter une fête">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <ActivityLog />
      </div>

      <BrowserFrame
        ref={frameRef}
        url="opinionlab.demo/sondage/lifestyle"
        playing={running}
        className="min-h-[560px]"
      >
        <SurveySite
          key={session}
          ref={surveyRef}
          onComplete={() => {
            finishedRef.current = true;
            log("ok", "Sondage envoyé.");
          }}
        />
      </BrowserFrame>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <Label className={className}>
      {label}
      <Input className="mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </Label>
  );
}
