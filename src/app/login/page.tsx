import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
export const metadata: Metadata = { title: "Ingresar — QUARK", robots: { index: false, follow: false } };
export default function LoginPage() {
  return <main className="flex min-h-dvh items-center justify-center bg-[#101012] px-5 py-12 text-zinc-100">
    <section className="w-full max-w-sm">
      <Link href="/" className="mb-12 inline-flex text-xl font-semibold tracking-[0.18em] text-zinc-100">QUARK</Link>
      <p className="mb-3 text-sm text-violet-300">Tu espacio de marketing</p>
      <h1 className="text-3xl font-medium tracking-tight">Bienvenido de nuevo</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-400">Ingresá para trabajar tus ideas, crear contenido y seguir con tus conversaciones.</p>
      <LoginForm />
      <p className="mt-8 text-xs leading-5 text-zinc-500">Acceso privado. Si necesitás las credenciales, pedíselas al responsable de este espacio.</p>
    </section>
  </main>;
}
