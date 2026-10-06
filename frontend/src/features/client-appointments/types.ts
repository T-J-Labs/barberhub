/** Modelo exclusivo da demonstração; não representa um DTO ou regra aprovada. */
export type DemoAppointment = {
  key: string
  barbershop: { name: string; subdomain: string; location?: string }
  startsAt: string
  service: string
  professional?: string
  price?: number
  durationMinutes?: number
  status: "scheduled" | "completed" | "cancelled"
}

export type DemoAppointmentsScenario = "normal" | "empty" | "loading" | "error"
