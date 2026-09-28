import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUARK - Imágenes y videos para tu negocio",
  description:
    "QUARK te ayuda a crear publicaciones, imágenes y videos para tu negocio. Menos tareas, más tiempo para atender y vender.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-[100dvh] antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
