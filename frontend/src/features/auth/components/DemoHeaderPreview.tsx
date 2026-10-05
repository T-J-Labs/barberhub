"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { catalogActionClass, catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { useDemoClientPresentation } from "./DemoClientProvider"

const subscribeToClientReady = () => () => {}
const clientReady = () => true
const serverReady = () => false

/** A prévia visual é separada do botão Google; não simula OAuth ou cadastro. */
export function DemoHeaderPreview({ returnHref, returnLabel }: { returnHref: string; returnLabel: string }) {
  const { presentation, showDemoClient } = useDemoClientPresentation()
  // Evitar abertura nativa do details antes da hidratação desta prévia com JS.
  const interactive = useSyncExternalStore(subscribeToClientReady, clientReady, serverReady)
  const [pending, setPending] = useState(false)
  const complete = presentation.kind === "client" && presentation.demonstration
  const lock = useRef(false)
  const mounted = useRef(true)
  const result = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  async function preview() {
    if (lock.current || presentation.kind === "signing-out") return
    lock.current = true
    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    if (!mounted.current) return
    showDemoClient()
    setPending(false)
    lock.current = false
    requestAnimationFrame(() => result.current?.focus())
  }
  return <details inert={!interactive} className="mt-6 border-t border-[#26384A] pt-4">
    <summary className={`flex min-h-11 cursor-pointer items-center rounded-md text-sm text-slate-300 ${catalogFocusClass}`}>Ver prévia do header de cliente</summary>
    {complete ? <div ref={result} tabIndex={-1} className={`mt-3 rounded-lg border border-[#26384A] bg-[#07111C] p-4 ${catalogFocusClass}`}>
      <h2 className="text-lg font-semibold">Prévia exibida</h2>
      <p role="status" className="mt-2 text-sm leading-6 text-slate-300">O header está em demonstração. Você não entrou com Google e nenhuma conta foi criada.</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">A prévia vive apenas nesta navegação; recarregar ou mudar de domínio volta a visitante. Nenhum horário foi reservado.</p>
      <Link href={returnHref} className={`mt-4 inline-flex min-h-11 items-center rounded-md text-sm text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>{returnLabel}</Link>
    </div> : <>
      <p className="mt-2 text-xs leading-5 text-slate-400">Somente para visualizar o menu de cliente. Esta ação não se conecta ao Google, não cria conta e não inicia uma sessão.</p>
      <button type="button" onClick={() => { void preview() }} disabled={pending || presentation.kind === "signing-out"} className={`mt-3 w-full px-4 py-3 disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 ${catalogActionClass}`}>{pending ? "Preparando prévia…" : "Visualizar header de cliente"}</button>
      <p role="status" className="sr-only">{pending ? "Preparando prévia visual; aguarde." : ""}</p>
    </>}
  </details>
}
