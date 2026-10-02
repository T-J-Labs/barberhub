/** Modelo exclusivamente de apresentação. Não representa um DTO da API. */
export type BarbershopPresentation = {
  id: string
  name: string
  city: string
  neighborhood: string
  initials: string
}

export type CatalogFilters = { query: string; city: string }
