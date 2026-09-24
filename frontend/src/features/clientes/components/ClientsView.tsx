"use client"

import { useMemo, useState } from "react"
import { FiAlertTriangle, FiArrowUpRight, FiMail, FiMoreHorizontal, FiPhone, FiPlus, FiRefreshCw, FiSearch, FiUserCheck, FiUsers } from "react-icons/fi"
import { Container } from "../../../components/ui/Container"
import { ClientsState } from "./ClientsState"
import type { ClientReputation, ClientsData } from "../types"

type ClientsViewProps = { data: ClientsData }
type ReputationFilter = "Todas as reputações" | ClientReputation

const reputationOptions: ReputationFilter[] = ["Todas as reputações", "Ótima", "Regular", "Atenção"]

function reputationClass(reputation: ClientReputation) {
  if (reputation === "Ótima") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
  if (reputation === "Atenção") return "border-red-400/40 bg-red-400/10 text-red-300"
  return "border-amber-300/40 bg-amber-300/10 text-amber-200"
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("")
}

export function ClientsView({ data }: ClientsViewProps) {
  const [query, setQuery] = useState("")
  const [reputation, setReputation] = useState<ReputationFilter>(reputationOptions[0])
  const [mode, setMode] = useState<"ready" | "loading" | "error">("ready")
  const filteredClients = useMemo(() => data.clients.filter((client) => {
    const normalizedQuery = query.toLowerCase().trim()
    const matchesQuery = !normalizedQuery || `${client.name} ${client.phone} ${client.email}`.toLowerCase().includes(normalizedQuery)
    return matchesQuery && (reputation === reputationOptions[0] || client.reputation === reputation)
  }), [data.clients, query, reputation])

  function refreshClients() {
    setMode("loading")
    window.setTimeout(() => setMode("ready"), 500)
  }

  const attentionCount = data.clients.filter((client) => client.reputation === "Atenção").length
  const recurringCount = data.clients.filter((client) => client.appointments >= 10).length
  const totalSpent = data.clients.reduce((total, client) => total + Number(client.totalSpent.replace("R$ ", "").replace(".", "")), 0)
  const formattedTotal = `R$ ${totalSpent.toLocaleString("pt-BR")}`

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c] text-white">
      <Container>
        <div className="py-7 lg:py-10">
          <header className="flex flex-col justify-between gap-6 border-b border-slate-800/90 pb-7 md:grid md:grid-cols-[minmax(0,1fr)_220px] md:items-end lg:flex lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-medium text-[#65d5ff]">Relacionamento</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Clientes</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Conheça quem volta, quem precisa de um lembrete e o valor que sua casa já gerou.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={refreshClients} className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-700 p-3 text-sm font-semibold text-slate-200 transition hover:border-[#65d5ff] hover:text-[#65d5ff] md:w-full"><FiRefreshCw className="shrink-0" size={16} /> Atualizar</button>
              <button type="button" className="clients-action-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#65d5ff] p-3 text-sm font-bold text-[#061522] transition hover:bg-[#8de1ff] md:w-full"><FiPlus className="shrink-0" size={17} /><span className="truncate">Registrar cliente</span></button>
            </div>
          </header>

          <section aria-label="Resumo dos clientes" className="mt-6 grid overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29] sm:grid-cols-2 xl:grid-cols-4">
            <Summary icon={<FiUsers size={18} />} label="Base ativa" value={String(data.clients.length)} detail="clientes cadastrados" />
            <Summary icon={<FiUserCheck size={18} />} label="Recorrentes" value={String(recurringCount)} detail="10 ou mais visitas" tone="positive" />
            <Summary icon={<FiAlertTriangle size={18} />} label="Pedem atenção" value={String(attentionCount)} detail="reputação para acompanhar" tone="warning" />
            <Summary icon={<FiArrowUpRight size={18} />} label="Valor gerado" value={formattedTotal} detail="histórico da base" />
          </section>

          <section className="mt-6 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-slate-400 transition focus-within:border-[#65d5ff]">
                <FiSearch size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, telefone ou e-mail" className="py-2 min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" />
              </label>
              <select aria-label="Filtrar por reputação" value={reputation} onChange={(event) => setReputation(event.target.value as ReputationFilter)} className="h-11 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none transition focus:border-[#65d5ff] lg:min-w-48">
                {reputationOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
          </section>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div><div className="flex items-center gap-2"><FiUsers className="text-[#65d5ff]" /><h2 className="text-lg font-semibold">Pessoas da casa</h2></div><p className="mt-2 text-sm text-slate-400">{filteredClients.length} {filteredClients.length === 1 ? "cliente encontrado" : "clientes encontrados"}</p></div>
            <button type="button" onClick={() => setMode("error")} className="shrink-0 text-xs font-semibold text-slate-500 transition hover:text-slate-200">Simular erro</button>
          </div>

          <div className="mt-4">
            {mode !== "ready" ? <ClientsState kind={mode} onRetry={() => setMode("ready")} /> : filteredClients.length === 0 ? <ClientsState kind="empty" /> : <ClientList clients={filteredClients} />}
          </div>
        </div>
      </Container>
    </div>
  )
}

