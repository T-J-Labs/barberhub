import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Container } from "@/components/ui/Container"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { clientAuthHref, platformReturnHref, validateAuthContext } from "@/features/auth/routing"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"
import { getBookingDemoData } from "@/features/booking/demo-data"
import { publicBookingHref } from "@/features/booking/routing"
import { BookingFlow } from "@/features/booking/components/BookingFlow"
import { BookingState } from "@/features/booking/components/BookingState"

export const metadata: Metadata = { title: "Agendamento demonstrativo", robots: { index: false, follow: true } }

export default async function BookingPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const platform = await getPlatformNavigation()
  const shop = getPublicBarbershopPresentation(subdomain)
  const canonical = publicBookingHref(platform, subdomain)
  const catalogHref = platform.origin ? `${platform.origin}/barbearias` : "/barbearias"
  if (!shop || !canonical) return <BookingState catalogHref={catalogHref} />
  if (platform.hostSubdomain !== shop.subdomain) redirect(canonical)
  const context = validateAuthContext(platform.origin, shop.subdomain, undefined)
  return <div className="py-8 sm:py-12" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}><Container>
    <BookingFlow key={shop.subdomain} shopName={shop.name} data={getBookingDemoData(shop.subdomain)} loginHref={clientAuthHref(platform.origin, "login", context)} signupHref={clientAuthHref(platform.origin, "cadastro", context)} returnHref={platformReturnHref(platform.origin, context)} />
  </Container></div>
}
