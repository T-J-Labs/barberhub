import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi"

type DashboardStateProps = {
  kind: "loading" | "empty" | "error"
  onRetry?: () => void
}

const stateContent = {
  loading: { icon: FiRefreshCw, title: "Carregando dados", description: "Estamos preparando o resumo da sua operação." },
  empty: { icon: FiInbox, title: "Nenhum agendamento", description: "Ainda não há horários registrados para este dia." },
  error: { icon: FiAlertCircle, title: "Não foi possível carregar", description: "Tente atualizar os dados novamente." },
} as const

export function DashboardState({ kind, onRetry }: DashboardStateProps) {
  const content = stateContent[kind]
  const Icon = content.icon

  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
      <Icon className={kind === "loading" ? "animate-spin text-[#65d5ff]" : "text-slate-400"} size={24} />
      <div>
        <p className="font-semibold text-slate-100">{content.title}</p>
        <p className="mt-1 text-sm text-slate-400">{content.description}</p>
      </div>
      {kind === "error" && onRetry ? (
        <button type="button" onClick={onRetry} className="mt-1 text-sm font-semibold text-[#65d5ff] hover:text-white">
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}