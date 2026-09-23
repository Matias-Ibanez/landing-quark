import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat — QUARK",
  description:
    "Chateá con QUARK, tu asistente de marketing con IA. Generá contenido, estrategias y calendarios para tu negocio.",
};

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
