import type { Metadata } from "next"
import { CatalogView } from "@/features/barbershop-catalog/components/CatalogView"

export const metadata: Metadata = {
  title: "Encontre uma barbearia",
  description: "Explore o catálogo de barbearias do BarberHub por nome, cidade ou bairro.",
  robots: { index: false, follow: true }, // Não indexar estabelecimentos fictícios.
}

type SearchParams = Record<string, string | string[] | undefined>
function first(value: SearchParams[string]) {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 120) ?? ""
}

export default async function BarbershopsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  return <CatalogView filters={{ query: first(params.q), city: first(params.cidade) }} demoState={process.env.NODE_ENV === "development" ? first(params.estado) : undefined} />
}
