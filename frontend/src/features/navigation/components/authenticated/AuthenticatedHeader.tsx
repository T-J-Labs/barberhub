"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FiMenu, FiUser } from "react-icons/fi"
import { MdNotificationsNone } from "react-icons/md"
import { Container } from "@/components/ui/Container"
import type { NavigationConfig } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import { AuthenticatedMobileMenu } from "./AuthenticatedMobileMenu"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"

type AuthenticatedHeaderProps = {
  contextLabel?: string
  contextName?: string
  navigation: NavigationConfig
  desktopNavigation?: boolean
}

export function AuthenticatedHeader({
  contextLabel,
  contextName,
  navigation,
  desktopNavigation = false,
}: AuthenticatedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<"notifications" | "profile" | null>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!desktopNavigation || !menuOpen) return
    const desktop = window.matchMedia("(min-width: 75rem)")
    function closeOnDesktop() {
      if (!desktop.matches) return
      setMenuOpen(false)
      const navigation = document.getElementById("admin-navigation")
      const destination = navigation?.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ??
        navigation?.querySelector<HTMLAnchorElement>("a[href]")
      destination?.focus({ preventScroll: true })
    }
    closeOnDesktop()
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [desktopNavigation, menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previousOverflow }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
    menuTriggerRef.current?.focus()
  }

  const HeaderContainer = desktopNavigation ? "div" : Container

  return (
    <header className={desktopNavigation ? "border-b border-slate-700/55 bg-[#07111C]" : "bg-[#07111C] border-b border-slate-700/55 lg:border-b-0"}>
      <HeaderContainer {...(desktopNavigation ? { className: "px-4" } : {})}>
        <div className={desktopNavigation ? "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 py-4 min-[360px]:gap-4 admin:flex admin:justify-between [&>a]:justify-self-center [&>a]:text-lg min-[360px]:[&>a]:text-xl sm:[&>a]:text-2xl" : "flex items-center justify-between py-4 lg:border-b lg:border-slate-700/55"}>
          <button
            ref={menuTriggerRef}
            type="button"
            className={`-my-1.5 inline-grid size-11 place-items-center rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] ${desktopNavigation ? "admin:hidden" : ""}`}
            aria-label="Abrir menu"
            aria-controls="account-navigation"
            aria-expanded={menuOpen}
            onClick={() => { setActivePanel(null); setMenuOpen(true) }}
          >
            <FiMenu size={24} />
          </button>

          <HeaderBrand />

          <div className={desktopNavigation ? "flex shrink-0 items-center gap-1 sm:gap-3" : "flex items-center gap-4"}>
            <button
              type="button"
              className="-my-1.5 inline-grid size-11 place-items-center rounded-md text-white"
              aria-label="Notificações"
              onClick={() => setActivePanel("notifications")}
            >
              <MdNotificationsNone size={24} />
            </button>
            <button
              type="button"
              className="-my-1.5 inline-grid size-11 place-items-center rounded-md text-white"
              aria-label="Perfil"
              onClick={() => setActivePanel("profile")}
            >
              <FiUser size={24} />
            </button>
          </div>

          <AuthenticatedMobileMenu
            contextLabel={contextLabel}
            contextName={contextName}
            isOpen={menuOpen}
            navigation={navigation}
            desktopNavigation={desktopNavigation}
            onClose={closeMenu}
            onExit={() => { setMenuOpen(false); router.push("/") }}
          />
          <DemoDialog open={activePanel === "notifications"} onClose={() => setActivePanel(null)} title="Notificações" description="Prévia das atualizações da sua conta.">
            <p className="rounded-lg border border-slate-800 bg-[#07111c] px-4 py-5 text-sm leading-6 text-slate-400">Nenhuma notificação nesta demonstração. Novos avisos aparecerão aqui quando a plataforma estiver integrada.</p>
          </DemoDialog>
          <DemoDialog open={activePanel === "profile"} onClose={() => setActivePanel(null)} title="Perfil" description="Conta de demonstração">
            <div className="rounded-lg border border-slate-800 bg-[#07111c] p-4">
              <p className="text-sm font-semibold text-white">{contextName ?? "BarberHub"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Esta é uma prévia da área autenticada. A edição do perfil e as informações da conta serão conectadas em uma etapa posterior.</p>
            </div>
          </DemoDialog>
        </div>
      </HeaderContainer>
    </header>
  )
}
