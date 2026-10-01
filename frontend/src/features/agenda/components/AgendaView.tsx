"use client"

import { useMemo, useState, type FormEvent } from "react"
import {
  FiActivity,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMoreHorizontal,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { AgendaState } from "./AgendaState"
import type { AgendaAppointment, AgendaData, AgendaStatus } from "../types"

type AgendaViewProps = { data: AgendaData; initialRegisterOpen?: boolean }
type StatusFilter = "Todos os status" | AgendaStatus
type AppointmentDraft = { client: string; phone: string; service: string; barber: string; time: string; endTime: string }

const statusOptions: StatusFilter[] = ["Todos os status", "Confirmado", "Aguardando", "Concluído", "Cancelado", "Falta"]
const emptyDraft: AppointmentDraft = { client: "", phone: "", service: "", barber: "", time: "09:00", endTime: "09:30" }
const fieldClass = "min-h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-white outline-none focus:border-[#65d5ff] focus-visible:ring-2 focus-visible:ring-[#65d5ff]/25"

function statusClass(status: AgendaStatus) {
  if (status === "Concluído") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
  if (status === "Aguardando") return "border-amber-300/40 bg-amber-300/10 text-amber-200"
  if (status === "Cancelado") return "border-red-400/40 bg-red-400/10 text-red-300"
  if (status === "Falta") return "border-amber-300/40 bg-amber-300/10 text-amber-200"
  return "border-[#65d5ff]/40 bg-[#65d5ff]/10 text-[#8de1ff]"
}

function Contact({ phone }: { phone: string }) {
  return <a href={`tel:${phone}`} className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-slate-500 hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} /> <span className="truncate">{phone}</span></a>
}

