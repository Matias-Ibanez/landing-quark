"use client";
import { X, FolderSimple } from "@phosphor-icons/react";
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/animate-ui/primitives/radix/dialog";
import type { Asset, Job } from "./api";
import { ResourceCard, type PreviewItem } from "./resource-preview";

export function ConversationFiles({ open, onClose, assets, jobs, onPreview }: { open: boolean; onClose: () => void; assets: Asset[]; jobs: Job[]; onPreview: (item: PreviewItem) => void }) {
  const completed = jobs.filter(j => j.kind === "render" && j.status === "done" && j.result?.url);
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}><DialogPortal><DialogOverlay className="fixed inset-0 z-[60] bg-black/50" /><DialogContent initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.18 }} className="fixed bottom-0 right-0 top-0 z-[61] flex w-full max-w-md flex-col border-l border-zinc-700 bg-[#202024] p-5 shadow-2xl">
    <div className="flex items-center justify-between"><DialogTitle className="text-lg font-medium">Archivos de este chat</DialogTitle><DialogClose aria-label="Cerrar archivos" className="rounded-full p-2 text-zinc-400 hover:bg-white/10"><X size={20} /></DialogClose></div>
    <DialogDescription className="mt-2 text-sm text-zinc-500">Tus adjuntos y las piezas que creamos juntos.</DialogDescription>
    <div className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto">
      {!assets.length && !completed.length && <div className="py-16 text-center text-zinc-500"><FolderSimple size={34} className="mx-auto mb-4" /><p className="text-sm">Todavía no hay archivos en este chat.</p></div>}
      {!!completed.length && <section><h3 className="mb-3 text-xs font-medium text-zinc-500">Creados por QUARK</h3><div className="space-y-2">{completed.map((job, i) => <ResourceCard key={job.id} item={{ url: job.result!.url!, vectorUrl: job.result?.vectorUrl, title: `${job.payload.kind === "mp4" ? "Video" : "Imagen"} ${completed.length - i}`, caption: job.payload.document.caption, job }} onOpen={item => { onClose(); onPreview(item); }} />)}</div></section>}
      {!!assets.length && <section><h3 className="mb-3 text-xs font-medium text-zinc-500">Adjuntos</h3><div className="space-y-2">{assets.map(asset => <ResourceCard key={asset.id} item={{ url: `/media/assets/${asset.filename}`, title: asset.name, document: asset.document }} onOpen={item => { onClose(); onPreview(item); }} />)}</div></section>}
    </div>
  </DialogContent></DialogPortal></Dialog>;
}
