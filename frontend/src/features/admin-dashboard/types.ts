export type DashboardMetric = {
  label: string
  value: string
  detail: string
  trend: "positive" | "neutral" | "negative"
}

export type AppointmentStatus = "Confirmado" | "Aguardando" | "Concluído"

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
  tone: "warning" | "info"
}

export type DashboardData = {
  metrics: DashboardMetric[]
  appointments: Appointment[]
  alerts: DashboardAlert[]
}