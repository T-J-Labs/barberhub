import type { BarbershopPresentation } from "@/features/barbershop-catalog/types"

/** Modelos locais de apresentação; não são DTOs ou schemas aprovados da API. */
export type PublicBarbershopPresentation = BarbershopPresentation & {
  /** Fonte única da logo na apresentação; integração depende do contrato público. */
  logoSrc?: string
  description: string
  services: readonly { name: string; description: string; price: number; durationMinutes: number }[]
  professionals: readonly { name: string; initials: string; description: string }[]
  openingHours: readonly { days: string; hours: string }[]
}
