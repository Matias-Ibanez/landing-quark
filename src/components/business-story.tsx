import Image from "next/image";
import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { chatHref } from "@/lib/site";

export function BusinessStory() {
  return (
    <section id="tu-negocio" className="scroll-mt-20 py-14 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-sm text-zinc-400">Empezamos por conocerte</p>
          <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-medium leading-tight tracking-tight text-zinc-50 md:text-5xl">Tu negocio ya tiene algo para contar.</h2>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-300">Una novedad, tu producto favorito o ese trabajo del que estás orgulloso. QUARK te ayuda a convertirlo en contenido que tenga sentido para tus clientes.</p>
          <ul className="mt-7 space-y-4 text-sm leading-relaxed text-zinc-400">
            {[
              "Contale qué vendés y a quién querés llegar.",
              "Compartí tus fotos, colores y el estilo que te gusta.",
              "Si falta un detalle, te pregunta antes de empezar.",
            ].map(item => <li key={item} className="flex items-start gap-3"><Check size={18} className="mt-0.5 shrink-0 text-zinc-200" aria-hidden="true" />{item}</li>)}
          </ul>
          <Cta href={chatHref} variant="secondary" className="mt-8 border-zinc-600">Contar mi idea<ArrowRight size={16} aria-hidden="true" /></Cta>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="mb-5 rounded-2xl bg-zinc-800/70 px-5 py-4 text-sm leading-relaxed text-zinc-200 sm:ml-10">“Tengo una cafetería. Quiero mostrar nuestro café y que más gente venga a conocerla.”</div>
          <figure className="relative ml-0 overflow-hidden rounded-3xl bg-[#c64928] sm:mr-10">
            <div className="relative aspect-[5/4]"><Image src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&h=650&q=80" alt="Café presentado como ejemplo de una publicación" fill sizes="(max-width: 1023px) 90vw, 480px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" /><p className="absolute bottom-7 left-7 right-7 max-w-[14ch] text-4xl font-medium leading-tight tracking-tight text-white">Tu próxima pausa.<br />Un buen café.</p></div>
            <figcaption className="flex items-center justify-between gap-3 bg-zinc-900 px-5 py-4 text-xs text-zinc-400"><span>Ejemplo ilustrativo de publicación</span><span>Con tus fotos</span></figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
