/**
 * Responsive image pipeline.
 * Drop source images (jpg, jpeg, png, webp, avif or svg) into /assets/photos.
 * Running `npm run images` (runs automatically before dev & build) creates:
 *   public/images/opt/<name>-<width>.avif|webp  (480, 800, 1200, 1600 — never upscaled)
 *   public/images/og/<name>.jpg                  (1200×630 Open Graph image)
 *   src/generated/images.json                     (sizes manifest used by <Picture>)
 * To replace a placeholder, add a photo with the SAME base name (e.g. dentist-1.jpg)
 * and delete the placeholder .svg.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const SRC = path.join(root, "assets/photos");
const OPT = path.join(root, "public/images/opt");
const OG = path.join(root, "public/images/og");
const MANIFEST = path.join(root, "src/generated/images.json");
const WIDTHS = [480, 800, 1200, 1600];
const EXT = /\.(jpe?g|png|webp|avif|svg)$/i;

fs.mkdirSync(OPT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => EXT.test(f));
const byName = new Map();
for (const f of files) {
  const name = f.replace(EXT, "");
  // Prefer a real photo over the SVG placeholder if both exist
  if (!byName.has(name) || byName.get(name).endsWith(".svg")) byName.set(name, f);
}

const manifest = {};
for (const [name, file] of byName) {
  const input = path.join(SRC, file);
  const isSvg = file.endsWith(".svg");
  const load = () => sharp(input, isSvg ? { density: 200 } : {}).rotate();
  const meta = await load().metadata();
  const srcW = isSvg ? 1600 : meta.width;
  const ratio = meta.height / meta.width;
  const widths = WIDTHS.filter((w) => w <= srcW);
  if (!widths.length) widths.push(srcW);

  const stamp = fs.statSync(input).mtimeMs;
  for (const w of widths) {
    for (const fmt of ["avif", "webp"]) {
      const out = path.join(OPT, `${name}-${w}.${fmt}`);
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs > stamp) continue;
      const img = load().resize({ width: w });
      await (fmt === "avif" ? img.avif({ quality: 55 }) : img.webp({ quality: 78 })).toFile(out);
    }
  }
  const ogOut = path.join(OG, `${name}.jpg`);
  if (!fs.existsSync(ogOut) || fs.statSync(ogOut).mtimeMs < stamp) {
    await load().resize({ width: 1200, height: 630, fit: "cover" }).flatten({ background: "#ffffff" }).jpeg({ quality: 82 }).toFile(ogOut);
  }
  const width = widths[widths.length - 1];
  manifest[name] = { width, height: Math.round(width * ratio), widths, placeholder: isSvg, og: `/images/og/${name}.jpg` };
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} processed → public/images/opt`);
