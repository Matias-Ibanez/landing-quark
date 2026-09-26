"use client";
import { useState } from "react";

export function isPublicMedia(url: string) {
  return /^\/media\/(?:assets|exports)\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpg|jpeg|webp|svg|mp4|mp3|wav|ogg|m4a)$/.test(url);
}

export function MediaImage({ src, alt, className = "", previewVector = false, containerClassName = "" }: {
  src: string; alt: string; className?: string; previewVector?: boolean; containerClassName?: string;
}) {
  const preview = previewVector && src.endsWith(".svg") ? src.replace(/\.svg$/, ".png") : src;
  const [source, setSource] = useState(preview);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (!isPublicMedia(src)) return null;
  return <div className={`relative min-w-0 ${containerClassName}`}>
    {!loaded && !failed && <span role="status" className="absolute left-2 top-2 rounded bg-zinc-900/90 px-2 py-1 text-xs text-zinc-400">Cargando imagen…</span>}
    {failed ? <div role="alert" className="rounded-lg border border-zinc-700 p-4 text-xs text-zinc-400">
      No se pudo cargar la vista previa.
      <button type="button" onClick={() => { setSource(preview); setFailed(false); setLoaded(false); }} className="ml-2 text-violet-300 underline">Reintentar</button>
    </div> : <img src={source} alt={alt} className={className} onLoad={() => setLoaded(true)} onError={() => {
      if (source !== src) setSource(src);
      else { setFailed(true); setLoaded(false); }
    }} />}
  </div>;
}
