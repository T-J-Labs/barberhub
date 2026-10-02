import { useEffect, useRef } from "react"
import { FiX } from "react-icons/fi"
import type { NavigationConfig } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import { NavigationItems } from "./NavigationItems"

type MobileMenuProps = {
  contextLabel?: string
  contextName?: string
  isOpen: boolean
  navigation: NavigationConfig
  onClose: () => void
  onExit: () => void
  desktopNavigation?: boolean
}

export function AuthenticatedMobileMenu({
  contextLabel,
  contextName,
  isOpen,
  navigation,
  onClose,
  onExit,
  desktopNavigation = false,
}: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== "Tab") return
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className={`fixed inset-0 z-40 bg-black/60 ${desktopNavigation ? "admin:hidden" : ""}`}
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <nav
        id="account-navigation"
        aria-label="Navegação da conta"
        onKeyDown={handleKeyDown}
        className={`${isOpen ? "flex" : "hidden"} ${desktopNavigation ? "admin:hidden" : ""} fixed inset-y-0 left-0 z-50 h-dvh w-[85%] max-w-sm flex-col overflow-y-auto bg-[#07111C] p-4`}
      >
        <div className="mb-4 flex items-center justify-between">
          <HeaderBrand />
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-grid size-11 place-items-center rounded-md text-white"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>

        <ul className="flex min-h-0 flex-1 flex-col gap-4 font-medium text-white">
          {contextName && (
            <li className="rounded-md border border-slate-600 bg-[#172535] px-3 py-2">
              {contextLabel && (
                <span className="block text-xs font-normal text-slate-400">{contextLabel}</span>
              )}
              <span className="block truncate">{contextName}</span>
            </li>
          )}

          <NavigationItems items={navigation.primary} onNavigate={onClose} />

          <li role="separator" aria-hidden="true" className="mt-auto">
            <hr className="border-slate-600" />
          </li>

          <NavigationItems items={navigation.secondary} onNavigate={onClose} />

          <li role="separator" aria-hidden="true">
            <hr className="border-slate-600" />
          </li>
          <li>
            <button type="button" onClick={onExit} className="min-h-11 px-2 text-red-400 focus-visible:outline-2 focus-visible:outline-red-300">Sair</button>
          </li>
        </ul>
      </nav>
    </>
  )
}
