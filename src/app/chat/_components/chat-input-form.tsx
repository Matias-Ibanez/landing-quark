"use client";
import { useState, useRef, useLayoutEffect, useEffect, useEffectEvent } from "react";
import { Plus, ArrowUp, FilePdf, Waveform, X } from "@phosphor-icons/react";
import { api, type Asset } from "./api";
import { MediaImage } from "./media-image";
export interface InputProps {
  onSendMessage: (text: string, fn?: string, assets?: string[], attachments?: Asset[]) => Promise<boolean> | void;
  selectedModelId?: string; onModelChange?: (id: string) => void;
  variant?: "docked" | "centered"; disabled?: boolean; placeholder?: string;
}
export function ChatInputForm({ onSendMessage, variant = "docked", disabled, placeholder }: InputProps) {
  const [text, setText] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [dragging, setDragging] = useState(false);
  const uploadLock = useRef(false);
  const sendLock = useRef(false);
  const busy = disabled || sending || uploading;
  useLayoutEffect(() => {
    if (!textarea.current) return;
    textarea.current.style.height = "auto";
    textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 176)}px`;
  }, [text]);
  async function send() {
    if ((!text.trim() && !assets.length) || busy || sendLock.current) return;
    sendLock.current = true;
    setSending(true); setError("");
    try {
      const message = text.trim() || "Te comparto estos recursos para preparar contenido para mi marca. ¿Qué podemos hacer con ellos?";
      const accepted = await onSendMessage(message, "content", assets.map(a => a.id), assets);
      if (accepted !== false) { setText(""); setAssets([]); }
    } catch (e) { setError((e as Error).message); }
    finally { setSending(false); sendLock.current = false; }
  }
  async function upload(files: FileList | File[] | null) {
    if (!files?.length || busy || uploadLock.current) return;
    uploadLock.current = true;
    setUploading(true); setError("");
    const failures: string[] = [];
    const batch = Array.from(files).slice(0, 5 - assets.length);
    try {
      for (const file of batch) {
        if (file.size > 30 * 1024 * 1024) { failures.push(`${file.name}: el límite es de 30 MB.`); continue; }
        try {
        const data = new FormData(); data.append("file", file);
        const asset = await api<Asset>("/assets", "POST", data);
        setAssets(prev => [...prev, asset]);
        } catch (e) { failures.push(`${file.name}: ${(e as Error).message}`); }
      }
      if (files.length > batch.length) failures.push("Podés adjuntar hasta cinco archivos por mensaje.");
      setError(failures.join(" · "));
    } finally { setUploading(false); uploadLock.current = false; if (input.current) input.current.value = ""; }
  }
  const dropFiles = useEffectEvent((files: FileList) => { void upload(files); });
  useEffect(() => {
    function over(event: DragEvent) {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault(); setDragging(true);
    }
    function leave(event: DragEvent) { if (!event.relatedTarget) setDragging(false); }
    function drop(event: DragEvent) {
      if (!event.dataTransfer?.files.length) return;
      event.preventDefault(); setDragging(false); dropFiles(event.dataTransfer.files);
    }
    window.addEventListener("dragover", over); window.addEventListener("dragleave", leave); window.addEventListener("drop", drop);
    return () => { window.removeEventListener("dragover", over); window.removeEventListener("dragleave", leave); window.removeEventListener("drop", drop); };
  }, []);
  return <form onSubmit={e => { e.preventDefault(); void send(); }} className={variant === "docked" ? "chat-composer shrink-0 px-3 pb-3 pt-2 sm:px-6" : "w-full"}>
    <div className={`mx-auto max-w-3xl rounded-3xl border bg-[#29292d] transition-colors focus-within:border-zinc-500 ${dragging ? "border-violet-400 ring-2 ring-violet-400/20" : "border-zinc-700/50"}`}>
      {dragging && <p className="px-5 pt-4 text-sm text-violet-200">Soltá tus archivos para adjuntarlos</p>}
      {assets.length > 0 && <div className="flex flex-wrap gap-2 px-4 pt-3">{assets.map(a => <div key={a.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-2 py-1 text-xs">
        {a.kind === "image" && <MediaImage key={a.id} src={`/media/assets/${a.filename}`} alt={`Adjunto: ${a.name}`} className="size-12 rounded object-contain" />}
        {a.kind === "document" && <FilePdf size={27} weight="duotone" className="text-zinc-400" />}{a.kind === "audio" && <Waveform size={25} className="text-zinc-400" />}
        <span className="max-w-40 truncate">{a.name}</span><button type="button" disabled={busy} aria-label={`Quitar ${a.name}`} onClick={() => setAssets(prev => prev.filter(x => x.id !== a.id))}><X /></button>
      </div>)}{assets.some(a => a.document?.textStatus === "partial" || a.document?.textTruncated) && <p className="w-full text-xs text-amber-300">El documento se leyó parcialmente. Indicá qué páginas querés usar.</p>}{assets.some(a => a.document?.textStatus === "empty") && <p className="w-full text-xs text-amber-300">No se pudo reconocer el texto del PDF. Adjuntá una copia más clara o agregá una transcripción.</p>}</div>}
      <textarea ref={textarea} disabled={sending} value={text} onPaste={e => { if (e.clipboardData.files.length) { e.preventDefault(); void upload(e.clipboardData.files); } }} onChange={e => setText(e.target.value)} onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); }
      }} aria-label="Escribe tu mensaje" placeholder={placeholder || "Escribí tu idea o preguntale a QUARK…"} maxLength={6000} rows={1}
        className="max-h-44 min-h-14 w-full resize-none bg-transparent px-5 pb-1 pt-4 text-base leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500" />
      <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
          <input ref={input} type="file" aria-label="Archivos para adjuntar" multiple accept="image/png,image/jpeg,image/webp,application/pdf,.pdf,audio/mpeg,audio/wav,audio/ogg,.m4a" hidden onChange={e => void upload(e.target.files)} />
          <button type="button" disabled={busy || assets.length >= 5} onClick={() => input.current?.click()} aria-label="Adjuntar archivos" title="Fotos, PDF o audio. También podés pegarlos o arrastrarlos aquí." className="flex size-10 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 disabled:opacity-30"><Plus size={22} /></button>
          <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{uploading ? "Leyendo tus archivos…" : "Fotos, PDF y audio"}</span>
          <button type="submit" disabled={(!text.trim() && !assets.length) || busy} aria-label="Enviar mensaje" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-colors hover:bg-white disabled:bg-zinc-700 disabled:text-zinc-500"><ArrowUp size={21} weight="bold" /></button>
      </div>
    </div>
    {uploading && <p role="status" className="mx-auto mt-2 max-w-3xl text-xs text-zinc-400">Preparando adjuntos…</p>}
    {error && <p role="alert" className="mx-auto mt-2 max-w-3xl text-sm text-rose-300">{error}</p>}
  </form>;
}
