import type { InputHTMLAttributes } from "react"
import { catalogFieldClass } from "@/features/barbershop-catalog/styles"
import { days, dayNames, type Issue, type OnboardingData, type Step } from "../types"
import { limits, maxDuration, normalizedSubdomain } from "../validation"

// Intenção: proprietário ensaiando a abertura, com uma tarefa por folha.
// Hierarquia: rótulo 14/600, valor 16px e ajuda 14/slate-400; Geist existente.
// Paleta: pública aprovada (aço/slate, azul sky de ação e superfície marinho).
// Profundidade: bordas sutis, input recuado; base 4px, grupos 24px, alvo 48px.
function Field({ label, id, issues, help, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; issues: Issue[]; help: string }) {
  const error = issues.find(issue => issue.field === id)
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-200">{label}</label>
    <input required {...input} id={id} className={catalogFieldClass} aria-invalid={Boolean(error)} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`} />
    <p id={`${id}-help`} className="text-sm leading-6 text-slate-400">{help}</p>
    {error && <p id={`${id}-error`} className="text-sm leading-6 text-amber-200">{error.message}</p>}
  </div>
}
type Props = { data: OnboardingData; issues: Issue[]; onChange: (data: OnboardingData) => void }
export function StepFields({ step, data, issues, onChange, origin }: Props & { step: Step; origin: string }) {
  function text(field: keyof typeof limits | "duration" | "price", label: string, help: string, extra: InputHTMLAttributes<HTMLInputElement> = {}) {
    return <Field key={field} label={label} id={field} issues={issues} help={help} value={data[field]} onChange={event => onChange({ ...data, [field]: event.target.value })} maxLength={field in limits ? limits[field as keyof typeof limits] : undefined} {...extra} />
  }
  return <div className="space-y-6">
    {step === 0 && <>
      {text("name", "Nome da barbearia", "Até 120 caracteres. Use somente dados fictícios.")}
      {text("address", "Endereço fictício", "Rua e número de exemplo; até 160 caracteres.")}
      <div className="grid gap-6 sm:grid-cols-2">{text("city", "Cidade", "Até 80 caracteres.")}{text("neighborhood", "Bairro", "Até 80 caracteres.")}</div>
      <p className="text-sm leading-6 text-slate-400">Logo opcional: este ensaio não recebe arquivos.</p>
    </>}
    {step === 1 && <>
      {text("subdomain", "Subdomínio pretendido", "Até 63 caracteres. A conferência usa somente a amostra local.", { autoCapitalize: "none", spellCheck: false })}
      <div className="rounded-lg border border-[#26384A] bg-[#07111C] p-4"><p className="text-xs font-semibold tracking-wider text-slate-400">PRÉVIA DO ENDEREÇO · SEM LINK</p><p className="mt-2 font-medium text-sky-300 [overflow-wrap:anywhere]">{normalizedSubdomain(data.subdomain) || "seu-exemplo"}.{new URL(origin).host}/</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{issues.some(issue => issue.field === "subdomain") ? "Corrija o endereço pretendido para continuar." : "Válido na demonstração."} Nenhum endereço acessível é criado; esta prévia não verifica contratação.</p></div>
    </>}
    {step === 2 && <>
      {text("serviceName", "Nome do serviço", "Um serviço inicial; até 80 caracteres.")}
      <div className="grid gap-6 sm:grid-cols-2">{text("duration", "Duração (minutos)", `De 1 a ${maxDuration} minutos inteiros.`, { type: "number", min: 1, max: maxDuration, step: 1, inputMode: "numeric" })}{text("price", "Preço de exemplo (R$)", "De 0 a 9.999,99; até duas casas decimais. Sem cobrança.", { inputMode: "decimal", maxLength: 7 })}</div>
      <label className="flex min-h-11 items-center gap-3 text-sm"><input id="serviceActive" type="checkbox" checked={data.serviceActive} onChange={event => onChange({ ...data, serviceActive: event.target.checked })} className="size-5 accent-sky-500" aria-invalid={issues.some(issue => issue.field === "serviceActive")} aria-describedby="active-help" />Serviço ativo na demonstração</label>
      <p id="active-help" className="text-sm text-slate-400">{issues.find(issue => issue.field === "serviceActive")?.message ?? "O checklist exige um serviço ativo."}</p>
    </>}
    {step === 3 && <>
      {text("professionalName", "Nome fictício do profissional", "Um profissional inicial; até 80 caracteres. Não cria conta ou vínculo.")}
      <label className="flex min-h-11 items-center gap-3 text-sm"><input id="associatedService" type="checkbox" checked={Boolean(data.serviceName.trim()) && data.associatedService === data.serviceName.trim()} onChange={event => onChange({ ...data, associatedService: event.target.checked ? data.serviceName.trim() : "" })} disabled={!data.serviceName.trim()} className="size-5 shrink-0 accent-sky-500" aria-invalid={issues.some(issue => issue.field === "associatedService")} aria-describedby="association-help" /><span className="[overflow-wrap:anywhere]">Associar a {data.serviceName.trim() || "um serviço (preencha a etapa anterior)"}</span></label>
      <p id="association-help" className="text-sm leading-6 text-slate-400">{issues.find(issue => issue.field === "associatedService")?.message ?? "Associação fictícia ao serviço escolhido."}</p>
    </>}
    {step === 4 && <HoursStep data={data} issues={issues} onChange={onChange} />}
  </div>
}

// Intenção: conferir expediente e encaixe do atendimento no mesmo dia.
// Hierarquia: dia/600, estabelecimento antes do profissional, avisos junto ao
// intervalo; paleta, input recuado, bordas, Geist e ritmo 4/24px da folha acima.
function HoursStep({ data, issues, onChange }: Props) {
  return <div className="space-y-5"><p className="text-sm leading-6 text-slate-300">Um intervalo por dia, sem atravessar a meia-noite. Ative os dias necessários; a disponibilidade deve caber no funcionamento e comportar o serviço.</p>
    {days.map(day => <fieldset key={day} className="min-w-0 rounded-lg border border-[#26384A] p-4"><legend className="px-2 font-semibold">{dayNames[day]}</legend>
      <div className="grid gap-5 xl:grid-cols-2">{(["opening", "availability"] as const).map(kind => {
        const interval = data[kind][day], field = `${kind}-${day}`, label = kind === "opening" ? "Barbearia aberta" : "Profissional atende"
        const error = issues.find(issue => issue.field === field)
        const update = (change: Partial<typeof interval>) => onChange({ ...data, [kind]: { ...data[kind], [day]: { ...interval, ...change } } })
        return <div key={kind} className="min-w-0 space-y-3">
          <label className="flex min-h-11 items-center gap-3 text-sm"><input id={field} className="size-5 accent-sky-500" type="checkbox" checked={interval.enabled} onChange={event => update({ enabled: event.target.checked })} aria-invalid={Boolean(error)} aria-describedby={error ? `${field}-error` : kind === "availability" && issues.some(issue => issue.field === "availability") ? "availability" : undefined} />{label}</label>
          {interval.enabled && <div className="grid min-w-0 grid-cols-1 gap-3 min-[390px]:grid-cols-2">{(["start", "end"] as const).map(edge => <label key={edge} className="min-w-0 space-y-2 text-sm text-slate-300"><span className="block">{edge === "start" ? "Início" : "Fim"}<span className="sr-only"> · {label} · {dayNames[day]}</span></span><input id={`${field}-${edge}`} required type="time" className={`${catalogFieldClass} px-2`} value={interval[edge]} onChange={event => update({ [edge]: event.target.value })} aria-invalid={Boolean(error)} aria-describedby={error ? `${field}-error` : undefined} /></label>)}</div>}
          {error && <p id={`${field}-error`} className="text-sm leading-6 text-amber-200">{error.message}</p>}
        </div>
      })}</div>
    </fieldset>)}
    {issues.some(issue => issue.field === "availability") && <p id="availability" className="text-sm leading-6 text-amber-200">{issues.find(issue => issue.field === "availability")?.message}</p>}
  </div>
}
