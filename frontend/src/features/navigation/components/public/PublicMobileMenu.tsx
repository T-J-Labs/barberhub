import Link from "next/link"
import type { RefObject } from "react"
import { catalogActionClass } from "@/features/barbershop-catalog/styles"
import type { PublicNavigationItem } from "../../types"
import { MobileDrawer } from "../MobileDrawer"
import { publicLoginClass, publicNavigationClass } from "./styles"

type Props = {
  isOpen: boolean
  navigation: readonly PublicNavigationItem[]
  onClose: () => void
  activeHref?: string
  loginHref: string | null
  signupHref: string | null
  brandHref: string
  triggerRef: RefObject<HTMLButtonElement | null>
}

export function PublicMobileMenu({ isOpen, navigation, onClose, activeHref, loginHref, signupHref, brandHref, triggerRef }: Props) {
  return <MobileDrawer id="public-navigation" label="Menu principal" isOpen={isOpen} onClose={onClose} triggerRef={triggerRef} brandHref={brandHref} desktopQuery="(min-width: 64rem)" desktopFocusSelector='header nav a[aria-current="location"], header nav a[href]'
    footer={<>
      {loginHref && <Link href={loginHref} className={publicLoginClass} onClick={onClose}>Entrar</Link>}
      {signupHref && <Link href={signupHref} className={catalogActionClass} onClick={onClose}>Criar conta</Link>}
    </>}>
    <ul className="space-y-2">
      {navigation.map(item => <li key={item.href}>
        <a href={item.href} aria-current={item.href === activeHref ? "location" : undefined} className={publicNavigationClass(item.href === activeHref)} onClick={onClose}>{item.label}</a>
      </li>)}
    </ul>
  </MobileDrawer>
}
