import { catalogActionClass, catalogFocusClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"

export const profilePanelClass = catalogPanelClass
export const profileFocusClass = catalogFocusClass
export const profileSecondaryActionClass = `inline-flex items-center justify-center gap-2 ${catalogSecondaryActionClass}`
// Reutilizar o padrão aprovado: mesmo azul e texto, inclusive no hover.
export const profileActionClass = `${catalogActionClass} min-h-12 py-3`
