import { barbershopsMock } from "@/features/barbershop-catalog/mock-data"
import type { BarbershopPresentation } from "@/features/barbershop-catalog/types"

/** Estado exclusivo da amostra, sem relação com publicação, acesso ou DTOs. */
export type DemoShop = BarbershopPresentation & { demoStatus: "active" | "suspended" }
export const superadminShopsMock: readonly DemoShop[] = barbershopsMock.map(shop => ({
  ...shop, demoStatus: "active",
}))
