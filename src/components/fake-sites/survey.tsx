"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { PageElement } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Answers {
  [key: string]: string;
}

export interface SurveySiteHandle {
  snapshot: () => PageElement[];
  setField: (id: string, value: string) => void;
  step: number;
}

const STEPS = [
  {
    title: "Toi",
    fields: [
      { id: "q-firstname", label: "Prénom", kind: "text" },
      { id: "q-lastname", label: "Nom", kind: "text" },
      { id: "q-email", label: "Adresse e-mail", kind: "text" },
      { id: "q-city", label: "Ville", kind: "text" },
      {
        id: "q-age",
        label: "Tranche d’âge",
        kind: "choice",
        options: ["18 – 24", "25 – 34", "35 – 44", "45 – 54", "55 et plus"],
      },
    ],
  },
  {
    title: "Dates & fêtes",
    fields: [
      { id: "q-birth", label: "Date de naissance", kind: "text" },
      {
        id: "q-holidays",
        label: "Quelles dates de fêtes sont importantes pour toi cette année ?",
        kind: "textarea",
      },
      {
        id: "q-xmas",
        label: "Es-tu disponible le 25 décembre ?",
        kind: "choice",
        options: ["Oui, je suis disponible", "Non, je suis occupé·e", "Je ne sais pas encore"],
      },
      {
        id: "q-summer",
        label: "Pars-tu en vacances en juillet ?",
        kind: "choice",
        options: ["Oui", "Non", "Seulement une partie du mois"],
      },
    ],
  },
  {
    title: "Goûts",
    fields: [
      { id: "q-likes", label: "Qu’est-ce que tu aimes ?", kind: "textarea" },
      {
        id: "q-nps",
        label: "Recommanderais-tu ce type de sondage à un ami ?",
        kind: "choice",
        options: ["Oui, clairement", "Peut-être", "Non"],
      },
      {
        id: "q-comment",
        label: "Un commentaire libre — dis-nous ce qui compte pour toi.",
        kind: "textarea",
      },
    ],
  },
] as const;

export const SurveySite = forwardRef<
  SurveySiteHandle,
  { onComplete: (answers: Answers) => void }
>(function SurveySite({ onComplete }, ref) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const current = STEPS[step];

  function setField(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  const snapshot = (): PageElement[] => {
    if (done) return [];
    const els: PageElement[] = current.fields.map((f) => ({
      id: f.id,
      tag: f.kind === "textarea" ? "textarea" : f.kind === "choice" ? "div" : "input",
      label: f.label,
      value: answers[f.id] ?? "",
      options: "options" in f ? [...f.options] : undefined,
      visible: true,
      kind: f.kind === "choice" ? "choice" : "field",
    }));
    els.push({
      id: step < STEPS.length - 1 ? "q-next" : "q-submit",
      tag: "button",
      label: step < STEPS.length - 1 ? "Suivant" : "Envoyer",
      visible: true,
    });
    return els;
  };

  useImperativeHandle(ref, () => ({ snapshot, setField, step }));

  const progress = useMemo(() => ((step + (done ? 1 : 0)) / STEPS.length) * 100, [step, done]);

  if (done) {
    return (
      <div className="site-survey flex min-h-full flex-col items-center justify-center bg-[#f7f5f1] px-6 py-16 text-center text-[#1a1916]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b645b]">Opinion Lab</p>
        <p className="mt-3 font-display text-2xl font-semibold">Merci, c’est noté.</p>
        <p className="mt-2 max-w-sm text-sm text-[#6b645b]">
          Tes réponses, y compris les fêtes, ont été enregistrées dans cette démo.
        </p>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setAnswers({});
            setDone(false);
          }}
          className="mt-6 h-10 rounded-md border border-[#e4dfd6] px-4 text-sm"
        >
          Recommencer le sondage
        </button>
      </div>
    );
  }

  return (
    <div className="site-survey min-h-full px-5 py-5">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b645b]">
            Opinion Lab · {step + 1}/{STEPS.length}
          </p>
          <h2 className="font-display text-xl font-semibold">{current.title}</h2>
        </div>
        <span className="font-mono text-xs text-[#6b645b]">{Math.round(progress)}%</span>
      </div>
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-[#e4dfd6]">
        <div className="h-full bg-[#2f5d50] transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-col gap-4">
        {current.fields.map((f) => (
          <div key={f.id}>
            <label className="text-xs font-medium text-[#5c564e]" htmlFor={f.id}>
              {f.label}
            </label>
            {f.kind === "choice" ? (
              <div data-ra-id={f.id} className="mt-2 flex flex-col gap-1.5">
                {f.options.map((opt) => {
                  const selected = answers[f.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      data-option={opt}
                      onClick={() => setField(f.id, opt)}
                      className={cn(
                        "h-10 rounded-md border px-3 text-left text-sm",
                        selected
                          ? "border-[#2f5d50] bg-[#2f5d50] text-white"
                          : "border-[#e4dfd6] bg-white",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : f.kind === "textarea" ? (
              <textarea
                id={f.id}
                data-ra-id={f.id}
                value={answers[f.id] ?? ""}
                onChange={(e) => setField(f.id, e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-md border border-[#e4dfd6] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2f5d50]/30"
              />
            ) : (
              <input
                id={f.id}
                data-ra-id={f.id}
                value={answers[f.id] ?? ""}
                onChange={(e) => setField(f.id, e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-[#e4dfd6] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#2f5d50]/30"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        data-ra-id={step < STEPS.length - 1 ? "q-next" : "q-submit"}
        onClick={() => {
          if (step < STEPS.length - 1) setStep((s) => s + 1);
          else {
            setDone(true);
            onComplete(answers);
          }
        }}
        className="mt-6 h-11 w-full rounded-md bg-[#1a1916] text-sm font-medium text-[#f7f5f1]"
      >
        {step < STEPS.length - 1 ? "Suivant" : "Envoyer"}
      </button>
    </div>
  );
});
