import {
  Brain,
  CursorClick,
  FlowArrow,
  Sparkle,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const benefits = [
  {
    icon: Brain,
    title: "Parte de tu contexto",
    body: "Oferta, público, tono y objetivos orientan cada propuesta.",
  },
  {
    icon: Sparkle,
    title: "Convierte estrategia en piezas",
    body: "No entrega una idea aislada. La ubica en un plan de comunicación.",
  },
  {
    icon: CursorClick,
    title: "Mantiene revisión humana",
    body: "Podés editar, pedir cambios y aprobar antes de publicar.",
  },
  {
    icon: FlowArrow,
    title: "Cierra el ciclo",
    body: "Planificación, contenido, publicación y análisis viven en un flujo.",
  },
];

const stages = [
  {
    label: "Borrador",
    detail: "QUARK propone una pieza desde el contexto de la marca.",
  },
  {
    label: "Revisión",
    detail: "Ajustás el mensaje y validás precios, stock o promociones.",
  },
  {
    label: "Aprobado",
    detail: "La pieza queda lista para entrar al calendario.",
  },
  {
    label: "Publicado",
    detail: "El resultado orienta el próximo ciclo de contenido.",
  },
];

export function WhyQuark() {
  return (
    <section id="por-que-quark" className="scroll-mt-20 py-20 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Por qué QUARK"
          title="Más que generar texto. Un sistema para sostener tu marketing."
          sub="La herramienta ordena el trabajo sin quitarte criterio ni control."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="grid sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="border-t border-zinc-800 py-6 sm:px-5 sm:odd:border-r sm:odd:pl-0"
                >
                  <Icon
                    size={20}
                    className="text-zinc-500"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 font-medium text-zinc-100">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-zinc-400">
                    {benefit.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/35 p-5 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Ejemplo conceptual
              </p>
              <p className="text-xs text-zinc-600">Flujo de aprobación</p>
            </div>

            <ol className="mt-8 space-y-0" aria-label="Flujo de aprobación">
              {stages.map((stage, index) => (
                <li
                  key={stage.label}
                  className="grid grid-cols-[2rem_1fr] gap-x-4"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 font-mono text-[10px] text-zinc-400"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    {index < stages.length - 1 ? (
                      <span
                        className="my-1 w-px flex-1 min-h-8 bg-zinc-800"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <div className={index < stages.length - 1 ? "pb-6" : ""}>
                    <p className="text-sm font-medium text-zinc-100">
                      {stage.label}
                    </p>
                    <p className="mt-1 max-w-[36ch] text-xs leading-relaxed text-zinc-500">
                      {stage.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
