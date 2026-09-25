"use client";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { api, type CalendarEvent, stateLabel } from "./api";
function Reschedule({ event, disabled, onApply, onError }: { event: CalendarEvent; disabled: boolean; onApply: (date: string) => void; onError: (error: string) => void }) {
  const [open, setOpen] = useState(false);
  const local = new Date(event.scheduled_at);
  const [date, setDate] = useState(`${String(local.getDate()).padStart(2, "0")}/${String(local.getMonth() + 1).padStart(2, "0")}/${local.getFullYear()}`);
  const [time, setTime] = useState(`${String(local.getHours()).padStart(2, "0")}:${String(local.getMinutes()).padStart(2, "0")}`);
  if (!open) return <button onClick={() => setOpen(true)} className="text-zinc-400">Cambiar fecha</button>;
  return <form className="flex flex-wrap items-center gap-2" onSubmit={e => {
    e.preventDefault();
    const [day, month, year] = date.split("/");
    const parsed = new Date(`${year}-${month}-${day}T${time}:00`);
    if (!Number.isFinite(parsed.getTime()) || parsed.getDate() !== Number(day) || parsed.getMonth() + 1 !== Number(month)) { onError("Revisá la fecha y hora elegidas."); return; }
    onApply(parsed.toISOString()); setOpen(false);
  }}>
    <input aria-label={`Día de ${event.title}`} required pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" value={date} onChange={e => setDate(e.target.value)} className="w-28 rounded bg-zinc-800 p-2" />
    <input aria-label={`Hora de ${event.title}`} required pattern="[0-9]{2}:[0-9]{2}" value={time} onChange={e => setTime(e.target.value)} className="w-20 rounded bg-zinc-800 p-2" />
    <button disabled={disabled} className="text-violet-300">Guardar fecha</button>
  </form>;
}
export function ContentCalendar({ events, onRefresh, onOpen, onNew, onError }: {
  events: CalendarEvent[]; onRefresh: () => void; onOpen: (id: string) => void;
  onNew: () => void; onError: (text: string) => void;
}) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [busy, setBusy] = useState<string | null>(null);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const filtered = events.filter(e => {
    const d = new Date(e.scheduled_at);
    return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
  });
  async function change(event: CalendarEvent, action: string, scheduled_at?: string) {
    setBusy(event.id);
    try { await api(`/calendar/${event.id}`, "PATCH", { action, scheduled_at }); onRefresh(); }
    catch (e) { onError((e as Error).message); }
    finally { setBusy(null); }
  }
  return <section className="flex-1 overflow-auto p-5 md:p-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-medium">Tu calendario de contenido</h1><p className="mt-2 text-sm text-zinc-400">Organizá ideas y aprobá las piezas antes de publicarlas.</p></div>
      <button onClick={onNew} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm">Agregar idea</button>
    </div>
    <div className="mb-4 flex items-center gap-4">
      <button aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2"><CaretLeft /></button>
      <h2 className="min-w-44 text-center capitalize">{month.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</h2>
      <button aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2"><CaretRight /></button>
    </div>
    <p className="mb-4 text-xs text-zinc-500">Horarios en {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
    <div className="hidden grid-cols-7 overflow-hidden rounded-xl border border-zinc-800 md:grid">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => <div key={d} className="bg-zinc-900 p-3 text-xs text-zinc-500">{d}</div>)}
      {Array.from({ length: offset + days }, (_, i) => <div key={i} className="min-h-24 border-t border-r border-zinc-800 p-2">
        {i >= offset && <><span className="text-xs text-zinc-500">{i - offset + 1}</span>{filtered.filter(e => new Date(e.scheduled_at).getDate() === i - offset + 1).map(e => <a href={`#event-${e.id}`} key={e.id} className="mt-1 block truncate rounded bg-violet-500/10 px-2 py-1 text-xs text-violet-300">{e.title}</a>)}</>}
      </div>)}
    </div>
    {!filtered.length && <p className="py-10 text-center text-zinc-500">Todavía no hay contenido para este mes.</p>}
    <div className="mt-5 grid gap-3 lg:grid-cols-2">{filtered.map(event => <article id={`event-${event.id}`} key={event.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex justify-between gap-3"><h3>{event.title}</h3><span className="shrink-0 text-xs text-violet-300">{stateLabel[event.status]}</span></div>
      <p className="mt-2 text-sm text-zinc-400">{new Date(event.scheduled_at).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}</p>
      {event.error && <p className="mt-2 text-sm text-rose-300">{event.error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        <button onClick={() => onOpen(event.project_id)} className="text-zinc-300">Abrir conversación</button>
        {event.status === "draft" && event.job_id && <button disabled={busy === event.id} onClick={() => void change(event, "approve")} className="text-violet-300">Aprobar pieza</button>}
        {event.status === "approved" && <button disabled={busy === event.id} onClick={() => { if (window.confirm("Se publicará esta pieza automáticamente en Instagram en la fecha indicada. ¿Programar publicación?")) void change(event, "schedule"); }} className="text-violet-300">Programar en Instagram</button>}
        {["draft", "approved", "scheduled"].includes(event.status) && <>
          <Reschedule event={event} disabled={busy === event.id} onApply={date => void change(event, "reschedule", date)} onError={onError} />
          <button disabled={busy === event.id} onClick={() => void change(event, "cancel")} className="text-zinc-500">Cancelar</button>
        </>}
      </div>
    </article>)}</div>
  </section>;
}
