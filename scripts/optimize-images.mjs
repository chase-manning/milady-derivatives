/**
 * Compress large images in public/api/images (target < 200KB where possible).
 * Converts oversized PNG/JPG/JPEG/JFIF/WEBP to AVIF and rewrites data.json paths.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "public", "api", "images");
const dataPath = path.join(root, "public", "api", "data.json");

const MAX_BYTES = 180 * 1024;
const TARGET_EDGE = 640;

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
/** @type {Record<string, string>} old filename -> new filename */
const renames = {};

const files = fs.readdirSync(imagesDir);
for (const file of files) {
  const full = path.join(imagesDir, file);
  const stat = fs.statSync(full);
  if (!stat.isFile()) continue;
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".jfif", ".webp"].includes(ext)) continue;
  if (stat.size <= MAX_BYTES && ext === ".avif") continue;
  if (stat.size <= MAX_BYTES && ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".jfif") {
    // leave small webp alone
    if (stat.size <= MAX_BYTES) continue;
  }
  if (stat.size <= MAX_BYTES && (ext === ".webp" || ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".jfif")) {
    // still convert very large only
    if (stat.size < 100 * 1024) continue;
  }

  const base = path.basename(file, ext);
  const outName = `${base}.avif`;
  const outFull = path.join(imagesDir, outName);

  try {
    let quality = 55;
    let buffer = await sharp(full)
      .rotate()
      .resize({
        width: TARGET_EDGE,
        height: TARGET_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .avif({ quality })
      .toBuffer();

    while (buffer.length > MAX_BYTES && quality > 30) {
      quality -= 8;
      buffer = await sharp(full)
        .rotate()
        .resize({
          width: TARGET_EDGE,
          height: TARGET_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif({ quality })
        .toBuffer();
    }

    fs.writeFileSync(outFull, buffer);
    const saved = ((1 - buffer.length / stat.size) * 100).toFixed(0);
    console.log(
      `  ${file} ${Math.round(stat.size / 1024)}KB → ${outName} ${Math.round(
        buffer.length / 1024
      )}KB (−${saved}%)`
    );

    if (outName !== file) {
      renames[file] = outName;
      // remove original if different
      try {
        fs.unlinkSync(full);
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    console.warn(`  skip ${file}: ${e.message || e}`);
  }
}

// Rewrite data.json image paths
let pathUpdates = 0;
for (const item of data) {
  const name = item.image?.replace("/api/images/", "");
  if (name && renames[name]) {
    item.image = `/api/images/${renames[name]}`;
    pathUpdates++;
  }
}
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated ${pathUpdates} data.json image paths. Renames: ${Object.keys(renames).length}`);
