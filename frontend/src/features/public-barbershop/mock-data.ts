import type { PublicBarbershopPresentation } from "./types"

/** Conteúdo fictício isolado. Nunca importar dados das features administrativas. */
export const profileDetailsMock: Record<string, Omit<PublicBarbershopPresentation, "id" | "subdomain" | "name" | "city" | "neighborhood" | "initials">> = {
  "demo-navalha": {
    description: "Cuidado com os detalhes, do corte clássico ao acabamento com navalha. Um espaço de exemplo para conhecer a jornada de agendamento.",
    services: [
      { name: "Corte clássico", description: "Corte na tesoura ou máquina com acabamento clássico.", price: 40, durationMinutes: 35 },
      { name: "Barba na navalha", description: "Desenho e acabamento de barba com navalha.", price: 30, durationMinutes: 30 },
      { name: "Corte e barba", description: "Corte e barba em uma visita de exemplo.", price: 65, durationMinutes: 60 },
    ],
    professionals: [
      { name: "Bruno", initials: "BR", description: "Cortes clássicos e combinações de corte e barba." },
      { name: "Lucas", initials: "LU", description: "Cortes, desenho de barba e acabamento com navalha." },
    ],
    openingHours: [
      { days: "Segunda a sexta", hours: "09h às 18h" },
      { days: "Sábado", hours: "09h às 16h" },
      { days: "Domingo", hours: "Fechado" },
    ],
  },
  "demo-esquina": {
    description: "Um espaço de encontro em Madureira. Do corte de sempre a um novo estilo, aqui o cuidado começa na conversa e termina nos detalhes.",
    services: [
      { name: "Corte de cabelo", description: "Na tesoura ou na máquina, com acabamento pensado para o seu estilo.", price: 35, durationMinutes: 30 },
      { name: "Barba", description: "Desenho, alinhamento e acabamento com navalha.", price: 25, durationMinutes: 25 },
      { name: "Corte e barba", description: "Os dois cuidados em uma visita, com tempo para cada detalhe.", price: 55, durationMinutes: 55 },
    ],
    professionals: [
      { name: "Rafael", initials: "RA", description: "Cortes na tesoura e acabamentos clássicos." },
      { name: "Diego", initials: "DI", description: "Degradês e desenho de barba." },
    ],
    openingHours: [
      { days: "Segunda a sexta", hours: "09h às 19h" },
      { days: "Sábado", hours: "09h às 17h" },
      { days: "Domingo", hours: "Fechado" },
    ],
  },
}
