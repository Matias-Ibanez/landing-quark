"use client";
import { useState } from "react";
import { FilmStrip, ImageSquare } from "@phosphor-icons/react";
import { type Job, type Project, stateLabel } from "./api";
import { MediaImage } from "./media-image";
import { galleryForJob, type PreviewItem } from "./resource-preview";
export function ImageGallery({ jobs, projects, onResume, onPlan, compact = false, onPreview }: {
  jobs: Job[]; projects: Project[]; onResume: (job: Job) => void; onPlan: (job: Job) => void; compact?: boolean; onPreview?: (item: PreviewItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const completed = jobs.filter(j => j.kind === "render" && j.status === "done" && j.result?.url);
  const renders = completed.filter(job => (filter === "all" || (filter === "video" ? job.payload.kind === "mp4" : job.payload.kind !== "mp4")) && `${projects.find(p => p.id === job.project_id)?.name || ""} ${job.payload.document.caption}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <section aria-label="Piezas creadas" className={compact ? "mx-auto w-full max-w-3xl px-4 pb-4" : "flex-1 overflow-auto p-5 md:p-8"}>
    {!compact && <><h1 className="text-2xl font-medium">Tu contenido, en un solo lugar</h1><p className="mb-7 mt-2 text-sm text-zinc-400">Retomá una pieza para seguir trabajando con QUARK.</p></>}
    {!compact && !!completed.length && <div className="mb-6 flex flex-wrap items-center gap-3"><div role="group" aria-label="Tipo de archivo" className="flex gap-1 rounded-full bg-white/5 p-1">{[["all", "Todo"], ["image", "Imágenes"], ["video", "Videos"]].map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={`min-h-10 rounded-full px-4 text-sm ${filter === key ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}>{label}</button>)}</div><input type="search" aria-label="Buscar piezas" placeholder="Buscar una pieza…" value={search} onChange={event => setSearch(event.target.value)} className="min-h-11 w-full rounded-xl border border-zinc-700 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-zinc-500 focus:border-violet-400 sm:ml-auto sm:w-64" /></div>}
    {!renders.length && <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500"><ImageSquare size={32} className="mx-auto mb-4" /><p>{completed.length ? "No encontré piezas con esa búsqueda." : "Las piezas que crees en el chat aparecerán acá."}</p>{!!completed.length && <button onClick={() => { setSearch(""); setFilter("all"); }} className="mt-4 text-sm text-violet-300">Mostrar todas</button>}</div>}
    <div className={`grid gap-4 ${compact ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
      {renders.map(job => <article key={job.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <button type="button" aria-label={`Previsualizar ${projects.find(p => p.id === job.project_id)?.name || "Pieza creada"}`} onClick={() => job.result?.url && onPreview?.({ url: job.result.url, vectorUrl: job.result.vectorUrl, title: projects.find(p => p.id === job.project_id)?.name || "Pieza creada", caption: job.payload.document.caption, job, gallery: galleryForJob(job, completed) })} className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-zinc-950 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-violet-400">
          {job.status === "done" && job.result?.url ? job.payload.kind === "mp4"
            ? <div className="text-center text-zinc-400"><FilmStrip size={42} weight="duotone" className="mx-auto mb-3" /><span className="text-sm">Reproducir video</span></div>
            : <MediaImage key={job.result.url} src={job.result.url} previewVector retry={false} alt={projects.find(p => p.id === job.project_id)?.name || "Pieza creada"} containerClassName="h-full w-full" className="h-full w-full object-contain" />
            : <div className="p-5 text-center text-sm text-zinc-400"><FilmStrip size={28} className="mx-auto mb-3" />{stateLabel[job.status] || job.status}</div>}
        </button>
        <div className="p-4">
          <p className="truncate text-sm font-medium">{projects.find(p => p.id === job.project_id)?.name || "Conversación"}</p>
          <p className="mt-1 text-xs text-zinc-500">{job.payload.kind === "mp4" ? "Video" : "Imagen"} · Versión {job.payload.revision}{job.result?.vectorUrl ? " · Vectorial" : ""}</p>
          {job.error && <p role="alert" className="mt-2 max-h-24 overflow-auto break-words text-xs text-rose-300">{job.error}</p>}
          {job.payload.document.caption && <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-xs text-zinc-400">{job.payload.document.caption}</p>}
          {job.status === "done" && <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <button onClick={() => onResume(job)} className="text-violet-300 hover:text-violet-200">Seguir en el chat</button>
            <button onClick={() => onPlan(job)} className="text-zinc-300 hover:text-white">Al calendario</button>
            <a href={job.result?.vectorUrl || job.result?.url} download className="text-zinc-400 hover:text-white">{job.result?.vectorUrl ? "Descargar SVG" : "Descargar"}</a>
            {job.result?.vectorUrl && <a href={job.result.url} download className="text-zinc-400 hover:text-white">Descargar PNG</a>}
          </div>}
        </div>
      </article>)}
    </div>
  </section>;
}
