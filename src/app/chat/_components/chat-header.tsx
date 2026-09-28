"use client";

import { List, FolderSimple } from "@phosphor-icons/react";
import { LogoutButton } from "./logout-button";

// ---------------------------------------------------------------------------
// ChatHeader — mobile navigation, current section and conversation files.
// ---------------------------------------------------------------------------

interface ChatHeaderProps {
  /** Callback to toggle the sidebar open/closed. */
  onToggleSidebar: () => void;
  /** Title displayed in the header bar. */
  title?: string;
  onFiles?: () => void;
  fileCount?: number;
}

export function ChatHeader({ onToggleSidebar, title = "QUARK", onFiles, fileCount = 0 }: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6">
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
      <span className="min-w-0 flex-1 truncate text-base font-medium text-zinc-300">
        {title}
      </span>
      {onFiles && <button type="button" onClick={onFiles} className="flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-zinc-700/60 px-3 text-xs text-zinc-300 hover:bg-white/5"><FolderSimple size={17} />Archivos{fileCount > 0 && <span className="rounded-full bg-zinc-700/60 px-1.5 py-0.5 text-[10px]">{fileCount}</span>}</button>}
      <LogoutButton />
    </header>
  );
}
