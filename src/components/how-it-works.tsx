import { ChatCircleDots, Sparkle, CheckCircle } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    icon: ChatCircleDots,
    title: "Contanos qué querés mostrar",
    body: "Un producto, una promoción o una idea. QUARK te pregunta solo lo que necesita para empezar.",
  },
  {
    icon: Sparkle,
    title: "Nos ocupamos del contenido",
    body: "Recibí textos, imágenes y videos preparados para tu negocio, con el estilo que elijas.",
  },
  {
    icon: CheckCircle,
    title: "Dale tu toque y compartilo",
    body: "Pedí los cambios que quieras. Cuando te guste, descargalo y compartilo en tus redes.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-zinc-800 bg-zinc-900/20 py-20 md:py-28">
      <Container>
        <SectionHeader title="Una idea. Tres pasos. Tu próxima publicación." sub="No necesitás saber diseñar. Solo contarnos qué querés mostrar." />
        <ol className="mt-12 divide-y divide-zinc-800">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Reveal delay={index * .08} className="grid grid-cols-[3rem_1fr] items-start gap-x-4 gap-y-3 py-8 md:grid-cols-[4rem_1fr_1fr] md:items-center md:gap-10 md:py-10">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200"><Icon size={24} aria-hidden="true" /></span>
                  <h3 className="max-w-[22ch] text-xl font-medium tracking-tight text-zinc-100 md:text-3xl">{step.title}</h3>
                  <p className="col-start-2 max-w-[42ch] text-sm leading-relaxed text-zinc-400 md:col-start-auto md:text-base">{step.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
