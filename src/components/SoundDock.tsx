import { useEffect, useState } from "react";
import styled from "styled-components";
import { soundscape } from "../lib/soundscape";
import usePrefersReducedMotion from "../hooks/use-prefers-reduced-motion";

const Dock = styled.div`
  position: fixed;
  right: 1.6rem;
  bottom: 1.6rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: flex-end;
  pointer-events: none;

  @media (max-width: 768px) {
    right: 1rem;
    bottom: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  pointer-events: auto;
`;

const Pill = styled.button<{ $on?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  border: 1px solid
    ${({ $on }) => ($on ? "rgba(47, 77, 12, 0.4)" : "var(--border)")};
  background: color-mix(in srgb, #ffffff 82%, var(--secondary-soft) 18%);
  backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: var(--shadow), inset 0 1px 0 var(--border-soft);
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform var(--dur-hover) var(--ease-out),
    background var(--dur-hover) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Dot = styled.span<{ $on?: boolean }>`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: ${({ $on }) => ($on ? "var(--primary-soft)" : "#b0bfa8")};
  box-shadow: ${({ $on }) =>
    $on ? "0 0 0 3px rgba(61, 102, 20, 0.18)" : "none"};
  animation: ${({ $on }) => ($on ? "milady-bloom 1.8s ease-in-out infinite" : "none")};
`;

const Hint = styled.div`
  font-size: 1.05rem;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 0.45rem 0.75rem;
  max-width: 22rem;
  text-align: right;
  pointer-events: none;
  backdrop-filter: blur(8px);
`;

const STORAGE_KEY = "milady-derivs-sound";
const AMBIENT_KEY = "milady-derivs-ambient";

const SoundDock = () => {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [ambient, setAmbient] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (reduced) return;
    try {
      const s = localStorage.getItem(STORAGE_KEY) === "1";
      const a = localStorage.getItem(AMBIENT_KEY) === "1";
      if (s) {
        // Don't auto-start audio context until gesture — only restore UI state
        setEnabled(true);
        setAmbient(a);
        setHint(true);
      }
    } catch {
      /* ignore */
    }
  }, [reduced]);

  if (reduced) return null;

  const enableSound = async () => {
    const next = !enabled;
    if (next) {
      await soundscape.setEnabled(true);
      setEnabled(true);
      localStorage.setItem(STORAGE_KEY, "1");
      setHint(false);
      if (ambient) await soundscape.setAmbient(true);
    } else {
      await soundscape.setEnabled(false);
      setEnabled(false);
      setAmbient(false);
      localStorage.setItem(STORAGE_KEY, "0");
      localStorage.setItem(AMBIENT_KEY, "0");
    }
  };

  const toggleAmbient = async () => {
    if (!enabled) {
      await soundscape.setEnabled(true);
      setEnabled(true);
      localStorage.setItem(STORAGE_KEY, "1");
    }
    const next = !ambient;
    await soundscape.setAmbient(next);
    setAmbient(next);
    localStorage.setItem(AMBIENT_KEY, next ? "1" : "0");
    soundscape.blip("toggle");
  };

  return (
    <Dock>
      {hint && enabled && !soundscape.isEnabled() && (
        <Hint>Tap Sound to resume the network pad (gesture required)</Hint>
      )}
      <Row>
        <Pill
          type="button"
          $on={enabled && soundscape.isEnabled()}
          onClick={() => void enableSound()}
          aria-pressed={enabled}
          title="UI blips + optional ambient pad"
        >
          <Dot $on={enabled} />
          {enabled ? "Sound on" : "Sound off"}
        </Pill>
        <Pill
          type="button"
          $on={ambient && soundscape.isAmbientOn()}
          onClick={() => void toggleAmbient()}
          aria-pressed={ambient}
          disabled={!enabled && false}
          title="Soft procedural ambient (network spirituality pad)"
        >
          <Dot $on={ambient} />
          Ambient
        </Pill>
      </Row>
    </Dock>
  );
};

export default SoundDock;
