import styled from "styled-components";
import { MiladyType } from "../hooks/use-miladys";
import useTilt3D from "../hooks/use-tilt-3d";
import { CHAIN_LABELS } from "../lib/chains";
import { getMarketplaceLinks, getPrimaryLink } from "../lib/marketplaces";

const TiltShell = styled.div<{ $delay: number }>`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
  animation-delay: ${({ $delay }) => `${$delay}ms`};
`;

const StyledMilady = styled.article`
  width: 100%;
  height: 100%;
  border: 1px solid var(--border);
  background: var(--surface-solid);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transform-style: preserve-3d;
  transition: box-shadow var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);

  &:hover {
    box-shadow: var(--shadow-hover);
    border-color: rgba(47, 77, 12, 0.38);
  }
`;

const ImageLink = styled.a`
  display: block;
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.9), transparent 50%),
    linear-gradient(180deg, #f7fbf6 0%, #eef6ec 100%);
  position: relative;
  overflow: hidden;
`;

const Shine = styled.div`
  pointer-events: none;
  position: absolute;
  inset: -40%;
  background: linear-gradient(
    115deg,
    transparent 40%,
    rgba(255, 255, 255, 0.35) 48%,
    transparent 56%
  );
  transform: translateX(-30%) rotate(8deg);
  transition: transform 0.6s var(--ease-out);
  opacity: 0;

  ${StyledMilady}:hover & {
    opacity: 1;
    transform: translateX(30%) rotate(8deg);
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.8rem;
  transition: transform var(--dur-panel) var(--ease-out);
  transform: translateZ(18px);

  ${StyledMilady}:hover & {
    transform: translateZ(28px) scale(1.03);
  }
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.8rem;
`;

const ChainBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary);
  border: 1px solid var(--border);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(47, 77, 12, 0.08);
  z-index: 2;
`;

const Meta = styled.div`
  width: 100%;
  background: linear-gradient(180deg, var(--secondary-soft) 0%, var(--secondary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 1.1rem 1rem 1.15rem;
  text-align: center;
  border-top: 1px solid var(--border);
  min-height: 7.2rem;
  position: relative;
  z-index: 1;
`;

const Label = styled.a`
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--primary);

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.8rem;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--muted);
`;

const Stat = styled.span`
  white-space: nowrap;
`;

const MarketRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  justify-content: center;
  margin-top: 0.15rem;
`;

const MarketPill = styled.a`
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(47, 77, 12, 0.2);
  background: rgba(255, 255, 255, 0.75);
  color: var(--primary);
  transition: background var(--dur-micro) var(--ease-out),
    transform var(--dur-micro) var(--ease-out);

  &:hover {
    background: #fff;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface Props {
  milady: MiladyType;
  index?: number;
}

const formatNum = (n: number, digits = 2): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(digits);
};

const formatVolume = (volume: number): string => {
  if (volume <= 0) return "—";
  return `${formatNum(volume)} vol`;
};

const formatFloor = (milady: MiladyType): string | null => {
  const live = milady.live;
  if (!live) return null;
  const floor = live.floorNative ?? live.meFloorNative;
  if (floor == null || Number.isNaN(floor)) return null;
  const sym = live.nativeSymbol || "ETH";
  return `${formatNum(floor, floor < 0.1 ? 3 : 2)} ${sym}`;
};

const formatLiveVol = (milady: MiladyType): string | null => {
  const live = milady.live;
  if (!live) return null;
  if (live.volume24hUsd != null) return `$${formatNum(live.volume24hUsd, 0)} 24h`;
  if (live.volume24hNative != null) {
    return `${formatNum(live.volume24hNative)} ${live.nativeSymbol || ""} 24h`.trim();
  }
  return null;
};

const Milady = ({ milady, index = 0 }: Props) => {
  const primary = getPrimaryLink(milady);
  const markets = getMarketplaceLinks(milady);
  const chain = CHAIN_LABELS[milady.chainId] ?? `Chain ${milady.chainId}`;
  const floor = formatFloor(milady);
  const liveVol = formatLiveVol(milady);
  const tilt = useTilt3D(6);
  const delay = Math.min(index, 24) * 35;

  return (
    <TiltShell
      $delay={delay}
      ref={tilt.ref as React.RefObject<HTMLDivElement>}
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
    >
      <StyledMilady>
        <ImageLink href={primary} target="_blank" rel="noopener noreferrer">
          <ImageContainer>
            <Shine />
            <ChainBadge>{chain}</ChainBadge>
            {milady.image.endsWith(".mp4") ? (
              <Video autoPlay loop muted playsInline src={milady.image} />
            ) : (
              <Image src={milady.image} alt={milady.name} loading="lazy" />
            )}
          </ImageContainer>
        </ImageLink>
        <Meta>
          <Label href={primary} target="_blank" rel="noopener noreferrer">
            {milady.name}
          </Label>
          <Stats>
            {floor && <Stat title="Live floor">◈ {floor}</Stat>}
            {liveVol && <Stat title="24h volume">{liveVol}</Stat>}
            {!liveVol && (
              <Stat title="Catalog volume">{formatVolume(milady.volume)}</Stat>
            )}
          </Stats>
          <MarketRow>
            {markets.map((m) => (
              <MarketPill
                key={m.id + m.href}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {m.label}
              </MarketPill>
            ))}
          </MarketRow>
        </Meta>
      </StyledMilady>
    </TiltShell>
  );
};

export default Milady;
