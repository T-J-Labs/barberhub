import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { FiX } from "react-icons/fi"
import type { NavigationConfig } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import Link from "next/link"

type MobileMenuProps = {
  contextLabel?: string
  contextName?: string
  isOpen: boolean
  navigation: NavigationConfig
  onClose: () => void
  onExit: () => void
}

export function AuthenticatedMobileMenu({
  contextLabel,
  contextName,
  isOpen,
  navigation,
  onClose,
  onExit,
}: MobileMenuProps) {
  const pathname = usePathname()
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
          className="fixed inset-0 z-40 bg-black/60"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <nav
        id="account-navigation"
        aria-label="Navegação da conta"
        onKeyDown={handleKeyDown}
        className={`${isOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 h-dvh w-[85%] max-w-sm flex-col overflow-y-auto bg-[#07111C] p-4`}
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

          {navigation.primary.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link href={item.href} onClick={onClose} aria-current={pathname === item.href ? "page" : undefined} className={`flex min-h-11 items-center rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-[#65d5ff] ${pathname === item.href ? "bg-[#12344a] text-[#8de1ff]" : "hover:bg-[#102235]"}`}>{item.label}</Link>
              ) : (
                <span className="flex min-h-11 cursor-not-allowed items-center px-2 text-slate-500" aria-disabled="true">
                  {item.label}
                </span>
              )}
            </li>
          ))}

          <li role="separator" aria-hidden="true" className="mt-auto">
            <hr className="border-slate-600" />
          </li>

          {navigation.secondary.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link href={item.href} onClick={onClose} aria-current={pathname === item.href ? "page" : undefined} className={`flex min-h-11 items-center rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-[#65d5ff] ${pathname === item.href ? "bg-[#12344a] text-[#8de1ff]" : "hover:bg-[#102235]"}`}>{item.label}</Link>
              ) : (
                <span className="flex min-h-11 cursor-not-allowed items-center px-2 text-slate-500" aria-disabled="true">
                  {item.label}
                </span>
              )}
            </li>
          ))}

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
