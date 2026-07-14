/**
 * Fetch live floor / 24h volume for collections with coingeckoId or magicEdenSlug.
 * Writes public/api/live-stats.json for the client to merge at runtime.
 *
 * Usage: node scripts/fetch-live-stats.mjs
 * Env:   COINGECKO_API_KEY (optional, Demo/Pro key for higher rate limits)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataPath = path.join(root, "public", "api", "data.json");
const outPath = path.join(root, "public", "api", "live-stats.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const cgHeaders = {
  Accept: "application/json",
  "User-Agent": "milady-derivatives-live-stats/1.0",
};
if (process.env.COINGECKO_API_KEY) {
  cgHeaders["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
}

async function fetchJson(url, headers = {}, retries = 3) {
  let lastErr;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...headers } });
      if (res.status === 429) {
        const wait = 4000 * (attempt + 1);
        console.warn(`  rate limited, waiting ${wait}ms…`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${url} ${text.slice(0, 120)}`);
      }
      return res.json();
    } catch (e) {
      lastErr = e;
      if (attempt < retries - 1) await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr || new Error(`Failed ${url}`);
}

async function fetchCoinGecko(id) {
  const data = await fetchJson(
    `https://api.coingecko.com/api/v3/nfts/${encodeURIComponent(id)}`,
    cgHeaders
  );
  return {
    floorNative: data.floor_price?.native_currency ?? null,
    floorUsd: data.floor_price?.usd ?? null,
    volume24hNative: data.volume_24h?.native_currency ?? null,
    volume24hUsd: data.volume_24h?.usd ?? null,
    nativeSymbol: (data.native_currency_symbol || "ETH").toUpperCase(),
    marketCapUsd: data.market_cap?.usd ?? null,
    source: "coingecko",
  };
}

async function fetchMagicEden(slug) {
  const stats = await fetchJson(
    `https://api-mainnet.magiceden.dev/v2/collections/${encodeURIComponent(
      slug
    )}/stats`
  );
  // floorPrice is in lamports (1e9)
  const floorSol =
    typeof stats.floorPrice === "number" ? stats.floorPrice / 1e9 : null;
  const volSol =
    typeof stats.volumeAll === "number" ? stats.volumeAll / 1e9 : null;
  return {
    floorNative: floorSol,
    floorUsd: null,
    volume24hNative: null,
    volume24hUsd: null,
    volumeAllNative: volSol,
    nativeSymbol: "SOL",
    listedCount: stats.listedCount ?? null,
    source: "magiceden",
  };
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const stats = {};
const errors = [];

// Prefer CoinGecko where available (richer floor + 24h vol)
const cgItems = data.filter((d) => d.coingeckoId);
const meItems = data.filter((d) => d.magicEdenSlug && !d.coingeckoId);

console.log(
  `Fetching live stats: ${cgItems.length} CoinGecko, ${meItems.length} Magic Eden…`
);

for (const item of cgItems) {
  try {
    stats[item.openseaId] = await fetchCoinGecko(item.coingeckoId);
    console.log(
      `  ✓ CG ${item.openseaId} floor=${stats[item.openseaId].floorNative}`
    );
  } catch (e) {
    errors.push({ id: item.openseaId, error: String(e.message || e) });
    console.warn(`  ✗ CG ${item.openseaId}: ${e.message || e}`);
  }
  await sleep(2500); // free tier rate limit
}

// Also try ME for solana collections even if CG exists (extra listed count)
for (const item of data.filter((d) => d.magicEdenSlug)) {
  try {
    const me = await fetchMagicEden(item.magicEdenSlug);
    if (stats[item.openseaId]) {
      stats[item.openseaId] = {
        ...stats[item.openseaId],
        listedCount: me.listedCount,
        meFloorNative: me.floorNative,
        sources: [stats[item.openseaId].source, "magiceden"],
      };
    } else {
      stats[item.openseaId] = me;
    }
    console.log(`  ✓ ME ${item.openseaId} floor=${me.floorNative} SOL`);
  } catch (e) {
    errors.push({ id: item.openseaId, me: true, error: String(e.message || e) });
    console.warn(`  ✗ ME ${item.openseaId}: ${e.message || e}`);
  }
  await sleep(400);
}

const payload = {
  updatedAt: new Date().toISOString(),
  count: Object.keys(stats).length,
  stats,
  errors: errors.length ? errors : undefined,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
console.log(`Wrote ${outPath} (${payload.count} collections).`);
