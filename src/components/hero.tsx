import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Cta } from "@/components/ui/cta";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { chatHref } from "@/lib/site";

const images = [
  "photo-1509042239860-f550ce710b93", "photo-1540189549336-e6e99c3679fe",
  "photo-1491553895911-0055eca6402d", "photo-1515886657613-9f3515b0c78f",
  "photo-1551024709-8f23befc6f87", "photo-1495474472287-4d71bcdd2085",
  "photo-1483985988355-763728e1935b", "photo-1498837167922-ddd27525d352",
  "photo-1441986300917-64674bd600d8",
].map(photo => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&h=820&q=80`);

export function Hero() {
  return (
    <section aria-label="Creá contenido con QUARK" className="bg-zinc-950">
      <ImageStreamHero images={images} className="md:min-h-[780px] lg:min-h-[max(780px,calc(100svh-4rem))]">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-7 px-6 pb-8 pt-10 text-center md:min-h-[780px] lg:min-h-[max(780px,calc(100svh-4rem))] md:justify-between md:gap-64 md:pb-20 md:pt-16">
          <div>
            <p className="text-sm font-medium text-zinc-300">Menos tareas. Más ideas para tu negocio.</p>
            <h1 className="mx-auto mt-5 max-w-[22ch] text-balance text-[clamp(2rem,5.3vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.055em] text-zinc-50">
              Imágenes y videos<br />que muestran tu negocio.
            </h1>
            <p className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-zinc-300 md:text-lg">
              Contanos qué querés vender. QUARK lo convierte en publicaciones, carruseles y videos con tu estilo.
            </p>
          </div>
          <div className="relative rounded-3xl bg-zinc-950/85 px-5 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Cta href={chatHref} className="h-12 px-7">Crear mi contenido <ArrowRight size={17} aria-hidden="true" /></Cta>
              <Cta href="#como-funciona" variant="secondary" className="h-12 border-zinc-600 px-7">Cómo funciona</Cta>
            </div>
            <p className="mt-4 text-sm text-zinc-400">No necesitás saber diseñar ni conectar tus redes para empezar.</p>
          </div>
        </div>
      </ImageStreamHero>
    </section>
  );
}
