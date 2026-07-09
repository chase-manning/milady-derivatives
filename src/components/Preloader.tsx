import styled, { keyframes } from "styled-components";

/**
 * Whimsy-style calm morphing bloom loader — single orb family,
 * recolored to milady primary/secondary (no carnival confetti).
 */
const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const Overlay = styled.div<{ $exiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background:
    radial-gradient(600px 400px at 50% 40%, rgba(184, 217, 183, 0.55), transparent 70%),
    linear-gradient(180deg, #eef6ec 0%, #f7fbf6 100%);
  animation: ${({ $exiting }) => ($exiting ? fadeOut : "none")} 420ms var(--ease-out) forwards;
  pointer-events: ${({ $exiting }) => ($exiting ? "none" : "auto")};
`;

const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
`;

const Bloom = styled.div`
  position: relative;
  width: 7.2rem;
  height: 7.2rem;
`;

const Ring = styled.div<{ $delay?: string }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(47, 77, 12, 0.22);
  animation: milady-bloom var(--dur-loader) var(--ease-out) infinite;
  animation-delay: ${({ $delay }) => $delay || "0ms"};
`;

const Core = styled.div`
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #ffffff 0%, transparent 45%),
    radial-gradient(circle at 50% 55%, var(--secondary) 0%, var(--primary) 70%);
  box-shadow:
    0 0 0 1px rgba(47, 77, 12, 0.12),
    0 12px 30px rgba(47, 77, 12, 0.18);
  animation: milady-bloom calc(var(--dur-loader) * 0.85) var(--ease-out) infinite reverse;
`;

const Orbit = styled.div`
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  border: 1px dashed rgba(47, 77, 12, 0.18);
  animation: milady-orbit 8s linear infinite;

  &::after {
    content: "";
    position: absolute;
    top: -0.35rem;
    left: 50%;
    width: 0.7rem;
    height: 0.7rem;
    margin-left: -0.35rem;
    border-radius: 50%;
    background: var(--primary-soft);
    box-shadow: 0 0 12px rgba(61, 102, 20, 0.45);
  }
`;

const Label = styled.div`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  opacity: 0.85;
`;

const Sub = styled.div`
  font-size: 1.25rem;
  color: var(--muted);
  margin-top: -1rem;
`;

interface Props {
  exiting?: boolean;
  label?: string;
}

const Preloader = ({ exiting = false, label = "loading derivatives" }: Props) => {
  return (
    <Overlay $exiting={exiting} role="status" aria-live="polite" aria-busy={!exiting}>
      <Stage>
        <Bloom>
          <Ring />
          <Ring $delay="220ms" style={{ inset: "10%" }} />
          <Orbit />
          <Core />
        </Bloom>
        <Label>{label}</Label>
        <Sub>network spirituality initializing…</Sub>
      </Stage>
    </Overlay>
  );
};

export default Preloader;
