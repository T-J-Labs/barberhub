import type { NavigationConfig } from "../types"

export const clientNavigation = {
  primary: [
    { label: "Barbearias", href: "/barbearias" },
    { label: "Meus agendamentos" },
  ],
  secondary: [
    { label: "Ajuda" },
  ],
} satisfies NavigationConfig
