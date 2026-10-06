"use client"

import Link from "next/link"
import { useOptionalDemoProfile } from "@/features/demo-profile/components/DemoProfileProvider"
import { useRef } from "react"
import { Container } from "@/components/ui/Container"
import { clientAuthHref, type AccountType, type AuthContext } from "@/features/auth/routing"
import { useDemoClientPresentation, type ClientPresentation } from "@/features/auth/components/DemoClientProvider"
import { catalogActionClass, catalogFocusClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { HeaderBrand } from "../HeaderBrand"
import { clientNavigation } from "../../config/client-navigation"
import type { NavigationItem } from "../../types"

type Props = {
  platformOrigin?: string | null
  context?: AuthContext
  presentation?: ClientPresentation
  onExit?: () => void | Promise<void>
  accountType?: AccountType
  brandHref?: string
}

/** presentation/onExit são pontos de composição; não validam uma sessão. */
export function ClientHeader({ platformOrigin = null, context, presentation, onExit, accountType = "cliente", brandHref }: Props) {
  const demo = useDemoClientPresentation()
  const profile = useOptionalDemoProfile()
  const state = presentation ?? demo.presentation
  const login = clientAuthHref(platformOrigin, "login", context, accountType)
  const signup = clientAuthHref(platformOrigin, "cadastro", context, accountType)
  const items: readonly NavigationItem[] = [...clientNavigation.primary, ...clientNavigation.secondary]
  const exitAction = onExit ?? (state.kind !== "visitor" && state.demonstration ? demo.leaveDemo : undefined)
  const loginRef = useRef<HTMLAnchorElement>(null)
  async function exit() {
    await exitAction?.()
    profile?.restore()
    requestAnimationFrame(() => loginRef.current?.focus())
  }
  return (
    <header className="border-b border-[#26384A] bg-[#07111C]">
      <Container>
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4">
          <HeaderBrand href={brandHref ?? (platformOrigin ? `${platformOrigin}/barbearias` : "/barbearias")} />
          <nav aria-label={accountType === "cliente" ? "Conta do cliente" : "Acesso à conta"} className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
            {state.kind === "visitor" ? <>
              {login && signup ? <>
                <a ref={loginRef} href={login} className={`inline-flex items-center px-4 ${catalogSecondaryActionClass}`}>Entrar</a>
                <a href={signup} className={catalogActionClass}>Criar conta</a>
              </> : <span className="text-sm text-slate-400">Acesso à conta indisponível</span>}
            </> : <>
              {state.demonstration && <span className="text-xs font-medium text-sky-300">Demonstração</span>}
              <details className="relative min-w-0 max-w-full" onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.currentTarget.open = false
                  event.currentTarget.querySelector("summary")?.focus()
                }
              }}>
                <summary className={`flex min-h-11 cursor-pointer items-center rounded-lg border border-[#334155] max-w-full px-4 text-sm font-semibold [overflow-wrap:anywhere] ${catalogFocusClass}`}>{state.kind === "client" ? state.demonstration && profile ? profile.name : state.name : "Saindo…"}</summary>
                <div className="absolute right-0 z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-[#334155] bg-[#0D1722] p-3 shadow-lg">
                  <p className="px-3 py-2 text-xs leading-5 text-slate-400">{state.demonstration ? "Prévia visual. Nenhuma sessão está ativa." : "Conta do cliente"}</p>
                  {items.map((item) => <div key={item.label}>
                    {"href" in item && item.href ? <Link href={platformOrigin ? `${platformOrigin}${item.href}` : item.href} onClick={event => { const menu = event.currentTarget.closest("details"); if (menu) menu.open = false }} className={`flex min-h-11 items-center rounded-lg px-3 text-sm text-white hover:bg-[#172535] ${catalogFocusClass}`}>{item.label}</Link> : <button type="button" disabled className="flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left text-sm text-slate-400">{item.label}<span className="text-xs">Em breve</span></button>}
                  </div>)}
                  <button type="button" disabled={state.kind === "signing-out" || !exitAction} onClick={() => { void exit() }} className={`mt-2 min-h-11 w-full rounded-lg border border-[#334155] px-3 text-left text-sm text-white hover:bg-[#172535] disabled:cursor-wait disabled:opacity-60 ${catalogFocusClass}`}>{state.kind === "signing-out" ? "Saindo…" : state.demonstration ? "Sair da demonstração" : "Sair"}</button>
                </div>
              </details>
            </>}
          </nav>
        </div>
        <p role="status" className="sr-only">{state.kind === "signing-out" ? "Saindo da apresentação da conta." : state.kind === "visitor" ? "Visitante." : state.demonstration ? "Header de cliente em demonstração; sem autenticação real." : "Apresentação da conta do cliente."}</p>
      </Container>
    </header>
  )
}
