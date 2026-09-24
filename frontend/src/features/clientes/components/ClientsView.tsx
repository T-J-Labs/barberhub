"use client"

import { useMemo, useState } from "react"
import { FiAlertTriangle, FiMail, FiMoreHorizontal, FiPhone, FiPlus, FiRefreshCw, FiSearch, FiUserCheck, FiUsers } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { ClientsState } from "./ClientsState"
import type { ClientReputation, ClientsData } from "../types"

type ClientsViewProps = { data: ClientsData }
const reputationOptions: Array<"Todas as reputações" | ClientReputation> = ["Todas as reputações", "Ótima", "Regular", "Atenção"]

function reputationClass(reputation: ClientReputation) {
  if (reputation === "Ótima") return "bg-emerald-400/10 text-emerald-400"
  if (reputation === "Atenção") return "bg-red-400/10 text-red-300"
  return "bg-amber-300/10 text-amber-300"
}

export function ClientsView({ data }: ClientsViewProps) {
  const [query, setQuery] = useState("")
  const [reputation, setReputation] = useState<(typeof reputationOptions)[number]>(reputationOptions[0])
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

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#07111c]"><Container><div className="py-7 lg:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-[#65d5ff]">Relacionamento</p><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Clientes</h1><p className="mt-2 text-sm text-slate-400">Acompanhe contas, histórico de agendamentos e reputação dos clientes.</p></div><div className="flex gap-3"><button type="button" onClick={refreshClients} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-[#65d5ff] hover:text-[#65d5ff]"><FiRefreshCw size={16} /> Atualizar</button><button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#65d5ff] px-4 text-sm font-bold text-[#061522] hover:bg-[#8de1ff]"><FiPlus size={17} /> Registrar cliente</button></div></div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3"><article className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5"><span className="grid size-9 place-items-center rounded-lg bg-[#12344a] text-[#65d5ff]"><FiUsers size={18} /></span><p className="mt-4 text-sm text-slate-400">Total de clientes</p><p className="mt-1 text-2xl font-semibold text-white">{data.clients.length}</p></article><article className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5"><span className="grid size-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400"><FiUserCheck size={18} /></span><p className="mt-4 text-sm text-slate-400">Clientes recorrentes</p><p className="mt-1 text-2xl font-semibold text-white">{data.clients.filter((client) => client.appointments >= 10).length}</p></article><article className="rounded-xl border border-slate-800 bg-[#0b1a29] p-5"><span className="grid size-9 place-items-center rounded-lg bg-amber-300/10 text-amber-300"><FiAlertTriangle size={18} /></span><p className="mt-4 text-sm text-slate-400">Precisam de atenção</p><p className="mt-1 text-2xl font-semibold text-white">{attentionCount}</p></article></div>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0b1a29] p-4 sm:flex-row sm:items-center sm:p-5"><label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-slate-400 focus-within:border-[#65d5ff]"><FiSearch size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, telefone ou e-mail" className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" /></label><select aria-label="Filtrar por reputação" value={reputation} onChange={(event) => setReputation(event.target.value as (typeof reputationOptions)[number])} className="h-10 rounded-lg border border-slate-700 bg-[#07111c] px-3 text-sm text-slate-200 outline-none focus:border-[#65d5ff]">{reputationOptions.map((option) => <option key={option}>{option}</option>)}</select></div>

      <div className="mt-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-white">Contas e perfis</h2><p className="mt-1 text-sm text-slate-400">{filteredClients.length} {filteredClients.length === 1 ? "cliente encontrado" : "clientes encontrados"}</p></div><button type="button" onClick={() => setMode("error")} className="shrink-0 text-sm text-slate-500 hover:text-slate-300">Ver estado de erro</button></div>

      <div className="mt-4">{mode !== "ready" ? <ClientsState kind={mode} onRetry={() => setMode("ready")} /> : filteredClients.length === 0 ? <ClientsState kind="empty" /> : <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]"><div className="hidden grid-cols-[minmax(190px,1.4fr)_minmax(190px,1.1fr)_120px_120px_112px_36px] items-center gap-5 border-b border-slate-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:grid"><span>Cliente</span><span>Contato</span><span>Agendamentos</span><span>Última visita</span><span className="text-center">Conta</span><span /></div><div className="hidden lg:block">{filteredClients.map((client) => <div key={client.id} className="grid min-w-0 grid-cols-[minmax(190px,1.4fr)_minmax(190px,1.1fr)_120px_120px_112px_36px] items-center gap-5 border-b border-slate-800/80 px-6 py-4 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white" title={client.name}>{client.name}</p><p className="mt-1 truncate text-xs text-slate-500">{client.email}</p></div><div className="min-w-0 space-y-1 text-xs text-slate-400"><a href={`tel:${client.phone}`} className="flex items-center gap-1.5 truncate hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} />{client.phone}</a><a href={`mailto:${client.email}`} className="flex items-center gap-1.5 truncate hover:text-[#65d5ff]"><FiMail className="shrink-0" size={12} />{client.email}</a></div><div><p className="text-sm font-semibold text-slate-200">{client.appointments}</p><p className="text-xs text-slate-500">{client.noShows} faltas</p></div><p className="text-sm text-slate-400">{client.lastVisit}</p><span className={`justify-self-center whitespace-nowrap rounded-full px-2.5 py-1 text-center text-[11px] font-semibold ${client.accountStatus === "Ativa" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-300/10 text-amber-300"}`}>{client.accountStatus}</span><button type="button" aria-label={`Mais opções para ${client.name}`} className="justify-self-end text-slate-500 hover:text-white"><FiMoreHorizontal /></button></div>)}</div><div className="space-y-3 p-3 lg:hidden">{filteredClients.map((client) => <article key={client.id} className="rounded-lg border border-slate-800 bg-[#102235] p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-base font-semibold text-white">{client.name}</p><a href={`tel:${client.phone}`} className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400 hover:text-[#65d5ff]"><FiPhone className="shrink-0" size={12} />{client.phone}</a></div><div className="flex shrink-0 flex-col items-end gap-2"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${client.accountStatus === "Ativa" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-300/10 text-amber-300"}`}>{client.accountStatus}</span><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${reputationClass(client.reputation)}`}>{client.reputation}</span></div></div><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-700/70 pt-3 text-xs"><div><span className="block text-slate-500">Agendamentos</span><span className="mt-1 block text-sm font-semibold text-slate-200">{client.appointments} <span className="text-xs font-normal text-slate-500">({client.noShows} faltas)</span></span></div><div><span className="block text-slate-500">Última visita</span><span className="mt-1 block truncate text-sm text-slate-200">{client.lastVisit}</span></div></div><div className="mt-3 flex items-center justify-between border-t border-slate-700/70 pt-3"><a href={`mailto:${client.email}`} className="flex min-w-0 items-center gap-1.5 truncate text-xs text-slate-400 hover:text-[#65d5ff]"><FiMail className="shrink-0" size={12} />{client.email}</a><button type="button" aria-label={`Mais opções para ${client.name}`} className="ml-3 shrink-0 text-slate-500 hover:text-white"><FiMoreHorizontal /></button></div></article>)}</div></div>}</div>
    </div></Container></div>
  )
}