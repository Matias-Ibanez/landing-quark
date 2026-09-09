"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once for the whole app. Import `gsap`/`ScrollTrigger` from
// this module (not from "gsap" directly) inside animated leaf components.
gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Media query used by every GSAP leaf: animate only when motion is allowed. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px)";

/** Shared easing so GSAP entrances match the Motion `EASE` in lib/motion.ts. */
export const GSAP_EASE = "expo.out";

export { gsap, ScrollTrigger, useGSAP };
