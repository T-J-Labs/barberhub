import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"

/** Mesmo padrão server das áreas globais; query não escolhe tenant ou autoriza acesso. */
export async function redirectClientArea(pathname: "/cliente/barbearias" | "/cliente/agendamentos") {
  const platform = await getPlatformNavigation()
  if (platform.isTrustedHost && platform.hostSubdomain && platform.origin && getPublicBarbershopPresentation(platform.hostSubdomain)) {
    const destination = new URL(pathname, platform.origin)
    // Proxy sobrescreve o header em toda entrada dessas rotas. Host validado decide
    // somente o domínio; a query é filtro visual e não amplia destinos/permissões.
    destination.search = (await headers()).get("x-barberhub-client-search") ?? ""
    redirect(destination.href)
  }
  return platform
}
