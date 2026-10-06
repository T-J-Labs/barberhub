"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { catalogActionClass, catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { canRegisterPwa, isPwaHost } from "../policy"

type InstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}
type Device = "apple" | "apple-other" | "chromium" | "other"
const InstallContext = createContext<ReactNode>(null)

export function PwaInstallPanel() { return useContext(InstallContext) }

export function PwaRuntime({ publicHost, children }: { publicHost?: string; children: ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null)
  const [device, setDevice] = useState<Device | null>(null)
  const [standalone, setStandalone] = useState(false)
  const [notice, setNotice] = useState("")
  const [installNotice, setInstallNotice] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)")
    const ios = navigator as Navigator & { standalone?: boolean }
    function display() { setStandalone(media.matches || ios.standalone === true) }
    media.addEventListener("change", display)
    const ua = navigator.userAgent
    const apple = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    function offered(event: Event) {
      if (!isPwaHost(window.location.host, publicHost)) return
      event.preventDefault()
      setPrompt(event as InstallPrompt)
      setInstallNotice("")
    }
    function installed() { setPrompt(null); setStandalone(true); setInstallNotice("") }
    function offline() { setNotice("Seu navegador está sem conexão. Agendamentos e alterações precisam de conexão.") }
    function online() { setNotice("O navegador voltou a ficar online. A disponibilidade do BarberHub será verificada ao abrir uma página; nenhuma operação foi reenviada.") }
    const frame = requestAnimationFrame(() => {
      display()
      if (isPwaHost(window.location.host, publicHost)) {
        setDevice(apple ? /CriOS|FxiOS|EdgiOS/.test(ua) ? "apple-other" : "apple" : /Chrome|Chromium|Edg/.test(ua) ? "chromium" : "other")
      }
      if (!navigator.onLine) offline()
    })
    window.addEventListener("beforeinstallprompt", offered)
    window.addEventListener("appinstalled", installed)
    window.addEventListener("offline", offline)
    window.addEventListener("online", online)

    let disposed = false
    if (canRegisterPwa(window.location.host, publicHost, process.env.NODE_ENV === "production",
      process.env.NEXT_PUBLIC_API_MOCKING === "enabled", window.isSecureContext) && "serviceWorker" in navigator) {
      void (async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          const rootScope = new URL("/", window.location.origin).href
          // Não substituir MSW ou qualquer outro worker já registrado no escopo.
          const conflicting = registrations.some(registration => registration.scope === rootScope &&
            [registration.active, registration.waiting, registration.installing].some(worker => worker && new URL(worker.scriptURL).pathname !== "/pwa-worker.js"))
          if (!disposed && !conflicting) await navigator.serviceWorker.register("/pwa-worker.js", { scope: "/", updateViaCache: "none" })
        } catch {
          // A aplicação segue disponível online; não alegar preparação offline.
          if (!disposed) setInstallNotice("Não foi possível preparar a tela sem conexão neste navegador. Você pode continuar usando o site online.")
        }
      })()
    }
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      media.removeEventListener("change", display)
      window.removeEventListener("beforeinstallprompt", offered)
      window.removeEventListener("appinstalled", installed)
      window.removeEventListener("offline", offline)
      window.removeEventListener("online", online)
    }
  }, [publicHost])

  async function install() {
    if (!prompt || busy) return
    setBusy(true)
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      setInstallNotice(outcome === "accepted" ? "Pedido de instalação aceito. Aguarde a confirmação do navegador." : "Instalação dispensada. Você pode continuar no navegador.")
    } catch { setInstallNotice("Não foi possível abrir a instalação. Consulte as opções do navegador.") }
    finally { setPrompt(null); setBusy(false) }
  }

  const installation = device && !standalone ? <aside aria-labelledby="pwa-install-title" className="mt-10">
      <div className="border-t border-[#334155] pt-6">
        <h2 id="pwa-install-title" className="text-xl font-semibold tracking-tight">BarberHub na sua tela inicial</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#B6C2D1]">Abra o catálogo direto pelo ícone do BarberHub. Agendamentos e alterações continuam precisando de conexão.</p>
        {prompt ? <button type="button" disabled={busy} onClick={install} className={`${catalogActionClass} mt-4 disabled:cursor-wait disabled:opacity-70`}>Instalar BarberHub</button> :
          <details className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            <summary className={`min-h-11 cursor-pointer rounded-lg py-2 font-semibold text-sky-300 ${catalogFocusClass}`}>Como adicionar à tela inicial</summary>
            <p className="mt-2">{device === "apple" ? "No Safari, abra Compartilhar e escolha Adicionar à Tela de Início. Confirme em Adicionar." : device === "apple-other" ? "Abra este catálogo no Safari. Em Compartilhar, escolha Adicionar à Tela de Início e confirme em Adicionar." : device === "chromium" ? "Consulte o menu do navegador. Quando disponível, escolha Instalar BarberHub ou Adicionar à tela inicial e siga as instruções. Se a opção não aparecer, continue usando o site." : "Consulte o menu ou a ajuda do seu navegador para adicionar sites à tela inicial. Se essa opção não estiver disponível, continue usando o site."}</p>
          </details>}
        {installNotice && <p role="status" className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{installNotice}</p>}
      </div>
    </aside> : null

  return <InstallContext.Provider value={installation}>
    {children}
    {notice && <aside aria-label="Conexão" className="fixed inset-x-0 bottom-0 z-40 max-h-[40dvh] overflow-y-auto border-t border-slate-700 bg-[#0D1722] px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p role="status" className="max-w-3xl text-sm leading-6 text-slate-200">{notice}</p>
        <button type="button" onClick={() => setNotice("")} className={`min-h-11 rounded-lg px-3 text-sm font-semibold text-sky-300 ${catalogFocusClass}`}>Fechar aviso de conexão</button>
      </div>
    </aside>}
  </InstallContext.Provider>
}
