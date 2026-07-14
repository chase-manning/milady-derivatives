import { MiladyType } from "../hooks/use-miladys";

export type MarketplaceLink = {
  id: "opensea" | "magiceden" | "tensor" | "website";
  label: string;
  href: string;
};

const SOLANA_CHAINS = new Set([101]);

export function getMarketplaceLinks(milady: MiladyType): MarketplaceLink[] {
  const links: MarketplaceLink[] = [];
  const isSolana = SOLANA_CHAINS.has(milady.chainId);

  if (milady.website) {
    links.push({ id: "website", label: "Site", href: milady.website });
  }

  if (isSolana || milady.magicEdenSlug) {
    const slug = milady.magicEdenSlug || milady.openseaId.replace(/-/g, "_");
    links.push({
      id: "magiceden",
      label: "Magic Eden",
      href: `https://magiceden.io/marketplace/${slug}`,
    });
  }

  if (isSolana || milady.tensorSlug) {
    const slug = milady.tensorSlug || milady.magicEdenSlug || milady.openseaId;
    links.push({
      id: "tensor",
      label: "Tensor",
      href: `https://www.tensor.trade/trade/${slug}`,
    });
  }

  // OpenSea for EVM-style collections (skip pure Solana unless no other market)
  if (!isSolana) {
    links.push({
      id: "opensea",
      label: "OpenSea",
      href: `https://opensea.io/collection/${milady.openseaId}`,
    });
  } else if (links.length === 0 || (links.length === 1 && links[0].id === "website")) {
    links.push({
      id: "opensea",
      label: "OpenSea",
      href: `https://opensea.io/collection/${milady.openseaId}`,
    });
  }

  // Dedupe by href
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

export function getPrimaryLink(milady: MiladyType): string {
  const links = getMarketplaceLinks(milady);
  // Prefer explicit website only when it's not just a marketplace URL we already have
  if (milady.website && !/opensea\.io|magiceden\.|tensor\.trade/i.test(milady.website)) {
    return milady.website;
  }
  const me = links.find((l) => l.id === "magiceden");
  if (me) return me.href;
  const os = links.find((l) => l.id === "opensea");
  if (os) return os.href;
  return links[0]?.href || `https://opensea.io/collection/${milady.openseaId}`;
}
