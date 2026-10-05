import { isPublicSubdomain } from "@/features/public-barbershop/routing"

export type AuthMode = "login" | "cadastro"
export type AccountType = "cliente" | "barbeiro" | "barbearia"
export function isAccountType(value: unknown): value is AccountType {
  return value === "cliente" || value === "barbeiro" || value === "barbearia"
}
export type AuthContext = { barbershop: string | null; returnTo: string }
export type PlatformNavigation = {
  origin: string | null
  hostSubdomain: string | null
  isPlatform: boolean
  isTrustedHost: boolean
}

/** Host é contexto de navegação, nunca uma identidade autenticada. */
export function resolvePlatformNavigation(host: string, configuredHost: string | undefined, development: boolean): PlatformNavigation {
  const baseHost = configuredHost ?? (development ? "localhost" : undefined)
  const unavailable: PlatformNavigation = { origin: null, hostSubdomain: null, isPlatform: false, isTrustedHost: false }
  if (!baseHost || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(baseHost)) return unavailable
  const match = /^([a-z0-9.-]+)(?::([0-9]{1,5}))?$/.exec(host.toLowerCase())
  const hostname = match?.[1].replace(/\.$/, "")
  const port = match?.[2]
  const validPort = !port || (Number(port) >= 1 && Number(port) <= 65535)
  const suffix = `.${baseHost}`
  const candidate = hostname?.endsWith(suffix) ? hostname.slice(0, -suffix.length) : null
  const subdomain = candidate && isPublicSubdomain(candidate) ? candidate : null
  const isPlatform = hostname === baseHost
  const isTrustedHost = Boolean(match && validPort && (isPlatform || subdomain) && (development || !port || port === "443"))
  const origin = development
    ? isTrustedHost ? `http://${baseHost}${port ? `:${Number(port)}` : ""}` : null
    : `https://${baseHost}`
  return { origin, hostSubdomain: isTrustedHost ? subdomain : null, isPlatform: isTrustedHost && isPlatform, isTrustedHost }
}

export function tenantPublicOrigin(platformOrigin: string, barbershop: string) {
  if (!isPublicSubdomain(barbershop)) throw new Error("Identificador público inválido.")
  const url = new URL(platformOrigin)
  url.hostname = `${barbershop}.${url.hostname}`
  return url.origin
}

/** Retorno canônico ao subdomínio; caminhos legados do mesmo perfil são normalizados. */
export function validateAuthContext(platformOrigin: string | null, barbershop: string | null, returnTo: unknown): AuthContext {
  const shop = barbershop && isPublicSubdomain(barbershop) ? barbershop : null
  const fallback = shop && platformOrigin ? `${tenantPublicOrigin(platformOrigin, shop)}/` : shop ? `/barbearias/${shop}` : "/barbearias"
  if (!platformOrigin || !shop || typeof returnTo !== "string") return { barbershop: shop, returnTo: fallback }
  // Nenhum destino fornecido altera o retorno canônico da barbearia validada.
  return { barbershop: shop, returnTo: fallback }
}

export function clientAuthHref(origin: string | null, mode: AuthMode, context?: AuthContext, accountType: AccountType = "cliente"): string | null {
  if (!origin) return null
  const url = new URL(`/${mode}`, origin)
  if (isAccountType(accountType) && accountType !== "cliente") url.searchParams.set("perfil", accountType)
  if (context?.barbershop) {
    const safe = validateAuthContext(origin, context.barbershop, context.returnTo)
    if (safe.barbershop) {
      url.searchParams.set("barbearia", safe.barbershop)
      url.searchParams.set("returnTo", safe.returnTo)
    }
  }
  return url.href
}

export function publicClientContext(pathname: string, platform: PlatformNavigation): AuthContext {
  const match = /^\/barbearias\/([a-z0-9-]+)\/?$/.exec(pathname)
  const shop = match?.[1] ?? (pathname === "/" ? platform.hostSubdomain : null)
  const destination = shop && shop === platform.hostSubdomain && platform.origin
    ? `${tenantPublicOrigin(platform.origin, shop)}/` : null
  return validateAuthContext(platform.origin, shop, destination)
}

export function platformReturnHref(origin: string | null, context: AuthContext) {
  const safe = validateAuthContext(origin, context.barbershop, context.returnTo)
  return origin ? new URL(safe.returnTo, origin).href : safe.returnTo
}
