import {
  ClockCountdown,
  PaintBrushBroad,
  Repeat,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const pains = [
  {
    icon: ClockCountdown,
    title: "Falta tiempo",
    body: "Entre atender clientes y llevar el negocio, las redes quedan para después.",
  },
  {
    icon: Repeat,
    title: "Falta constancia",
    body: "Querés estar presente, pero no siempre sabés qué publicar.",
  },
  {
    icon: PaintBrushBroad,
    title: "Querés que se vea bien",
    body: "Tus productos son buenos. Tus publicaciones también deberían serlo.",
  },
];

const commerceImage =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=900&q=85";

export function Problem() {
  return (
    <section id="problema" className="py-20 md:py-24">
      <Container>
        <SectionHeader
          title="Atender, vender, publicar... El día no alcanza."
          sub="Te ayudamos con tus redes para que puedas ocuparte de todo lo demás."
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

          <figure className="mx-auto w-full max-w-lg lg:ml-auto">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={commerceImage} alt="Atención al cliente en un comercio local" fill sizes="(min-width: 1024px) 32rem, (min-width: 768px) 28rem, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-4 text-sm text-zinc-400">
              Más tiempo para tus clientes
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
