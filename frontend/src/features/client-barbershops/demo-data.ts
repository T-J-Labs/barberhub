import { barbershopsMock } from "@/features/barbershop-catalog/mock-data"
import type { DemoClientBarbershop } from "./types"

// Independente de reservas, wizard e provider do superadmin. Nenhuma criação de vínculo.
export const demoClientBarbershops: readonly DemoClientBarbershop[] = barbershopsMock
  .filter(shop => ["demo-esquina", "demo-navalha"].includes(shop.id))
  .map(shop => ({ ...shop, demoClientKey: "cliente-demonstracao", available: true }))
