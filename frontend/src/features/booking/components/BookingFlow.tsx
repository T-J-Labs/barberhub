"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { FiArrowLeft, FiCalendar, FiCheck, FiScissors } from "react-icons/fi"
import { useDemoClientPresentation } from "@/features/auth/components/DemoClientProvider"
import { catalogActionClass, catalogFieldClass, catalogFocusClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { demoProfessionals, demoScenarios, demoSlots } from "../demo-data"
import { changeSelection, demonstrateConflict, emptySelection, firstInvalidStep } from "../selection"
import type { BookingDemoData, BookingSelection, DemoScenario } from "../types"
import { ChoiceField } from "./ChoiceField"

const steps = ["Serviço", "Profissional", "Data", "Horário", "Revisão"]
const titles = ["Qual cuidado você procura?", "Quem cuida do seu estilo?", "Escolha uma data de exemplo", "Escolha um horário de exemplo", "Confira sua visita de exemplo"]
const fields = ["service", "professional", "date", "slot"] as const
const prompts = ["Escolha um serviço de exemplo para continuar.", "Escolha um profissional de exemplo para continuar.", "Escolha uma data de exemplo para continuar.", "Escolha um horário de exemplo para continuar."]
const priceFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
type Props = { shopName: string; data: BookingDemoData; loginHref: string | null; signupHref: string | null; returnHref: string }

// Intenção: cliente monta uma visita com calma; cada escolha lidera a etapa e a ficha preserva
// o estabelecimento. Geist 32/16/14px, azul de ação, fundo/superfícies/bordas públicas;
// profundidade por bordas, densidade 20/32px e espaçamento de 4px, sem nova paleta.
export function BookingFlow({ shopName, data, loginHref, signupHref, returnHref }: Props) {
  const { presentation } = useDemoClientPresentation()
  const [exploring, setExploring] = useState(false)
  const [selection, setSelection] = useState<BookingSelection>(emptySelection)
  const [step, setStep] = useState(0)
  const [scenario, setScenario] = useState<DemoScenario>("normal")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [finished, setFinished] = useState(false)
  const [unavailableExample, setUnavailableExample] = useState<BookingSelection | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const operation = useRef(0)
  const lock = useRef(false)
  const started = exploring
  const service = data.services.find((item) => item.key === selection.service)
  const professional = data.professionals.find((item) => item.key === selection.professional)
  const date = data.dates.find((item) => item.key === selection.date)
  const services = scenario === "no-services" ? [] : data.services
  const professionals = demoProfessionals(data, selection.service, scenario)
  const slots = demoSlots(data, selection, scenario, unavailableExample)
  const invalidStep = firstInvalidStep(data, selection, scenario, unavailableExample)
  const recoveringConflict = unavailableExample && unavailableExample.service === selection.service
    && unavailableExample.professional === selection.professional && unavailableExample.date === selection.date
  const loading = pending || scenario === "loading"

  useEffect(() => { if (started) heading.current?.focus() }, [step, started, finished])
  useEffect(() => () => { operation.current++ }, [])

  function select(field: keyof BookingSelection, value: string) {
    setSelection((current) => changeSelection(current, field, value))
    setError("")
  }
  function reset(nextScenario: DemoScenario = "normal") {
    operation.current++
    lock.current = false
    setPending(false)
    setScenario(nextScenario)
    setSelection(emptySelection)
    setError("")
    setFinished(false)
    setUnavailableExample(null)
    setStep(nextScenario === "invalid-review" ? 4 : 0)
  }
  function goTo(nextStep: number) { setError(""); setStep(nextStep) }
  async function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (lock.current || loading) return
    if (invalidStep !== null && invalidStep <= step) {
      setError(prompts[invalidStep])
      requestAnimationFrame(() => {
        if (step === 4) heading.current?.focus()
        else document.querySelector<HTMLInputElement>(`input[name="${fields[step]}"]`)?.focus()
      })
      return
    }
    if (step < 4) { goTo(step + 1); return }
    lock.current = true
    const currentOperation = ++operation.current
    setPending(true)
    setError("")
    // Atraso apenas de apresentação. Nenhuma chamada ou resposta de rede simulada.
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (currentOperation !== operation.current) return
    lock.current = false
    setPending(false)
    if (scenario === "conflict" && !unavailableExample) {
      const conflict = demonstrateConflict(selection)
      setUnavailableExample(conflict.unavailableExample)
      setSelection(conflict.selection)
      setStep(3)
    } else if (scenario === "final-error") {
      setError("Erro demonstrativo na conclusão. Nenhuma tentativa de reserva foi enviada; nenhum horário foi reservado.")
      requestAnimationFrame(() => heading.current?.focus())
    } else setFinished(true)
  }

  return <div className="mx-auto max-w-5xl">
    <Link href={returnHref} className={`mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-sky-300 ${catalogFocusClass}`}><FiArrowLeft aria-hidden="true" />Voltar para {shopName}</Link>
    <div className="mb-8 border-l-2 border-sky-400 pl-4">
      <p className="text-xs font-semibold tracking-widest text-sky-400">AGENDAMENTO DEMONSTRATIVO</p>
      <p className="mt-2 text-xl font-semibold break-words">{shopName}</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#B6C2D1]">Serviços, profissionais, datas, preços e horários são exemplos locais. Não representam disponibilidade real. Nenhum horário será reservado.</p>
    </div>

    {!started ? <section className={`${catalogPanelClass} max-w-2xl p-5 sm:p-8`} aria-labelledby="booking-access-title">
      <FiCalendar className="text-sky-400" size={28} aria-hidden="true" />
      <h1 id="booking-access-title" className="mt-4 text-3xl font-semibold tracking-tight">Seu horário, passo a passo</h1>
      <p className="mt-3 text-base leading-7 text-[#B6C2D1]">Para agendar no futuro, você usará sua conta BarberHub. O acesso com Google ainda está indisponível. Login e cadastro voltam ao perfil desta barbearia.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {loginHref && <Link href={loginHref} className={catalogActionClass}>Ir para login</Link>}
        {signupHref && <Link href={signupHref} className={`inline-flex items-center ${catalogSecondaryActionClass}`}>Ir para cadastro</Link>}
      </div>
      <div className="mt-6 border-t border-[#26384A] pt-6">
        <p id="demo-explore-note" className="text-sm leading-6 text-slate-300">Você também pode explorar esta demonstração sem autenticação. Isso não cria conta nem inicia uma sessão.</p>
        <button type="button" aria-describedby="demo-explore-note" onClick={() => setExploring(true)} className={`mt-4 py-3 ${catalogActionClass}`}>Experimentar demonstração</button>
      </div>
    </section> : <>
      <nav aria-label="Etapas do agendamento demonstrativo" className="mb-6">
        <ol className="grid grid-cols-5 gap-1 sm:gap-3">{steps.map((label, index) => <li key={label} aria-current={!finished && index === step ? "step" : undefined} className={`min-w-0 border-t-2 pt-3 ${index <= step ? "border-sky-400" : "border-[#26384A]"}`}>
          <span className={`text-sm font-semibold ${index === step ? "text-sky-300" : "text-slate-400"}`}>{index + 1}<span className="hidden sm:inline">. {label}</span></span>
        </li>)}</ol>
        <p className="mt-3 text-sm text-slate-300">{finished ? "Demonstração concluída" : `Etapa ${step + 1} de 5 · ${steps[step]}`}</p>
      </nav>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${catalogPanelClass} min-w-0 p-5 sm:p-8`}>
          <h1 ref={heading} tabIndex={-1} className={`text-2xl font-semibold tracking-tight sm:text-3xl ${catalogFocusClass}`}>{finished ? "Você explorou o agendamento" : titles[step]}</h1>
          {finished ? <>
            <FiCheck size={32} aria-hidden="true" className="mt-6 text-sky-400" />
            <p role="status" className="mt-4 text-lg font-semibold leading-7">Esta é uma demonstração; nenhum horário foi reservado.</p>
            <p className="mt-3 text-sm leading-6 text-[#B6C2D1]">Suas escolhas serviram apenas para conhecer a experiência. Não há reserva, protocolo ou confirmação real. Esta demonstração não adiciona agendamentos à área global do cliente.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => reset()} className={catalogActionClass}>Explorar novamente</button><Link href={returnHref} className={`inline-flex items-center justify-center ${catalogSecondaryActionClass}`}>Voltar à barbearia</Link></div>
          </> : <form onSubmit={(event) => { void advance(event) }} noValidate aria-busy={loading} className="mt-6">
            {loading ? <div role="status" aria-live="polite" className="rounded-lg bg-[#07111C] p-5"><p className="font-semibold">{pending ? "Preparando resultado demonstrativo…" : "Carregamento demonstrativo…"}</p><p className="mt-2 text-sm leading-6 text-slate-400">Estado local de apresentação. Nenhuma requisição foi enviada.</p></div> : <>
              {step === 3 && recoveringConflict && <p id="slot-conflict-note" role="alert" className="mb-5 rounded-lg border border-amber-300/30 p-4 text-sm leading-6 text-amber-200">Conflito demonstrativo: o horário {unavailableExample.slot} ficou indisponível neste exemplo. Nenhum horário foi reservado. Escolha outro horário local ou volte para alterar a data.</p>}
              {step === 0 && (services.length ? <ChoiceField name="service" legend="Serviços de exemplo" value={selection.service} onChange={(value) => select("service", value)} error={error} options={services.map((item) => ({ key: item.key, label: item.name, description: `${item.description} ${item.durationMinutes} min de exemplo.`, detail: priceFormat.format(item.price) }))} /> : <EmptyState title="Nenhum serviço de exemplo" description="Não há serviços locais para este cenário ou estabelecimento. Nenhuma consulta real foi realizada." />)}
              {step === 1 && (professionals.length ? <ChoiceField name="professional" legend="Profissionais de exemplo para este serviço" value={selection.professional} onChange={(value) => select("professional", value)} error={error} options={professionals.map((item) => ({ key: item.key, label: item.name, description: item.description }))} /> : <EmptyState title="Nenhum profissional de exemplo" description="Este cenário não apresenta profissionais para a seleção. Volte ao serviço ou escolha outro cenário demonstrativo." />)}
              {step === 2 && (data.dates.length ? <ChoiceField name="date" legend="Datas fixas ilustrativas · não são uma agenda real" value={selection.date} onChange={(value) => select("date", value)} error={error} options={data.dates.map((item) => ({ key: item.key, label: item.label, description: item.key === "2026-10-14" ? "Exemplo sem horários." : "Data de exemplo." }))} /> : <EmptyState title="Nenhuma data de exemplo" description="Não há datas locais para este estabelecimento." />)}
              {step === 3 && (scenario === "error" ? <div role="alert"><EmptyState title="Erro demonstrativo ao exibir horários" description="Esta falha é um exemplo local. Nenhuma disponibilidade foi consultada." /><button type="button" className={`mt-4 ${catalogSecondaryActionClass}`} onClick={() => { setScenario("normal"); setError("") }}>Tentar exemplo novamente</button></div> : slots.length ? <ChoiceField name="slot" legend="Horários locais de exemplo · horário de Brasília" compact value={selection.slot} onChange={(value) => select("slot", value)} error={error} describedBy={recoveringConflict ? "slot-conflict-note" : undefined} options={slots.map((slot) => ({ key: slot, label: slot }))} /> : <EmptyState title="Nenhum horário de exemplo" description="Este cenário ou data não tem horários locais. Volte e escolha outra data; isso não indica que a agenda real esteja ocupada." />)}
              {step === 4 && <>
                <p className="text-sm leading-6 text-[#B6C2D1]">Revise serviço, profissional, data e horário abaixo. Valores e duração são ilustrativos.</p>
                <dl className="mt-5 divide-y divide-[#26384A]">{[
                  { label: "Serviço", value: service ? `${service.name} · ${service.durationMinutes} min · ${priceFormat.format(service.price)}` : "Não selecionado", target: 0 },
                  { label: "Profissional", value: professional?.name ?? "Não selecionado", target: 1 },
                  { label: "Data", value: date?.label ?? "Não selecionada", target: 2 },
                  { label: "Horário", value: selection.slot ? `${selection.slot} · Brasília (exemplo)` : "Não selecionado", target: 3 },
                ].map((item) => <div key={item.label} className="flex items-start justify-between gap-4 py-4"><div className="min-w-0"><dt className="text-sm text-slate-400">{item.label}</dt><dd className="mt-1 font-medium leading-6">{item.value}</dd></div><button type="button" aria-label={`Alterar ${item.label.toLowerCase()}`} onClick={() => goTo(item.target)} className={`-my-1 min-h-11 shrink-0 rounded-md text-sm text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>Alterar</button></div>)}</dl>
                {invalidStep !== null && <div id="review-error" role="alert" className="mt-4 rounded-lg border border-amber-300/30 p-4 text-sm leading-6 text-amber-200"><p>Revisão incompleta. {prompts[invalidStep]} A demonstração não pode ser concluída.</p><button type="button" onClick={() => goTo(invalidStep)} className={`mt-2 min-h-11 rounded-md font-semibold underline underline-offset-4 ${catalogFocusClass}`}>Completar {steps[invalidStep].toLowerCase()}</button></div>}
                {error && <p role="alert" className="mt-4 text-sm leading-6 text-amber-200">{error}</p>}
                <p className="mt-5 text-sm leading-6 text-slate-400">Ao concluir, você verá somente o resultado da demonstração. Nenhuma reserva será enviada ou salva.</p>
              </>}
              {step < 4 && error && !(step === 0 && services.length || step === 1 && professionals.length || step === 2 && data.dates.length || step === 3 && slots.length) && <p role="alert" className="mt-4 text-sm text-amber-200">{error}</p>}
            </>}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#26384A] pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? <button type="button" disabled={pending} onClick={() => goTo(step - 1)} className={`${catalogSecondaryActionClass} disabled:opacity-60`}>Voltar</button> : <Link href={returnHref} className={`inline-flex items-center justify-center ${catalogSecondaryActionClass}`}>Voltar à barbearia</Link>}
              <button type="submit" disabled={loading} aria-describedby={step === 4 && invalidStep !== null ? "review-error" : undefined} className={`min-h-12 py-3 disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 ${catalogActionClass}`}>{pending ? "Preparando…" : step === 4 ? "Concluir demonstração" : "Continuar"}</button>
            </div>
          </form>}
        </section>
        <aside aria-label="Resumo das escolhas de exemplo" className="min-w-0 border-l-2 border-[#26384A] pl-5 lg:sticky lg:top-6">
          <FiScissors size={24} aria-hidden="true" className="text-sky-400" />
          <p className="mt-3 text-xs font-semibold tracking-widest text-slate-400">SUA VISITA DE EXEMPLO</p>
          <h2 className="mt-2 text-lg font-semibold">{shopName}</h2>
          <dl className="mt-5 space-y-4">{[["Serviço", service?.name], ["Profissional", professional?.name], ["Data", date?.label], ["Horário", selection.slot ? `${selection.slot} · Brasília` : undefined]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 text-sm leading-6 text-slate-200">{value || "A escolher"}</dd></div>)}</dl>
          {service && <p className="mt-5 border-t border-[#26384A] pt-4 text-sm text-slate-300">{service.durationMinutes} min · <span className="font-semibold text-white">{priceFormat.format(service.price)}</span><span className="block mt-1 text-xs text-slate-400">Duração e valor de exemplo.</span></p>}
          <p className="mt-5 text-xs leading-5 text-slate-400">{presentation.kind === "client" ? "Header em prévia demonstrativa." : "Visitante explorando a demonstração."} Nenhuma sessão real.</p>
        </aside>
      </div>
      <details className="mt-8 border-t border-[#26384A] pt-4">
        <summary className={`flex min-h-11 w-fit cursor-pointer items-center rounded-md text-sm text-slate-400 ${catalogFocusClass}`}>Explorar estados da demonstração</summary>
        <div className="mt-3 max-w-xl"><label htmlFor="demo-scenario" className="text-sm font-medium">Cenário local</label><p id="scenario-note" className="mt-1 mb-3 text-xs leading-5 text-slate-400">Trocar o cenário reinicia as escolhas. Erro e ausência de horários aparecem na etapa Horário; ausência de profissionais na etapa Profissional. O conflito ocorre uma vez ao concluir a revisão e permite escolher outro horário. Não altera dados reais.</p><select id="demo-scenario" value={scenario} aria-describedby="scenario-note" onChange={(event) => { const value = demoScenarios.find((item) => item.key === event.target.value)?.key; if (value) reset(value) }} className={catalogFieldClass}>{demoScenarios.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
      </details>
    </>}
  </div>
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div role="status" className="rounded-lg bg-[#07111C] p-5"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#B6C2D1]">{description}</p></div>
}
