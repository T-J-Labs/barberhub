"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { FiMenu } from "react-icons/fi"
import { useOptionalDemoProfile } from "@/features/demo-profile/components/DemoProfileProvider"
import { Container } from "@/components/ui/Container"
import { clientAuthHref, type AccountType, type AuthContext } from "@/features/auth/routing"
import { useDemoClientPresentation, type ClientPresentation } from "@/features/auth/components/DemoClientProvider"
import { catalogActionClass, catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { HeaderBrand } from "../HeaderBrand"
import { HeaderAccountActions } from "../HeaderAccountActions"
import { MobileDrawer } from "../MobileDrawer"
import { centeredHeaderClass, headerSurfaceClass, menuControlClass, operationalHeaderClass } from "../styles"
import { publicLoginClass, publicNavigationClass } from "../public/styles"
import { clientNavigation } from "../../config/client-navigation"

type Props = {
  platformOrigin?: string | null
  context?: AuthContext
  presentation?: ClientPresentation
  onExit?: () => void | Promise<void>
  accountType?: AccountType
  brandHref?: string
  visitorAccessPlacement?: "footer" | "center"
}

/** presentation/onExit são pontos de composição; não validam uma sessão. */
export function ClientHeader({ platformOrigin = null, context, presentation, onExit, accountType = "cliente", brandHref, visitorAccessPlacement = "footer" }: Props) {
  const demo = useDemoClientPresentation()
  const profile = useOptionalDemoProfile()
  const state = presentation ?? demo.presentation
  const login = clientAuthHref(platformOrigin, "login", context, accountType)
  const signup = clientAuthHref(platformOrigin, "cadastro", context, accountType)
  const brand = brandHref ?? (platformOrigin ? `${platformOrigin}/barbearias` : "/barbearias")
  const exitAction = onExit ?? (state.kind !== "visitor" && state.demonstration ? demo.leaveDemo : undefined)
  const loginRef = useRef<HTMLAnchorElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const pathname = usePathname()
  const visitor = state.kind === "visitor"
  const name = state.kind === "client" ? state.demonstration && profile ? profile.name : state.name : "Saindo…"
  async function exit() {
    await exitAction?.()
    profile?.restore()
    closeMenu()
    requestAnimationFrame(() => {
      if (loginRef.current?.checkVisibility()) loginRef.current.focus()
      else triggerRef.current?.focus()
    })
  }
  const access = (desktop = false) => <>
    {login && signup ? <>
      <Link ref={desktop ? loginRef : undefined} href={login} className={publicLoginClass} onClick={closeMenu}>Entrar</Link>
      <Link href={signup} className={catalogActionClass} onClick={closeMenu}>Criar conta</Link>
    </> : <span className="text-sm text-slate-400">Acesso à conta indisponível</span>}
  </>
  return <header className={headerSurfaceClass}>
    <Container>
      <div className={visitor ? `${centeredHeaderClass} lg:grid-cols-[auto_minmax(0,1fr)_auto]` : operationalHeaderClass}>
        <button ref={triggerRef} type="button" className={`${menuControlClass} ${visitor ? "lg:hidden" : ""}`} aria-label="Abrir menu" aria-controls="client-navigation" aria-expanded={menuOpen} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}><FiMenu size={21} aria-hidden="true" /></button>
        <HeaderBrand href={brand} />
        {visitor ? <nav aria-label={accountType === "cliente" ? "Conta do cliente" : "Acesso à conta"} className="hidden items-center gap-3 lg:col-start-3 lg:flex">{access(true)}</nav> :
          <HeaderAccountActions profileHref={platformOrigin ? `${platformOrigin}/cliente/perfil` : "/cliente/perfil"} notificationDescription="Prévia demonstrativa; nenhuma sessão está ativa." />}
      </div>
      <p role="status" className="sr-only">{state.kind === "signing-out" ? "Saindo da apresentação da conta." : visitor ? "Visitante." : state.demonstration ? "Header de cliente em demonstração; sem autenticação real." : "Apresentação da conta do cliente."}</p>
    </Container>
    <MobileDrawer id="client-navigation" label={visitor ? "Menu de acesso" : "Menu da conta"} isOpen={menuOpen} onClose={closeMenu} triggerRef={triggerRef} brandHref={brand} desktopQuery={visitor ? "(min-width: 64rem)" : undefined}
      footerPlacement={visitor && visitorAccessPlacement === "center" ? "center" : "bottom"}
      footer={visitor ? access() : <>
        <ul className="space-y-2">
          {clientNavigation.secondary.map(item => <li key={item.label}><Link href={platformOrigin ? `${platformOrigin}${item.href}` : item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined} className={publicNavigationClass(pathname === item.href)}>{item.label}</Link></li>)}
        </ul>
        <button type="button" disabled={state.kind === "signing-out" || !exitAction} onClick={() => { void exit() }} className={`min-h-11 w-full rounded-lg border border-[#26384A] px-3 text-left text-sm text-white hover:bg-[#172535] disabled:cursor-wait disabled:opacity-60 ${catalogFocusClass}`}>{state.kind === "signing-out" ? "Saindo…" : state.demonstration ? "Sair da demonstração" : "Sair"}</button>
      </>}>
      {!visitor && <>
        <div className="mb-4 rounded-lg border border-[#26384A] bg-[#172535] px-3 py-2">
          {state.demonstration && <p className="text-xs font-medium text-sky-300">Demonstração</p>}
          <p className="mt-1 text-sm font-semibold [overflow-wrap:anywhere]">{name}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">{state.demonstration ? "Prévia visual. Nenhuma sessão está ativa." : "Conta do cliente"}</p>
        </div>
        <ul className="space-y-2">
          {clientNavigation.primary.map(item => <li key={item.label}><Link href={platformOrigin ? `${platformOrigin}${item.href}` : item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined} className={publicNavigationClass(pathname === item.href)}>{item.label}</Link></li>)}
        </ul>
      </>}
    </MobileDrawer>
  </header>
}
