import { NextRequest, NextResponse } from "next/server"
import { getConfiguredPublicHost } from "./features/public-barbershop/host-config"
import { isPublicSubdomain, publicBarbershopHref, publicHostContext } from "./features/public-barbershop/routing"

export function proxy(request: NextRequest) {
  const protocol = process.env.NODE_ENV === "development" ? "http:" : "https:"
  const host = request.headers.get("host")
  const context = publicHostContext(host, getConfiguredPublicHost(), protocol)
  if (!context) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  const redirectTo = (destination: URL) => {
    destination.search = search
    return NextResponse.redirect(destination, 307)
  }

  const profile = pathname.match(/^\/barbearias\/([^/]+)$/)
  if (profile) {
    let subdomain: string
    try { subdomain = decodeURIComponent(profile[1]) } catch { return NextResponse.next() }
    if (isPublicSubdomain(subdomain)) {
      return redirectTo(new URL(publicBarbershopHref(subdomain, context.origin)))
    }
  }

  // Normalize trusted hosts before rendering; forwarded headers never select a tenant.
  if (context.subdomain && host?.toLowerCase() !== context.canonicalHost) {
    const destination = new URL(context.origin)
    destination.host = context.canonicalHost
    destination.pathname = pathname
    return redirectTo(destination)
  }
  if (context.subdomain && pathname === "/") {
    const destination = new URL(request.url)
    destination.pathname = `/barbearias/${context.subdomain}`
    return NextResponse.rewrite(destination)
  }
  return NextResponse.next()
}

export const config = { matcher: ["/", "/barbearias/:path*", "/login", "/cadastro", "/register"] }
