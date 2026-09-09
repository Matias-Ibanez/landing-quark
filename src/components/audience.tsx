import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";

const segments = [
  {
    title: "Comercios locales",
    body: "Indumentaria, gastronomía, belleza, decoración. Negocios que necesitan mostrar productos y promociones seguido.",
    seed: "quark-comercio-local",
    alt: "Vidriera de un comercio local",
  },
  {
    title: "Servicios profesionales",
    body: "Estudios, consultorios, institutos e independientes que necesitan construir autoridad y recibir consultas.",
    seed: "quark-profesional",
    alt: "Profesional trabajando en su estudio",
  },
  {
    title: "PyMEs en crecimiento",
    body: "Empresas con una oferta validada que quieren ordenar su comunicación sin sumar estructura de inmediato.",
    seed: "quark-pyme",
    alt: "Equipo de una PyME en su oficina",
  },
  {
    title: "Emprendimientos",
    body: "Marcas que venden por redes, tienda online o WhatsApp y dependen de una comunicación sostenida para generar demanda.",
    seed: "quark-emprendimiento",
    alt: "Emprendedora preparando pedidos",
  },
];

export function Audience() {
  return (
    <section id="para-quien" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          title="Para quién es QUARK."
          sub="Negocios que ya saben qué ofrecen y a quién, pero no tienen tiempo ni equipo para contarlo todos los días."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment, i) => (
            <Reveal key={segment.title} delay={i * 0.06}>
              <MinimalCard className="h-full">
                <MinimalCardImage
                  src={`https://picsum.photos/seed/${segment.seed}/800/600`}
                  alt={segment.alt}
                />
                <MinimalCardTitle>{segment.title}</MinimalCardTitle>
                <MinimalCardDescription>{segment.body}</MinimalCardDescription>
              </MinimalCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
