import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { TextAnimate } from "@/components/ui/text-animate";
import { contactHref } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://picsum.photos/seed/quark-ciudad-noa/1920/1080"
        alt=""
        fill
        sizes="100vw"
        className="object-cover grayscale contrast-125 opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-950" />

      <Container className="relative py-28 md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <TextAnimate
            text="Tu negocio ya tiene algo valioso para comunicar."
            type="calmInUp"
            className="text-4xl font-medium tracking-tight text-zinc-50 md:text-6xl"
          />
          <Reveal delay={0.4}>
            <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-zinc-400">
              Empezá a hacerlo visible. Te mostramos cómo QUARK ordena tu
              contenido y sostiene tu presencia digital.
            </p>
            <div className="mt-10 flex justify-center">
              <Cta href={contactHref} external>
                Pedir demo
              </Cta>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
