"use client";

import { Plus } from "@phosphor-icons/react/ssr";
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { contentPlans, socialPlan } from "@/lib/landing-plans";

const faqs = [
  {
    q: "¿Qué puedo crear con QUARK?",
    a: "Imágenes para promociones, publicaciones y carruseles, con tus fotos y el estilo de tu negocio. También videos con animaciones, tus imágenes o clips, y voz o música si querés.",
  },
  {
    q: "¿Puedo usar mis propias fotos?",
    a: "Sí. Podés subir fotos de tus productos, tu local o tus trabajos. QUARK las usa para preparar el diseño; no necesitás inventar fotos nuevas para mostrar lo que vendés.",
  },
  {
    q: "¿Necesito saber de marketing o de inteligencia artificial?",
    a: "No. Solo contanos qué querés mostrar. Si hace falta algún detalle, QUARK te hace preguntas simples y te ayuda a elegir.",
  },
  {
    q: "¿QUARK garantiza más ventas?",
    a: "No podemos garantizar ventas. Te ayudamos a mostrar mejor tu negocio y a mantener tus redes activas. Tus productos, tus precios y tu atención también cuentan.",
  },
  {
    q: "¿Puedo pedir cambios?",
    a: "Sí. Los planes propuestos incluyen dos rondas de cambios por pieza para ajustar textos, colores o detalles. Revisá precios, fechas y promociones antes de compartir el resultado.",
  },
  {
    q: "¿Cómo se cuentan las imágenes y los videos?",
    a: "Cada imagen final cuenta como una pieza. Un carrusel de cinco láminas usa cinco imágenes. Cada video puede durar hasta 60 segundos. Las dos rondas de cambios incluidas no suman piezas nuevas.",
  },
  {
    q: "¿Qué cambia entre los planes?",
    a: `Imágenes propone ${contentPlans[0].images} imágenes por US$${contentPlans[0].price}/mes. Imágenes + videos propone ${contentPlans[1].images} imágenes y ${contentPlans[1].videos} videos por US$${contentPlans[1].price}/mes. Contenido + redes sumará gestión de una cuenta de Instagram por US$${socialPlan.price}/mes. Son precios de lanzamiento propuestos; la prueba actual no tiene cobros.`,
  },
  {
    q: "¿Tengo que conectar mis redes para crear contenido?",
    a: "No. Los planes de creación funcionan con tus ideas y archivos. Descargás el resultado y lo compartís donde quieras. Conectar y programar publicaciones en Instagram será una opción del plan Contenido + redes, disponible próximamente.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader
            title="Preguntas frecuentes."
            sub="Antes de crear tu primera publicación."
          />
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {faqs.map((item) => (
              <Expandable key={item.q} className="py-1">
                {({ isExpanded }) => (
                  <>
                    <ExpandableTrigger
                      aria-label={item.q}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:text-white"
                    >
                      <span className="text-base font-medium text-zinc-100 md:text-lg">
                        {item.q}
                      </span>
                      <Plus
                        size={18}
                        className={cn(
                          "shrink-0 text-zinc-400 transition-transform duration-300",
                          isExpanded && "rotate-45",
                        )}
                      />
                    </ExpandableTrigger>
                    <ExpandableContent preset="fade">
                      <p className="max-w-[62ch] pb-6 text-sm leading-relaxed text-zinc-400 md:text-base">
                        {item.a}
                      </p>
                    </ExpandableContent>
                  </>
                )}
              </Expandable>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
