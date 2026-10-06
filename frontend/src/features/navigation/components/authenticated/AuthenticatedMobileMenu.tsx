import type { RefObject } from "react"
import type { NavigationConfig } from "../../types"
import { MobileDrawer } from "../MobileDrawer"
import { catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { NavigationItems } from "./NavigationItems"

type Props = {
  contextLabel?: string
  contextName?: string
  isOpen: boolean
  navigation: NavigationConfig
  onClose: () => void
  onExit: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
  desktopNavigation?: boolean
}

export function AuthenticatedMobileMenu({ contextLabel, contextName, isOpen, navigation, onClose, onExit, triggerRef, desktopNavigation = false }: Props) {
  return <MobileDrawer id="account-navigation" label="Menu da conta" isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}
    desktopQuery={desktopNavigation ? "(min-width: 75rem)" : undefined}
    desktopFocusSelector='#admin-navigation a[aria-current="page"], #admin-navigation a[href]'
    footer={<>
      <ul className="space-y-2"><NavigationItems items={navigation.secondary} onNavigate={onClose} appearance="drawer" /></ul>
      <button type="button" onClick={onExit} className={`flex min-h-11 items-center rounded-lg px-3 text-left text-sm font-medium text-red-400 hover:bg-[#172535] ${catalogFocusClass}`}>Sair</button>
    </>}>
    {contextName && <div className="mb-4 rounded-lg border border-[#26384A] bg-[#172535] px-3 py-2">
      {contextLabel && <p className="text-xs font-normal text-slate-400">{contextLabel}</p>}
      <p className="mt-1 text-sm font-semibold [overflow-wrap:anywhere]">{contextName}</p>
    </div>}
    <ul className="space-y-2"><NavigationItems items={navigation.primary} onNavigate={onClose} appearance="drawer" /></ul>
  </MobileDrawer>
}
