import type { Metadata } from "next"
import { RoleHelpPage } from "@/features/role-help/components/RoleHelpPage"

export const metadata: Metadata = {
  title: "Ajuda do barbeiro — demonstração",
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ barbearia?: string | string[] }> }) {
  const params = await searchParams
  return <RoleHelpPage role="barbeiro" candidate={params.barbearia} />
}
