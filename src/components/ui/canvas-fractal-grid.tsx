"use client";

// Adapted from cult-ui `canvas-fractal-grid` (MIT).
// Changes for QUARK: dark/monochrome palette, canvas sized to its container
// (not the window), no gradient/noise layers, reduced-motion aware, no
// per-second React re-renders for FPS sampling.

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface CanvasFractalGridProps {
  /** Size of each dot in pixels */
  dotSize?: number;
  /** Spacing between dots in pixels */
  dotSpacing?: number;
  /** Opacity of dots (0-1) */
  dotOpacity?: number;
  /** Intensity of the wave effect when hovering */
  waveIntensity?: number;
  /** Radius of the wave effect in pixels */
  waveRadius?: number;
  /** Dot color as "rgba(r, g, b, 1)" (alpha is replaced at draw time) */
  dotColor?: string;
  /** Glow color as "rgba(r, g, b, 1)" (alpha is replaced at draw time) */
  glowColor?: string;
  className?: string;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function withAlpha(rgba: string, alpha: number) {
  return rgba.replace(/,\s*[\d.]+\)\s*$/, `, ${alpha})`);
}

export function CanvasFractalGrid({
  dotSize = 2.5,
  dotSpacing = 20,
  dotOpacity = 0.7,
  waveIntensity = 14,
  waveRadius = 180,
  dotColor = "rgba(228, 228, 231, 1)",
  glowColor = "rgba(250, 250, 250, 1)",
  className,
}: CanvasFractalGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let lastTime = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;
      const centerX = mouseRef.current.x * width;
      const centerY = mouseRef.current.y * height;
      const hasMouse = mouseRef.current.x >= 0;

      // Radial fade so the grid dissolves into a soft circle before it
      // reaches the container edges.
      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.min(cx, cy);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSpacing;
          const y = j * dotSpacing;

          const edge = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / maxDist);
          const baseAlpha = dotOpacity * Math.pow(edge, 1.25);
          if (baseAlpha < 0.01) continue;

          let dotX = x;
          let dotY = y;
          let alpha = baseAlpha;
          let radius = dotSize / 2;

          if (hasMouse && !reduce) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.hypot(dx, dy);
            if (distance < waveRadius) {
              const strength = Math.pow(1 - distance / waveRadius, 2);
              const angle = Math.atan2(dy, dx);
              const offset =
                Math.sin(distance * 0.05 - time * 0.004) *
                waveIntensity *
                strength;
              dotX += Math.cos(angle) * offset;
              dotY += Math.sin(angle) * offset;
              alpha = Math.min(1, baseAlpha + strength * 0.6);
              radius = (dotSize / 2) * (1 + strength * 0.8);
              ctx.fillStyle = withAlpha(glowColor, alpha);
            } else {
              ctx.fillStyle = withAlpha(dotColor, alpha);
            }
          } else {
            ctx.fillStyle = withAlpha(dotColor, alpha);
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      if (time - lastTime > 16) {
        draw(time);
        lastTime = time;
      }
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [
    dotSize,
    dotSpacing,
    dotOpacity,
    waveIntensity,
    waveRadius,
    dotColor,
    glowColor,
    reduce,
  ]);

  return (
    <motion.div
      ref={containerRef}
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={cn("relative h-full w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  );
}

export default React.memo(CanvasFractalGrid);
