"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/ui/mark";
import type { ChatMessage } from "./constants";

// ---------------------------------------------------------------------------
// MessageList — scrollable area showing the conversation history.
// Auto-scrolls to the latest message when new messages arrive.
// ---------------------------------------------------------------------------

interface MessageListProps {
  /** The full list of messages to render. */
  messages: readonly ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
      role="log"
      aria-label="Historial de mensajes"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.map((msg) => (
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
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[75%] ${
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
                return /```|\b(?:Hermes|DeepSeek|OpenRouter|Manim|FFmpeg|Docker|Python|FastAPI|Next\.js|backend|frontend|servidor|contenedor|terminal|endpoint|LLM|API)\b|\/workspace\/|\.env\b/i.test(visible)
                  ? "Puedo ayudarte a crear y mejorar contenido para tu marca. Contame qué necesitás."
                  : visible || "Tu pieza está lista.";
              })() : msg.content}
              {msg.role === "assistant" && (msg.media ?? []).filter(url => /^\/media\/exports\/hermes-[a-f0-9-]+\.(mp4|png)$/.test(url)).map(url => url.endsWith(".mp4")
                ? <video key={url} src={url} controls preload="metadata" className="mt-3 max-h-[65vh] w-full rounded-lg bg-black" />
                : <img key={url} src={url} alt="Pieza creada para tu marca" className="mt-3 max-h-[65vh] w-full rounded-lg object-contain" />)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
