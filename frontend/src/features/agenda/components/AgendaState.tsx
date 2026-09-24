import { FiAlertCircle, FiCalendar, FiInbox, FiRefreshCw } from "react-icons/fi"

type AgendaStateProps = { kind: "loading" | "empty" | "error"; onRetry?: () => void }

const stateContent = {
  loading: { icon: FiRefreshCw, title: "Carregando agenda", description: "Estamos buscando os horários do dia." },
  empty: { icon: FiInbox, title: "Agenda livre", description: "Não há agendamentos para os filtros selecionados." },
  error: { icon: FiAlertCircle, title: "Não foi possível carregar a agenda", description: "Tente atualizar os horários novamente." },
} as const

export function AgendaState({ kind, onRetry }: AgendaStateProps) {
  const content = stateContent[kind]
  const Icon = content.icon

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
      <Icon className={kind === "loading" ? "animate-spin text-[#65d5ff]" : "text-slate-400"} size={25} />
      <p className="mt-4 font-semibold text-slate-100">{content.title}</p>
      <p className="mt-1 text-sm text-slate-400">{content.description}</p>
      {kind === "error" && onRetry ? <button type="button" onClick={onRetry} className="mt-4 text-sm font-semibold text-[#65d5ff] hover:text-white">Tentar novamente</button> : null}
      {kind === "empty" ? <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#65d5ff] hover:text-white"><FiCalendar size={15} /> Criar agendamento</button> : null}
    </div>
  )
}