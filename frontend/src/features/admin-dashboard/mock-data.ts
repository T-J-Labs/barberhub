import type { DashboardData } from "./types"
import { agendaMock } from "@/features/agenda/mock-data"

export const adminDashboardMock: DashboardData = {
  metrics: [
    { label: "Agendamentos hoje", value: "18", detail: "+12% vs. ontem", trend: "positive" },
    { label: "Atendimentos concluídos", value: "07", detail: "39% do dia", trend: "neutral" },
    { label: "Faturamento previsto", value: "R$ 1.240", detail: "+8% vs. semana passada", trend: "positive" },
    { label: "Taxa de faltas", value: "4,2%", detail: "-1,8% este mês", trend: "positive" },
  ],
  appointmentDays: agendaMock.days.map((day) => ({
    date: `${day.date} 2025`,
    appointments: day.appointments.map(({ time, client, service, barber, status }) => ({ time, client, service, barber, status })),
  })),
  alerts: [
    { title: "1 confirmação pendente", description: "Um cliente ainda não confirmou o horário desta amostra.", action: "Ver agendamentos", href: "/admin/agenda", tone: "warning" },
    { title: "Horário de funcionamento", description: "Confira o horário geral da barbearia na prévia de configurações.", action: "Configurar horários", href: "/admin/configuracoes#horarios", tone: "info" },
  ],
}
