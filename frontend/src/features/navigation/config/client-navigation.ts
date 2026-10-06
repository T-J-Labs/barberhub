import type { NavigationConfig } from "../types"

export const clientNavigation = {
  primary: [
    { label: "Barbearias", href: "/barbearias" },
    { label: "Meus agendamentos", href: "/cliente/agendamentos" },
  ],
  secondary: [
    { label: "Perfil", href: "/cliente/perfil" },
    { label: "Ajuda", href: "/cliente/ajuda" },
  ],
} satisfies NavigationConfig
