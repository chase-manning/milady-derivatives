import { useCallback, MouseEvent as ReactMouseEvent } from "react";

/**
 * Soft water-ripple press actuation (bookmark: water ripple shader spirit),
 * CSS-only nodes — cool green spectrum.
 */
const useRipple = () => {
  const spawn = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;
      border-radius:50%;pointer-events:none;
      background: radial-gradient(circle, rgba(47,77,12,0.22) 0%, rgba(184,217,183,0.12) 40%, transparent 70%);
      transform: scale(0); animation: milady-ripple 560ms var(--ease-out) forwards;
    `;
    const prev = getComputedStyle(target).position;
    if (prev === "static") target.style.position = "relative";
    target.style.overflow = "hidden";
    target.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  }, []);

  return spawn;
};

export default useRipple;
