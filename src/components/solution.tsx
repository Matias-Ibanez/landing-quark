import {
  Database,
  Sparkle,
  PaperPlaneTilt,
  ChartLineUp,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

type CellProps = {
  icon: Icon;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
};

function Cell({ icon: IconEl, title, body, className = "", children }: CellProps) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 ${className}`}
    >
      {children}
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-200">
          <IconEl size={20} />
        </div>
        <h3 className="mt-6 text-lg font-medium text-zinc-50">{title}</h3>
        <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
          {body}
        </p>
      </div>
    </div>
  );
}

const pillars = [
  {
    icon: Database,
    title: "Motor de contexto",
    body: "Ingiere tu Brand Book: inventario, tono de voz, colores y objetivos. Coherencia en cada iteración.",
  },
  {
    icon: Sparkle,
    title: "Pipeline generativo",
    body: "Diseña flyers y redacta captions optimizados con modelos de lenguaje y generación gráfica.",
  },
  {
    icon: PaperPlaneTilt,
    title: "Distribución automática",
    body: "Calendariza y publica en Instagram y otras plataformas vía APIs oficiales como Meta Graph.",
  },
  {
    icon: ChartLineUp,
    title: "Analítica y recomendación",
    body: "Monitorea engagement y alcance. Si caen, ajusta los prompts y te avisa con recomendaciones.",
  },
];

export function Solution() {
  const [a, b, c, d] = pillars;

  return (
    <section id="solucion" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="La solución"
          title="Un agente que hace el trabajo completo."
          sub="Quark gestiona el ciclo de vida del contenido en redes: del contexto del negocio a la publicación y la optimización."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <Cell
              icon={a.icon}
              title={a.title}
              body={a.body}
              className="bg-zinc-900 p-8 md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-zinc-500/10 blur-3xl" />
            </Cell>
          </Reveal>

          <Reveal className="md:col-span-1" delay={0.08}>
            <Cell icon={b.icon} title={b.title} body={b.body} />
          </Reveal>

          <Reveal className="md:col-span-1" delay={0.08}>
            <Cell icon={c.icon} title={c.title} body={c.body} />
          </Reveal>

          <Reveal className="md:col-span-2" delay={0.12}>
            <Cell
              icon={d.icon}
              title={d.title}
              body={d.body}
              className="bg-zinc-900"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-800/60 to-transparent" />
            </Cell>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
