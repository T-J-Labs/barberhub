"use client"

import { useState } from "react"
import { FiArrowRight, FiCalendar, FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiDollarSign, FiMoreHorizontal, FiUsers } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { DashboardState } from "./DashboardState"
import type { DashboardData } from "../types"

type AdminDashboardProps = { data: DashboardData }

const metricIcons = [FiCalendar, FiCheckCircle, FiDollarSign, FiUsers]
const dates = ["Hoje, 24 jun", "Amanhã, 25 jun", "Quinta, 26 jun"]

export function AdminDashboard({ data }: AdminDashboardProps) {
  const [dateIndex, setDateIndex] = useState(0)
  const [mode, setMode] = useState<"ready" | "loading" | "empty" | "error">("ready")

  function refreshDashboard() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c]">
      <Container>
        <div className="py-7 lg:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-[#65d5ff]">Terça-feira, 24 de junho de 2025</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Bom dia, Felipe</h1>
            <p className="mt-2 text-sm text-slate-400">Aqui está o que está acontecendo na sua barbearia.</p>
          </div>
          <button type="button" onClick={refreshDashboard} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] transition hover:bg-[#8de1ff]">
            <FiCalendar size={17} /> Registrar atendimento
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.metrics.map((metric, index) => {
            const Icon = metricIcons[index]
            return <article key={metric.label} className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
              <div className="flex items-start justify-between"><span className="grid size-9 place-items-center rounded-lg bg-[#12344a] text-[#65d5ff]"><Icon size={18} /></span><FiMoreHorizontal className="text-slate-600" /></div>
              <p className="mt-5 text-sm text-slate-400">{metric.label}</p><p className="mt-1 text-2xl font-semibold text-white">{metric.value}</p>
              <p className={`mt-2 text-xs font-medium ${metric.trend === "positive" ? "text-emerald-400" : "text-slate-500"}`}>{metric.detail}</p>
            </article>
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-xl border border-slate-800 bg-[#0b1a29]">
            <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><h2 className="text-lg font-semibold text-white">Próximos agendamentos</h2><p className="mt-1 text-sm text-slate-400">Acompanhe os atendimentos da sua equipe.</p></div>
              <div className="flex items-center justify-between gap-3"><button type="button" aria-label="Dia anterior" onClick={() => setDateIndex(Math.max(0, dateIndex - 1))} className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiChevronLeft /></button><span className="min-w-28 text-center text-sm font-semibold text-slate-200">{dates[dateIndex]}</span><button type="button" aria-label="Próximo dia" onClick={() => setDateIndex(Math.min(dates.length - 1, dateIndex + 1))} className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiChevronRight /></button></div>
            </div>
            <div className="p-5 sm:p-6">
              {mode === "ready" ? <div className="space-y-1">{data.appointments.map((appointment) => <div key={`${appointment.time}-${appointment.client}`} className="group grid grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-800/80 py-4 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[72px_minmax(0,1fr)_150px_auto] sm:gap-5"><div className="flex items-center gap-2 text-sm font-semibold text-slate-200"><FiClock className="text-[#65d5ff]" size={15} />{appointment.time}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{appointment.client}</p><p className="mt-1 truncate text-xs text-slate-500">{appointment.service}</p></div><p className="hidden truncate text-sm text-slate-400 sm:block">{appointment.barber}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${appointment.status === "Concluído" ? "bg-emerald-400/10 text-emerald-400" : appointment.status === "Aguardando" ? "bg-amber-300/10 text-amber-300" : "bg-[#65d5ff]/10 text-[#65d5ff]"}`}>{appointment.status}</span></div>)}</div> : <DashboardState kind={mode} onRetry={() => setMode("ready")} />}
            </div>
            <div className="border-t border-slate-800 p-5 sm:p-6"><button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-[#65d5ff] hover:text-white">Ver agenda completa <FiArrowRight size={16} /></button></div>
          </section>

          <aside className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold text-white">Atenção necessária</h2><p className="mt-1 text-sm text-slate-400">Itens que precisam de você.</p></div><span className="grid size-8 place-items-center rounded-full bg-amber-300/10 text-sm font-bold text-amber-300">2</span></div><div className="mt-6 space-y-3">{data.alerts.map((alert) => <div key={alert.title} className="border-l-2 border-amber-300/70 bg-[#102235] p-4"><p className="text-sm font-semibold text-slate-100">{alert.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{alert.description}</p><button type="button" className="mt-3 text-xs font-bold text-[#65d5ff] hover:text-white">{alert.action} <FiArrowRight className="ml-1 inline" size={13} /></button></div>)}</div><button type="button" onClick={() => setMode("empty")} className="mt-5 text-xs text-slate-500 hover:text-slate-300">Visualizar estado vazio</button></aside>
        </div>
        </div>
      </Container>
    </div>
  )
}