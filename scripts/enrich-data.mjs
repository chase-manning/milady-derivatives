/**
 * Merge parent lineage, marketplace slugs, and CoinGecko IDs into data.json.
 * Safe to re-run; preserves existing fields and only fills gaps / known maps.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "public", "api", "data.json");

/** @type {Record<string, string>} */
const PARENTS = {
  "discount-knockoff-miladysaver-pfp-project-tbh": "milady",
  "tubby-milady-maker": "milady",
  "mclady-maker": "milady",
  miladyaura: "milady",
  "spring-miaura": "miladyaura",
  milaidymaker: "milady",
  streetsofmilady: "milady",
  "azuki-milady": "milady",
  "anti-miladies": "milady",
  "pixel-miladies": "milady",
  mimories: "milady",
  coolmiladymaker: "milady",
  "banners-nft": "milady",
  boredmilady: "milady",
  notokaymiladys: "milady",
  cigawrettepacks: "milady",
  pixeladymaker: "milady",
  "pixeladymaker-bc": "pixeladymaker",
  "pixeladymaker-wotlk": "pixeladymaker",
  "pixeladymaker-radbro": "radbro-webring",
  "milady-maker-x-lite": "milady",
  "remilio-babies": "milady",
  miladyrave: "milady",
  "milady-mfers": "milady",
  sonoramaker: "milady",
  sonora222: "sonoramaker",
  "radbro-webring": "milady",
  "matrix-milady": "milady",
  ghibladymaker: "milady",
  misketti: "milady",
  miladystation: "milady",
  miladmaker: "milady",
  "water-mililys": "spring-miaura",
  merikuri: "ghibladymaker",
  "milady-christmas": "milady",
  "milady-christmas-pets": "milady-christmas",
  strawberryjuice: "ghibladymaker",
  "custom-milady-tcg": "milady",
  basedmiladymaker: "milady",
  miladycolombia: "milady",
  mifella: "milady",
  mccustoms: "mclady-maker",
  pixeladieseth: "pixeladymaker",
  roritamaker: "milady",
  "ascii-milady-2": "milady",
  "dollady-1": "milady",
  kardlady: "milady",
  radbro: "radbro-webring",
  miladybitch: "milady",
  "rainbow-zorblady-maker": "milady-rainbow-zorb",
  "milady-rainbow-zorb": "milady",
  "beetle-games": "milady",
  "yona-honorary-service": "milady",
  oekakimaker: "milady",
  lawbsters: "milady",
  miladycola: "milady",
  cogawrettes: "milady",
  cogawrettesatelier: "cogawrettes",
  "sudo-bastard-miladys": "milady",
  "remilio64-1": "remilio-babies",
  "meowlady-maker": "milady",
  "midenza-maker": "milady",
  zladymaker: "milady",
  "mifairy-maker": "milady",
  r3dbro: "radbro-webring",
  midevil: "milady",
  schizoposters: "radbro-webring",
  veryinternetperson: "milady",
  "milady-aura-petz": "miladyaura",
  "heisei-milady-maker": "milady",
  miloogymaker: "milady",
  "milady-2-global-terror": "milady",
  "banenrs-2-shadow-operative-unit": "banners-nft",
  "neko-maker": "milady",
  "elite-maker": "milady",
  emilio: "remilio-babies",
  "pockit-milady": "milady",
  nochillio: "remilio-babies",
  "qunktardio-maker": "schizoposters",
  "milady-maker-party": "milady",
  mosaicladymaker: "milady",
  philady: "milady",
  "hero-768880944": "milady",
  hypio: "remilio-babies",
  "retardio-cousins": "remilio-babies",
  "dreamiliomaker-abstract": "remilio-babies",
  mibera333: "milady",
  kemonokaki: "milady",
};

/** Known CoinGecko NFT IDs (verified against api.coingecko.com/api/v3/nfts/:id) */
const COINGECKO = {
  "remilio-babies": "redacted-remilio-babies",
  hypio: "wealthy-hypio-babies",
  "retardio-cousins": "retardio-cousins",
  kemonokaki: "kemonokaki",
  schizoposters: "schizoposters",
  "radbro-webring": "radbro-webring",
};

const MAGIC_EDEN = {
  "retardio-cousins": "retardio_cousins",
};

const TENSOR = {
  "retardio-cousins": "retardio_cousins",
};

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

let updated = 0;
for (const item of data) {
  const id = item.openseaId;
  if (!item.parent) {
    item.parent = PARENTS[id] || "milady";
    updated++;
  }
  if (!item.coingeckoId && COINGECKO[id]) {
    item.coingeckoId = COINGECKO[id];
    updated++;
  }
  if (!item.magicEdenSlug && MAGIC_EDEN[id]) {
    item.magicEdenSlug = MAGIC_EDEN[id];
    updated++;
  }
  if (!item.tensorSlug && TENSOR[id]) {
    item.tensorSlug = TENSOR[id];
    updated++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
console.log(`Enriched ${data.length} entries (${updated} field writes).`);
