import {
  ChatCircleDots,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Tus cuentas, cuidadas",
    body: "Cada conexión te explica qué acceso necesita y para qué.",
  },
  {
    icon: CheckCircle,
    title: "Vos elegís qué compartir",
    body: "Revisás tus publicaciones antes de que lleguen a tus clientes.",
  },
  {
    icon: ChatCircleDots,
    title: "Ayuda para empezar",
    body: "Preguntas simples para acompañarte en tus primeros pasos.",
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
              Con vos en cada paso
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-4xl">
              Tu negocio sigue en tus manos.
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
            Próximamente, podrás conectar tus redes para compartir tu contenido desde QUARK. Cada conexión requerirá tu autorización.
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
