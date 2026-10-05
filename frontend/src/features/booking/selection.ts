import { demoProfessionals, demoSlots } from "./demo-data"
import type { BookingDemoData, BookingSelection, DemoScenario } from "./types"

export const emptySelection: BookingSelection = { service: "", professional: "", date: "", slot: "" }

/** Trocas invalidam todas as escolhas posteriores; voltar de etapa não muda a seleção. */
export function changeSelection(current: BookingSelection, field: keyof BookingSelection, value: string): BookingSelection {
  if (current[field] === value) return current
  switch (field) {
    case "service": return { service: value, professional: "", date: "", slot: "" }
    case "professional": return { ...current, professional: value, date: "", slot: "" }
    case "date": return { ...current, date: value, slot: "" }
    case "slot": return { ...current, slot: value }
  }
}

/** Retorna a primeira etapa inválida, inclusive se uma opção deixou de existir no exemplo. */
export function firstInvalidStep(data: BookingDemoData, selection: BookingSelection, scenario: DemoScenario, unavailableExample: BookingSelection | null = null): number | null {
  if (scenario === "no-services" || !data.services.some((item) => item.key === selection.service)) return 0
  if (!demoProfessionals(data, selection.service, scenario).some((item) => item.key === selection.professional)) return 1
  if (!data.dates.some((item) => item.key === selection.date)) return 2
  if (!demoSlots(data, selection, scenario, unavailableExample).includes(selection.slot)) return 3
  return null
}

/** Conflito puramente visual: preserva antecedentes e remove só o horário escolhido. */
export function demonstrateConflict(selection: BookingSelection) {
  return { selection: changeSelection(selection, "slot", ""), unavailableExample: { ...selection } }
}
