"use client"

import Link from "next/link"
import { useEffect, useReducer, useRef, useState, type FormEvent } from "react"
import { Container } from "@/components/ui/Container"
import { catalogActionClass, catalogFocusClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { calculateChecklist, presentationState } from "../checklist"
import { originLabels } from "../fixtures"
import { adminDemoDestinations } from "../routing"
import { initialWizard, transition } from "../transitions"
import { stepNames, type DemoOrigin, type Step } from "../types"
import { Introduction } from "./Introduction"
import { StepFields } from "./StepFields"
import { Checklist } from "./Checklist"
import { Review } from "./Review"

// Intenção: proprietário ensaiando a primeira configuração, com retorno livre.
// Hierarquia: etapa 24/600 na folha principal, percurso 14px e checklist lateral;
// assinatura: requisitos de abertura acompanham serviço/cadeira/expediente.
// Paleta pública aprovada, bordas e inputs recuados; Geist 36/24/16/14px.
// Superfícies #07111C/#0D1722, ritmo 4px, folhas 20/32px e controles >=44px.
export function OwnerOnboardingWizard({ initialOrigin, platformOrigin }: { initialOrigin: DemoOrigin | null; platformOrigin: string }) {
  const [state, dispatch] = useReducer(transition, { ...initialWizard, origin: initialOrigin })
  const [attempted, setAttempted] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { data, phase, step, origin, release } = state
  const checklist = data ? calculateChecklist(data) : null
  const currentIssues = checklist?.issues.filter(issue => issue.step === step) ?? []
  useEffect(() => { titleRef.current?.focus() }, [phase, step])
  function go(target: Step) { setAttempted(false); dispatch({ type: "go", step: target }) }
  function restart() { setAttempted(false); dispatch({ type: "restart" }) }
  function advance(event: FormEvent) {
    event.preventDefault()
    if (currentIssues.length) {
      setAttempted(true)
      const field = currentIssues[0].field
      document.getElementById(field === "availability" ? "availability-seg" : field)?.focus()
      return
    }
    setAttempted(false); dispatch({ type: "next" })
  }
  return <main id="conteudo" className="py-8 sm:py-12" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}><Container>
    <header className="mb-8 flex flex-wrap items-start justify-between gap-5"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-widest text-sky-400">ABERTURA DA BARBEARIA · DEMONSTRAÇÃO</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Configuração do proprietário</h1><p className="mt-3 text-sm leading-6 text-slate-300">Um ensaio com dados fictícios. Não cria conta, estabelecimento, convite, acesso, compra ou endereço público.</p></div><Link href="/" className={`inline-flex items-center ${catalogSecondaryActionClass}`}>Sair da demonstração</Link></header>
    {phase === "intro" && <Introduction headingRef={titleRef} origin={origin} onChoose={value => dispatch({ type: "choose", origin: value })} onStart={() => dispatch({ type: "start" })} />}
    {phase !== "intro" && data && origin && <>
      <p className="mb-5 text-sm leading-6 text-slate-400">Origem: {originLabels[origin]}. {origin === "superadmin" ? "Exemplo independente do rascunho; aceite e responsável são fictícios." : "Exemplo independente do cadastro; Google continua indisponível."}</p>
      {phase === "steps" ? <>
        <nav aria-label="Etapas da configuração" className="mb-6"><ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{stepNames.map((name, index) => <li key={name}><button type="button" onClick={() => go(index as Step)} aria-current={step === index ? "step" : undefined} className={`flex min-h-14 w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${step === index ? "border-sky-400 bg-sky-500/10 text-white" : "border-[#26384A] text-slate-300 hover:bg-[#172535]"} ${catalogFocusClass}`}><span className="text-sky-300 tabular-nums">{index + 1}</span>{name}</button></li>)}</ol></nav>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_288px]">
          <section className={`${catalogPanelClass} min-w-0 p-5 sm:p-8`} aria-labelledby="step-title">
            <p className="text-xs font-semibold tracking-wider text-slate-400">ETAPA {step + 1} DE 6</p><h2 id="step-title" ref={titleRef} tabIndex={-1} className={`mt-2 mb-6 rounded text-2xl font-semibold tracking-tight ${catalogFocusClass}`}>{stepNames[step]}</h2>
            {step < 5 ? <form onSubmit={advance} noValidate>
              {attempted && currentIssues.length > 0 && <p role="alert" className="mb-5 rounded-lg border border-amber-200/30 p-3 text-sm leading-6 text-amber-200">Confira os campos indicados nesta etapa. Seus dados continuam no fluxo.</p>}
              <StepFields step={step} data={data} issues={checklist?.issues ?? []} onChange={value => dispatch({ type: "edit", data: value })} origin={platformOrigin} />
              <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[#26384A] pt-5"><button type="button" onClick={() => go(step === 0 ? 5 : (step - 1) as Step)} className={catalogSecondaryActionClass}>{step === 0 ? "Ver revisão" : "Voltar"}</button><button type="submit" className={catalogActionClass}>Continuar</button></div>
            </form> : <>
              <Review data={data} release={release} onRelease={scenario => dispatch({ type: "release", scenario })} onGo={go} origin={platformOrigin} />
              <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[#26384A] pt-5"><button type="button" onClick={() => go(4)} className={catalogSecondaryActionClass}>Voltar</button><button type="button" onClick={() => dispatch({ type: "finish" })} disabled={presentationState(data, release) !== "preview"} className={`${catalogActionClass} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}>Concluir simulação</button></div>
            </>}
            <button type="button" onClick={restart} className={`mt-5 min-h-11 rounded text-sm text-slate-300 underline underline-offset-4 ${catalogFocusClass}`}>Reiniciar demonstração</button>
          </section>
          <Checklist data={data} onGo={go} />
        </div>
      </> : <section className={`${catalogPanelClass} mx-auto max-w-3xl p-5 sm:p-8`} aria-labelledby="result-title">
        <p className="text-xs font-semibold tracking-wider text-sky-300">RESULTADO DO ENSAIO</p><h2 id="result-title" ref={titleRef} tabIndex={-1} className={`mt-3 text-2xl font-semibold leading-snug ${catalogFocusClass}`}>Simulação concluída — nenhum estabelecimento, acesso ou endereço público foi criado.</h2>
        <p className="mt-5 text-sm leading-6 text-slate-300 [overflow-wrap:anywhere]">Você configurou o exemplo {data.name}, com {data.serviceName} e {data.professionalName}. Configuração e liberação demonstrativas completas; a prévia não foi publicada.</p>
        <p className="mt-4 text-sm leading-6 text-slate-400">Nenhum convite foi enviado, conta autenticada, compra confirmada ou acesso concedido. Sair ou recarregar descarta o ensaio.</p>
        <button type="button" onClick={restart} className={`${catalogActionClass} mt-6`}>Reiniciar demonstração</button>
        <div className="mt-8 border-t border-[#26384A] pt-6"><h3 className="font-semibold">Explore a gestão completa</h3><p className="mt-2 text-sm leading-6 text-slate-400">Estas telas usam demonstrações com dados independentes. Abrir um atalho sai deste fluxo e descarta sua configuração; não transfere dados nem concede acesso real.</p><div className="mt-4 flex flex-wrap gap-3">{adminDemoDestinations.map(destination => <Link key={destination.path} href={`${destination.path}?origem=onboarding-demo`} className={`inline-flex items-center ${catalogSecondaryActionClass}`}>{destination.label}</Link>)}</div></div>
      </section>}
    </>}
  </Container></main>
}
