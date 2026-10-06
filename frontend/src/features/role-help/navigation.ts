import { clientAuthHref, validateAuthContext, type AccountType, type PlatformNavigation } from "@/features/auth/routing"
import { publicBookingHref } from "@/features/booking/routing"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"
import { publicBarbershopHref } from "@/features/public-barbershop/routing"

export function helpNavigation(platform: PlatformNavigation, candidate: unknown, role: AccountType) {
  const shop = typeof candidate === "string" && platform.isTrustedHost && getPublicBarbershopPresentation(candidate) ? candidate : null
  const context = validateAuthContext(platform.origin, shop, null)
  const trustedOrigin = platform.isTrustedHost ? platform.origin : null
  return {
    context,
    profile: shop && trustedOrigin ? publicBarbershopHref(shop, trustedOrigin) : "/barbearias",
    booking: shop ? publicBookingHref(platform, shop) ?? "/barbearias" : "/barbearias",
    login: clientAuthHref(trustedOrigin, "login", context, role),
    signup: clientAuthHref(trustedOrigin, "cadastro", context, role),
  }
}
