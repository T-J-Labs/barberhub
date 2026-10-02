import type { BarbershopPresentation } from "./types"

/** Estabelecimentos fictícios: nenhuma informação aqui vem do backend. */
export const barbershopsMock: readonly BarbershopPresentation[] = [
  { id: "demo-esquina", subdomain: "demo-esquina", name: "Barbearia da Esquina", city: "Rio de Janeiro", neighborhood: "Madureira", initials: "BE" },
  { id: "demo-navalha", subdomain: "demo-navalha", name: "Navalha & Pente", city: "Rio de Janeiro", neighborhood: "Méier", initials: "NP" },
  { id: "demo-vila", subdomain: "demo-vila", name: "Barbearia Vila Nova", city: "Nova Iguaçu", neighborhood: "Centro", initials: "VN" },
  { id: "demo-oficina", subdomain: "demo-oficina", name: "Oficina do Corte", city: "Duque de Caxias", neighborhood: "Jardim 25 de Agosto", initials: "OC" },
  { id: "demo-raizes", subdomain: "demo-raizes", name: "Raízes Barbearia", city: "Nova Iguaçu", neighborhood: "Posse", initials: "RB" },
  { id: "demo-bairro", subdomain: "demo-bairro", name: "Barbearia do Bairro", city: "Rio de Janeiro", neighborhood: "Bangu", initials: "BB" },
]
