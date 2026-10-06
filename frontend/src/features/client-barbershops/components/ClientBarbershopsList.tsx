import type { PlatformNavigation } from "@/features/auth/routing"
import type { DemoClientBarbershop } from "../types"
import { ClientBarbershopCard } from "./ClientBarbershopCard"
import { ClientBarbershopsState } from "./ClientBarbershopsState"

// Lista de casas já vinculadas, sem filtros de descoberta: duas colunas só em lg,
// nomes lideram, paleta/profundidade herdadas da conta, Geist e intervalos de 16px.
export function ClientBarbershopsList({ shops, platform }: { shops: readonly DemoClientBarbershop[]; platform: PlatformNavigation }) {
  if (!shops.length) return <ClientBarbershopsState kind="empty" />
  return <ul aria-label="Barbearias vinculadas de exemplo" className="grid gap-4 lg:grid-cols-2">{shops.map(shop => <li key={shop.id} className="min-w-0"><ClientBarbershopCard shop={shop} platform={platform} /></li>)}</ul>
}
