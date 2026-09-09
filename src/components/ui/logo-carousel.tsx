"use client";

// Adapted from cult-ui `logo-carousel` (MIT).
// Changes for QUARK: logos are passed as props (image URLs instead of inline
// SVG components), deterministic distribution across columns, reduced-motion
// fallback renders a static row.

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface CarouselLogo {
  name: string;
  src: string;
}

const CYCLE_MS = 2200;
const TICK_MS = 100;

function distribute(logos: CarouselLogo[], columnCount: number) {
  const columns: CarouselLogo[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  logos.forEach((logo, i) => columns[i % columnCount].push(logo));
  const max = Math.max(...columns.map((c) => c.length));
  // Pad shorter columns by continuing the round-robin (no random duplicates).
  columns.forEach((col, ci) => {
    let k = ci + columnCount * col.length;
    while (col.length < max) {
      col.push(logos[k % logos.length]);
      k += columnCount;
    }
  });
  return columns;
}

function LogoColumn({
  logos,
  index,
  now,
}: {
  logos: CarouselLogo[];
  index: number;
  now: number;
}) {
  const delay = index * 250;
  const adjusted = (now + delay) % (CYCLE_MS * logos.length);
  const current = Math.floor(adjusted / CYCLE_MS);
  const logo = logos[current];

  return (
    <motion.div
      className="relative h-10 w-24 overflow-hidden md:w-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${logo.name}-${current}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "30%", opacity: 0, filter: "blur(6px)" }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 260, damping: 24 },
          }}
          exit={{
            y: "-30%",
            opacity: 0,
            filter: "blur(4px)",
            transition: { type: "tween", ease: "easeIn", duration: 0.25 },
          }}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={22}
            height={22}
            unoptimized
            className="h-[22px] w-[22px] opacity-60"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function LogoCarousel({
  logos,
  columnCount = 3,
  className,
}: {
  logos: CarouselLogo[];
  columnCount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState(0);
  const columns = useMemo(
    () => distribute(logos, columnCount),
    [logos, columnCount],
  );

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setNow((t) => t + TICK_MS), TICK_MS);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return (
      <div className={cn("flex flex-wrap items-center gap-8", className)}>
        {logos.map((logo) => (
          <Image
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            width={22}
            height={22}
            unoptimized
            className="h-[22px] w-[22px] opacity-60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {columns.map((col, i) => (
        <LogoColumn key={i} logos={col} index={i} now={now} />
      ))}
    </div>
  );
}

export default LogoCarousel;
