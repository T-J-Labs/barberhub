import { headers } from "next/headers"
import { publicHostContext } from "./routing"
import { getConfiguredPublicHost } from "./host-config"

export async function getPublicBarbershopContext() {
  const development = process.env.NODE_ENV === "development"
  const host = (await headers()).get("host")
  const context = publicHostContext(
    host,
    getConfiguredPublicHost(),
    development ? "http:" : "https:",
  )
  return { origin: context?.origin, subdomain: context?.subdomain, isSubdomain: Boolean(context?.subdomain) }
}

export async function getPublicBarbershopOrigin() {
  return (await getPublicBarbershopContext()).origin
}
