"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  GearSix,
  SidebarSimple,
  Chats,
  Image,
  CalendarBlank,
  InstagramLogo,
} from "@phosphor-icons/react";
import { Mark } from "@/components/ui/mark";
import { site } from "@/lib/site";
import { type ActiveView } from "./constants";

// ---------------------------------------------------------------------------
// ChatSidebar — brand logo, view navigation, new-chat button, mock
// conversation history, collapse/expand toggle, and user profile footer.
// ---------------------------------------------------------------------------

interface ChatSidebarProps {
  /** Whether the drawer is open (only relevant on mobile). */
  projects: { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSettings: () => void;
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
  name: "Tu espacio de trabajo",
  initials: "Q",
  plan: "Preferencias y marca",
} as const;

/** Navigation items rendered in the sidebar. */
const NAV_ITEMS: readonly { id: ActiveView; label: string; icon: typeof Chats }[] = [
  { id: "chat", label: "Chat", icon: Chats },
  { id: "gallery", label: "Biblioteca", icon: Image },
  { id: "calendar", label: "Calendario", icon: CalendarBlank },
  { id: "instagram", label: "Instagram", icon: InstagramLogo },
] as const;

export function ChatSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  activeView,
  onViewChange, projects, selectedId, onSelect, onNew, onSettings,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const sidebar = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    if (!isOpen || !media.matches) return;
    const resize = () => { if (!media.matches) onClose(); };
    media.addEventListener("change", resize);
    const previous = document.activeElement as HTMLElement;
    sidebar.current?.querySelector<HTMLElement>("button, a")?.focus();
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "Tab") {
        const focusable = [...sidebar.current?.querySelectorAll<HTMLElement>("button, a, input") || []].filter(el => el.offsetParent !== null);
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => { document.removeEventListener("keydown", keyboard); media.removeEventListener("change", resize); previous?.focus(); };
  }, [isOpen, onClose]);
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
        ref={sidebar}
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex-col bg-[#18181c]
          transition-[width] duration-200 motion-reduce:transition-none md:static md:flex
          ${isOpen ? "flex" : "hidden"}
          ${isCollapsed ? "md:w-[68px]" : "md:w-64"}
        `}
        aria-label="Panel lateral de chats"
      >
        {/* — brand + collapse toggle — */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-3">
          {(
            <Link
              href="/"
              className={`flex items-center gap-2.5 text-zinc-50 transition-colors hover:text-white ${isCollapsed ? "md:hidden" : ""}`}
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
          <div className={`flex flex-col ${isCollapsed ? "md:items-center" : ""} gap-1`}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { onViewChange(id); onClose(); }}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  } ${isCollapsed ? "md:justify-center md:px-0 md:size-10" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={label} title={label}
                >
                  <Icon size={18} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                  <span className={isCollapsed ? "md:sr-only" : ""}>{label}</span>
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
              aria-label="Nuevo chat" onClick={onNew}
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNew} className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              <Plus size={16} aria-hidden="true" />
              Nuevo chat
            </button>
          )}
        </div>

        {/* — history (only visible in chat view) — */}
        {activeView === "chat" && (
          <nav
            className={`mt-5 min-h-0 flex-1 overflow-y-auto px-3 ${isCollapsed ? "md:hidden" : ""}`}
            aria-label="Historial de chats"
          >
            <p className="mb-2 px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
              Recientes
            </p>
            <input type="search" aria-label="Buscar conversaciones" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar un chat…" className="mb-3 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-500" />
            <ul className="space-y-0.5">
              {projects.filter(project => project.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => { onSelect(project.id); onClose(); }} title={project.name} aria-current={selectedId === project.id ? "page" : undefined} className={`w-full truncate rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${selectedId === project.id ? "bg-white/10 text-zinc-100" : "text-zinc-400"}`}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* spacer when collapsed or non-chat view (push user profile to bottom) */}
        {(isCollapsed || activeView !== "chat") && <div className={activeView === "chat" ? "hidden md:block md:flex-1" : "flex-1"} />}

        {/* — user profile footer — */}
        <div className="shrink-0 border-t border-zinc-800 p-3">
          {isCollapsed ? (
            /* collapsed: just the avatar */
            <button
              type="button"
              className="mx-auto flex size-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white"
              aria-label="Configuraciones" onClick={onSettings}
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
                aria-label="Configuraciones" onClick={onSettings}
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
