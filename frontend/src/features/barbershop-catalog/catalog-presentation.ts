import { barbershopsMock } from "./mock-data"
import type { CatalogFilters } from "./types"

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim()
}

/**
 * Ponto de integração pendente: substituir a fonte local somente após aprovação
 * dos dados públicos, busca e paginação no OpenAPI e geração do cliente Orval.
 * Não faz requisições HTTP nem resolve tenant ou permissões.
 */
export function getCatalogPresentation(filters: CatalogFilters, empty = false) {
  const shops = empty ? [] : barbershopsMock
  const query = normalize(filters.query)
  return {
    total: shops.length,
    cities: [...new Set(shops.map((shop) => shop.city))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    shops: shops.filter((shop) => (
      (!filters.city || shop.city === filters.city)
      && normalize(`${shop.name} ${shop.city} ${shop.neighborhood}`).includes(query)
    )),
  }
}
