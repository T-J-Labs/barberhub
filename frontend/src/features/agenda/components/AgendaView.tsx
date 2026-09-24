"use client"

import { useMemo, useState } from "react"
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
import { AgendaState } from "./AgendaState"
import type { AgendaData, AgendaStatus } from "../types"

type AgendaViewProps = { data: AgendaData }
type StatusFilter = "Todos os status" | AgendaStatus

const statusOptions: StatusFilter[] = ["Todos os status", "Confirmado", "Aguardando", "Concluído", "Cancelado"]

function statusClass(status: AgendaStatus) {
  if (status === "Concluído") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
  if (status === "Aguardando") return "border-amber-300/40 bg-amber-300/10 text-amber-200"
  if (status === "Cancelado") return "border-red-400/40 bg-red-400/10 text-red-300"
  return "border-[#65d5ff]/40 bg-[#65d5ff]/10 text-[#8de1ff]"
}

function Contact({ phone }: { phone: string }) {
  return <a href={`tel:${phone}`} className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-slate-500 hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} /> <span className="truncate">{phone}</span></a>
}

export function AgendaView({ data }: AgendaViewProps) {
  const [dayIndex, setDayIndex] = useState(0)
  const [barber, setBarber] = useState(data.barbers[0])
  const [service, setService] = useState(data.services[0])
  const [status, setStatus] = useState<StatusFilter>(statusOptions[0])
  const [mode, setMode] = useState<"ready" | "loading" | "error">("ready")
  const selectedDay = data.days[dayIndex]

  const appointments = useMemo(
    () => selectedDay.appointments.filter((appointment) => (
      (barber === data.barbers[0] || appointment.barber === barber) &&
      (service === data.services[0] || appointment.service === service) &&
      (status === statusOptions[0] || appointment.status === status)
    )),
    [barber, data.barbers, data.services, service, selectedDay.appointments, status],
  )

  const pendingCount = appointments.filter((appointment) => appointment.status === "Aguardando").length
  const confirmedCount = appointments.filter((appointment) => appointment.status === "Confirmado").length

  function refreshAgenda() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col justify-between gap-6 border-b border-slate-800/90 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_220px] md:items-end lg:flex lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Operação do dia</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Agenda</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Uma visão rápida do salão para a equipe saber quem chega, quando chega e o que precisa acontecer.</p>
            </div>
            <div className="flex gap-3 flex-col">
              <button type="button" onClick={refreshAgenda} className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-700 p-3 text-sm font-semibold text-slate-200 transition hover:border-[#65d5ff] hover:text-[#65d5ff] md:w-full"><FiRefreshCw className="shrink-0" size={16} /> Atualizar</button>
              <button type="button" className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#65d5ff] p-3 text-sm font-bold text-[#061522] transition hover:bg-[#8de1ff] md:w-full"><FiPlus className="shrink-0" size={17} /><span className="truncate">Registrar atendimento</span></button>
            </div>
          </header>

          <section aria-label="Resumo do turno" className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-3">
            <div className="border-b border-slate-800 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">No turno</p><p className="mt-2 text-2xl font-semibold">{appointments.length}</p><p className="mt-1 text-xs text-slate-400">atendimentos filtrados</p></div>
            <div className="border-b border-slate-800 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Confirmados</p><p className="mt-2 text-2xl font-semibold text-[#8de1ff]">{confirmedCount}</p><p className="mt-1 text-xs text-slate-400">clientes prontos para chegar</p></div>
            <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Pedem atenção</p><p className="mt-2 text-2xl font-semibold text-amber-200">{pendingCount}</p><p className="mt-1 text-xs text-slate-400">aguardando confirmação</p></div>
          </section>

          <section className="mt-6 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/80 bg-[#07111c] p-1"><button type="button" aria-label="Dia anterior" onClick={() => setDayIndex(Math.max(0, dayIndex - 1))} className="grid size-8 place-items-center rounded-md text-slate-300 transition hover:bg-[#12344a] hover:text-[#65d5ff]"><FiChevronLeft /></button><div className="flex min-w-40 items-center justify-center gap-2 text-sm font-semibold"><FiCalendar className="text-[#65d5ff]" size={16} /> {selectedDay.label}, {selectedDay.date}</div><button type="button" aria-label="Próximo dia" onClick={() => setDayIndex(Math.min(data.days.length - 1, dayIndex + 1))} className="grid size-8 place-items-center rounded-md text-slate-300 transition hover:bg-[#12344a] hover:text-[#65d5ff]"><FiChevronRight /></button></div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:min-w-150"><select aria-label="Filtrar por barbeiro" value={barber} onChange={(event) => setBarber(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{data.barbers.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por serviço" value={service} onChange={(event) => setService(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{data.services.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff]">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
            </div>
          </section>

          <div className="mt-8 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><FiActivity className="text-[#65d5ff]" /><h2 className="text-lg font-semibold">Linha do tempo</h2></div><p className="mt-2 text-sm text-slate-400">{appointments.length} {appointments.length === 1 ? "atendimento encontrado" : "atendimentos encontrados"}</p></div><button type="button" onClick={() => setMode("error")} className="shrink-0 text-xs font-semibold text-slate-500 transition hover:text-slate-200">Simular erro</button></div>

          <div className="mt-4">
            {mode !== "ready" ? <AgendaState kind={mode} onRetry={() => setMode("ready")} /> : appointments.length === 0 ? <AgendaState kind="empty" /> : <AppointmentList appointments={appointments} />}
          </div>
        </div>
      </Container>
    </div>
  )
}

type AppointmentListProps = { appointments: AgendaData["days"][number]["appointments"] }
function AppointmentList({ appointments }: AppointmentListProps) { return <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]"><div className="hidden grid-cols-[110px_minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(140px,1fr)_120px_38px] items-center gap-5 border-b border-slate-800 bg-[#0d1d2d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid"><span>Horário</span><span>Cliente</span><span>Serviço</span><span>Barbeiro</span><span className="text-center">Status</span><span /></div><div className="hidden lg:block">{appointments.map((appointment, index) => <AppointmentRow key={appointment.id} appointment={appointment} highlighted={index === 0} />)}</div><div className="space-y-3 p-3 lg:hidden">{appointments.map((appointment, index) => <AppointmentCard key={appointment.id} appointment={appointment} highlighted={index === 0} />)}</div></div> }

type AppointmentItemProps = { appointment: AgendaData["days"][number]["appointments"][number]; highlighted?: boolean }
function AppointmentRow({ appointment, highlighted }: AppointmentItemProps) { return <div className={`relative grid min-w-0 grid-cols-[110px_minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(140px,1fr)_120px_38px] items-center gap-5 border-b border-slate-800/80 px-6 py-4 last:border-0 transition hover:bg-[#102235] ${highlighted ? "bg-[#102235]/60" : ""}`}>{highlighted && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#65d5ff]" />}<div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-200"><FiClock className="shrink-0 text-[#65d5ff]" size={16} /><span>{appointment.time}</span><span className="hidden text-xs font-normal text-slate-500 xl:inline">até {appointment.endTime}</span></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white" title={appointment.client}>{appointment.client}</p><Contact phone={appointment.phone} /></div><p className="min-w-0 truncate text-sm text-slate-300" title={appointment.service}>{appointment.service}</p><div className="flex min-w-0 items-center gap-2 text-sm text-slate-400"><FiUser className="shrink-0" size={14} /><span className="truncate" title={appointment.barber}>{appointment.barber}</span></div><span className={`justify-self-center whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span><div className="flex justify-end"><button type="button" aria-label={`Mais opções para ${appointment.client}`} className="text-slate-500 transition hover:text-white"><FiMoreHorizontal /></button></div></div> }
function AppointmentCard({ appointment, highlighted }: AppointmentItemProps) { return <article className={`relative rounded-lg border border-slate-800 bg-[#102235] p-4 ${highlighted ? "border-[#65d5ff]/50" : ""}`}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#65d5ff]"><FiClock size={16} />{appointment.time}<span className="text-xs font-normal text-slate-500">até {appointment.endTime}</span></div><div className="flex shrink-0 items-center gap-2"><span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span><button type="button" aria-label={`Mais opções para ${appointment.client}`} className="grid size-8 place-items-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"><FiMoreHorizontal /></button></div></div><div className="mt-4 min-w-0"><p className="truncate text-base font-semibold text-white">{appointment.client}</p><Contact phone={appointment.phone} /></div><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-700/70 pt-3 text-xs"><div className="min-w-0"><span className="block text-slate-500">Serviço</span><span className="mt-1 block truncate text-slate-200" title={appointment.service}>{appointment.service}</span></div><div className="min-w-0"><span className="block text-slate-500">Barbeiro</span><span className="mt-1 block truncate text-slate-200" title={appointment.barber}>{appointment.barber}</span></div></div></article> }
