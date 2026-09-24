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
}

export function AuthenticatedMobileMenu({
  contextLabel,
  contextName,
  isOpen,
  navigation,
  onClose,
}: MobileMenuProps) {
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
        className={`${isOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 h-dvh w-[85%] max-w-sm flex-col overflow-y-auto bg-[#07111C] p-4`}
      >
        <div className="mb-4 flex items-center justify-between">
          <HeaderBrand />
          <button
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
            <Link href={item.href} key={item.label} className="flex min-h-11 items-center px-2">{item.label}</Link>
          ))}

          <li role="separator" aria-hidden="true" className="mt-auto">
            <hr className="border-slate-600" />
          </li>

          {navigation.secondary.map((item) => (
            <Link href={item.href} key={item.label} className="flex min-h-11 items-center px-2">{item.label}</Link>
          ))}

          <li role="separator" aria-hidden="true">
            <hr className="border-slate-600" />
          </li>
          <li>
            <button type="button" className="min-h-11 px-2 text-red-400">Sair</button>
          </li>
        </ul>
      </nav>
    </>
  )
}
