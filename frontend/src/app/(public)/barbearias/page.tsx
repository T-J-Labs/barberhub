import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CatalogView } from "@/features/barbershop-catalog/components/CatalogView"
import { getPublicBarbershopContext } from "@/features/public-barbershop/request-origin"

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
  const { origin: publicOrigin, isSubdomain } = await getPublicBarbershopContext()
  if (isSubdomain && publicOrigin) {
    const destination = new URL("/barbearias", publicOrigin)
    for (const [name, values] of Object.entries(params)) {
      for (const value of Array.isArray(values) ? values : values === undefined ? [] : [values]) {
        destination.searchParams.append(name, value)
      }
    }
    redirect(destination.href)
  }
  const development = process.env.NODE_ENV === "development"
  return <CatalogView publicOrigin={publicOrigin} filters={{ query: first(params.q), city: first(params.cidade) }} demoState={development ? first(params.estado) : undefined} />
}
