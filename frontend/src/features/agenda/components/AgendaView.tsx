"use client"

import { useMemo, useState } from "react"
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiMoreHorizontal, FiPhone, FiPlus, FiRefreshCw, FiUser } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { AgendaState } from "./AgendaState"
import type { AgendaData, AgendaStatus } from "../types"

type AgendaViewProps = { data: AgendaData }

const statusOptions: Array<"Todos os status" | AgendaStatus> = ["Todos os status", "Confirmado", "Aguardando", "Concluído", "Cancelado"]

function statusClass(status: AgendaStatus) {
  if (status === "Concluído") return "bg-emerald-400/10 text-emerald-400"
  if (status === "Aguardando") return "bg-amber-300/10 text-amber-300"
  if (status === "Cancelado") return "bg-red-400/10 text-red-300"
  return "bg-[#65d5ff]/10 text-[#65d5ff]"
}

export function AgendaView({ data }: AgendaViewProps) {
  const [dayIndex, setDayIndex] = useState(0)
  const [barber, setBarber] = useState(data.barbers[0])
  const [service, setService] = useState(data.services[0])
  const [status, setStatus] = useState<(typeof statusOptions)[number]>(statusOptions[0])
  const [mode, setMode] = useState<"ready" | "loading" | "error">("ready")
  const selectedDay = data.days[dayIndex]

  const appointments = useMemo(
    () => selectedDay.appointments.filter((appointment) =>
      (barber === data.barbers[0] || appointment.barber === barber) &&
      (service === data.services[0] || appointment.service === service) &&
      (status === statusOptions[0] || appointment.status === status),
    ),
    [barber, data.barbers, data.services, service, selectedDay.appointments, status],
  )

  function refreshAgenda() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c]">
      <Container>
        <div className="py-7 lg:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-[#65d5ff]">Operação diária</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Agenda</h1>
              <p className="mt-2 text-sm text-slate-400">Organize os atendimentos e acompanhe os horários da equipe.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={refreshAgenda} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiRefreshCw size={16} /> Atualizar</button>
              <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] hover:bg-[#8de1ff]"><FiPlus size={17} /> Registrar atendimento</button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center justify-between gap-3 sm:justify-start"><button type="button" aria-label="Dia anterior" onClick={() => setDayIndex(Math.max(0, dayIndex - 1))} className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiChevronLeft /></button><div className="flex min-w-36 items-center justify-center gap-2 text-sm font-semibold text-white"><FiCalendar className="text-[#65d5ff]" size={17} /> {selectedDay.label}, {selectedDay.date}</div><button type="button" aria-label="Próximo dia" onClick={() => setDayIndex(Math.min(data.days.length - 1, dayIndex + 1))} className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiChevronRight /></button></div>
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3"><select aria-label="Filtrar por barbeiro" value={barber} onChange={(event) => setBarber(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none focus:border-[#65d5ff]">{data.barbers.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por serviço" value={service} onChange={(event) => setService(event.target.value)} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none focus:border-[#65d5ff]">{data.services.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as (typeof statusOptions)[number])} className="h-10 min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none focus:border-[#65d5ff]">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-white">Horários do dia</h2><p className="mt-1 text-sm text-slate-400">{appointments.length} {appointments.length === 1 ? "atendimento encontrado" : "atendimentos encontrados"}</p></div><button type="button" onClick={() => setMode("error")} className="shrink-0 text-sm text-slate-500 hover:text-slate-300">Ver estado de erro</button></div>

          <div className="mt-4">
            {mode !== "ready" ? <AgendaState kind={mode} onRetry={() => setMode("ready")} /> : appointments.length === 0 ? <AgendaState kind="empty" /> : (
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]">
                <div className="hidden grid-cols-[110px_minmax(180px,1.5fr)_minmax(160px,1fr)_minmax(140px,1fr)_112px_36px] items-center gap-5 border-b border-slate-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:grid">
                  <span>Horário</span><span>Cliente</span><span>Serviço</span><span>Barbeiro</span><span className="text-center">Status</span><span />
                </div>
                <div className="hidden lg:block">
                  {appointments.map((appointment) => <div key={appointment.id} className="grid min-w-0 grid-cols-[110px_minmax(180px,1.5fr)_minmax(160px,1fr)_minmax(140px,1fr)_112px_36px] items-center gap-5 border-b border-slate-800/80 px-6 py-4 last:border-0">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-200"><FiClock className="shrink-0 text-[#65d5ff]" size={16} /><span>{appointment.time}</span><span className="hidden text-xs font-normal text-slate-500 xl:inline">- {appointment.endTime}</span></div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-white" title={appointment.client}>{appointment.client}</p><a href={`tel:${appointment.phone}`} className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-slate-500 hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} /> <span className="truncate">{appointment.phone}</span></a></div>
                    <p className="min-w-0 truncate text-sm text-slate-300" title={appointment.service}>{appointment.service}</p>
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400"><FiUser className="shrink-0" size={14} /><span className="truncate" title={appointment.barber}>{appointment.barber}</span></div>
                    <span className={`justify-self-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span>
                    <div className="flex justify-end"><button type="button" aria-label={`Mais opções para ${appointment.client}`} className="text-slate-500 hover:text-white"><FiMoreHorizontal /></button></div>
                  </div>)}
                </div>
                <div className="space-y-3 p-3 lg:hidden">
                  {appointments.map((appointment) => <article key={appointment.id} className="rounded-lg border border-slate-800 bg-[#102235] p-4">
                    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#65d5ff]"><FiClock size={16} />{appointment.time}<span className="text-xs font-normal text-slate-500">até {appointment.endTime}</span></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span></div>
                    <div className="mt-4 min-w-0"><p className="truncate text-base font-semibold text-white">{appointment.client}</p><a href={`tel:${appointment.phone}`} className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-slate-400 hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} /> <span className="truncate">{appointment.phone}</span></a></div>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-700/70 pt-3 text-xs"><div className="min-w-0"><span className="block text-slate-500">Serviço</span><span className="mt-1 block truncate text-slate-200" title={appointment.service}>{appointment.service}</span></div><div className="min-w-0"><span className="block text-slate-500">Barbeiro</span><span className="mt-1 block truncate text-slate-200" title={appointment.barber}>{appointment.barber}</span></div></div>
                  </article>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}