"use client";

import { useRef } from "react";
import { gsap, useGSAP, DESKTOP, MOTION_OK } from "@/lib/gsap";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

const blocks = [
  {
    title: "Quiénes somos",
    body: "Un equipo de tecnología, producto y comunicación del Noroeste Argentino. Creemos que la inteligencia artificial no debería estar reservada para empresas con departamentos de marketing. Un comercio, un profesional o una PyME también merece una comunicación ordenada, constante y con identidad.",
  },
  {
    title: "Misión",
    body: "Democratizar el acceso a herramientas de marketing inteligente para que comercios, emprendedores y PyMEs comuniquen el valor de sus negocios con constancia, calidad y menos esfuerzo operativo.",
  },
  {
    title: "Visión",
    body: "Ser la plataforma de automatización de marketing de referencia para pequeñas y medianas empresas del NOA y, después, de Latinoamérica. Una herramienta con la que cada negocio pueda competir en el entorno digital con una comunicación profesional y auténtica.",
  },
];

const values = [
  "El negocio antes que la herramienta",
  "Simplicidad con profundidad",
  "Identidad propia, nunca contenido genérico",
];

export function About() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-about-block]");
        items.forEach((el) => {
          // Each block brightens as it scrolls up toward the sticky title, so
          // the eye lands on one idea at a time. It stays readable afterwards.
          gsap.fromTo(
            el,
            { opacity: 0.2, y: 24 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "top 55%",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="quienes-somos" className="py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Quiénes somos</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-5xl">
              Tecnología cercana para negocios reales.
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-zinc-400">
              QUARK nace para acercar capacidad de marketing a quienes conocen
              su negocio a fondo, pero no siempre tienen tiempo para
              comunicarlo.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-16 lg:gap-28 lg:py-16">
            {blocks.map((block) => (
              <div key={block.title} data-about-block>
                <h3 className="text-xl font-medium text-zinc-50 md:text-2xl">
                  {block.title}
                </h3>
                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-zinc-400 md:text-lg">
                  {block.body}
                </p>
              </div>
            ))}

            <div data-about-block>
              <h3 className="text-xl font-medium text-zinc-50 md:text-2xl">
                Valores
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {values.map((value) => (
                  <li
                    key={value}
                    className="rounded-2xl border border-zinc-800 px-5 py-4 text-sm leading-relaxed text-zinc-300"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
