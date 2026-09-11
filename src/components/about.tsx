import type { Icon } from "@phosphor-icons/react";
import {
  Binoculars,
  HeartStraight,
  Target,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

type Pillar = {
  title: string;
  icon: Icon;
  body?: string;
  items?: string[];
};

const pillars: Pillar[] = [
  {
    title: "Misión",
    body:
      "Acercar el marketing digital a comercios y PyMEs del NOA con herramientas que respeten su voz, su tiempo y su criterio.",
    icon: Target,
  },
  {
    title: "Visión",
    body:
      "Ser la plataforma de referencia en la región para que cada negocio local sostenga una presencia digital constante sin dejar de atender lo esencial.",
    icon: Binoculars,
  },
  {
    title: "Valores",
    items: [
      "Cercanía: tecnología hecha desde y para negocios reales de la región.",
      "Control: la IA propone, vos revisás y aprobás antes de publicar.",
      "Constancia: presencia que se sostiene en el tiempo, no solo cuando hay una promo.",
    ],
    icon: HeartStraight,
  },
];

const points = [
  {
    title: "Equipo del NOA",
    body:
      "Somos un equipo de producto, tecnología y comunicación del Noroeste Argentino. Construimos QUARK para negocios que conocen su oficio y necesitan una forma más simple de contarlo.",
  },
  {
    title: "Acompañamiento real",
    body:
      "Hay personas detrás para configurar el flujo, revisar dudas y ajustar el uso. El soporte llega por WhatsApp o correo, no solo por una bandeja automática.",
  },
];

export function About() {
  return (
    <section
      id="quienes-somos"
      className="scroll-mt-20 border-t border-zinc-900 py-16 md:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:pt-1">
            <Eyebrow>Quiénes somos</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-4xl">
              Tecnología cercana para negocios reales.
            </h2>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-8 lg:gap-12">
            <div className="grid gap-8 border-t border-zinc-800 pt-8 sm:grid-cols-2 sm:gap-10 lg:pt-6">
              {points.map((point) => (
                <div key={point.title}>
                  <h3 className="text-base font-medium text-zinc-100">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {point.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid border-t border-zinc-800 sm:grid-cols-3">
              {pillars.map((pillar) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="border-b border-zinc-800 py-6 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0 sm:py-0 sm:pt-6"
                  >
                    <div className="flex items-center gap-2.5">
                      <PillarIcon
                        size={18}
                        weight="duotone"
                        className="shrink-0 text-zinc-500"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-medium text-zinc-100">
                        {pillar.title}
                      </h3>
                    </div>
                    {pillar.body ? (
                      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        {pillar.body}
                      </p>
                    ) : null}
                    {pillar.items ? (
                      <ul className="mt-3 space-y-2.5">
                        {pillar.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm leading-relaxed text-zinc-400"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
