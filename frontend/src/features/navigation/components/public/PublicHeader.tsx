"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { FiMenu } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { catalogActionClass } from "@/features/barbershop-catalog/styles"
import { publicNavigation } from "../../config/public-navigation"
import { HeaderBrand } from "../HeaderBrand"
import { PublicMobileMenu } from "./PublicMobileMenu"
import { publicLoginClass, publicNavigationClass } from "./styles"
import { clientAuthHref, type PlatformNavigation } from "@/features/auth/routing"
import { menuControlClass } from "../styles"

export type PublicHeaderContext = "landing" | "catalog" | "barbershop" | "public"

export function PublicHeader({ context, platform }: { context: PublicHeaderContext; platform: PlatformNavigation }) {
  const loginHref = clientAuthHref(platform.origin, "login")
  const signupHref = clientAuthHref(platform.origin, "cadastro")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(publicNavigation[0].href)
  const isLandingPage = context === "landing"
  const headerRef = useRef<HTMLElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const activeHref = isLandingPage ? activeSection : undefined

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!isLandingPage) return
    let frame = 0
    function updateSection() {
      const threshold = (headerRef.current?.offsetHeight ?? 80) + 40
      const current = [...publicNavigation].reverse().find((item) => {
        const section = document.getElementById(item.href.split("#")[1])
        return section !== null && section.getBoundingClientRect().top <= threshold
      })
      setActiveSection(current?.href ?? publicNavigation[0].href)
    }
    function scheduleUpdate() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateSection)
    }
    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [isLandingPage])

  return (
    <header ref={headerRef} className="public-header sticky top-0 z-30 border-b border-[#26384A] bg-[#07111C]/95 backdrop-blur-md">
      <Container>
        <div className={`${isLandingPage ? "grid grid-cols-[44px_minmax(0,1fr)_44px] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6 [&>a]:justify-self-center lg:[&>a]:justify-self-start" : "flex justify-between [&>a]:shrink-0 [&>a]:text-lg min-[360px]:[&>a]:text-xl sm:[&>a]:text-2xl"} min-h-20 items-center gap-3 py-4 [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-offset-4 [&>a]:focus-visible:outline-sky-400`}>
          {isLandingPage && <button
            ref={menuTriggerRef}
            type="button"
            className={`${menuControlClass} lg:hidden`}
            aria-label="Abrir menu"
            aria-controls="public-navigation"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu size={21} aria-hidden="true" />
          </button>}

          <HeaderBrand href={platform.origin ? `${platform.origin}/` : "/"} />

          {isLandingPage && <nav aria-label="Navegação principal" className="hidden items-center justify-center gap-1 lg:flex">
            {publicNavigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.href === activeHref ? "location" : undefined} className={publicNavigationClass(item.href === activeHref)}>
                {item.label}
              </Link>
            ))}
          </nav>}

          <div className={isLandingPage ? "hidden items-center gap-3 lg:flex" : "flex shrink-0 items-center gap-2 [&>a]:px-3 sm:gap-3 sm:[&>a]:px-5"}>
            {loginHref && <Link href={loginHref} className={publicLoginClass}>Entrar</Link>}
            {signupHref && <Link href={signupHref} className={catalogActionClass}>Criar conta</Link>}
          </div>
        </div>
      </Container>

      {isLandingPage && <PublicMobileMenu isOpen={menuOpen} navigation={publicNavigation} activeHref={activeHref} onClose={closeMenu} loginHref={loginHref} signupHref={signupHref} brandHref={platform.origin ? `${platform.origin}/` : "/"} triggerRef={menuTriggerRef} />}
    </header>
  )
}
