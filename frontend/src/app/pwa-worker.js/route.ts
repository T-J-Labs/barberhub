import { NextRequest } from "next/server"
import { getConfiguredPublicHost } from "@/features/public-barbershop/host-config"
import { isPwaHost } from "@/features/pwa/policy"
import { pwaWorkerSource } from "@/features/pwa/worker"

export function GET(request: NextRequest) {
  const host = request.headers.get("host")
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ||
      !isPwaHost(host, getConfiguredPublicHost())) return new Response(null, { status: 404 })
  // HTTP somente no localhost explicitamente configurado para QA de produção.
  const protocol = getConfiguredPublicHost() === "localhost" ? "http:" : "https:"
  const origin = new URL(`${protocol}//${host}`).origin
  return new Response(pwaWorkerSource(origin), { headers: {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store", "Service-Worker-Allowed": "/",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; script-src 'self'; connect-src 'self'",
  } })
}
