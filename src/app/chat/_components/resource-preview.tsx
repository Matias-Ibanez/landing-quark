"use client";
import { useRef } from "react";
import { DownloadSimple, FilePdf, ImageSquare, Play, Waveform, X, ArrowUpRight } from "@phosphor-icons/react";
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/animate-ui/primitives/radix/dialog";
import { MediaImage, isPublicMedia } from "./media-image";
import type { Asset, Job } from "./api";

export interface PreviewItem { url: string; title: string; vectorUrl?: string; caption?: string; document?: Asset["document"]; job?: Job }
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
  const opener = useRef<HTMLElement | null>(null);
  return <Dialog open={!!item} onOpenChange={open => { if (!open) onClose(); }}><DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[70] bg-black/75" />
    <DialogContent onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement; }} onCloseAutoFocus={event => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus(); }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }} className="fixed left-1/2 top-1/2 z-[71] flex max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4"><DialogTitle className="min-w-0 truncate text-base font-medium text-zinc-100">{item?.title || "Vista previa"}</DialogTitle><DialogClose aria-label="Cerrar vista previa" className="rounded-full p-2 text-zinc-400 hover:bg-white/10"><X size={20} /></DialogClose></div>
      <DialogDescription className="sr-only">Vista previa del archivo. Podés cerrarla con Escape y descargar el recurso.</DialogDescription>
      {item && isPublicMedia(item.url) && <>
        <div className="min-h-0 overflow-auto rounded-xl bg-zinc-950 p-2">
          {item.url.endsWith(".mp4") ? <video src={item.url} controls preload="metadata" className="mx-auto max-h-[62dvh] max-w-full" />
            : /\.(mp3|wav|ogg|m4a)$/.test(item.url) ? <audio src={item.url} controls className="mx-auto my-12 max-w-full" />
            : item.url.endsWith(".pdf") ? <div className="text-center">{item.document?.previewUrl && <MediaImage key={item.document.previewUrl} src={item.document.previewUrl} alt="Primera página del PDF" className="mx-auto max-h-[58dvh] max-w-full object-contain" />}<p className="py-3 text-xs text-zinc-400">Primera página. El documento tiene {item.document?.pages || "varias"} {item.document?.pages === 1 ? "página" : "páginas"}.</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-300 underline">Abrir PDF completo</a></div>
            : <MediaImage key={item.url} src={item.url} previewVector alt={item.title} className="mx-auto max-h-[62dvh] max-w-full object-contain" />}
        </div>
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
