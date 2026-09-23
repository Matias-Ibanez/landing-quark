"use client";

import Link from "next/link";
import {
  Plus,
  X,
  GearSix,
  SidebarSimple,
  Chats,
  Image,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Mark } from "@/components/ui/mark";
import { site } from "@/lib/site";
import { MOCK_HISTORY, type ActiveView } from "./constants";

// ---------------------------------------------------------------------------
// ChatSidebar — brand logo, view navigation, new-chat button, mock
// conversation history, collapse/expand toggle, and user profile footer.
// ---------------------------------------------------------------------------

interface ChatSidebarProps {
  /** Whether the drawer is open (only relevant on mobile). */
  isOpen: boolean;
  /** Whether the sidebar is collapsed to a thin strip (desktop only). */
  isCollapsed: boolean;
  /** Callback to close the drawer (mobile). */
  onClose: () => void;
  /** Callback to toggle collapse/expand (desktop). */
  onToggleCollapse: () => void;
  /** Currently active view. */
  activeView: ActiveView;
  /** Callback to switch views. */
  onViewChange: (view: ActiveView) => void;
}

/** Mock user data — replace with real auth data later. */
const MOCK_USER = {
  name: "Octavio Haurigot Posse",
  initials: "O",
  plan: "Pro",
} as const;

/** Navigation items rendered in the sidebar. */
const NAV_ITEMS: readonly { id: ActiveView; label: string; icon: typeof Chats }[] = [
  { id: "chat", label: "Chat", icon: Chats },
  { id: "gallery", label: "Imágenes", icon: Image },
  { id: "calendar", label: "Calendario", icon: CalendarBlank },
] as const;

export function ChatSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  activeView,
  onViewChange,
}: ChatSidebarProps) {
  return (
    <>
      {/* ---- backdrop (mobile only) ---- */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* ---- sidebar panel ---- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-800
          bg-zinc-950 transition-all duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:w-[68px]" : "w-72"}
        `}
        aria-label="Panel lateral de chats"
      >
        {/* — brand + collapse toggle — */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-3">
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 text-zinc-50 transition-colors hover:text-white"
            >
              <Mark />
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
                {site.name}
              </span>
            </Link>
          )}

          {/* collapse / expand toggle (desktop) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden md:flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 ${isCollapsed ? "mx-auto" : ""}`}
            aria-label={isCollapsed ? "Expandir panel lateral" : "Contraer panel lateral"}
          >
            <SidebarSimple size={18} className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>

          {/* close button — mobile only */}
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 md:hidden"
            onClick={onClose}
            aria-label="Cerrar panel lateral"
          >
            <X size={18} />
          </button>
        </div>

        {/* — primary navigation — */}
        <nav className="px-3 pt-4" aria-label="Navegación principal">
          <div className={`flex ${isCollapsed ? "flex-col items-center" : "flex-col"} gap-1`}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onViewChange(id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  } ${isCollapsed ? "justify-center px-0 size-10" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={18} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                  {!isCollapsed && label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* — new chat button — */}
        <div className="px-3 pt-3">
          {isCollapsed ? (
            <button
              type="button"
              className="mx-auto flex size-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-50"
              aria-label="Nuevo chat"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              <Plus size={16} aria-hidden="true" />
              Nuevo chat
            </button>
          )}
        </div>

        {/* — history (only visible in chat view) — */}
        {!isCollapsed && activeView === "chat" && (
          <nav
            className="mt-4 flex-1 overflow-y-auto px-3"
            aria-label="Historial de chats"
          >
            <p className="mb-2 px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
              Recientes
            </p>
            <ul className="space-y-0.5">
              {MOCK_HISTORY.map((title) => (
                <li key={title}>
                  <button
                    type="button"
                    className="w-full truncate rounded-lg px-2 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* spacer when collapsed or non-chat view (push user profile to bottom) */}
        {(isCollapsed || activeView !== "chat") && <div className="flex-1" />}

        {/* — user profile footer — */}
        <div className="shrink-0 border-t border-zinc-800 p-3">
          {isCollapsed ? (
            /* collapsed: just the avatar */
            <button
              type="button"
              className="mx-auto flex size-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white"
              aria-label={MOCK_USER.name}
            >
              {MOCK_USER.initials}
            </button>
          ) : (
            /* expanded: avatar + name + plan + gear */
            <div className="flex items-center gap-3">
              {/* avatar */}
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {MOCK_USER.initials}
              </div>

              {/* name + plan */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {MOCK_USER.name}
                </p>
                <p className="text-xs text-violet-400">{MOCK_USER.plan}</p>
              </div>

              {/* settings gear */}
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Configuraciones"
              >
                <GearSix size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}


