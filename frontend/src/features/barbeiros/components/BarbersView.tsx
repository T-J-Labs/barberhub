"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { FiClock, FiEdit2, FiPlus, FiSearch, FiUsers, FiX } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { weekdays, type Barber, type Weekday } from "../types"

type BarbersViewProps = { initialBarbers: Barber[] }
type StatusFilter = "all" | "active" | "inactive"
type BarberDraft = { name: string; workdays: Weekday[]; startTime: string; endTime: string }

const dayLabels: Record<Weekday, string> = {
  seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb", dom: "Dom",
}
const emptyDraft: BarberDraft = { name: "", workdays: ["seg", "ter", "qua", "qui", "sex"], startTime: "09:00", endTime: "18:00" }
const fieldClass = "min-h-11 w-full rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-[#65d5ff] focus-visible:ring-2 focus-visible:ring-[#65d5ff]/25"

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR")
}

export function BarbersView({ initialBarbers }: BarbersViewProps) {
  const [barbers, setBarbers] = useState(initialBarbers)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [draft, setDraft] = useState<BarberDraft>(emptyDraft)
  const [formError, setFormError] = useState("")
  const [notice, setNotice] = useState("")
  const formTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (isFormOpen) formTitleRef.current?.focus()
  }, [isFormOpen, editingId])

  const activeCount = barbers.filter((barber) => barber.active).length
  const visibleBarbers = barbers.filter((barber) => {
    const matchesQuery = barber.name.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"))
    const matchesStatus = status === "all" || barber.active === (status === "active")
    return matchesQuery && matchesStatus
  })

  function openNewForm() {
    setEditingId(null)
    setDraft({ ...emptyDraft, workdays: [...emptyDraft.workdays] })
    setFormError("")
    setNotice("")
    setIsFormOpen(true)
  }

  function openEditForm(barber: Barber) {
    setEditingId(barber.id)
    setDraft({ name: barber.name, workdays: [...barber.workdays], startTime: barber.startTime, endTime: barber.endTime })
    setFormError("")
    setNotice("")
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setFormError("")
  }

  function toggleWorkday(day: Weekday) {
    setDraft((current) => ({
      ...current,
      workdays: current.workdays.includes(day)
        ? current.workdays.filter((item) => item !== day)
        : weekdays.filter((item) => current.workdays.includes(item) || item === day),
    }))
    setFormError("")
  }

  function saveBarber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    if (draft.workdays.length === 0) {
      setFormError("Selecione ao menos um dia de trabalho.")
      return
    }
    if (draft.endTime <= draft.startTime) {
      setFormError("O horário de saída precisa ser posterior ao de entrada.")
      return
    }

    const schedule = { name, workdays: [...draft.workdays], startTime: draft.startTime, endTime: draft.endTime }
    if (editingId) {
      setBarbers((current) => current.map((barber) => barber.id === editingId ? { ...barber, ...schedule } : barber))
      setNotice(`${name} atualizado nesta demonstração.`)
    } else {
      setBarbers((current) => [...current, { id: crypto.randomUUID(), ...schedule, active: true }])
      setNotice(`${name} adicionado à equipe nesta demonstração.`)
    }
    closeForm()
  }

  function toggleBarber(barber: Barber) {
    setBarbers((current) => current.map((item) => item.id === barber.id ? { ...item, active: !item.active } : item))
    setNotice(`${barber.name} ${barber.active ? "inativado" : "reativado"} nesta demonstração.`)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col gap-6 border-b border-slate-800/90 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Equipe da barbearia</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Barbeiros</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Organize os profissionais e os horários em que cada um atende.</p>
            </div>
            <button type="button" onClick={openNewForm} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] transition-colors hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]">
              <FiPlus size={17} aria-hidden="true" /> Novo barbeiro
            </button>
          </header>

          <div className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-3">
            <Summary label="Na equipe" value={barbers.length} detail="profissionais cadastrados" />
            <Summary label="Ativos" value={activeCount} detail="disponíveis para atendimento" accent />
            <Summary label="Inativos" value={barbers.length - activeCount} detail="mantidos no histórico" />
          </div>

          <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-[#8de1ff]">{notice}</p>

          {isFormOpen && (
            <section aria-labelledby="barber-form-title" className="mt-5 rounded-xl border border-[#65d5ff]/40 bg-[#0b1a29] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#65d5ff]">Equipe</p>
                  <h2 id="barber-form-title" ref={formTitleRef} tabIndex={-1} className="mt-1 text-xl font-semibold outline-none">{editingId ? "Editar barbeiro" : "Novo barbeiro"}</h2>
                  <p className="mt-1 text-sm text-slate-400">Configure a jornada semanal padrão do profissional.</p>
                </div>
                <button type="button" onClick={closeForm} aria-label="Fechar formulário" className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiX size={19} /></button>
              </div>

              <form onSubmit={saveBarber} className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">
                  Nome do profissional
                  <input name="name" className={fieldClass} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength={80} placeholder="Ex.: Rafael Costa" required />
                </label>
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium text-slate-200">Dias de atendimento</legend>
                  <p className="mt-1 text-xs text-slate-400">Escolha os dias da jornada padrão.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {weekdays.map((day) => {
                      const selected = draft.workdays.includes(day)
                      return (
                        <button key={day} type="button" onClick={() => toggleWorkday(day)} aria-pressed={selected} className={`min-h-11 min-w-11 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] ${selected ? "border-[#65d5ff]/50 bg-[#12344a] text-[#8de1ff]" : "border-slate-700 bg-[#07111c] text-slate-400 hover:text-white"}`}>
                          {dayLabels[day]}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Entrada
                  <input name="startTime" type="time" className={fieldClass} value={draft.startTime} onChange={(event) => setDraft({ ...draft, startTime: event.target.value })} required />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Saída
                  <input name="endTime" type="time" className={fieldClass} value={draft.endTime} onChange={(event) => setDraft({ ...draft, endTime: event.target.value })} required />
                </label>
                {formError && <p role="alert" className="text-sm text-amber-200 sm:col-span-2">{formError}</p>}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeForm} className="min-h-11 rounded-lg border border-slate-700 px-5 text-sm font-semibold text-slate-200 hover:border-slate-500 focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Cancelar</button>
                  <button type="submit" className="min-h-11 rounded-lg bg-[#65d5ff] px-5 text-sm font-bold text-[#061522] hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]">{editingId ? "Salvar alterações" : "Adicionar barbeiro"}</button>
                </div>
              </form>
            </section>
          )}

          <section aria-label="Filtrar barbeiros" className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:flex-row sm:p-5">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-slate-400 focus-within:border-[#65d5ff]">
              <FiSearch size={17} aria-hidden="true" />
              <span className="sr-only">Buscar barbeiros</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar profissional" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
            </label>
            <select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className={`${fieldClass} sm:w-48`}>
              <option value="all">Toda a equipe</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </section>

          <div className="mt-8 mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2"><FiUsers className="text-[#65d5ff]" aria-hidden="true" /><h2 className="text-lg font-semibold">Profissionais</h2></div>
              <p className="mt-1 text-sm text-slate-400">{visibleBarbers.length} {visibleBarbers.length === 1 ? "barbeiro encontrado" : "barbeiros encontrados"}</p>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Jornada semanal padrão</p>
          </div>

          {visibleBarbers.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
              <FiUsers className="text-slate-400" size={25} aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{barbers.length === 0 ? "Sua equipe está vazia" : "Nenhum barbeiro encontrado"}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-400">{barbers.length === 0 ? "Adicione o primeiro profissional para organizar os horários da equipe." : "Tente mudar a busca ou o filtro de situação."}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]">
              <div className="hidden grid-cols-[minmax(180px,1fr)_minmax(300px,1.5fr)_110px_180px] gap-5 border-b border-slate-800 bg-[#0d1d2d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 lg:grid">
                <span>Profissional</span><span>Jornada padrão</span><span>Situação</span><span className="text-right">Ações</span>
              </div>
              <ul className="divide-y divide-slate-800/80">
                {visibleBarbers.map((barber) => (
                  <li key={barber.id} className="p-4 transition-colors hover:bg-[#102235] sm:p-5 lg:grid lg:grid-cols-[minmax(180px,1fr)_minmax(300px,1.5fr)_110px_180px] lg:items-center lg:gap-5 lg:px-6 lg:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#12344a] text-xs font-bold text-[#8de1ff]" aria-hidden="true">{initials(barber.name)}</span>
                      <div className="min-w-0"><p className="truncate font-semibold text-white" title={barber.name}>{barber.name}</p><p className="mt-0.5 text-xs text-slate-400">Barbeiro</p></div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <div role="group" className="flex flex-wrap gap-1" aria-label={`Dias: ${barber.workdays.map((day) => dayLabels[day]).join(", ")}`}>
                        {weekdays.map((day) => <span key={day} aria-hidden="true" className={`grid h-7 min-w-7 place-items-center rounded px-1 text-[10px] font-semibold ${barber.workdays.includes(day) ? "bg-[#12344a] text-[#8de1ff]" : "bg-[#07111c] text-slate-400"}`}>{dayLabels[day]}</span>)}
                      </div>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs tabular-nums text-slate-400"><FiClock className="text-[#65d5ff]" aria-hidden="true" />{barber.startTime}–{barber.endTime}</p>
                    </div>
                    <span className={`mt-4 inline-block w-fit rounded-md border px-2 py-1 text-xs font-semibold lg:mt-0 ${barber.active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-slate-600 bg-slate-700/30 text-slate-400"}`}>
                      {barber.active ? "Ativo" : "Inativo"}
                    </span>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 lg:mt-0 lg:justify-end lg:border-0 lg:pt-0">
                      <button type="button" onClick={() => openEditForm(barber)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#8de1ff] hover:bg-[#12344a] focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiEdit2 size={14} aria-hidden="true" /> Editar</button>
                      <button type="button" onClick={() => toggleBarber(barber)} aria-label={`${barber.active ? "Inativar" : "Reativar"} ${barber.name}`} className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]">{barber.active ? "Inativar" : "Reativar"}</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-xs text-slate-400">Alterações feitas nesta tela são demonstrativas e serão perdidas ao recarregar a página.</p>
        </div>
      </Container>
    </div>
  )
}

function Summary({ label, value, detail, accent = false }: { label: string; value: number; detail: string; accent?: boolean }) {
  return (
    <div className="border-b border-slate-800 p-5 last:border-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${accent ? "text-[#8de1ff]" : "text-white"}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  )
}
