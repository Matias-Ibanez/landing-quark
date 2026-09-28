"use client";

import Image from "next/image";
import { Pause, Play } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Adapted from the image-stream-hero supplied by the user. CSS projects two
// mirrored rails; negative delays populate them immediately without an intro.
type CorridorPath = {
  perspective: number; cardWidth: number; cardHeight: number; cardRadius: number;
  birthHeight: number; exitHeight: number; railBirth: number; railExit: number;
  fan: number; turnBirth: number; turnExit: number; stops: number;
};
const PATH: CorridorPath = {
  perspective: 30, cardWidth: 18, cardHeight: 25, cardRadius: .8,
  birthHeight: 2.6, exitHeight: 46, railBirth: -11, railExit: 44,
  fan: 3.3, turnBirth: 6, turnExit: 28, stops: 24,
};

function keyframes(dir: 1 | -1, name: string, path: CorridorPath) {
  const steps: string[] = [];
  for (let step = 0; step <= path.stops; step++) {
    const progress = step / path.stops;
    const scale = path.birthHeight / path.cardHeight * Math.pow(path.exitHeight / path.birthHeight, progress);
    const z = path.perspective * (1 - 1 / scale);
    const rail = path.railExit - (path.railExit - path.railBirth) * Math.pow(1 - progress, path.fan);
    const turn = path.turnBirth + (path.turnExit - path.turnBirth) * progress;
    steps.push(`${(progress * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(2)}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`);
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export function ImageStreamHero({ images, children, className }: {
  images: readonly string[]; children: React.ReactNode; className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const cards = 9;
  const speed = 26;
  const axis = 62;
  const css = useMemo(() => `${keyframes(1, right, PATH)}${keyframes(-1, left, PATH)}
    [data-stream-paused="true"] .${card}{animation-play-state:paused!important}
    @media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused!important}}`, [right, left, card]);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} data-stream-paused={paused || !visible} className={cn("relative overflow-hidden", className)} style={{ containerType: "inline-size" }}>
      <style>{css}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ perspective: `${PATH.perspective}cqw`, perspectiveOrigin: `50% ${axis}%`, maskImage: "linear-gradient(to bottom, transparent 22%, black 43%, black 73%, transparent 95%)" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {images.length > 0 && [right, left].map(name => Array.from({ length: cards }, (_, i) => (
            <div key={`${name}-${i}`} className={cn(card, "image-stream-card absolute overflow-hidden bg-zinc-800")} style={{
              left: "50%", top: `${axis}%`, width: `${PATH.cardWidth}cqw`, height: `${PATH.cardHeight}cqw`,
              marginLeft: `${-PATH.cardWidth / 2}cqw`, marginTop: `${-PATH.cardHeight / 2}cqw`,
              borderRadius: `${PATH.cardRadius}cqw`, animation: `${name} ${speed}s linear infinite`,
              animationDelay: `${-(i * speed) / cards}s`, backfaceVisibility: "hidden",
            }}>
              <Image src={images[i % images.length]} alt="" fill loading="eager" sizes="(max-width: 767px) 220px, 480px" className="object-cover" draggable={false} />
            </div>
          )))}
        </div>
      </div>
      {children}
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="absolute bottom-5 right-6 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/90 px-4 text-xs text-zinc-300 transition-colors hover:text-white motion-reduce:hidden">
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        {paused ? "Mover imágenes" : "Pausar imágenes"}
      </button>
    </div>
  );
}
