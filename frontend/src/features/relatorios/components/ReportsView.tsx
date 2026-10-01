"use client"

import { useMemo, useState } from "react"
import { FiActivity, FiAlertTriangle, FiCalendar, FiCheckCircle, FiClock, FiFilter, FiScissors, FiUsers, FiXCircle } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import type { ReportAppointment, ReportStatus } from "../types"

type ReportsViewProps = { appointments: ReportAppointment[] }
type OutcomeCounts = { completed: number; missed: number; cancelled: number }
type WeeklyOutcome = OutcomeCounts & { key: string; label: string; total: number }

const firstSampleDate = "2025-06-01"
const lastSampleDate = "2025-06-30"
const inputClass = "min-h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-white outline-none focus:border-[#65d5ff] focus-visible:ring-2 focus-visible:ring-[#65d5ff]/25"
const monthLabels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

function countStatus(appointments: ReportAppointment[], status: ReportStatus) {
  return appointments.filter((appointment) => appointment.status === status).length
}

function weeklyOutcomes(appointments: ReportAppointment[]): WeeklyOutcome[] {
  const buckets = new Map<string, WeeklyOutcome>()

  for (const appointment of appointments) {
    if (appointment.status === "Confirmado") continue

    const [year, month, day] = appointment.date.split("-").map(Number)
    const firstDay = Math.floor((day - 1) / 7) * 7 + 1
    const lastDay = Math.min(firstDay + 6, new Date(Date.UTC(year, month, 0)).getUTCDate())
    const key = `${year}-${String(month).padStart(2, "0")}-${String(firstDay).padStart(2, "0")}`
    const bucket = buckets.get(key) ?? {
      key,
      label: `${String(firstDay).padStart(2, "0")}–${String(lastDay).padStart(2, "0")} ${monthLabels[month - 1]}`,
      completed: 0,
      missed: 0,
      cancelled: 0,
      total: 0,
    }

    if (appointment.status === "Concluído") bucket.completed += 1
    if (appointment.status === "Falta") bucket.missed += 1
    if (appointment.status === "Cancelado") bucket.cancelled += 1
    bucket.total += 1
    buckets.set(key, bucket)
  }

  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key))
}

