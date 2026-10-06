import type { NavigationConfig } from "../types"

export const barberNavigation = {
  primary: [
    { label: "Início", href: "/barbeiro" },
    { label: "Minha agenda", href: "/barbeiro/agenda" },
    { label: "Histórico", href: "/barbeiro/historico" },
  ],
  secondary: [
    { label: "Perfil", href: "/barbeiro/perfil" },
    { label: "Ajuda", href: "/barbeiro/ajuda" },
  ],
} satisfies NavigationConfig
