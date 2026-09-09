"use client";

// Adapted from cult-ui `text-animate` (MIT).
// Changes for QUARK: word-wrapping layout (words are inline-block, letters
// animate inside each word), triggers when scrolled into view, accessible
// label on the heading, reduced-motion fallback, styling via className.

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

type AnimationType = "fadeIn" | "calmInUp" | "shiftInUp" | "whipInUp";

// `custom` receives the per-letter delay in seconds.
const variants: Record<AnimationType, { child: Variants; stagger: number }> = {
  fadeIn: {
    stagger: 0.02,
    child: {
      hidden: { opacity: 0, y: 8 },
      visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 14, stiffness: 120, delay },
      }),
    },
  },
  calmInUp: {
    stagger: 0.012,
    child: {
      hidden: { y: "120%" },
      visible: (delay: number) => ({
        y: 0,
        transition: {
          ease: [0.125, 0.92, 0.69, 0.975],
          duration: 0.75,
          delay,
        },
      }),
    },
  },
  shiftInUp: {
    stagger: 0.012,
    child: {
      hidden: { y: "100%" },
      visible: (delay: number) => ({
        y: 0,
        transition: { ease: [0.22, 1, 0.36, 1], duration: 0.8, delay },
      }),
    },
  },
  whipInUp: {
    stagger: 0.012,
    child: {
      hidden: { y: "120%" },
      visible: (delay: number) => ({
        y: 0,
        transition: { ease: [0.5, -0.15, 0.25, 1.05], duration: 0.7, delay },
      }),
    },
  },
};

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

type TextTag = keyof typeof MOTION_TAGS;

interface TextAnimateProps {
  text: string;
  type?: AnimationType;
  /** Delay before the first letter starts (seconds). */
  delay?: number;
  as?: TextTag;
  className?: string;
}

export function TextAnimate({
  text,
  type = "calmInUp",
  delay = 0,
  as: Tag = "h2",
  className,
}: TextAnimateProps) {
  // Intersection so the ref satisfies every tag in MOTION_TAGS.
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const { child, stagger } = variants[type];
  const words = text.split(" ");
  const MotionTag = MOTION_TAGS[Tag];

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  let letterIndex = 0;

  return (
    <MotionTag
      ref={ref}
      className={cn("text-balance", className)}
      aria-label={text}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          {Array.from(word).map((letter, li) => {
            const i = letterIndex++;
            return (
              <motion.span
                key={`${letter}-${li}`}
                variants={child}
                custom={delay + i * stagger}
                className="inline-block"
              >
                {letter}
              </motion.span>
            );
          })}
          {wi < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </MotionTag>
  );
}

export default TextAnimate;
