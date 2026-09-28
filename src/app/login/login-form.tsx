"use client";
import { useEffect, useRef, useState } from "react";
import { clearAuthSession, getAuthSession, type AuthSession } from "@/lib/auth-client";
export function LoginForm() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    let alive = true;
    getAuthSession().then(value => {
      if (!alive) return;
      if (value.authenticated) { window.location.replace("/chat"); return; }
      setSession(value);
    }).catch(error => { if (alive) setError(error.message); });
    return () => { alive = false; };
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const current = await getAuthSession();
      if (current.authenticated) { clearAuthSession(); window.location.replace("/chat"); return; }
      if (!current.csrfToken) throw new Error("El acceso todavía no está habilitado. Contactá al responsable.");
      const response = await fetch("/api/auth/login", {
        method: "POST", cache: "no-store", credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-Quark-CSRF": current.csrfToken },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const value = await response.json().catch(() => ({ detail: "No pudimos iniciar sesión. Intentá de nuevo." }));
      if (!response.ok) throw new Error(typeof value.detail === "string" ? value.detail : "No pudimos iniciar sesión. Intentá de nuevo.");
      clearAuthSession(); form.reset(); window.location.replace("/chat");
    } catch (error) {
      setError(error instanceof TypeError ? "No pudimos conectar con tu espacio. Intentá de nuevo." : error instanceof Error ? error.message : "No pudimos iniciar sesión.");
      const password = form.elements.namedItem("password") as HTMLInputElement;
      if (password) { password.value = ""; password.focus(); }
    } finally { lock.current = false; setBusy(false); }
  }
  const enabled = !!session?.configured && !busy;
  const input = "mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50";
  return <form onSubmit={submit} className="mt-8 space-y-5" aria-busy={busy}>
    <label className="block text-sm text-zinc-300">Usuario<input name="username" autoComplete="username" defaultValue="admin" required maxLength={100} disabled={!enabled} className={input} /></label>
    <label className="block text-sm text-zinc-300">Contraseña<input name="password" type="password" autoComplete="current-password" required maxLength={128} disabled={!enabled} className={input} /></label>
    {error && <p role="alert" className="text-sm leading-5 text-rose-300">{error}</p>}
    {session?.configured === false && <p role="status" className="text-sm text-amber-200">El acceso todavía no está habilitado. Contactá al responsable del espacio.</p>}
    <button type="submit" disabled={!enabled} className="w-full rounded-xl bg-violet-400 px-4 py-3 font-medium text-zinc-950 transition hover:bg-violet-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Ingresando…" : !session && !error ? "Conectando…" : "Ingresar"}</button>
    {!session && error && <button type="button" onClick={() => window.location.reload()} className="w-full text-sm text-zinc-300 underline underline-offset-4">Volver a intentar</button>}
  </form>;
}
