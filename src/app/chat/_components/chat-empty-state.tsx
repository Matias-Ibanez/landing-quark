"use client";

import { Sparkle } from "@phosphor-icons/react";
import { ChatInputForm } from "./chat-input-form";

// ---------------------------------------------------------------------------
// ChatEmptyState — Gemini-style welcome screen shown when no messages exist.
// Renders a centred greeting + the input bar floating below it.
// ---------------------------------------------------------------------------

interface ChatEmptyStateProps {
  onSendMessage: (text: string) => void;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ChatEmptyState({
  onSendMessage,
  selectedModelId,
  onModelChange,
}: ChatEmptyStateProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 md:px-8">
      {/* ── radial glow background ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(120,120,120,0.15) 0%, rgba(0,0,0,0) 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── content ── */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10">
        {/* greeting */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* subtle icon */}
          <div className="flex size-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80">
            <Sparkle size={28} weight="duotone" className="text-violet-400" />
          </div>

          <h1 className="text-balance text-3xl font-medium tracking-tight text-zinc-50 antialiased sm:text-4xl md:text-5xl">
            ¿Qué vamos a comunicar hoy?
          </h1>

          <p className="max-w-md text-base text-zinc-500">
            Escribí tu idea y Quark te ayudará a crear contenido, estrategias y
            mucho más para tu negocio.
          </p>
        </div>

        {/* ── input bar (floating, centred) ── */}
        <div className="w-full">
          <ChatInputForm
            onSendMessage={onSendMessage}
            selectedModelId={selectedModelId}
            onModelChange={onModelChange}
            variant="centered"
          />
        </div>
      </div>
    </div>
  );
}
