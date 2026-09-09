"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, GSAP_EASE } from "@/lib/gsap";
import { Cta } from "@/components/ui/cta";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Container } from "@/components/ui/container";
import CanvasFractalGrid from "@/components/ui/canvas-fractal-grid";
import { contactHref } from "@/lib/site";

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: GSAP_EASE, duration: 0.9 } })
          .from("[data-hero='copy'] > *", {
            y: 28,
            opacity: 0,
            stagger: 0.09,
          })
          .from(
            "[data-hero='visual']",
            { opacity: 0, scale: 0.96, duration: 1.2 },
            0.25,
          );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative min-h-[100dvh] overflow-hidden">
      <Container className="grid min-h-[100dvh] grid-cols-1 items-center gap-12 pb-16 pt-24 lg:grid-cols-12 lg:gap-8">
        <div data-hero="copy" className="lg:col-span-7">
          <Eyebrow>Marketing con IA para comercios y PyMEs</Eyebrow>

          <h1 className="mt-6 max-w-[16ch] text-balance text-5xl font-medium leading-[1.05] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl">
            Tu marketing, en piloto automático.
          </h1>

          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-zinc-400">
            QUARK conoce tu negocio, propone y genera el contenido, lo publica
            y aprende de los resultados. Vos aprobás.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Cta href={contactHref} external>
              Pedir demo
            </Cta>
            <Cta href="#como-funciona" variant="secondary">
              Ver cómo funciona
            </Cta>
          </div>
        </div>

        <div data-hero="visual" className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[18%] rounded-full bg-zinc-400/10 blur-3xl" />
            <CanvasFractalGrid className="absolute inset-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
