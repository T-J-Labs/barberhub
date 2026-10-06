import { SuperadminShell } from "@/features/superadmin-demo/components/SuperadminShell"
import { SuperadminList } from "@/features/superadmin-demo/components/SuperadminList"
import { readSearch } from "@/features/superadmin-demo/presentation"

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const query = readSearch((await searchParams).q)
  return <SuperadminShell title="Barbearias"><SuperadminList key={query} query={query} /></SuperadminShell>
}
