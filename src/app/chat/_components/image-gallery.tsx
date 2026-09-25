"use client";
import { FilmStrip, ImageSquare } from "@phosphor-icons/react";
import { type Job, type Project, stateLabel } from "./api";
export function ImageGallery({ jobs, projects, onResume, onPlan, compact = false }: {
  jobs: Job[]; projects: Project[]; onResume: (job: Job) => void; onPlan: (job: Job) => void; compact?: boolean;
}) {
  const renders = jobs.filter(j => j.kind === "render" && j.status === "done");
  return <section aria-label="Piezas creadas" className={compact ? "mx-auto w-full max-w-3xl px-4 pb-4" : "flex-1 overflow-auto p-5 md:p-8"}>
    {!compact && <><h1 className="text-2xl font-medium">Tu contenido, en un solo lugar</h1><p className="mb-7 mt-2 text-sm text-zinc-400">Retomá una pieza para seguir trabajando con QUARK.</p></>}
    {!renders.length && <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500"><ImageSquare size={32} className="mx-auto mb-4" /><p>Las piezas que crees en el chat aparecerán acá.</p></div>}
    <div className={`grid gap-4 ${compact ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
      {renders.map(job => <article key={job.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/30">
          {job.status === "done" && job.result?.url ? job.payload.kind === "mp4"
            ? <video src={job.result.url} controls preload="metadata" className="h-full w-full object-contain" />
            : <img src={job.result.url} alt={projects.find(p => p.id === job.project_id)?.name || "Pieza creada"} className="h-full w-full object-contain" />
            : <div className="p-5 text-center text-sm text-zinc-400"><FilmStrip size={28} className="mx-auto mb-3" />{stateLabel[job.status] || job.status}</div>}
        </div>
        <div className="p-4">
          <p className="truncate text-sm font-medium">{projects.find(p => p.id === job.project_id)?.name || "Conversación"}</p>
          <p className="mt-1 text-xs text-zinc-500">Versión {job.payload.revision} · {job.result?.vectorUrl ? "SVG" : job.payload.kind.toUpperCase()} · {job.payload.quality === "final" ? "Final" : "Vista previa"}</p>
          {job.error && <p role="alert" className="mt-2 max-h-24 overflow-auto break-words text-xs text-rose-300">{job.error}</p>}
          {job.payload.document.caption && <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs text-zinc-400">{job.payload.document.caption}</p>}
          {job.status === "done" && <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <button onClick={() => onResume(job)} className="text-violet-300 hover:text-violet-200">Seguir en el chat</button>
            <button onClick={() => onPlan(job)} className="text-zinc-300 hover:text-white">Al calendario</button>
            <a href={job.result?.vectorUrl || job.result?.url} download className="text-zinc-400 hover:text-white">{job.result?.vectorUrl ? "Descargar SVG" : "Descargar"}</a>
          </div>}
        </div>
      </article>)}
    </div>
  </section>;
}
