import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const pains = [
  {
    title: "Económico",
    body: "Diseño, redacción, planificación y análisis por separado son un costo fijo que una microempresa no sostiene. Hacerlo vos también cuesta: horas.",
  },
  {
    title: "Operativo",
    body: "La comunicación se posterga cuando aparece lo urgente. Publicás unos días, abandonás, volvés para una promo y nunca construís presencia.",
  },
  {
    title: "De calidad",
    body: "Piezas sin identidad visual, textos poco claros y llamados a la acción débiles. La marca se ve menos profesional de lo que es.",
  },
  {
    title: "Estratégico",
    body: "Publicar no es comunicar. Sin objetivos ni métricas, no sabés qué repetir, qué cambiar ni qué contenido trae consultas.",
  },
];

export function Problem() {
  return (
    <section id="problema" className="py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            title="El costo de no comunicar."
            sub="Tus clientes revisan tus redes antes de escribirte. Si no publicás, la decisión se toma sin vos."
          />
          <div className="mt-10 divide-y divide-zinc-900">
            {pains.map((pain, i) => (
              <Reveal key={pain.title} delay={i * 0.06}>
                <div className="py-6">
                  <h3 className="text-base font-medium text-zinc-100">
                    {pain.title}
                  </h3>
                  <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-zinc-400">
                    {pain.body}
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
