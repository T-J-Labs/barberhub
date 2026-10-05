import { tenantPublicOrigin, type PlatformNavigation } from "@/features/auth/routing"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"

export function publicBookingHref(platform: PlatformNavigation, subdomain: string): string | null {
  if (!platform.origin || !platform.isTrustedHost || !getPublicBarbershopPresentation(subdomain)) return null
  return `${tenantPublicOrigin(platform.origin, subdomain)}/agendar`
}