function breakdown(appointments: ReportAppointment[], field: "service" | "barber") {
  const names = [...new Set(appointments.map((appointment) => appointment[field]))]
  return names.map((name) => ({
    name,
    count: appointments.filter((appointment) => appointment[field] === name && appointment.status === "Concluído").length,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"))
}

export function ReportsView({ appointments }: ReportsViewProps) {
  const [startDate, setStartDate] = useState(firstSampleDate)
  const [endDate, setEndDate] = useState(lastSampleDate)
  const [barber, setBarber] = useState("")
  const [service, setService] = useState("")

  const barbers = useMemo(() => [...new Set(appointments.map((appointment) => appointment.barber))].sort((a, b) => a.localeCompare(b, "pt-BR")), [appointments])
  const services = useMemo(() => [...new Set(appointments.map((appointment) => appointment.service))].sort((a, b) => a.localeCompare(b, "pt-BR")), [appointments])
  const filtered = useMemo(() => appointments.filter((appointment) =>
    (!startDate || appointment.date >= startDate) &&
    (!endDate || appointment.date <= endDate) &&
    (!barber || appointment.barber === barber) &&
    (!service || appointment.service === service),
  ), [appointments, startDate, endDate, barber, service])

  const completed = countStatus(filtered, "Concluído")
  const missed = countStatus(filtered, "Falta")
  const cancelled = countStatus(filtered, "Cancelado")
  const confirmed = countStatus(filtered, "Confirmado")
  const rateBase = completed + missed
  const missedRate = rateBase > 0 ? Math.round((missed / rateBase) * 100) : null
  const statusDistribution = [
    { label: "Concluídos", count: completed, color: "bg-[#65d5ff]" },
    { label: "Faltas", count: missed, color: "bg-amber-300" },
    { label: "Cancelados", count: cancelled, color: "bg-slate-500" },
    { label: "Confirmados", count: confirmed, color: "bg-[#12344a]" },
  ]
  const weeks = weeklyOutcomes(filtered)
  const serviceBreakdown = breakdown(filtered, "service")
  const barberBreakdown = breakdown(filtered, "barber")

  function resetFilters() {
    setStartDate(firstSampleDate)
    setEndDate(lastSampleDate)
    setBarber("")
    setService("")
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="border-b border-slate-800/90 pb-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#65d5ff]">Desempenho da barbearia</p>
              <span className="rounded-md border border-[#65d5ff]/25 bg-[#12344a]/60 px-2.5 py-1 text-xs font-semibold text-[#8de1ff]">Dados demonstrativos · junho de 2025</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Relatórios</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Entenda o ritmo dos atendimentos, acompanhe faltas e veja quais serviços movimentam a agenda.</p>
          </header>

          <section aria-labelledby="filters-title" className="mt-6 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <FiFilter className="text-[#65d5ff]" aria-hidden="true" />
              <h2 id="filters-title" className="text-sm font-semibold">Filtrar análise</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] xl:items-end">
              <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-400">
                De
                <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => {
                  const value = event.target.value
                  setStartDate(value)
                  if (value && endDate && value > endDate) setEndDate(value)
                }} className={inputClass} />
              </label>
              <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-400">
                Até
                <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => {
                  const value = event.target.value
                  setEndDate(value)
                  if (value && startDate && value < startDate) setStartDate(value)
                }} className={inputClass} />
              </label>
              <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-400">
                Profissional
                <select value={barber} onChange={(event) => setBarber(event.target.value)} className={inputClass}>
                  <option value="">Toda a equipe</option>
                  {barbers.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-400">
                Serviço
                <select value={service} onChange={(event) => setService(event.target.value)} className={inputClass}>
                  <option value="">Todos os serviços</option>
                  {services.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <button type="button" onClick={resetFilters} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-[#65d5ff] hover:text-[#8de1ff] focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Limpar</button>
            </div>
          </section>

          <section aria-labelledby="overview-title" className="mt-7">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="overview-title" className="text-lg font-semibold">Visão do período</h2>
              <p className="text-xs text-slate-500">{filtered.length} {filtered.length === 1 ? "agendamento na seleção" : "agendamentos na seleção"}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div className="rounded-xl border border-slate-800 bg-[#0b1a29] p-6 sm:p-7">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#8de1ff]"><FiCheckCircle size={18} aria-hidden="true" /> Atendimentos concluídos</div>
                <p className="mt-6 text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">{completed}</p>
                <p className="mt-2 text-sm text-slate-400">de {filtered.length} agendamentos no período selecionado</p>
                <figure className="mt-7">
                  <figcaption className="text-xs font-semibold text-slate-300">Como se distribuem os agendamentos</figcaption>
                  <p className="mt-1 text-xs text-slate-500">Cada trecho da barra representa um status, proporcional ao total filtrado.</p>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#07111c]" aria-hidden="true">
                    {filtered.length > 0 && statusDistribution.map((item) => (
                      <span key={item.label} className={item.color} style={{ width: `${item.count / filtered.length * 100}%` }} />
                    ))}
                  </div>
                  <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                    {statusDistribution.map((item) => (
                      <li key={item.label} className="flex items-center gap-2 text-xs">
                        <span className={`size-2.5 shrink-0 rounded-sm ${item.color}`} aria-hidden="true" />
                        <span className="text-slate-300">{item.label}</span>
                        <span className="ml-auto font-semibold tabular-nums text-white">{item.count} <span className="font-normal text-slate-500">({filtered.length > 0 ? Math.round(item.count / filtered.length * 100) : 0}%)</span></span>
                      </li>
                    ))}
                  </ul>
                </figure>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Agendamentos" value={filtered.length} detail="total do período" icon={<FiCalendar size={17} />} />
                <Metric label="Faltas" value={missed} detail={missedRate === null ? "sem desfechos para calcular" : `${missedRate}% dos atendimentos com desfecho`} icon={<FiAlertTriangle size={17} />} tone="warning" />
                <Metric label="Cancelados" value={cancelled} detail="fora da taxa de faltas" icon={<FiXCircle size={17} />} />
                <Metric label="Confirmados" value={confirmed} detail="sem desfecho na amostra" icon={<FiClock size={17} />} />
              </div>
            </div>
          </section>

          {filtered.length === 0 ? (
            <section className="mt-6 flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
              <FiActivity className="text-slate-500" size={26} aria-hidden="true" />
              <h2 className="mt-3 font-semibold">Nenhum agendamento nesta seleção</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-400">A amostra cobre junho de 2025. Ajuste o período ou os filtros para visualizar os resultados.</p>
              <button type="button" onClick={resetFilters} className="mt-4 min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-[#8de1ff] hover:border-[#65d5ff] focus-visible:outline-2 focus-visible:outline-[#65d5ff]">Restaurar filtros</button>
            </section>
          ) : (
            <>
              <section aria-labelledby="rhythm-title" className="mt-6 rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#65d5ff]">Ritmo da agenda</p>
                    <h2 id="rhythm-title" className="mt-1 text-xl font-semibold">Desfechos ao longo do período</h2>
                    <p className="mt-1 text-sm text-slate-400">Intervalos de sete dias; confirmados não entram até terem um desfecho.</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                    <Legend color="bg-[#65d5ff]" label="Concluídos" />
                    <Legend color="bg-amber-300" label="Faltas" />
                    <Legend color="bg-slate-500" label="Cancelados" />
                  </div>
                </div>
                {weeks.length > 0 ? <WeeklyChart weeks={weeks} /> : <p className="py-10 text-center text-sm text-slate-400">Os agendamentos selecionados ainda não têm desfecho.</p>}
              </section>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <BreakdownPanel title="Serviços em movimento" description="Atendimentos concluídos por serviço" icon={<FiScissors className="text-[#65d5ff]" />} items={serviceBreakdown} />
                <BreakdownPanel title="Equipe em atendimento" description="Atendimentos concluídos por profissional" icon={<FiUsers className="text-[#65d5ff]" />} items={barberBreakdown} />
              </div>
            </>
          )}

          <section aria-labelledby="reading-title" className="mt-6 rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:p-6">
            <h2 id="reading-title" className="text-sm font-semibold text-slate-200">Como ler estes números</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">Agendamentos incluem todos os status. A taxa de faltas é faltas ÷ (concluídos + faltas); cancelamentos e confirmados ficam fora dessa conta. Os recortes por serviço e profissional consideram apenas atendimentos concluídos. Todos os dados desta tela são demonstrativos e independentes das outras telas de exemplo.</p>
          </section>
        </div>
      </Container>
    </div>
  )
}

function Metric({ label, value, detail, icon, tone }: { label: string; value: number; detail: string; icon: React.ReactNode; tone?: "warning" }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400"><span className={tone === "warning" ? "text-amber-200" : "text-[#65d5ff]"} aria-hidden="true">{icon}</span>{label}</div>
      <p className={`mt-3 text-2xl font-semibold tabular-nums sm:text-3xl ${tone === "warning" ? "text-amber-200" : "text-white"}`}>{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className={`size-2 rounded-full ${color}`} aria-hidden="true" />{label}</span>
}

function WeeklyChart({ weeks }: { weeks: WeeklyOutcome[] }) {
  const peak = Math.max(1, ...weeks.map((week) => week.total))
  return (
    <ul className="mt-6 space-y-5">
      {weeks.map((week) => (
        <li key={week.key} className="grid grid-cols-[78px_minmax(0,1fr)_24px] items-center gap-3 sm:grid-cols-[100px_minmax(0,1fr)_32px] sm:gap-5">
          <span className="text-xs tabular-nums text-slate-400">{week.label}</span>
          <div className="h-8 overflow-hidden rounded-md bg-[#07111c]" aria-hidden="true">
            <div className="flex h-full" style={{ width: `${week.total / peak * 100}%` }}>
              <span className="h-full bg-[#65d5ff]" style={{ width: `${week.completed / week.total * 100}%` }} />
              <span className="h-full bg-amber-300" style={{ width: `${week.missed / week.total * 100}%` }} />
              <span className="h-full bg-slate-500" style={{ width: `${week.cancelled / week.total * 100}%` }} />
            </div>
          </div>
          <span className="text-right text-xs font-semibold tabular-nums text-white">{week.total}</span>
          <span className="sr-only">{week.completed} concluídos, {week.missed} faltas e {week.cancelled} cancelados.</span>
        </li>
      ))}
    </ul>
  )
}

function BreakdownPanel({ title, description, icon, items }: { title: string; description: string; icon: React.ReactNode; items: { name: string; count: number }[] }) {
  const peak = Math.max(1, ...items.map((item) => item.count))
  const hasCompleted = items.some((item) => item.count > 0)
  return (
    <section className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5 sm:p-6">
      <div className="flex items-center gap-2">{icon}<h2 className="text-lg font-semibold">{title}</h2></div>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {hasCompleted ? <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.name}>
            <div className="flex items-baseline justify-between gap-3 text-sm"><span className="min-w-0 truncate text-slate-200" title={item.name}>{item.name}</span><span className="shrink-0 font-semibold tabular-nums text-white">{item.count}</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#07111c]" aria-hidden="true"><div className="h-full rounded-full bg-[#65d5ff]" style={{ width: `${item.count / peak * 100}%` }} /></div>
          </li>
        ))}
      </ul> : <p className="mt-6 rounded-lg bg-[#07111c] px-4 py-6 text-center text-sm text-slate-400">Nenhum atendimento concluído nesta seleção.</p>}
    </section>
  )
}
