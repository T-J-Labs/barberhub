"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import { PublicHeader, type PublicHeaderContext } from "./PublicHeader"

export function PublicHeaderRoute() {
  // Layout segments describe the rendered route, including the destination of
  // host rewrites. The browser pathname can still be "/" for a barbershop.
  const segments = useSelectedLayoutSegments()
  const context: PublicHeaderContext = segments.length === 0
    ? "landing"
    : segments[0] === "barbearias"
      ? segments.length > 1 ? "barbershop" : "catalog"
      : "public"

  return <PublicHeader context={context} />
}
