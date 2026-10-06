import { NextRequest, NextResponse } from "next/server"
import { getConfiguredPublicHost } from "./features/public-barbershop/host-config"
import { isPublicSubdomain, publicBarbershopHref, publicHostContext } from "./features/public-barbershop/routing"
import { getPublicBarbershopPresentation } from "./features/public-barbershop/barbershop-presentation"

export function proxy(request: NextRequest) {
  if (["/cliente/barbearias", "/cliente/agendamentos"].includes(request.nextUrl.pathname)) {
    // Sobrescrever sempre: header interno transporta só a query, nunca identidade/tenant.
    // O layout redireciona antes de streaming, sem normalização de localhost do proxy.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-barberhub-client-search", request.nextUrl.search)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  const protocol = process.env.NODE_ENV === "development" ? "http:" : "https:"
  const host = request.headers.get("host")
  const context = publicHostContext(host, getConfiguredPublicHost(), protocol)
  if (!context) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  const redirectTo = (destination: URL) => {
    destination.search = search
    return NextResponse.redirect(destination, 307)
  }

  const profile = pathname.match(/^\/barbearias\/([^/]+)(?:\/(agendar|agendamento))?$/)
  if (profile) {
    let subdomain: string
    try { subdomain = decodeURIComponent(profile[1]) } catch { return NextResponse.next() }
    if (isPublicSubdomain(subdomain) && (!profile[2] || getPublicBarbershopPresentation(subdomain))) {
      const destination = new URL(publicBarbershopHref(subdomain, context.origin))
      if (profile[2]) destination.pathname = "/agendar"
      return redirectTo(destination)
    }
  }

  // Normalize trusted hosts before rendering; forwarded headers never select a tenant.
  if (context.subdomain && host?.toLowerCase() !== context.canonicalHost) {
    const destination = new URL(context.origin)
    destination.host = context.canonicalHost
    destination.pathname = pathname
    return redirectTo(destination)
  }
  if (pathname === "/agendamento") {
    const destination = new URL(context.subdomain ? publicBarbershopHref(context.subdomain, context.origin) : context.origin)
    destination.pathname = "/agendar"
    return redirectTo(destination)
  }
  if (context.subdomain && (pathname === "/" || pathname === "/agendar")) {
    const destination = new URL(request.url)
    destination.pathname = `/barbearias/${context.subdomain}${pathname === "/agendar" ? "/agendar" : ""}`
    return NextResponse.rewrite(destination)
  }
  return NextResponse.next()
}

export const config = { matcher: ["/", "/barbearias/:path*", "/agendar", "/agendamento", "/login", "/cadastro", "/register", "/cliente/barbearias", "/cliente/agendamentos"] }
