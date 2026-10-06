import { days, type DemoOrigin, type OnboardingData, type Schedule } from "./types"

export const originLabels = { cadastro: "Cadastro com perfil Barbearia", superadmin: "Demonstração de convite do superadmin" } as const
export const fictionalOwner = "Marina Exemplo"
function schedule(start: string, end: string): Schedule {
  return Object.fromEntries(days.map(day => [day, { enabled: day === "seg", start, end }])) as Schedule
}
/** Nova cópia por início/reinício; nenhum dado do cadastro ou rascunho é recebido. */
export function createExample(origin: DemoOrigin): OnboardingData {
  return {
    name: origin === "cadastro" ? "Barbearia Horizonte — exemplo" : "Barbearia Pátio — exemplo",
    address: "Rua Fictícia, 100", city: "Rio de Janeiro", neighborhood: origin === "cadastro" ? "Vila Exemplo" : "Bairro Modelo",
    subdomain: origin === "cadastro" ? "exemplo-horizonte" : "exemplo-patio",
    serviceName: "Corte de exemplo", duration: "30", price: "40.00", serviceActive: true,
    professionalName: origin === "cadastro" ? "Alex Exemplo" : "Rafa Modelo", associatedService: "Corte de exemplo",
    opening: schedule("09:00", "18:00"), availability: schedule("10:00", "17:00"),
  }
}
