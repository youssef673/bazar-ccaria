import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "http", hostname: "localhost" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@img/sharp-win32-x64/**/*",
      "node_modules/@img/sharp-libvips-linux-x64/**/*",
      "node_modules/.cache/prisma/**/*",
      "node_modules/.prisma/client/query_engine-windows.dll.node",
      "node_modules/@prisma/engines/**/*",
      ".next/cache/**/*",
    ],
  },
};

export default nextConfig;
