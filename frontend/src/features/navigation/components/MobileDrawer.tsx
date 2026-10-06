"use client"

import { useEffect, useRef, type ReactNode, type RefObject } from "react"
import { usePathname } from "next/navigation"
import { FiX } from "react-icons/fi"
import { HeaderBrand } from "./HeaderBrand"
import { closeMenuControlClass } from "./styles"

type Props = {
  id: string
  label: string
  isOpen: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
  brandHref?: string
  desktopQuery?: string
  desktopFocusSelector?: string
  children: ReactNode
  footer: ReactNode
  footerPlacement?: "bottom" | "center"
}

/** Diálogo nativo: top layer e fundo inerte; sem regras de papel. */
export function MobileDrawer({ id, label, isOpen, onClose, triggerRef, brandHref, desktopQuery, desktopFocusSelector, children, footer, footerPlacement = "bottom" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current !== pathname) onClose()
    previousPath.current = pathname
  }, [pathname, onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })
    const desktop = desktopQuery ? window.matchMedia(desktopQuery) : null
    function closeOnDesktop() {
      if (!desktop?.matches) return
      onClose()
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(desktopFocusSelector ?? "header a[href]")?.focus({ preventScroll: true })
      })
    }
    closeOnDesktop()
    desktop?.addEventListener("change", closeOnDesktop)
    return () => {
      desktop?.removeEventListener("change", closeOnDesktop)
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.checkVisibility()) trigger.focus({ preventScroll: true })
    }
  }, [isOpen, onClose, triggerRef, desktopQuery, desktopFocusSelector])

  return <dialog
    ref={dialogRef}
    id={id}
    aria-label={label}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key !== "Tab") return
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')].filter(el => el.checkVisibility())
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}
    className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[85%] max-w-sm border-0 border-r border-[#26384A] bg-[#07111C] p-0 text-white backdrop:bg-black/65 backdrop:backdrop-blur-sm"
  >
    <nav aria-label={label} className="flex h-full flex-col overflow-y-auto p-4 sm:p-6">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#26384A] pb-5">
        <HeaderBrand href={brandHref} onNavigate={onClose} />
        <button ref={closeRef} type="button" aria-label="Fechar menu" className={closeMenuControlClass} onClick={onClose}><FiX size={21} aria-hidden="true" /></button>
      </div>
      <div className="shrink-0 py-6">{children}</div>
      <div className={footerPlacement === "center" ? "my-auto grid shrink-0 gap-3" : "mt-auto grid shrink-0 gap-3 border-t border-[#26384A] pt-5"}>{footer}</div>
    </nav>
  </dialog>
}
