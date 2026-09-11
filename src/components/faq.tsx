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
    a: "No. El flujo recomendado te muestra cada pieza antes de publicarla: la editás, pedís cambios o la aprobás. La publicación automática depende del plan y de los permisos de cada plataforma.",
  },
  {
    q: "¿El contenido va a sonar igual al de todos?",
    a: "QUARK trabaja sobre el contexto de tu negocio: tu tono, tu oferta, tu público y tus objetivos. Además podés orientar y editar cada propuesta.",
  },
  {
    q: "¿Necesito saber de marketing o de inteligencia artificial?",
    a: "No. El alta te guía con preguntas simples sobre tu negocio y traduce tus respuestas en configuraciones útiles.",
  },
  {
    q: "¿QUARK garantiza más ventas?",
    a: "No. Ninguna plataforma puede garantizar ventas solo por publicar. QUARK mejora la constancia, la claridad y la lectura de resultados de tu comunicación; el resultado comercial también depende de tu oferta, tu precio y tu atención.",
  },
  {
    q: "¿Qué pasa si la inteligencia artificial se equivoca?",
    a: "Puede pasar. Por eso QUARK mantiene la revisión humana antes de publicar y señala los datos comerciales que conviene validar, como precios, stock, fechas y promociones.",
  },
  {
    q: "¿Qué datos necesita de mi negocio?",
    a: "Solo el contexto necesario para comunicar: oferta, público, zona, tono y objetivos. Antes de conectar una cuenta se detallan los permisos requeridos por cada plataforma.",
  },
  {
    q: "¿Qué cambia entre los planes?",
    a: "Cambian la capacidad diaria de contenido y el alcance de publicación: creación solamente, una red social o múltiples redes. El volumen y el precio se definen en la demo.",
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
