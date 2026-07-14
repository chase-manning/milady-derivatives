import { useEffect, useRef } from "react";
import styled from "styled-components";
import usePrefersReducedMotion from "../hooks/use-prefers-reduced-motion";

/**
 * Soft depth-field of drifting orbs — “clean 3D UI” / sparse lighting vibe
 * without Three.js. Recolored to milady greens + a whisper of remilia lilac.
 */
const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.9;
`;

type Orb = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  hue: "green" | "lilac";
};

const AmbientField = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const orbs: Orb[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      orbs.length = 0;
      const count = Math.min(18, Math.max(10, Math.floor(window.innerWidth / 120)));
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: 0.35 + Math.random() * 0.9,
          r: 40 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.14,
          hue: Math.random() > 0.78 ? "lilac" : "green",
        });
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const o of orbs) {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * o.z);
        if (o.hue === "lilac") {
          g.addColorStop(0, "rgba(196, 160, 220, 0.22)");
          g.addColorStop(1, "rgba(196, 160, 220, 0)");
        } else {
          g.addColorStop(0, "rgba(184, 217, 183, 0.35)");
          g.addColorStop(0.45, "rgba(47, 77, 12, 0.06)");
          g.addColorStop(1, "rgba(47, 77, 12, 0)");
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * o.z, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const o of orbs) {
        o.x += o.vx * o.z;
        o.y += o.vy * o.z;
        if (o.x < -o.r) o.x = window.innerWidth + o.r;
        if (o.x > window.innerWidth + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = window.innerHeight + o.r;
        if (o.y > window.innerHeight + o.r) o.y = -o.r;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * o.z);
        if (o.hue === "lilac") {
          g.addColorStop(0, "rgba(196, 160, 220, 0.2)");
          g.addColorStop(1, "rgba(196, 160, 220, 0)");
        } else {
          g.addColorStop(0, "rgba(184, 217, 183, 0.32)");
          g.addColorStop(0.5, "rgba(47, 77, 12, 0.05)");
          g.addColorStop(1, "rgba(47, 77, 12, 0)");
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * o.z, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      seed();
      if (reduced) drawStatic();
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return <Canvas ref={ref} aria-hidden />;
};

export default AmbientField;