type SummaryProps = { icon: React.ReactNode; label: string; value: string; detail: string; tone?: "positive" | "warning" }

function Summary({ icon, label, value, detail, tone }: SummaryProps) {
  const iconTone = tone === "positive" ? "bg-emerald-400/10 text-emerald-300" : tone === "warning" ? "bg-amber-300/10 text-amber-200" : "bg-[#12344a] text-[#65d5ff]"
  const valueTone = tone === "positive" ? "text-emerald-300" : tone === "warning" ? "text-amber-200" : "text-white"
  return <div className="border-b border-slate-800 p-5 last:border-0 sm:border-r sm:nth-[2n]:border-r-0 xl:border-b-0 xl:border-r xl:last:border-r-0"><span className={`grid size-9 place-items-center rounded-lg ${iconTone}`}>{icon}</span><p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className={`mt-1 text-2xl font-semibold ${valueTone}`}>{value}</p><p className="mt-2 text-xs text-slate-400">{detail}</p></div>
}

type ClientListProps = { clients: ClientsData["clients"] }

function ClientList({ clients }: ClientListProps) {
  return <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]">
    <div className="hidden grid-cols-[minmax(210px,1.4fr)_minmax(190px,1.1fr)_110px_120px_112px_38px] items-center gap-5 border-b border-slate-800 bg-[#0d1d2d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid"><span>Cliente</span><span>Contato</span><span>Histórico</span><span>Última visita</span><span className="text-center">Reputação</span><span /></div>
    <div className="hidden lg:block">{clients.map((client, index) => <ClientRow key={client.id} client={client} highlighted={index === 0} />)}</div>
    <div className="space-y-3 p-3 lg:hidden">{clients.map((client, index) => <ClientCard key={client.id} client={client} highlighted={index === 0} />)}</div>
  </div>
}

type ClientItemProps = { client: ClientsData["clients"][number]; highlighted?: boolean }

function ClientRow({ client, highlighted }: ClientItemProps) {
  return <div className={`relative grid min-w-0 grid-cols-[minmax(210px,1.4fr)_minmax(190px,1.1fr)_110px_120px_112px_38px] items-center gap-5 border-b border-slate-800/80 px-6 py-4 last:border-0 transition hover:bg-[#102235] ${highlighted ? "bg-[#102235]/60" : ""}`}>{highlighted && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#65d5ff]" />}<div className="flex min-w-0 items-center gap-3"><Avatar name={client.name} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{client.name}</p><p className="mt-1 truncate text-xs text-slate-500">{client.accountStatus}</p></div></div><Contact client={client} /><History client={client} /><p className="text-sm text-slate-400">{client.lastVisit}</p><Reputation reputation={client.reputation} /><button type="button" aria-label={`Mais opções para ${client.name}`} className="flex justify-end text-slate-500 transition hover:text-white"><FiMoreHorizontal /></button></div>
}

function ClientCard({ client, highlighted }: ClientItemProps) {
  return <article className={`relative rounded-lg border border-slate-800 bg-[#102235] p-4 ${highlighted ? "border-[#65d5ff]/50" : ""}`}><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><Avatar name={client.name} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{client.name}</p><p className="mt-1 truncate text-xs text-slate-500">{client.accountStatus}</p></div></div><div className="flex items-center gap-2"><Reputation reputation={client.reputation} /><button type="button" aria-label={`Mais opções para ${client.name}`} className="grid size-8 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"><FiMoreHorizontal /></button></div></div><div className="mt-4 border-t border-slate-700/70 pt-3"><Contact client={client} /></div><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-700/70 pt-3 text-xs sm:grid-cols-4"><div><span className="block text-slate-500">Visitas</span><span className="mt-1 block font-semibold text-slate-200">{client.appointments}</span></div><div><span className="block text-slate-500">Faltas</span><span className="mt-1 block font-semibold text-slate-200">{client.noShows}</span></div><div><span className="block text-slate-500">Última</span><span className="mt-1 block truncate font-semibold text-slate-200">{client.lastVisit}</span></div><div><span className="block text-slate-500">Valor gerado</span><span className="mt-1 block truncate font-semibold text-slate-200">{client.totalSpent}</span></div></div></article>
}

function Avatar({ name }: { name: string }) { return <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#12344a] text-xs font-bold text-[#8de1ff]">{initials(name)}</span> }
function Contact({ client }: { client: ClientsData["clients"][number] }) { return <div className="min-w-0 space-y-1 text-xs text-slate-400"><a href={`tel:${client.phone}`} className="flex items-center gap-1.5 truncate hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} />{client.phone}</a><a href={`mailto:${client.email}`} className="flex items-center gap-1.5 truncate hover:text-[#65d5ff]"><FiMail className="shrink-0" size={12} />{client.email}</a></div> }
function History({ client }: { client: ClientsData["clients"][number] }) { return <div><p className="text-sm font-semibold text-slate-200">{client.appointments} visitas</p><p className="text-xs text-slate-500">{client.noShows} faltas</p><p className="mt-1 text-xs text-slate-500">{client.totalSpent}</p></div> }
function Reputation({ reputation }: { reputation: ClientReputation }) { return <span className={`justify-self-center whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold ${reputationClass(reputation)}`}>{reputation}</span> }
