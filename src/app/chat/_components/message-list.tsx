"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/ui/mark";
import type { ChatMessage } from "./constants";
import { MarkdownMessage } from "./markdown-message";
import { MediaImage, isPublicMedia } from "./media-image";

// ---------------------------------------------------------------------------
// MessageList — scrollable area showing the conversation history.
// Auto-scrolls to the latest message when new messages arrive.
// ---------------------------------------------------------------------------

interface MessageListProps {
  /** The full list of messages to render. */
  messages: readonly ChatMessage[];
  onQuickReply?: (answer: string) => void;
}

export function MessageList({ messages, onQuickReply }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);

  useEffect(() => {
    const scroller = bottomRef.current?.closest<HTMLElement>("[data-chat-scroll]");
    if (!scroller) return;
    const track = () => { followRef.current = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120; };
    scroller.addEventListener("scroll", track, { passive: true });
    return () => scroller.removeEventListener("scroll", track);
  }, []);

  useEffect(() => {
    if (followRef.current) bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [messages]);

  return (
    <div
      className="shrink-0 px-4 py-6 md:px-8"
      role="log"
      aria-label="Historial de mensajes"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* assistant avatar */}
            {msg.role === "assistant" && (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-50">
                <Mark />
              </div>
            )}

            {/* bubble */}
            <div
              className={`min-w-0 max-w-[85%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[75%] ${
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-50"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              {msg.role === "assistant" ? (() => {
                const visible = msg.content
                  .replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/gi, "")
                  .replace(/\n*Archivo generado:\s*\/media\/exports\/[^\n]*/gi, "")
                  .trim();
                const content = /```|\b(?:Hermes|DeepSeek|OpenRouter|Manim|FFmpeg|Docker|Python|FastAPI|Next\.js|backend|frontend|servidor|contenedor|terminal|endpoint|LLM|API)\b|\/workspace\/|\.env\b/i.test(visible)
                  ? "Puedo ayudarte a crear y mejorar contenido para tu marca. Contame qué necesitás."
                  : visible || "Tu pieza está lista.";
                return <MarkdownMessage content={content} />;
              })() : <div className="whitespace-pre-wrap">{msg.content}</div>}
              {msg.role === "user" && [...new Set(msg.media ?? [])].filter(url => isPublicMedia(url) && url.startsWith("/media/assets/")).map(url => <div key={url} className="mt-3">
                {/\.(mp3|wav|ogg|m4a)$/.test(url) ? <audio src={url} controls preload="metadata" className="max-w-full" />
                  : <MediaImage key={url} src={url} alt="Imagen adjunta a tu mensaje" className="max-h-[45vh] w-full rounded-lg object-contain" />}
                <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-violet-300">Abrir adjunto</a>
              </div>)}
              {msg.role === "assistant" && [...new Set(msg.media ?? [])].filter(url => isPublicMedia(url) && url.startsWith("/media/exports/") && /\.(mp4|png|svg)$/.test(url)).map(url => url.endsWith(".mp4")
                ? <video key={url} src={url} controls preload="metadata" className="mt-3 max-h-[65vh] w-full rounded-lg bg-black" />
                : <div key={url} className="mt-3"><MediaImage key={url} src={url} previewVector alt="Pieza creada para tu marca" className="max-h-[65vh] w-full rounded-lg object-contain" /><div className="mt-2 flex flex-wrap gap-3 text-xs text-violet-300">{url.endsWith(".svg") && <a href={url} download>Descargar SVG vectorial</a>}<a href={url.replace(/\.svg$/, ".png")} download>Descargar PNG</a></div></div>)}
              {msg.role === "assistant" && index === messages.length - 1 && msg.content.endsWith("¿Querés agregarle música de fondo?") && onQuickReply &&
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => onQuickReply("Sí")} className="rounded-lg bg-violet-700 px-3 py-1 text-white">Sí, agregar música</button><button type="button" onClick={() => onQuickReply("No gracias")} className="rounded-lg bg-zinc-800 px-3 py-1">No, gracias</button></div>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
