import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Cta } from "@/components/ui/cta";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import { chatHref } from "@/lib/site";

export function Hero() {
  return (
    <ScrollMorphHero>
      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-6 text-center">
        <p className="mb-6 text-sm font-medium text-zinc-300">Un aliado para tu negocio</p>
        <h1 className="max-w-[22ch] text-balance text-[clamp(2.1rem,5.5vw,5.25rem)] font-medium leading-[1.06] tracking-[-0.055em] text-zinc-50">
          Tu negocio primero.<br />Tus redes, con QUARK.
        </h1>
        <p className="mx-auto mt-6 max-w-[48ch] text-base leading-relaxed text-zinc-300 md:text-lg">
          Automatizamos tus contenidos para que te dediques a lo que mejor hacés: llevar tu negocio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Cta href={chatHref} className="h-12 px-7">Probar Gratis <ArrowRight size={17} aria-hidden="true" /></Cta>
          <Cta href="#como-funciona" variant="secondary" className="h-12 border-zinc-600 bg-zinc-950/70 px-7">Ver cómo funciona</Cta>
        </div>
      </div>
    </ScrollMorphHero>
  );
}
