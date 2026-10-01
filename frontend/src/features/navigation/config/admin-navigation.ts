import type { NavigationConfig } from "../types"

export const adminNavigation = {
  primary: [
    { label: "Início", href: "/admin" },
    { label: "Agenda", href: "/admin/agenda" },
    { label: "Clientes", href: "/admin/clientes" },
    { label: "Serviços", href: "/admin/servicos" },
    { label: "Barbeiros", href: "/admin/barbeiros" },
    { label: "Relatórios", href: "/admin/relatorios" },
  ],
  secondary: [
    { label: "Configurações da barbearia", href: "/admin/configuracoes" },
    { label: "Ajuda", href: "/admin/ajuda" },
  ],
} satisfies NavigationConfig
