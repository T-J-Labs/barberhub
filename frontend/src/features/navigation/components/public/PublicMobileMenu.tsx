import Link from "next/link"
import { useEffect, useRef } from "react"
import { FiX } from "react-icons/fi"
import { catalogActionClass, catalogFocusClass } from "@/features/barbershop-catalog/styles"
import type { PublicNavigationItem } from "../../types"
import { HeaderBrand } from "../HeaderBrand"
import { publicLoginClass, publicNavigationClass } from "./styles"

type PublicMobileMenuProps = {
  isOpen: boolean
  navigation: readonly PublicNavigationItem[]
  onClose: () => void
  activeHref?: string
}

export function PublicMobileMenu({ isOpen, navigation, onClose, activeHref }: PublicMobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
      closeButtonRef.current?.focus()
    }
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      id="public-navigation"
      aria-label="Menu principal"
      onClose={onClose}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[85%] max-w-sm border-0 border-r border-[#26384A] bg-[#07111C] p-0 text-white backdrop:bg-black/65 backdrop:backdrop-blur-sm"
    >
      <nav aria-label="Navegação principal" className="flex h-full flex-col overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-[#26384A] pb-5 [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-offset-4 [&>a]:focus-visible:outline-sky-400">
          <HeaderBrand />
          <button ref={closeButtonRef} type="button" aria-label="Fechar menu" className={`grid size-11 shrink-0 place-items-center rounded-lg border border-[#26384A] text-slate-300 transition-colors hover:border-sky-400 hover:bg-[#172535] hover:text-white ${catalogFocusClass}`} onClick={onClose}>
            <FiX size={21} aria-hidden="true" />
          </button>
        </div>

        <ul className="space-y-2 py-6">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={item.href === activeHref ? "location" : undefined} className={publicNavigationClass(item.href === activeHref)} onClick={onClose}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto grid shrink-0 gap-3 border-t border-[#26384A] pt-5">
          <Link href="/login" className={publicLoginClass} onClick={onClose}>Entrar</Link>
          <Link href="/register" className={catalogActionClass} onClick={onClose}>Registrar</Link>
        </div>
      </nav>
    </dialog>
  )
}
