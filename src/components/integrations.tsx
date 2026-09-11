import {
  ChatCircleDots,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Conexiones oficiales",
    body: "La publicación se plantea sobre APIs y permisos de cada plataforma.",
  },
  {
    icon: CheckCircle,
    title: "Aprobación visible",
    body: "El estado de cada pieza queda claro antes de salir.",
  },
  {
    icon: ChatCircleDots,
    title: "Acompañamiento humano",
    body: "Hay soporte para configurar y ajustar el flujo.",
  },
];

const plannedPlatforms = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "WhatsApp",
];

export function Integrations() {
  return (
    <section
      id="confianza"
      className="border-y border-zinc-900 bg-zinc-900/20 py-16 md:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Confianza desde el diseño
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-4xl">
              Automatizar no significa perder control.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="border-t border-zinc-800 py-6 sm:border-l sm:px-5 sm:first:border-l-0"
                >
                  <Icon
                    size={20}
                    className="text-zinc-500"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-sm font-medium text-zinc-100">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {point.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-zinc-800 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[58ch] text-xs leading-relaxed text-zinc-500">
            Hoja de ruta: integraciones previstas mediante APIs oficiales,
            sujetas a disponibilidad, permisos y revisión de cada plataforma.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Integraciones previstas">
            {plannedPlatforms.map((platform) => (
              <li
                key={platform}
                className="rounded-full border border-zinc-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400"
              >
                {platform}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
