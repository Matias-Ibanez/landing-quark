export interface Project { id: string; name: string; revision: number; updated_at: string }
export interface Asset { id: string; name: string; filename: string; kind: "image" | "audio" }
export interface Run { id: string; status: string; error: string | null }
export interface Job {
  id: string; project_id: string; kind: string; status: string; error: string | null;
  created_at: string;
  payload: { revision: number; kind: "png" | "mp4"; quality: string; hermes?: boolean; document: { caption: string; engine: string } };
  result: { url?: string; assetId?: string } | null;
}
export interface CalendarEvent {
  id: string; project_id: string; job_id: string | null; title: string;
  scheduled_at: string; status: string; error: string | null;
}
export interface Settings {
  provider: "hermes_deepseek"; model: string; hasDeepSeekKey: boolean; instagramConfigured: boolean;
  brand: { name: string; tone: string; context: string };
}
export interface DeepSeekBalance { configured: boolean; available: boolean; balances: { currency: string; total: string }[] }
export interface CostSummary {
  estimatedSpendUsd: number; unpricedRuns: number; allInAverageUsd: number | null;
  images: { pieces: number; averageDirectUsd: number | null };
  videos: { pieces: number; averageDirectUsd: number | null };
  rateSource: string;
}
export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method, cache: "no-store",
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  const value = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof value.detail === "string" ? value.detail : `No se pudo completar la operación (${response.status})`);
  return value as T;
}
export const stateLabel: Record<string, string> = {
  queued: "En cola", running: "Procesando", done: "Lista", failed: "Error", draft: "Borrador",
  approved: "Aprobada", scheduled: "Programada", publishing: "Publicando", published: "Publicada",
  needs_review: "Revisar envío", cancelled: "Cancelada",
};
