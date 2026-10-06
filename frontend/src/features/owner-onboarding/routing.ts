import type { DemoOrigin } from "./types"
export const onboardingPath = "/onboarding/barbearia"
export function readDemoOrigin(value: unknown): DemoOrigin | null {
  return value === "cadastro" || value === "superadmin" ? value : null
}
export function onboardingHref(origin?: DemoOrigin | null) {
  return origin ? `${onboardingPath}?origem=${origin}` : onboardingPath
}
export const adminDemoDestinations = [
  { path: "/admin/configuracoes", label: "Configurações" },
  { path: "/admin/servicos", label: "Serviços" },
  { path: "/admin/barbeiros", label: "Barbeiros" },
] as const
