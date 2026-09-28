"use client";
import { useState } from "react";
import { api } from "./api";
import { clearAuthSession } from "@/lib/auth-client";
export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await api("/auth/logout", "POST"); clearAuthSession();
      try { sessionStorage.removeItem("quark:last-chat"); } catch { /* Storage is optional. */ }
      window.location.replace("/login");
    } catch (error) { setError((error as Error).message); setBusy(false); }
  }
  return <div className="relative shrink-0">
    <button type="button" onClick={logout} disabled={busy} aria-label="Cerrar sesión" className="min-h-10 rounded-full px-3 text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-100 disabled:opacity-50">{busy ? "Saliendo…" : "Salir"}</button>
    {error && <p role="alert" className="absolute right-0 top-full z-50 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-xs text-rose-300">{error}</p>}
  </div>;
}
