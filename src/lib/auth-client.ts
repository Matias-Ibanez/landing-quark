export interface AuthSession { authenticated: boolean; configured?: boolean; username?: string; csrfToken?: string }
let pendingSession: Promise<AuthSession> | null = null;
export async function getAuthSession(): Promise<AuthSession> {
  const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error("No pudimos conectar con tu espacio. Intentá de nuevo.");
  return response.json();
}
export function clearAuthSession() { pendingSession = null; }
export async function csrfToken(): Promise<string> {
  pendingSession ??= getAuthSession().catch(error => { pendingSession = null; throw error; });
  const session = await pendingSession;
  if (!session.authenticated || !session.csrfToken) {
    clearAuthSession(); window.location.replace("/login");
    throw new Error("Iniciá sesión para continuar");
  }
  return session.csrfToken;
}
