import { PublicNavigationItem } from "../types";

export const publicNavigation = [
    { label: "Início", href:"/#inicio" },
    { label: "Produto", href:"/#produto" },
    { label: "Serviços", href:"/#servicos" },
    { label: "Preço", href:"/#preco" },
    { label: "Contato", href:"/#contato" }
] satisfies readonly PublicNavigationItem[]

export const institutionalNavigation = [
    { label: "Produto", href: "/#produto" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Preço", href: "/#preco" },
    { label: "Dúvidas", href: "/#duvidas" }
] satisfies readonly PublicNavigationItem[]
