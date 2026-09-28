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
    title: "Entiende tu negocio",
    body: "Lo que vendés, a quién le hablás y tu estilo se reflejan en las propuestas.",
  },
  {
    icon: Sparkle,
    title: "Te ayuda a empezar",
    body: "Dejás de mirar una pantalla en blanco. Recibís ideas que podés usar.",
  },
  {
    icon: CursorClick,
    title: "Vos tenés la última palabra",
    body: "Pedí otro texto, cambiá los colores o probá un estilo diferente.",
  },
  {
    icon: FlowArrow,
    title: "Todo queda a mano",
    body: "Conversaciones, imágenes y videos juntos, para seguir trabajando cuando quieras.",
  },
];

const stages = [
  {
    label: "Borrador",
    detail: "Pedís una publicación para mostrar un producto.",
  },
  {
    label: "Revisión",
    detail: "Revisás el diseño y pedís los cambios que necesites.",
  },
  {
    label: "Aprobado",
    detail: "Guardás la versión que te gusta.",
  },
  {
    label: "Listo para compartir",
    detail: "Descargás tu contenido para publicarlo en tus redes.",
  },
];

export function WhyQuark() {
  return (
    <section id="por-que-quark" className="scroll-mt-20 py-20 md:py-24">
      <Container>
        <SectionHeader
          title="Tu negocio tiene su estilo. Tus redes también."
          sub="Un compañero para tus ideas, con espacio para probar y cambiar de opinión."
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
                De una idea a una publicación
              </p>

            </div>

            <ol className="mt-8 space-y-0" aria-label="Pasos para preparar una publicación">
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
