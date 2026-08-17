import type { NavigationConfig } from "../types"

export const adminNavigation = {
  primary: [
    { label: "Início" },
    { label: "Agenda" },
    { label: "Clientes" },
    { label: "Serviços" },
    { label: "Barbeiros" },
    { label: "Relatórios" },
  ],
  secondary: [
    { label: "Configurações da barbearia" },
    { label: "Ajuda" },
  ],
} satisfies NavigationConfig
