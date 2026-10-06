"use client"
import { useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { detailsHref, filterShops, listHref } from "../presentation"
import { actionClass, focusClass, inputClass, panelClass } from "../styles"
import { useSuperadminDemo } from "./SuperadminProvider"
import { ShopStatus } from "./ShopStatus"
import { SuperadminState } from "./SuperadminState"
import { ManualRegistrationForm } from "./ManualRegistrationForm"

// Intenção: encontrar uma barbearia pelo nome/localização. Lista lidera com nomes
// 16px/600, subdomínio/localização em 14px de apoio. Busca recuada, bordas sutis,
// superfícies privadas, Geist, ritmo 4px e linhas 16px; mobile sem tabela rolável.
export function SuperadminList({ query }: { query: string }) {
  const { shops, scenario, setScenario } = useSuperadminDemo()
  const [draft, setDraft] = useState(query)
  const [formOpen, setFormOpen] = useState(false)
  const createTriggerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const filtered = filterShops(shops, query)
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); router.push(listHref(draft.trim())) }
  return <div className="space-y-6">
    <button ref={createTriggerRef} type="button" onClick={() => setFormOpen(true)} aria-expanded={formOpen} aria-controls="manual-registration" disabled={scenario !== "ready"} className={`${actionClass} disabled:opacity-60`}>Cadastrar barbearia</button>
    {formOpen && <div id="manual-registration"><ManualRegistrationForm query={query} onCancel={() => { setFormOpen(false); createTriggerRef.current?.focus() }} /></div>}
    <form onSubmit={search} role="search" className={`${panelClass} p-5`}>
      <label htmlFor="shop-search" className="block text-sm font-medium">Buscar barbearia</label>
      <p id="search-help" className="mt-1 text-sm text-slate-400">Nome, cidade ou bairro da amostra.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input id="shop-search" name="q" type="search" maxLength={120} aria-describedby="search-help" value={draft} onChange={event => setDraft(event.target.value)} className={inputClass} />
        <button className={actionClass} type="submit">Buscar</button>
        {query && <Link href={listHref("")} className={`${actionClass} shrink-0`}>Limpar busca</Link>}
      </div>
    </form>
    {scenario === "loading" || scenario === "error" ? <SuperadminState kind={scenario} onRetry={scenario === "error" ? () => setScenario("ready") : undefined} /> : shops.length === 0 ? <SuperadminState kind="empty" /> : <section aria-labelledby="list-title" className={panelClass}>
      <div className="p-5"><h2 id="list-title" className="text-lg font-semibold">Estabelecimentos</h2>
        <p role="status" className="mt-1 text-sm text-slate-400 [overflow-wrap:anywhere]">{filtered.length} de {shops.length} barbearias da amostra{query ? ` · Busca: “${query}”` : ""}</p>
      </div>
      {filtered.length === 0 ? <div className="border-t border-slate-800 p-5"><h3 className="font-semibold">Nenhum resultado para esta busca</h3><p className="mt-2 text-sm text-slate-400">Tente outro nome, cidade ou bairro, ou limpe a busca.</p></div> : <ul className="divide-y divide-slate-800">
        {filtered.map(shop => <li key={shop.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 [overflow-wrap:anywhere]"><h3 className="font-semibold">{shop.name}</h3><p className="mt-1 text-sm text-slate-400">{shop.neighborhood} · {shop.city}</p><p className="mt-1 break-all text-sm text-slate-400">{shop.subdomain}</p></div>
          <div className="flex shrink-0 flex-wrap items-center gap-4"><ShopStatus status={shop.demoStatus} /><Link href={detailsHref(shop.id, query)} aria-label={`Ver detalhes de ${shop.name}`} className={`inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-[#8de1ff] underline underline-offset-4 ${focusClass}`}>Ver detalhes</Link></div>
        </li>)}
      </ul>}
    </section>}
  </div>
}
