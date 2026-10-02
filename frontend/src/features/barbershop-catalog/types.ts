/** Modelo exclusivamente de apresentação. Não representa um DTO da API. */
export type BarbershopPresentation = {
  id: string
  /** Identificador público demonstrativo, compatível com um subdomínio. */
  subdomain: string
  name: string
  city: string
  neighborhood: string
  initials: string
}

export type CatalogFilters = { query: string; city: string }
