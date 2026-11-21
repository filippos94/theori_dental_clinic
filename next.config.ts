import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // fully static site in /out
  trailingSlash: true,     // /en/tips/ -> out/en/tips/index.html (works on any static host)
  images: { unoptimized: true }, // we generate AVIF/WebP ourselves (scripts/optimize-images.mjs)
  reactStrictMode: true,
  experimental: { globalNotFound: true }, // friendly 404 page (src/app/global-not-found.tsx)
};

export default nextConfig;
