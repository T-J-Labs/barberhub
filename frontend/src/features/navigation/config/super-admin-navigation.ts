import type { NavigationConfig } from "../types"

export const superAdminNavigation = {
  primary: [
    { label: "Início" },
    { label: "Barbearias" },
    { label: "Planos e assinaturas" },
  ],
  secondary: [
    { label: "Ajuda" },
  ],
} satisfies NavigationConfig
