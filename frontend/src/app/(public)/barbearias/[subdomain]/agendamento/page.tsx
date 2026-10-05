import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { publicBookingHref } from "@/features/booking/routing"
import { BookingState } from "@/features/booking/components/BookingState"

export const metadata: Metadata = { title: "Agendamento demonstrativo", robots: { index: false, follow: true } }

/** Alias legado sem outra experiência ou contexto vindo de query. */
export default async function LegacyBookingPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const platform = await getPlatformNavigation()
  const destination = publicBookingHref(platform, (await params).subdomain)
  if (destination) redirect(destination)
  return <BookingState catalogHref={platform.origin ? `${platform.origin}/barbearias` : "/barbearias"} />
}
