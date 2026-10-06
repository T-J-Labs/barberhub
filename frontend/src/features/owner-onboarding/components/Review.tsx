import { catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { calculateChecklist, presentationState } from "../checklist"
import { days, dayNames, stepNames, type OnboardingData, type ReleaseScenario, type Step } from "../types"
import { normalizedSubdomain } from "../validation"

// Intenção: conferir a configuração e distinguir conclusão de publicação.
// Hierarquia: estado explícito, resumo em dl e pendências acionáveis; opções
// fictícias nativas em segundo plano. Paleta pública, bordas, Geist e 4/24px.
export function Review({ data, release, onRelease, onGo, origin }: { data: OnboardingData; release: ReleaseScenario; onRelease: (value: ReleaseScenario) => void; onGo: (step: Step) => void; origin: string }) {
  const checklist = calculateChecklist(data), state = presentationState(data, release)
  const titles = { incomplete: "Configuração incompleta", pending: "Configuração completa, liberação pendente", preview: "Configuração e liberação demonstrativas completas" }
  return <div className="space-y-6">
    <div role="status" aria-atomic="true"><h3 className="text-xl font-semibold">{titles[state]}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{state === "incomplete" ? "Corrija as pendências abaixo. O checklist acompanha cada edição." : state === "pending" ? "O checklist está completo, mas isso não publica o estabelecimento. Escolha um cenário fictício para explorar a prévia." : "Prévia liberada somente neste ensaio. Nenhuma compra ou concessão de acesso foi executada; nada foi publicado."}</p></div>
    <dl className="grid gap-4 border-y border-[#26384A] py-5 sm:grid-cols-2">{[
      ["Estabelecimento", data.name], ["Localização", `${data.address} · ${data.neighborhood} · ${data.city}`],
      ["Endereço pretendido (sem link)", `${normalizedSubdomain(data.subdomain)}.${new URL(origin).host}/`],
      ["Serviço de exemplo", `${data.serviceName} · ${data.duration} min · R$ ${data.price} · ${data.serviceActive ? "ativo" : "inativo"}`],
      ["Profissional fictício", `${data.professionalName} · associação: ${data.associatedService || "pendente"}`],
    ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-sm text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium [overflow-wrap:anywhere]">{value || "Pendente"}</dd></div>)}</dl>
    <div><h3 className="font-semibold">Horários de exemplo</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{days.filter(day => data.opening[day].enabled || data.availability[day].enabled).map(day => <li key={day}>{dayNames[day]} · barbearia: {data.opening[day].enabled ? `${data.opening[day].start}–${data.opening[day].end}` : "fechada"} · profissional: {data.availability[day].enabled ? `${data.availability[day].start}–${data.availability[day].end}` : "sem intervalo"}</li>)}</ul></div>
    {!checklist.complete && <section aria-labelledby="pending-title"><h3 id="pending-title" className="font-semibold">Pendências para corrigir</h3><ul className="mt-2 space-y-2">{checklist.issues.map(issue => <li key={issue.field}><button type="button" onClick={() => onGo(issue.step)} className={`min-h-11 rounded text-left text-sm leading-6 text-amber-200 underline underline-offset-4 ${catalogFocusClass}`}>{stepNames[issue.step]}: {issue.message}</button></li>)}</ul></section>}
    <fieldset className="space-y-2"><legend className="mb-3 font-semibold">Cenário fictício de liberação</legend><p className="mb-4 text-sm leading-6 text-slate-400">Regra aprovada: configuração mínima e compra confirmada ou liberação explícita pelo superadmin. Estas opções só apresentam cenários; não realizam pagamento, compra ou concessão.</p>
      {([["pending", "Liberação pendente"], ["purchase", "Cenário fictício: compra confirmada"], ["explicit", "Cenário fictício: liberação explícita pelo superadmin"]] as const).map(([value, label]) => <label key={value} className="flex min-h-11 items-center gap-3 py-2 text-sm"><input type="radio" name="release-scenario" checked={release === value} onChange={() => onRelease(value)} className="size-5 shrink-0 accent-sky-500" />{label}</label>)}
    </fieldset>
    {state === "preview" && <section className="rounded-lg border border-sky-400/30 bg-[#07111C] p-5" aria-labelledby="preview-title"><p className="text-xs font-semibold tracking-wider text-sky-300">PRÉVIA · SEM PUBLICAÇÃO</p><h3 id="preview-title" className="mt-2 text-xl font-semibold [overflow-wrap:anywhere]">{data.name}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{data.serviceName} com {data.professionalName}. Este resultado existe apenas nesta página; não cria perfil público nem altera o catálogo.</p></section>}
  </div>
}
