"use client";

import { List } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// ChatHeader — hamburger toggle for mobile sidebar + dynamic title.
// Model selector has been moved into the input bar.
// ---------------------------------------------------------------------------

interface ChatHeaderProps {
  /** Callback to toggle the sidebar open/closed. */
  onToggleSidebar: () => void;
  /** Title displayed in the header bar. */
  title?: string;
}

export function ChatHeader({ onToggleSidebar, title = "QUARK Chat" }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4">
      {/* hamburger — mobile only */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 md:hidden"
        onClick={onToggleSidebar}
        aria-label="Abrir panel lateral"
      >
        <List size={20} />
      </button>

      {/* brand / title */}
      <span className="font-mono text-sm font-semibold uppercase tracking-widest text-zinc-400">
        {title}
      </span>
    </header>
  );
}
