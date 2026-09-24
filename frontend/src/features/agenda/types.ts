export type AgendaStatus = "Confirmado" | "Aguardando" | "Concluído" | "Cancelado"

export type AgendaAppointment = {
  id: string
  time: string
  endTime: string
  client: string
  service: string
  barber: string
  status: AgendaStatus
  phone: string
}

export type AgendaDay = {
  label: string
  date: string
  appointments: AgendaAppointment[]
}

export type AgendaData = {
  days: AgendaDay[]
  barbers: string[]
  services: string[]
}