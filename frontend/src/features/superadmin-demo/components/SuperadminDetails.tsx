"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { useSuperadminDemo } from "./SuperadminProvider"
import { listHref } from "../presentation"
import { actionClass, panelClass } from "../styles"
import { ShopStatus } from "./ShopStatus"
import { SuperadminState } from "./SuperadminState"
import { registrationNotice } from "../registration"
import { onboardingHref } from "@/features/owner-onboarding/routing"

// Intenção: conferir identidade pública antes de testar alteração. Nome lidera;
// estado e ação ficam juntos. Bordas/superfícies privadas, Geist 24/14px,
// base 4px e painéis 24px; confirmação nativa reutiliza DemoDialog e retorna foco.
export function SuperadminDetails({ id, query }: { id: string; query: string }) {
  const { shops, scenario, setScenario, changeStatus, createdShopId } = useSuperadminDemo()
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState("")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const shop = shops.find(item => item.id === id)
  useEffect(() => { if (shop?.demoStatus === "draft") headingRef.current?.focus() }, [shop?.id, shop?.demoStatus])
  function close() { setConfirming(false); triggerRef.current?.focus() }
  const nextStatus = shop?.demoStatus === "active" ? "suspended" : "active"
  const action = nextStatus === "suspended" ? "Suspender" : "Reativar"
  function confirm() {
    if (!shop || shop.demoStatus === "draft") return
    changeStatus(shop.id, nextStatus)
    setMessage(`${shop.name}: ${nextStatus === "suspended" ? "suspensa" : "reativada"} somente na amostra em memória. Nada foi salvo ou aplicado a uma barbearia real. Catálogo e acesso não foram alterados.`)
    close()
  }
  return <div className="space-y-6">
    <Link href={listHref(query)} className={actionClass}>Voltar à lista{query ? " com a busca" : ""}</Link>
    {scenario === "loading" || scenario === "error" ? <SuperadminState kind={scenario} onRetry={scenario === "error" ? () => setScenario("ready") : undefined} /> : !shop ? <SuperadminState kind="missing" /> : <>
      <section className={`${panelClass} p-6`} aria-labelledby="shop-title">
        <h2 id="shop-title" ref={headingRef} tabIndex={-1} className="rounded text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-[#65d5ff]">{shop.name}</h2>
        <p className="mt-2 text-sm text-slate-400">{shop.demoStatus === "draft" ? "Cadastro manual demonstrativo · dados informados nesta navegação" : "Dados públicos da fixture · estabelecimento fictício"}</p>
        {shop.demoStatus === "draft" && createdShopId === id && <p role="status" aria-atomic="true" className="mt-4 text-sm leading-6 text-[#8de1ff]">{registrationNotice}</p>}
        <dl className="my-6 grid gap-5 sm:grid-cols-2">{[['Nome', shop.name], ['Cidade', shop.city], ['Bairro', shop.neighborhood], ['Subdomínio pretendido', shop.subdomain], ...(shop.demoStatus === "draft" ? [['Motivo do cadastro manual', shop.manualReason]] : [])].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-400">{label}</dt><dd className="mt-1 font-medium [overflow-wrap:anywhere]">{value}</dd></div>)}</dl>
        <div className="border-t border-slate-800 pt-5"><h3 className="mb-3 font-semibold">Estado demonstrativo</h3>
          <div className="flex flex-wrap items-center gap-4"><ShopStatus status={shop.demoStatus} />{shop.demoStatus !== "draft" && <button ref={triggerRef} type="button" onClick={() => setConfirming(true)} aria-describedby="status-limits" className={actionClass}>{action} na amostra</button>}</div>
          <p id="status-limits" className="mt-3 text-sm leading-6 text-slate-400">{shop.demoStatus === "draft" ? "Este rascunho não permite suspensão ou reativação. Não existe estabelecimento, acesso, compra, publicação ou subdomínio provisionado. Recarregar ou sair da área remove o rascunho." : "A mudança existe apenas nesta demonstração e se perde ao recarregar ou sair da área. Não suspende publicação, conta ou acesso."}</p>
          {shop.demoStatus === "draft" && <div className="mt-5"><Link href={onboardingHref("superadmin")} className={actionClass}>Ver demonstração do onboarding</Link><p className="mt-3 text-sm leading-6 text-slate-400">Abre um exemplo fictício independente, nunca este rascunho. Não transfere dados, sincroniza, retoma configuração ou envia convite. Sair desta área descarta o rascunho.</p></div>}
        </div>
        {shop.demoStatus !== "draft" && <p role="status" aria-atomic="true" className="mt-4 text-sm leading-6 text-[#8de1ff]">{message}</p>}
      </section>
      {shop.demoStatus !== "draft" && <DemoDialog open={confirming} onClose={close} title={`${action} na amostra?`} description={shop.name}>
        <p className="text-sm leading-6 text-slate-300">Somente o estado deste exemplo em memória será alterado. Nada será salvo ou aplicado a uma barbearia real. Catálogo, publicação e acesso não serão afetados.</p>
        <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={close} className={actionClass}>Cancelar</button><button type="button" onClick={confirm} className={actionClass}>Confirmar {action.toLocaleLowerCase("pt-BR")} na amostra</button></div>
      </DemoDialog>}
    </>}
  </div>
}
