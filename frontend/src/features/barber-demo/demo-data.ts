// Modelos locais de apresentação; não são DTOs ou contratos da API.
export type DemoSlot = {
  key: string
  date: string // Data ISO local do exemplo, no fuso de Brasília.
  start: string
  end: string
} & ({ kind: "appointment"; client: string; service: string; price: number; status: "scheduled" | "completed" | "no-show" } | { kind: "free" | "blocked" })

export const demoProfessional = "Rafael Lima (fictício)"
export const demoShop = "Barbearia Esquina (demonstração)"
export const demoDay = "5 de outubro de 2026"
export const demoReferenceDate = "2026-10-05"
export const demoReferenceTime = "10:00"
export const demoSlots: readonly DemoSlot[] = [
  { key: "demo-09", date: "2026-09-30", start: "09:00", end: "09:30", kind: "appointment", client: "Caio (fictício)", service: "Corte clássico", price: 40, status: "completed" },
  { key: "demo-0930", date: "2026-10-04", start: "09:30", end: "10:00", kind: "appointment", client: "Leo (fictício)", service: "Barba", price: 30, status: "no-show" },
  { key: "demo-10", date: demoReferenceDate, start: "10:00", end: "10:45", kind: "appointment", client: "André (fictício)", service: "Corte e barba", price: 65, status: "scheduled" },
  { key: "demo-1045", date: demoReferenceDate, start: "10:45", end: "11:15", kind: "free" },
  { key: "demo-1115", date: demoReferenceDate, start: "11:15", end: "11:45", kind: "appointment", client: "Bruno (fictício)", service: "Corte clássico", price: 40, status: "scheduled" },
  { key: "demo-1145", date: demoReferenceDate, start: "11:45", end: "12:15", kind: "blocked" },
]
