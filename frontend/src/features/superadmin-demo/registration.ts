import { isPublicSubdomain } from "@/features/public-barbershop/routing"
import { adminNavigation } from "@/features/navigation/config/admin-navigation"
import { barberNavigation } from "@/features/navigation/config/barber-navigation"
import { clientNavigation } from "@/features/navigation/config/client-navigation"
import { superAdminNavigation } from "@/features/navigation/config/super-admin-navigation"
import type { NavigationConfig } from "@/features/navigation/types"
import type { DemoShop } from "./mock-data"

export type RegistrationDraft = { name: string; city: string; neighborhood: string; subdomain: string; manualReason: string }
export type RegistrationErrors = Partial<Record<keyof RegistrationDraft, string>>
export const registrationLimits = { name: 120, city: 80, neighborhood: 80, subdomain: 63, manualReason: 500 } as const
export const emptyRegistration: RegistrationDraft = { name: "", city: "", neighborhood: "", subdomain: "", manualReason: "" }
export const registrationNotice = "Barbearia adicionada à amostra — nenhum estabelecimento real foi criado. Subdomínio, acesso e publicação não foram provisionados."

// Não existe política de nomes reservados no roteamento atual. Esta proteção
// exclusivamente local deriva nomes da navegação; acesso/booking/compatibilidade
// e o prefixo do OpenAPI completam os caminhos existentes. Não altera hosts.
const navigation: readonly NavigationConfig[] = [adminNavigation, barberNavigation, clientNavigation, superAdminNavigation]
export const demoReservedSubdomains = new Set([
  ...navigation.flatMap(config => [...config.primary, ...config.secondary].flatMap(item => item.href ? [item.href.split("/")[1]] : [])),
  "login", "cadastro", "register", "agendar", "agendamento", "api",
])

export function validateRegistration(input: RegistrationDraft, shops: readonly DemoShop[]):
  | { valid: true; value: RegistrationDraft }
  | { valid: false; errors: RegistrationErrors } {
  const value = Object.fromEntries(Object.entries(input).map(([key, text]) => [key, text.trim()])) as RegistrationDraft
  value.subdomain = value.subdomain.toLowerCase()
  const errors: RegistrationErrors = {}
  for (const key of Object.keys(registrationLimits) as (keyof RegistrationDraft)[]) {
    if (!value[key]) errors[key] = "Preencha este campo."
    else if (value[key].length > registrationLimits[key]) errors[key] = `Use até ${registrationLimits[key]} caracteres.`
  }
  if (!errors.subdomain) {
    if (!isPublicSubdomain(value.subdomain)) errors.subdomain = "Use somente letras de a a z, números e hífens internos, sem protocolo, porta ou caminho."
    else if (demoReservedSubdomains.has(value.subdomain)) errors.subdomain = "Este nome está reservado na demonstração para uma rota da plataforma."
    else if (shops.some(shop => shop.subdomain.toLowerCase() === value.subdomain)) errors.subdomain = "Este subdomínio já existe na amostra, incluindo seus rascunhos."
  }
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true, value }
}

/** Recebe um ID gerado uma única vez pelo provider, fora do updater React. */
export function makeManualDraft(value: RegistrationDraft, id: string): DemoShop {
  return { ...value, id, initials: value.name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toLocaleUpperCase("pt-BR"), demoStatus: "draft" }
}
