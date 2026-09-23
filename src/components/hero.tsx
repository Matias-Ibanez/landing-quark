"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Cta } from "@/components/ui/cta";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  HeroDitheringContent,
  HeroDitheringContainer,
  HeroDitheringRoot,
  HeroDitheringVisual,
} from "@/components/ui/hero-dithering";
import { chatHref } from "@/lib/site";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <HeroDitheringRoot
      srTitle=""
      className="border-b border-zinc-900"
      desktopShaderProps={{
        colorBack: "#09090b",
        colorFront: "#fafafa",
        shape: "swirl",
        type: "4x4",
        size: 1.25,
        speed: reduce === false ? 0.22 : 0,
        scale: 0.72,
      }}
    >
      <HeroDitheringContainer className="mx-auto min-h-[calc(100svh-4rem)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-8 md:py-20 lg:gap-12 lg:pb-24 xl:grid-cols-12">
        <HeroDitheringContent className="order-2 items-start gap-0 p-0 text-left md:order-none md:col-span-7 md:p-0 lg:pr-4">
          <Eyebrow>Marketing para comercios y PyMEs</Eyebrow>

          <h1
            className="mt-6 max-w-[14ch] text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-zinc-50 md:text-6xl lg:text-7xl"
          >
            Contenido para tu negocio, listo para publicar.
          </h1>

          <p
            className="mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            QUARK ayuda a crear, revisar y publicar en redes sin empezar de
            cero cada día. La IA propone y vos decidís qué representa a tu
            marca.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Cta href={chatHref}>
              Probar Gratis
              <ArrowRight size={16} aria-hidden="true" />
            </Cta>
            <Cta href="#como-funciona" variant="secondary">
              Ver cómo funciona
            </Cta>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
            Contexto de marca · Aprobación humana · Publicación asistida
          </p>
        </HeroDitheringContent>

        <HeroDitheringVisual
          className="order-1 block h-[15rem] w-full sm:h-[18rem] md:order-none md:col-span-5 md:h-[22rem] lg:h-[26rem]"
          desktopClassName="rounded-[2rem] border border-zinc-800 bg-zinc-950 [&>div]:size-full [&_canvas]:!size-full"
          desktopShaderProps={{
            width: 720,
            height: 720,
            style: { width: "100%", height: "100%" },
          }}
        />
      </HeroDitheringContainer>
    </HeroDitheringRoot>
  );
}
