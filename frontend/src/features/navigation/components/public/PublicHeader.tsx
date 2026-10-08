"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { FiMenu } from "react-icons/fi"
import { Container } from "@/components/ui/Container"
import { catalogActionClass } from "@/features/barbershop-catalog/styles"
import { institutionalNavigation as publicNavigation } from "../../config/public-navigation"
import { HeaderBrand } from "../HeaderBrand"
import { PublicMobileMenu } from "./PublicMobileMenu"
import { publicLoginClass, publicNavigationClass } from "./styles"
import { clientAuthHref, type PlatformNavigation } from "@/features/auth/routing"
import { menuControlClass } from "../styles"

export type PublicHeaderContext = "landing" | "catalog" | "barbershop" | "public"

export function PublicHeader({ context, platform, signupHref: signupDestination }: { context: PublicHeaderContext; platform: PlatformNavigation; signupHref?: string | null }) {
  const loginHref = clientAuthHref(platform.origin, "login")
  const signupHref = signupDestination === undefined ? clientAuthHref(platform.origin, "cadastro") : signupDestination
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(publicNavigation[0].href)
  const isLandingPage = context === "landing"
  const headerRef = useRef<HTMLElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const activeHref = isLandingPage ? activeSection : undefined

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const updateSection = useCallback(() => {
    const firstSection = document.getElementById("inicio")
    const anchorOffset = firstSection ? parseFloat(getComputedStyle(firstSection).scrollMarginTop) || 0 : 0
    const threshold = Math.min(window.innerHeight - 1, Math.max((headerRef.current?.getBoundingClientRect().bottom ?? 80) + 16, anchorOffset) + 1)
    // The redesigned landing ends with a short footer: it cannot reach the
    // activation line, even when the user has scrolled to the very bottom.
    const atBottom = window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight
    const current = [...publicNavigation].reverse().find((item) => {
      const section = document.getElementById(item.href.split("#")[1])
      return section !== null && section.getBoundingClientRect().top <= (atBottom ? window.innerHeight - 1 : threshold)
    })
    setActiveSection(current?.href ?? publicNavigation[0].href)
  }, [])

  useEffect(() => {
    if (!isLandingPage) return
    let frame = 0
    function scheduleUpdate() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateSection)
    }
    const observer = new ResizeObserver(scheduleUpdate)
    for (const item of publicNavigation) {
      const section = document.getElementById(item.href.split("#")[1])
      if (section) observer.observe(section)
    }
    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [isLandingPage, updateSection])

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
            onClick={() => { updateSection(); setMenuOpen(true) }}
          >
            <FiMenu size={21} aria-hidden="true" />
          </button>}

          <HeaderBrand href={platform.origin ? `${platform.origin}/` : "/"} />

          {isLandingPage && <nav aria-label="Navegação principal" className="hidden items-center justify-center gap-1 lg:flex">
            {publicNavigation.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.href === activeHref ? "location" : undefined} className={publicNavigationClass(item.href === activeHref)}>
                {item.label}
              </a>
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
