import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { chatHref } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&h=1080&q=80"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950" />

      <Container className="relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-medium tracking-tight text-zinc-50 md:text-6xl">
            Lo que hacés merece que lo conozcan.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-zinc-400">
            Contanos qué querés mostrar. Te ayudamos a convertirlo en tu próxima publicación.
          </p>
          <div className="mt-10 flex justify-center">
            <Cta href={chatHref}>
              Crear mi contenido
              <ArrowRight size={16} aria-hidden="true" />
            </Cta>
          </div>
        </div>
      </Container>
    </section>
  );
}
