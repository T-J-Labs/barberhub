import type { DashboardData } from "./types"

export const adminDashboardMock: DashboardData = {
  metrics: [
    { label: "Agendamentos hoje", value: "18", detail: "+12% vs. ontem", trend: "positive" },
    { label: "Atendimentos concluídos", value: "07", detail: "39% do dia", trend: "neutral" },
    { label: "Faturamento previsto", value: "R$ 1.240", detail: "+8% vs. semana passada", trend: "positive" },
    { label: "Taxa de faltas", value: "4,2%", detail: "-1,8% este mês", trend: "positive" },
  ],
  appointments: [
    { time: "09:30", client: "Lucas Almeida", service: "Corte + barba", barber: "Rafael Costa", status: "Concluído" },
    { time: "10:15", client: "Marcos Vinícius", service: "Corte tradicional", barber: "André Santos", status: "Confirmado" },
    { time: "11:00", client: "João Pedro", service: "Barba completa", barber: "Rafael Costa", status: "Aguardando" },
    { time: "11:45", client: "Gustavo Oliveira", service: "Corte + barba", barber: "Caio Mendes", status: "Confirmado" },
  ],
  alerts: [
    { title: "3 confirmações pendentes", description: "Alguns clientes ainda não confirmaram o horário de hoje.", action: "Ver agendamentos", tone: "warning" },
    { title: "Horário de funcionamento", description: "A agenda de sábado ainda não foi configurada.", action: "Configurar horários", tone: "info" },
  ],
}