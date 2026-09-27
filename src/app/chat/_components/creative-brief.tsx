"use client";
import { useState } from "react";
import { ArrowRight, Check, PencilSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { api, type Run } from "./api";

type Answers = Record<string, string | number>;
export interface CreativeBrief { id: string; version: number; status: string; request: string; answers: Answers }
export interface BriefField { key: string; title: string; group: number; choices?: [string, string][] | null; when?: [string, string]; type?: string; required?: boolean; min?: number; max?: number; maxLength?: number }
export interface BriefState { brief: CreativeBrief | null; fields: BriefField[]; groups: string[]; question?: string | null; answered?: string[] }

// The current question is server-owned, so reloads and different tabs resume the same conversation.
export function CreativeBriefEditor({ projectId, state, onChange }: { projectId: string; state: BriefState; onChange: (run: Run | null) => Promise<void> }) {
  const initial = state.brief!;
  const [editKey, setEditKey] = useState<string | null>(null);
  const relevant = state.fields.filter(f => !f.when || initial.answers[f.when[0]] === f.when[1]);
  const question = relevant.find(f => f.key === (editKey || state.question)) || (state.question === undefined ? relevant[0] : undefined);
  const [value, setValue] = useState<string | number>(question ? initial.answers[question.key] ?? "" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState(`${initial.version}:${question?.key}`);
  if (snapshot !== `${initial.version}:${question?.key}`) {
    setSnapshot(`${initial.version}:${question?.key}`);
    setValue(question ? initial.answers[question.key] ?? "" : ""); setError("");
  }
  async function submit(action: "save" | "confirm" | "cancel", selected = value) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const result = await api<{ brief: CreativeBrief; run: Run | null }>(`/projects/${projectId}/brief`, "PUT", {
        id: initial.id, version: initial.version, action,
        answers: action === "save" && question ? { ...initial.answers, [question.key]: selected } : initial.answers,
        field: action === "save" ? question?.key : undefined,
      });
      setEditKey(null); await onChange(result.run);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  const aspectSizes: Record<string, string> = { square: "h-6 w-6", portrait: "h-7 w-5", story: "h-8 w-4", landscape: "h-4 w-8" };
  const paletteColors: Record<string, string[]> = { neutral: ["#e4e4e7", "#71717a", "#27272a"], warm: ["#e9b080", "#b66a45", "#623a35"], cool: ["#9cc9d7", "#558799", "#344d6c"], contrast: ["#fafafa", "#bda4ed", "#18181b"] };
  return <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} aria-label="Pregunta de QUARK" className="w-full pb-2">
    <div className="pl-0 sm:pl-11">
      {initial.status === "failed" && <p className="mb-4 text-sm text-amber-300">El intento anterior no se completó. Podemos ajustar los detalles y volver a intentarlo.</p>}
      {question ? <>
        <h2 className="text-base font-medium leading-relaxed text-zinc-100">{question.title}</h2>
        {question.choices?.length ? <div role="group" aria-label={question.title} className="mt-4 flex flex-wrap gap-2">{question.choices.map(([key, label]) => <button key={key} type="button" disabled={busy} onClick={() => void submit("save", key)} className="flex min-h-11 items-center gap-2.5 rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-violet-400/70 hover:bg-violet-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-400 disabled:opacity-50">
          {question.key === "aspect" && <span aria-hidden="true" className={`rounded-sm border border-current ${aspectSizes[key] || "size-5"}`} />}
          {question.key === "palette" && paletteColors[key] && <span aria-hidden="true" className="flex -space-x-1">{paletteColors[key].map(color => <span key={color} className="size-3.5 rounded-full border border-zinc-900" style={{ backgroundColor: color }} />)}</span>}
          {label}
        </button>)}</div> : <form className="mt-4 max-w-xl" onSubmit={e => { e.preventDefault(); void submit("save"); }}>
          <label className="sr-only" htmlFor={`answer-${question.key}`}>{question.title}</label>
          {question.type === "number" ? <div className="flex items-center gap-3"><input id={`answer-${question.key}`} type="number" min={question.min} max={question.max} required value={value} disabled={busy} onChange={e => setValue(e.target.value === "" ? "" : Number(e.target.value))} className="w-28 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-violet-400" /><span className="text-xs text-zinc-500">Entre {question.min} y {question.max}{question.key === "seconds" ? " segundos" : ""}</span></div>
            : <textarea id={`answer-${question.key}`} value={value} disabled={busy} onChange={e => setValue(e.target.value)} maxLength={question.maxLength} required={question.required || ["copy_text", "colors"].includes(question.key)} rows={question.key === "copy_text" ? 3 : 2} placeholder={question.key === "subject" ? "Por ejemplo, una promoción de café de especialidad" : question.key === "colors" ? "#112233, #FFAA00" : "Escribí tu respuesta…"} className="min-h-24 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900/70 p-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-violet-400" />}
          <button type="submit" disabled={busy} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-50">{busy ? "Guardando…" : "Responder"}<ArrowRight size={15} /></button>
        </form>}
        <p className="mt-3 text-xs text-zinc-500">También podés responder en el mensaje de abajo.</p>
      </> : <>
        <h2 className="text-base font-medium text-zinc-100">Ya tengo lo necesario para crear tu pieza.</h2>
        <details className="mt-4 rounded-xl border border-zinc-800 px-4 py-3"><summary className="cursor-pointer text-sm text-zinc-400">Revisar mis respuestas</summary><dl className="mt-4 space-y-4">{relevant.map(f => <div key={f.key} className="flex items-start gap-3"><div className="min-w-0 flex-1"><dt className="text-xs text-zinc-500">{f.title}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-200">{f.choices?.find(([key]) => key === initial.answers[f.key])?.[1] || String(initial.answers[f.key] || "A criterio de QUARK")}</dd></div><button type="button" aria-label={`Editar ${f.title}`} disabled={busy} onClick={() => setEditKey(f.key)} className="p-2 text-zinc-500 hover:text-zinc-200"><PencilSimple size={16} /></button></div>)}</dl></details>
        <button type="button" disabled={busy} onClick={() => void submit("confirm")} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-50"><Check size={17} />{busy ? "Empezando…" : "Crear mi pieza"}</button>
      </>}
      {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}<button type="button" onClick={() => void onChange(null)} className="ml-2 underline">Actualizar conversación</button></p>}
      <button type="button" disabled={busy} onClick={() => void submit("cancel")} className="mt-4 block text-xs text-zinc-500 hover:text-zinc-300">Cancelar este pedido</button>
    </div>
  </motion.section>;
}
