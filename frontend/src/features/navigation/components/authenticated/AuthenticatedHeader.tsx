"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FiMenu } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import type { NavigationConfig } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import { AuthenticatedMobileMenu } from "./AuthenticatedMobileMenu"
import { DemoDialog } from "@/features/demo-ui/components/DemoDialog"
import { headerSurfaceClass, menuControlClass, operationalHeaderClass } from "../styles"
import { HeaderAccountActions } from "../HeaderAccountActions"

type AuthenticatedHeaderProps = {
  contextLabel?: string
  contextName?: string
  navigation: NavigationConfig
  profileHref?: string
  desktopNavigation?: boolean
}

export function AuthenticatedHeader({
  contextLabel,
  contextName,
  navigation,
  desktopNavigation = false,
  profileHref,
}: AuthenticatedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<"profile" | null>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const HeaderContainer = desktopNavigation ? "div" : Container

  return (
    <header className={headerSurfaceClass}>
      <HeaderContainer {...(desktopNavigation ? { className: "px-4" } : {})}>
        <div className={`${operationalHeaderClass} ${desktopNavigation ? "admin:flex admin:justify-between" : ""}`}>
          <button
            ref={menuTriggerRef}
            type="button"
            className={`${menuControlClass} ${desktopNavigation ? "admin:hidden" : ""}`}
            aria-label="Abrir menu"
            aria-controls="account-navigation"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => { setActivePanel(null); setMenuOpen(true) }}
          >
            <FiMenu size={21} aria-hidden="true" />
          </button>

          <HeaderBrand />

          <HeaderAccountActions profileHref={profileHref} onProfile={() => setActivePanel("profile")} />

          <AuthenticatedMobileMenu
            contextLabel={contextLabel}
            contextName={contextName}
            isOpen={menuOpen}
            navigation={navigation}
            desktopNavigation={desktopNavigation}
            onClose={closeMenu}
            triggerRef={menuTriggerRef}
            onExit={() => { setMenuOpen(false); router.push("/") }}
          />
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
