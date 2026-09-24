import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi"

type ClientsStateProps = { kind: "loading" | "empty" | "error"; onRetry?: () => void }

const content = {
  loading: { icon: FiRefreshCw, title: "Carregando clientes", description: "Estamos preparando sua base de clientes." },
  empty: { icon: FiInbox, title: "Nenhum cliente encontrado", description: "Tente alterar a busca ou os filtros selecionados." },
  error: { icon: FiAlertCircle, title: "Não foi possível carregar os clientes", description: "Tente atualizar a lista novamente." },
} as const

export function ClientsState({ kind, onRetry }: ClientsStateProps) {
  const state = content[kind]
  const Icon = state.icon

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0b1a29] px-6 text-center">
      <Icon className={kind === "loading" ? "animate-spin text-[#65d5ff]" : "text-slate-400"} size={25} />
      <p className="mt-4 font-semibold text-slate-100">{state.title}</p>
      <p className="mt-1 text-sm text-slate-400">{state.description}</p>
      {kind === "error" && onRetry ? <button type="button" onClick={onRetry} className="mt-4 text-sm font-semibold text-[#65d5ff] hover:text-white">Tentar novamente</button> : null}
    </div>
  )
}