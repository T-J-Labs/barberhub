import { SuperadminShell } from "@/features/superadmin-demo/components/SuperadminShell"
import { SuperadminDetails } from "@/features/superadmin-demo/components/SuperadminDetails"
import { readSearch } from "@/features/superadmin-demo/presentation"

export default async function ShopPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ q?: string | string[] }>
}) {
  const { id } = await params
  // Resolução local no Client Component: IDs criados em memória não estão nas
  // fixtures do servidor. Ausência após recarga não implica autorização/404 real.
  const query = readSearch((await searchParams).q)
  return <SuperadminShell title="Detalhes da barbearia"><SuperadminDetails key={id} id={id} query={query} /></SuperadminShell>
}
