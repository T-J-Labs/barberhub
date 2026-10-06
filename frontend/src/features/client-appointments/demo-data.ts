import type { DemoAppointment } from "./types"

// Amostra independente do wizard e das agendas administrativas. Uma identidade fictícia.
export const demoReferenceDate = "2026-10-05T12:00:00-03:00"
const esquina = { name: "Barbearia da Esquina", subdomain: "demo-esquina", location: "Madureira, Rio de Janeiro" }
const navalha = { name: "Navalha & Pente", subdomain: "demo-navalha", location: "Méier, Rio de Janeiro" }
export const demoAppointments: readonly DemoAppointment[] = [
  { key: "exemplo-01", barbershop: esquina, startsAt: "2026-10-12T10:30:00-03:00", service: "Corte de cabelo", professional: "Rafael", price: 35, durationMinutes: 30, status: "scheduled" },
  { key: "exemplo-02", barbershop: navalha, startsAt: "2026-10-13T14:00:00-03:00", service: "Corte e barba", professional: "Bruno", price: 65, durationMinutes: 60, status: "scheduled" },
  { key: "exemplo-03", barbershop: navalha, startsAt: "2026-09-22T09:30:00-03:00", service: "Corte clássico", status: "completed" },
  { key: "exemplo-04", barbershop: esquina, startsAt: "2026-09-10T15:00:00-03:00", service: "Barba", professional: "Diego", price: 25, durationMinutes: 25, status: "cancelled" },
]
