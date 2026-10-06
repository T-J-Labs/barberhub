import Link from "next/link"
import type { demoHistory } from "../state"
import { formatDemoDate, statusLabels } from "../state"
import { actionClass, panelClass } from "../styles"

// Intenção: consultar o que já foi finalizado na amostra. Data completa, horário e estado lideram
// linhas compactas; o resumo recua diante do próximo atendimento. Mesma paleta
// privada e superfície #0b1a29, bordas sutis, Geist 20/14px, base 4px e toque 44px.
export function DemoHistory({ history, summary, renderDetails }: {
  history: ReturnType<typeof demoHistory>
  summary: boolean
  renderDetails: (item: ReturnType<typeof demoHistory>["items"][number]) => React.ReactNode
}) {
  const items = summary ? history.items.slice(0, 2) : history.items
  const titleId = summary ? "history-summary-title" : "history-title"
  return <section id={summary ? undefined : "historico"} aria-labelledby={summary ? titleId : undefined} aria-label={summary ? undefined : "Atendimentos anteriores"} className="mt-8 scroll-mt-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        {summary && <h2 id={titleId} className="text-xl font-semibold">Resumo do histórico</h2>}
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {history.completed} {history.completed === 1 ? "concluído" : "concluídos"} · {history.noShow} {history.noShow === 1 ? "falta" : "faltas"} no histórico da amostra
        </p>
        {summary && items.length > 0 && <p className="mt-1 text-xs leading-5 text-slate-400">Até dois atendimentos mais recentes da amostra.</p>}
      </div>
      {summary && <Link href="/barbeiro/historico" className={actionClass}>Ver histórico completo</Link>}
    </div>
    {items.length ? <ul className={`${panelClass} divide-y divide-slate-800`}>
      {items.map((item) => <li key={item.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="mb-2 font-semibold text-white"><time dateTime={`${item.date}T${item.start}:00-03:00`}>{formatDemoDate(item.date)}</time></p>
          <p className="font-semibold tabular-nums text-slate-300">{item.start}–{item.end} · {statusLabels[item.status]}</p>
          <h3 className="mt-2 font-medium">{item.client}</h3>
          <p className="mt-1 text-sm text-slate-400">{item.service}</p>
        </div>
        <div className="shrink-0">{renderDetails(item)}</div>
      </li>)}
    </ul> : <p className={`${panelClass} p-5 text-sm leading-6 text-slate-400`}>Nenhum atendimento concluído ou marcado como falta nesta amostra.</p>}
  </section>
}
