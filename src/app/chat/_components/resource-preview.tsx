"use client";
import { useRef, useState } from "react";
import { DownloadSimple, FilePdf, ImageSquare, Play, Waveform, X, ArrowUpRight, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/animate-ui/primitives/radix/dialog";
import { MediaImage, isPublicMedia } from "./media-image";
import type { Asset, Job } from "./api";

export interface PreviewSlide { url: string; title: string; vectorUrl?: string; caption?: string; document?: Asset["document"]; job?: Job }
export interface PreviewItem extends PreviewSlide { gallery?: PreviewSlide[] }
export function imageItems(urls: readonly string[], jobs: readonly Job[] = []): PreviewSlide[] {
  const unique = [...new Set(urls)].filter(url => isPublicMedia(url) && /\.(png|svg|jpe?g|webp)$/.test(url));
  const images = unique.filter(url => !url.endsWith(".png") || !unique.includes(url.replace(/\.png$/, ".svg")));
  return images.map((url, i) => {
    const job = jobs.find(job => job.result?.url === url || job.result?.vectorUrl === url);
    return { url, title: images.length > 1 ? `Tu imagen ${i + 1}` : "Tu imagen", vectorUrl: job?.result?.vectorUrl, caption: job?.payload.document.caption, job };
  });
}
export function galleryForJob(job: Job, jobs: readonly Job[]): PreviewSlide[] | undefined {
  if (!job.payload.carouselId) return undefined;
  const group = jobs.filter(candidate => candidate.project_id === job.project_id && candidate.payload.carouselId === job.payload.carouselId && candidate.kind === "render" && candidate.status === "done" && candidate.result?.url)
    .sort((a, b) => (a.payload.slideIndex || 0) - (b.payload.slideIndex || 0));
  return imageItems(group.map(candidate => candidate.result!.vectorUrl || candidate.result!.url!), group);
}
export function ResourceCard({ item, onOpen, compact = false }: { item: PreviewItem; onOpen: (item: PreviewItem) => void; compact?: boolean }) {
  if (!isPublicMedia(item.url)) return null;
  const Icon = item.url.endsWith(".mp4") ? Play : item.url.endsWith(".pdf") ? FilePdf : /\.(mp3|wav|ogg|m4a)$/.test(item.url) ? Waveform : ImageSquare;
  const type = item.url.endsWith(".pdf") ? "Documento PDF" : item.url.endsWith(".mp4") ? "Video" : /\.(mp3|wav|ogg|m4a)$/.test(item.url) ? "Audio" : "Imagen";
  return <button type="button" onClick={() => onOpen(item)} aria-label={`Previsualizar ${item.title}`} className={`group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.055] focus-visible:outline-2 focus-visible:outline-violet-400 ${compact ? "w-full sm:max-w-sm" : "w-full"}`}>
    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
      {type === "Imagen" ? <MediaImage key={item.url} src={item.url} previewVector retry={false} alt="" containerClassName="size-full" className="size-full object-cover" /> : <Icon size={23} weight="duotone" className="text-zinc-400" />}
    </span>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-zinc-200">{item.title}</span><span className="mt-1 block text-xs text-zinc-500">{type}{item.document ? `, ${item.document.pages} ${item.document.pages === 1 ? "página" : "páginas"}` : ""} <span className="text-zinc-400">· Ver</span></span></span>
    <ArrowUpRight size={16} className="shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-300" />
  </button>;
}

export function ResourcePreview({ item, onClose, onResume, onPlan }: { item: PreviewItem | null; onClose: () => void; onResume?: (job: Job) => void; onPlan?: (job: Job) => void }) {
  return <PreviewDialog key={item?.url || "closed"} selection={item} onClose={onClose} onResume={onResume} onPlan={onPlan} />;
}

function PreviewDialog({ selection, onClose, onResume, onPlan }: { selection: PreviewItem | null; onClose: () => void; onResume?: (job: Job) => void; onPlan?: (job: Job) => void }) {
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slides = selection?.gallery?.filter(slide => isPublicMedia(slide.url) && /\.(png|svg|jpe?g|webp)$/.test(slide.url)) || [];
  const [index, setIndex] = useState(() => Math.max(0, slides.findIndex(slide => slide.url === selection?.url || slide.vectorUrl === selection?.vectorUrl && !!selection?.vectorUrl)));
  const item = slides[index] || selection;
  const gallery = slides.length > 1;
  const move = (step: number) => setIndex(value => Math.max(0, Math.min(slides.length - 1, value + step)));
  return <Dialog open={!!item} onOpenChange={open => { if (!open) onClose(); }}><DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[70] bg-black/75" />
    <DialogContent onKeyDown={event => { if (gallery && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }} onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement; }} onCloseAutoFocus={event => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus(); }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }} className="fixed left-1/2 top-1/2 z-[71] flex max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4"><DialogTitle className="min-w-0 truncate text-base font-medium text-zinc-100">{item?.title || "Vista previa"}</DialogTitle><DialogClose aria-label="Cerrar vista previa" className="rounded-full p-2 text-zinc-400 hover:bg-white/10"><X size={20} /></DialogClose></div>
      <DialogDescription className="sr-only">Vista previa del archivo. Podés cerrarla con Escape y descargar el recurso.</DialogDescription>
      {item && isPublicMedia(item.url) && <>
        <div className="min-h-0 overflow-auto rounded-xl bg-zinc-950 p-2" style={gallery ? { touchAction: "pan-y pinch-zoom" } : undefined} onTouchStart={event => { touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }} onTouchEnd={event => { const start = touch.current; touch.current = null; if (!gallery || !start || !event.changedTouches.length) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); }}>
          {item.url.endsWith(".mp4") ? <video src={item.url} controls preload="metadata" className="mx-auto max-h-[62dvh] max-w-full" />
            : /\.(mp3|wav|ogg|m4a)$/.test(item.url) ? <audio src={item.url} controls className="mx-auto my-12 max-w-full" />
            : item.url.endsWith(".pdf") ? <div className="text-center">{item.document?.previewUrl && <MediaImage key={item.document.previewUrl} src={item.document.previewUrl} alt="Primera página del PDF" className="mx-auto max-h-[58dvh] max-w-full object-contain" />}<p className="py-3 text-xs text-zinc-400">Primera página. El documento tiene {item.document?.pages || "varias"} {item.document?.pages === 1 ? "página" : "páginas"}.</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-300 underline">Abrir PDF completo</a></div>
            : <MediaImage key={item.url} src={item.url} previewVector alt={item.title} className="mx-auto max-h-[62dvh] max-w-full object-contain" />}
        </div>
        {gallery && <div className="mt-3 flex items-center justify-between gap-3" role="group" aria-label="Navegar carrusel">
          <button type="button" aria-label="Imagen anterior" disabled={index === 0} onClick={() => move(-1)} className="resource-action min-h-11 disabled:opacity-30"><ArrowLeft size={18} /></button>
          <span role="status" aria-live="polite" className="text-sm text-zinc-400">Imagen {index + 1} de {slides.length}</span>
          <button type="button" aria-label="Imagen siguiente" disabled={index === slides.length - 1} onClick={() => move(1)} className="resource-action min-h-11 disabled:opacity-30"><ArrowRight size={18} /></button>
        </div>}
        {item.caption && <p className="mt-4 max-h-24 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{item.caption}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          {item.url.endsWith(".svg") || item.vectorUrl ? <><a href={item.vectorUrl || item.url} download className="resource-action"><DownloadSimple size={16} /> SVG vectorial</a><a href={item.url.replace(/\.svg$/, ".png")} download className="resource-action"><DownloadSimple size={16} /> PNG</a></> : <a href={item.url} download className="resource-action"><DownloadSimple size={16} /> Descargar</a>}
          {item.job && onResume && <button onClick={() => { onResume(item.job!); onClose(); }} className="resource-action">Seguir editando</button>}
          {item.job && onPlan && <button onClick={() => { onPlan(item.job!); onClose(); }} className="resource-action">Al calendario</button>}
        </div>
      </>}
    </DialogContent>
  </DialogPortal></Dialog>;
}
