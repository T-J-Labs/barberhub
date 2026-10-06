import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import { getConfiguredPublicHost } from "@/features/public-barbershop/host-config"
import { isPwaHost } from "@/features/pwa/policy"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // A convenção do App Router publica o link; hosts sem autorização recebem
  // um manifesto vazio, sem identidade instalável por tenant.
  if (!isPwaHost((await headers()).get("host"), getConfiguredPublicHost())) return {}
  return {
    id: "/", name: "BarberHub", short_name: "BarberHub", lang: "pt-BR",
    description: "Encontre barbearias e acompanhe sua experiência no BarberHub.",
    start_url: "/barbearias", scope: "/", display: "standalone",
    background_color: "#07111C", theme_color: "#07111C",
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
