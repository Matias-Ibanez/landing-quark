"use client";
import { useState } from "react";

export function isPublicMedia(url: string) {
  return /^\/media\/(?:assets|exports)\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpg|jpeg|webp|svg|mp4|mp3|wav|ogg|m4a|pdf)$/.test(url);
}

export function MediaImage({ src, alt, className = "", previewVector = false, containerClassName = "", retry = true }: {
  src: string; alt: string; className?: string; previewVector?: boolean; containerClassName?: string; retry?: boolean;
}) {
  const preview = previewVector && src.endsWith(".svg") ? src.replace(/\.svg$/, ".png") : src;
  const [source, setSource] = useState(preview);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (!isPublicMedia(src)) return null;
  return <div className={`relative min-w-0 ${containerClassName}`}>
    {!loaded && !failed && <span role="status" aria-label="Cargando imagen" className={retry ? "absolute left-2 top-2 rounded bg-zinc-900/90 px-2 py-1 text-xs text-zinc-400" : "absolute inset-0 rounded bg-white/5 motion-safe:animate-pulse"}>{retry ? "Cargando imagen…" : null}</span>}
    {failed && !retry ? <div aria-hidden="true" className="flex size-full items-center justify-center bg-white/5 text-zinc-500">—</div> : failed ? <div role="alert" className="rounded-lg border border-zinc-700 p-4 text-xs text-zinc-400">
      No se pudo cargar la vista previa.
      {retry && <button type="button" onClick={() => { setSource(preview); setFailed(false); setLoaded(false); }} className="ml-2 text-violet-300 underline">Reintentar</button>}
    </div> : <img src={source} alt={alt} loading={retry ? "eager" : "lazy"} decoding="async" className={className} onLoad={() => setLoaded(true)} onError={() => {
      if (source !== src) setSource(src);
      else { setFailed(true); setLoaded(false); }
    }} />}
  </div>;
}
