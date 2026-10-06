import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { catalogPanelClass } from "@/features/barbershop-catalog/styles"
import { demoClientBarbershops } from "@/features/client-barbershops/demo-data"
import { ClientBarbershopsList } from "@/features/client-barbershops/components/ClientBarbershopsList"
import { ClientBarbershopsScenarios } from "@/features/client-barbershops/components/ClientBarbershopsScenarios"
import { ClientBarbershopsState } from "@/features/client-barbershops/components/ClientBarbershopsState"

export const metadata: Metadata = { title: "Minhas barbearias", description: "Demonstração dos vínculos do cliente com barbearias.", robots: { index: false, follow: false } }

// Cliente voltando a uma casa conhecida: título 30/36px, nomes como foco da lista,
// Geist/paleta pública, bordas sutis, superfícies do catálogo e ritmo 4px/32px.
// O layout/header não autoriza acesso; somente vínculos fictícios são expostos.
export default async function ClientBarbershopsPage() {
  const platform = await getPlatformNavigation()
  const list = <ClientBarbershopsList shops={demoClientBarbershops} platform={platform} />
  return <div className="py-8 sm:py-12"><Container><div className="mx-auto max-w-5xl">
    <header className="mb-8"><p className="text-xs font-semibold tracking-widest text-sky-400">CONTA BARBERHUB</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Minhas barbearias</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">O vínculo real nasce após o primeiro agendamento real confirmado na barbearia. Aqui você poderá reencontrar os estabelecimentos vinculados à sua conta.</p></header>
    <aside aria-label="Limites da demonstração" className={`${catalogPanelClass} mb-6 p-5 text-sm leading-6 text-slate-300`}><p className="font-semibold text-sky-300">Dados fictícios · mesma identidade de demonstração</p><p className="mt-2">Estes vínculos são exemplos prontos, sem conta autenticada. Não são favoritos. O wizard não cria vínculos nem reservas nesta área; cancelamentos locais e alterações no superadmin não mudam esta lista.</p></aside>
    {!platform.isPlatform ? <ClientBarbershopsState kind="unavailable" /> : process.env.NODE_ENV === "development" ? <ClientBarbershopsScenarios unavailable={<ClientBarbershopsList shops={demoClientBarbershops.map(shop => ({ ...shop, available: shop.id !== "demo-navalha" }))} platform={platform} />}>{list}</ClientBarbershopsScenarios> : list}
  </div></Container></div>
}
