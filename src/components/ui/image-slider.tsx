"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";

// Adapted from the ImageSlider reference supplied by the user.
const slides = [
  { photo: "photo-1509042239860-f550ce710b93", alt: "Una taza de café recién preparado", title: "Lo cotidiano también merece una buena foto.", label: "Para lo que hacés cada día" },
  { photo: "photo-1515886657613-9f3515b0c78f", alt: "Un conjunto de ropa fotografiado al aire libre", title: "Tu estilo puede convertirse en tu próxima publicación.", label: "Para lo que hace única a tu marca" },
  { photo: "photo-1491553895911-0055eca6402d", alt: "Zapatillas deportivas en un espacio urbano", title: "Mostrá ese producto que querés que todos conozcan.", label: "Para tu próximo lanzamiento" },
];

export function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || paused || focused || reduced) return;
    const timer = window.setInterval(() => setIndex(value => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [visible, paused, focused, reduced]);

  const slide = slides[index];
  return (
    <div ref={root} role="region" aria-label="Ideas para mostrar tu negocio" aria-roledescription="carrusel" className="relative h-full min-h-[660px] overflow-hidden rounded-[1.75rem] bg-zinc-800" onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <AnimatePresence initial={false}>
        <motion.div key={slide.photo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .7 }} className="absolute inset-0">
          <Image src={`https://images.unsplash.com/${slide.photo}?auto=format&fit=crop&w=1000&q=85`} alt={slide.alt} fill sizes="(min-width: 1024px) 50vw, 1px" className="object-cover" loading={index === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/85" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 flex min-h-[660px] flex-col justify-between p-9 xl:p-12">
        <p className="text-sm font-medium tracking-[.16em] text-white">QUARK</p>
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[.14em] text-white/75">{slide.label}</p>
          <p className="max-w-[15ch] text-4xl font-medium leading-[1.15] tracking-tight text-white xl:text-5xl">{slide.title}</p>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">Tus fotos, tus ideas y un espacio para darles forma.</p>
          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex gap-1" role="group" aria-label="Elegir fotografía">
              {slides.map((item, itemIndex) => <button key={item.photo} type="button" aria-label={`Ver fotografía ${itemIndex + 1}`} aria-pressed={index === itemIndex} onClick={() => { setIndex(itemIndex); setPaused(true); }} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><span className={`h-1 rounded-full transition-all ${index === itemIndex ? "w-7 bg-white" : "w-3 bg-white/45"}`} /></button>)}
            </div>
            {!reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Reanudar fotografías" : "Pausar fotografías"} aria-pressed={paused} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{paused ? <Play size={18} /> : <Pause size={18} />}</button>}
          </div>
          <p className="mt-2 text-[11px] text-white/60">Fotografías ilustrativas.</p>
        </div>
      </div>
    </div>
  );
}
