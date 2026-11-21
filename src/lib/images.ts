import manifest from "@/generated/images.json";

export type ImageEntry = { width: number; height: number; widths: number[]; placeholder: boolean; og: string };
const images = manifest as Record<string, ImageEntry>;

export function getImage(name: string): ImageEntry | undefined {
  return images[name];
}

export function srcSet(name: string, format: "avif" | "webp") {
  const img = images[name];
  if (!img) return "";
  return img.widths.map((w) => `/images/opt/${name}-${w}.${format} ${w}w`).join(", ");
}

export function fallbackSrc(name: string) {
  const img = images[name];
  if (!img) return "";
  const w = img.widths.find((x) => x >= 800) ?? img.widths[img.widths.length - 1];
  return `/images/opt/${name}-${w}.webp`;
}
