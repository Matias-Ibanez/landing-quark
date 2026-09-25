"use client";
import { useState, useRef } from "react";
import { Paperclip, PaperPlaneRight, X } from "@phosphor-icons/react";
import { CHAT_FUNCTIONS } from "./constants";
import { api, type Asset } from "./api";
export interface InputProps {
  onSendMessage: (text: string, fn?: string, assets?: string[]) => Promise<boolean> | void;
  selectedModelId?: string; onModelChange?: (id: string) => void;
  variant?: "docked" | "centered"; disabled?: boolean;
}
export function ChatInputForm({ onSendMessage, variant = "docked", disabled }: InputProps) {
  const [text, setText] = useState("");
  const [fn, setFn] = useState("content");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const busy = disabled || sending || uploading;
  async function send() {
    if (!text.trim() || busy) return;
    setSending(true); setError("");
    try {
      const accepted = await onSendMessage(text.trim(), fn, assets.map(a => a.id));
      if (accepted !== false) { setText(""); setAssets([]); }
    } catch (e) { setError((e as Error).message); }
    finally { setSending(false); }
  }
  async function upload(files: FileList | null) {
    if (!files) return;
    setUploading(true); setError("");
    try {
      for (const file of Array.from(files).slice(0, 5 - assets.length)) {
        const data = new FormData(); data.append("file", file);
        const asset = await api<Asset>("/assets", "POST", data);
        setAssets(prev => [...prev, asset]);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  }
  return <form onSubmit={e => { e.preventDefault(); void send(); }} className={variant === "docked" ? "shrink-0 px-4 pb-4 pt-2 md:px-8" : "w-full"}>
    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 focus-within:border-zinc-600">
      {assets.length > 0 && <div className="flex flex-wrap gap-2 px-4 pt-3">{assets.map(a => <span key={a.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-2 py-1 text-xs">
        {a.kind === "image" && <img src={`/media/assets/${a.filename}`} alt="" className="size-9 rounded object-cover" />}
        <span className="max-w-40 truncate">{a.name}</span><button type="button" aria-label={`Quitar ${a.name}`} onClick={() => setAssets(prev => prev.filter(x => x.id !== a.id))}><X /></button>
      </span>)}</div>}
      <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); }
      }} aria-label="Escribe tu mensaje" placeholder={fn === "shorts" ? "Escribí el tema del short…" : "Contale a QUARK qué querés crear…"} maxLength={6000} rows={2}
        className="w-full resize-none bg-transparent px-4 pt-4 text-sm leading-relaxed outline-none placeholder:text-zinc-500" />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 px-3 py-2">
        <select aria-label="Función de marketing" value={fn} onChange={e => setFn(e.target.value)} className="max-w-[65%] rounded bg-zinc-900 py-1 text-xs text-zinc-300">
          {CHAT_FUNCTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp,audio/mpeg,audio/wav,audio/ogg,.m4a" hidden onChange={e => void upload(e.target.files)} />
          <button type="button" disabled={busy || assets.length >= 5} onClick={() => input.current?.click()} aria-label="Adjuntar fotos o audio" className="p-2 text-zinc-400 disabled:opacity-30"><Paperclip size={18} /></button>
          <button type="submit" disabled={!text.trim() || busy} aria-label="Enviar mensaje" className="rounded-lg bg-zinc-50 p-2 text-zinc-950 disabled:opacity-30"><PaperPlaneRight size={18} weight="fill" /></button>
        </div>
      </div>
    </div>
    {uploading && <p role="status" className="mx-auto mt-2 max-w-3xl text-xs text-zinc-400">Subiendo archivos…</p>}
    {error && <p role="alert" className="mx-auto mt-2 max-w-3xl text-sm text-rose-300">{error}</p>}
  </form>;
}
