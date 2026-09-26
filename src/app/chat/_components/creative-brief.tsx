"use client";

import { useState } from "react";
import { api, type Run } from "./api";

type Answers = Record<string, string | number>;
export interface CreativeBrief {
  id: string; version: number; status: string; request: string; answers: Answers;
}
interface BriefField {
  key: string; title: string; group: number; choices: [string, string][] | null;
  when?: [string, string]; type?: string; required?: boolean;
  min?: number; max?: number; maxLength?: number;
}
export interface BriefState { brief: CreativeBrief | null; fields: BriefField[]; groups: string[] }

export function CreativeBriefEditor({ projectId, state, onChange }: {
  projectId: string; state: BriefState; onChange: (run: Run | null) => Promise<void>;
}) {
  const initial = state.brief!;
  const [answers, setAnswers] = useState<Answers>(initial.answers);
  const [version, setVersion] = useState(initial.version);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const relevant = state.fields.filter(f => !f.when || answers[f.when[0]] === f.when[1]);
  const visible = relevant.filter(f => f.group === step);
  const reviewing = step === state.groups.length;

  async function save(action: "save" | "confirm" | "cancel") {
    setError(""); setBusy(true);
    try {
      if (action !== "cancel" && (!String(answers.subject).trim() || !String(answers.audience).trim())) {
        throw new Error("Completá el tema y el público para continuar.");
      }
      const result = await api<{ brief: CreativeBrief; run: Run | null }>(`/projects/${projectId}/brief`, "PUT", {
        id: initial.id, version, action, answers: action === "cancel" ? initial.answers : answers,
      });
      setVersion(result.brief.version);
      if (action === "save") setStep(s => Math.min(s + 1, state.groups.length));
      await onChange(result.run);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return <section aria-label="Brief creativo" className="mx-auto mb-6 w-[calc(100%_-_2rem)] max-w-3xl rounded-2xl border border-zinc-700 bg-zinc-900 p-5 sm:p-7">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div><p className="text-xs uppercase tracking-widest text-violet-300">Antes de crear</p>
        <h2 className="mt-1 text-xl font-medium">{reviewing ? "Revisá tu brief" : state.groups[step]}</h2>
        <p className="mt-2 text-sm text-zinc-400">{reviewing ? "Confirmá estas decisiones. La producción empieza recién cuando elijas Crear." : "Las opciones sugeridas se pueden cambiar. Elegir por mí también es una decisión válida."}</p>
      </div><span className="shrink-0 text-xs text-zinc-500">{step + 1} / {state.groups.length + 1}</span>
    </div>
    <div className="mb-6 flex gap-1" aria-hidden="true">{Array.from({ length: state.groups.length + 1 }, (_, i) => <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-violet-500" : "bg-zinc-700"}`} />)}</div>
    {initial.status === "failed" && <p className="mb-4 text-sm text-amber-300">El intento anterior no se completó. Tus elecciones siguen guardadas; podés revisarlas y reintentar.</p>}
    <form onSubmit={e => { e.preventDefault(); void save(reviewing ? "confirm" : "save"); }}>
      <fieldset disabled={busy} className="space-y-6">
        {reviewing ? <dl className="space-y-4">{relevant.map(f => <div key={f.key} className="border-b border-zinc-800 pb-3">
          <dt className="text-xs text-zinc-400">{f.title}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-100">
            {f.choices?.find(c => c[0] === answers[f.key])?.[1] || String(answers[f.key] || "No indicado; no se inventará")}
          </dd></div>)}<div className="text-sm text-zinc-400">Las imágenes usarán texto, gráficos y tus recursos adjuntos. No se generarán fotografías nuevas.</div></dl>
          : visible.map(f => f.choices ? <fieldset key={f.key}>
            <legend className="mb-3 text-sm font-medium">{f.title}</legend>
            <div className="grid gap-2 sm:grid-cols-2">{f.choices.map(([value, label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-violet-400 ${answers[f.key] === value ? "border-violet-400 bg-violet-500/10 text-violet-100" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>
              <input className="sr-only" type="radio" name={f.key} checked={answers[f.key] === value} onChange={() => setAnswers(a => ({ ...a, [f.key]: value }))} />{label}
            </label>)}</div>
          </fieldset> : <div key={f.key}>
            <label htmlFor={`brief-${f.key}`} className="mb-2 block text-sm font-medium">{f.title}</label>
            {f.type === "number" ? <input id={`brief-${f.key}`} type="number" min={f.min} max={f.max} step={1} required value={answers[f.key]} onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value === "" ? "" : Number(e.target.value) }))} className="w-36 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              : <textarea id={`brief-${f.key}`} rows={f.key === "subject" || f.key === "copy_text" ? 3 : 2} maxLength={f.maxLength} required={f.required || f.key === "copy_text" || f.key === "colors"} value={answers[f.key]} onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value }))} className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />}
          </div>)}
      </fieldset>
      {error && <div role="alert" className="mt-5 text-sm text-rose-300">{error}<button type="button" onClick={() => { setAnswers(initial.answers); setVersion(initial.version); setError(""); }} className="ml-3 underline">Recargar opciones guardadas</button></div>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" disabled={busy} onClick={() => void save("cancel")} className="text-sm text-zinc-400 hover:text-zinc-200">Cancelar brief</button>
        <div className="flex gap-3">{step > 0 && <button type="button" disabled={busy} onClick={() => setStep(s => s - 1)} className="rounded-xl border border-zinc-700 px-4 py-3 text-sm">Atrás</button>}
          <button type="submit" disabled={busy} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">{busy ? "Guardando…" : reviewing ? "Confirmar y crear" : "Guardar y continuar"}</button>
        </div>
      </div>
    </form>
  </section>;
}
