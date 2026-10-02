import type { ReactNode } from "react"
import { PublicCatalogNavigation } from "@/features/public-barbershop/components/PublicCatalogLink"
import { getPublicBarbershopOrigin } from "@/features/public-barbershop/request-origin"

export default async function PublicBarbershopLayout({ children }: { children: ReactNode }) {
  const origin = await getPublicBarbershopOrigin()
  const href = origin ? new URL("/barbearias", origin).href : "/barbearias"
  return <PublicCatalogNavigation href={href}>{children}</PublicCatalogNavigation>
}
