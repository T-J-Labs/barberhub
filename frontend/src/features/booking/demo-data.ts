import type { BookingDemoData, BookingSelection, DemoScenario } from "./types"

/** Fixtures isoladas, sem consulta HTTP, agenda administrativa ou cálculo de disponibilidade. */
const esquinaDemo: BookingDemoData = {
  services: [
    { key: "corte", name: "Corte de cabelo", description: "Na tesoura ou na máquina, com acabamento para o seu estilo.", price: 35, durationMinutes: 30 },
    { key: "barba", name: "Barba", description: "Desenho, alinhamento e acabamento com navalha.", price: 25, durationMinutes: 25 },
    { key: "corte-barba", name: "Corte e barba", description: "Os dois cuidados em uma visita.", price: 55, durationMinutes: 55 },
  ],
  professionals: [
    { key: "rafael", name: "Rafael", description: "Cortes na tesoura e acabamentos clássicos.", serviceKeys: ["corte", "barba", "corte-barba"] },
    { key: "diego", name: "Diego", description: "Degradês e desenho de barba.", serviceKeys: ["corte", "barba", "corte-barba"] },
  ],
  dates: [
    { key: "2026-10-12", label: "Segunda, 12 de outubro de 2026" },
    { key: "2026-10-13", label: "Terça, 13 de outubro de 2026" },
    { key: "2026-10-14", label: "Quarta, 14 de outubro de 2026" },
  ],
  // Chaves apenas locais de apresentação: profissional/data. Não são parâmetros HTTP.
  slots: {
    "rafael/2026-10-12": ["09:00", "10:30", "14:00", "16:00"],
    "rafael/2026-10-13": ["09:30", "11:00", "15:00"],
    "diego/2026-10-12": ["10:00", "13:00", "15:30"],
    "diego/2026-10-13": ["10:30", "14:30"],
  },
}

const navalhaDemo: BookingDemoData = {
  services: [
    { key: "corte-navalha", name: "Corte clássico", description: "Tesoura, máquina e acabamento com atenção aos detalhes.", price: 40, durationMinutes: 35 },
    { key: "barba-navalha", name: "Barba na navalha", description: "Contorno e alinhamento para um desenho preciso.", price: 30, durationMinutes: 30 },
    { key: "combo-navalha", name: "Corte e barba", description: "Um cuidado completo em uma só visita.", price: 65, durationMinutes: 60 },
  ],
  professionals: [
    { key: "bruno", name: "Bruno", description: "Cortes clássicos e acabamento na tesoura.", serviceKeys: ["corte-navalha", "combo-navalha"] },
    { key: "lucas", name: "Lucas", description: "Desenho de barba e cortes na máquina.", serviceKeys: ["corte-navalha", "barba-navalha", "combo-navalha"] },
  ],
  dates: [
    { key: "2026-10-12", label: "Segunda, 12 de outubro de 2026" },
    { key: "2026-10-13", label: "Terça, 13 de outubro de 2026" },
    { key: "2026-10-14", label: "Quarta, 14 de outubro de 2026" },
  ],
  slots: {
    "bruno/2026-10-12": ["09:30", "11:30", "15:00"],
    "bruno/2026-10-13": ["10:00", "14:00"],
    "lucas/2026-10-12": ["10:00", "13:30", "16:30"],
    "lucas/2026-10-13": ["09:00", "11:00", "15:30"],
  },
}

/** Ponto de substituição futuro; aguardar operações e schemas aprovados no OpenAPI. */
export function getBookingDemoData(subdomain: string): BookingDemoData {
  if (subdomain === "demo-esquina") return esquinaDemo
  if (subdomain === "demo-navalha") return navalhaDemo
  return { services: [], professionals: [], dates: [], slots: {} }
}

export const demoScenarios: { key: DemoScenario; label: string }[] = [
  { key: "normal", label: "Exemplo completo" },
  { key: "loading", label: "Carregamento demonstrativo" },
  { key: "no-services", label: "Sem serviços de exemplo" },
  { key: "no-professionals", label: "Sem profissionais de exemplo" },
  { key: "no-slots", label: "Sem horários de exemplo" },
  { key: "error", label: "Erro demonstrativo de horários" },
  { key: "invalid-review", label: "Revisão incompleta" },
  { key: "final-error", label: "Erro demonstrativo na conclusão" },
  { key: "conflict", label: "Conflito demonstrativo: horário ficou indisponível" },
]

export function demoProfessionals(data: BookingDemoData, service: string, scenario: DemoScenario) {
  return scenario === "no-professionals" ? [] : data.professionals.filter((person) => person.serviceKeys.includes(service))
}

export function demoSlots(data: BookingDemoData, selection: BookingSelection, scenario: DemoScenario, unavailableExample: BookingSelection | null = null) {
  if (scenario === "no-slots" || scenario === "error" || !data.services.some((service) => service.key === selection.service)
    || !demoProfessionals(data, selection.service, scenario).some((person) => person.key === selection.professional)
    || !data.dates.some((date) => date.key === selection.date)) return []
  const slots = data.slots[`${selection.professional}/${selection.date}`] ?? []
  const sameExample = unavailableExample && unavailableExample.service === selection.service
    && unavailableExample.professional === selection.professional && unavailableExample.date === selection.date
  return sameExample ? slots.filter((slot) => slot !== unavailableExample.slot) : slots
}
