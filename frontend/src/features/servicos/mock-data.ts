import type { Service } from "./types"

export const servicesMock: Service[] = [
  {
    id: "serv-001",
    name: "Corte tradicional",
    description: "Corte com acabamento e finalização.",
    price: 45,
    durationMinutes: 30,
    active: true,
  },
  {
    id: "serv-002",
    name: "Corte + barba",
    description: "Corte completo e cuidado da barba na mesma visita.",
    price: 75,
    durationMinutes: 45,
    active: true,
  },
  {
    id: "serv-003",
    name: "Barba completa",
    description: "Alinhamento, desenho e acabamento da barba.",
    price: 40,
    durationMinutes: 40,
    active: true,
  },
  {
    id: "serv-004",
    name: "Acabamento",
    description: "Ajuste de contornos entre cortes.",
    price: 25,
    durationMinutes: 20,
    active: false,
  },
]
