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

const faqs = [
  {
    q: "¿QUARK publica sin que yo revise?",
    a: "Vos elegís qué compartir. Podés revisar y cambiar cada publicación. La conexión para publicar directamente desde QUARK está prevista para más adelante.",
  },
  {
    q: "¿El contenido va a sonar igual al de todos?",
    a: "Le contás qué vendés, a quién querés llegar y qué estilo te gusta. Con eso prepara propuestas para tu negocio que podés ajustar.",
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
    q: "¿Qué pasa si la inteligencia artificial se equivoca?",
    a: "Podés pedirle cambios. Revisá siempre datos como precios, fechas y promociones antes de compartir el contenido.",
  },
  {
    q: "¿Qué datos necesita de mi negocio?",
    a: "Qué vendés, quiénes son tus clientes y qué querés contar. También podés compartir fotos de tus productos o materiales que quieras usar.",
  },
  {
    q: "¿Qué cambia entre los planes?",
    a: "Cuánto contenido querés crear y las redes en las que querés estar. En la demostración te ayudamos a elegir lo que mejor se adapte a tu negocio.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader
            title="Preguntas frecuentes."
            sub="Lo que nos preguntan antes de pedir una demo."
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
