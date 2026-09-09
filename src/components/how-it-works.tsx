"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  ClipboardText,
  Sparkle,
  CheckCircle,
  ChartLineUp,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, DESKTOP, MOTION_OK } from "@/lib/gsap";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const PAN_QUERY = `${DESKTOP} and ${MOTION_OK}`;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

type Step = {
  icon: Icon;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    icon: ClipboardText,
    title: "Conoce tu negocio",
    body: "Cargás qué vendés, a quién, dónde, con qué tono y con qué objetivos. Ese contexto queda guardado y se usa en cada propuesta.",
  },
  {
    icon: Sparkle,
    title: "Propone y genera",
    body: "QUARK sugiere temas, fechas y formatos, y genera los textos y las piezas visuales alineados con tu marca.",
  },
  {
    icon: CheckCircle,
    title: "Vos revisás y aprobás",
    body: "Editás, pedís cambios o aprobás en minutos. Nada con precios, stock o promociones se publica sin tu visto bueno.",
  },
  {
    icon: ChartLineUp,
    title: "Publica y aprende",
    body: "Lo aprobado se agenda y se publica. Los resultados vuelven como métricas claras y una recomendación para el próximo ciclo.",
  },
];

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery(PAN_QUERY);

  useGSAP(
    () => {
      if (!enabled) return;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const progress = progressRef.current;
      if (!wrap || !track || !progress) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      // One ScrollTrigger drives both the horizontal pan and the progress line.
      // This trigger is created after hydration (once `enabled` is known), so
      // `refreshPriority` makes ScrollTrigger sort every trigger by page
      // position on refresh; otherwise sections below would measure their
      // positions without the pin spacer.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });
      tl.to(track, { x: () => -distance(), ease: "none" }, 0).fromTo(
        progress,
        { scaleX: 0 },
        { scaleX: 1, ease: "none" },
        0,
      );
      ScrollTrigger.refresh();
    },
    { scope: wrapRef, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          title="Del alta a la publicación, en cuatro pasos."
          sub="Automatizamos lo repetitivo. Las decisiones que representan a tu negocio siguen siendo tuyas."
        />
      </Container>

      <div ref={wrapRef} className="relative mt-12 overflow-hidden">
        {enabled ? (
          <div className="pointer-events-none absolute left-6 right-6 top-24 h-px bg-zinc-800 md:left-8 md:right-8">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-zinc-400"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        ) : null}

        <div
          ref={trackRef}
          className={
            enabled
              ? "flex h-[100dvh] items-center gap-8 px-6 md:px-8 lg:gap-16"
              : "flex flex-col gap-8 px-6 md:px-8"
          }
        >
          {steps.map((step) => {
            const IconEl = step.icon;
            return (
              <div
                key={step.title}
                className={enabled ? "w-[85vw] shrink-0 lg:w-[55vw]" : "w-full"}
              >
                <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                    <IconEl size={22} />
                  </div>
                  <h3 className="mt-8 text-3xl font-medium tracking-tight text-zinc-50 md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[50ch] text-base leading-relaxed text-zinc-400">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
