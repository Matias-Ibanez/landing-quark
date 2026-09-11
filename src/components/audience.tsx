import {
  ForkKnife,
  Scissors,
  Storefront,
  Stethoscope,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";

const segments = [
  {
    title: "Comercios",
    detail: "Productos y promociones",
    icon: Storefront,
  },
  {
    title: "Gastronomía",
    detail: "Menús, novedades y fechas",
    icon: ForkKnife,
  },
  {
    title: "Belleza",
    detail: "Servicios y turnos",
    icon: Scissors,
  },
  {
    title: "Profesionales",
    detail: "Autoridad y consultas",
    icon: Stethoscope,
  },
];

export function Audience() {
  return (
    <section
      id="para-quien"
      className="scroll-mt-20 border-b border-zinc-900 py-10"
    >
      <Container>
        <p className="max-w-3xl text-balance text-xl font-medium tracking-tight text-zinc-100 md:text-2xl">
          Para negocios que conocen su oferta, pero no tienen tiempo para
          comunicarla todos los días.
        </p>

        <div className="mt-8 grid grid-cols-2 border-l border-t border-zinc-800 lg:grid-cols-4">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <div
                key={segment.title}
                className="border-b border-r border-zinc-800 p-4 md:p-5"
              >
                <Icon size={20} className="text-zinc-500" aria-hidden="true" />
                <p className="mt-5 text-sm font-medium text-zinc-100">
                  {segment.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {segment.detail}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
