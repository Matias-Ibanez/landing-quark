"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Mark } from "@/components/ui/mark";
import type { ChatMessage } from "./constants";
import { MarkdownMessage } from "./markdown-message";
import { isPublicMedia } from "./media-image";
import { MediaImage } from "./media-image";
import { ResourceCard, imageItems, type PreviewItem } from "./resource-preview";
import type { Asset, Job } from "./api";

// ---------------------------------------------------------------------------
// MessageList — scrollable area showing the conversation history.
// Auto-scrolls to the latest message when new messages arrive.
// ---------------------------------------------------------------------------

interface MessageListProps {
  /** The full list of messages to render. */
  messages: readonly ChatMessage[];
  onQuickReply?: (answer: string) => void;
  onPreview?: (item: PreviewItem) => void;
  assets?: Asset[];
  jobs?: Job[];
  children?: ReactNode;
  activityKey?: string;
}

export function MessageList({ messages, onQuickReply, onPreview, assets = [], jobs = [], children, activityKey }: MessageListProps) {
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
  }, [messages, activityKey]);

  return (
    <div
      className="shrink-0 px-4 pb-6 pt-8 sm:px-6"
      role="log"
      aria-label="Historial de mensajes"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* assistant avatar */}
            {msg.role === "assistant" && (
              <div className="hidden size-8 shrink-0 items-center justify-center rounded-full text-zinc-200 sm:flex">
                <Mark />
              </div>
            )}

            {/* bubble */}
            <div
              className={`min-w-0 break-words text-[15px] leading-7 ${
                msg.role === "user"
                  ? "max-w-[90%] rounded-3xl bg-[#303035] px-5 py-3 text-zinc-100 sm:max-w-[80%]"
                  : "flex-1 pt-0.5 text-zinc-300"
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
                <ResourceCard compact item={{ url, title: assets.find(a => url.endsWith(`/${a.filename}`))?.name || (url.endsWith(".pdf") ? "Documento adjunto" : "Archivo adjunto"), document: assets.find(a => url.endsWith(`/${a.filename}`))?.document }} onOpen={item => onPreview?.(item)} />
              </div>)}
              {msg.role === "assistant" && (() => {
                const urls = [...new Set(msg.media ?? [])].filter(url => isPublicMedia(url) && url.startsWith("/media/exports/"));
                const images = imageItems(urls, jobs);
                return <>
                  {!!images.length && <div className={`mt-4 ${images.length > 1 ? "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2" : ""}`} aria-label={images.length > 1 ? "Imágenes del carrusel" : undefined}>
                    {images.map(image => images.length > 1 ? <button key={image.url} type="button" aria-label={`Previsualizar ${image.title}`} onClick={() => onPreview?.({ ...image, gallery: images })} className="w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-left hover:border-white/30 focus-visible:outline-2 focus-visible:outline-violet-400">
                      <MediaImage src={image.url} previewVector retry={false} alt="" containerClassName="aspect-square w-full" className="h-full w-full object-contain" />
                      <span className="block px-3 py-2 text-xs text-zinc-400">{image.title} · Ver</span>
                    </button> : <ResourceCard key={image.url} compact item={image} onOpen={item => onPreview?.({ ...item, gallery: images })} />)}
                  </div>}
                  {urls.filter(url => url.endsWith(".mp4")).map(url => <div key={url} className="mt-4"><ResourceCard compact item={{ url, title: "Tu video" }} onOpen={item => onPreview?.(item)} /></div>)}
                </>;
              })()}
              {msg.role === "assistant" && index === messages.length - 1 && msg.content.endsWith("¿Querés agregarle música de fondo?") && onQuickReply &&
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => onQuickReply("Sí")} className="rounded-lg bg-violet-700 px-3 py-1 text-white">Sí, agregar música</button><button type="button" onClick={() => onQuickReply("No gracias")} className="rounded-lg bg-zinc-800 px-3 py-1">No, gracias</button></div>}
            </div>
          </div>
        ))}
        {children}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
