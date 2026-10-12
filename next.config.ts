import type { NextConfig } from "next";

// GITHUB_PAGES=true arma una exportación estática para GitHub Pages (ver .github/workflows/pages.yml).
const pages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /* config options here */
  // La exportación estática no admite Cache Components (ver scripts/pages-prepare.mjs).
  cacheComponents: !pages,
  partialPrefetching: !pages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(pages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  }),
};

export default nextConfig;
