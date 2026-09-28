import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { ImageSlider } from "@/components/ui/image-slider";
import { LoginForm } from "./login-form";
export const metadata: Metadata = { title: "Ingresar — QUARK", robots: { index: false, follow: false } };
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-5 py-6 text-zinc-100 sm:px-8 sm:py-10">
      <section className="grid w-full max-w-6xl gap-8 rounded-[2.25rem] lg:grid-cols-2 lg:border lg:border-zinc-800 lg:bg-zinc-900/40 lg:p-3">
        <div className="hidden lg:block"><ImageSlider /></div>
        <div className="flex flex-col justify-between px-0 py-4 sm:px-6 lg:px-10 lg:py-8 xl:px-14">
          <Link href="/" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><ArrowLeft size={16} aria-hidden="true" />Volver al inicio</Link>
          <div className="my-10 lg:my-8">
            <p className="mb-7 text-sm font-semibold tracking-[.2em] lg:hidden">QUARK</p>
            <p className="mb-3 text-sm text-zinc-400">Tu espacio para crear</p>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Bienvenido de nuevo</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">Ingresá para trabajar tus ideas, crear contenido y seguir con tus conversaciones.</p>
            <LoginForm />
          </div>
          <p className="max-w-sm text-xs leading-5 text-zinc-500">Acceso privado. Si necesitás las credenciales, pedíselas al responsable de este espacio.</p>
        </div>
      </section>
    </main>
  );
}
