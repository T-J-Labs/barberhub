import type { Metadata } from "next"
import { BookingState } from "@/features/booking/components/BookingState"
import { getPlatformNavigation } from "@/features/auth/server-navigation"

export const metadata: Metadata = { title: "Escolha uma barbearia", robots: { index: false, follow: true } }

/** Na plataforma, a rota direta sem host de barbearia não aceita contexto via query. */
export default async function BookingWithoutContextPage() {
  const platform = await getPlatformNavigation()
  return <BookingState catalogHref={platform.origin ? `${platform.origin}/barbearias` : "/barbearias"} />
}
