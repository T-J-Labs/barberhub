import { barbershopsMock } from "@/features/barbershop-catalog/mock-data"
import { profileDetailsMock } from "./mock-data"
import { isPublicSubdomain } from "./routing"
import type { PublicBarbershopPresentation } from "./types"

/**
 * Substituir por uma operação pública gerada pelo Orval após aprovação no OpenAPI.
 * A seleção local por subdomínio não resolve um tenant real nem concede acesso.
 * Não há HTTP, tenant_id, sessão ou importação de dados privados.
 */
export function getPublicBarbershopPresentation(subdomain: string): PublicBarbershopPresentation | null {
  if (!isPublicSubdomain(subdomain)) return null
  const shop = barbershopsMock.find((candidate) => candidate.subdomain === subdomain)
  if (!shop) return null
  const details = Object.hasOwn(profileDetailsMock, subdomain) ? profileDetailsMock[subdomain] : undefined
  return {
    ...shop,
    description: `Conheça ${shop.name}, em ${shop.neighborhood}, ${shop.city}. Um lugar no seu bairro para cuidar do seu estilo.`,
    services: [],
    professionals: [],
    openingHours: [],
    ...details,
  }
}
