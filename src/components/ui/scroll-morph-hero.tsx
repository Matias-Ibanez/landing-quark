"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

// Adapted from the user's scroll-morph-hero: native page scrolling, deterministic
// geometry, existing motion/react, and commerce photography instead of AI imagery.
// Design read: commercial landing, existing dark identity; variance 7 / motion 6 / density 3.
const photos = [
  { photo: "photo-1509042239860-f550ce710b93", title: "Cafeterías" },
  { photo: "photo-1540189549336-e6e99c3679fe", title: "Gastronomía" },
  { photo: "photo-1491553895911-0055eca6402d", title: "Tiendas" },
  { photo: "photo-1515886657613-9f3515b0c78f", title: "Moda" },
  { photo: "photo-1551024709-8f23befc6f87", title: "Un nuevo producto" },
  { photo: "photo-1495474472287-4d71bcdd2085", title: "Tu próximo café" },
  { photo: "photo-1483985988355-763728e1935b", title: "Tu colección" },
  { photo: "photo-1487412947147-5cebf100ffc2", title: "Belleza" },
  { photo: "photo-1447933601403-0c6688de566e", title: "El trabajo de cada día" },
  { photo: "photo-1556742049-0cfed4f6a45d", title: "Negocios reales" },
  { photo: "photo-1498837167922-ddd27525d352", title: "Lo que preparás" },
  { photo: "photo-1441986300917-64674bd600d8", title: "Tu negocio" },
];

type Size = { width: number; height: number };
const lerp = (a: number, b: number, progress: number) => a + (b - a) * progress;
const round = (value: number) => Math.round(value * 1000) / 1000;

function PhotoCard({ index, size, progress, reduced }: {
  index: number; size: Size; progress: MotionValue<number>; reduced: boolean;
}) {
  const mobile = size.width < 768;
  const radiusX = mobile ? size.width * .62 : Math.min(size.width * .42, 700);
  const radiusY = size.height * .42;
  const angle = index / photos.length * Math.PI * 2;
  const circleX = round(Math.cos(angle) * radiusX);
  const circleY = round(Math.sin(angle) * radiusY);
  const circleRotation = round(Math.sin(angle * 2) * 16);
  const arcAngle = (-148 + index / (photos.length - 1) * 116) * Math.PI / 180;
  const arcRadius = size.width * (mobile ? 1.15 : .65);
  const arcX = Math.cos(arcAngle) * arcRadius;
  const arcY = Math.sin(arcAngle) * arcRadius + arcRadius + size.height * .35;
  const transform = useTransform(progress, p => `translateX(${round(lerp(circleX, arcX, reduced ? 0 : p))}px) translateY(${round(lerp(circleY, arcY, reduced ? 0 : p))}px) rotate(${round(lerp(circleRotation, arcAngle * 180 / Math.PI + 90, reduced ? 0 : p))}deg)`);
  const source = photos[index];

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[82px] w-[58px] -translate-x-1/2 -translate-y-1/2 md:h-[160px] md:w-[116px] lg:h-[190px] lg:w-[136px]"
      style={{ transform, perspective: "1000px" }}
    >
      <motion.div className="relative size-full" style={{ transformStyle: "preserve-3d" }} whileHover={reduced ? undefined : { rotateY: 180 }} transition={{ duration: .5 }}>
        <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg" style={{ backfaceVisibility: "hidden" }}>
          <Image src={`https://images.unsplash.com/${source.photo}?auto=format&fit=crop&w=320&h=440&q=80`} alt="" fill sizes="(min-width: 1024px) 136px, (min-width: 768px) 116px, 58px" className="object-cover" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800 p-2 text-center text-xs font-medium text-zinc-100" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          {source.title}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollMorphHero({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Wait for the actual container size so photos start in their final circle,
  // without briefly showing desktop coordinates on mobile.
  const [size, setSize] = useState<Size | null>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const morph = useTransform(scrollYProgress, [0, .6], [0, 1]);
  const progress = useSpring(morph, { stiffness: 90, damping: 25 });
  const contentY = useTransform(progress, [0, 1], [0, -32]);

  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({ width: box.inlineSize, height: box.blockSize });
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={root} aria-label="Contenido para distintos negocios" className={`relative isolate flex items-center justify-center overflow-hidden bg-zinc-950 py-24 ${compact ? "min-h-[660px] md:min-h-[860px]" : "min-h-[calc(100svh-4rem)] md:py-32"}`}>
      <div className="absolute inset-0" aria-hidden="true">
        {size && photos.map((photo, index) => <PhotoCard key={photo.photo} index={index} size={size} progress={progress} reduced={reduce !== false} />)}
      </div>
      <motion.div className="relative z-10 w-full" style={{ y: reduce !== false ? 0 : contentY }}>{children}</motion.div>
    </section>
  );
}
