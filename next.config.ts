import type { NextConfig } from "next";
import fs from "fs";

console.log("[BUILD DIAG] CWD:", process.cwd());
try {
  console.log("[BUILD DIAG] Files:", fs.readdirSync("."));
} catch (e) {
  console.log("[BUILD DIAG] readdir error:", e);
}
console.log("[BUILD DIAG] DB exists:", fs.existsSync("./dev.db"));

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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
