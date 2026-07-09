import { useEffect, useMemo, useState } from "react";

export interface LiveStat {
  floorNative?: number | null;
  floorUsd?: number | null;
  volume24hNative?: number | null;
  volume24hUsd?: number | null;
  volumeAllNative?: number | null;
  nativeSymbol?: string;
  marketCapUsd?: number | null;
  listedCount?: number | null;
  source?: string;
  meFloorNative?: number | null;
}

export interface MiladyType {
  name: string;
  openseaId: string;
  description: string;
  chainId: number;
  image: string;
  volume: number;
  website?: string;
  parent?: string;
  coingeckoId?: string;
  magicEdenSlug?: string;
  tensorSlug?: string;
  /** Merged at runtime from live-stats.json */
  live?: LiveStat;
}

interface LiveStatsFile {
  updatedAt?: string;
  stats?: Record<string, LiveStat>;
}

const useMiladys = () => {
  const [miladys, setMiladys] = useState<MiladyType[] | null>(null);
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [dataRes, liveRes] = await Promise.all([
        fetch("/api/data.json"),
        fetch("/api/live-stats.json").catch(() => null),
      ]);
      const data: MiladyType[] = await dataRes.json();

      let live: LiveStatsFile = {};
      if (liveRes && liveRes.ok) {
        try {
          live = await liveRes.json();
        } catch {
          live = {};
        }
      }

      if (cancelled) return;

      const stats = live.stats || {};
      const merged = data.map((item) =>
        stats[item.openseaId] ? { ...item, live: stats[item.openseaId] } : item
      );

      setMiladys(merged);
      setLiveUpdatedAt(live.updatedAt || null);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    if (!miladys) return null;
    return [...miladys].sort((a, b) => {
      // Prefer live 24h volume (usd) when both present, else static volume
      const av =
        a.live?.volume24hUsd ??
        a.live?.volume24hNative ??
        a.volume;
      const bv =
        b.live?.volume24hUsd ??
        b.live?.volume24hNative ??
        b.volume;
      // When using static volume as fallback, scale live native less aggressively:
      // sort primarily by static volume for catalog rank stability, boost live floor presence
      if (a.live?.volume24hUsd != null || b.live?.volume24hUsd != null) {
        const aScore = a.live?.volume24hUsd ?? a.volume * 100;
        const bScore = b.live?.volume24hUsd ?? b.volume * 100;
        return bScore - aScore;
      }
      return (typeof bv === "number" ? bv : 0) - (typeof av === "number" ? av : 0);
    });
  }, [miladys]);

  return { miladys: sorted, liveUpdatedAt };
};

export default useMiladys;
