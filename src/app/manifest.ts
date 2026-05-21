import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description:
      "Vasi, statue, fontane e arredo giardino artigianale con consegna in Calabria.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5f0",
    theme_color: "#c4704a",
    lang: "it",
    icons: [
      {
        src: "/logo/bazar-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
