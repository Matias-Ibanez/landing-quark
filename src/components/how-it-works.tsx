"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import {
  ClipboardText,
  Sparkle,
  PaperPlaneTilt,
  ChartLineUp,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

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
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  icon: Icon;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    icon: ClipboardText,
    title: "Registramos",
    body: "Damos de alta tu negocio y su Brand Book: inventario, tono de voz, colores y objetivos.",
  },
  {
    icon: Sparkle,
    title: "Generamos",
    body: "El motor diseña flyers y redacta captions optimizados para cada publicación.",
  },
  {
    icon: PaperPlaneTilt,
    title: "Publicamos",
    body: "El contenido se calendariza y publica en Instagram, Facebook y LinkedIn vía APIs oficiales.",
  },
  {
    icon: ChartLineUp,
    title: "Optimizamos",
    body: "Monitoreamos el engagement y ajustamos los prompts si el rendimiento baja.",
  },
];

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const enabled = isDesktop && !reduce;

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [enabled]);

  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <Container>
        <SectionHeader title="Del alta a la publicación, sin intervención." />
      </Container>

      <div ref={wrapRef} className="relative mt-12 overflow-hidden">
        <div
          ref={trackRef}
          className={
            enabled
              ? "flex h-[100dvh] items-center gap-8 lg:gap-16"
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
