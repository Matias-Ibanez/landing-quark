"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { api, type Settings, type Job, type Project } from "./api";

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} onCancel={onClose} className="m-auto max-h-[90dvh] w-[min(94vw,560px)] overflow-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 backdrop:bg-black/70">
    <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl">{title}</h2><button onClick={onClose} aria-label="Cerrar ventana" className="px-2 text-zinc-400">✕</button></div>
    {children}
  </dialog>;
}
const field = "mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-500";
const button = "rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-950 disabled:opacity-40";

export function SettingsDialog({ settings, onClose, onSave }: { settings: Settings; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState(settings);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true); setError("");
    try {
      await api("/brand", "PUT", form.brand);
      onSave(); onClose();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <Dialog title="Tu marca" onClose={onClose}>
    <form onSubmit={e => { e.preventDefault(); void save(); }} className="space-y-4">
      <label className="block text-sm text-zinc-400">Nombre de marca<input required maxLength={100} className={field} value={form.brand.name} onChange={e => setForm({ ...form, brand: { ...form.brand, name: e.target.value } })} /></label>
      <label className="block text-sm text-zinc-400">Tono de comunicación<input maxLength={500} className={field} value={form.brand.tone} onChange={e => setForm({ ...form, brand: { ...form.brand, tone: e.target.value } })} /></label>
      <label className="block text-sm text-zinc-400">Tu negocio, público y productos<textarea rows={3} maxLength={16000} className={field} value={form.brand.context} onChange={e => setForm({ ...form, brand: { ...form.brand, context: e.target.value } })} /></label>
      <hr className="border-zinc-800" />
      <p className="text-xs text-zinc-400">QUARK: {settings.hasDeepSeekKey ? "disponible" : "temporalmente no disponible"}.</p>
      <p className="text-xs text-zinc-500">Instagram: {settings.instagramConfigured ? "conectado" : "pendiente de conectar"}.</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button disabled={busy} className={button}>{busy ? "Guardando…" : "Guardar configuración"}</button>
    </form>
  </Dialog>;
}

export function PlanDialog({ job, projects, selectedId, onClose, onSave }: {
  job: Job | null; projects: Project[]; selectedId: string | null; onClose: () => void; onSave: () => void;
}) {
  const [title, setTitle] = useState(projects.find(p => p.id === job?.project_id)?.name || "");
  const [projectId, setProjectId] = useState(job?.project_id || selectedId || projects[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setBusy(true); setError("");
    try {
      const [day, month, year] = date.split("/");
      const parsed = new Date(`${year}-${month}-${day}T${time}:00`);
      if (!Number.isFinite(parsed.getTime()) || parsed.getDate() !== Number(day) || parsed.getMonth() + 1 !== Number(month)) throw new Error("Revisá el día y la hora elegidos.");
      const scheduled_at = parsed.toISOString();
      let id = projectId;
      if (!id) id = (await api<Project>("/projects", "POST", { name: title })).id;
      await api("/calendar", "POST", { project_id: id, job_id: job?.id || null, title, scheduled_at });
      onSave(); onClose();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <Dialog title="Agregar al calendario" onClose={onClose}>
    <form onSubmit={e => { e.preventDefault(); void save(); }} className="space-y-4">
      {job?.result?.url && (job.payload.kind === "mp4" ? <video src={job.result.url} controls className="max-h-56 w-full" /> : <img src={job.result.url} alt="Pieza seleccionada" className="max-h-56 w-full object-contain" />)}
      <label className="block text-sm text-zinc-400">Título<input required maxLength={160} className={field} value={title} onChange={e => setTitle(e.target.value)} /></label>
      {!job && <label className="block text-sm text-zinc-400">Conversación<select className={field} value={projectId} onChange={e => setProjectId(e.target.value)}><option value="">Nueva conversación</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-zinc-400">Día (DD/MM/AAAA)<input required placeholder="28/09/2026" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" className={field} value={date} onChange={e => setDate(e.target.value)} /></label>
        <label className="block text-sm text-zinc-400">Hora local (HH:MM)<input required placeholder="10:30" pattern="[0-9]{2}:[0-9]{2}" className={field} value={time} onChange={e => setTime(e.target.value)} /></label>
      </div>
      <p className="text-xs text-zinc-500">Se guardará como borrador. {job?.payload.quality === "preview" && "Para publicar, exportá la pieza en calidad final desde el chat."}</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button disabled={busy} className={button}>{busy ? "Guardando…" : "Guardar borrador"}</button>
    </form>
  </Dialog>;
}
