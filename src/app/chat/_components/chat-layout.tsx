"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { ChatInputForm } from "./chat-input-form";
import { MediaImage } from "./media-image";
import { MusicEditor } from "./music-editor";
import { CreativeBriefEditor, type BriefState } from "./creative-brief";
import { ImageGallery } from "./image-gallery";
import { ContentCalendar } from "./content-calendar";
import { InstagramInbox } from "./instagram-inbox";
import { SettingsDialog, PlanDialog } from "./workspace-dialogs";
import { api, type Project, type Job, type Settings, type Run, type CalendarEvent, type Asset } from "./api";
import type { ActiveView, ChatMessage } from "./constants";

function rememberChat(id: string | null) {
  try { if (id) sessionStorage.setItem("quark:last-chat", id); else sessionStorage.removeItem("quark:last-chat"); }
  catch { /* Storage can be unavailable; the chat still works for this page. */ }
}

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [brief, setBrief] = useState<BriefState | null>(null);
  const [error, setError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [plan, setPlan] = useState<{ job: Job | null } | null>(null);
  const [ready, setReady] = useState(false);
  const currentId = useRef<string | null>(null);
  const selectionEpoch = useRef(0);
  const chatFetch = useRef(0);
  const restored = useRef(false);
  const selected = projects.find(p => p.id === selectedId);
  const working = run?.status === "running";
  const projectJobs = jobs.filter(j => j.project_id === selectedId);
  const renders = projectJobs.filter(j => j.kind === "render");

  const refresh = useCallback(async () => {
    const [p, j, c, s] = await Promise.all([api<Project[]>("/projects"), api<Job[]>("/jobs"), api<CalendarEvent[]>("/calendar"), api<Settings>("/settings")]);
    setProjects(p); setJobs(j); setEvents(c); setSettings(s); setReady(true);
    if (!restored.current) {
      restored.current = true;
      try {
        const last = sessionStorage.getItem("quark:last-chat");
        if (last && p.some(project => project.id === last)) { currentId.current = last; setSelectedId(last); }
      } catch { /* Restore is optional when browser storage is blocked. */ }
    }
  }, []);
  const refreshChat = useCallback(async (id: string) => {
    const request = ++chatFetch.current;
    const [m, r, a, b] = await Promise.all([api<ChatMessage[]>(`/projects/${id}/messages`), api<Run[]>(`/projects/${id}/runs`), api<Asset[]>(`/projects/${id}/assets`), api<BriefState>(`/projects/${id}/brief`)]);
    if (currentId.current !== id || request !== chatFetch.current) return;
    setMessages(prev => {
      const pending = prev.find(x => x.id.startsWith("pending-"));
      const serverUsers = m.filter(x => x.role === "user").length;
      const previousUsers = prev.filter(x => x.role === "user" && !x.id.startsWith("pending-")).length;
      const next = pending && r[0]?.status === "running" && serverUsers <= previousUsers ? [...m, pending] : m;
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
    setRun(r[0] || null); setAssets(a); setBrief(b);
  }, []);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try { await refresh(); if (currentId.current) await refreshChat(currentId.current); }
      catch (e) { if (alive) setError((e as Error).message); }
      if (alive) timer = setTimeout(poll, 2500);
    }
    void poll();
    return () => { alive = false; clearTimeout(timer); };
  }, [refresh, refreshChat]);
  function select(id: string | null) {
    restored.current = true; rememberChat(id);
    selectionEpoch.current++; chatFetch.current++;
    currentId.current = id; setSelectedId(id); setMessages([]); setRun(null); setAssets([]); setBrief(null);
    setActiveView("chat"); setSidebarOpen(false); setError("");
    if (id) void refreshChat(id).catch(e => setError(e.message));
  }
  async function send(text: string, fn = "content", assetIds: string[] = [], attachments: Asset[] = []) {
    const epoch = selectionEpoch.current;
    const originId = currentId.current;
    setError("");
    try {
      const project = originId ? { id: originId } : await api<Project>("/projects", "POST", { name: text.slice(0, 70) });
      const result = await api<Run>(`/projects/${project.id}/runs`, "POST", { message: text, function: fn, assetIds });
      if (selectionEpoch.current === epoch) {
        if (!originId) { currentId.current = project.id; setSelectedId(project.id); }
        rememberChat(project.id);
        setRun(result);
        setMessages(prev => [...prev, { id: `pending-${result.id}`, role: "user", content: text, media: attachments.map(a => `/media/assets/${a.filename}`) }]);
      }
      // Acceptance is final even if a later refresh fails; retaining the draft would submit it twice.
      void refresh().catch(e => { if (selectionEpoch.current === epoch) setError(e.message); });
      return true;
    } catch (e) { if (selectionEpoch.current === epoch) setError((e as Error).message); return false; }
  }
  async function resume(job: Job) {
    setError("");
    try {
      const project = await api<Project>(`/projects/${job.project_id}`);
      select(project.id); await refresh();
    } catch (e) { setError((e as Error).message); }
  }
  return <div className="flex h-dvh overflow-hidden bg-zinc-950 text-zinc-50">
    <ChatSidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggleCollapse={() => setSidebarCollapsed(p => !p)} activeView={activeView} onViewChange={setActiveView}
      projects={projects} selectedId={selectedId} onSelect={select} onNew={() => select(null)} onSettings={() => setSettingsOpen(true)} />
    <main className="flex min-w-0 flex-1 flex-col">
      <ChatHeader onToggleSidebar={() => setSidebarOpen(p => !p)} title={activeView === "chat" ? "QUARK Chat" : activeView === "gallery" ? "QUARK Galería" : activeView === "calendar" ? "QUARK Calendario" : "QUARK Instagram"} />
      {error && <div role="alert" className="flex items-center justify-between gap-4 border-b border-rose-900/50 bg-rose-950/20 px-5 py-3 text-sm text-rose-300"><span>{error}</span><button onClick={() => setError("")} aria-label="Cerrar aviso">✕</button></div>}
      {settings && !settings.hasDeepSeekKey && <div className="flex flex-wrap justify-between gap-2 border-b border-zinc-800 px-5 py-3 text-xs text-zinc-400"><span>El agente no está disponible en este momento.</span><button onClick={() => setSettingsOpen(true)} className="text-violet-300">Ver estado →</button></div>}
      {!ready ? <p className="m-auto text-zinc-500">Conectando con tu espacio…</p> : activeView === "chat" ? <>
        <div data-chat-scroll className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {!selectedId && !messages.length ? <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900"><Sparkle size={28} weight="duotone" className="text-violet-400" /></div>
            <h1 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">¿Qué vamos a comunicar hoy?</h1>
            <p className="max-w-md text-zinc-500">Escribí tu idea o subí una foto. Creemos contenido, estrategias y promociones para tu negocio.</p>
          </div> : <>
            <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 pt-5 text-xs text-zinc-500"><span className="truncate">{selected?.name || "Conversación"}{selected && ` · v${selected.revision}`}</span>
            </div>
            <MessageList messages={messages} onQuickReply={answer => void send(answer)} />
            {selectedId && brief?.brief && ["draft", "failed"].includes(brief.brief.status) && !working &&
              <CreativeBriefEditor key={brief.brief.id} projectId={selectedId} state={brief} onChange={async nextRun => { if (nextRun) setRun(nextRun); await refreshChat(selectedId); }} />}
            {selectedId && brief?.brief?.status === "done" && !working && <button type="button" onClick={async () => {
              try { setBrief(await api<BriefState>(`/projects/${selectedId}/brief/reopen`, "POST")); }
              catch (e) { setError((e as Error).message); }
            }} className="mx-auto mb-5 text-sm text-violet-300 hover:underline">Modificar formato o estilo de esta pieza</button>}
            {assets.length > 0 && <details className="mx-auto mb-4 w-full max-w-3xl px-4"><summary className="cursor-pointer text-xs text-zinc-400">Recursos de esta conversación ({assets.length})</summary><div className="mt-3 flex flex-wrap gap-2">{assets.map(a => <div key={a.id} className="max-w-36 rounded-lg border border-zinc-800 p-2 text-xs text-zinc-400">{a.kind === "image" && <MediaImage key={a.id} src={`/media/assets/${a.filename}`} alt={a.name} className="mb-1 h-16 w-full object-contain" />}<a href={`/media/assets/${a.filename}`} target="_blank" rel="noreferrer" className="block truncate" title={a.name}>{a.name}</a></div>)}</div></details>}
            {selectedId && messages.at(-1)?.role === "assistant" && messages.at(-1)?.content.startsWith("¡Dale! Buscá la canción") &&
              <MusicEditor key={selectedId} projectId={selectedId} assets={assets} onChange={() => { void refresh(); void refreshChat(selectedId); }} />}
            {working && <p role="status" className="mx-auto w-full max-w-3xl animate-pulse px-4 pb-5 text-sm text-violet-300">QUARK está trabajando en tu pedido…</p>}
            {run?.status === "failed" && <p role="alert" className="mx-auto w-full max-w-3xl px-4 pb-5 text-sm text-rose-300">{run.error}</p>}
            {projectJobs.filter(j => j.kind !== "render" && j.status !== "done").map(j => <p key={j.id} className="mx-auto w-full max-w-3xl px-4 py-2 text-sm text-zinc-400">Recorte de fondo: {j.status === "failed" ? j.error : "procesando…"}</p>)}
            {renders.length > 0 && <ImageGallery compact jobs={renders.slice(0, 4)} projects={projects} onResume={j => void resume(j)} onPlan={job => setPlan({ job })} />}
          </>}
        </div>
        <ChatInputForm key={selectedId || "new"} onSendMessage={send} disabled={working} />
      </> : activeView === "gallery" ? <ImageGallery jobs={jobs} projects={projects} onResume={j => void resume(j)} onPlan={job => setPlan({ job })} />
        : activeView === "calendar" ? <ContentCalendar events={events} onRefresh={() => void refresh().catch(e => setError(e.message))} onOpen={select} onNew={() => setPlan({ job: null })} onError={setError} />
        : <InstagramInbox />}
    </main>
    {settingsOpen && settings && <SettingsDialog settings={settings} onClose={() => setSettingsOpen(false)} onSave={() => void refresh().catch(e => setError(e.message))} />}
    {plan && <PlanDialog job={plan.job} projects={projects} selectedId={selectedId} onClose={() => setPlan(null)} onSave={() => { setActiveView("calendar"); void refresh().catch(e => setError(e.message)); }} />}
  </div>;
}
