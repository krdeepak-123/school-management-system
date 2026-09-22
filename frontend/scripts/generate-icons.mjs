import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "public");

async function raster(faviconBuf, size, maskable) {
  const filename = "pwa-" + size + "x" + size + (maskable ? "-maskable" : "") + ".png";
  const out = join(pub, filename);
  const inset = maskable ? 0 : size * 0.02;
  const corner = maskable ? 0 : size * 0.2;

  const bg =
    "<svg width='" + size + "' height='" + size + "' xmlns='http://www.w3.org/2000/svg'>" +
    "<defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'>" +
    "<stop offset='0' stop-color='#863bff'/>" +
    "<stop offset='1' stop-color='#7e14ff'/>" +
    "</linearGradient></defs>" +
    (inset ? "<rect x='" + inset + "' y='" + inset + "'" : "<rect x='0' y='0'") +
    " width='" + (size - inset * 2) + "' height='" + (size - inset * 2) + "'" +
    (corner ? " rx='" + corner + "'" : "") +
    " fill='url(#b)'/></svg>";
  const bgBuf = await sharp(Buffer.from(bg)).png().toBuffer();

  const target = Math.max(1, Math.round(size * (maskable ? 0.42 : 0.6)));
  const glyph = await sharp(faviconBuf)
    .resize({ width: target, height: Math.max(1, Math.round(target * 46 / 48)), fit: "fill" })
    .png()
    .toBuffer();

  const png = await sharp(bgBuf).composite([{ input: glyph, gravity: "center" }]).png().toBuffer();
  writeFileSync(out, png);
  console.log("wrote", out);
}

const favicon = readFileSync(join(pub, "favicon.svg"));

await raster(favicon, 192, false);
await raster(favicon, 512, false);
await raster(favicon, 192, true);
await raster(favicon, 512, true);
console.log("icons done");
