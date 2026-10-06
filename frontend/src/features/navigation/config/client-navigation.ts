import type { NavigationConfig } from "../types"

export const clientNavigation = {
  primary: [
    { label: "Explorar barbearias", href: "/barbearias" },
    { label: "Minhas barbearias", href: "/cliente/barbearias" },
    { label: "Meus agendamentos", href: "/cliente/agendamentos" },
  ],
  secondary: [
    { label: "Perfil", href: "/cliente/perfil" },
    { label: "Ajuda", href: "/cliente/ajuda" },
  ],
} satisfies NavigationConfig
