import { headers } from "next/headers"
import { resolvePlatformNavigation } from "./routing"

export async function getPlatformNavigation() {
  const requestHeaders = await headers()
  return resolvePlatformNavigation(requestHeaders.get("host") ?? "", process.env.BARBERHUB_PUBLIC_HOST, process.env.NODE_ENV === "development")
}
