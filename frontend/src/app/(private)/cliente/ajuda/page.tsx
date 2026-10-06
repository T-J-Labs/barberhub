import type { Metadata } from "next"
import { RoleHelpPage } from "@/features/role-help/components/RoleHelpPage"

export const metadata: Metadata = {
  title: "Ajuda do cliente — demonstração",
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ barbearia?: string | string[] }> }) {
  const params = await searchParams
  return <RoleHelpPage role="cliente" candidate={params.barbearia} />
}
