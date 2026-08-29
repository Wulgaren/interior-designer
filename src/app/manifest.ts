import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Homiq",
    short_name: "Homiq",
    description: "Planer pomieszczeń wnętrz — skale i wymiary na telefonie.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1c1a18",
    theme_color: "#1c1a18",
    lang: "pl",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
