import { useCallback, useRef, MouseEvent as ReactMouseEvent } from "react";
import usePrefersReducedMotion from "./use-prefers-reduced-motion";

/**
 * Lightweight “clean 3D UI” card tilt — sparse, soft, no fake DOF stack.
 */
const useTilt3D = (maxDeg = 7) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = useCallback(
    (e: ReactMouseEvent) => {
      const el = ref.current;
      if (!el || reduced) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * maxDeg * 2;
      const ry = (px - 0.5) * maxDeg * 2;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.02)`;
      el.style.transition = "transform 60ms linear";
    },
    [maxDeg, reduced]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform var(--dur-hover) var(--ease-out)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  }, []);

  return { ref, onMove, onLeave };
};

export default useTilt3D;