export function AgendaView({ data, initialRegisterOpen = false }: AgendaViewProps) {
  const [days, setDays] = useState(data.days)
  const [dayIndex, setDayIndex] = useState(0)
  const [barber, setBarber] = useState(data.barbers[0])
  const [service, setService] = useState(data.services[0])
  const [status, setStatus] = useState<StatusFilter>(statusOptions[0])
  const [mode, setMode] = useState<"ready" | "loading" | "error">("ready")
  const [registerOpen, setRegisterOpen] = useState(initialRegisterOpen)
  const [draft, setDraft] = useState<AppointmentDraft>(emptyDraft)
  const [registerError, setRegisterError] = useState("")
  const [notice, setNotice] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedDay = days[dayIndex]
  const selectedAppointment = days.flatMap((day) => day.appointments).find((appointment) => appointment.id === selectedId)

  const appointments = useMemo(
    () => selectedDay.appointments.filter((appointment) => (
      (barber === data.barbers[0] || appointment.barber === barber) &&
      (service === data.services[0] || appointment.service === service) &&
      (status === statusOptions[0] || appointment.status === status)
    )).sort((a, b) => a.time.localeCompare(b.time)),
    [barber, data.barbers, data.services, service, selectedDay.appointments, status],
  )

  const pendingCount = appointments.filter((appointment) => appointment.status === "Aguardando").length
  const confirmedCount = appointments.filter((appointment) => appointment.status === "Confirmado").length

  function refreshAgenda() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  function openRegister() {
    setDraft(emptyDraft)
    setRegisterError("")
    setRegisterOpen(true)
  }

  function registerAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const client = draft.client.trim()
    const phone = draft.phone.trim()
    if (!client || !phone || !draft.service || !draft.barber) return
    if (draft.endTime <= draft.time) {
      setRegisterError("O horário de término deve ser posterior ao início.")
      return
    }
    const overlap = selectedDay.appointments.some((appointment) => (
      appointment.barber === draft.barber && appointment.status !== "Cancelado" &&
      draft.time < appointment.endTime && draft.endTime > appointment.time
    ))
    if (overlap) {
      setRegisterError("Esse profissional já tem um atendimento no intervalo escolhido nesta demonstração.")
      return
    }
    const appointment: AgendaAppointment = { id: crypto.randomUUID(), client, phone, service: draft.service, barber: draft.barber, time: draft.time, endTime: draft.endTime, status: "Confirmado" }
    setDays((current) => current.map((day, index) => index === dayIndex ? { ...day, appointments: [...day.appointments, appointment] } : day))
    setBarber(data.barbers[0])
    setService(data.services[0])
    setStatus(statusOptions[0])
    setMode("ready")
    setRegisterOpen(false)
    setNotice(`Atendimento de ${client} registrado apenas nesta demonstração.`)
  }

  function updateStatus(appointment: AgendaAppointment, nextStatus: AgendaStatus) {
    setDays((current) => current.map((day) => ({ ...day, appointments: day.appointments.map((item) => item.id === appointment.id ? { ...item, status: nextStatus } : item) })))
    setSelectedId(null)
    setNotice(`${appointment.client}: situação alterada para ${nextStatus.toLocaleLowerCase("pt-BR")} nesta demonstração.`)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col justify-between gap-6 border-b border-slate-800/90 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_220px] md:items-end lg:flex lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Operação do dia · amostra de junho de 2025</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Agenda</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Uma visão rápida do salão para a equipe saber quem chega, quando chega e o que precisa acontecer.</p>
            </div>
            <div className="flex gap-3 flex-col">
              <button type="button" onClick={refreshAgenda} className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-700 p-3 text-sm font-semibold text-slate-200 transition hover:border-[#65d5ff] hover:text-[#65d5ff] md:w-full"><FiRefreshCw className="shrink-0" size={16} /> Atualizar</button>
              <button type="button" onClick={openRegister} className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#65d5ff] p-3 text-sm font-bold text-[#061522] transition hover:bg-[#8de1ff] md:w-full"><FiPlus className="shrink-0" size={17} /><span className="truncate">Registrar atendimento</span></button>
            </div>
          </header>

          <section aria-label="Resumo do turno" className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-3">
            <div className="border-b border-slate-800 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">No turno</p><p className="mt-2 text-2xl font-semibold">{appointments.length}</p><p className="mt-1 text-xs text-slate-400">atendimentos filtrados</p></div>
            <div className="border-b border-slate-800 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Confirmados</p><p className="mt-2 text-2xl font-semibold text-[#8de1ff]">{confirmedCount}</p><p className="mt-1 text-xs text-slate-400">clientes prontos para chegar</p></div>
            <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Pedem atenção</p><p className="mt-2 text-2xl font-semibold text-amber-200">{pendingCount}</p><p className="mt-1 text-xs text-slate-400">aguardando confirmação</p></div>
          </section>

          <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-[#8de1ff]">{notice}</p>

          <section className="mt-4 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/80 bg-[#07111c] p-1"><button type="button" aria-label="Dia anterior" disabled={dayIndex === 0} onClick={() => setDayIndex(dayIndex - 1)} className="grid size-11 place-items-center rounded-md text-slate-300 transition hover:bg-[#12344a] hover:text-[#65d5ff] disabled:cursor-not-allowed disabled:opacity-40"><FiChevronLeft /></button><div className="flex min-w-0 items-center justify-center gap-2 text-sm font-semibold tabular-nums"><FiCalendar className="shrink-0 text-[#65d5ff]" size={16} /> {selectedDay.date} 2025</div><button type="button" aria-label="Próximo dia" disabled={dayIndex === days.length - 1} onClick={() => setDayIndex(dayIndex + 1)} className="grid size-11 place-items-center rounded-md text-slate-300 transition hover:bg-[#12344a] hover:text-[#65d5ff] disabled:cursor-not-allowed disabled:opacity-40"><FiChevronRight /></button></div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:min-w-150"><select aria-label="Filtrar por barbeiro" value={barber} onChange={(event) => setBarber(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{data.barbers.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por serviço" value={service} onChange={(event) => setService(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{data.services.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
            </div>
          </section>

          <div className="mt-8 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><FiActivity className="text-[#65d5ff]" /><h2 className="text-lg font-semibold">Linha do tempo</h2></div><p className="mt-2 text-sm text-slate-400">{appointments.length} {appointments.length === 1 ? "atendimento encontrado" : "atendimentos encontrados"}</p></div><button type="button" onClick={() => setMode("error")} className="min-h-11 shrink-0 text-xs font-semibold text-slate-500 transition hover:text-slate-200">Simular erro</button></div>

          <div className="mt-4">
            {mode !== "ready" ? <AgendaState kind={mode} onRetry={() => setMode("ready")} /> : appointments.length === 0 ? <AgendaState kind="empty" /> : <AppointmentList appointments={appointments} onDetails={setSelectedId} />}
          </div>
          <p className="mt-4 text-xs text-slate-500">Alterações nesta agenda são demonstrativas e desaparecem ao recarregar a página.</p>
        </div>
      </Container>

      <DemoDialog open={registerOpen} onClose={() => setRegisterOpen(false)} title="Registrar atendimento" description={`Novo horário em ${selectedDay.date} de 2025. O registro permanece apenas nesta página.`}>
        <form onSubmit={registerAppointment} className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">Cliente<input autoFocus required maxLength={80} value={draft.client} onChange={(event) => setDraft({ ...draft, client: event.target.value })} className={fieldClass} placeholder="Nome do cliente" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">Telefone<input required type="tel" maxLength={25} value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} className={fieldClass} placeholder="(00) 00000-0000" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">Serviço<select required value={draft.service} onChange={(event) => setDraft({ ...draft, service: event.target.value })} className={fieldClass}><option value="">Selecione</option>{data.services.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">Barbeiro<select required value={draft.barber} onChange={(event) => setDraft({ ...draft, barber: event.target.value })} className={fieldClass}><option value="">Selecione</option>{data.barbers.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">Início<input required type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} className={fieldClass} /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">Término<input required type="time" value={draft.endTime} onChange={(event) => setDraft({ ...draft, endTime: event.target.value })} className={fieldClass} /></label>
          {registerError && <p role="alert" className="text-sm text-amber-200 sm:col-span-2">{registerError}</p>}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-800 pt-5 sm:col-span-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setRegisterOpen(false)} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-slate-500">Cancelar</button><button type="submit" className="min-h-11 rounded-lg bg-[#65d5ff] px-5 text-sm font-bold text-[#061522] hover:bg-[#8de1ff]">Registrar na prévia</button></div>
        </form>
      </DemoDialog>

      <DemoDialog open={!!selectedAppointment} onClose={() => setSelectedId(null)} title={selectedAppointment?.client ?? "Atendimento"} description="Detalhes e situação deste atendimento na prévia local.">
        {selectedAppointment && <div>
          <dl className="grid gap-4 rounded-lg border border-slate-800 bg-[#07111c] p-4 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">Horário</dt><dd className="mt-1 font-semibold tabular-nums">{selectedAppointment.time}–{selectedAppointment.endTime}</dd></div>
            <div><dt className="text-slate-500">Situação</dt><dd className="mt-1 font-semibold">{selectedAppointment.status}</dd></div>
            <div><dt className="text-slate-500">Serviço</dt><dd className="mt-1 font-semibold">{selectedAppointment.service}</dd></div>
            <div><dt className="text-slate-500">Barbeiro</dt><dd className="mt-1 font-semibold">{selectedAppointment.barber}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {selectedAppointment.status === "Aguardando" && <button type="button" onClick={() => updateStatus(selectedAppointment, "Confirmado")} className="min-h-11 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522]">Confirmar</button>}
            {(selectedAppointment.status === "Confirmado" || selectedAppointment.status === "Aguardando") && <button type="button" onClick={() => updateStatus(selectedAppointment, "Concluído")} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-[#65d5ff]">Marcar concluído</button>}
            {(selectedAppointment.status === "Confirmado" || selectedAppointment.status === "Aguardando") && <button type="button" onClick={() => updateStatus(selectedAppointment, "Falta")} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-amber-200 hover:border-amber-300">Registrar falta</button>}
            {(selectedAppointment.status === "Confirmado" || selectedAppointment.status === "Aguardando") && <button type="button" onClick={() => updateStatus(selectedAppointment, "Cancelado")} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-red-300 hover:border-red-300">Cancelar horário</button>}
            {(selectedAppointment.status === "Concluído" || selectedAppointment.status === "Cancelado" || selectedAppointment.status === "Falta") && <p className="text-sm text-slate-400">Este atendimento já tem um desfecho nesta demonstração.</p>}
          </div>
        </div>}
      </DemoDialog>
    </div>
  )
}

type AppointmentListProps = { appointments: AgendaAppointment[]; onDetails: (id: string) => void }
function AppointmentList({ appointments, onDetails }: AppointmentListProps) {
  return <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]"><div className="hidden grid-cols-[110px_minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(140px,1fr)_120px_44px] items-center gap-5 border-b border-slate-800 bg-[#0d1d2d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid"><span>Horário</span><span>Cliente</span><span>Serviço</span><span>Barbeiro</span><span className="text-center">Status</span><span /></div><div className="hidden lg:block">{appointments.map((appointment, index) => <AppointmentRow key={appointment.id} appointment={appointment} highlighted={index === 0} onDetails={onDetails} />)}</div><div className="space-y-3 p-3 lg:hidden">{appointments.map((appointment, index) => <AppointmentCard key={appointment.id} appointment={appointment} highlighted={index === 0} onDetails={onDetails} />)}</div></div>
}

type AppointmentItemProps = { appointment: AgendaAppointment; highlighted?: boolean; onDetails: (id: string) => void }
function AppointmentRow({ appointment, highlighted, onDetails }: AppointmentItemProps) {
  return <div className={`relative grid min-w-0 grid-cols-[110px_minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(140px,1fr)_120px_44px] items-center gap-5 border-b border-slate-800/80 px-6 py-4 last:border-0 transition hover:bg-[#102235] ${highlighted ? "bg-[#102235]/60" : ""}`}>
    {highlighted && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#65d5ff]" />}
    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-200"><FiClock className="shrink-0 text-[#65d5ff]" size={16} aria-hidden="true" /><span>{appointment.time}</span><span className="hidden text-xs font-normal text-slate-500 xl:inline">até {appointment.endTime}</span></div>
    <div className="min-w-0"><p className="truncate text-sm font-semibold text-white" title={appointment.client}>{appointment.client}</p><Contact phone={appointment.phone} /></div>
    <p className="min-w-0 truncate text-sm text-slate-300" title={appointment.service}>{appointment.service}</p>
    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400"><FiUser className="shrink-0" size={14} aria-hidden="true" /><span className="truncate" title={appointment.barber}>{appointment.barber}</span></div>
    <span className={`justify-self-center whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span>
    <button type="button" onClick={() => onDetails(appointment.id)} aria-label={`Mais opções para ${appointment.client}`} className="grid size-11 place-items-center rounded-md text-slate-400 hover:bg-[#12344a] hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiMoreHorizontal aria-hidden="true" /></button>
  </div>
}

function AppointmentCard({ appointment, highlighted, onDetails }: AppointmentItemProps) {
  return <article className={`relative rounded-lg border border-slate-800 bg-[#102235] p-4 ${highlighted ? "border-[#65d5ff]/50" : ""}`}>
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold tabular-nums text-[#65d5ff]"><FiClock size={16} aria-hidden="true" />{appointment.time}<span className="text-xs font-normal text-slate-400">até {appointment.endTime}</span></div>
      <div className="flex items-center gap-1"><span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span><button type="button" onClick={() => onDetails(appointment.id)} aria-label={`Mais opções para ${appointment.client}`} className="grid size-11 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#65d5ff]"><FiMoreHorizontal aria-hidden="true" /></button></div>
    </div>
    <div className="mt-4 min-w-0"><p className="truncate text-base font-semibold text-white" title={appointment.client}>{appointment.client}</p><Contact phone={appointment.phone} /></div>
    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-700/70 pt-3 text-xs"><div className="min-w-0"><span className="block text-slate-500">Serviço</span><span className="mt-1 block truncate text-slate-200" title={appointment.service}>{appointment.service}</span></div><div className="min-w-0"><span className="block text-slate-500">Barbeiro</span><span className="mt-1 block truncate text-slate-200" title={appointment.barber}>{appointment.barber}</span></div></div>
  </article>
}
