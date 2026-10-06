import { barbershopsMock } from "@/features/barbershop-catalog/mock-data"

/** Identificador público é filtro de apresentação, nunca autorização ou tenant_id. */
export function appointmentBarbershopFilter(values: readonly string[]) {
  if (!values.length) return { kind: "all" as const }
  if (values.length !== 1) return { kind: "invalid" as const, message: "O parâmetro barbearia está repetido. Remova o filtro e escolha uma única barbearia." }
  const shop = barbershopsMock.find(shop => shop.id === values[0])
  return shop ? { kind: "selected" as const, shop } : { kind: "invalid" as const, message: "Barbearia desconhecida neste filtro. Remova o filtro ou abra uma barbearia conhecida em Minhas barbearias." }
}

/** Altera só o filtro solicitado, preservando inclusive repetições inválidas para orientação. */
export function appointmentFiltersHref(search: string, patch: { q?: string; removeBarbershop?: boolean }) {
  const params = new URLSearchParams(search)
  if (patch.q !== undefined) {
    params.delete("q")
    if (patch.q) params.set("q", patch.q)
  }
  if (patch.removeBarbershop) params.delete("barbearia")
  return `/cliente/agendamentos${params.size ? `?${params}` : ""}`
}
