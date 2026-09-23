import type { Icon } from "@phosphor-icons/react";
import {
  Check,
  PenNib,
  ShareNetwork,
  TreeStructure,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { chatHref } from "@/lib/site";

const plans: Array<{
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  icon: Icon;
  features: string[];
  featured: boolean;
}> = [
  {
    name: "Crear",
    tagline: "Para ordenar la producción y publicar por tu cuenta.",
    price: "Consultar",
    priceNote: "mensual · solo generación de contenido",
    icon: PenNib,
    features: [
      "Contexto de marca de tu negocio",
      "Contenido con límite diario",
      "Textos y piezas visuales",
      "Edición, revisión y aprobación",
      "Calendario de contenidos",
    ],
    featured: false,
  },
  {
    name: "Presencia",
    tagline: "Para producir más y sostener un canal activo.",
    price: "Consultar",
    priceNote: "mensual · generación + una red social",
    icon: ShareNetwork,
    features: [
      "Todo lo incluido en Crear",
      "Mayor capacidad diaria",
      "Publicación en una red social",
      "Lectura de resultados",
      "Recomendaciones para el próximo ciclo",
    ],
    featured: true,
  },
  {
    name: "Multicanal",
    tagline: "Para coordinar una presencia activa en varias redes.",
    price: "Consultar",
    priceNote: "mensual · generación + múltiples redes",
    icon: TreeStructure,
    features: [
      "Todo lo incluido en Presencia",
      "Capacidad diaria ampliada",
      "Publicación en múltiples redes",
      "Calendario coordinado por canal",
      "Acompañamiento para configurar el flujo",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="planes" className="scroll-mt-20 py-20 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Planes"
          title="Elegí cuánto querés automatizar."
          sub="Durante la demo definimos el volumen diario, los canales y el precio adecuado para tu negocio."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const PlanIcon = plan.icon;
            return (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-6 md:p-7 ${
                    plan.featured
                      ? "border-zinc-600 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900/50"
                  } ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  {plan.featured ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-950">
                      Recomendado
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-medium tracking-tight text-zinc-50">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                        {plan.tagline}
                      </p>
                    </div>
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${
                        plan.featured
                          ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400"
                      }`}
                      aria-hidden="true"
                    >
                      <PlanIcon size={22} weight="duotone" />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-zinc-800 pt-5">
                    <p className="text-lg font-medium text-zinc-400">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {plan.priceNote}
                    </p>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          size={16}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-zinc-400"
                        />
                        <span className="text-sm leading-relaxed text-zinc-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Cta
                      href={chatHref}
                      variant={plan.featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      Probar Gratis
                    </Cta>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-zinc-600">
          No publicamos montos fijos sin conocer tu volumen y canales. En la demo
          cerramos el plan y el precio mensual para tu negocio.
        </p>
      </Container>
    </section>
  );
}
