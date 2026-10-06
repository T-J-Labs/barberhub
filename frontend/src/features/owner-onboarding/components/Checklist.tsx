import { catalogFocusClass, catalogPanelClass } from "@/features/barbershop-catalog/styles"
import { calculateChecklist } from "../checklist"
import type { OnboardingData, Step } from "../types"

// Intenção: saber o que falta para a abertura; contagem deriva dos requisitos.
// Hierarquia: 5 linhas textuais de pendências com ação, sem KPIs decorativos.
// Superfície pública/bordas sutis, Geist 16/14px, sky de foco, ritmo 4/16/24px.
export function Checklist({ data, onGo }: { data: OnboardingData; onGo: (step: Step) => void }) {
  const checklist = calculateChecklist(data)
  return <aside className={`${catalogPanelClass} min-w-0 self-start p-5 sm:p-6`} aria-labelledby="checklist-title">
    <h2 id="checklist-title" className="text-lg font-semibold">Checklist de abertura</h2>
    <p role="status" aria-atomic="true" className="mt-2 text-sm tabular-nums text-sky-300">{checklist.count} de 5 requisitos completos na demonstração.</p>
    <ul className="mt-4 space-y-3">{checklist.items.map(item => <li key={item.step}><button type="button" onClick={() => onGo(item.step)} className={`flex min-h-11 w-full items-start gap-3 rounded-lg py-2 text-left text-sm ${catalogFocusClass}`}><span className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true">{item.complete ? "✓" : "○"}</span><span>{item.label}<span className="mt-1 block text-xs text-slate-400">{item.complete ? "Completo" : "Pendente · corrigir etapa"}</span></span></button></li>)}</ul>
    <p className="mt-5 border-t border-[#26384A] pt-4 text-sm leading-6 text-slate-400">Completar os requisitos não publica a barbearia. A liberação é apresentada separadamente, sempre como cenário fictício.</p>
  </aside>
}
