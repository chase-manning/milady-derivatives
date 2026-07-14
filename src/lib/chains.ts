export const CHAIN_LABELS: Record<number, string> = {
  1: "Ethereum",
  101: "Solana",
  137: "Polygon",
  420: "Optimism",
  900: "Other",
  999: "HyperEVM",
  2741: "Abstract",
  8453: "Base",
  43114: "Avalanche",
  80094: "Berachain",
};

export const CHAIN_FILTERS: { id: number | "all"; label: string }[] = [
  { id: "all", label: "All chains" },
  { id: 1, label: "Ethereum" },
  { id: 8453, label: "Base" },
  { id: 101, label: "Solana" },
  { id: 137, label: "Polygon" },
  { id: 2741, label: "Abstract" },
  { id: 80094, label: "Berachain" },
  { id: 43114, label: "Avalanche" },
];

export const KNOWN_CHAIN_IDS = Object.keys(CHAIN_LABELS).map(Number);
