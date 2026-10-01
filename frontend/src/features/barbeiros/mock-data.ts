import type { Barber } from "./types"

export const barbersMock: Barber[] = [
  {
    id: "bar-001",
    name: "Rafael Costa",
    active: true,
    workdays: ["ter", "qua", "qui", "sex", "sab"],
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    id: "bar-002",
    name: "André Santos",
    active: true,
    workdays: ["seg", "ter", "qua", "qui", "sex"],
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    id: "bar-003",
    name: "Caio Mendes",
    active: true,
    workdays: ["qua", "qui", "sex", "sab", "dom"],
    startTime: "10:00",
    endTime: "19:00",
  },
]
