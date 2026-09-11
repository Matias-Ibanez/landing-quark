import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { contactHref } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25 grayscale contrast-125"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950" />

      <Container className="relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-medium tracking-tight text-zinc-50 md:text-6xl">
            Tu negocio ya tiene algo valioso para comunicar.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-zinc-400">
            Pedí una demo y te mostramos cómo QUARK ordena el contenido y
            sostiene tu presencia, con tu criterio al frente.
          </p>
          <div className="mt-10 flex justify-center">
            <Cta href={contactHref} external>
              Pedir demo
              <ArrowRight size={16} aria-hidden="true" />
            </Cta>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            El contacto definitivo se completa antes del lanzamiento.
          </p>
        </div>
      </Container>
    </section>
  );
}
