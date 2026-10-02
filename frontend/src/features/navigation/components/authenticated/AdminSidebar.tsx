"use client"

import { useRouter } from "next/navigation"
import { adminNavigation } from "../../config/admin-navigation"
import { NavigationItems } from "./NavigationItems"

export function AdminSidebar() {
  const router = useRouter()

  return (
    <aside className="hidden min-w-0 border-r border-slate-800 bg-[#0b1a29] admin:block">
      <nav
        id="admin-navigation"
        aria-label="Navegação administrativa"
        className="sticky top-6 max-h-[calc(100dvh-3rem)] overflow-y-auto p-4"
      >
        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Administração</p>
        <ul className="space-y-2 text-sm font-medium text-white">
          <NavigationItems items={adminNavigation.primary} />
          <li role="separator" aria-hidden="true" className="py-2"><hr className="border-slate-800" /></li>
          <NavigationItems items={adminNavigation.secondary} />
          <li role="separator" aria-hidden="true" className="py-2"><hr className="border-slate-800" /></li>
          <li>
            <button type="button" onClick={() => router.push("/")} className="flex min-h-11 w-full items-center rounded-lg px-2 text-red-400 hover:bg-[#102235] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300">Sair</button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
