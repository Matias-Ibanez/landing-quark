import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Chat — QUARK",
  description:
    "Chateá con QUARK, tu asistente de marketing con IA. Generá contenido, estrategias y calendarios para tu negocio.",
};

export default async function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const session = jar.get("__Host-quark-session") || jar.get("quark-session");
  if (!session) redirect("/login");
  const backend = (process.env.QUARK_API_URL || "http://127.0.0.1:8011").replace(/\/$/, "");
  const response = await fetch(`${backend}/api/auth/check`, {
    headers: { Cookie: `${session.name}=${session.value}` }, cache: "no-store", signal: AbortSignal.timeout(5000),
  }).catch(() => null);
  if (!response?.ok) redirect("/login");
  return <>{children}</>;
}
