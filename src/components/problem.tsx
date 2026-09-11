import {
  ClockCountdown,
  PaintBrushBroad,
  Repeat,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import {
  DitherImage,
  DitherImageCaption,
  DitherImageContent,
  DitherImageFrame,
  DitherImageOverlay,
  DitherImageReveal,
} from "@/components/ui/dither-image";
import { SectionHeader } from "@/components/ui/section-header";

const pains = [
  {
    icon: ClockCountdown,
    title: "Falta tiempo",
    body: "Lo urgente gana y la comunicación se posterga una semana más.",
  },
  {
    icon: Repeat,
    title: "Falta constancia",
    body: "Publicar solo cuando hay una promoción no construye presencia.",
  },
  {
    icon: PaintBrushBroad,
    title: "Cuesta sostener calidad",
    body: "Cada pieza vuelve a empezar sin una voz ni una identidad compartida.",
  },
];

const commerceImage =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=900&q=85";

export function Problem() {
  return (
    <section id="problema" className="py-20 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="El problema"
          title="Tu negocio tiene algo para contar. El día no siempre deja tiempo."
          sub="QUARK concentra tres tareas que hoy compiten con atender, vender y gestionar."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.9fr] lg:items-center">
          <div className="border-t border-zinc-800">
            {pains.map((pain) => {
              const Icon = pain.icon;
              return (
                <div
                  key={pain.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-zinc-800 py-6"
                >
                  <Icon
                    size={22}
                    className="mt-0.5 text-zinc-500"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium text-zinc-100">{pain.title}</h3>
                    <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
                      {pain.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <DitherImage className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto lg:max-w-sm">
            <DitherImageReveal className="aspect-[4/3] w-full rounded-2xl border border-zinc-800">
              <DitherImageFrame
                aspectRatio="4 / 3"
                size="sm"
                contrast={14}
                brightness={0.95}
                opacity={0.62}
                className="h-full overflow-hidden"
              >
                <DitherImageContent
                  src={commerceImage}
                  alt="Atención al cliente en un comercio local"
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 768px) 28rem, 100vw"
                />
              </DitherImageFrame>
              <DitherImageOverlay
                src={commerceImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 768px) 28rem, 100vw"
                direction="r"
                from={0}
                to={72}
              />
            </DitherImageReveal>
            <DitherImageCaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              Tecnología pensada para negocios reales
            </DitherImageCaption>
          </DitherImage>
        </div>
      </Container>
    </section>
  );
}
