import type { AgendaStatus } from "@/features/agenda/types"

export type DashboardMetric = {
  label: string
  value: string
  detail: string
  trend: "positive" | "neutral" | "negative"
}

export type AppointmentStatus = AgendaStatus

export type Appointment = {
  time: string
  client: string
  service: string
  barber: string
  status: AppointmentStatus
}

export type DashboardAlert = {
  title: string
  description: string
  action: string
  href: string
  tone: "warning" | "info"
}

export type DashboardData = {
  metrics: DashboardMetric[]
  appointmentDays: { date: string; appointments: Appointment[] }[]
  alerts: DashboardAlert[]
}
