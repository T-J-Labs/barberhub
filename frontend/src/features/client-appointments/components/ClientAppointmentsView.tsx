"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { appointmentBarbershopFilter, appointmentFiltersHref } from "../filters"
import { catalogActionClass, catalogFieldClass, catalogFocusClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { demoReferenceDate } from "../demo-data"
import { appointmentDate, appointmentTime, appointmentStatusLabel, cancelDemoAppointment, partitionAppointments } from "../presentation"
import type { DemoAppointment, DemoAppointmentsScenario } from "../types"
import { AppointmentCard } from "./AppointmentCard"
import { AppointmentsState } from "./AppointmentsState"

// Intenção: cliente no celular conferindo suas visitas. Próximas lideram, histórico recua;
// sem KPIs. Paleta da conta/sky, profundidade por bordas, superfícies do catálogo, Geist
// 30/20/14px, espaçamento 4px e grupos separados por 32px tornam a agenda escaneável.
export function ClientAppointmentsView({ initialItems, bookingLinks, allowScenarios }: {
  initialItems: readonly DemoAppointment[]
  bookingLinks: Record<string, string | null>
  allowScenarios: boolean
}) {
  const [items, setItems] = useState(initialItems)
  const searchParams = useSearchParams()
  const query = searchParams.getAll("q").length === 1 ? searchParams.get("q") ?? "" : ""
  const barbershops = searchParams.getAll("barbearia")
  const filter = appointmentBarbershopFilter(barbershops)
  function setQuery(value: string) {
    window.history.replaceState(null, "", appointmentFiltersHref(window.location.search, { q: value }))
  }
  function clearBarbershop() {
    window.history.pushState(null, "", appointmentFiltersHref(window.location.search, { removeBarbershop: true }))
    searchRef.current?.focus()
  }
  const [scenario, setScenario] = useState<DemoAppointmentsScenario>("normal")
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [confirmCancellation, setConfirmCancellation] = useState(false)
  const [message, setMessage] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const selected = items.find((item) => item.key === selectedKey)
  const visibleItems = scenario === "empty" ? [] : items
  const { upcoming, history } = partitionAppointments(visibleItems, demoReferenceDate, query, barbershops)
  function close() { setSelectedKey(null); setConfirmCancellation(false) }
  function reset() { setItems(initialItems); setQuery(""); setScenario("normal"); close(); setMessage("Exemplos restaurados. Nenhuma reserva real foi alterada.") }
  return <div>
    <aside aria-label="Limites da demonstração" className={`${catalogPanelClass} p-5 text-sm leading-6 text-slate-300`}>
      <p className="font-semibold text-sky-300">Demonstração local · cliente fictício</p>
      <p className="mt-2">Estas reservas são exemplos, sem conta autenticada. A amostra usa 5 de outubro de 2026 como referência. Alterações ficam apenas nesta página e desaparecem ao recarregar.</p>
      <p className="mt-2 text-slate-400">Cancelamento e reagendamento reais aguardam integração e regras do backend. O wizard tem dados independentes e não adiciona nem atualiza itens nesta lista.</p>
    </aside>
    <Link href="/cliente/barbearias" className={`mt-4 inline-flex min-h-11 items-center rounded-md text-sm text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>Minhas barbearias</Link>
    {filter.kind !== "all" && <section aria-label="Filtro de barbearia" className={`${catalogPanelClass} mt-4 p-5`}>
      {filter.kind === "invalid" ? <p role="alert" className="text-sm leading-6 text-slate-300">{filter.message} Nenhuma barbearia foi selecionada e os exemplos aguardam a correção do filtro.</p> : <p role="status" className="text-sm leading-6 text-slate-300">Barbearia selecionada: <strong className="text-white">{filter.shop.name}</strong></p>}
      <button type="button" onClick={clearBarbershop} className={`mt-3 ${catalogSecondaryActionClass}`}>Remover filtro de barbearia</button>
    </section>}
    {allowScenarios && <details className="mt-4 text-sm text-slate-300">
      <summary className={`flex min-h-11 w-fit cursor-pointer items-center rounded-md ${catalogFocusClass}`}>Cenários de demonstração (desenvolvimento)</summary>
      <div className="mt-2 flex flex-wrap gap-2">{([['normal', 'Lista completa'], ['empty', 'Lista vazia'], ['loading', 'Carregamento'], ['error', 'Falha ao carregar']] as const).map(([key, label]) => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); close(); setMessage("") }} className={catalogSecondaryActionClass}>{label}</button>)}</div>
    </details>}
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <div className="min-w-0 basis-full sm:flex-1 sm:basis-0"><label htmlFor="appointment-search" className="mb-2 block text-sm font-medium">Buscar nos exemplos</label><input ref={searchRef} id="appointment-search" value={query} onChange={(event) => { setQuery(event.target.value); setMessage("") }} type="search" placeholder="Barbearia, serviço ou profissional" className={catalogFieldClass} /></div>
      {query && <button type="button" onClick={() => { setQuery(""); searchRef.current?.focus() }} className={catalogSecondaryActionClass}>Limpar busca</button>}
      <button type="button" onClick={reset} className={catalogSecondaryActionClass}>Restaurar exemplos</button>
    </div>
    <p role="status" aria-live="polite" className="mt-3 text-sm leading-6 text-slate-300">{message || (scenario === "normal" ? `${upcoming.length} próximos e ${history.length} no histórico de exemplo.` : "Cenário demonstrativo selecionado.")}</p>
    <div className="mt-6">
      {scenario === "loading" || scenario === "error" ? <><AppointmentsState kind={scenario} /><button type="button" onClick={() => setScenario("normal")} className={`mt-4 ${catalogSecondaryActionClass}`}>{scenario === "error" ? "Tentar carregar exemplos novamente" : "Concluir carregamento demonstrativo"}</button></>
        : filter.kind === "invalid" ? null
        : !visibleItems.length ? <AppointmentsState kind="empty" />
        : !upcoming.length && !history.length ? <AppointmentsState kind="no-results" />
        : <div className="space-y-8">
          {([['Próximas reservas', upcoming, true], ['Histórico', history, false]] as const).map(([title, list, isUpcoming]) => <section key={title} aria-labelledby={isUpcoming ? "upcoming-title" : "history-title"}>
            <h2 id={isUpcoming ? "upcoming-title" : "history-title"} className="mb-4 text-xl font-semibold tracking-tight">{title}{" "}<span className="ml-3 text-sm font-normal tabular-nums text-slate-400">{list.length} {list.length === 1 ? "exemplo" : "exemplos"}</span></h2>
            {list.length ? <ul className={`grid gap-4 ${isUpcoming ? "lg:grid-cols-2" : ""}`}>{list.map((item) => <li key={item.key}><AppointmentCard item={item} upcoming={isUpcoming} onDetails={() => { setSelectedKey(item.key); setConfirmCancellation(false) }} /></li>)}</ul> : <p className="text-sm leading-6 text-slate-400">{isUpcoming ? "Nenhuma próxima reserva de exemplo neste recorte." : "Nenhum histórico de exemplo neste recorte."}</p>}
          </section>)}
        </div>}
    </div>
    <DemoDialog open={Boolean(selected)} onClose={close} title={confirmCancellation ? "Simular cancelamento do exemplo?" : "Detalhes do agendamento de exemplo"} description="Demonstração local. Nenhuma reserva real será alterada." tone="public">
      {selected && <>
        <h3 className="text-lg font-semibold">{selected.barbershop.name}</h3>
        <p className="mt-1 text-sm break-words text-slate-400">{selected.barbershop.subdomain} · {selected.barbershop.location ?? "Localização não informada"}</p>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">{[
          ["Data e horário de exemplo", `${appointmentDate(selected.startsAt)} às ${appointmentTime(selected.startsAt)} (Brasília)`],
          ["Serviço", selected.service], ["Profissional", selected.professional ?? "Não informado"],
          ["Valor de exemplo", selected.price === undefined ? "Não informado" : selected.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
          ["Duração de exemplo", selected.durationMinutes === undefined ? "Não informada" : `${selected.durationMinutes} min`],
          ["Situação", appointmentStatusLabel[selected.status]],
        ].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 leading-6 font-medium text-slate-200">{value}</dd></div>)}</dl>
        {confirmCancellation ? <div className="mt-6">
          <p className="text-sm leading-6 text-slate-300">Somente este exemplo passará ao histórico como cancelado nesta página. Não há prazo ou regra real de cancelamento definidos. Recarregar restaura a amostra.</p>
          <div className="mt-4 flex flex-wrap gap-3"><button type="button" className={catalogActionClass} onClick={() => { setItems(cancelDemoAppointment(items, selected.key)); setMessage("Cancelamento demonstrativo aplicado à amostra em memória. Nenhuma reserva real foi alterada."); close(); requestAnimationFrame(() => searchRef.current?.focus()) }}>Aplicar à amostra</button><button type="button" className={catalogSecondaryActionClass} onClick={() => setConfirmCancellation(false)}>Voltar aos detalhes</button></div>
        </div> : selected.status === "scheduled" && <div className="mt-6 border-t border-[#26384A] pt-5">
          <p className="text-sm leading-6 text-slate-300">A prévia abre o fluxo demonstrativo da mesma barbearia, desde o início. Nenhuma reserva será reagendada e esta lista não será atualizada.</p>
          <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => setConfirmCancellation(true)} className={catalogSecondaryActionClass}>Simular cancelamento</button>{bookingLinks[selected.barbershop.subdomain] ? <a href={bookingLinks[selected.barbershop.subdomain]!} className={catalogActionClass}>Ver prévia de reagendamento</a> : <p className="text-sm text-slate-400">Prévia de reagendamento indisponível neste domínio.</p>}</div>
        </div>}
      </>}
    </DemoDialog>
  </div>
}
