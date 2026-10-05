import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"
import { ProfileShell } from "@/features/public-barbershop/components/ProfileShell"
import { ProfileState } from "@/features/public-barbershop/components/ProfileState"
import { ProfileView } from "@/features/public-barbershop/components/ProfileView"
import { getPublicBarbershopContext } from "@/features/public-barbershop/request-origin"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { publicBookingHref } from "@/features/booking/routing"

type Props = {
  params: Promise<{ subdomain: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params
  const context = await getPublicBarbershopContext()
  const shop = context.subdomain === subdomain ? getPublicBarbershopPresentation(subdomain) : undefined
  const title = shop?.name ?? "Barbearia não encontrada"
  const description = shop ? `Prévia demonstrativa de ${shop.name}, em ${shop.neighborhood}, ${shop.city}.` : "Encontre uma barbearia disponível no catálogo BarberHub."
  return { title, description, openGraph: { title, description }, robots: { index: false, follow: true } }
}

export default async function PublicBarbershopPage({ params, searchParams }: Props) {
  const { subdomain } = await params
  const context = await getPublicBarbershopContext()
  if (context.subdomain !== subdomain) notFound()
  const shop = getPublicBarbershopPresentation(subdomain)
  if (!shop) notFound()
  const query = await searchParams
  const state = process.env.NODE_ENV === "development" && typeof query.estado === "string" ? query.estado : undefined
  if (state === "not-found") notFound()
  return (
    <ProfileShell>
      {state === "loading" || state === "error"
        ? <ProfileState kind={state} retryHref="/" />
        : <ProfileView shop={shop} bookingHref={publicBookingHref(await getPlatformNavigation(), shop.subdomain)} />}
    </ProfileShell>
  )
}
