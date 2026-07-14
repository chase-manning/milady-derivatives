import styled from "styled-components";

/**
 * remilia.org Squarespace image-effect-film-grain spirit —
 * full-page living grain without crushing contrast.
 */
const Grain = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0.07;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  animation: grain-shift 0.45s steps(2) infinite;

  @keyframes grain-shift {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-1%, 1%); }
    50% { transform: translate(1%, -1%); }
    75% { transform: translate(-1%, -1%); }
    100% { transform: translate(0, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.04;
  }
`;

const Scan = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0.035;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(47, 77, 12, 0.04) 2px,
    rgba(47, 77, 12, 0.04) 3px
  );
  mix-blend-mode: multiply;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const FilmGrain = () => (
  <>
    <Grain aria-hidden />
    <Scan aria-hidden />
  </>
);

export default FilmGrain;
