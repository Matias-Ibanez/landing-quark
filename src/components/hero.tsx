"use client";

import { motion, useReducedMotion } from "motion/react";
import { Cta } from "@/components/ui/cta";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ParticleField } from "@/components/particle-field";
import { Container } from "@/components/ui/container";
import { contactHref } from "@/lib/site";
import { EASE } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? false : { opacity: 0, y: 24 };
  const animate = reduce ? false : { opacity: 1, y: 0 };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <Container className="grid min-h-[100dvh] grid-cols-1 items-center gap-12 pb-16 pt-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
          >
            <Eyebrow>Automatización de marketing con IA</Eyebrow>
          </motion.div>

          <motion.h1
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mt-6 max-w-[16ch] text-balance text-5xl font-medium leading-[1.05] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl"
          >
            Tu marketing, en piloto automático.
          </motion.h1>

          <motion.p
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mt-6 max-w-[52ch] text-lg leading-relaxed text-zinc-400"
          >
            QUARK genera, publica y optimiza el contenido de tus redes con IA,
            sin agencia ni community manager.
          </motion.p>

          <motion.div
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Cta href={contactHref} external>
              Pedir demo
            </Cta>
            <Cta href="#como-funciona" variant="secondary">
              Ver cómo funciona
            </Cta>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={reduce ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="lg:col-span-5"
        >
          <ParticleField className="mx-auto aspect-square w-full max-w-md" />
        </motion.div>
      </Container>
    </section>
  );
}
