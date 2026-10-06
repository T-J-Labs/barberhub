"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { useDemoProfile } from "@/features/demo-profile/components/DemoProfileProvider"
import { demoDay, demoReferenceTime, type DemoSlot } from "../demo-data"
import { activeDemoSlots, demoHistory, formatDemoDate, nextDemoAppointment, statusLabels, type DemoAction } from "../state"
import { actionClass, panelClass } from "../styles"
import { useBarberDemo } from "./BarberDemoProvider"
import { DemoHistory } from "./DemoHistory"

// Intenção: consultar e experimentar ações entre cortes. Hora tabular 30px lidera
// o início; lista cronológica 18px na agenda. Paleta e superfícies privadas herdadas,
// bordas sutis, Geist, base 4px, grupos 32px e controles 44px, sem animações decorativas.
export function BarberDemoView({ mode }: { mode: "home" | "agenda" | "history" }) {
  const { name } = useDemoProfile()
  const { slots, apply, reset } = useBarberDemo()
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)
  const fallbackLinkRef = useRef<HTMLAnchorElement>(null)
  const detailButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const dialogOriginRef = useRef<HTMLButtonElement | null>(null)
  const selected = slots.find((slot) => slot.key === selectedKey)
  const next = nextDemoAppointment(slots)
  const activeSlots = activeDemoSlots(slots)
  const history = demoHistory(slots)
  function closeDetails() {
    setSelectedKey(null)
    // A ação pode mover o botão para o histórico. Aguarde o fechamento e use
    // o botão do mesmo exemplo ou o link da agenda quando ele sair do resumo.
    if (selectedKey) {
      const key = selectedKey
      const origin = dialogOriginRef.current
      requestAnimationFrame(() => {
        const destination = origin?.isConnected ? origin : mode === "home" && !next
          ? fallbackLinkRef.current
          : detailButtonsRef.current.get(key) ?? fallbackLinkRef.current
        destination?.focus()
      })
    }
  }
  function act(action: DemoAction, slot: DemoSlot) {
    apply(action)
    const label = { completed: "conclusão", "no-show": "falta", block: "bloqueio", unblock: "desbloqueio" }[action.type]
    setMessage(`Simulação de ${label} aplicada ao exemplo das ${slot.start}. Nada foi salvo nem alterado em uma agenda real.`)
    if (slot.kind === "appointment") requestAnimationFrame(() => detailHeadingRef.current?.focus())
  }
  function details(slot: DemoSlot) {
    return <button ref={(element) => { if (element) detailButtonsRef.current.set(slot.key, element); else detailButtonsRef.current.delete(slot.key) }} type="button" className={actionClass} onClick={(event) => { dialogOriginRef.current = event.currentTarget; setSelectedKey(slot.key); setMessage("") }} aria-label={`Ver detalhes do atendimento de ${formatDemoDate(slot.date)} às ${slot.start}`}>Ver detalhes</button>
  }
  return <div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm leading-6 text-slate-400">{mode === "history" ? "Atendimentos fictícios de diferentes datas" : demoDay} · Brasília (UTC−3)<span className="block">{mode === "history" ? "Datas e horários de exemplo, sem registros reais." : `Dia e horários de exemplo · referência fixa às ${demoReferenceTime}`}</span></p><button type="button" className={actionClass} onClick={() => { reset(); setSelectedKey(null); setMessage("Exemplos restaurados. Nada foi salvo nem alterado em uma agenda real.") }}>Restaurar exemplos</button></div>
    <p role="status" aria-live="polite" aria-atomic="true" className="mb-6 min-h-6 text-sm leading-6 text-[#8de1ff]">{message}</p>
    {mode === "home" ? <section aria-labelledby="next-title" className={`${panelClass} p-6 sm:p-8`}>
      <h2 id="next-title" className="text-sm font-medium text-[#8de1ff]">Próximo atendimento de exemplo</h2>
      {next?.kind === "appointment" ? <><p className="mt-4 text-3xl font-semibold tabular-nums">{next.start} <span className="text-lg font-normal text-slate-400">até {next.end}</span></p><h3 className="mt-4 text-xl font-semibold">{next.client}</h3><p className="mt-2 text-slate-300">{next.service} · {statusLabels[next.status]}</p><div className="mt-6 flex flex-wrap gap-3">{details(next)}<Link href="/barbeiro/agenda" ref={fallbackLinkRef} className={actionClass}>Ver minha agenda de exemplo</Link></div></> : <><p className="mt-4 text-lg">Nenhum próximo atendimento nesta amostra.</p><Link ref={fallbackLinkRef} href="/barbeiro/agenda" className={`mt-6 ${actionClass}`}>Ver minha agenda de exemplo</Link></>}
    </section> : mode === "agenda" ? <section aria-label="Horários do dia"><ul className={`${panelClass} divide-y divide-slate-800`}>{activeSlots.map((slot) => <li key={slot.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0"><p className="text-lg font-semibold tabular-nums">{slot.start}–{slot.end}</p>{slot.kind === "appointment" ? <><h3 className="mt-2 font-medium">{slot.client}</h3><p className="mt-1 text-sm text-slate-400">{slot.service} · {statusLabels[slot.status]}</p></> : <p className="mt-2 text-sm text-slate-300">{slot.kind === "free" ? "Livre no exemplo" : "Bloqueado no exemplo"}</p>}</div>
      <div className="shrink-0">{slot.kind === "appointment" ? details(slot) : <button type="button" className={actionClass} aria-label={`${slot.kind === "free" ? "Simular bloqueio" : "Simular desbloqueio"} das ${slot.start}`} onClick={() => act({ key: slot.key, type: slot.kind === "free" ? "block" : "unblock" }, slot)}>{slot.kind === "free" ? "Simular bloqueio" : "Simular desbloqueio"}</button>}</div>
    </li>)}</ul><Link ref={fallbackLinkRef} href="/barbeiro/historico" className={`mt-6 ${actionClass}`}>Ver histórico de atendimentos</Link></section> : null}
    {mode !== "agenda" && <DemoHistory history={history} summary={mode === "home"} renderDetails={details} />}
    <DemoDialog open={selected?.kind === "appointment"} onClose={closeDetails} title="Detalhes do atendimento de exemplo" description="Dados fictícios. As ações afetam somente esta demonstração.">
      {selected?.kind === "appointment" && <><h3 ref={detailHeadingRef} tabIndex={-1} className="text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65d5ff]">{selected.client}</h3><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">{[["Data do atendimento de exemplo", formatDemoDate(selected.date)], ["Horário de Brasília", `${selected.start}–${selected.end}`], ["Nome de exibição demonstrativo", name], ["Serviço", selected.service], ["Valor de exemplo", selected.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })], ["Estado do exemplo", statusLabels[selected.status]]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 leading-6 text-white [overflow-wrap:anywhere]">{value}</dd></div>)}</dl>
      <p className="mt-6 text-sm leading-6 text-slate-400">Nada será salvo ou alterado em uma agenda real. Na amostra, apenas atendimentos agendados podem receber conclusão ou falta.</p>
      {selected.status === "scheduled" && <div className="mt-4 flex flex-wrap gap-3"><button type="button" className={actionClass} onClick={() => act({ type: "completed", key: selected.key }, selected)}>Simular conclusão</button><button type="button" className={actionClass} onClick={() => act({ type: "no-show", key: selected.key }, selected)}>Simular falta</button></div>}
      <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-[#8de1ff]">{message}</p></>}
    </DemoDialog>
  </div>
}
