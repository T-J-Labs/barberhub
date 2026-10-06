import type { BarbershopPresentation } from "@/features/barbershop-catalog/types"

/** Vínculo fictício de apresentação; não é DTO, sessão ou perfil de tenant. */
export type DemoClientBarbershop = BarbershopPresentation & {
  demoClientKey: "cliente-demonstracao"
  available: boolean
}
