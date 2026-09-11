"use client";

import {
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Sparkle,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { GridBeam } from "@/components/ui/grid-beam";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: ClipboardText,
    number: "01",
    title: "Conoce tu negocio",
    body: "Cargás oferta, público, zona, tono y objetivos una sola vez.",
    result: "Contexto que se reutiliza",
  },
  {
    icon: Sparkle,
    number: "02",
    title: "Propone y genera",
    body: "QUARK sugiere temas, fechas, textos y piezas alineadas con tu marca.",
    result: "Un plan accionable",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Vos revisás",
    body: "Editás, pedís cambios o aprobás antes de que algo salga.",
    result: "Control sobre cada publicación",
  },
  {
    icon: ChartLineUp,
    number: "04",
    title: "Publica y aprende",
    body: "Lo aprobado se agenda y sus resultados orientan el siguiente ciclo.",
    result: "Mejora con información",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-y border-zinc-900 py-20 md:py-24"
    >
      <Container>
        <SectionHeader
          eyebrow="Cómo funciona"
          title="Un mismo flujo, desde la idea hasta el aprendizaje."
          sub="Automatizamos lo repetitivo. Las decisiones que representan a tu negocio siguen siendo tuyas."
        />

        <GridBeam
          rows={2}
          cols={2}
          colorVariant="mono"
          theme="dark"
          active={reduce === false}
          duration={5.5}
          strength={0.8}
          breathe={false}
          borderRadius={24}
          className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950"
        >
          <ol className="grid md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="min-h-64 border-b border-zinc-800 p-6 last:border-b-0 odd:border-zinc-800 md:p-8 md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      size={22}
                      className="text-zinc-300"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs text-zinc-600">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-10 text-xl font-medium tracking-tight text-zinc-50 md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-zinc-400">
                    {step.body}
                  </p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                    {step.result}
                  </p>
                </li>
              );
            })}
          </ol>
        </GridBeam>

        <p className="mt-6 text-sm text-zinc-500">
          Los datos comerciales sensibles, como precios, stock o promociones,
          requieren tu aprobación.
        </p>
      </Container>
    </section>
  );
}
