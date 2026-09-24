"use client"

import { useState } from "react"
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiMoreHorizontal,
  FiPlus,
  FiUsers,
} from "react-icons/fi"
import { Container } from "../../../components/ui/Container"
import { DashboardState } from "./DashboardState"
import type { DashboardData } from "../types"
import Link from "next/link"

type AdminDashboardProps = { data: DashboardData }

const metricIcons = [FiCalendar, FiCheckCircle, FiDollarSign, FiUsers]
const dates = ["Hoje, 24 jun", "Amanhã, 25 jun", "Quinta, 26 jun"]

function appointmentTone(status: string) {
  if (status === "Concluído") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
  if (status === "Aguardando") return "border-amber-300/40 bg-amber-300/10 text-amber-200"
  return "border-[#65d5ff]/40 bg-[#65d5ff]/10 text-[#8de1ff]"
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const [dateIndex, setDateIndex] = useState(0)
  const [mode, setMode] = useState<"ready" | "loading" | "empty" | "error">("ready")

  function refreshDashboard() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col justify-between gap-6 border-b border-slate-800/90 pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Terça-feira, 24 de junho de 2025</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Bom dia, Felipe</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">A casa começa a ganhar ritmo. Aqui está o que merece sua atenção agora.</p>
            </div>
            <button type="button" onClick={refreshDashboard} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] transition hover:bg-[#8de1ff]">
              <FiPlus size={17} /> Registrar atendimento
            </button>
          </header>

          <section aria-label="Resumo do dia" className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric, index) => {
              const Icon = metricIcons[index]
              return (
                <article key={metric.label} className="border-b border-slate-800 p-5 last:border-0 sm:nth-[2n]:border-l xl:border-b-0 xl:border-l xl:first:border-l-0">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-[#12344a] text-[#65d5ff]"><Icon size={18} /></span>
                    <FiMoreHorizontal className="text-slate-600" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{metric.value}</p>
                  <p className={`mt-2 text-xs font-medium ${metric.trend === "positive" ? "text-emerald-400" : "text-slate-500"}`}>{metric.detail}</p>
                </article>
              )
            })}
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <section className="min-w-0 rounded-xl border border-slate-800 bg-[#0b1a29]">
              <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#65d5ff] shadow-[0_0_12px_rgba(101,213,255,0.8)]" /><h2 className="text-lg font-semibold">A agenda em movimento</h2></div>
                  <p className="mt-2 text-sm text-slate-400">Próximos atendimentos da equipe.</p>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/80 bg-[#07111c] p-1"><button type="button" aria-label="Dia anterior" onClick={() => setDateIndex(Math.max(0, dateIndex - 1))} className="grid size-8 place-items-center rounded-md text-slate-300 hover:bg-[#12344a] hover:text-[#65d5ff]"><FiChevronLeft /></button><span className="min-w-28 text-center text-xs font-semibold text-slate-200">{dates[dateIndex]}</span><button type="button" aria-label="Próximo dia" onClick={() => setDateIndex(Math.min(dates.length - 1, dateIndex + 1))} className="grid size-8 place-items-center rounded-md text-slate-300 hover:bg-[#12344a] hover:text-[#65d5ff]"><FiChevronRight /></button></div>
              </div>

              <div className="p-5 sm:p-6">
                {mode === "ready" ? (
                  <div className="space-y-2">
                    {data.appointments.map((appointment, index) => (
                      <div key={`${appointment.time}-${appointment.client}`} className={`relative grid grid-cols-[62px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-transparent px-3 py-4 transition hover:border-slate-700 hover:bg-[#102235] sm:grid-cols-[78px_minmax(0,1fr)_150px_auto] sm:gap-5 ${index === 1 ? "bg-[#102235]/70" : ""}`}>
                        {index === 1 && <span className="absolute -left-px top-3 bottom-3 w-0.5 rounded-full bg-[#65d5ff]" />}
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200"><FiClock className="text-[#65d5ff]" size={15} />{appointment.time}</div>
                        <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{appointment.client}</p><p className="mt-1 truncate text-xs text-slate-500">{appointment.service}</p></div>
                        <p className="hidden truncate text-sm text-slate-400 sm:block">{appointment.barber}</p>
                        <span className={`justify-self-end whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold ${appointmentTone(appointment.status)}`}>{appointment.status}</span>
                      </div>
                    ))}
                  </div>
                ) : <DashboardState kind={mode} onRetry={() => setMode("ready")} />}
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4 sm:px-6"><span className="text-xs text-slate-500">{data.appointments.length} horários exibidos</span><Link href="admin/agenda" className="inline-flex items-center gap-2 text-sm font-semibold text-[#65d5ff] hover:text-white">Ver agenda completa <FiArrowRight size={16} /></Link></div>
            </section>

            <aside className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Para resolver hoje</h2><p className="mt-2 text-sm text-slate-400">Duas tarefas antes do próximo pico.</p></div><span className="grid size-8 place-items-center rounded-md bg-amber-300/10 text-sm font-bold text-amber-200">2</span></div>
              <div className="mt-6 space-y-3">{data.alerts.map((alert) => <div key={alert.title} className="border-l-2 border-amber-300/70 bg-[#102235] p-4"><p className="text-sm font-semibold text-slate-100">{alert.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{alert.description}</p><button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#65d5ff] hover:text-white">{alert.action} <FiArrowRight size={13} /></button></div>)}</div>
              <button type="button" onClick={() => setMode("empty")} className="mt-5 text-xs text-slate-500 hover:text-slate-300">Visualizar estado vazio</button>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  )
}
