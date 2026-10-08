"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import type { PublicHeaderContext } from "./PublicHeader"
import { InstitutionalHeader } from "@/features/public-home/components/InstitutionalHeader"
import { usePathname } from "next/navigation"
import { publicClientContext, type PlatformNavigation } from "@/features/auth/routing"
import { ClientHeader } from "../authenticated/ClientHeader"

export function PublicHeaderRoute({ platform }: { platform: PlatformNavigation }) {
  // Layout segments describe the rendered route, including the destination of
  // host rewrites. The browser pathname can still be "/" for a barbershop.
  const segments = useSelectedLayoutSegments()
  const clientContext = publicClientContext(usePathname(), platform)
  const context: PublicHeaderContext = segments.length === 0
    ? "landing"
    : segments[0] === "barbearias"
      ? segments.length > 1 ? "barbershop" : "catalog"
      : "public"

  return context === "landing" ? <InstitutionalHeader platform={platform} /> : <ClientHeader platformOrigin={platform.origin} context={clientContext} visitorAccessPlacement={context === "catalog" ? "center" : "footer"} />
}
