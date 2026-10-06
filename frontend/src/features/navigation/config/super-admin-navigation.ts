import type { NavigationConfig } from "../types"

export const superAdminNavigation = {
  primary: [
    { label: "Início", href: "/super-admin" },
    { label: "Barbearias", href: "/super-admin/barbearias" },
    { label: "Planos e assinaturas" },
  ],
  secondary: [
    { label: "Ajuda", href: "/super-admin/ajuda" },
  ],
} satisfies NavigationConfig
