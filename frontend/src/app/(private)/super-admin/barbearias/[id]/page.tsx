import { notFound } from "next/navigation"
import { SuperadminShell } from "@/features/superadmin-demo/components/SuperadminShell"
import { SuperadminDetails } from "@/features/superadmin-demo/components/SuperadminDetails"
import { superadminShopsMock } from "@/features/superadmin-demo/mock-data"
import { readSearch } from "@/features/superadmin-demo/presentation"

export default async function ShopPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ q?: string | string[] }>
}) {
  const { id } = await params
  if (!superadminShopsMock.some(shop => shop.id === id)) notFound()
  const query = readSearch((await searchParams).q)
  return <SuperadminShell title="Detalhes da barbearia"><SuperadminDetails key={id} id={id} query={query} /></SuperadminShell>
}
