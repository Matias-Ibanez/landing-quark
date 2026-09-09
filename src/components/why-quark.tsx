"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, GSAP_EASE } from "@/lib/gsap";
import { Container } from "@/components/ui/container";

const reasons = [
  {
    title: "No es un generador genérico",
    body: "Una herramienta general escribe un texto correcto, pero no conoce tu tono, tu oferta ni tus límites. QUARK arranca por tu contexto y lo usa en cada propuesta.",
  },
  {
    title: "No es solo un calendario",
    body: "Un calendario ordena fechas, pero no resuelve qué decir ni qué aprender después. QUARK une planificación, generación, publicación y análisis.",
  },
  {
    title: "No es una agencia inaccesible",
    body: "Una suscripción mensual en lugar de un equipo completo. Y cuando hace falta acompañamiento, hay personas detrás por WhatsApp o correo.",
  },
  {
    title: "Vos mantenés el control",
    body: "Cada pieza se puede revisar y aprobar antes de salir. Vos decidís qué representa a tu negocio y corregís cualquier dato comercial.",
  },
];

export function WhyQuark() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reason]");
        gsap.set(items, { opacity: 0, y: 24 });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: GSAP_EASE,
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="por-que-quark" className="py-24 md:py-32">
      <Container>
        <h2 className="max-w-[20ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-5xl">
          Por qué elegir QUARK.
        </h2>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
          Porque entiende tu contexto, te ahorra trabajo, te deja en control y
          mejora con información. No porque diga que usa inteligencia
          artificial.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              data-reason
              className="border-t border-zinc-800 py-8"
            >
              <h3 className="text-xl font-medium text-zinc-50">
                {reason.title}
              </h3>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
