import { Check } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { contactHref } from "@/lib/site";

const plans = [
  {
    name: "Essential",
    tagline: "Para comercios locales",
    features: [
      "Hasta 12 posts por mes, con imagen y copy",
      "Publicación automática en Instagram",
      "Reporte básico mensual de alcance",
      "Mantenimiento del contexto de negocio",
    ],
    featured: false,
  },
  {
    name: "Growth",
    tagline: "Para PyMEs en expansión",
    features: [
      "Hasta 30 posts por mes",
      "Publicación en Instagram, Facebook y LinkedIn",
      "Motor de recomendaciones estratégicas activo",
    ],
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="planes" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          title="Planes para cada etapa."
          sub="Desde comercios locales hasta PyMEs en expansión. Precios según el volumen de tu negocio."
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  plan.featured
                    ? "border-zinc-600 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-zinc-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-950">
                    Recomendado
                  </span>
                ) : null}

                <h3 className="text-xl font-medium text-zinc-50">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{plan.tagline}</p>

                <ul className="mt-8 flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-zinc-300"
                      />
                      <span className="text-sm leading-relaxed text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Cta
                    href={contactHref}
                    external
                    variant={plan.featured ? "primary" : "secondary"}
                    className="w-full"
                  >
                    Pedir demo
                  </Cta>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
