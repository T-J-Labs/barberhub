import type { DemoAppointment } from "./types"
import { appointmentBarbershopFilter } from "./filters"

export const appointmentStatusLabel = { scheduled: "Agendado · exemplo", completed: "Concluído · exemplo", cancelled: "Cancelado · exemplo" }
export function partitionAppointments(items: readonly DemoAppointment[], referenceDate: string, query = "", barbershops: readonly string[] = []) {
  const filter = appointmentBarbershopFilter(barbershops)
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  const term = normalize(query)
  const filtered = items.filter((item) => filter.kind !== "invalid" && (filter.kind !== "selected" || item.barbershop.subdomain === filter.shop.subdomain) && normalize(`${item.barbershop.name} ${item.barbershop.subdomain} ${item.service} ${item.professional ?? ""}`).includes(term))
  const upcoming = filtered.filter((item) => item.status === "scheduled" && Date.parse(item.startsAt) >= Date.parse(referenceDate)).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
  const history = filtered.filter((item) => !upcoming.includes(item)).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))
  return { upcoming, history }
}

/** Transição visual local, sem elegibilidade de cancelamento real ou persistência. */
export function cancelDemoAppointment(items: readonly DemoAppointment[], key: string) {
  return items.map((item) => item.key === key && item.status === "scheduled" ? { ...item, status: "cancelled" as const } : item)
}

export function appointmentDate(startsAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date(startsAt))
}
export function appointmentTime(startsAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(startsAt))
}
