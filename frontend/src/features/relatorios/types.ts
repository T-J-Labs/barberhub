export type ReportStatus = "Confirmado" | "Concluído" | "Cancelado" | "Falta"

export type ReportAppointment = {
  id: string
  date: string
  barber: string
  service: string
  status: ReportStatus
}
