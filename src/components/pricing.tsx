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
    tagline: "Para tener contenido listo y compartirlo a tu manera.",
    price: "Consultar",
    priceNote: "mensual · creación de contenido",
    icon: PenNib,
    features: [
      "Contenido con el estilo de tu negocio",
      "Contenido con límite diario",
      "Textos, imágenes y videos",
      "Cambios hasta que te guste",
      "Calendario de contenidos",
    ],
    featured: false,
  },
  {
    name: "Presencia",
    tagline: "Para mantener tus redes al día.",
    price: "Consultar",
    priceNote: "mensual · generación + una red social",
    icon: ShareNetwork,
    features: [
      "Todo lo incluido en Crear",
      "Más contenido cada día",
      "Publicación en una red social",
      "Conocé cómo van tus publicaciones",
      "Ideas para tus próximas publicaciones",
    ],
    featured: true,
  },
  {
    name: "Multicanal",
    tagline: "Para acompañar tu negocio en varias redes.",
    price: "Consultar",
    priceNote: "mensual · generación + múltiples redes",
    icon: TreeStructure,
    features: [
      "Todo lo incluido en Presencia",
      "Más espacio para crear contenido",
      "Publicación en múltiples redes",
      "Tus publicaciones organizadas por red",
      "Ayuda para dar tus primeros pasos",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="planes" className="scroll-mt-20 py-20 md:py-24">
      <Container>
        <SectionHeader
          title="Una ayuda a la medida de tu negocio."
          sub="Elegí la ayuda que necesitás. El precio se acuerda según cuánto contenido quieras y las redes que uses."
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
          Los planes y precios se definen según las necesidades de tu negocio. La conexión y publicación en redes estarán disponibles próximamente.
        </p>
      </Container>
    </section>
  );
}
