// Modelos de apresentação local; não são DTOs, identidade ou tenant.
export type DemoOrigin = "cadastro" | "superadmin"
export type Step = 0 | 1 | 2 | 3 | 4 | 5
export type ReleaseScenario = "pending" | "purchase" | "explicit"
export const days = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const
export type Day = typeof days[number]
export type Interval = { enabled: boolean; start: string; end: string }
export type Schedule = Record<Day, Interval>
export type OnboardingData = {
  name: string; address: string; city: string; neighborhood: string; subdomain: string
  serviceName: string; duration: string; price: string; serviceActive: boolean
  professionalName: string; associatedService: string
  opening: Schedule; availability: Schedule
}
export type Issue = { field: string; step: Step; message: string }
export const stepNames = ["Estabelecimento", "Endereço público", "Serviço inicial", "Profissional inicial", "Funcionamento", "Revisão"] as const
export const dayNames: Record<Day, string> = { seg: "Segunda-feira", ter: "Terça-feira", qua: "Quarta-feira", qui: "Quinta-feira", sex: "Sexta-feira", sab: "Sábado", dom: "Domingo" }
