"use client";

import { useEffect, useRef, useState } from "react";
import { api, type Asset } from "./api";

interface Selection { assetId: string; sourceStart: number; sourceEnd: number; videoStart: number; volume: number }
interface SearchResult { videoId: string; title: string; channel: string; duration: number | null }
interface Props { projectId: string; assets: Asset[]; onChange: () => void }

export function MusicEditor({ projectId, assets, onChange }: Props) {
  const tracks = assets.filter(a => a.kind === "audio");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [duration, setDuration] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const player = useRef<HTMLAudioElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    void api<Selection | null>(`/projects/${projectId}/music`).then(value => { if (active) setSelection(value); }).catch(() => {});
    return () => { active = false; };
  }, [projectId]);
  const track = tracks.find(a => a.id === selection?.assetId);
  function update(patch: Partial<Selection>) { setSelection(previous => previous ? { ...previous, ...patch } : null); }
  async function search() {
    if (query.trim().length < 2) return;
    setBusy(true); setMessage(""); setResults([]);
    try {
      const found = await api<SearchResult[]>(`/projects/${projectId}/music/search`, "POST", { query: query.trim() });
      setResults(found); if (!found.length) setMessage("No encontré canciones con ese nombre. Probá otra búsqueda.");
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  async function importTrack(result: SearchResult) {
    setBusy(true); setMessage("Obteniendo la canción…");
    try {
      const imported = await api<{ asset: Asset; duration: number }>(`/projects/${projectId}/music/import`, "POST", { videoId: result.videoId, title: result.title });
      setSelection({ assetId: imported.asset.id, sourceStart: 0, sourceEnd: Math.min(10, imported.duration), videoStart: 0, volume: 0.2 });
      setDuration(imported.duration); setResults([]); setMessage("Canción lista. Elegí el tramo y escuchalo antes de aplicarlo."); onChange();
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  async function uploadTrack(file?: File) {
    if (!file) return;
    setBusy(true); setMessage("");
    try {
      const data = new FormData(); data.append("file", file);
      const asset = await api<Asset>("/assets", "POST", data);
      await api(`/projects/${projectId}/assets`, "POST", { assetId: asset.id });
      setSelection({ assetId: asset.id, sourceStart: 0, sourceEnd: 10, videoStart: 0, volume: 0.2 });
      onChange();
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); if (upload.current) upload.current.value = ""; }
  }
  async function save() {
    if (!selection) return;
    setBusy(true); setMessage("");
    try { await api(`/projects/${projectId}/music`, "PUT", selection); setMessage("Tramo guardado para los próximos videos."); }
    catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  async function apply() {
    if (!selection) return;
    setBusy(true); setMessage("");
    try {
      await api(`/projects/${projectId}/music`, "PUT", selection);
      await api(`/projects/${projectId}/music/apply`, "POST", {});
      setMessage("Video actualizado con música."); onChange();
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  return <section aria-label="Música de fondo" className="mx-auto mb-4 w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-medium">Elegí la música para tu video</h2><button type="button" onClick={() => upload.current?.click()} disabled={busy} className="rounded-lg bg-violet-700 px-3 py-2 text-white disabled:opacity-50">Adjuntar canción</button></div>
    <p className="mt-2 text-xs text-zinc-400">Usá una canción propia o una para la que tengas permiso de uso en publicaciones.</p>
    <div className="mt-3 flex gap-2"><input aria-label="Buscar canción" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void search(); } }} placeholder="Nombre de la canción o artista" className="min-w-0 flex-1 rounded bg-zinc-800 px-3 py-2" /><button type="button" onClick={() => void search()} disabled={busy || query.trim().length < 2} className="rounded bg-zinc-700 px-3 py-2 disabled:opacity-50">Buscar</button></div>
    {results.length > 0 && <div className="mt-2 max-h-52 overflow-y-auto rounded border border-zinc-800">{results.map(result => <button key={result.videoId} type="button" onClick={() => void importTrack(result)} disabled={busy} className="flex w-full items-center justify-between gap-3 border-b border-zinc-800 px-3 py-2 text-left hover:bg-zinc-800 disabled:opacity-50"><span className="min-w-0"><strong className="block truncate font-medium">{result.title}</strong><span className="block truncate text-xs text-zinc-400">{result.channel}</span></span><span className="shrink-0 text-xs text-violet-300">Elegir</span></button>)}</div>}
    <input ref={upload} type="file" accept="audio/mpeg,audio/wav,audio/ogg,.m4a" hidden onChange={e => void uploadTrack(e.target.files?.[0])} />
    {tracks.length > 0 && <div className="mt-3 grid gap-3">
      <select aria-label="Canción" className="w-full rounded bg-zinc-800 p-2" value={selection?.assetId || ""} onChange={e => { setDuration(0); setSelection({ assetId: e.target.value, sourceStart: 0, sourceEnd: 10, videoStart: 0, volume: 0.2 }); }}>
        <option value="" disabled>Elegí una canción</option>{tracks.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      {track && <audio key={track.id} ref={player} controls preload="metadata" src={`/media/assets/${track.filename}`} className="w-full" onLoadedMetadata={e => { const seconds = e.currentTarget.duration; if (Number.isFinite(seconds)) { setDuration(seconds); setSelection(previous => previous && previous.assetId === track.id ? { ...previous, sourceEnd: Math.min(previous.sourceEnd, seconds) } : previous); } }} onTimeUpdate={e => { if (selection && e.currentTarget.currentTime >= selection.sourceEnd) e.currentTarget.pause(); }} />}
      {selection && track && <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label>Desde (s)<input aria-label="Inicio de canción" type="number" min="0" max={Math.max(0, selection.sourceEnd - 0.1)} step="0.1" value={selection.sourceStart} onChange={e => update({ sourceStart: Number(e.target.value) })} className="mt-1 w-full rounded bg-zinc-800 p-2" /></label>
          <label>Hasta (s)<input aria-label="Fin de canción" type="number" min={selection.sourceStart + 0.1} max={duration || undefined} step="0.1" value={selection.sourceEnd} onChange={e => update({ sourceEnd: Number(e.target.value) })} className="mt-1 w-full rounded bg-zinc-800 p-2" /></label>
          <label>En video (s)<input aria-label="Inicio en video" type="number" min="0" max="180" step="0.1" value={selection.videoStart} onChange={e => update({ videoStart: Number(e.target.value) })} className="mt-1 w-full rounded bg-zinc-800 p-2" /></label>
          <label>Volumen<input aria-label="Volumen de música" type="range" min="0" max="1" step="0.05" value={selection.volume} onChange={e => update({ volume: Number(e.target.value) })} className="mt-1 w-full" /></label>
        </div>
        <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { if (player.current) { player.current.currentTime = selection.sourceStart; void player.current.play(); } }} className="rounded bg-zinc-800 px-3 py-2">Escuchar tramo</button><button type="button" onClick={() => void save()} disabled={busy || selection.sourceEnd <= selection.sourceStart} className="rounded bg-violet-700 px-3 py-2 disabled:opacity-50">Guardar</button><button type="button" onClick={() => void apply()} disabled={busy || selection.sourceEnd <= selection.sourceStart} className="rounded bg-zinc-700 px-3 py-2 disabled:opacity-50">Aplicar al último video</button></div>
      </>}
    </div>}
    {message && <p role="status" className="mt-2 text-zinc-300">{message}</p>}
  </section>;
}
