import styled from "styled-components";
import { MiladyType } from "../hooks/use-miladys";
import { CHAIN_LABELS } from "../lib/chains";
import { getMarketplaceLinks, getPrimaryLink } from "../lib/marketplaces";

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
  transform: translateY(0) scale(1);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: var(--shadow-hover);
    border-color: rgba(47, 77, 12, 0.35);
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
  background: linear-gradient(180deg, #f7fbf6 0%, #eef6ec 100%);
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.8rem;
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
  background: rgba(255, 255, 255, 0.92);
  color: var(--primary);
  border: 1px solid var(--border);
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(47, 77, 12, 0.08);
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
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: #fff;
    transform: translateY(-1px);
  }
`;

interface Props {
  milady: MiladyType;
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

const Milady = ({ milady }: Props) => {
  const primary = getPrimaryLink(milady);
  const markets = getMarketplaceLinks(milady);
  const chain = CHAIN_LABELS[milady.chainId] ?? `Chain ${milady.chainId}`;
  const floor = formatFloor(milady);
  const liveVol = formatLiveVol(milady);

  return (
    <StyledMilady>
      <ImageLink href={primary} target="_blank" rel="noopener noreferrer">
        <ImageContainer>
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
          {!liveVol && <Stat title="Catalog volume">{formatVolume(milady.volume)}</Stat>}
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
  );
};

export default Milady;
