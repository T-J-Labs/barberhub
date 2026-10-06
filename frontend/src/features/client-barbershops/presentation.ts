import type { PlatformNavigation } from "@/features/auth/routing"
import { publicBarbershopHref } from "@/features/public-barbershop/routing"
import { publicBookingHref } from "@/features/booking/routing"
import type { DemoClientBarbershop } from "./types"

export function clientBarbershopActions(shop: DemoClientBarbershop, platform: PlatformNavigation) {
  const publicAvailable = shop.available && platform.isPlatform && platform.isTrustedHost && platform.origin
  return {
    profile: publicAvailable ? publicBarbershopHref(shop.subdomain, platform.origin!) : null,
    booking: publicAvailable ? publicBookingHref(platform, shop.subdomain) : null,
    appointments: `/cliente/agendamentos?${new URLSearchParams({ barbearia: shop.id })}`,
  }
}
