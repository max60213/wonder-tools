import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@raw-core": path.resolve(__dirname, "packages/raw2dng/raw-core/src/index.ts"),
      "@raw-core/types": path.resolve(__dirname, "packages/raw2dng/raw-core/src/types/index.ts"),
      "@dng-writer": path.resolve(__dirname, "packages/raw2dng/dng-writer/src/index.ts"),
      "@adobe-dng-wasm": path.resolve(__dirname, "packages/raw2dng/adobe-dng-wasm/src/index.ts"),
      "@libraw-wasm": path.resolve(__dirname, "packages/raw2dng/libraw-wasm/src/index.ts"),
      "@worker-runtime": path.resolve(__dirname, "packages/raw2dng/worker-runtime/src/index.ts"),
    };
    return config;
  },
};

export default nextConfig;
