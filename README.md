<img width="1500" alt="image" src="https://user-images.githubusercontent.com/53957795/212746403-bcfe2281-4139-4df9-9169-34936985a35b.png">

# Milady Derivatives

An unofficial list of Milady Derivatives maintained by the community.

If you're interested in contributing check out our [Contribution Guide](https://github.com/chase-manning/milady-derivatives/blob/main/.github/CONTRIBUTING.md).

Or if you know of any missing derivatives please [let me know](https://twitter.com/chase_manning_) and I will add them 😃

## Features

- **Gallery** — searchable, chain-filterable derivative cards
- **Live floors** — CoinGecko + Magic Eden stats merged from `public/api/live-stats.json`
- **Marketplace badges** — OpenSea / Magic Eden / Tensor / project site per card
- **Family tree** — lineage view via `parent` edges (`/family-tree`)
- **Open API** — [`/api/data.json`](https://miladyderivatives.com/api/data.json) and [`/api/live-stats.json`](https://miladyderivatives.com/api/live-stats.json)

## Development

```bash
yarn install
yarn start
```

### Data scripts

```bash
# Add parent / coingeckoId / marketplace slugs
yarn enrich

# Fetch live floors & 24h volume → public/api/live-stats.json
yarn live-stats

# Compress large PNG/JPG assets to AVIF and rewrite data.json paths
yarn optimize-images

# Enrich + live-stats
yarn prepare-data
```

Optional: set `COINGECKO_API_KEY` for higher CoinGecko rate limits when running `yarn live-stats`.

### Data Validation

```bash
yarn test
yarn test:data
```

What gets validated:

- Required fields + types on every `data.json` entry
- Unique URL-friendly `openseaId`
- `parent` lineage field
- Referenced images exist under `public/api/images/`
- Images under 500KB (`scripts/validate-images.sh`)
- Known `chainId` set (ETH, Base, Solana marker `101`, Abstract, Berachain, …)

### Deploy (Firebase Hosting)

Project id is configured in `.firebaserc` (`milady-derivatives`).

```bash
# one-shot local deploy (requires firebase login or token)
yarn deploy

# or
yarn prepare-data && yarn build
firebase deploy --only hosting
```

CI deploys on every push to `main` via `.github/workflows/cd.yml` using `FIREBASE_SECRET`. Optionally set `COINGECKO_API_KEY` for live-stats during deploy.
