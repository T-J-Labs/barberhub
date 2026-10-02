import Form from "next/form"
import Link from "next/link"
import { FiChevronDown, FiSearch } from "react-icons/fi"
import { getCatalogPresentation } from "../catalog-presentation"
import { catalogActionClass, catalogFieldClass, catalogFocusClass, catalogPanelClass } from "../styles"
import type { CatalogFilters } from "../types"
import { BarbershopCard } from "./BarbershopCard"
import { CatalogShell } from "./CatalogShell"
import { CatalogState } from "./CatalogState"

export function CatalogView({ filters, demoState, publicOrigin }: { filters: CatalogFilters; demoState?: string; publicOrigin?: string }) {
  const catalog = getCatalogPresentation(filters, demoState === "empty")
  const filtered = Boolean(filters.query || filters.city)
  const unsettled = demoState === "loading" || demoState === "error"

  return (
    <CatalogShell>
      <Form action="/barbearias" role="search" aria-label="Buscar barbearias" className={`${catalogPanelClass} mt-8 grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px_auto] lg:items-end`}>
        <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-200">
          Nome, cidade ou bairro
          <input key={filters.query} type="search" name="q" defaultValue={filters.query} maxLength={120} placeholder="Ex.: Méier ou Barbearia da Esquina" className={catalogFieldClass} />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-200">
          Cidade
          <span className="relative block">
            <select key={filters.city} name="cidade" defaultValue={filters.city} className={`${catalogFieldClass} appearance-none pr-12 forced-colors:appearance-auto`}>
              <option value="">Todas as cidades</option>
              {filters.city && !catalog.cities.includes(filters.city) && <option value={filters.city}>{filters.city}</option>}
              {catalog.cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <FiChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 forced-colors:hidden" />
          </span>
        </label>
        <button type="submit" className={`${catalogActionClass} min-h-12`}><FiSearch size={18} aria-hidden="true" />Buscar barbearias</button>
      </Form>

      <section aria-labelledby="catalog-results-title" className="mt-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 break-words">
            <h2 id="catalog-results-title" className="text-xl font-semibold sm:text-2xl">{filtered ? "Resultado da busca" : "Barbearias para conhecer"}</h2>
            {!unsettled && <p role="status" className="mt-1 text-sm text-slate-400"><span className="tabular-nums">{catalog.shops.length}</span> {catalog.shops.length === 1 ? "barbearia encontrada" : "barbearias encontradas"}{filters.query && ` para “${filters.query}”`}{filters.city && ` em ${filters.city}`}</p>}
          </div>
          {filtered && <Link href="/barbearias" className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-sky-300 hover:bg-sky-500/10 ${catalogFocusClass}`}>Limpar filtros</Link>}
        </div>
        {demoState === "loading" || demoState === "error"
          ? <CatalogState kind={demoState} />
          : catalog.shops.length === 0
            ? <CatalogState kind={catalog.total === 0 ? "empty" : "no-results"} />
            : <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{catalog.shops.map((shop) => <BarbershopCard key={shop.id} shop={shop} publicOrigin={publicOrigin} />)}</ul>}
      </section>
    </CatalogShell>
  )
}
