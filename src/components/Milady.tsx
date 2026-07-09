import styled from "styled-components";
import { MiladyType } from "../hooks/use-miladys";

const CHAIN_LABELS: Record<number, string> = {
  1: "Ethereum",
  101: "Solana",
  137: "Polygon",
  420: "Optimism",
  900: "Other",
  2741: "Abstract",
  8453: "Base",
  43114: "Avalanche",
  80094: "Berachain",
  999: "HyperEVM",
};

const StyledMilady = styled.a`
  width: 100%;
  height: 100%;
  border: 1px solid var(--border);
  background: var(--surface-solid);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  cursor: pointer;
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

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-hover), var(--ring);
  }
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
  color: var(--primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1.1rem 1rem 1.2rem;
  text-align: center;
  border-top: 1px solid var(--border);
  min-height: 5.6rem;
`;

const Label = styled.div`
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--primary);
`;

const Volume = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--muted);
`;

interface Props {
  milady: MiladyType;
}

const formatVolume = (volume: number): string => {
  if (volume <= 0) return "—";
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k vol`;
  if (volume >= 100) return `${Math.round(volume)} vol`;
  if (volume >= 10) return `${volume.toFixed(0)} vol`;
  return `${volume.toFixed(2)} vol`;
};

const Milady = ({ milady }: Props) => {
  let link = `https://opensea.io/collection/${milady.openseaId}`;
  if (milady.website) link = milady.website;
  const chain = CHAIN_LABELS[milady.chainId] ?? `Chain ${milady.chainId}`;

  return (
    <StyledMilady href={link} target="_blank" rel="noopener noreferrer">
      <ImageContainer>
        <ChainBadge>{chain}</ChainBadge>
        {milady.image.endsWith(".mp4") ? (
          <Video autoPlay loop muted playsInline src={milady.image} />
        ) : (
          <Image src={milady.image} alt={milady.name} loading="lazy" />
        )}
      </ImageContainer>
      <Meta>
        <Label>{milady.name}</Label>
        <Volume>{formatVolume(milady.volume)}</Volume>
      </Meta>
    </StyledMilady>
  );
};

export default Milady;
