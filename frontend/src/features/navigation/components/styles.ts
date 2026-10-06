import { catalogFocusClass } from "@/features/barbershop-catalog/styles"

// Visual da landing: mesma superfície, borda e área de toque em cada composição.
const menuControlBaseClass = `grid size-11 shrink-0 place-items-center rounded-lg border border-[#26384A] transition-colors hover:border-sky-400 hover:bg-[#172535] hover:text-white ${catalogFocusClass}`
export const menuControlClass = `${menuControlBaseClass} text-slate-200`
export const closeMenuControlClass = `${menuControlBaseClass} text-slate-300`
export const headerSurfaceClass = "border-b border-[#26384A] bg-[#07111C]"
export const centeredHeaderClass = "grid min-h-20 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 py-4 [&>a]:justify-self-center lg:[&>a]:justify-self-start"
export const operationalHeaderClass = "grid min-h-20 grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 py-4 min-[360px]:gap-4 [&>a]:justify-self-center [&>a]:text-lg min-[360px]:[&>a]:text-xl sm:[&>a]:text-2xl"
