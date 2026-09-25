"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

interface Rule { id: string; name: string; keywords: string[]; reply: string }
interface Automation { mode: "off" | "review" | "auto_faq"; rules: Rule[]; connected: boolean }
interface InboxMessage { id: string; sender: string; text: string; timestamp: number; reply: string | null; replied_at: string | null; suggestion: string | null; suggestion_source: string | null }
const input = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-500";
const button = "rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40";

export function InstagramInbox() {
  const [settings, setSettings] = useState<Automation | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [ruleName, setRuleName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ruleReply, setRuleReply] = useState("");
  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    const [s, m] = await Promise.all([api<Automation>("/instagram/automation"), api<InboxMessage[]>("/inbox")]);
    setSettings(s); setMessages(m);
  }, []);
  useEffect(() => {
    void refresh().catch(e => setError((e as Error).message));
    const timer = setInterval(() => { void refresh().catch(e => setError((e as Error).message)); }, 5000);
    return () => clearInterval(timer);
  }, [refresh]);
  async function save(next: Automation) {
    setBusy("settings"); setError("");
    try { setSettings(await api<Automation>("/instagram/automation", "PUT", { mode: next.mode, rules: next.rules })); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(""); }
  }
  async function addRule() {
    if (!settings || !ruleName.trim() || !ruleReply.trim()) return;
    const words = keywords.split(",").map(x => x.trim()).filter(Boolean);
    if (!words.length) { setError("Agregá al menos una palabra o frase clave."); return; }
    await save({ ...settings, rules: [...settings.rules, { id: crypto.randomUUID(), name: ruleName.trim(), keywords: words, reply: ruleReply.trim() }] });
    setRuleName(""); setKeywords(""); setRuleReply("");
  }
  async function suggest(message: InboxMessage) {
    setBusy(message.id); setError("");
    try {
      const result = await api<{ suggestion: string }>(`/inbox/${encodeURIComponent(message.id)}/suggest`, "POST");
      setDrafts(prev => ({ ...prev, [message.id]: result.suggestion })); await refresh();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(""); }
  }
  async function send(message: InboxMessage) {
    const text = (drafts[message.id] ?? message.suggestion ?? "").trim();
    if (!text) return;
    setBusy(message.id); setError("");
    try { await api(`/inbox/${encodeURIComponent(message.id)}/reply`, "POST", { text }); await refresh(); }
    catch (e) { setError((e as Error).message); await refresh(); }
    finally { setBusy(""); }
  }
  async function checkPreview() {
    setBusy("preview"); setError("");
    try {
      const result = await api<{ matched: boolean; rule: string | null; reply: string | null }>("/instagram/automation/preview", "POST", { text: question });
      setPreview(result.matched ? `${result.rule}: ${result.reply}` : "No hay una única regla coincidente. Este mensaje quedaría para revisión.");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(""); }
  }
  return <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8">
    <div className="mx-auto max-w-4xl space-y-8">
      <header><h1 className="text-2xl font-medium">Instagram</h1><p className="mt-2 text-sm text-zinc-400">Recibí mensajes, respondé con ayuda de QUARK y automatizá preguntas frecuentes verificadas.</p></header>
      {error && <p role="alert" className="rounded-lg border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-300">{error}</p>}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-medium">Respuestas automáticas</h2><p className="mt-1 text-xs text-zinc-400">Solo reglas con una coincidencia clara. El resto queda pendiente para una persona.</p></div><span className={`text-xs ${settings?.connected ? "text-emerald-400" : "text-amber-300"}`}>{settings?.connected ? "Cuenta configurada" : "Falta conectar Meta en .env"}</span></div>
        <label className="mt-5 block max-w-xs text-xs text-zinc-400">Modo<select disabled={!settings || busy === "settings"} value={settings?.mode || "off"} onChange={e => { if (settings) void save({ ...settings, mode: e.target.value as Automation["mode"] }); }} className={`${input} mt-2`}><option value="off">Desactivado</option><option value="review">Sugerencias para revisión</option><option value="auto_faq">Responder preguntas frecuentes</option></select></label>
        {!settings?.connected && <p className="mt-3 text-xs text-zinc-500">Podés configurar y probar reglas ahora. Ningún mensaje se enviará hasta que la cuenta profesional y sus permisos estén conectados.</p>}
        <div className="mt-5 space-y-2">{settings?.rules.map(rule => <div key={rule.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-800 p-3"><div><strong className="text-sm">{rule.name}</strong><p className="mt-1 text-xs text-zinc-500">{rule.keywords.join(" · ")}</p><p className="mt-2 text-sm text-zinc-300">{rule.reply}</p></div><button className="text-xs text-rose-300" onClick={() => void save({ ...settings, rules: settings.rules.filter(r => r.id !== rule.id) })}>Quitar</button></div>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs text-zinc-400">Tema<input className={`${input} mt-1`} value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="Precios" maxLength={80}/></label><label className="text-xs text-zinc-400">Palabras o frases, separadas por coma<input className={`${input} mt-1`} value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="precio, cuánto sale, planes"/></label></div>
        <label className="mt-3 block text-xs text-zinc-400">Respuesta aprobada<textarea className={`${input} mt-1`} rows={2} value={ruleReply} onChange={e => setRuleReply(e.target.value)} placeholder="Nuestros planes son…" maxLength={1000}/></label>
        <button className={`${button} mt-3`} disabled={!settings || busy === "settings"} onClick={() => void addRule()}>Agregar respuesta</button>
        <div className="mt-6 border-t border-zinc-800 pt-5"><label className="block text-xs text-zinc-400">Probar sin enviar<input className={`${input} mt-1`} value={question} onChange={e => setQuestion(e.target.value)} placeholder="¿Cuánto sale la clase?"/></label><button className={`${button} mt-3`} disabled={!question.trim() || busy === "preview"} onClick={() => void checkPreview()}>Probar regla</button>{preview && <p role="status" className="mt-3 text-sm text-zinc-300">{preview}</p>}</div>
      </section>
      <section><h2 className="text-lg font-medium">Bandeja de entrada</h2><p className="mt-1 text-xs text-zinc-500">Los mensajes requieren un webhook firmado de Meta. QUARK nunca envía una sugerencia de IA sin revisión.</p>
        {!messages.length && <p className="mt-5 rounded-lg border border-zinc-800 p-6 text-sm text-zinc-400">Aún no llegaron mensajes. Conectá una cuenta profesional y suscribí el webhook para empezar.</p>}
        <div className="mt-4 space-y-3">{messages.map(message => <article key={message.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"><div className="flex justify-between gap-3 text-xs text-zinc-500"><span>Remitente {message.sender}</span><time>{new Date(message.timestamp * 1000).toLocaleString("es-AR")}</time></div><p className="mt-3 whitespace-pre-wrap text-sm">{message.text}</p>{message.replied_at ? <p className="mt-3 text-xs text-zinc-400">{message.replied_at === "pending" ? "Envío sin confirmar; verificá Instagram antes de reintentar." : `Respondido: ${message.reply}`}</p> : <div className="mt-4 space-y-2"><textarea className={input} rows={2} aria-label={`Respuesta a ${message.sender}`} value={drafts[message.id] ?? message.suggestion ?? ""} onChange={e => setDrafts(prev => ({ ...prev, [message.id]: e.target.value }))} placeholder="Escribí o generá una sugerencia…"/><div className="flex flex-wrap gap-2"><button className={button} disabled={busy === message.id} onClick={() => void suggest(message)}>Buscar respuesta FAQ</button><button className={button} disabled={!settings?.connected || busy === message.id || !(drafts[message.id] ?? message.suggestion ?? "").trim()} onClick={() => void send(message)}>Enviar respuesta</button></div></div>}</article>)}</div>
      </section>
    </div>
  </div>;
}
