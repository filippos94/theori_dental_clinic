// Theori Dental Clinic logo generator: mark (tooth + theta smile) and outlined wordmark.
// Regenerate: cd into a folder with opentype.js, @fontsource/manrope and @fontsource/inter installed, then `node make-logo.cjs <output-dir>`.
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
// woff (zlib) files: opentype.js parses woff directly
const load = (p) => { const b = fs.readFileSync(path.join(__dirname, "node_modules/@fontsource", p)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const manrope700 = load("manrope/files/manrope-latin-700-normal.woff");
const manrope600 = load("manrope/files/manrope-latin-600-normal.woff");
const inter600 = load("inter/files/inter-latin-600-normal.woff");
const interGreek600 = load("inter/files/inter-greek-600-normal.woff");

const OUT = process.argv[2] || path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });

const C = { teal: "#176A6D", tealDark: "#0D3B40", ink: "#0F2A33", soft: "#4A5F66", white: "#FFFFFF", mist: "#DCEDED" };

/* ── The mark, drawn on a 100×100 grid ──
   A rounded molar outline whose interior "bar" is a smile curve: reads as a tooth,
   a smile, and the Greek letter Θ (theta), the initial of Theori. */
const TOOTH = "M50 21.5C42.5 15.5 27.5 13 22.2 26.2c-3.6 9 .4 18 3 27.3 2.8 10.2 3.6 25.5 10.8 25.5 6.9 0 5.7-18.5 14-18.5s7.1 18.5 14 18.5c7.2 0 8-15.3 10.8-25.5 2.6-9.3 6.6-18.3 3-27.3C72.5 13 57.5 15.5 50 21.5Z";
const SMILE = "M34.5 39.5Q50 51.5 65.5 39.5";
function mark({ stroke, sw = 5.2, bg = null, bgRadius = 24 }) {
  const g = [];
  if (bg) g.push(`<rect x="0" y="0" width="100" height="100" rx="${bgRadius}" fill="${bg}"/>`);
  const t = bg ? `transform="translate(0 1.5)"` : "";
  g.push(`<g ${t} fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${TOOTH}"/><path d="${SMILE}"/></g>`);
  return g.join("");
}

// Outlined text → { d, width } at a given size and letter-spacing (em)
function text(font, str, size, tracking = 0) {
  let x = 0; const parts = [];
  const glyphs = [...str].map((ch) => font.charToGlyph(ch));
  glyphs.forEach((gl, i) => {
    parts.push(gl.getPath(x, 0, size).toPathData(2));
    x += (gl.advanceWidth / font.unitsPerEm) * size;
    if (i < glyphs.length - 1) {
      x += (font.getKerningValue(gl, glyphs[i + 1]) / font.unitsPerEm) * size;
      x += tracking * size;
    }
  });
  return { d: parts.join(" "), width: x };
}

const word = text(manrope700, "Theori", 100, -0.03);
const sub = text(inter600, "DENTAL CLINIC", 30, 0.205);
const subGr = text(interGreek600, "ΟΔΟΝΤΙΑΤΡΕΙΟ", 30, 0.16);
const capH = 72; // Manrope cap-height ≈ 0.72em at 100px

function horizontal({ markOpts, wordColor, subColor, greek = false }) {
  const s = greek ? subGr : sub;
  const markSize = 150, gap = 34, x0 = markSize + gap;
  const w = Math.ceil(x0 + Math.max(word.width, s.width) + 6), h = 150;
  const body = `<svg x="0" y="0" width="${markSize}" height="${markSize}" viewBox="0 0 100 100">${mark(markOpts)}</svg>
  <path transform="translate(${x0} 88)" d="${word.d}" fill="${wordColor}"/>
  <path transform="translate(${x0 + 3} 134)" d="${s.d}" fill="${subColor}"/>`;
  return { w, h, body };
}
function stacked({ markOpts, wordColor, subColor }) {
  const w = Math.ceil(Math.max(word.width, sub.width) + 40), markSize = 170;
  const h = markSize + 40 + capH + 70;
  const body = `<svg x="${(w - markSize) / 2}" y="0" width="${markSize}" height="${markSize}" viewBox="0 0 100 100">${mark(markOpts)}</svg>
  <path transform="translate(${(w - word.width) / 2} ${markSize + 40 + capH + 4})" d="${word.d}" fill="${wordColor}"/>
  <path transform="translate(${(w - sub.width) / 2} ${markSize + 40 + capH + 58})" d="${sub.d}" fill="${subColor}"/>`;
  return { w, h, body };
}
const wrap = ({ w, h, body }, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const T = "Theori Dental Clinic";
const files = {
  "theori-logo-horizontal.svg": wrap(horizontal({ markOpts: { stroke: C.white, bg: C.teal }, wordColor: C.ink, subColor: C.soft }), T),
  "theori-logo-horizontal-white.svg": wrap(horizontal({ markOpts: { stroke: C.teal, bg: C.white }, wordColor: C.white, subColor: C.mist }), T),
  "theori-logo-horizontal-greek.svg": wrap(horizontal({ markOpts: { stroke: C.white, bg: C.teal }, wordColor: C.ink, subColor: C.soft, greek: true }), "Theori Οδοντιατρείο"),
  "theori-logo-horizontal-greek-white.svg": wrap(horizontal({ markOpts: { stroke: C.teal, bg: C.white }, wordColor: C.white, subColor: C.mist, greek: true }), "Theori Οδοντιατρείο"),
  "theori-logo-stacked.svg": wrap(stacked({ markOpts: { stroke: C.white, bg: C.teal }, wordColor: C.ink, subColor: C.soft }), T),
  "theori-mark.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100" role="img" aria-label="${T}"><title>${T}</title>${mark({ stroke: C.white, bg: C.teal })}</svg>\n`,
  "theori-mark-outline.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="12 8 76 80" role="img" aria-label="${T}"><title>${T}</title>${mark({ stroke: C.teal, sw: 4.6 })}</svg>\n`,
  "theori-mark-mono-black.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="12 8 76 80" role="img" aria-label="${T}"><title>${T}</title>${mark({ stroke: "#000000", sw: 4.6 })}</svg>\n`,
  "favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${mark({ stroke: C.white, sw: 6.5, bg: C.teal, bgRadius: 26 })}</svg>\n`,
};
for (const [n, s] of Object.entries(files)) fs.writeFileSync(path.join(OUT, n), s);
console.log("sub", Math.round(sub.width), "gr", Math.round(subGr.width)); console.log("wrote", Object.keys(files).length, "files to", OUT, "| word width", Math.round(word.width));
