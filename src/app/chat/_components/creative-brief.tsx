"use client";

import { useState } from "react";
import { api, type Run } from "./api";

type Answers = Record<string, string | number>;
export interface CreativeBrief {
  id: string; version: number; status: string; request: string; answers: Answers;
}
interface BriefField {
  key: string; title: string; group: number; choices?: [string, string][] | null;
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
  const [remoteVersion, setRemoteVersion] = useState(initial.version);
  const [activeGroup, setActiveGroup] = useState<number | null>(() => state.fields.filter(f => !f.when || initial.answers[f.when[0]] === f.when[1]).map(f => f.group).sort((a, b) => a - b)[0] ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Polling must preserve unsaved typing, but a new saved version from another tab must be loaded.
  if (initial.version !== remoteVersion) {
    setRemoteVersion(initial.version);
    if (initial.version > version) {
      setAnswers(initial.answers); setVersion(initial.version); setError("");
      setActiveGroup(state.fields.filter(f => !f.when || initial.answers[f.when[0]] === f.when[1]).map(f => f.group).sort((a, b) => a - b)[0] ?? null);
    }
  }
  const relevant = state.fields.filter(f => !f.when || answers[f.when[0]] === f.when[1]);
  const groupIds = [...new Set(relevant.map(f => f.group))].sort((a, b) => a - b);
  const currentGroup = activeGroup === null ? null : groupIds.find(g => g >= activeGroup) ?? null;
  const step = currentGroup === null ? groupIds.length : groupIds.indexOf(currentGroup);
  const visible = relevant.filter(f => f.group === currentGroup);
  const reviewing = currentGroup === null;

  async function save(action: "save" | "confirm" | "cancel") {
    setError(""); setBusy(true);
    try {
      if (action === "confirm" && (!String(answers.subject ?? "").trim() || !String(answers.audience ?? "").trim())) {
        throw new Error("Completá el tema y el público para continuar.");
      }
      const result = await api<{ brief: CreativeBrief; run: Run | null }>(`/projects/${projectId}/brief`, "PUT", {
        id: initial.id, version, action, answers: action === "cancel" ? initial.answers : answers,
      });
      setVersion(result.brief.version);
      if (action === "save") setActiveGroup(groupIds[step + 1] ?? null);
      await onChange(result.run);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function reload() {
    setBusy(true);
    try {
      const saved = await api<BriefState>(`/projects/${projectId}/brief`);
      if (!saved.brief) throw new Error("No se encontraron los detalles de esta pieza.");
      setAnswers(saved.brief.answers); setVersion(saved.brief.version); setRemoteVersion(saved.brief.version); setError("");
      setActiveGroup(saved.fields.filter(f => !f.when || saved.brief!.answers[f.when[0]] === f.when[1]).map(f => f.group).sort((a, b) => a - b)[0] ?? null);
      await onChange(null);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return <section aria-label="Detalles de la pieza" className="mx-auto mb-6 w-[calc(100%_-_2rem)] max-w-3xl rounded-2xl border border-zinc-700 bg-zinc-900 p-5 sm:p-7">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div><p className="text-xs uppercase tracking-widest text-violet-300">Antes de crear</p>
        <h2 className="mt-1 text-xl font-medium">{reviewing ? "Revisá tus respuestas" : state.groups[groupIds[step]] || "Detalles de la pieza"}</h2>
        <p className="mt-2 text-sm text-zinc-400">{reviewing ? "El resto se conserva de tu pedido. Confirmá para empezar a crear." : "Solo necesitamos aclarar estas decisiones para continuar."}</p>
      </div><span className="shrink-0 text-xs text-zinc-500">{step + 1} / {groupIds.length + 1}</span>
    </div>
    <div className="mb-6 flex gap-1" aria-hidden="true">{Array.from({ length: groupIds.length + 1 }, (_, i) => <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-violet-500" : "bg-zinc-700"}`} />)}</div>
    {initial.status === "failed" && <p className="mb-4 text-sm text-amber-300">El intento anterior no se completó. Tus elecciones siguen guardadas; podés revisarlas y reintentar.</p>}
    <form onSubmit={e => { e.preventDefault(); void save(reviewing ? "confirm" : "save"); }}>
      <fieldset disabled={busy} className="space-y-6">
        {reviewing ? <dl className="space-y-4">{relevant.map(f => <div key={f.key} className="border-b border-zinc-800 pb-3">
          <dt className="text-xs text-zinc-400">{f.title}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-100">
            {f.choices?.find(c => c[0] === answers[f.key])?.[1] || String(answers[f.key] || "No indicado; no se inventará")}
          </dd></div>)}<div className="text-sm text-zinc-400">Las imágenes usarán texto, gráficos y tus recursos adjuntos. No se generarán fotografías nuevas.</div></dl>
          : visible.map(f => f.choices?.length ? <fieldset key={f.key}>
            <legend className="mb-3 text-sm font-medium">{f.title}</legend>
            <div className="grid gap-2 sm:grid-cols-2">{f.choices.map(([value, label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-violet-400 ${answers[f.key] === value ? "border-violet-400 bg-violet-500/10 text-violet-100" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>
              <input className="sr-only" type="radio" name={f.key} checked={answers[f.key] === value} onChange={() => setAnswers(a => ({ ...a, [f.key]: value }))} />{label}
            </label>)}</div>
            {f.key === "copy_mode" && answers.copy_mode !== "exact" && <p className="mt-2 text-xs text-zinc-400">Para escribir tu propio texto, elegí «Usá exactamente mi texto».</p>}
          </fieldset> : <div key={f.key}>
            <label htmlFor={`details-${f.key}`} className="mb-2 block text-sm font-medium">{f.title}</label>
            {f.type === "number" ? <input id={`details-${f.key}`} type="number" min={f.min} max={f.max} step={1} required value={answers[f.key] ?? ""} onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value === "" ? "" : Number(e.target.value) }))} className="w-36 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              : <textarea id={`details-${f.key}`} rows={f.key === "subject" || f.key === "copy_text" ? 3 : 2} maxLength={f.maxLength} required={f.required || f.key === "copy_text" || f.key === "colors"} value={answers[f.key] ?? ""} onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value }))} className="min-h-24 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-400" />}
          </div>)}
      </fieldset>
      {error && <div role="alert" className="mt-5 text-sm text-rose-300">{error}<button type="button" disabled={busy} onClick={() => void reload()} className="ml-3 underline">Recargar opciones guardadas</button></div>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" disabled={busy} onClick={() => void save("cancel")} className="text-sm text-zinc-400 hover:text-zinc-200">Cancelar pedido</button>
        <div className="flex gap-3">{step > 0 && <button type="button" disabled={busy} onClick={() => setActiveGroup(groupIds[step - 1] ?? null)} className="rounded-xl border border-zinc-700 px-4 py-3 text-sm">Atrás</button>}
          <button type="submit" disabled={busy} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">{busy ? "Guardando…" : reviewing ? "Confirmar y crear" : "Guardar y continuar"}</button>
        </div>
      </div>
    </form>
  </section>;
}
