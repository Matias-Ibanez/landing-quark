import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const barriers = [
  {
    title: "Económica",
    body: "Una agencia o un community manager cuesta un fijo mensual que una microempresa no puede sostener.",
  },
  {
    title: "Tiempo y foco",
    body: "Crear contenido saca al dueño del negocio y termina en publicaciones esporádicas y de baja calidad.",
  },
  {
    title: "Técnica y estética",
    body: "Sin diseño, copywriting ni lectura de métricas, la comunicación se ve pobre y daña la marca.",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader title="Publicar en redes te cuesta tiempo, dinero y foco." />
          <div className="mt-10 divide-y divide-zinc-900">
            {barriers.map((barrier, i) => (
              <Reveal key={barrier.title} delay={i * 0.06}>
                <div className="py-6">
                  <h3 className="text-base font-medium text-zinc-100">
                    {barrier.title}
                  </h3>
                  <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-zinc-400">
                    {barrier.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="lg:pt-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="https://picsum.photos/seed/quark-pyme-taller/1000/1250"
              alt="Interior de un comercio local atendiendo a clientes"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
