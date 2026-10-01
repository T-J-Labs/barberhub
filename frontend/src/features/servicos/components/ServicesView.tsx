"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { FiClock, FiEdit2, FiPlus, FiSearch, FiScissors, FiX } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import type { Service } from "../types"

type ServicesViewProps = { initialServices: Service[] }
type StatusFilter = "all" | "active" | "inactive"
type ServiceDraft = {
  name: string
  description: string
  price: string
  durationMinutes: string
}

const emptyDraft: ServiceDraft = { name: "", description: "", price: "", durationMinutes: "" }
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fieldClass = "min-h-11 w-full rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#65d5ff] focus-visible:ring-2 focus-visible:ring-[#65d5ff]/25"

export function ServicesView({ initialServices }: ServicesViewProps) {
  const [services, setServices] = useState(initialServices)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [draft, setDraft] = useState<ServiceDraft>(emptyDraft)
  const [notice, setNotice] = useState("")
  const formTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (isFormOpen) formTitleRef.current?.focus()
  }, [isFormOpen, editingId])

  const activeCount = services.filter((service) => service.active).length
  const inactiveCount = services.length - activeCount
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR")
  const visibleServices = services.filter((service) => {
    const matchesQuery = `${service.name} ${service.description}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
    const matchesStatus = status === "all" || service.active === (status === "active")
    return matchesQuery && matchesStatus
  })

  function openNewForm() {
    setEditingId(null)
    setDraft(emptyDraft)
    setNotice("")
    setIsFormOpen(true)
  }

  function openEditForm(service: Service) {
    setEditingId(service.id)
    setDraft({
      name: service.name,
      description: service.description,
      price: String(service.price),
      durationMinutes: String(service.durationMinutes),
    })
    setNotice("")
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setDraft(emptyDraft)
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    const description = draft.description.trim()
    const price = Number(draft.price)
    const durationMinutes = Number(draft.durationMinutes)

    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(durationMinutes) || durationMinutes < 1) return

    if (editingId) {
      setServices((current) => current.map((service) => service.id === editingId
        ? { ...service, name, description, price, durationMinutes }
        : service,
      ))
      setNotice(`Serviço “${name}” atualizado nesta demonstração.`)
    } else {
      setServices((current) => [
        ...current,
        { id: crypto.randomUUID(), name, description, price, durationMinutes, active: true },
      ])
      setNotice(`Serviço “${name}” adicionado nesta demonstração.`)
    }
    closeForm()
  }

  function toggleService(service: Service) {
    setServices((current) => current.map((item) => item.id === service.id
      ? { ...item, active: !item.active }
      : item,
    ))
    setNotice(`${service.name} ${service.active ? "inativado" : "reativado"} nesta demonstração.`)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col gap-6 border-b border-slate-800/90 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Catálogo da barbearia</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Serviços</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Defina o que sua equipe oferece, quanto custa e quanto tempo ocupa na agenda.</p>
            </div>
            <button type="button" onClick={openNewForm} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] transition-colors hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]">
              <FiPlus size={17} aria-hidden="true" /> Novo serviço
            </button>
          </header>

          <div className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-3">
            <Summary label="No catálogo" value={services.length} detail="serviços cadastrados" />
            <Summary label="Disponíveis" value={activeCount} detail="visíveis para agendamento" accent />
            <Summary label="Inativos" value={inactiveCount} detail="preservados no histórico" />
          </div>

          <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-[#8de1ff]">{notice}</p>

          {isFormOpen && (
            <section aria-labelledby="service-form-title" className="mt-5 rounded-xl border border-[#65d5ff]/40 bg-[#0b1a29] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#65d5ff]">Catálogo</p>
                  <h2 id="service-form-title" ref={formTitleRef} tabIndex={-1} className="mt-1 text-xl font-semibold outline-none">{editingId ? "Editar serviço" : "Novo serviço"}</h2>
                  <p className="mt-1 text-sm text-slate-400">Preço e duração aparecem na escolha do horário.</p>
                </div>
                <button type="button" onClick={closeForm} aria-label="Fechar formulário" className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiX size={19} /></button>
              </div>

              <form onSubmit={saveService} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">
                  Nome do serviço
                  <input className={fieldClass} name="name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength={80} placeholder="Ex.: Corte tradicional" required />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">
                  Descrição <span className="font-normal text-slate-500">(opcional)</span>
                  <textarea className={`${fieldClass} min-h-24 resize-y py-3`} name="description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength={240} placeholder="O que está incluído?" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Preço (R$)
                  <input className={fieldClass} name="price" type="number" inputMode="decimal" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="45,00" required />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Duração (minutos)
                  <input className={fieldClass} name="duration" type="number" inputMode="numeric" min="1" step="1" value={draft.durationMinutes} onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })} placeholder="30" required />
                </label>
                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeForm} className="min-h-11 rounded-lg border border-slate-700 px-5 text-sm font-semibold text-slate-200 hover:border-slate-500 focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Cancelar</button>
                  <button type="submit" className="min-h-11 rounded-lg bg-[#65d5ff] px-5 text-sm font-bold text-[#061522] hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]">{editingId ? "Salvar alterações" : "Adicionar serviço"}</button>
                </div>
              </form>
            </section>
          )}

          <section aria-label="Filtrar serviços" className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:flex-row sm:p-5">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-slate-400 focus-within:border-[#65d5ff]">
              <FiSearch size={17} aria-hidden="true" />
              <span className="sr-only">Buscar serviços</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar serviço" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
            </label>
            <select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className={`${fieldClass} sm:w-48`}>
              <option value="all">Todos os serviços</option>
              <option value="active">Disponíveis</option>
              <option value="inactive">Inativos</option>
            </select>
          </section>

          <div className="mt-8 mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2"><FiScissors className="text-[#65d5ff]" aria-hidden="true" /><h2 className="text-lg font-semibold">Catálogo</h2></div>
              <p className="mt-1 text-sm text-slate-400">{visibleServices.length} {visibleServices.length === 1 ? "serviço encontrado" : "serviços encontrados"}</p>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">Preço e duração por atendimento</p>
          </div>

          {visibleServices.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
              <FiScissors className="text-slate-500" size={25} aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{services.length === 0 ? "Seu catálogo está vazio" : "Nenhum serviço encontrado"}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-400">{services.length === 0 ? "Adicione o primeiro serviço para começar a organizar a agenda." : "Tente mudar a busca ou o filtro de situação."}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]">
              <div className="hidden grid-cols-[minmax(0,1fr)_130px_110px_110px_180px] gap-5 border-b border-slate-800 bg-[#0d1d2d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid">
                <span>Serviço</span><span>Duração</span><span>Preço</span><span>Situação</span><span className="text-right">Ações</span>
              </div>
              <ul className="divide-y divide-slate-800/80">
                {visibleServices.map((service) => (
                  <li key={service.id} className="p-4 transition-colors hover:bg-[#102235] sm:p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_130px_110px_110px_180px] lg:items-center lg:gap-5 lg:px-6 lg:py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-400">{service.description || "Sem descrição"}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 lg:mt-0 lg:contents">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-300"><FiClock className="text-[#65d5ff]" size={15} aria-hidden="true" />{service.durationMinutes} min</span>
                      <span className="text-sm font-semibold tabular-nums text-white">{currency.format(service.price)}</span>
                      <span className={`w-fit rounded-md border px-2 py-1 text-xs font-semibold ${service.active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-slate-600 bg-slate-700/30 text-slate-400"}`}>
                        {service.active ? "Disponível" : "Inativo"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 lg:mt-0 lg:justify-end lg:border-0 lg:pt-0">
                      <button type="button" onClick={() => openEditForm(service)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#8de1ff] hover:bg-[#12344a] focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiEdit2 size={14} aria-hidden="true" /> Editar</button>
                      <button type="button" onClick={() => toggleService(service)} aria-label={`${service.active ? "Inativar" : "Reativar"} ${service.name}`} className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]">{service.active ? "Inativar" : "Reativar"}</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-xs text-slate-500">Alterações feitas nesta tela são demonstrativas e serão perdidas ao recarregar a página.</p>
        </div>
      </Container>
    </div>
  )
}

function Summary({ label, value, detail, accent = false }: { label: string; value: number; detail: string; accent?: boolean }) {
  return (
    <div className="border-b border-slate-800 p-5 last:border-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${accent ? "text-[#8de1ff]" : "text-white"}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  )
}
