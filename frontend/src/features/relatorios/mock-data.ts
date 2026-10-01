import type { ReportAppointment, ReportStatus } from "./types"

// Amostra independente da agenda demonstrativa: representa desfechos ao longo de junho de 2025.
const appointments: Array<[string, string, string, ReportStatus]> = [
  ["2025-06-02", "Rafael Costa", "Corte + barba", "Concluído"],
  ["2025-06-03", "André Santos", "Corte tradicional", "Concluído"],
  ["2025-06-04", "Caio Mendes", "Barba completa", "Concluído"],
  ["2025-06-05", "Rafael Costa", "Corte tradicional", "Falta"],
  ["2025-06-06", "André Santos", "Corte + barba", "Concluído"],
  ["2025-06-07", "Caio Mendes", "Corte + barba", "Cancelado"],
  ["2025-06-09", "Rafael Costa", "Barba completa", "Concluído"],
  ["2025-06-10", "André Santos", "Corte tradicional", "Concluído"],
  ["2025-06-11", "Caio Mendes", "Corte + barba", "Falta"],
  ["2025-06-12", "Rafael Costa", "Corte + barba", "Concluído"],
  ["2025-06-13", "André Santos", "Barba completa", "Cancelado"],
  ["2025-06-14", "Caio Mendes", "Corte tradicional", "Concluído"],
  ["2025-06-16", "Rafael Costa", "Corte tradicional", "Concluído"],
  ["2025-06-17", "André Santos", "Corte + barba", "Concluído"],
  ["2025-06-18", "Caio Mendes", "Barba completa", "Concluído"],
  ["2025-06-19", "Rafael Costa", "Corte + barba", "Cancelado"],
  ["2025-06-20", "André Santos", "Corte tradicional", "Falta"],
  ["2025-06-21", "Caio Mendes", "Corte + barba", "Concluído"],
  ["2025-06-23", "Rafael Costa", "Corte + barba", "Concluído"],
  ["2025-06-24", "André Santos", "Corte tradicional", "Concluído"],
  ["2025-06-24", "Caio Mendes", "Barba completa", "Cancelado"],
  ["2025-06-25", "Rafael Costa", "Corte tradicional", "Falta"],
  ["2025-06-26", "André Santos", "Barba completa", "Concluído"],
  ["2025-06-27", "Caio Mendes", "Corte + barba", "Concluído"],
  ["2025-06-28", "Rafael Costa", "Barba completa", "Confirmado"],
  ["2025-06-30", "André Santos", "Corte + barba", "Confirmado"],
]

export const reportsMock: ReportAppointment[] = appointments.map(([date, barber, service, status], index) => ({
  id: `report-${String(index + 1).padStart(3, "0")}`,
  date,
  barber,
  service,
  status,
}))
