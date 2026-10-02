import { catalogFocusClass } from "@/features/barbershop-catalog/styles"

export const publicLoginClass = `inline-flex min-h-11 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-5 text-sm font-semibold text-sky-300 transition-colors hover:border-sky-400 hover:bg-sky-500/20 ${catalogFocusClass}`

export function publicNavigationClass(active: boolean) {
  return `relative flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${catalogFocusClass} ${active ? "bg-sky-500/10 text-sky-300 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-sky-400" : "text-slate-300 hover:bg-[#172535] hover:text-white"}`
}
