import type { AgendaData } from "./types"

export const agendaMock: AgendaData = {
  days: [
    {
      label: "Hoje",
      date: "24 jun",
      appointments: [
        { id: "ag-001", time: "09:00", endTime: "09:45", client: "Lucas Almeida", service: "Corte + barba", barber: "Rafael Costa", status: "Concluído", phone: "(21) 99841-2040" },
        { id: "ag-002", time: "10:00", endTime: "10:30", client: "Marcos Vinícius", service: "Corte tradicional", barber: "André Santos", status: "Confirmado", phone: "(21) 99710-8821" },
        { id: "ag-003", time: "11:00", endTime: "11:40", client: "João Pedro", service: "Barba completa", barber: "Rafael Costa", status: "Aguardando", phone: "(21) 99102-5508" },
        { id: "ag-004", time: "13:30", endTime: "14:15", client: "Gustavo Oliveira", service: "Corte + barba", barber: "Caio Mendes", status: "Confirmado", phone: "(21) 99803-4412" },
        { id: "ag-005", time: "15:00", endTime: "15:30", client: "Pedro Henrique", service: "Corte tradicional", barber: "André Santos", status: "Confirmado", phone: "(21) 99618-7230" },
      ],
    },
    {
      label: "Amanhã",
      date: "25 jun",
      appointments: [
        { id: "ag-006", time: "09:30", endTime: "10:15", client: "Felipe Martins", service: "Corte + barba", barber: "Rafael Costa", status: "Confirmado", phone: "(21) 99511-1304" },
        { id: "ag-007", time: "11:30", endTime: "12:00", client: "Bruno Ferreira", service: "Barba completa", barber: "Caio Mendes", status: "Aguardando", phone: "(21) 99218-0432" },
      ],
    },
    { label: "Quinta", date: "26 jun", appointments: [] },
  ],
  barbers: ["Todos os barbeiros", "Rafael Costa", "André Santos", "Caio Mendes"],
  services: ["Todos os serviços", "Corte + barba", "Corte tradicional", "Barba completa"],
}